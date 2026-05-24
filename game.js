// ==================== CONFIGURAÇÃO DO JOGO ====================
const config = {
    canvas: null,
    ctx: null,
    width: 1000,
    height: 600
};

// ==================== IMAGENS ====================
const images = {
    vase: null,
    bed: null,
    table: null,
    floor: null,
    loaded: false
};

// Carregar imagens
function loadImages() {
    return new Promise((resolve) => {
        let loadedCount = 0;
        const totalImages = 4;
        
        const checkAllLoaded = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                images.loaded = true;
                console.log('Todas as imagens carregadas!');
                resolve();
            }
        };
        
        // Carregar vaso
        images.vase = new Image();
        images.vase.onload = () => {
            console.log('Imagem do vaso carregada com sucesso!');
            checkAllLoaded();
        };
        images.vase.onerror = () => {
            console.error('Erro ao carregar imagem do vaso');
            checkAllLoaded();
        };
        images.vase.src = 'texture/texture_item/vaso_cinza.png';
        
        // Carregar cama
        images.bed = new Image();
        images.bed.onload = () => {
            console.log('Imagem da cama carregada com sucesso!');
            checkAllLoaded();
        };
        images.bed.onerror = () => {
            console.error('Erro ao carregar imagem da cama');
            checkAllLoaded();
        };
        images.bed.src = 'texture/texture_movel/bed.png';
        
        // Carregar mesa
        images.table = new Image();
        images.table.onload = () => {
            console.log('Imagem da mesa carregada com sucesso!');
            checkAllLoaded();
        };
        images.table.onerror = () => {
            console.error('Erro ao carregar imagem da mesa');
            checkAllLoaded();
        };
        images.table.src = 'texture/texture_movel/table.png';
        
        // Carregar chão
        images.floor = new Image();
        images.floor.onload = () => {
            console.log('Imagem do chão carregada com sucesso!');
            checkAllLoaded();
        };
        images.floor.onerror = () => {
            console.error('Erro ao carregar imagem do chão');
            checkAllLoaded();
        };
        images.floor.src = 'texture/chao.png';
    });
}

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
    isKnockedOut: false
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
    color: '#4a90e2'
};

// ==================== GRANNY ====================
const granny = {
    x: 700,
    y: 400,
    width: 35,
    height: 60,
    speed: 2.5,
    currentRoom: 'kitchen',
    state: 'patrol', // patrol, chase, investigate, movingToDoor
    targetX: 700,
    targetY: 400,
    targetDoor: null,
    investigateTimer: 0,
    color: '#8b7355',
    hearingRange: 400,
    visionRange: 300,
    patrolPoints: []
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
    hammer: { width: 25, height: 25, color: '#888', pickable: true },
    pliers: { width: 20, height: 20, color: '#666', pickable: true },
    masterKey: { width: 20, height: 20, color: '#ff6600', pickable: true },
    padlock: { width: 30, height: 30, color: '#444', locked: true },
    table: { width: 100, height: 60, color: '#5a4a3a', solid: true },
    chair: { width: 40, height: 60, color: '#4a3a2a', solid: false },
    tableWithVase: { width: 100, height: 100, color: '#5a4a3a', solid: true, hasVase: true, vaseColor: '#888' },
    exitDoor: { width: 80, height: 120, color: '#00aa00', locked: true, isExit: true }
};

