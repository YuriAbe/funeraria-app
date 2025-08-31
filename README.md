# 🏥 Funerária Bom Descanso - App

Aplicação React Native para a funerária com interface limpa e profissional.

## 🚀 Como executar

### Pré-requisitos
- Node.js instalado
- Expo CLI instalado: `npm install -g @expo/cli`

### Passos para executar

1. **Navegar para a pasta:**
   ```bash
   cd yurin
   ```

2. **Instalar dependências:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Instalar dependências de navegação (se necessário):**
   ```bash
   npm install @react-navigation/native @react-navigation/stack react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens --legacy-peer-deps
   ```

4. **Iniciar a aplicação:**
   ```bash
   npm start
   ```

5. **Alternativas de execução:**
   - **Web:** Pressione `w` no terminal
   - **Android:** Pressione `a` no terminal
   - **iOS:** Pressione `i` no terminal

## 📱 Funcionalidades

- ✅ Logo da funerária centralizada
- ✅ Mensagem de boas-vindas
- ✅ Botão "Assinar plano" com navegação
- ✅ Tela de login funcional
- ✅ Navegação entre telas
- ✅ Interface responsiva

## 🛠️ Tecnologias

- React Native
- Expo
- TypeScript
- Metro bundler

## 📁 Estrutura do projeto

```
yurin/
├── App.tsx                    # Ponto de entrada principal
├── index.ts                   # Registro do componente
├── package.json               # Dependências
├── assets/                    # Imagens e recursos
├── src/
│   ├── screens/              # Telas da aplicação
│   │   ├── HomeScreen.tsx    # Tela inicial
│   │   └── LoginScreen.tsx   # Tela de login
│   └── navigation/           # Configuração de navegação
│       └── AppNavigator.tsx  # Navegador principal
└── README.md                  # Este arquivo
```

## 🔧 Comandos úteis

### Limpar cache
```bash
npx expo start --clear
```

### Reinstalar dependências
```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

### Parar aplicação
Pressione `Ctrl + C` no terminal

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Se todas as dependências foram instaladas
2. Se o Metro bundler está rodando
3. Se não há conflitos de porta

## 🎯 Pronto para uso!

A aplicação está configurada e funcionando. Basta seguir os passos acima para executar!
