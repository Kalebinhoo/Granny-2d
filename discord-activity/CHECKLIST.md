# ✅ CHECKLIST DE DEPLOY

## 📋 Antes do Deploy

### Arquivos
- [x] `index.html` criado
- [x] `style.css` criado
- [x] `game.js` completo
- [x] `vercel.json` configurado
- [x] `package.json` criado
- [x] `.gitignore` criado
- [x] Pasta `texture/` copiada
- [x] Documentação completa

### Testes Locais
- [ ] Abrir `test-local.html` no navegador
- [ ] Testar movimento do jogador (A/D)
- [ ] Testar interação (E)
- [ ] Testar inventário (1, 2, 3)
- [ ] Testar coleta de chaves
- [ ] Testar abertura de portas
- [ ] Testar esconderijos
- [ ] Testar vitória (pegar chave mestra e escapar)

## 🚀 Deploy no Vercel

### Preparação
- [ ] Criar conta no Vercel (https://vercel.com)
- [ ] Instalar Vercel CLI: `npm install -g vercel`
- [ ] Fazer login: `vercel login`

### Deploy
- [ ] Entrar na pasta: `cd discord-activity`
- [ ] Executar: `vercel --prod`
- [ ] Anotar a URL gerada (ex: `https://granny-2d-xxx.vercel.app`)
- [ ] Testar a URL no navegador

### Verificação
- [ ] Página carrega corretamente
- [ ] Texturas aparecem
- [ ] Console sem erros (F12)
- [ ] Jogo funciona

## 🎮 Configuração Discord

### Discord Developer Portal
- [ ] Acessar: https://discord.com/developers/applications/1508003195933425765
- [ ] Ir em **Activities**
- [ ] Configurar URL Mapping:
  - [ ] Root Path: `/`
  - [ ] Target: `https://granny-2d.vercel.app` (sua URL)
- [ ] Ir em **OAuth2** > **Redirects**
  - [ ] Adicionar: `https://granny-2d.vercel.app`
- [ ] Ir em **OAuth2** > **Scopes**
  - [ ] Marcar: `identify`
  - [ ] Marcar: `guilds`
  - [ ] Marcar: `activities.write`
- [ ] Salvar todas as alterações

## 🧪 Testes no Discord

### Teste Básico
- [ ] Abrir Discord (Desktop ou Web)
- [ ] Entrar em um canal de voz
- [ ] Clicar no ícone de foguete 🚀 (Activities)
- [ ] Procurar pela aplicação
- [ ] Iniciar a atividade
- [ ] Verificar se carrega

### Teste Multiplayer
- [ ] Convidar um amigo
- [ ] Verificar se ambos aparecem na lista
- [ ] Iniciar o jogo
- [ ] Verificar papéis (Jogador 1 = Sobrevivente, Jogador 2 = Granny)
- [ ] Testar controles de ambos
- [ ] Testar colisão entre jogadores
- [ ] Testar vitória/derrota

## 🐛 Troubleshooting

### Se o jogo não carregar:
- [ ] Verificar console do navegador (F12)
- [ ] Confirmar URL no Discord Developer Portal
- [ ] Verificar se todas as texturas foram enviadas
- [ ] Limpar cache do navegador
- [ ] Tentar em modo anônimo

### Se Discord SDK falhar:
- [ ] Verificar Application ID no código
- [ ] Confirmar OAuth2 configurado corretamente
- [ ] Verificar redirects
- [ ] Testar com conta diferente

### Se não sincronizar:
- [ ] Verificar console para erros
- [ ] Confirmar que ambos jogadores estão conectados
- [ ] Implementar sincronização em tempo real (próximo passo)

## 📊 Métricas de Sucesso

- [ ] Jogo carrega em menos de 3 segundos
- [ ] Sem erros no console
- [ ] 2 jogadores conseguem jogar juntos
- [ ] Controles respondem corretamente
- [ ] Vitória/derrota funcionam
- [ ] Experiência fluida

## 🎯 Próximos Passos (Opcional)

### Melhorias Imediatas
- [ ] Adicionar sons
- [ ] Melhorar gráficos
- [ ] Adicionar mais salas
- [ ] Adicionar power-ups

### Sincronização em Tempo Real
- [ ] Implementar WebSocket server
- [ ] Ou usar Discord SDK messages
- [ ] Sincronizar posições
- [ ] Sincronizar inventário
- [ ] Sincronizar estado das portas

### Features Avançadas
- [ ] Sistema de chat
- [ ] Ranking/Leaderboard
- [ ] Mais modos de jogo
- [ ] Customização de personagens
- [ ] Suporte para mais jogadores

## ✨ Finalização

- [ ] Compartilhar com amigos
- [ ] Coletar feedback
- [ ] Fazer ajustes
- [ ] Promover no Discord
- [ ] Divertir-se! 🎉

---

**Data de Deploy**: ___/___/______

**URL Final**: _________________________________

**Status**: [ ] Em Desenvolvimento [ ] Em Teste [ ] Produção

**Notas**:
_____________________________________________
_____________________________________________
_____________________________________________
