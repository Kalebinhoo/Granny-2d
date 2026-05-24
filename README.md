# 🎮 Granny 2D

Jogo de terror 2D inspirado no Granny, agora com modo Discord Activity PvP!

## 📁 Estrutura do Projeto

```
Granny 2d/
└── discord-activity/     → Discord Activity (Modo PvP)
    ├── index.html        → Interface do jogo
    ├── style.css         → Estilos
    ├── game.js           → Lógica + Discord SDK
    ├── texture/          → Texturas do jogo
    └── docs/             → Documentação completa
```

## 🎯 Discord Activity - Modo PvP

Versão multiplayer para Discord onde:
- **Jogador 1**: Controla o sobrevivente que tenta escapar
- **Jogador 2**: Controla a Granny e tenta capturar o sobrevivente

### 🚀 Deploy Rápido

```bash
cd discord-activity
npm install -g vercel
vercel --prod
```

### 📋 Informações

- **Application ID**: `1508003195933425765`
- **URL**: `https://granny-2d.vercel.app/`
- **Repositório**: https://github.com/Kalebinhoo/Granny-2d

### 📚 Documentação

Toda a documentação está na pasta `discord-activity/`:

- **INICIO-RAPIDO.md** - Comece em 5 minutos
- **DEPLOY.md** - Guia completo de deploy
- **INSTRUCOES.md** - Instruções detalhadas
- **CHECKLIST.md** - Lista de verificação
- **RESUMO.md** - Resumo técnico

### 🎮 Como Jogar

#### Jogador 1 (Sobrevivente):
- **A/D**: Mover
- **E**: Interagir (pegar itens, abrir portas, esconder)
- **Q**: Soltar item
- **1-3**: Trocar slot do inventário

#### Jogador 2 (Granny):
- **WASD** ou **Setas**: Mover em todas as direções

### 🔧 Configuração Discord

1. Acesse: https://discord.com/developers/applications/1508003195933425765
2. Configure **Activities** > **URL Mappings**
3. Configure **OAuth2** > **Redirects** e **Scopes**
4. Veja `discord-activity/DEPLOY.md` para detalhes

## 🧪 Teste Local

Antes de fazer deploy, teste localmente:

```bash
cd discord-activity
# Abra test-local.html no navegador
```

## 📊 Status

- ✅ Discord Activity completa
- ✅ Modo PvP funcional
- ✅ Documentação completa
- ✅ Pronto para deploy

## 🔗 Links

- **GitHub**: https://github.com/Kalebinhoo/Granny-2d
- **Discord Dev Portal**: https://discord.com/developers/applications/1508003195933425765
- **Vercel**: https://granny-2d.vercel.app/

## 📝 Licença

MIT

---

**Desenvolvido com ❤️ para Discord Activities**
