# 🚀 PRÓXIMOS PASSOS - DEPLOY COMPLETO

## ✅ O que já foi feito:

1. ✅ Projeto criado e completo
2. ✅ Código commitado no Git
3. ✅ Push para GitHub realizado
4. ✅ Repositório: https://github.com/Kalebinhoo/Granny-2d

---

## 📋 Agora você precisa:

### 1️⃣ Conectar GitHub ao Vercel (5 minutos)

#### Opção A: Via Vercel Dashboard (Recomendado)

1. Acesse: https://vercel.com/new

2. Clique em **"Import Git Repository"**

3. Conecte sua conta do GitHub

4. Selecione o repositório: **`Kalebinhoo/Granny-2d`**

5. Configure o projeto:
   ```
   Framework Preset: Other
   Root Directory: discord-activity
   Build Command: (deixe vazio)
   Output Directory: (deixe vazio)
   Install Command: (deixe vazio)
   ```

6. Clique em **"Deploy"**

7. Aguarde o deploy (1-2 minutos)

8. **Anote a URL gerada** (ex: `https://granny-2d-xxx.vercel.app`)

#### Opção B: Via Vercel CLI

```bash
cd discord-activity
vercel --prod
```

---

### 2️⃣ Atualizar URL no Discord Developer Portal (2 minutos)

1. Acesse: https://discord.com/developers/applications/1508003195933425765

2. Vá em **Activities** (menu lateral)

3. Em **URL Mappings**:
   - Root Path: `/`
   - Target: **`[SUA_URL_DO_VERCEL]`** ← Cole a URL que o Vercel gerou

4. Vá em **OAuth2** > **Redirects**:
   - Adicione: **`[SUA_URL_DO_VERCEL]`**

5. Em **OAuth2** > **Scopes**, confirme que estão marcados:
   - ✅ `identify`
   - ✅ `guilds`
   - ✅ `activities.write`

6. Clique em **"Save Changes"**

---

### 3️⃣ Testar no Discord (2 minutos)

1. Abra o Discord (Desktop ou Web)

2. Entre em um canal de voz

3. Clique no ícone de foguete 🚀 (Activities)

4. Procure por "Granny 2D" ou sua aplicação

5. Clique para iniciar

6. **Convide um amigo!**

7. Joguem! 🎮

---

## 🎮 Como Funciona o Jogo

### Jogador 1 (Sobrevivente):
- Spawn: Quarto Inicial
- Objetivo: Encontrar a chave mestra e escapar
- Controles: A/D, E, Q, 1-3

### Jogador 2 (Granny):
- Spawn: Cozinha
- Objetivo: Capturar o sobrevivente
- Controles: WASD ou Setas

### Fluxo do Jogo:
1. Sobrevivente coleta chaves
2. Abre portas trancadas
3. Procura a chave mestra no porão
4. Escapa pela garagem
5. Granny tenta capturar antes disso!

---

## 🔄 Atualizações Futuras

Se você fizer alterações no código:

```bash
# 1. Faça as alterações nos arquivos
# 2. Commit
git add .
git commit -m "feat: sua descrição"

# 3. Push
git push origin main

# 4. Vercel faz deploy automático!
```

---

## 🐛 Troubleshooting

### Jogo não carrega no Discord?
- Verifique se a URL no Discord Developer Portal está correta
- Confirme que OAuth2 está configurado
- Limpe o cache do Discord (Ctrl+Shift+R)

### Discord SDK erro?
- Verifique o console do navegador (F12)
- Confirme que o Application ID está correto: `1508003195933425765`
- Teste a URL diretamente no navegador

### Vercel deploy falhou?
- Verifique se o Root Directory está como `discord-activity`
- Confirme que todos os arquivos foram enviados ao GitHub
- Veja os logs no Vercel Dashboard

---

## 📊 Checklist Final

- [ ] Deploy no Vercel concluído
- [ ] URL do Vercel anotada
- [ ] Discord Developer Portal atualizado
- [ ] Activities URL Mapping configurado
- [ ] OAuth2 Redirects configurado
- [ ] OAuth2 Scopes configurados
- [ ] Testado no Discord
- [ ] Jogado com um amigo
- [ ] Funcionando perfeitamente! 🎉

---

## 💡 Melhorias Futuras (Opcional)

### Sincronização em Tempo Real
Para que os jogadores vejam as ações um do outro em tempo real:

1. **Opção 1: WebSocket Server**
   - Implementar servidor Socket.io
   - Sincronizar posições e estado
   - Requer servidor backend

2. **Opção 2: Discord SDK Messages**
   - Usar `discordSdk.commands.sendMessage()`
   - Mais simples, mas com latência
   - Não requer servidor

### Outras Melhorias
- [ ] Adicionar sons e música
- [ ] Mais salas e itens
- [ ] Power-ups especiais
- [ ] Sistema de chat
- [ ] Ranking/Leaderboard
- [ ] Customização de personagens

---

## 🎉 Parabéns!

Você criou uma Discord Activity completa! 🚀

**Repositório**: https://github.com/Kalebinhoo/Granny-2d  
**Application ID**: 1508003195933425765  
**Status**: ✅ Pronto para jogar!

Divirta-se! 🎮👵
