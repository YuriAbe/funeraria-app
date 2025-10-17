# 📐 Especificação Técnica - Funerária App

> **Projeto**: Funerária App  
> **Versão**: 1.0.0  
> **Data**: 17 de Outubro de 2025  
> **Tipo**: Aplicação Mobile (iOS, Android, Web)  
> **Framework**: React Native + Expo

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Requisitos do Sistema](#requisitos-do-sistema)
3. [Arquitetura](#arquitetura)
4. [Especificação de Componentes](#especificação-de-componentes)
5. [Especificação de Telas](#especificação-de-telas)
6. [Especificação de Dados](#especificação-de-dados)
7. [Especificação de API](#especificação-de-api)
8. [Design System](#design-system)
9. [Fluxos de Usuário](#fluxos-de-usuário)
10. [Testes](#testes)

---

## 🎯 Visão Geral

### Propósito
Aplicativo mobile para gerenciamento completo de serviços funerários, incluindo catálogo de produtos, gestão de contratos e perfil de usuários.

### Escopo
- Autenticação de usuários via Firebase
- CRUD de produtos (caixões, terrenos, jazigos, decorações, lápides)
- Gestão de contratos
- Perfil de usuário editável
- Armazenamento offline (AsyncStorage)

### Stakeholders
- **Desenvolvedores**: YuriAbe e equipe
- **Usuários Finais**: Funcionários de funerárias
- **Administradores**: Gestores de funerárias

---

## 💻 Requisitos do Sistema

### Dependências Principais

```json
{
  "react": "19.0.0",
  "react-native": "0.79.6",
  "expo": "~53.0.22",
  "typescript": "~5.8.3",
  "firebase": "^12.2.1",
  "@react-navigation/native": "^6.1.18",
  "@react-navigation/stack": "^6.4.1",
  "@react-native-async-storage/async-storage": "^1.24.0"
}
```

### Requisitos de Ambiente
- Node.js 16+
- Expo CLI
- Android Studio (para Android)
- Xcode (para iOS, apenas macOS)

### Requisitos de Runtime
- iOS 13+
- Android 6.0+ (API 23+)
- Navegadores modernos (para Web)

---

## 🏗️ Arquitetura

### Arquitetura de Alto Nível

```
┌─────────────────────────────────────────┐
│          Camada de Apresentação         │
│    (React Native Components + Screens)  │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│         Camada de Navegação             │
│      (React Navigation - Stack)         │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│        Camada de Lógica de Negócio      │
│     (Hooks, Utils, Validations)         │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│         Camada de Dados                 │
│  (Firebase Auth + AsyncStorage)         │
└─────────────────────────────────────────┘
```

### Estrutura de Pastas

```
src/
├── components/       # Componentes reutilizáveis
│   ├── UI/          # Componentes de interface
│   └── Layout/      # Componentes de layout
├── screens/         # Telas da aplicação
│   ├── Auth/        # Telas de autenticação
│   └── CRUD/        # Telas de operações CRUD
├── services/        # Serviços externos (Firebase)
├── utils/           # Utilitários
│   ├── validation/  # Validações
│   ├── formatting/  # Formatações
│   └── constants/   # Constantes
└── types/           # Definições TypeScript
```

---

## 🧩 Especificação de Componentes

### Component: CustomButton

**Arquivo**: `src/components/CustomButton.tsx`

**Propósito**: Botão reutilizável com múltiplas variantes de estilo.

**Props**:
```typescript
interface CustomButtonProps {
  title: string;              // Texto do botão
  onPress: () => void;        // Callback ao clicar
  variant?: 'primary' | 'secondary' | 'danger' | 'success'; // Estilo
  disabled?: boolean;         // Estado desabilitado
  style?: object;            // Estilos customizados
  fullWidth?: boolean;       // Largura total
}
```

**Variantes**:
- `primary`: Azul escuro (#3a4774) - Ações principais
- `secondary`: Transparente com borda - Ações secundárias
- `danger`: Vermelho (#e74c3c) - Ações destrutivas
- `success`: Verde (#27ae60) - Confirmações positivas

**Estados**:
- Normal
- Hover (web)
- Pressed
- Disabled

**Exemplo de Uso**:
```typescript
<CustomButton 
  title="Salvar"
  variant="primary"
  onPress={handleSave}
  disabled={loading}
/>
```

---

### Component: CustomInput

**Arquivo**: `src/components/CustomInput.tsx`

**Propósito**: Input de texto com label e validação integrada.

**Props**:
```typescript
interface CustomInputProps extends TextInputProps {
  label: string;              // Texto do label
  error?: string;             // Mensagem de erro
  required?: boolean;         // Campo obrigatório
  containerStyle?: object;    // Estilos do container
}
```

**Estados**:
- Normal
- Focused
- Error
- Disabled

**Validação**:
- Mostra asterisco vermelho (*) se `required=true`
- Exibe mensagem de erro abaixo do input
- Borda vermelha quando há erro

**Exemplo de Uso**:
```typescript
<CustomInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  error={errors.email}
  required
/>
```

---

### Component: Card

**Arquivo**: `src/components/Card.tsx`

**Propósito**: Sistema modular de cards para exibir conteúdo estruturado.

**Subcomponentes**:
- `Card` - Container principal
- `CardHeader` - Cabeçalho
- `CardContent` - Conteúdo
- `CardActions` - Ações (botões)

**Props Card**:
```typescript
interface CardProps {
  children: React.ReactNode;
  style?: object;
  onPress?: () => void;      // Torna o card clicável
  borderColor?: string;      // Cor da borda esquerda
}
```

**Exemplo de Uso**:
```typescript
<Card borderColor="#3a4774" onPress={handleCardPress}>
  <CardHeader>
    <Text style={styles.title}>Título</Text>
  </CardHeader>
  <CardContent>
    <Text>Conteúdo do card</Text>
  </CardContent>
  <CardActions>
    <CustomButton title="Editar" variant="info" />
    <CustomButton title="Deletar" variant="danger" />
  </CardActions>
</Card>
```

---

### Component: CustomHeader

**Arquivo**: `src/components/CustomHeader.tsx`

**Propósito**: Header de página com título e componente direito opcional.

**Props**:
```typescript
interface HeaderProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  rightComponent?: React.ReactNode;
}
```

**Exemplo de Uso**:
```typescript
<CustomHeader
  title="Catálogo de Produtos"
  subtitle="Gerencie seus produtos"
  rightComponent={
    <CustomButton title="+ Novo" onPress={handleNew} />
  }
/>
```

---

### Component: EmptyState

**Arquivo**: `src/components/EmptyState.tsx`

**Propósito**: Componente para exibir estado vazio de listas.

**Props**:
```typescript
interface EmptyStateProps {
  icon?: 'logo' | 'empty';
  title: string;
  message: string;
  iconSource?: any;
}
```

**Exemplo de Uso**:
```typescript
<EmptyState
  icon="logo"
  title="Nenhum item encontrado"
  message="Clique em 'Novo' para adicionar o primeiro item"
/>
```

---

## 📱 Especificação de Telas

### Screen: HomeScreen

**Arquivo**: `src/screens/HomeScreen.tsx`

**Rota**: `/` (initial)

**Propósito**: Tela de boas-vindas inicial do aplicativo.

**Elementos**:
- Logo da funerária (centralizada)
- Mensagem de boas-vindas
- Botão "Entrar" → navega para Login
- Botão "Criar Conta" → navega para Cadastro

**Navegação**:
```typescript
navigation.navigate('Login');
navigation.navigate('Cadastro');
```

---

### Screen: LoginScreen

**Arquivo**: `src/screens/LoginScreen.tsx`

**Rota**: `/login`

**Propósito**: Autenticação de usuários existentes.

**Campos**:
- Email (TextInput, tipo email)
- Senha (TextInput, secureTextEntry)

**Validações**:
- Email: formato válido
- Senha: mínimo 6 caracteres

**Ações**:
- Botão "Entrar" → autentica via Firebase
- Link "Esqueci minha senha" → (futuro)
- Link "Criar conta" → navega para Cadastro

**Fluxo de Sucesso**:
```
Input credenciais → Validar → Firebase Auth → Navigate to Main
```

**Fluxo de Erro**:
```
Input credenciais → Validar → Firebase Auth → Show error Alert
```

---

### Screen: CadastroScreen

**Arquivo**: `src/screens/CadastroScreen.tsx`

**Rota**: `/cadastro`

**Propósito**: Registro de novos usuários.

**Campos**:
- Nome (TextInput)
- Email (TextInput, tipo email)
- Senha (TextInput, secureTextEntry)
- Confirmar Senha (TextInput, secureTextEntry)

**Validações**:
- Nome: não vazio
- Email: formato válido + único
- Senha: mínimo 6 caracteres
- Confirmar Senha: igual à senha

**Ações**:
- Botão "Criar Conta" → cria usuário no Firebase
- Link "Já tenho conta" → navega para Login

**Fluxo de Sucesso**:
```
Input dados → Validar → Firebase createUser → Navigate to Main
```

---

### Screen: MainScreen

**Arquivo**: `src/screens/MainScreen.tsx`

**Rota**: `/main`

**Propósito**: Dashboard principal com acesso a todos os serviços.

**Seções**:

1. **Header**
   - Logo (clicável → Profile)
   - Botão "Sair"

2. **Filtros de Categoria**
   - Scroll horizontal
   - Categorias: Todos, Caixões, Terrenos, Decoração, Lápides

3. **Grid de Serviços** (2 colunas)
   - Contratos de Caixão
   - Catálogo de Caixões
   - Terrenos para Sepultamento
   - Jazigos Familiares
   - Decorações de Cemitério
   - Personalização de Lápides
   - Serviços Funerários (placeholder)
   - Transporte Funerário (placeholder)
   - Documentação (placeholder)

4. **Atendimento 24h**
   - Card destacado
   - Botão "Ligar Agora"

**Navegação**:
```typescript
// Para serviços implementados
navigation.navigate('CaixaoList');
navigation.navigate('ContratoList');
// etc...

// Para serviços não implementados
Alert.alert('Em Breve', 'Funcionalidade em desenvolvimento');
```

---

### Screen: ProfileScreen

**Arquivo**: `src/screens/ProfileScreen.tsx`

**Rota**: `/profile`

**Propósito**: Visualização e edição de dados do usuário.

**Campos Editáveis**:
- Nome (edição inline)
- Email (edição inline)
- Cidade (edição inline)
- Telefone (edição inline, com máscara)
- Data de Nascimento (edição inline, com máscara)
- Senha (modal de edição)

**Ações**:
- Editar cada campo individualmente
- Salvar alterações (persiste no AsyncStorage)
- Alterar senha (requer senha atual)
- Deletar conta (requer confirmação + senha)

**Validações**:
- Email: formato válido
- Telefone: 10 ou 11 dígitos
- Data: DD/MM/AAAA válida
- Senha: mínimo 6 caracteres

**Segurança**:
- Reautenticação obrigatória para:
  - Alterar senha
  - Deletar conta

---

### Screen: CaixaoListScreen

**Arquivo**: `src/screens/CaixaoListScreen.tsx`

**Rota**: `/caixao/list`

**Propósito**: Listagem de caixões cadastrados.

**Componentes**:
- Header com botão "+ Novo Caixão"
- FlatList de cards
- EmptyState quando vazio

**Card de Caixão**:
- Nome (título)
- Preço (destaque verde)
- Material
- Cor
- Descrição
- Botões: Editar, Deletar

**Ações**:
- Criar novo → navigate to CaixaoForm
- Editar → navigate to CaixaoForm com dados
- Deletar → confirmação → remove do AsyncStorage

**Dados**:
```typescript
interface Caixao {
  id: string;
  nome: string;
  material: string;
  cor: string;
  preco: string;
  descricao: string;
  createdAt: string;
}
```

---

### Screen: CaixaoFormScreen

**Arquivo**: `src/screens/CaixaoFormScreen.tsx`

**Rota**: `/caixao/form`

**Propósito**: Criação/edição de caixões.

**Modo**: Create ou Edit (baseado em params)

**Campos**:
- Nome * (máx 50 caracteres)
- Material * (máx 30 caracteres)
- Cor * (máx 25 caracteres)
- Preço * (numérico, com máscara)
- Descrição (máx 200 caracteres, multiline)

**Validações**:
- Campos com * são obrigatórios
- Preço > 0
- Todos os textos: trim()

**Ações**:
- Cancelar → volta para lista
- Salvar → valida → salva no AsyncStorage → volta para lista

**Máscaras**:
- Preço: converte para formato decimal (1234 → 12.34)

---

### Screens CRUD (Padrão Similar)

As seguintes telas seguem o mesmo padrão de CaixaoList/Form:

| Entidade | List Screen | Form Screen |
|----------|-------------|-------------|
| Contratos | ContratoListScreen | ContratoFormScreen |
| Terrenos | TerrenoListScreen | TerrenoFormScreen |
| Jazigos | JazigoListScreen | JazigoFormScreen |
| Decorações | DecoracaoListScreen | DecoracaoFormScreen |
| Lápides | LapideListScreen | LapideFormScreen |

**Cores por Entidade**:
- Contratos: #8B4513 (Marrom)
- Caixões: #654321 (Marrom escuro)
- Terrenos: #228B22 (Verde)
- Jazigos: #696969 (Cinza)
- Decorações: #FF69B4 (Rosa)
- Lápides: #A9A9A9 (Cinza claro)

---

## 💾 Especificação de Dados

### Modelo de Dados: User

**Storage**: Firebase Authentication + AsyncStorage

```typescript
interface User {
  uid: string;              // Firebase UID
  email: string;
  displayName?: string;
  photoURL?: string;
  
  // Dados locais (AsyncStorage)
  cidade?: string;
  phoneNumber?: string;     // Apenas números
  dataNascimento?: string;  // DDMMAAAA
}
```

**AsyncStorage Key**: `profile_${userId}`

---

### Modelo de Dados: Caixao

**Storage**: AsyncStorage (key: `caixoes`)

```typescript
interface Caixao {
  id: string;              // timestamp único
  nome: string;
  material: string;
  cor: string;
  preco: string;           // decimal como string
  descricao: string;
  createdAt: string;       // ISO date
}
```

**Formato no AsyncStorage**:
```json
[
  {
    "id": "1697456789012",
    "nome": "Caixão Tradicional Mogno",
    "material": "Mogno",
    "cor": "Natural",
    "preco": "5000.00",
    "descricao": "Caixão de mogno maciço...",
    "createdAt": "2025-10-17T10:30:00Z"
  }
]
```

---

### Modelo de Dados: Contrato

**Storage**: AsyncStorage (key: `contratos`)

```typescript
interface Contrato {
  id: string;
  caixaoId: string;        // Referência ao caixão
  nomeCliente: string;
  cpfCliente: string;
  telefoneCliente: string;
  endereco: string;
  valorTotal: string;
  formaPagamento: 'pix' | 'cartao' | 'dinheiro' | 'boleto';
  status: 'pendente' | 'confirmado' | 'cancelado';
  observacoes?: string;
  createdAt: string;
}
```

---

### Modelo de Dados: Terreno

**Storage**: AsyncStorage (key: `terrenos`)

```typescript
interface Terreno {
  id: string;
  localizacao: string;     // Setor/Quadra
  numero: string;
  metragem: string;        // em m²
  tipo: 'perpetuo' | 'temporario';
  preco: string;
  disponivel: boolean;
  observacoes?: string;
  createdAt: string;
}
```

---

### Modelo de Dados: Jazigo

**Storage**: AsyncStorage (key: `jazigos`)

```typescript
interface Jazigo {
  id: string;
  localizacao: string;
  capacidade: number;      // número de corpos
  tipo: 'simples' | 'duplo' | 'familia';
  material: string;
  preco: string;
  disponivel: boolean;
  observacoes?: string;
  createdAt: string;
}
```

---

### Modelo de Dados: Decoracao

**Storage**: AsyncStorage (key: `decoracoes`)

```typescript
interface Decoracao {
  id: string;
  nome: string;
  tipo: 'flores' | 'coroas' | 'arranjos' | 'outros';
  descricao: string;
  preco: string;
  disponivel: boolean;
  createdAt: string;
}
```

---

### Modelo de Dados: Lapide

**Storage**: AsyncStorage (key: `lapides`)

```typescript
interface Lapide {
  id: string;
  material: string;        // Granito, Mármore, etc
  cor: string;
  dimensoes: string;       // LxAxP
  tipo: string;            // Vertical, Horizontal
  preco: string;
  personalizacoes?: string; // Gravações incluídas
  createdAt: string;
}
```

---

## 🔌 Especificação de API

### Firebase Authentication

**Service**: `src/services/connectionFirebase.tsx`

**Métodos Utilizados**:

```typescript
// Criar usuário
createUserWithEmailAndPassword(auth, email, password)

// Login
signInWithEmailAndPassword(auth, email, password)

// Logout
signOut(auth)

// Atualizar email
updateEmail(user, newEmail)

// Atualizar senha
updatePassword(user, newPassword)

// Reautenticar
reauthenticateWithCredential(user, credential)

// Deletar usuário
deleteUser(user)

// Observer de estado
onAuthStateChanged(auth, callback)
```

**Error Codes Tratados**:
- `auth/email-already-in-use`
- `auth/invalid-email`
- `auth/user-not-found`
- `auth/wrong-password`
- `auth/weak-password`
- `auth/requires-recent-login`

---

### AsyncStorage

**Métodos Utilizados**:

```typescript
// Salvar
await AsyncStorage.setItem(key, JSON.stringify(data));

// Ler
const stored = await AsyncStorage.getItem(key);
const data = stored ? JSON.parse(stored) : defaultValue;

// Remover
await AsyncStorage.removeItem(key);

// Limpar tudo
await AsyncStorage.clear();
```

**Keys Utilizadas**:
- `caixoes`
- `contratos`
- `terrenos`
- `jazigos`
- `decoracoes`
- `lapides`
- `profile_${userId}`

---

## 🎨 Design System

### Paleta de Cores

```typescript
const COLORS = {
  // Cores principais
  primary: '#3a4774',      // Azul escuro
  secondary: '#2c3e50',    // Cinza escuro
  
  // Feedback
  success: '#27ae60',      // Verde
  danger: '#e74c3c',       // Vermelho
  warning: '#DAA520',      // Dourado
  info: '#3498db',         // Azul claro
  
  // Neutras
  background: '#f8f9fa',   // Cinza muito claro
  white: '#ffffff',
  black: '#000000',
  
  // Texto
  text: '#2c3e50',         // Texto principal
  textSecondary: '#7f8c8d', // Texto secundário
  textLight: '#6c757d',    // Texto claro
  
  // Bordas
  border: '#e9ecef',
  borderDark: '#dee2e6',
  
  // Serviços (cada tipo tem sua cor)
  caixao: '#654321',
  contrato: '#8B4513',
  terreno: '#228B22',
  jazigo: '#696969',
  decoracao: '#FF69B4',
  lapide: '#A9A9A9',
};
```

### Tipografia

```typescript
const FONT_SIZES = {
  tiny: 10,
  small: 12,
  regular: 14,
  medium: 16,
  large: 18,
  xlarge: 20,
  xxlarge: 24,
  huge: 28,
  giant: 32,
};

const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};
```

### Espaçamentos

```typescript
const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  huge: 32,
};
```

### Raios de Borda

```typescript
const BORDER_RADIUS = {
  small: 5,
  medium: 10,
  large: 15,
  xlarge: 20,
  round: 50,
};
```

### Sombras

```typescript
const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};
```

### Ícones

**Tipo**: Emojis (Unicode)

```typescript
const SERVICE_ICONS = {
  caixao: '📦',
  contrato: '⚰️',
  terreno: '🏞️',
  jazigo: '🏛️',
  decoracao: '🌸',
  lapide: '🗿',
  servicos: '🕯️',
  transporte: '🚗',
  documentacao: '📋',
};
```

---

## 🔄 Fluxos de Usuário

### Fluxo 1: Primeiro Acesso

```
Home → Cadastro → [Validação] → Firebase Auth → Main → Explorar Serviços
```

**Steps**:
1. Usuário abre app → HomeScreen
2. Clica em "Criar Conta" → CadastroScreen
3. Preenche nome, email, senha
4. Valida dados localmente
5. Cria conta no Firebase
6. Redireciona para MainScreen
7. Explora categorias de serviços

---

### Fluxo 2: Login

```
Home → Login → [Validação] → Firebase Auth → Main
```

**Steps**:
1. Usuário abre app → HomeScreen
2. Clica em "Entrar" → LoginScreen
3. Insere email e senha
4. Valida credenciais no Firebase
5. Redireciona para MainScreen

---

### Fluxo 3: Criar Produto (Caixão)

```
Main → CaixaoList → CaixaoForm → [Validação] → AsyncStorage → CaixaoList
```

**Steps**:
1. MainScreen → clica em "Catálogo de Caixões"
2. CaixaoListScreen → clica em "+ Novo Caixão"
3. CaixaoFormScreen → preenche dados
4. Valida campos obrigatórios
5. Salva no AsyncStorage (key: caixoes)
6. Retorna para CaixaoListScreen
7. Produto aparece na lista

---

### Fluxo 4: Editar Produto

```
CaixaoList → [Selecionar] → CaixaoForm (preenchido) → [Editar] → AsyncStorage → CaixaoList
```

**Steps**:
1. CaixaoListScreen → clica em "Editar" no card
2. CaixaoFormScreen abre com dados preenchidos
3. Usuário altera campos
4. Valida e salva
5. Atualiza no AsyncStorage
6. Retorna para lista atualizada

---

### Fluxo 5: Deletar Produto

```
CaixaoList → [Selecionar] → Confirmação → AsyncStorage → CaixaoList
```

**Steps**:
1. CaixaoListScreen → clica em "Deletar"
2. Alert de confirmação
3. Se confirmar → remove do AsyncStorage
4. Lista atualiza automaticamente

---

### Fluxo 6: Editar Perfil

```
Main → Profile → [Editar Campo] → [Salvar] → AsyncStorage → Profile
```

**Steps**:
1. MainScreen → clica na logo
2. ProfileScreen abre
3. Clica no ícone de edição de um campo
4. Input fica editável
5. Altera valor
6. Clica em "Salvar"
7. Valida
8. Salva no AsyncStorage (profile_userId)
9. Campo volta para modo leitura

---

### Fluxo 7: Alterar Senha

```
Profile → [Editar Senha] → [Inserir Senhas] → Reautenticação → Firebase → Profile
```

**Steps**:
1. ProfileScreen → clica em editar senha
2. Modal/seção expande
3. Insere senha atual
4. Insere nova senha
5. Clica em "Salvar"
6. Sistema reautentica com senha atual
7. Atualiza senha no Firebase
8. Sucesso → fecha modal

---

### Fluxo 8: Deletar Conta

```
Profile → [Deletar Conta] → Confirmação → [Senha] → Reautenticação → Firebase → Home
```

**Steps**:
1. ProfileScreen → clica em "Deletar Conta"
2. Seção de confirmação aparece
3. Insere senha para confirmar
4. Clica em "Confirmar"
5. Sistema reautentica
6. Deleta usuário do Firebase
7. Redireciona para HomeScreen
8. Dados locais podem ser limpos

---

## 🧪 Testes

### Testes Manuais

**Checklist de Autenticação**:
- [ ] Cadastro com email válido
- [ ] Cadastro com email duplicado (deve falhar)
- [ ] Cadastro com senha curta (deve falhar)
- [ ] Login com credenciais corretas
- [ ] Login com credenciais incorretas (deve falhar)
- [ ] Logout

**Checklist CRUD**:
- [ ] Criar item
- [ ] Listar itens
- [ ] Editar item
- [ ] Deletar item (com confirmação)
- [ ] Validações de campos obrigatórios
- [ ] Persistência após fechar app

**Checklist Perfil**:
- [ ] Editar nome
- [ ] Editar email
- [ ] Editar cidade
- [ ] Editar telefone (máscara correta)
- [ ] Editar data nascimento (máscara correta)
- [ ] Alterar senha (reautenticação funciona)
- [ ] Deletar conta (confirmação + senha)

**Checklist UI/UX**:
- [ ] Navegação entre telas funciona
- [ ] Botões respondem ao toque
- [ ] Inputs focam corretamente
- [ ] Teclado não cobre campos
- [ ] Estados vazios aparecem
- [ ] Mensagens de erro são claras
- [ ] Loading states aparecem

---

### Cenários de Teste

#### Cenário 1: Novo Usuário Cadastra e Cria Produto

**Pré-condição**: App instalado, usuário não cadastrado

**Steps**:
1. Abrir app
2. Clicar em "Criar Conta"
3. Preencher: Nome="João Silva", Email="joao@test.com", Senha="123456"
4. Clicar em "Criar Conta"
5. Verificar redirecionamento para Main
6. Clicar em "Catálogo de Caixões"
7. Clicar em "+ Novo Caixão"
8. Preencher: Nome="Caixão Mogno", Material="Mogno", Cor="Natural", Preço="5000"
9. Clicar em "Salvar"
10. Verificar produto na lista

**Resultado Esperado**: Produto aparece na lista, dados persistem após fechar/abrir app

---

#### Cenário 2: Usuário Edita Perfil

**Pré-condição**: Usuário logado

**Steps**:
1. Navegar para Profile
2. Clicar em editar "Telefone"
3. Digitar "11987654321"
4. Verificar máscara: "(11) 98765-4321"
5. Clicar em "Salvar"
6. Fechar app
7. Abrir app novamente
8. Navegar para Profile
9. Verificar telefone salvo

**Resultado Esperado**: Telefone formatado corretamente e persistido

---

#### Cenário 3: Validação de Formulário

**Pré-condição**: Usuário em tela de formulário

**Steps**:
1. Abrir CaixaoFormScreen
2. Deixar todos os campos vazios
3. Clicar em "Salvar"
4. Verificar mensagens de erro em campos obrigatórios
5. Preencher Nome
6. Clicar em "Salvar"
7. Verificar erro apenas em campos restantes
8. Preencher todos os campos
9. Clicar em "Salvar"
10. Verificar sucesso

**Resultado Esperado**: Validações corretas, mensagens claras

---

## 📊 Métricas e KPIs

### Métricas de Performance

- **Cold Start**: < 3 segundos
- **Time to Interactive**: < 2 segundos
- **Bundle Size**: < 50 MB
- **Memory Usage**: < 200 MB

### Métricas de Qualidade

- **Crash-free Rate**: > 99%
- **Load Time**: < 1 segundo para listas
- **Form Validation**: Instantânea
- **Navigation**: < 300ms

---

## 🔐 Segurança

### Autenticação
- Firebase Authentication (email/senha)
- Tokens gerenciados pelo Firebase SDK
- Sessões persistem automaticamente

### Validações
- Client-side: Todos os formulários
- Server-side: Firebase Rules (futuro)

### Dados Sensíveis
- Senhas: Nunca armazenadas localmente
- Credenciais Firebase: Variáveis de ambiente

### Permissões
- Leitura: Usuário autenticado
- Escrita: Apenas dados próprios
- Admin: (futuro) roles no Firebase

---

## 🚀 Deploy

### Ambientes

**Desenvolvimento**:
- Local: `npx expo start`
- Hot Reload habilitado

**Staging**:
- Expo Updates (OTA)
- Branch: `develop`

**Produção**:
- iOS App Store
- Google Play Store
- Web: Netlify/Vercel

### Build Commands

```bash
# Android APK
eas build --platform android --profile preview

# iOS IPA
eas build --platform ios --profile preview

# Production builds
eas build --platform all --profile production
```

---

## 📝 Changelog

Ver arquivo [CHANGELOG.md](../CHANGELOG.md) para histórico completo.

---

## 📞 Contatos

**Repositório**: https://github.com/YuriAbe/funeraria-app  
**Issues**: https://github.com/YuriAbe/funeraria-app/issues  
**Documentação**: Ver pasta `/docs`

---

<p align="center">
  <strong>Especificação Técnica v1.0.0</strong><br>
  <sub>Gerado em 17/10/2025</sub>
</p>
