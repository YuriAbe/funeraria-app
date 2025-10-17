# 📝 Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### 🎯 Planejado
- Migração de AsyncStorage para Firebase Realtime Database
- Upload de imagens de produtos
- Sistema de carrinho de compras
- Histórico de pedidos
- Notificações push
- Dark mode
- Painel administrativo

---

## [1.0.0] - 2025-10-17

### 🎉 Lançamento Inicial

### ✨ Adicionado

#### Componentes Reutilizáveis
- **CustomButton** - Botão customizado com múltiplas variantes (primary, secondary, danger, success)
- **CustomInput** - Input com validação e suporte a erros
- **CustomHeader** - Header de página com título, subtítulo e componente direito
- **Card, CardHeader, CardContent, CardActions** - Sistema modular de cards
- **EmptyState** - Componente para estados vazios

#### Utilitários
- **validation.ts** - Funções de validação (email, senha, telefone, data, CPF)
- **formatting.ts** - Funções de formatação (preço, telefone, data, CPF) e máscaras
- **constants.ts** - Constantes do projeto (cores, tamanhos, espaçamentos, mensagens)

#### Documentação
- **ARCHITECTURE.md** - Documentação completa da arquitetura do projeto
- **CONTRIBUTING.md** - Guia de contribuição e padrões de código
- **DEVELOPMENT.md** - Guia de desenvolvimento e setup
- **COMPONENTS.md** - Documentação de componentes reutilizáveis
- **CHANGELOG.md** - Histórico de mudanças (este arquivo)

#### Estrutura de Pastas
- Criada pasta `src/components/` para componentes reutilizáveis
- Criada pasta `src/utils/` para utilitários
- Criada pasta `docs/` para documentação

---

## [0.9.0] - 2025-10-XX

### ✨ Adicionado
- Sistema CRUD completo para todos os serviços
  - Caixões (catálogo)
  - Contratos de caixão
  - Terrenos para sepultamento
  - Jazigos familiares
  - Decorações de cemitério
  - Lápides personalizadas

### 🔧 Modificado
- Melhorias na tela de Perfil
- Edição inline de campos de perfil
- Confirmação de exclusão de conta com senha

---

## [0.8.0] - 2025-10-XX

### ✨ Adicionado
- Tela principal da funerária (MainScreen)
- Sistema de navegação por categorias
- Cards de serviços interativos
- Botão de atendimento 24h

### 🔧 Modificado
- Melhorias no design geral
- Paleta de cores por tipo de serviço
- Ícones para cada categoria

---

## [0.7.0] - 2025-10-XX

### ✨ Adicionado
- Tela de perfil do usuário (ProfileScreen)
- Edição de nome e email
- Edição de cidade, telefone e data de nascimento
- Alteração de senha com reautenticação
- Exclusão de conta com confirmação
- Persistência de dados de perfil com AsyncStorage

### 🔧 Modificado
- Máscaras para telefone e data de nascimento
- Validações aprimoradas

---

## [0.6.0] - 2025-10-XX

### ✨ Adicionado
- Tela de cadastro (CadastroScreen)
- Validação de email e senha
- Integração com Firebase Authentication
- Mensagens de erro amigáveis

### 🔧 Modificado
- Fluxo de navegação entre Login e Cadastro
- Design consistente com tela de login

---

## [0.5.0] - 2025-10-XX

### ✨ Adicionado
- Tela de login funcional (LoginScreen)
- Link "Esqueci minha senha"
- Link para tela de cadastro
- Validações básicas de formulário

### 🔧 Modificado
- Design da tela de login
- Melhorias de UX

---

## [0.4.0] - 2025-10-XX

### ✨ Adicionado
- Configuração do Firebase
- Firebase Authentication (email/senha)
- Firebase Realtime Database (preparação)
- Arquivo de serviço `connectionFirebase.tsx`

### 🔒 Segurança
- Variáveis de ambiente para credenciais Firebase
- Gitignore atualizado para não commitar .env

---

## [0.3.0] - 2025-10-XX

### ✨ Adicionado
- Sistema de navegação com React Navigation
- Stack Navigator configurado
- Navegação entre HomeScreen e LoginScreen

### 🔧 Modificado
- Estrutura do App.tsx para suportar navegação

---

## [0.2.0] - 2025-10-XX

### ✨ Adicionado
- Tela inicial (HomeScreen)
- Logo da funerária
- Mensagem de boas-vindas
- Botão "Assinar plano"
- Design profissional e limpo

### 📁 Estrutura
- Criada pasta `assets/` para recursos
- Criada pasta `src/screens/` para telas

---

## [0.1.0] - 2025-10-XX

### 🎉 Inicial
- Configuração inicial do projeto com Expo
- Setup do TypeScript
- Configuração do React Native
- README.md básico
- Package.json com dependências principais

### 📦 Dependências
- React 19.0.0
- React Native 0.79.6
- Expo ~53.0.22
- TypeScript 5.8.3
- React Navigation 6.1.18
- Firebase 12.2.1
- AsyncStorage 1.24.0

---

## Tipos de Mudanças

- `✨ Adicionado` - Novas funcionalidades
- `🔧 Modificado` - Mudanças em funcionalidades existentes
- `❌ Removido` - Funcionalidades removidas
- `🐛 Corrigido` - Correção de bugs
- `🔒 Segurança` - Correções de vulnerabilidades
- `📚 Documentação` - Mudanças na documentação
- `🎨 Estilo` - Mudanças de formatação/estilo
- `⚡ Performance` - Melhorias de performance
- `♻️ Refatoração` - Refatoração de código

---

## Links

- [Repositório](https://github.com/YuriAbe/funeraria-app)
- [Issues](https://github.com/YuriAbe/funeraria-app/issues)
- [Pull Requests](https://github.com/YuriAbe/funeraria-app/pulls)

---

**Formato de Versionamento**: [MAJOR.MINOR.PATCH]
- **MAJOR**: Mudanças incompatíveis com versões anteriores
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis
