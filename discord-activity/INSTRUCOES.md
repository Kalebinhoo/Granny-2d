# 📋 INSTRUÇÕES PARA COMPLETAR O PROJETO

## ✅ O que já está pronto:
1. ✅ HTML básico (`index.html`)
2. ✅ CSS estilizado (`style.css`)
3. ✅ Início do JavaScript com Discord SDK (`game.js` - INCOMPLETO)
4. ✅ Configuração do Vercel (`vercel.json`)
5. ✅ Application ID: `1508003195933425765`
6. ✅ URL: `https://granny-2d.vercel.app/`

## 🔨 O que você precisa fazer:

### 1. Completar o arquivo `game.js`
O arquivo `game.js` está incompleto. Você precisa adicionar:

- ✅ Funções de gerenciamento de telas (showScreen, showMenu, etc.)
- ✅ Função createRooms() com todas as salas
- ✅ Game loop (gameLoop, update, render)
- ✅ Lógica de movimento do jogador
- ✅ Lógica de movimento da Granny (controlada por jogador 2)
- ✅ Sistema de colisão
- ✅ Sistema de inventário
- ✅ Renderização dos objetos e personagens
- ✅ Sincronização multiplayer via Discord SDK

**DICA**: Copie as funções do arquivo original `../game.js` e adapte para:
- Remover IA da Granny
- Adicionar controles manuais para Granny (WASD ou setas)
- Adicionar sincronização de estado entre jogadores
- Diferenciar controles baseado em `myRole` ('player' ou 'granny')

### 2. Copiar as texturas
```bash
# Copie a pasta texture do jogo original para discord-activity
cp -r ../texture ./texture
```

Ou manualmente:
- Copie a pasta `texture` que está em `Granny 2d/texture`
- Cole dentro de `Granny 2d/discord-activity/texture`

### 3. Configurar no Discord Developer Portal

Acesse: https://discord.com/developers/applications/1508003195933425765

#### Em "Activities":
- URL Mapping: `https://granny-2d.vercel.app`
- Root Path: `/`

#### Em "OAuth2":
- Redirect URLs: `https://granny-2d.vercel.app`
- Scopes: `identify`, `guilds`, `activities.write`

### 4. Deploy no Vercel

Opção A - Via CLI:
```bash
cd discord-activity
vercel --prod
```

Opção B - Via GitHub:
1. Crie um repositório no GitHub
2. Faça push da pasta `discord-activity`
3. Conecte o repositório no Vercel
4. Deploy automático!

### 5. Testar no Discord

1. Abra o Discord (Desktop ou Web)
2. Entre em um servidor de voz
3. Clique em "Atividades" (🎮)
4. Selecione sua aplicação
5. Convide um amigo
6. Joguem!

## 🎮 Diferenças do Jogo Original

### Modo PvP:
- **Jogador 1 (Sobrevivente)**:
  - Controla o personagem azul
  - Objetivo: Escapar
  - Controles: A/D, E, Q, 1-3

- **Jogador 2 (Granny)**:
  - Controla a Granny
  - Objetivo: Capturar o sobrevivente
  - Controles: WASD ou Setas

### Sincronização:
- Posições são sincronizadas em tempo real
- Estado do jogo compartilhado
- Inventário sincronizado
- Portas abertas/fechadas sincronizadas

## 🐛 Troubleshooting

### Erro: "Discord SDK not found"
- Verifique se o script do Discord SDK está carregando
- URL: `https://discord.com/api/v10/applications/1508003195933425765/embedded-sdk.js`

### Erro: "Authenticate command failed"
- Verifique as configurações OAuth2 no Developer Portal
- Certifique-se que os redirects estão corretos

### Jogo não sincroniza
- Verifique o console do navegador
- Implemente a função `sendGameState()` corretamente
- Use WebSockets ou Discord SDK para sincronização

## 📚 Recursos Úteis

- Discord Activities Docs: https://discord.com/developers/docs/activities/overview
- Discord SDK: https://github.com/discord/embedded-app-sdk
- Vercel Docs: https://vercel.com/docs

## 💡 Próximos Passos

1. Complete o `game.js` com todas as funções
2. Teste localmente
3. Deploy no Vercel
4. Configure no Discord Developer Portal
5. Teste com um amigo!

Boa sorte! 🚀
