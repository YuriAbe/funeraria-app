# 🏗️ Arquitetura do Projeto - Funerária App

## 📋 Visão Geral

Este é um aplicativo React Native desenvolvido com Expo para gerenciamento de serviços funerários. O projeto utiliza TypeScript para tipagem estática e Firebase para autenticação.

## 🎯 Objetivo do Projeto

Aplicativo mobile para gerenciar:
- Cadastro e autenticação de usuários
- Catálogo de caixões e produtos funerários
- Contratos de serviços
- Terrenos e jazigos
- Decorações e lápides personalizadas
- Perfil de usuário

## 🗂️ Estrutura de Pastas

```
funeraria-app/
├── assets/                      # Recursos estáticos (imagens, logos)
│   └── logosemfundo.png        # Logo da funerária
│
├── src/
│   ├── screens/                # Telas da aplicação
│   │   ├── HomeScreen.tsx      # Tela inicial (landing page)
│   │   ├── LoginScreen.tsx     # Tela de login
│   │   ├── CadastroScreen.tsx  # Tela de cadastro de usuário
│   │   ├── MainScreen.tsx      # Dashboard principal
│   │   ├── ProfileScreen.tsx   # Perfil do usuário
│   │   │
│   │   ├── CaixaoListScreen.tsx       # Lista de caixões
│   │   ├── CaixaoFormScreen.tsx       # Formulário de caixão
│   │   ├── ContratoListScreen.tsx     # Lista de contratos
│   │   ├── ContratoFormScreen.tsx     # Formulário de contrato
│   │   ├── TerrenoListScreen.tsx      # Lista de terrenos
│   │   ├── TerrenoFormScreen.tsx      # Formulário de terreno
│   │   ├── JazigoListScreen.tsx       # Lista de jazigos
│   │   ├── JazigoFormScreen.tsx       # Formulário de jazigo
│   │   ├── DecoracaoListScreen.tsx    # Lista de decorações
│   │   ├── DecoracaoFormScreen.tsx    # Formulário de decoração
│   │   ├── LapideListScreen.tsx       # Lista de lápides
│   │   └── LapideFormScreen.tsx       # Formulário de lápide
│   │
│   └── services/
│       └── connectionFirebase.tsx     # Configuração do Firebase
│
├── App.tsx                     # Componente raiz com navegação
├── index.ts                    # Entry point da aplicação
├── package.json                # Dependências do projeto
├── tsconfig.json               # Configuração TypeScript
└── app.json                    # Configuração do Expo

```

## 🔧 Stack Tecnológica

### Core
- **React Native** 0.79.6 - Framework mobile
- **React** 19.0.0 - Biblioteca UI
- **TypeScript** 5.8.3 - Tipagem estática
- **Expo** ~53.0.22 - Plataforma de desenvolvimento

### Navegação
- **@react-navigation/native** 6.1.18 - Navegação entre telas
- **@react-navigation/stack** 6.4.1 - Stack navigator

### Backend & Armazenamento
- **Firebase** 12.2.1 - Backend as a Service
  - Firebase Authentication (email/senha)
  - Firebase Realtime Database (futuro)
- **AsyncStorage** 1.24.0 - Armazenamento local (dados offline)

### Utilitários
- **react-native-gesture-handler** 2.20.2 - Gestos e interações
- **react-native-reanimated** 3.16.1 - Animações
- **react-native-safe-area-context** 4.14.1 - Safe areas
- **react-native-screens** 4.15.4 - Otimização de telas

## 🔐 Autenticação

### Firebase Authentication

O projeto utiliza Firebase Authentication com método de email/senha:

```typescript
// src/services/connectionFirebase.tsx
import { getAuth } from 'firebase/auth';
export const auth = getAuth(app);
```

### Fluxo de Autenticação

1. **Cadastro** (`CadastroScreen.tsx`)
   - Validação de email e senha
   - Criação de usuário no Firebase
   - Navegação automática para tela principal

2. **Login** (`LoginScreen.tsx`)
   - Autenticação com email/senha
   - Validação de credenciais
   - Redirecionamento para MainScreen

3. **Perfil** (`ProfileScreen.tsx`)
   - Edição de dados pessoais (nome, email, cidade, telefone, data nascimento)
   - Alteração de senha (com reautenticação)
   - Exclusão de conta (com confirmação)
   - Dados salvos localmente com AsyncStorage

