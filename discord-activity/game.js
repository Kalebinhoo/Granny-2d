// ==================== DISCORD SDK ====================
const discordSdk = new window.DiscordSDK('1508003195933425765');

let auth;
let participants = new Map();
let myUserId = null;
let myRole = null; // 'player' ou 'granny'

// ==================== CONFIGURAÇÃO DO JOGO ====================
const config = {
    canvas: null,
    ctx: null,
    width: 1000,
    height: 600
};

// ==================== ESTADO DO JOGO ====================
const gameState = {
    isPlaying: false,
    isPaused: false,
    keys: {},
    currentDay: 1,
    maxDays: 5,
    difficulty: 'normal',
    currentRoom: 'bedroom',
    isHiding: false,
    hideTimer: 0,
    knockoutTimer: 0,
    isKnockedOut: false,
    isMultiplayer: true
};

// ==================== JOGADOR ====================
const player = {
    x: 200,
    y: 400,
    width: 30,
    height: 50,
    speed: 4,
    inventory: [null, null, null],
    currentSlot: 0,
    color: '#4a90e2',
    userId: null
};

// ==================== GRANNY (CONTROLADA POR JOGADOR) ====================
const granny = {
    x: 700,
    y: 400,
    width: 35,
    height: 60,
    speed: 3,
    currentRoom: 'kitchen',
    color: '#8b7355',
    userId: null
};

// ==================== SALAS ====================
const rooms = {
    bedroom: {
        name: 'QUARTO INICIAL',
        width: 1000,
        height: 600,
        color: '#2a1a1a',
        floor: 540,
        objects: [],
        doors: [],
        connections: {}
    },
    hallway: {
        name: 'CORREDOR',
        width: 1000,
        height: 600,
        color: '#1a1515',
        floor: 540,
        objects: [],
        doors: [],
        connections: {}
    },
    kitchen: {
        name: 'COZINHA',
        width: 1000,
        height: 600,
        color: '#1f1a1a',
        floor: 540,
        objects: [],
        doors: [],
        connections: {}
    },
    basement: {
        name: 'PORÃO',
        width: 1000,
        height: 600,
        color: '#0d0d0d',
        floor: 540,
        objects: [],
        doors: [],
        connections: {}
    },
    garage: {
        name: 'GARAGEM',
        width: 1000,
        height: 600,
        color: '#1a1a1f',
        floor: 540,
        objects: [],
        doors: [],
        connections: {}
    }
};

// ==================== TIPOS DE OBJETOS ====================
const objectTypes = {
    bed: { width: 250, height: 80, color: '#654321', canHide: true, hideType: 'under' },
    wardrobe: { width: 80, height: 120, color: '#4a3520', canHide: true, hideType: 'inside' },
    door: { width: 60, height: 100, color: '#8b4513', locked: true },
    key: { width: 20, height: 20, color: '#ffd700', pickable: true },
    masterKey: { width: 20, height: 20, color: '#ff6600', pickable: true },
    exitDoor: { width: 80, height: 120, color: '#00aa00', locked: true, isExit: true }
};

