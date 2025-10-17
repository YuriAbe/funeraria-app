# 🏥 Funerária App

> Aplicação mobile completa para gerenciamento de serviços funerários

[![React Native](https://img.shields.io/badge/React%20Native-0.79.6-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~53.0-000020?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.2.1-FFCA28?logo=firebase)](https://firebase.google.com/)

---

## 📋 Sobre o Projeto

Aplicativo React Native desenvolvido com **Expo** e **TypeScript** para gerenciamento completo de serviços funerários. O projeto oferece uma interface moderna e intuitiva para cadastro de produtos, gerenciamento de contratos, e administração de serviços relacionados.

### ✨ Principais Funcionalidades

- � **Autenticação** completa com Firebase (cadastro, login, recuperação de senha)
- 📦 **CRUD** de produtos e serviços (caixões, terrenos, jazigos, decorações, lápides)
- 📝 **Gestão de contratos** de caixão
- 👤 **Perfil de usuário** editável com dados pessoais
- 💾 **Armazenamento offline** com AsyncStorage
- 🎨 **Design responsivo** e profissional
- 📱 **Multiplataforma** (iOS, Android, Web)

---

## 🚀 Começando

### Pré-requisitos

- [Node.js](https://nodejs.org/) 16+
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g @expo/cli`
- [Git](https://git-scm.com/)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/YuriAbe/funeraria-app.git

# Entre na pasta do projeto
cd funeraria-app

# Instale as dependências
npm install --legacy-peer-deps
```

### Configuração

Crie um arquivo `.env` na raiz do projeto com suas credenciais Firebase:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

> 📝 **Nota**: Obtenha suas credenciais no [Firebase Console](https://console.firebase.google.com/)

### Executando

```bash
# Iniciar o projeto
npm start

# Ou com cache limpo
npx expo start --clear
```

**Opções de execução:**
- Pressione `w` → Abrir no navegador
- Pressione `a` → Abrir no Android
- Pressione `i` → Abrir no iOS (requer macOS)
- Escaneie o QR Code → Abrir no [Expo Go](https://expo.dev/client)

---

## 📱 Funcionalidades Detalhadas

### Autenticação e Perfil
- ✅ Cadastro de novos usuários
- ✅ Login com email/senha
- ✅ Edição de perfil (nome, email, telefone, cidade, data de nascimento)
- ✅ Alteração de senha com reautenticação
- ✅ Exclusão de conta com confirmação

### Gestão de Produtos
- ✅ **Catálogo de Caixões** - Diversos materiais e estilos
- ✅ **Contratos de Caixão** - Gerenciamento de contratos
- ✅ **Terrenos** - Locais para sepultamento
- ✅ **Jazigos Familiares** - Espaços perpétuos
- ✅ **Decorações** - Flores, coroas e ornamentos
- ✅ **Lápides** - Personalização e gravações

### Recursos de UX/UI
- ✅ Navegação fluida entre telas
- ✅ Validação de formulários em tempo real
- ✅ Estados vazios informativos
- ✅ Confirmações para ações destrutivas
- ✅ Feedback visual consistente
- ✅ Design responsivo

---

## 🛠️ Stack Tecnológica

### Core
- **React Native** 0.79.6
- **React** 19.0.0
- **TypeScript** 5.8.3
- **Expo** ~53.0.22

### Backend & Storage
- **Firebase Authentication** 12.2.1
- **AsyncStorage** 1.24.0

### Navegação
- **React Navigation** 6.1.18
- **Stack Navigator** 6.4.1

### Utilitários
- **react-native-gesture-handler** 2.20.2
- **react-native-reanimated** 3.16.1
- **react-native-safe-area-context** 4.14.1

---

## 📁 Estrutura do Projeto

```
funeraria-app/
├── assets/                   # Recursos estáticos
├── docs/                     # Documentação
│   ├── COMPONENTS.md        # Componentes reutilizáveis
│   └── DEVELOPMENT.md       # Guia de desenvolvimento
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── CustomButton.tsx
│   │   ├── CustomInput.tsx
│   │   ├── Card.tsx
│   │   ├── EmptyState.tsx
│   │   └── ...
│   ├── screens/             # Telas da aplicação
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── MainScreen.tsx
│   │   └── ...
│   ├── services/            # Serviços externos
│   │   └── connectionFirebase.tsx
│   └── utils/               # Utilitários
│       ├── validation.ts
│       ├── formatting.ts
│       └── constants.ts
├── App.tsx                  # Componente raiz
├── ARCHITECTURE.md          # Arquitetura detalhada
├── CONTRIBUTING.md          # Guia de contribuição
├── CHANGELOG.md             # Histórico de mudanças
└── package.json
```

---

## 📚 Documentação

- **[Arquitetura](./ARCHITECTURE.md)** - Visão geral da arquitetura e padrões
- **[Componentes](./docs/COMPONENTS.md)** - Documentação de componentes reutilizáveis
- **[Desenvolvimento](./docs/DEVELOPMENT.md)** - Setup e guia de desenvolvimento
- **[Contribuição](./CONTRIBUTING.md)** - Como contribuir para o projeto
- **[Changelog](./CHANGELOG.md)** - Histórico de versões

---

## 🤝 Como Contribuir

Contribuições são bem-vindas! Veja nosso [guia de contribuição](./CONTRIBUTING.md) para começar.

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm start                     # Iniciar projeto
npx expo start --clear       # Limpar cache e iniciar
npm run android              # Executar no Android
npm run ios                  # Executar no iOS

# Limpeza
rm -rf node_modules          # Remover dependências
npm cache clean --force      # Limpar cache npm
npm install --legacy-peer-deps  # Reinstalar

# Git
git status                   # Ver status
git log --oneline            # Ver commits
```

---

## 🐛 Problemas Conhecidos e Soluções

### Metro bundler não inicia
```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8081 | xargs kill -9
```

### Erro de dependências
```bash
rm -rf node_modules
npm install --legacy-peer-deps
npx expo start --clear
```

Mais soluções em [DEVELOPMENT.md](./docs/DEVELOPMENT.md#problemas-comuns)

---

## � Roadmap

### Versão 1.1 (Próxima)
- [ ] Migração para Firebase Realtime Database
- [ ] Upload de imagens de produtos
- [ ] Sistema de favoritos

### Versão 1.2
- [ ] Sistema de carrinho de compras
- [ ] Histórico de pedidos
- [ ] Notificações push

### Versão 2.0
- [ ] Dark mode
- [ ] Painel administrativo
- [ ] Relatórios e métricas
- [ ] App para iOS/Android (stores)

Veja o [CHANGELOG](./CHANGELOG.md) para histórico completo.

---

## 📄 Licença

Este projeto é privado e pertence a **YuriAbe**.

---

## 👥 Autores

- **YuriAbe** - *Desenvolvimento* - [@YuriAbe](https://github.com/YuriAbe)

---

## 🙏 Agradecimentos

- React Native Community
- Expo Team
- Firebase
- Todos os contribuidores

---

## 📞 Suporte

**Encontrou um bug?** Abra uma [issue](https://github.com/YuriAbe/funeraria-app/issues)

**Tem uma dúvida?** Consulte a [documentação](./docs/DEVELOPMENT.md)

**Quer contribuir?** Leia o [guia de contribuição](./CONTRIBUTING.md)

---

<p align="center">
  Feito com ❤️ por <a href="https://github.com/YuriAbe">YuriAbe</a>
</p>

<p align="center">
  <sub>Outubro 2025 - Versão 1.0.0</sub>
</p>