// ==================== INICIALIZAÇÃO ====================
async function init() {
    config.canvas = document.getElementById('game-canvas');
    config.ctx = config.canvas.getContext('2d');
    config.canvas.width = config.width;
    config.canvas.height = config.height;
    
    // Carregar imagens
    await loadImages();
    
    setupEventListeners();
    createRooms();
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Botões do menu
    document.getElementById('start-btn').addEventListener('click', () => {
        showScreen('difficulty-screen');
    });
    
    document.getElementById('instructions-btn').addEventListener('click', showInstructions);
    document.getElementById('difficulty-btn').addEventListener('click', () => {
        showScreen('difficulty-screen');
    });
    document.getElementById('back-btn').addEventListener('click', showMenu);
    document.getElementById('back-difficulty-btn').addEventListener('click', showMenu);
    document.getElementById('retry-btn').addEventListener('click', startGame);
    document.getElementById('menu-btn').addEventListener('click', showMenu);
    document.getElementById('play-again-btn').addEventListener('click', () => {
        showScreen('difficulty-screen');
    });
    document.getElementById('menu-btn-win').addEventListener('click', showMenu);
    
    // Seleção de dificuldade
    document.querySelectorAll('.difficulty-select').forEach(btn => {
        btn.addEventListener('click', (e) => {
            gameState.difficulty = e.target.dataset.difficulty;
            startGame();
        });
    });
    
    // Teclado
    document.addEventListener('keydown', (e) => {
        gameState.keys[e.key.toLowerCase()] = true;
        
        // Interação
        if (e.key.toLowerCase() === 'e') {
            handleInteraction();
        }
        
        // Soltar item
        if (e.key.toLowerCase() === 'q') {
            dropItem();
        }
        
        // Selecionar slot do inventário
        if (e.key === '1') player.currentSlot = 0;
        if (e.key === '2') player.currentSlot = 1;
        if (e.key === '3') player.currentSlot = 2;
        
        updateInventoryUI();
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
        `Você escapou no dia ${gameState.currentDay} de ${gameState.maxDays}!`;
    showScreen('win-screen');
}

function knockoutPlayer() {
    gameState.isKnockedOut = true;
    gameState.isPlaying = false; // Parar o jogo
    gameState.knockoutTimer = 180; // 3 segundos
    gameState.currentDay++;
    
    if (gameState.currentDay > gameState.maxDays) {
        gameOver('Você passou 5 dias preso na casa!');
        return;
    }
    
    // Mostrar tela de knockout
    document.getElementById('days-left').textContent = 
        `Dias restantes: ${gameState.maxDays - gameState.currentDay + 1}`;
    showScreen('knockout-screen');
    
    setTimeout(() => {
        showScreen('game-screen');
        resetPlayerPosition();
        gameState.isKnockedOut = false;
        gameState.isPlaying = true; // Reiniciar o jogo
        updateHUD();
        gameLoop(); // Reiniciar o loop
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
    player.y = 400;
    player.inventory = [null, null, null];
    player.currentSlot = 0;
    
    // Granny começa em outra sala (longe do jogador)
    granny.currentRoom = 'kitchen';
    granny.state = 'patrol';
    granny.x = 700;
    granny.y = 400;
    
    // Ajustar dificuldade
    switch(gameState.difficulty) {
        case 'easy':
            granny.speed = 2;
            granny.hearingRange = 300;
            break;
        case 'normal':
            granny.speed = 2.5;
            granny.hearingRange = 400;
            break;
        case 'hard':
            granny.speed = 3;
            granny.hearingRange = 500;
            break;
        case 'extreme':
            granny.speed = 3.5;
            granny.hearingRange = 600;
            break;
    }
    
    createRooms();
    updateHUD();
}

function resetPlayerPosition() {
    player.x = 200;
    player.y = 400;
    gameState.currentRoom = 'bedroom';
    // Granny volta para outra sala
    granny.currentRoom = 'kitchen';
    granny.x = 700;
    granny.y = 400;
    granny.state = 'patrol';
}

// ==================== CRIAR SALAS ====================
function createRooms() {
    // QUARTO INICIAL
    rooms.bedroom.objects = [
        { type: 'bed', x: 50, y: 460, id: 'bed1' },
        { type: 'wardrobe', x: 350, y: 420, id: 'wardrobe1' },
        { type: 'tableWithVase', x: 550, y: 440, id: 'vaseTable1', vaseFallen: false },
        { type: 'key', x: 750, y: 520, id: 'bedroomKey', keyFor: 'bedroomDoor' }
    ];
    rooms.bedroom.doors = [
        { type: 'door', x: 920, y: 440, id: 'bedroomDoor', locked: true, leadsTo: 'hallway' }
    ];
    
    // CORREDOR
    rooms.hallway.objects = [
        { type: 'wardrobe', x: 300, y: 420, id: 'wardrobe2' },
        { type: 'tableWithVase', x: 500, y: 440, id: 'vaseTable2', vaseFallen: false },
        { type: 'hammer', x: 700, y: 520, id: 'hammer1' },
        { type: 'chair', x: 850, y: 480, id: 'chair1' },
        { type: 'tableWithVase', x: 150, y: 440, id: 'vaseTable3', vaseFallen: false }
    ];
    rooms.hallway.doors = [
        { type: 'door', x: 50, y: 440, id: 'hallwayToBedroom', locked: false, leadsTo: 'bedroom' },
        { type: 'door', x: 450, y: 440, id: 'hallwayToKitchen', locked: true, leadsTo: 'kitchen' },
        { type: 'door', x: 920, y: 440, id: 'hallwayToBasement', locked: true, leadsTo: 'basement' }
    ];
    
    // COZINHA
    rooms.kitchen.objects = [
        { type: 'table', x: 200, y: 480, id: 'table3' },
        { type: 'chair', x: 150, y: 480, id: 'chair2' },
        { type: 'chair', x: 300, y: 480, id: 'chair3' },
        { type: 'tableWithVase', x: 450, y: 440, id: 'vaseTable4', vaseFallen: false },
        { type: 'pliers', x: 650, y: 520, id: 'pliers1' },
        { type: 'key', x: 800, y: 520, id: 'basementKey', keyFor: 'hallwayToBasement' }
    ];
    rooms.kitchen.doors = [
        { type: 'door', x: 50, y: 440, id: 'kitchenToHallway', locked: false, leadsTo: 'hallway' }
    ];
    
    // PORÃO
    rooms.basement.objects = [
        { type: 'wardrobe', x: 150, y: 420, id: 'wardrobe3' },
        { type: 'tableWithVase', x: 350, y: 440, id: 'vaseTable5', vaseFallen: false },
        { type: 'table', x: 600, y: 480, id: 'table4' },
        { type: 'masterKey', x: 850, y: 520, id: 'masterKey1' },
        { type: 'padlock', x: 700, y: 480, id: 'padlock1', locked: true }
    ];
    rooms.basement.doors = [
        { type: 'door', x: 50, y: 440, id: 'basementToHallway', locked: false, leadsTo: 'hallway' },
        { type: 'door', x: 920, y: 440, id: 'basementToGarage', locked: true, leadsTo: 'garage' }
    ];
    
    // GARAGEM (SAÍDA)
    rooms.garage.objects = [
        { type: 'table', x: 300, y: 480, id: 'table5' },
        { type: 'tableWithVase', x: 500, y: 440, id: 'vaseTable6', vaseFallen: false },
        { type: 'chair', x: 700, y: 480, id: 'chair4' }
    ];
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
    // Atualizar Granny SEMPRE (mesmo quando escondido)
    updateGranny();
    
    // Verificar colisão com Granny (SOMENTE se estiver na mesma sala e NÃO escondido)
    if (granny.currentRoom === gameState.currentRoom && !gameState.isHiding) {
        if (checkCollision(player, granny)) {
            knockoutPlayer();
        }
    }
    
    if (gameState.isHiding) {
        gameState.hideTimer++;
        // Não força mais a sair automaticamente - jogador controla quando sair
        updateInteractionHint(); // Atualizar hint mesmo escondido
        return; // Não atualiza movimento do jogador enquanto escondido
    }
    
    // Movimento do jogador
    let moved = false;
    const oldX = player.x;
    const oldY = player.y;
    
    if (gameState.keys['arrowleft'] || gameState.keys['a']) {
        player.x -= player.speed;
        moved = true;
    }
    if (gameState.keys['arrowright'] || gameState.keys['d']) {
        player.x += player.speed;
        moved = true;
    }
    
    // Verificar colisão com vasos
    checkVaseCollision(oldX);
    
    // Limites da sala (paredes) - mais restritivos
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > config.width) {
        player.x = config.width - player.width;
    }
    
    // Limitar movimento vertical - NÃO PODE SUBIR (ir para trás)
    const minY = 390; // Não pode subir acima desta linha
    if (player.y < minY) {
        player.y = minY;
    }
    if (player.y + player.height > config.height) {
        player.y = config.height - player.height;
    }
    
    // Fazer barulho ao se mover
    if (moved && Math.random() < 0.02) {
        makeNoise(player.x, player.y, 'movimento');
    }
    
    // Atualizar hint de interação
    updateInteractionHint();
}

// ==================== UPDATE GRANNY ====================
function updateGranny() {
    const currentRoom = rooms[granny.currentRoom];
    
    switch(granny.state) {
        case 'patrol':
            // Patrulhar aleatoriamente
            if (Math.abs(granny.x - granny.targetX) < 10) {
                granny.targetX = Math.random() * (config.width - 100) + 50;
            }
            
            if (granny.x < granny.targetX) {
                granny.x += granny.speed * 0.5;
            } else {
                granny.x -= granny.speed * 0.5;
            }
            
            // Mudar de sala através da porta
            if (Math.random() < 0.003) {
                const doors = currentRoom.doors.filter(d => !d.locked && d.leadsTo);
                if (doors.length > 0) {
                    const randomDoor = doors[Math.floor(Math.random() * doors.length)];
                    granny.state = 'movingToDoor';
                    granny.targetDoor = randomDoor;
                    granny.targetX = randomDoor.x;
                }
            }
            break;
        
        case 'movingToDoor':
            // Mover até a porta
            if (granny.x < granny.targetX) {
                granny.x += granny.speed * 0.7;
            } else {
                granny.x -= granny.speed * 0.7;
            }
            
            // Quando chegar perto da porta, mudar de sala
            if (Math.abs(granny.x - granny.targetX) < 20) {
                granny.currentRoom = granny.targetDoor.leadsTo;
                // Aparecer na porta correspondente da nova sala
                const newRoom = rooms[granny.currentRoom];
                const entryDoor = newRoom.doors.find(d => d.leadsTo === granny.targetDoor.leadsTo || !d.leadsTo);
                if (entryDoor) {
                    granny.x = entryDoor.x;
                } else {
                    granny.x = granny.targetX < config.width / 2 ? config.width - 100 : 100;
                }
                granny.state = 'patrol';
                granny.targetDoor = null;
            }
            break;
            
        case 'chase':
            // Perseguir jogador (SOMENTE se estiver na mesma sala)
            if (granny.currentRoom === gameState.currentRoom) {
                if (granny.x < player.x) {
                    granny.x += granny.speed;
                } else {
                    granny.x -= granny.speed;
                }
                
                // Voltar para patrulha se perder o jogador
                if (Math.abs(granny.x - player.x) > granny.visionRange) {
                    granny.state = 'investigate';
                    granny.investigateTimer = 300;
                }
            } else {
                // Se não estiver na mesma sala, tentar ir para a sala do jogador
                const doors = currentRoom.doors.filter(d => !d.locked && d.leadsTo);
                if (doors.length > 0) {
                    // Escolher uma porta aleatória para procurar o jogador
                    const randomDoor = doors[Math.floor(Math.random() * doors.length)];
                    granny.state = 'movingToDoor';
                    granny.targetDoor = randomDoor;
                    granny.targetX = randomDoor.x;
                } else {
                    granny.state = 'investigate';
                    granny.investigateTimer = 200;
                }
            }
            break;
            
        case 'investigate':
            // Investigar área
            granny.investigateTimer--;
            
            if (granny.investigateTimer <= 0) {
                granny.state = 'patrol';
            }
            
            // Mover para posição de investigação
            if (Math.abs(granny.x - granny.targetX) < 10) {
                granny.targetX = Math.random() * (config.width - 100) + 50;
            }
            
            if (granny.x < granny.targetX) {
                granny.x += granny.speed * 0.7;
            } else {
                granny.x -= granny.speed * 0.7;
            }
            break;
    }
}

// ==================== VERIFICAR COLISÃO COM VASOS ====================
function checkVaseCollision(oldX) {
    const currentRoom = rooms[gameState.currentRoom];
    
    currentRoom.objects.forEach(obj => {
        if (obj.type === 'tableWithVase' && !obj.vaseFallen) {
            const objData = objectTypes[obj.type];
            
            // Verificar se o jogador colidiu com a mesa
            if (checkCollision(player, { x: obj.x, y: obj.y, width: objData.width, height: objData.height })) {
                // Vaso cai no chão
                obj.vaseFallen = true;
                obj.vaseX = obj.x + objData.width / 2 - 15;
                obj.vaseY = 570; // Posição no chão
                
                // Fazer MUITO barulho!
                makeNoise(obj.x, obj.y, 'vaso caiu', true);
                
                // Empurrar o jogador para trás
                player.x = oldX;
            }
        }
    });
}

// ==================== FAZER BARULHO ====================
function makeNoise(x, y, type, isLoud = false) {
    // Mostrar indicador de barulho
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
    
    // Granny ouve o barulho
    const distance = Math.sqrt(Math.pow(granny.x - x, 2) + Math.pow(granny.y - y, 2));
    const hearingMultiplier = isLoud ? 2 : 1; // Vasos fazem barulho 2x mais alto
    
    if (distance < granny.hearingRange * hearingMultiplier) {
        // Se estiver na mesma sala
        if (granny.currentRoom === gameState.currentRoom) {
            granny.state = 'investigate';
            granny.targetX = x;
            granny.investigateTimer = isLoud ? 400 : 200;
            
            // Se estiver muito perto, perseguir imediatamente
            if (distance < 300 || isLoud) {
                granny.state = 'chase';
            }
        } else {
            // Se estiver em outra sala, ir até a porta para investigar
            const currentRoom = rooms[granny.currentRoom];
            const doors = currentRoom.doors.filter(d => !d.locked && d.leadsTo);
            
            if (doors.length > 0) {
                // Escolher a porta mais próxima ou uma aleatória
                const targetDoor = doors[Math.floor(Math.random() * doors.length)];
                granny.state = 'movingToDoor';
                granny.targetDoor = targetDoor;
                granny.targetX = targetDoor.x;
            } else {
                // Se não houver portas, apenas investigar na sala atual
                granny.state = 'investigate';
                granny.investigateTimer = 200;
            }
        }
    }
}

// ==================== INTERAÇÃO ====================
function handleInteraction() {
    // Se estiver escondido, sair do esconderijo
    if (gameState.isHiding) {
        gameState.isHiding = false;
        gameState.hideTimer = 0;
        return;
    }
    
    const currentRoom = rooms[gameState.currentRoom];
    
    // Verificar objetos
    currentRoom.objects.forEach(obj => {
        const objData = objectTypes[obj.type];
        if (checkPlayerNear(obj, objData)) {
            // Pegar item
            if (objData.pickable) {
                pickupItem(obj);
            }
            // Esconder
            else if (objData.canHide) {
                hidePlayer();
            }
        }
    });
    
    // Verificar portas
    currentRoom.doors.forEach(door => {
        const doorData = objectTypes[door.type];
        if (checkPlayerNear(door, doorData)) {
            useDoor(door);
        }
    });
}

function pickupItem(obj) {
    // Adicionar ao inventário
    for (let i = 0; i < player.inventory.length; i++) {
        if (player.inventory[i] === null) {
            player.inventory[i] = obj.id;
            
            // Remover do mundo
            const currentRoom = rooms[gameState.currentRoom];
            currentRoom.objects = currentRoom.objects.filter(o => o.id !== obj.id);
            
            updateInventoryUI();
            makeNoise(player.x, player.y, 'pegar item');
            return;
        }
    }
}

function dropItem() {
    if (player.inventory[player.currentSlot] !== null) {
        const itemId = player.inventory[player.currentSlot];
        player.inventory[player.currentSlot] = null;
        
        // Adicionar de volta ao mundo
        const currentRoom = rooms[gameState.currentRoom];
        // Encontrar tipo do item pelo ID
        let itemType = itemId.includes('Key') ? 'key' : 
                      itemId.includes('hammer') ? 'hammer' : 
                      itemId.includes('pliers') ? 'pliers' : 
                      itemId.includes('masterKey') ? 'masterKey' : 'key';
        
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
    granny.state = 'patrol';
}

function useDoor(door) {
    if (door.locked) {
        // Verificar se tem chave
        const keyId = door.keyFor || door.id.replace('Door', 'Key');
        
        if (door.isExit) {
            // Porta de saída precisa de chave mestra
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
        // Mudar de sala
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

function updateInteractionHint() {
    const hint = document.getElementById('interaction-hint');
    
    // Se estiver escondido, mostrar hint para sair
    if (gameState.isHiding) {
        hint.textContent = 'Pressione E para sair';
        hint.classList.remove('hidden');
        return;
    }
    
    hint.textContent = 'Pressione E';
    const currentRoom = rooms[gameState.currentRoom];
    let canInteract = false;
    
    // Verificar objetos
    currentRoom.objects.forEach(obj => {
        const objData = objectTypes[obj.type];
        if (checkPlayerNear(obj, objData) && (objData.pickable || objData.canHide)) {
            canInteract = true;
        }
    });
    
    // Verificar portas
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

// ==================== RENDER ====================
function render() {
    const ctx = config.ctx;
    const currentRoom = rooms[gameState.currentRoom];
    
    // Limpar canvas
    ctx.fillStyle = currentRoom.color;
    ctx.fillRect(0, 0, config.width, config.height);
    
    // Desenhar chão
    if (gameState.currentRoom === 'bedroom' && images.loaded && images.floor && images.floor.complete) {
        // Usar textura do chão para o quarto inicial
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Criar padrão repetido da textura
        const pattern = ctx.createPattern(images.floor, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(0, currentRoom.floor, config.width, config.height - currentRoom.floor);
    } else {
        // Chão padrão para outras salas
        ctx.fillStyle = '#1a1010';
        ctx.fillRect(0, currentRoom.floor, config.width, config.height - currentRoom.floor);
    }
    
    // Desenhar objetos
    currentRoom.objects.forEach(obj => {
        const objData = objectTypes[obj.type];
        
        // Desenhar cama com textura
        if (obj.type === 'bed') {
            if (images.loaded && images.bed && images.bed.complete) {
                // Usar textura da cama
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(images.bed, obj.x, obj.y, objData.width, objData.height);
            } else {
                // Fallback: desenhar cama com cor
                ctx.fillStyle = objData.color;
                ctx.fillRect(obj.x, obj.y, objData.width, objData.height);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.strokeRect(obj.x, obj.y, objData.width, objData.height);
            }
        }
        // Desenhar mesa com vaso
        else if (obj.type === 'tableWithVase') {
            // Mesa com textura (aumentada)
            if (images.loaded && images.table && images.table.complete) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                // Desenhar mesa maior: largura 100, altura 60
                ctx.drawImage(images.table, obj.x, obj.y + 40, objData.width, 60);
            } else {
                // Fallback: mesa com cor
                ctx.fillStyle = objData.color;
                ctx.fillRect(obj.x, obj.y + 40, objData.width, 60);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.strokeRect(obj.x, obj.y + 40, objData.width, 60);
            }
            
            // Vaso (se não tiver caído)
            if (!obj.vaseFallen) {
                // Vaso na mesa
                if (images.loaded && images.vase && images.vase.complete) {
                    const originalWidth = images.vase.width;
                    const originalHeight = images.vase.height;
                    const aspectRatio = originalWidth / originalHeight;
                    
                    const vaseHeight = 70;
                    const vaseWidth = vaseHeight * aspectRatio;
                    
                    const vaseX = obj.x + objData.width / 2 - vaseWidth / 2;
                    const vaseY = obj.y - 20;
                    
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(images.vase, vaseX, vaseY, vaseWidth, vaseHeight);
                } else {
                    // Fallback: desenhar vaso com código
                    const fallbackX = obj.x + objData.width / 2 - 15;
                    const fallbackY = obj.y;
                    
                    // Base do vaso
                    ctx.fillStyle = '#888';
                    ctx.beginPath();
                    ctx.moveTo(fallbackX + 15, fallbackY + 35);
                    ctx.lineTo(fallbackX + 22, fallbackY + 40);
                    ctx.lineTo(fallbackX + 8, fallbackY + 40);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Corpo do vaso com padrão
                    ctx.fillStyle = '#aaa';
                    ctx.beginPath();
                    ctx.moveTo(fallbackX + 8, fallbackY + 40);
                    ctx.lineTo(fallbackX + 10, fallbackY + 20);
                    ctx.lineTo(fallbackX + 20, fallbackY + 20);
                    ctx.lineTo(fallbackX + 22, fallbackY + 40);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Padrão listrado (preto e branco)
                    ctx.strokeStyle = '#333';
                    ctx.lineWidth = 2;
                    for (let i = 0; i < 4; i++) {
                        ctx.beginPath();
                        ctx.moveTo(fallbackX + 10, fallbackY + 22 + i * 4);
                        ctx.lineTo(fallbackX + 20, fallbackY + 22 + i * 4);
                        ctx.stroke();
                    }
                    
                    // Gargalo do vaso
                    ctx.fillStyle = '#888';
                    ctx.beginPath();
                    ctx.moveTo(fallbackX + 10, fallbackY + 20);
                    ctx.lineTo(fallbackX + 12, fallbackY + 5);
                    ctx.lineTo(fallbackX + 18, fallbackY + 5);
                    ctx.lineTo(fallbackX + 20, fallbackY + 20);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Borda do vaso
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(fallbackX + 12, fallbackY + 5);
                    ctx.lineTo(fallbackX + 10, fallbackY + 20);
                    ctx.lineTo(fallbackX + 8, fallbackY + 40);
                    ctx.lineTo(fallbackX + 22, fallbackY + 40);
                    ctx.lineTo(fallbackX + 20, fallbackY + 20);
                    ctx.lineTo(fallbackX + 18, fallbackY + 5);
                    ctx.closePath();
                    ctx.stroke();
                }
            } else {
                // Vaso caído no chão
                if (images.loaded && images.vase && images.vase.complete) {
                    const originalWidth = images.vase.width;
                    const originalHeight = images.vase.height;
                    const aspectRatio = originalWidth / originalHeight;
                    
                    // Vaso deitado (rotacionado)
                    const vaseHeight = 40;
                    const vaseWidth = vaseHeight * aspectRatio;
                    
                    ctx.save();
                    ctx.translate(obj.vaseX + vaseWidth / 2, obj.vaseY + vaseHeight / 2);
                    ctx.rotate(Math.PI / 2); // 90 graus
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(images.vase, -vaseWidth / 2, -vaseHeight / 2, vaseWidth, vaseHeight);
                    ctx.restore();
                } else {
                    // Fallback: vaso caído desenhado
                    ctx.fillStyle = '#888';
                    ctx.fillRect(obj.vaseX, obj.vaseY, 50, 20);
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(obj.vaseX, obj.vaseY, 50, 20);
                }
            }
        } else {
            // Outros objetos normais
            ctx.fillStyle = objData.color;
            ctx.fillRect(obj.x, obj.y, objData.width, objData.height);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(obj.x, obj.y, objData.width, objData.height);
            
            // Label para itens pegáveis
            if (objData.pickable) {
                ctx.fillStyle = '#fff';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(obj.type.toUpperCase(), obj.x + objData.width/2, obj.y - 5);
            }
        }
    });
    
    // Desenhar portas
    currentRoom.doors.forEach(door => {
        const doorData = objectTypes[door.type];
        ctx.fillStyle = door.locked ? doorData.color : '#4d7c0f';
        ctx.fillRect(door.x, door.y, doorData.width, doorData.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeRect(door.x, door.y, doorData.width, doorData.height);
        
        // Indicador de trancado
        if (door.locked) {
            ctx.fillStyle = '#ff0000';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🔒', door.x + doorData.width/2, door.y + doorData.height/2);
        }
        
        // Label de saída
        if (door.isExit) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('SAÍDA', door.x + doorData.width/2, door.y - 10);
        }
    });
    
    // Desenhar jogador (se não estiver escondido)
    if (!gameState.isHiding) {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.strokeStyle = '#2a5a8a';
        ctx.lineWidth = 2;
        ctx.strokeRect(player.x, player.y, player.width, player.height);
    }
    
    // Desenhar Granny (SOMENTE se estiver na mesma sala)
    if (granny.currentRoom === gameState.currentRoom) {
        ctx.fillStyle = granny.state === 'chase' ? '#ff0000' : granny.color;
        ctx.fillRect(granny.x, granny.y, granny.width, granny.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(granny.x, granny.y, granny.width, granny.height);
        
        // Olhos da Granny
        ctx.fillStyle = granny.state === 'chase' ? '#ff0000' : '#fff';
        ctx.fillRect(granny.x + 8, granny.y + 15, 8, 8);
        ctx.fillRect(granny.x + 20, granny.y + 15, 8, 8);
    }
    
    // Debug: mostrar em qual sala a Granny está (remover depois)
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText(`Granny: ${granny.currentRoom} | Player: ${gameState.currentRoom}`, 10, 20);
}

// ==================== HUD ====================
function updateHUD() {
    document.getElementById('day').textContent = gameState.currentDay;
    document.getElementById('room-name').textContent = rooms[gameState.currentRoom].name;
    updateInventoryUI();
}

function updateInventoryUI() {
    for (let i = 0; i < 3; i++) {
        const slot = document.getElementById(`slot-${i + 1}`);
        const itemSpan = slot.querySelector('.slot-item');
        
        if (player.inventory[i]) {
            const itemName = player.inventory[i].replace(/[0-9]/g, '').toUpperCase();
            itemSpan.textContent = itemName;
        } else {
            itemSpan.textContent = '';
        }
        
        if (i === player.currentSlot) {
            slot.classList.add('active');
        } else {
            slot.classList.remove('active');
        }
    }
}

// ==================== INICIAR ====================
window.addEventListener('load', init);