// ==================== INICIALIZAÇÃO DISCORD ====================
async function initDiscord() {
    try {
        // Autenticar com Discord
        await discordSdk.ready();
        
        const { code } = await discordSdk.commands.authorize({
            client_id: '1508003195933425765',
            response_type: 'code',
            state: '',
            prompt: 'none',
            scope: ['identify', 'guilds']
        });
        
        // Trocar código por token de acesso
        const response = await fetch('/.proxy/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });
        
        const { access_token } = await response.json();
        auth = await discordSdk.commands.authenticate({ access_token });
        
        if (auth == null) {
            throw new Error('Authenticate command failed');
        }
        
        myUserId = auth.user.id;
        
        // Subscrever a eventos de participantes
        discordSdk.subscribe('ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE', updateParticipants);
        
        // Inicializar jogo
        await init();
        
    } catch (error) {
        console.error('Erro ao inicializar Discord SDK:', error);
        // Modo offline para testes
        await init();
    }
}

function updateParticipants(data) {
    participants = new Map(data.participants.map(p => [p.id, p]));
    updatePlayersWaiting();
    assignRoles();
}

function assignRoles() {
    const playersList = Array.from(participants.keys());
    
    if (playersList.length >= 2) {
        // Primeiro jogador é o sobrevivente
        player.userId = playersList[0];
        // Segundo jogador é a Granny
        granny.userId = playersList[1];
        
        // Determinar meu papel
        if (myUserId === player.userId) {
            myRole = 'player';
        } else if (myUserId === granny.userId) {
            myRole = 'granny';
        } else {
            myRole = 'spectator';
        }
        
        console.log('Papéis atribuídos:', { myRole, myUserId });
    }
}

function updatePlayersWaiting() {
    const container = document.getElementById('players-waiting');
    container.innerHTML = '';
    
    participants.forEach((participant, id) => {
        const div = document.createElement('div');
        div.className = 'player-indicator';
        div.textContent = participant.username || 'Jogador';
        container.appendChild(div);
    });
    
    if (participants.size >= 2) {
        document.getElementById('discord-info').innerHTML = `
            <p>✅ 2 jogadores conectados!</p>
            <p>Jogador 1: Sobrevivente | Jogador 2: Granny</p>
        `;
    } else {
        document.getElementById('discord-info').innerHTML = `
            <p>Aguardando mais ${2 - participants.size} jogador(es)...</p>
        `;
    }
}

// ==================== SINCRONIZAÇÃO MULTIPLAYER ====================
function sendGameState() {
    if (!discordSdk) return;
    
    const state = {
        player: {
            x: player.x,
            y: player.y,
            currentRoom: gameState.currentRoom,
            inventory: player.inventory,
            isHiding: gameState.isHiding
        },
        granny: {
            x: granny.x,
            y: granny.y,
            currentRoom: granny.currentRoom
        },
        rooms: rooms,
        currentDay: gameState.currentDay
    };
    
    // Enviar estado via Discord SDK
    discordSdk.commands.setActivity({
        activity: {
            type: 0,
            details: `Dia ${gameState.currentDay}/5`,
            state: myRole === 'player' ? 'Fugindo da Granny' : 'Caçando o sobrevivente',
            instance: true
        }
    });
}

// ==================== INICIALIZAÇÃO ====================
async function init() {
    config.canvas = document.getElementById('game-canvas');
    config.ctx = config.canvas.getContext('2d');
    config.canvas.width = config.width;
    config.canvas.height = config.height;
    
    setupEventListeners();
    createRooms();
    
    // Remover tela de loading
    showScreen('menu-screen');
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    document.getElementById('start-btn').addEventListener('click', () => {
        if (participants.size >= 2) {
            showScreen('difficulty-screen');
        } else {
            alert('Aguarde 2 jogadores para começar!');
        }
    });
    
    document.getElementById('instructions-btn').addEventListener('click', showInstructions);
    document.getElementById('back-btn').addEventListener('click', showMenu);
    document.getElementById('back-difficulty-btn').addEventListener('click', showMenu);
    document.getElementById('retry-btn').addEventListener('click', startGame);
    document.getElementById('menu-btn').addEventListener('click', showMenu);
    document.getElementById('play-again-btn').addEventListener('click', () => {
        showScreen('difficulty-screen');
    });
    document.getElementById('menu-btn-win').addEventListener('click', showMenu);
    
    document.querySelectorAll('.difficulty-select').forEach(btn => {
        btn.addEventListener('click', (e) => {
            gameState.difficulty = e.target.dataset.difficulty;
            startGame();
        });
    });
    
    // Controles do teclado
    document.addEventListener('keydown', (e) => {
        gameState.keys[e.key.toLowerCase()] = true;
        
        if (e.key.toLowerCase() === 'e' && myRole === 'player') {
            handleInteraction();
        }
        
        if (e.key.toLowerCase() === 'q' && myRole === 'player') {
            dropItem();
        }
        
        if (myRole === 'player') {
            if (e.key === '1') player.currentSlot = 0;
            if (e.key === '2') player.currentSlot = 1;
            if (e.key === '3') player.currentSlot = 2;
            updateInventoryUI();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        gameState.keys[e.key.toLowerCase()] = false;
    });
}

// ==================== GERENCIAMENTO DE TELAS ====================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showMenu() {
    showScreen('menu-screen');
    gameState.isPlaying = false;
}

function showInstructions() {
    showScreen('instructions-screen');
}

function startGame() {
    if (participants.size < 2) {
        alert('Aguarde 2 jogadores para começar!');
        return;
    }
    
    showScreen('game-screen');
    resetGame();
    gameState.isPlaying = true;
    gameLoop();
}

function gameOver(reason) {
    gameState.isPlaying = false;
    document.getElementById('game-over-reason').textContent = reason || 'Você não conseguiu escapar a tempo!';
    showScreen('game-over-screen');
}

function winGame() {
    gameState.isPlaying = false;
    document.getElementById('final-stats').textContent = 
        `O sobrevivente escapou no dia ${gameState.currentDay} de ${gameState.maxDays}!`;
    showScreen('win-screen');
}

function knockoutPlayer() {
    gameState.isKnockedOut = true;
    gameState.isPlaying = false;
    gameState.knockoutTimer = 180;
    gameState.currentDay++;
    
    if (gameState.currentDay > gameState.maxDays) {
        gameOver('A Granny venceu! O sobrevivente passou 5 dias preso!');
        return;
    }
    
    document.getElementById('days-left').textContent = 
        `Dias restantes: ${gameState.maxDays - gameState.currentDay + 1}`;
    showScreen('knockout-screen');
    
    setTimeout(() => {
        showScreen('game-screen');
        resetPlayerPosition();
        gameState.isKnockedOut = false;
        gameState.isPlaying = true;
        updateHUD();
        gameLoop();
    }, 3000);
}

// ==================== RESET DO JOGO ====================
function resetGame() {
    gameState.currentDay = 1;
    gameState.currentRoom = 'bedroom';
    gameState.isHiding = false;
    gameState.hideTimer = 0;
    gameState.isKnockedOut = false;
    
    player.x = 200;
    player.y = 480;
    player.inventory = [null, null, null];
    player.currentSlot = 0;
    
    granny.currentRoom = 'kitchen';
    granny.x = 700;
    granny.y = 480;
    
    createRooms();
    updateHUD();
}

function resetPlayerPosition() {
    player.x = 200;
    player.y = 480;
    gameState.currentRoom = 'bedroom';
    granny.currentRoom = 'kitchen';
    granny.x = 700;
    granny.y = 480;
}

// ==================== CRIAR SALAS ====================
function createRooms() {
    rooms.bedroom.objects = [
        { type: 'bed', x: 50, y: 460, id: 'bed1' },
        { type: 'wardrobe', x: 350, y: 420, id: 'wardrobe1' },
        { type: 'key', x: 750, y: 520, id: 'bedroomKey', keyFor: 'bedroomDoor' }
    ];
    rooms.bedroom.doors = [
        { type: 'door', x: 920, y: 440, id: 'bedroomDoor', locked: true, leadsTo: 'hallway' }
    ];
    
    rooms.hallway.objects = [
        { type: 'wardrobe', x: 300, y: 420, id: 'wardrobe2' },
        { type: 'key', x: 700, y: 520, id: 'hallwayKey', keyFor: 'hallwayToKitchen' }
    ];
    rooms.hallway.doors = [
        { type: 'door', x: 50, y: 440, id: 'hallwayToBedroom', locked: false, leadsTo: 'bedroom' },
        { type: 'door', x: 450, y: 440, id: 'hallwayToKitchen', locked: true, leadsTo: 'kitchen' },
        { type: 'door', x: 920, y: 440, id: 'hallwayToBasement', locked: true, leadsTo: 'basement' }
    ];
    
    rooms.kitchen.objects = [
        { type: 'key', x: 800, y: 520, id: 'basementKey', keyFor: 'hallwayToBasement' }
    ];
    rooms.kitchen.doors = [
        { type: 'door', x: 50, y: 440, id: 'kitchenToHallway', locked: false, leadsTo: 'hallway' }
    ];
    
    rooms.basement.objects = [
        { type: 'wardrobe', x: 150, y: 420, id: 'wardrobe3' },
        { type: 'masterKey', x: 850, y: 520, id: 'masterKey1' }
    ];
    rooms.basement.doors = [
        { type: 'door', x: 50, y: 440, id: 'basementToHallway', locked: false, leadsTo: 'hallway' },
        { type: 'door', x: 920, y: 440, id: 'basementToGarage', locked: true, leadsTo: 'garage' }
    ];
    
    rooms.garage.objects = [];
    rooms.garage.doors = [
        { type: 'door', x: 50, y: 440, id: 'garageToBasement', locked: false, leadsTo: 'basement' },
        { type: 'exitDoor', x: 880, y: 420, id: 'exitDoor', locked: true, isExit: true }
    ];
}

// ==================== GAME LOOP ====================
function gameLoop() {
    if (!gameState.isPlaying || gameState.isKnockedOut) return;
    
    update();
    render();
    
    requestAnimationFrame(gameLoop);
}

// ==================== UPDATE ====================
function update() {
    // Atualizar movimento baseado no papel do jogador
    if (myRole === 'player') {
        updatePlayerMovement();
    } else if (myRole === 'granny') {
        updateGrannyMovement();
    }
    
    // Verificar colisão (apenas se estiver na mesma sala e não escondido)
    if (granny.currentRoom === gameState.currentRoom && !gameState.isHiding) {
        if (checkCollision(player, granny)) {
            knockoutPlayer();
        }
    }
    
    updateInteractionHint();
    sendGameState();
}

function updatePlayerMovement() {
    if (gameState.isHiding) {
        gameState.hideTimer++;
        return;
    }
    
    let moved = false;
    
    if (gameState.keys['arrowleft'] || gameState.keys['a']) {
        player.x -= player.speed;
        moved = true;
    }
    if (gameState.keys['arrowright'] || gameState.keys['d']) {
        player.x += player.speed;
        moved = true;
    }
    
    // Limites da sala
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > config.width) player.x = config.width - player.width;
    
    const minY = 390;
    if (player.y < minY) player.y = minY;
    if (player.y + player.height > config.height) player.y = config.height - player.height;
    
    if (moved && Math.random() < 0.02) {
        makeNoise(player.x, player.y, 'movimento');
    }
}

