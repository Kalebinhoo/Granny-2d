# Granny 2D - Discord Activity (PvP Mode)

## 🎮 Sobre o Jogo

Versão multiplayer PvP do Granny 2D para Discord Activities onde:
- **Jogador 1**: Controla o sobrevivente que tenta escapar
- **Jogador 2**: Controla a Granny e tenta capturar o sobrevivente

## 📋 Configuração

### Application ID
```
1508003195933425765
```

### URL Hospedada
```
https://granny-2d.vercel.app/
```

## 🚀 Como Configurar no Discord Developer Portal

1. Acesse https://discord.com/developers/applications/1508003195933425765
2. Vá em **Activities** no menu lateral
3. Configure:
   - **Activity URL Mappings**: 
     - Root Path: `/`
     - Target: `https://granny-2d.vercel.app`
   
4. Em **OAuth2** > **Redirects**, adicione:
   - `https://granny-2d.vercel.app`

5. Em **OAuth2** > **Scopes**, selecione:
   - `identify`
   - `guilds`
   - `activities.write`

## 📦 Deploy no Vercel

1. Faça upload dos arquivos da pasta `discord-activity` para o Vercel
2. Configure as variáveis de ambiente (se necessário)
3. Deploy!

## 🎯 Como Jogar

### Jogador (Sobrevivente)
- **← → ou A/D**: Mover
- **E**: Interagir (pegar itens, abrir portas, esconder)
- **Q**: Soltar item
- **1, 2, 3**: Selecionar slot do inventário

**Objetivo**: Encontre a chave mestra e escape pela porta da garagem!

### Granny (Caçador)
- **← → ou A/D**: Mover
- **↑ ↓ ou W/S**: Mover verticalmente

**Objetivo**: Capture o sobrevivente antes que ele escape!

## 🔧 Arquivos Necessários

- `index.html` - Interface do jogo
- `style.css` - Estilos
- `game.js` - Lógica do jogo com Discord SDK
- `texture/` - Pasta com as texturas (copiar do jogo original)

## 📝 Notas

- Requer 2 jogadores para iniciar
- O primeiro jogador a entrar é o sobrevivente
- O segundo jogador a entrar é a Granny
- Jogadores adicionais entram como espectadores