## 💾 Armazenamento de Dados

### AsyncStorage

Atualmente, todos os dados CRUD são armazenados localmente usando AsyncStorage:

```typescript
// Exemplo de armazenamento
await AsyncStorage.setItem('caixoes', JSON.stringify(caixoes));

// Exemplo de leitura
const stored = await AsyncStorage.getItem('caixoes');
const data = stored ? JSON.parse(stored) : [];
```

### Estrutura de Dados

Cada entidade segue um padrão similar:

```typescript
interface Entity {
  id: string;              // Timestamp único
  // campos específicos da entidade
  createdAt: string;       // ISO date string
}
```

**Chaves AsyncStorage:**
- `caixoes` - Catálogo de caixões
- `contratos` - Contratos de serviços
- `terrenos` - Terrenos para sepultamento
- `jazigos` - Jazigos familiares
- `decoracoes` - Decorações de cemitério
- `lapides` - Lápides personalizadas
- `profile_{userId}` - Dados de perfil do usuário

## 🧭 Navegação

### Stack Navigator

Todas as telas são gerenciadas por um Stack Navigator:

```typescript
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  Main: undefined;
  Profile: undefined;
  CaixaoList: undefined;
  CaixaoForm: { caixao?: Caixao };
  // ... outras rotas
};
```

### Fluxo de Navegação

```
HomeScreen (Landing)
  ├── LoginScreen
  │   └── MainScreen (Dashboard)
  │       ├── ProfileScreen
  │       ├── CaixaoListScreen → CaixaoFormScreen
  │       ├── ContratoListScreen → ContratoFormScreen
  │       ├── TerrenoListScreen → TerrenoFormScreen
  │       ├── JazigoListScreen → JazigoFormScreen
  │       ├── DecoracaoListScreen → DecoracaoFormScreen
  │       └── LapideListScreen → LapideFormScreen
  │
  └── CadastroScreen → MainScreen
```

## 🎨 Padrões de Design

### Cores do Tema

```typescript
const COLORS = {
  primary: '#3a4774',      // Azul escuro (botões principais)
  secondary: '#2c3e50',    // Cinza escuro (headers, títulos)
  success: '#27ae60',      // Verde (preços, sucesso)
  danger: '#e74c3c',       // Vermelho (deletar, erros)
  warning: '#DAA520',      // Dourado (avisos)
  info: '#3498db',         // Azul claro (editar, info)
  background: '#f8f9fa',   // Cinza claro (fundo)
  white: '#ffffff',        // Branco (cards)
  text: '#2c3e50',         // Texto principal
  textSecondary: '#7f8c8d', // Texto secundário
  border: '#e9ecef',       // Bordas
};
```

### Cores por Serviço

Cada serviço tem uma cor identificadora:

- **Contratos de Caixão**: `#8B4513` (Marrom)
- **Catálogo de Caixões**: `#654321` (Marrom escuro)
- **Terrenos**: `#228B22` (Verde floresta)
- **Jazigos**: `#696969` (Cinza)
- **Decorações**: `#FF69B4` (Rosa)
- **Lápides**: `#A9A9A9` (Cinza claro)

## 📱 Padrões de Telas

### Telas de Lista (List Screens)

Todas seguem o mesmo padrão:

1. **Header** com título e botão "Novo"
2. **FlatList** com cards
3. **Empty State** quando não há dados
4. **Botões de ação** (Editar/Deletar) em cada card
5. **useFocusEffect** para recarregar ao entrar na tela

### Telas de Formulário (Form Screens)

Padrão consistente:

1. **KeyboardAvoidingView** para iOS
2. **ScrollView** para campos longos
3. **Validação** de campos obrigatórios
4. **Máscaras** para campos especiais (preço, telefone, data)
5. **Botões** Cancelar e Salvar
6. **Mensagens de erro** inline

## 🔄 Estado e Lifecycle

### Hooks Utilizados

- `useState` - Estado local de componentes
- `useEffect` - Side effects (carregar dados)
- `useNavigation` - Navegação programática
- `useRoute` - Parâmetros de rota
- `useFocusEffect` - Executar ao focar na tela

### Carregamento de Dados

```typescript
useFocusEffect(
  React.useCallback(() => {
    loadData();
  }, [])
);
```