function updateGrannyMovement() {
    let moved = false;
    
    // Controles da Granny (WASD ou Setas)
    if (gameState.keys['arrowleft'] || gameState.keys['a']) {
        granny.x -= granny.speed;
        moved = true;
    }
    if (gameState.keys['arrowright'] || gameState.keys['d']) {
        granny.x += granny.speed;
        moved = true;
    }
    if (gameState.keys['arrowup'] || gameState.keys['w']) {
        granny.y -= granny.speed;
        moved = true;
    }
    if (gameState.keys['arrowdown'] || gameState.keys['s']) {
        granny.y += granny.speed;
        moved = true;
    }
    
    // Limites da sala
    if (granny.x < 0) granny.x = 0;
    if (granny.x + granny.width > config.width) granny.x = config.width - granny.width;
    
    const minY = 390;
    if (granny.y < minY) granny.y = minY;
    if (granny.y + granny.height > config.height) granny.y = config.height - granny.height;
}

// ==================== INTERAÇÃO ====================
function handleInteraction() {
    if (myRole !== 'player') return;
    
    if (gameState.isHiding) {
        gameState.isHiding = false;
        gameState.hideTimer = 0;
        return;
    }
    
    const currentRoom = rooms[gameState.currentRoom];
    
    currentRoom.objects.forEach(obj => {
        const objData = objectTypes[obj.type];
        if (checkPlayerNear(obj, objData)) {
            if (objData.pickable) {
                pickupItem(obj);
            } else if (objData.canHide) {
                hidePlayer();
            }
        }
    });
    
    currentRoom.doors.forEach(door => {
        const doorData = objectTypes[door.type];
        if (checkPlayerNear(door, doorData)) {
            useDoor(door);
        }
    });
}

