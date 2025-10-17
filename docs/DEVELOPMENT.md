# 🔧 Guia de Desenvolvimento

## 🚀 Setup Inicial

### 1. Pré-requisitos

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** ou **yarn**
- **Git** ([Download](https://git-scm.com/))
- **Expo CLI**: `npm install -g @expo/cli`
- **Editor**: VS Code recomendado

### Opcional (para testes em dispositivos físicos):
- **Expo Go** app ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

### 2. Clonando o Repositório

```bash
# Clone o repositório
git clone https://github.com/YuriAbe/funeraria-app.git

# Entre na pasta
cd funeraria-app

# Instale as dependências
npm install --legacy-peer-deps
```

> ⚠️ **Importante**: Use `--legacy-peer-deps` para resolver conflitos de dependências peer.

### 3. Configuração do Firebase

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

**Como obter as credenciais:**
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione ou crie um projeto
3. Vá em Project Settings > General
4. Em "Your apps", clique em Web app (</>) 
5. Copie as configurações

### 4. Executando o Projeto

```bash
# Inicia o Metro bundler
npm start

# Ou limpe o cache primeiro
npx expo start --clear
```

**Opções de execução:**
- Pressione `w` - Abre no navegador
- Pressione `a` - Abre no emulador Android
- Pressione `i` - Abre no emulador iOS (somente macOS)
- Escaneie QR code - Abre no Expo Go (dispositivo físico)

---

## 📁 Estrutura de Pastas Detalhada

```
funeraria-app/
│
├── assets/                      # Recursos estáticos
│   └── logosemfundo.png        # Logo da aplicação
│
├── docs/                        # Documentação
│   └── COMPONENTS.md           # Doc de componentes reutilizáveis
│
├── src/
│   ├── components/             # Componentes reutilizáveis
│   │   ├── Card.tsx           # Sistema de cards
│   │   ├── CustomButton.tsx   # Botão customizado
│   │   ├── CustomHeader.tsx   # Header de páginas
│   │   ├── CustomInput.tsx    # Input com validação
│   │   ├── EmptyState.tsx     # Estado vazio
│   │   └── index.ts           # Barrel export
│   │
│   ├── screens/               # Telas da aplicação
│   │   ├── Auth/              # (futuro) Telas de autenticação
│   │   ├── CRUD/              # (futuro) Telas CRUD organizadas
│   │   └── *.tsx              # Telas atuais
│   │
│   ├── services/              # Serviços externos
│   │   └── connectionFirebase.tsx  # Config Firebase
│   │
│   └── utils/                 # Utilitários
│       ├── constants.ts       # Constantes do app
│       ├── formatting.ts      # Funções de formatação
│       ├── validation.ts      # Funções de validação
│       └── index.ts           # Barrel export
│
├── .env                       # Variáveis de ambiente (NÃO COMMITAR!)
├── .gitignore                 # Arquivos ignorados pelo Git
├── App.tsx                    # Componente raiz
├── ARCHITECTURE.md            # Documentação de arquitetura
├── CONTRIBUTING.md            # Guia de contribuição
├── app.json                   # Configurações do Expo
├── index.ts                   # Entry point
├── package.json               # Dependências
├── README.md                  # Documentação principal
└── tsconfig.json              # Configuração TypeScript
```

---

## 🔨 Comandos Úteis

### Desenvolvimento

```bash
# Iniciar aplicação
npm start

# Iniciar com cache limpo
npx expo start --clear

# Rodar no Android
npm run android

# Rodar no iOS
npm run ios

# Rodar na Web
npm run web
```

### Git

```bash
# Ver status
git status

# Criar nova branch
git checkout -b feature/nova-funcionalidade

# Adicionar alterações
git add .

# Commit
git commit -m "feat: adiciona nova funcionalidade"

# Push
git push origin feature/nova-funcionalidade

# Atualizar da main
git pull origin main
```

### Limpeza

```bash
# Limpar cache do Metro
npx expo start --clear

# Limpar node_modules e reinstalar
rm -rf node_modules
npm install --legacy-peer-deps

# Limpar cache do npm
npm cache clean --force
```

---

## 🐛 Debugging

### Console Logs

```typescript
// Sempre use console.log com contexto
console.log('Caixão carregado:', caixao);
console.error('Erro ao salvar:', error);
console.warn('Atenção:', message);
```

### React DevTools

```bash
# Instalar globalmente
npm install -g react-devtools

# Executar
react-devtools
```

### Expo DevTools

Acesse através do QR code ou:
- Android: Shake o dispositivo → "Debug Remote JS"
- iOS: Shake o dispositivo → "Debug Remote JS"

### Problemas Comuns

**1. Erro: "Module not found"**
```bash
# Solução: Reinstale dependências
rm -rf node_modules
npm install --legacy-peer-deps
npx expo start --clear
```

**2. Metro bundler não inicia**
```bash
# Solução: Mate o processo na porta 8081
# Windows:
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:8081 | xargs kill -9
```

**3. AsyncStorage não persiste dados**
```bash
# Solução: Limpe dados do app
# Android: Settings → Apps → Expo Go → Clear Data
# iOS: Delete app e reinstale
```

**4. Firebase não conecta**
- Verifique arquivo `.env`
- Confirme variáveis com prefixo `EXPO_PUBLIC_`
- Reinicie o Metro bundler

---

## 🧪 Testes

### Checklist Manual de Testes

**Autenticação:**
- [ ] Cadastro com email/senha válidos
- [ ] Cadastro com email duplicado (deve falhar)
- [ ] Login com credenciais corretas
- [ ] Login com credenciais incorretas (deve falhar)
- [ ] Logout

**CRUD (para cada entidade):**
- [ ] Criar novo item
- [ ] Listar itens
- [ ] Editar item existente
- [ ] Deletar item
- [ ] Confirmar persistência (fechar/abrir app)

**Perfil:**
- [ ] Editar nome
- [ ] Editar email
- [ ] Alterar senha
- [ ] Adicionar informações (cidade, telefone, data)
- [ ] Deletar conta (com confirmação)

**UI/UX:**
- [ ] Navegação fluida entre telas
- [ ] Botões respondem ao toque
- [ ] Formulários validam corretamente
- [ ] Mensagens de erro são claras
- [ ] Estados vazios são informativos

---

## 📦 Build para Produção

### Android (APK)

```bash
# Build local
npx expo build:android

# Build com EAS (recomendado)
npm install -g eas-cli
eas build --platform android
```

### iOS (IPA)

```bash
# Requer macOS e conta Apple Developer
eas build --platform ios
```

### Web

```bash
# Build para web
npx expo export:web

# Deploy (exemplo com Netlify)
npm install -g netlify-cli
netlify deploy --dir=web-build --prod
```

---

## 🚀 Deploy Contínuo

### Expo Updates (OTA)

```bash
# Publicar update
eas update --branch production --message "Correção de bugs"
```

### App Stores

**Google Play Store:**
1. Build APK/AAB com `eas build`
2. Acesse [Google Play Console](https://play.google.com/console)
3. Crie novo app
4. Upload do build
5. Preencha informações da loja
6. Submeta para revisão

**Apple App Store:**
1. Build IPA com `eas build`
2. Acesse [App Store Connect](https://appstoreconnect.apple.com/)
3. Crie novo app
4. Upload via Transporter app
5. Preencha informações da loja
6. Submeta para revisão

---

## 📈 Monitoramento

### Expo Analytics

```bash
# Instalar
npx expo install expo-tracking-transparency

# Configurar no app.json
{
  "expo": {
    "analytics": {
      "enabled": true
    }
  }
}
```

### Error Tracking (Sentry)

```bash
# Instalar
npm install @sentry/react-native

# Configurar
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: "SUA_DSN_AQUI",
  tracesSampleRate: 1.0,
});
```

---

## 🔐 Segurança

### Boas Práticas Implementadas

✅ Variáveis de ambiente para secrets  
✅ Validação de inputs  
✅ Reautenticação para ações sensíveis  
✅ Confirmação para ações destrutivas  

### TODO: Melhorias de Segurança

- [ ] Rate limiting no Firebase
- [ ] CAPTCHA no cadastro
- [ ] Criptografia de dados sensíveis no AsyncStorage
- [ ] 2FA (Two-Factor Authentication)
- [ ] Logs de auditoria

---

## 🎓 Recursos de Aprendizado

### Documentação Oficial
- [React Native](https://reactnative.dev/docs/getting-started)
- [Expo](https://docs.expo.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Firebase](https://firebase.google.com/docs)

### Tutoriais Recomendados
- [React Native by Example](https://www.reactnative.express/)
- [Expo Tutorial](https://docs.expo.dev/tutorial/introduction/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Comunidades
- [React Native Community](https://www.reactnative.dev/community/overview)
- [Expo Forums](https://forums.expo.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

---

## 📞 Suporte

**Problemas técnicos?**
- Abra uma [Issue](https://github.com/YuriAbe/funeraria-app/issues)
- Consulte a [documentação](./ARCHITECTURE.md)
- Revise [problemas comuns](#problemas-comuns)

**Dúvidas sobre contribuição?**
- Leia o [guia de contribuição](./CONTRIBUTING.md)
- Veja exemplos de [componentes](./docs/COMPONENTS.md)

---

**Última atualização**: Outubro 2025
**Versão**: 1.0.0
