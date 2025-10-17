# 🤝 Guia de Contribuição

## 📋 Índice

- [Como Contribuir](#como-contribuir)
- [Padrões de Código](#padrões-de-código)
- [Estrutura de Commits](#estrutura-de-commits)
- [Fluxo de Trabalho Git](#fluxo-de-trabalho-git)
- [Testando Mudanças](#testando-mudanças)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Funcionalidades](#sugerindo-funcionalidades)

## 🚀 Como Contribuir

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/YuriAbe/funeraria-app.git
cd funeraria-app

# Adicione o repositório original como upstream
git remote add upstream https://github.com/YuriAbe/funeraria-app.git
```

### 2. Instale as Dependências

```bash
npm install --legacy-peer-deps
```

### 3. Configure o Ambiente

Crie um arquivo `.env` na raiz do projeto (nunca commite este arquivo!):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

### 4. Crie uma Branch

```bash
# Sempre crie uma nova branch para suas mudanças
git checkout -b feature/nome-da-funcionalidade
# ou
git checkout -b fix/nome-do-bug
```

## 📝 Padrões de Código

### TypeScript

- **Use tipagem explícita** sempre que possível
- **Evite `any`** - prefira `unknown` se necessário
- **Use interfaces** para objetos complexos
- **Export default** para componentes principais

```typescript
// ✅ BOM
interface User {
  id: string;
  name: string;
  email: string;
}

const handleUser = (user: User): void => {
  // ...
}

// ❌ RUIM
const handleUser = (user: any) => {
  // ...
}
```

### Componentes React

```typescript
// ✅ BOM - Estrutura organizada
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
}

export default function MyComponent({ title, onPress }: Props) {
  // 1. Estados
  const [loading, setLoading] = useState(false);
  
  // 2. Efeitos
  useEffect(() => {
    // ...
  }, []);
  
  // 3. Handlers
  const handleAction = () => {
    // ...
  };
  
  // 4. Render
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
}

// 5. Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

### Estilos

- **Use StyleSheet.create()** para performance
- **Agrupe estilos relacionados**
- **Nomeie estilos descritivamente**
- **Evite estilos inline** (exceto dinâmicos)

```typescript
// ✅ BOM
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
  },
  primaryButton: {
    backgroundColor: '#3a4774',
    padding: 15,
    borderRadius: 10,
  },
});

// ❌ RUIM - estilos inline
<View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
```

### Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes | PascalCase | `CaixaoListScreen.tsx` |
| Funções | camelCase | `loadCaixoes()` |
| Constantes | UPPER_SNAKE_CASE | `API_KEY` |
| Interfaces | PascalCase | `interface User {}` |
| Estilos | camelCase | `primaryButton` |
| Arquivos | PascalCase para componentes | `ProfileScreen.tsx` |

## 📌 Estrutura de Commits

### Padrão Conventional Commits

Use o formato: `tipo(escopo): descrição`

#### Tipos de Commit

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Mudanças na documentação
- **style**: Formatação, missing semi colons, etc (não afeta o código)
- **refactor**: Refatoração de código
- **test**: Adição ou correção de testes
- **chore**: Tarefas de build, configs, etc

#### Exemplos

```bash
# Nova funcionalidade
git commit -m "feat(caixao): adiciona filtro por material no catálogo"

# Correção de bug
git commit -m "fix(login): corrige validação de email"

# Documentação
git commit -m "docs(readme): atualiza instruções de instalação"

# Refatoração
git commit -m "refactor(profile): extrai lógica de máscaras para utils"

# Estilo/formatação
git commit -m "style(main): ajusta espaçamento dos cards"

# Chore
git commit -m "chore: atualiza dependências do projeto"
```

### Mensagens de Commit

- **Use português** (projeto brasileiro)
- **Seja descritivo** mas conciso
- **Use imperativo**: "adiciona" não "adicionado"
- **Primeira linha**: máximo 72 caracteres
- **Corpo (opcional)**: explique o "porquê", não o "o quê"

```bash
# ✅ BOM
git commit -m "feat(caixao): adiciona validação de preço mínimo

Implementa validação para evitar cadastro de caixões
com preço menor que R$ 100,00"

# ❌ RUIM
git commit -m "mudanças"
git commit -m "fix"
git commit -m "atualizações no código"
```

## 🌿 Fluxo de Trabalho Git

### 1. Mantenha sua Branch Atualizada

```bash
# Antes de começar a trabalhar
git checkout main
git pull upstream main

# Atualize sua feature branch
git checkout feature/minha-funcionalidade
git rebase main
```

### 2. Faça Commits Pequenos e Frequentes

```bash
# Adicione arquivos específicos
git add src/screens/NovaScreen.tsx
git commit -m "feat(nova): adiciona tela de novo recurso"

# Não use "git add ." sem revisar antes
git status  # Sempre revise antes
git add -p  # Adicione interativamente
```

### 3. Push e Pull Request

```bash
# Push para seu fork
git push origin feature/minha-funcionalidade

# Crie Pull Request no GitHub
# - Descreva as mudanças
# - Referencie issues relacionadas
# - Adicione screenshots se relevante
```

### 4. Template de Pull Request

```markdown
## Descrição
Breve descrição das mudanças realizadas.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. Resultado esperado

## Screenshots (se aplicável)
[Adicione screenshots aqui]

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Comentei código complexo
- [ ] Atualizei a documentação
- [ ] Testei em Android
- [ ] Testei em iOS (se possível)
```

## 🧪 Testando Mudanças

### Antes de Commitar

```bash
# 1. Limpe o cache
npx expo start --clear

# 2. Teste em plataforma(s)
# - Web: pressione 'w'
# - Android: pressione 'a' (ou use dispositivo real)
# - iOS: pressione 'i' (requer macOS)

# 3. Verifique erros no console
# - Sem warnings desnecessários
# - Sem erros de TypeScript
# - Navegação funcionando
```

### Checklist de Testes

- [ ] App inicia sem erros
- [ ] Navegação entre telas funciona
- [ ] Formulários validam corretamente
- [ ] Dados são salvos no AsyncStorage
- [ ] Botões e ações respondem
- [ ] UI está responsiva
- [ ] Não há console.log desnecessários

## 🐛 Reportando Bugs

### Template de Issue

```markdown
## Descrição do Bug
Descrição clara e concisa do problema.

## Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## Comportamento Esperado
O que deveria acontecer.

## Comportamento Atual
O que está acontecendo.

## Screenshots
Se aplicável, adicione screenshots.

## Ambiente
- OS: [ex: Windows 10, macOS 12]
- Plataforma: [Android, iOS, Web]
- Versão: [ex: 1.0.0]
- Device: [ex: iPhone 12, Pixel 5]

## Informações Adicionais
Qualquer outra informação relevante.
```

## 💡 Sugerindo Funcionalidades

### Template de Feature Request

```markdown
## Funcionalidade Sugerida
Descrição clara da funcionalidade.

## Problema que Resolve
Por que essa funcionalidade é necessária?

## Solução Proposta
Como você imagina que funcionaria?

## Alternativas Consideradas
Outras abordagens que você pensou.

## Informações Adicionais
Screenshots, mockups, referências, etc.
```

## 🎨 Padrões de UI

### Cores

Use as cores definidas no projeto:

```typescript
const COLORS = {
  primary: '#3a4774',
  secondary: '#2c3e50',
  success: '#27ae60',
  danger: '#e74c3c',
  // ... veja ARCHITECTURE.md para lista completa
};
```

### Componentes Reutilizáveis

Ao criar novos componentes:

1. **Verifique se já existe** similar no projeto
2. **Torne-o reutilizável** se possível
3. **Documente props** com TypeScript
4. **Siga padrões visuais** existentes

## 📚 Recursos Úteis

- [React Native Docs](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ❓ Precisa de Ajuda?

- Abra uma [Issue](https://github.com/YuriAbe/funeraria-app/issues)
- Entre em contato com os mantenedores
- Revise a [documentação do projeto](./ARCHITECTURE.md)

---

**Obrigado por contribuir! 🚀**