function pickupItem(obj) {
    for (let i = 0; i < player.inventory.length; i++) {
        if (player.inventory[i] === null) {
            player.inventory[i] = obj.id;
            
            const currentRoom = rooms[gameState.currentRoom];
            currentRoom.objects = currentRoom.objects.filter(o => o.id !== obj.id);
            
            updateInventoryUI();
            makeNoise(player.x, player.y, 'pegar item');
            return;
        }
    }
}

function dropItem() {
    if (myRole !== 'player') return;
    
    if (player.inventory[player.currentSlot] !== null) {
        const itemId = player.inventory[player.currentSlot];
        player.inventory[player.currentSlot] = null;
        
        const currentRoom = rooms[gameState.currentRoom];
        let itemType = itemId.includes('masterKey') ? 'masterKey' : 'key';
        
        currentRoom.objects.push({
            type: itemType,
            x: player.x + 40,
            y: player.y + 20,
            id: itemId
        });
        
        updateInventoryUI();
    }
}

function hidePlayer() {
    gameState.isHiding = true;
    gameState.hideTimer = 0;
}

function useDoor(door) {
    if (door.locked) {
        const keyId = door.keyFor || door.id.replace('Door', 'Key');
        
        if (door.isExit) {
            if (player.inventory.includes('masterKey1')) {
                winGame();
            } else {
                makeNoise(player.x, player.y, 'porta trancada');
            }
        } else if (player.inventory.includes(keyId)) {
            door.locked = false;
            makeNoise(player.x, player.y, 'abrir porta');
        } else {
            makeNoise(player.x, player.y, 'porta trancada');
        }
    } else {
        if (door.leadsTo) {
            gameState.currentRoom = door.leadsTo;
            player.x = door.x < config.width / 2 ? config.width - 150 : 150;
            updateHUD();
            makeNoise(player.x, player.y, 'abrir porta');
        }
    }
}