## 🚀 Funcionalidades Implementadas

### ✅ Autenticação
- [x] Cadastro de usuário
- [x] Login com email/senha
- [x] Logout
- [x] Edição de perfil
- [x] Alteração de senha
- [x] Exclusão de conta

### ✅ CRUD Completo
- [x] Caixões (Create, Read, Update, Delete)
- [x] Contratos (Create, Read, Update, Delete)
- [x] Terrenos (Create, Read, Update, Delete)
- [x] Jazigos (Create, Read, Update, Delete)
- [x] Decorações (Create, Read, Update, Delete)
- [x] Lápides (Create, Read, Update, Delete)

### ✅ UX/UI
- [x] Navegação fluida
- [x] Animações suaves
- [x] Feedback visual
- [x] Estados vazios informativos
- [x] Confirmações de ações destrutivas

## 🔮 Próximos Passos

### Backend
- [ ] Migrar AsyncStorage para Firebase Realtime Database
- [ ] Implementar Cloud Firestore para dados estruturados
- [ ] Adicionar Firebase Storage para imagens
- [ ] Implementar validação server-side

### Funcionalidades
- [ ] Upload de fotos de produtos
- [ ] Sistema de carrinho de compras
- [ ] Histórico de pedidos
- [ ] Notificações push
- [ ] Compartilhamento de catálogo
- [ ] Modo offline com sincronização

### UX/UI
- [ ] Dark mode
- [ ] Animações avançadas
- [ ] Onboarding para novos usuários
- [ ] Tutorial interativo
- [ ] Acessibilidade melhorada

### Administrativo
- [ ] Painel administrativo
- [ ] Relatórios e métricas
- [ ] Gerenciamento de estoque
- [ ] Sistema de permissões

## 🐛 Debugging

### Logs Úteis

```bash
# Ver logs do Metro bundler
npm start

# Logs do Android
npx react-native log-android

# Logs do iOS
npx react-native log-ios

# Limpar cache
npx expo start --clear
```

### Problemas Comuns

1. **Erro de dependências**: Use `--legacy-peer-deps`
2. **Metro bundler travado**: Limpe o cache
3. **AsyncStorage não persiste**: Verifique permissões
4. **Firebase não conecta**: Valide variáveis de ambiente no `.env`

### Configuração de Ambiente

O projeto usa variáveis de ambiente para configurações sensíveis:

```bash
# 1. Copie o template
cp .env.example .env

# 2. Configure suas credenciais Firebase no .env
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
# ... outras variáveis
```

**⚠️ Importante**: Nunca commite o arquivo `.env` com credenciais reais!

## 📝 Convenções de Código

### Nomenclatura
- **Componentes**: PascalCase (`CaixaoListScreen`)
- **Funções**: camelCase (`loadCaixoes`)
- **Constantes**: UPPER_SNAKE_CASE (`API_KEY`)
- **Interfaces**: PascalCase com prefixo I opcional (`Caixao`)

### Estrutura de Componente

```typescript
// 1. Imports
import React, { useState } from 'react';
import { View, Text } from 'react-native';

// 2. Types
type Props = { ... };
interface Data { ... }

// 3. Component
export default function ComponentName() {
  // 3.1. Hooks
  const [state, setState] = useState();
  
  // 3.2. Handlers
  const handleAction = () => { ... };
  
  // 3.3. Effects
  useEffect(() => { ... }, []);
  
  // 3.4. Render
  return ( ... );
}

// 4. Styles
const styles = StyleSheet.create({ ... });
```

## 🔒 Segurança

### Boas Práticas Implementadas

- ✅ Variáveis de ambiente para Firebase config
- ✅ Reautenticação para ações sensíveis
- ✅ Validação de inputs
- ✅ Sanitização de dados
- ✅ Confirmação para ações destrutivas

### Pendências de Segurança

- [ ] Implementar rate limiting
- [ ] Adicionar CAPTCHA no cadastro
- [ ] Criptografia de dados sensíveis
- [ ] Auditoria de logs
- [ ] Implementar 2FA

## 📚 Referências

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Firebase Docs](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Docs](https://www.typescriptlang.org/)

---

**Última atualização**: Outubro 2025
**Versão**: 1.0.0
**Mantido por**: YuriAbe e equipe
