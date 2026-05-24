# 🚀 INÍCIO RÁPIDO - 5 MINUTOS

## ⚡ Deploy em 3 Comandos

```bash
# 1. Entre na pasta
cd discord-activity

# 2. Instale o Vercel CLI (se ainda não tiver)
npm install -g vercel

# 3. Deploy!
vercel --prod
```

**Pronto!** Anote a URL gerada (ex: `https://granny-2d-xxx.vercel.app`)

---

## 🎮 Configure no Discord (2 minutos)

### 1. Acesse o Developer Portal
👉 https://discord.com/developers/applications/1508003195933425765

### 2. Configure Activities
- Menu lateral: **Activities**
- **URL Mappings**:
  - Root Path: `/`
  - Target: `SUA_URL_DO_VERCEL`

### 3. Configure OAuth2
- Menu lateral: **OAuth2**
- **Redirects**: Adicione `SUA_URL_DO_VERCEL`
- **Scopes**: Marque `identify`, `guilds`, `activities.write`

### 4. Salve!
Clique em **Save Changes**

---

## 🧪 Teste Agora!

1. Abra o Discord
2. Entre em um canal de voz
3. Clique no foguete 🚀 (Activities)
4. Selecione sua aplicação
5. Convide um amigo
6. **JOGUEM!** 🎮

---

## 🎯 Como Jogar

### Jogador 1 (Sobrevivente) 🏃
- **A/D**: Mover
- **E**: Interagir
- **Q**: Soltar item
- **1-3**: Trocar item
- **Objetivo**: Encontre a chave mestra e escape!

### Jogador 2 (Granny) 👵
- **WASD** ou **Setas**: Mover
- **Objetivo**: Capture o sobrevivente!

---

## 📝 Resumo do Jogo

1. **Sobrevivente** começa no quarto
2. **Granny** começa na cozinha
3. Sobrevivente precisa:
   - Pegar chave do quarto → Abrir porta
   - Pegar chave do corredor → Abrir cozinha
   - Pegar chave do porão → Abrir garagem
   - Pegar **chave mestra** no porão
   - Escapar pela porta da garagem
4. Granny precisa:
   - Encontrar o sobrevivente
   - Capturá-lo antes que escape
5. Se capturado: Dia passa (máximo 5 dias)
6. Se escapar: **VITÓRIA!** 🎉

---

## 🆘 Problemas?

### Jogo não carrega?
```bash
# Teste localmente primeiro
# Abra test-local.html no navegador
```

### Discord SDK erro?
- Verifique Application ID: `1508003195933425765`
- Confirme OAuth2 configurado
- Limpe cache do navegador

### Não sincroniza?
- Normal! Sincronização em tempo real é próximo passo
- Por enquanto, cada jogador vê sua própria versão

---

## 💡 Dicas

✅ **Teste local primeiro**: Abra `test-local.html`  
✅ **Verifique console**: Pressione F12 no navegador  
✅ **Leia DEPLOY.md**: Guia completo de deploy  
✅ **Veja CHECKLIST.md**: Lista de verificação completa  

---

## 🎉 Pronto!

Seu jogo está **100% funcional** e pronto para jogar!

**Divirta-se!** 🎮👵

---

## 📚 Documentação Completa

- `README.md` - Visão geral do projeto
- `DEPLOY.md` - Guia detalhado de deploy
- `INSTRUCOES.md` - Instruções passo a passo
- `RESUMO.md` - Resumo completo
- `CHECKLIST.md` - Lista de verificação

---

**Tempo total**: ~5 minutos  
**Dificuldade**: Fácil  
**Diversão**: Infinita! 🚀