// ==================== VERIFICAÇÕES ====================
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function checkPlayerNear(obj, objData) {
    const distance = Math.abs(player.x - obj.x);
    return distance < 80;
}

function makeNoise(x, y, type, isLoud = false) {
    const noiseIndicator = document.getElementById('noise-indicator');
    noiseIndicator.classList.remove('hidden');
    
    if (isLoud) {
        noiseIndicator.style.fontSize = '3rem';
        noiseIndicator.style.color = '#ff0000';
        noiseIndicator.textContent = '💥 CRASH!';
    } else {
        noiseIndicator.style.fontSize = '2rem';
        noiseIndicator.style.color = '#fff';
        noiseIndicator.textContent = 'BARULHO!';
    }
    
    setTimeout(() => {
        noiseIndicator.classList.add('hidden');
    }, 800);
}

function updateInteractionHint() {
    if (myRole !== 'player') {
        document.getElementById('interaction-hint').classList.add('hidden');
        return;
    }
    
    const hint = document.getElementById('interaction-hint');
    
    if (gameState.isHiding) {
        hint.textContent = 'Pressione E para sair';
        hint.classList.remove('hidden');
        return;
    }
    
    hint.textContent = 'Pressione E';
    const currentRoom = rooms[gameState.currentRoom];
    let canInteract = false;
    
    currentRoom.objects.forEach(obj => {
        const objData = objectTypes[obj.type];
        if (checkPlayerNear(obj, objData) && (objData.pickable || objData.canHide)) {
            canInteract = true;
        }
    });
    
    currentRoom.doors.forEach(door => {
        const doorData = objectTypes[door.type];
        if (checkPlayerNear(door, doorData)) {
            canInteract = true;
        }
    });
    
    if (canInteract) {
        hint.classList.remove('hidden');
    } else {
        hint.classList.add('hidden');
    }
}

function updateInventoryUI() {
    document.querySelectorAll('.inventory-slot').forEach((slot, index) => {
        const itemId = player.inventory[index];
        
        if (itemId) {
            if (itemId.includes('masterKey')) {
                slot.textContent = '🔑';
                slot.style.color = '#ff6600';
            } else if (itemId.includes('Key')) {
                slot.textContent = '🔑';
                slot.style.color = '#ffd700';
            }
        } else {
            slot.textContent = '';
        }
        
        if (index === player.currentSlot) {
            slot.classList.add('active');
        } else {
            slot.classList.remove('active');
        }
    });
}

