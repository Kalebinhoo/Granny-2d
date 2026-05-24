# 🚀 GUIA DE DEPLOY RÁPIDO

## ✅ Pré-requisitos
- Conta no Vercel (https://vercel.com)
- Conta no Discord Developer Portal
- Application ID: `1508003195933425765`

## 📦 Passo 1: Deploy no Vercel

### Opção A: Via Vercel CLI (Recomendado)

1. Instale o Vercel CLI:
```bash
npm install -g vercel
```

2. Entre na pasta do projeto:
```bash
cd discord-activity
```

3. Faça login no Vercel:
```bash
vercel login
```

4. Deploy:
```bash
vercel --prod
```

5. Anote a URL gerada (ex: `https://granny-2d-xxx.vercel.app`)

### Opção B: Via Interface Web do Vercel

1. Acesse https://vercel.com/new
2. Conecte seu GitHub/GitLab
3. Crie um novo repositório com os arquivos da pasta `discord-activity`
4. Importe o repositório no Vercel
5. Deploy automático!

## 🎮 Passo 2: Configurar no Discord Developer Portal

1. Acesse: https://discord.com/developers/applications/1508003195933425765

2. Vá em **Activities** (menu lateral esquerdo)

3. Clique em **URL Mappings**:
   - Root Path: `/`
   - Target: `https://granny-2d.vercel.app` (ou sua URL do Vercel)

4. Vá em **OAuth2** > **Redirects**:
   - Adicione: `https://granny-2d.vercel.app`

5. Em **OAuth2** > **Scopes**, marque:
   - ✅ `identify`
   - ✅ `guilds`
   - ✅ `activities.write`

6. Salve as alterações

## 🧪 Passo 3: Testar

1. Abra o Discord (Desktop ou Web)
2. Entre em um canal de voz
3. Clique no ícone de foguete 🚀 (Activities)
4. Procure por "Granny 2D" ou sua aplicação
5. Clique para iniciar
6. Convide um amigo!

## 🎯 Como Jogar

### Jogador 1 (Sobrevivente):
- Controla o personagem azul
- Objetivo: Encontrar a chave mestra e escapar
- Controles: A/D (mover), E (interagir), Q (soltar), 1-3 (inventário)

### Jogador 2 (Granny):
- Controla a Granny
- Objetivo: Capturar o sobrevivente
- Controles: WASD ou Setas (mover em todas as direções)

## 🐛 Troubleshooting

### "Discord SDK not found"
- Verifique se a URL do SDK está correta no HTML
- Certifique-se que o Application ID está correto

### "Authenticate command failed"
- Verifique as configurações OAuth2
- Confirme que os redirects estão corretos
- Limpe o cache do navegador

### Jogo não carrega
- Verifique o console do navegador (F12)
- Confirme que todas as texturas foram copiadas
- Teste a URL diretamente no navegador

### Não sincroniza entre jogadores
- Implemente WebSockets ou use Discord SDK para sincronização em tempo real
- Por enquanto, o jogo funciona localmente para cada jogador

## 📝 Próximos Passos

Para sincronização em tempo real entre jogadores, você precisará:

1. Implementar um servidor WebSocket (ex: Socket.io)
2. Ou usar o Discord SDK para enviar mensagens entre participantes
3. Sincronizar posições, inventário e estado do jogo

## 🔗 Links Úteis

- Discord Developer Portal: https://discord.com/developers/applications
- Discord Activities Docs: https://discord.com/developers/docs/activities/overview
- Vercel Docs: https://vercel.com/docs
- Discord SDK: https://github.com/discord/embedded-app-sdk

## 💡 Dicas

- Teste localmente antes de fazer deploy
- Use `vercel dev` para testar localmente
- Monitore os logs no Vercel Dashboard
- Peça feedback dos jogadores!

Boa sorte! 🎮