function updateHUD() {
    document.getElementById('room-name').textContent = rooms[gameState.currentRoom].name;
    document.getElementById('day-counter').textContent = `DIA ${gameState.currentDay}/${gameState.maxDays}`;
    updateInventoryUI();
}

// ==================== RENDER ====================
function render() {
    const ctx = config.ctx;
    const currentRoom = rooms[gameState.currentRoom];
    
    // Limpar canvas
    ctx.fillStyle = currentRoom.color;
    ctx.fillRect(0, 0, config.width, config.height);
    
    // Desenhar chão
    ctx.fillStyle = '#1a1010';
    ctx.fillRect(0, currentRoom.floor, config.width, config.height - currentRoom.floor);
    
    // Desenhar objetos
    currentRoom.objects.forEach(obj => {
        const objData = objectTypes[obj.type];
        
        if (obj.type === 'bed') {
            ctx.fillStyle = objData.color;
            ctx.fillRect(obj.x, obj.y, objData.width, objData.height);
            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.fillText('CAMA', obj.x + 100, obj.y + 45);
        } else if (obj.type === 'wardrobe') {
            ctx.fillStyle = objData.color;
            ctx.fillRect(obj.x, obj.y, objData.width, objData.height);
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.fillText('ARMÁRIO', obj.x + 5, obj.y + 65);
        } else if (obj.type === 'key') {
            ctx.fillStyle = objData.color;
            ctx.beginPath();
            ctx.arc(obj.x + 10, obj.y + 10, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.font = '16px Arial';
            ctx.fillText('🔑', obj.x + 2, obj.y + 18);
        } else if (obj.type === 'masterKey') {
            ctx.fillStyle = objData.color;
            ctx.beginPath();
            ctx.arc(obj.x + 10, obj.y + 10, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.font = '16px Arial';
            ctx.fillText('🔑', obj.x + 2, obj.y + 18);
        }
    });
    
    // Desenhar portas
    currentRoom.doors.forEach(door => {
        const doorData = objectTypes[door.type];
        
        if (door.type === 'exitDoor') {
            ctx.fillStyle = door.locked ? '#666' : doorData.color;
            ctx.fillRect(door.x, door.y, doorData.width, doorData.height);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('SAÍDA', door.x + 15, door.y + 65);
        } else {
            ctx.fillStyle = door.locked ? '#666' : doorData.color;
            ctx.fillRect(door.x, door.y, doorData.width, doorData.height);
            
            if (door.locked) {
                ctx.fillStyle = '#ff0000';
                ctx.font = '20px Arial';
                ctx.fillText('🔒', door.x + 20, door.y + 60);
            }
        }
    });
    
    // Desenhar jogador (apenas se estiver na mesma sala)
    if (gameState.currentRoom === gameState.currentRoom) {
        if (!gameState.isHiding) {
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);
            
            // Nome do jogador
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Arial';
            ctx.fillText('VOCÊ', player.x - 5, player.y - 5);
        }
    }
    
    // Desenhar Granny (apenas se estiver na mesma sala)
    if (granny.currentRoom === gameState.currentRoom) {
        ctx.fillStyle = granny.color;
        ctx.fillRect(granny.x, granny.y, granny.width, granny.height);
        
        // Nome da Granny
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('GRANNY', granny.x - 10, granny.y - 5);
    }
    
    // Indicador de papel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, config.height - 40, 200, 30);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    
    if (myRole === 'player') {
        ctx.fillText('🏃 VOCÊ: SOBREVIVENTE', 20, config.height - 18);
    } else if (myRole === 'granny') {
        ctx.fillText('👵 VOCÊ: GRANNY', 20, config.height - 18);
    } else {
        ctx.fillText('👁️ VOCÊ: ESPECTADOR', 20, config.height - 18);
    }
}

// ==================== INICIAR ====================
window.addEventListener('load', () => {
    initDiscord();
});
