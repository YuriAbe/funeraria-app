# 📚 Documentação de Componentes Reutilizáveis

## 🎨 Componentes UI

### CustomButton

Botão customizado com múltiplos estilos.

```typescript
import CustomButton from '@/components/CustomButton';

<CustomButton
  title="Salvar"
  onPress={handleSave}
  variant="primary" // 'primary' | 'secondary' | 'danger' | 'success'
  disabled={false}
  fullWidth={true}
/>
```

**Props:**
- `title` (string) - Texto do botão
- `onPress` (function) - Função ao clicar
- `variant` (string, opcional) - Estilo do botão
- `disabled` (boolean, opcional) - Se desabilitado
- `fullWidth` (boolean, opcional) - Largura total
- `style` (object, opcional) - Estilos customizados

**Variantes:**
- `primary` - Azul escuro (#3a4774)
- `secondary` - Transparente com borda
- `danger` - Vermelho (#e74c3c)
- `success` - Verde (#27ae60)

---

### CustomInput

Input customizado com validação e label.

```typescript
import CustomInput from '@/components/CustomInput';

<CustomInput
  label="Nome Completo"
  value={name}
  onChangeText={setName}
  placeholder="Digite seu nome"
  error={errors.name}
  required={true}
/>
```

**Props:**
- `label` (string) - Texto do label
- `value` (string) - Valor do input
- `onChangeText` (function) - Callback de mudança
- `error` (string, opcional) - Mensagem de erro
- `required` (boolean, opcional) - Campo obrigatório
- `multiline` (boolean, opcional) - Múltiplas linhas
- Todas as props padrão de `TextInput`

---

### Card, CardHeader, CardContent, CardActions

Sistema de cards modular.

```typescript
import Card, { CardHeader, CardContent, CardActions } from '@/components/Card';

<Card borderColor="#3a4774" onPress={handlePress}>
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

**Props Card:**
- `children` (ReactNode) - Conteúdo
- `style` (object, opcional) - Estilos
- `onPress` (function, opcional) - Torna clicável
- `borderColor` (string, opcional) - Cor da borda esquerda

---

### CustomHeader

Header de página reutilizável.

```typescript
import CustomHeader from '@/components/CustomHeader';
import CustomButton from '@/components/CustomButton';

<CustomHeader
  title="Catálogo de Produtos"
  subtitle="Gerencie seus produtos"
  backgroundColor="#ffffff"
  rightComponent={
    <CustomButton 
      title="+ Novo" 
      onPress={handleNew}
    />
  }
/>
```

**Props:**
- `title` (string) - Título principal
- `subtitle` (string, opcional) - Subtítulo
- `backgroundColor` (string, opcional) - Cor de fundo
- `rightComponent` (ReactNode, opcional) - Componente à direita

---

### EmptyState

Estado vazio informativo.

```typescript
import EmptyState from '@/components/EmptyState';

<EmptyState
  icon="logo"
  title="Nenhum item encontrado"
  message="Clique em 'Novo' para adicionar o primeiro item"
/>
```

**Props:**
- `icon` (string) - 'logo' ou 'empty'
- `title` (string) - Título
- `message` (string) - Mensagem explicativa
- `iconSource` (any, opcional) - Imagem customizada

---

## 🛠️ Utilitários

### Validação

```typescript
import { 
  isValidEmail, 
  isValidPassword,
  isValidPhone,
  isValidDate,
  isValidCPF,
  isNotEmpty,
  isPositiveNumber
} from '@/utils/validation';

// Exemplos
const emailValid = isValidEmail('user@example.com'); // true
const passwordValid = isValidPassword('123456'); // true
const phoneValid = isValidPhone('11987654321'); // true
const dateValid = isValidDate('25101990'); // true
const cpfValid = isValidCPF('12345678909'); // depende do CPF
const notEmpty = isNotEmpty('  texto  '); // true
const positive = isPositiveNumber('100.50'); // true
```

---

### Formatação

```typescript
import { 
  formatPrice,
  formatPhone,
  formatDate,
  formatCPF,
  formatISODate,
  applyPhoneMask,
  applyDateMask,
  applyCPFMask,
  applyPriceMask,
  capitalize,
  truncate
} from '@/utils/formatting';

// Exemplos de formatação
formatPrice(1234.56); // "R$ 1.234,56"
formatPhone('11987654321'); // "(11) 98765-4321"
formatDate('25101990'); // "25/10/1990"
formatCPF('12345678909'); // "123.456.789-09"
formatISODate('2025-10-17T10:30:00Z'); // "17/10/2025 10:30"

// Exemplos de máscaras (enquanto digita)
applyPhoneMask('11987'); // "(11) 987"
applyDateMask('2510'); // "25/10"
applyCPFMask('12345'); // "123.45"
applyPriceMask('12345'); // "123.45"

// Utilitários de string
capitalize('joão silva'); // "João Silva"
truncate('Texto muito longo aqui', 10); // "Texto muit..."
```

---

### Constantes

```typescript
import { 
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  SERVICE_ICONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  CHAR_LIMITS
} from '@/utils/constants';

// Usando cores
const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.lg,
  },
  text: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
  },
  card: {
    ...SHADOWS.medium,
  },
});

// Usando mensagens
Alert.alert('Erro', ERROR_MESSAGES.required);
Alert.alert('Sucesso', SUCCESS_MESSAGES.created);

// Usando ícones
const icon = SERVICE_ICONS.caixao; // "📦"

// Usando storage keys
await AsyncStorage.setItem(STORAGE_KEYS.caixoes, data);

// Usando limites
<TextInput maxLength={CHAR_LIMITS.description} />
```

---

## 📖 Exemplos de Uso Completo

### Exemplo 1: Formulário com Validação

```typescript
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { CustomInput, CustomButton } from '@/components';
import { isValidEmail, isNotEmpty } from '@/utils/validation';
import { COLORS, ERROR_MESSAGES } from '@/utils/constants';

export default function MyForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!isNotEmpty(name)) {
      newErrors.name = ERROR_MESSAGES.required;
    }
    
    if (!isValidEmail(email)) {
      newErrors.email = ERROR_MESSAGES.invalidEmail;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert('Sucesso', 'Formulário válido!');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <CustomInput
        label="Nome"
        value={name}
        onChangeText={setName}
        error={errors.name}
        required
      />
      
      <CustomInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        error={errors.email}
        required
      />
      
      <CustomButton
        title="Enviar"
        onPress={handleSubmit}
        variant="primary"
        fullWidth
      />
    </View>
  );
}
```

### Exemplo 2: Lista com Cards

```typescript
import React from 'react';
import { FlatList, View, Text } from 'react-native';
import Card, { CardHeader, CardContent, CardActions } from '@/components/Card';
import { CustomButton, EmptyState } from '@/components';
import { formatPrice } from '@/utils/formatting';
import { COLORS } from '@/utils/constants';

interface Product {
  id: string;
  name: string;
  price: number;
}

export default function ProductList({ products }: { products: Product[] }) {
  
  if (products.length === 0) {
    return (
      <EmptyState
        icon="logo"
        title="Nenhum produto cadastrado"
        message="Adicione seu primeiro produto"
      />
    );
  }

  const renderProduct = ({ item }: { item: Product }) => (
    <Card borderColor={COLORS.primary}>
      <CardHeader>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {item.name}
        </Text>
      </CardHeader>
      
      <CardContent>
        <Text style={{ color: COLORS.success, fontSize: 16 }}>
          {formatPrice(item.price)}
        </Text>
      </CardContent>
      
      <CardActions>
        <CustomButton 
          title="Editar" 
          variant="info"
          onPress={() => console.log('Edit', item.id)}
        />
        <CustomButton 
          title="Deletar" 
          variant="danger"
          onPress={() => console.log('Delete', item.id)}
        />
      </CardActions>
    </Card>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
    />
  );
}
```

---

## 🎯 Boas Práticas

### 1. Sempre use componentes reutilizáveis

❌ **Ruim:**
```typescript
<TouchableOpacity style={{ backgroundColor: '#3a4774', padding: 15 }}>
  <Text style={{ color: '#fff' }}>Salvar</Text>
</TouchableOpacity>
```

✅ **Bom:**
```typescript
<CustomButton title="Salvar" variant="primary" />
```

### 2. Use constantes para cores e valores

❌ **Ruim:**
```typescript
const styles = StyleSheet.create({
  button: { backgroundColor: '#3a4774' }
});
```

✅ **Bom:**
```typescript
import { COLORS } from '@/utils/constants';

const styles = StyleSheet.create({
  button: { backgroundColor: COLORS.primary }
});
```

### 3. Valide e formate dados

❌ **Ruim:**
```typescript
if (email.includes('@')) {
  // válido
}
```

✅ **Bom:**
```typescript
import { isValidEmail } from '@/utils/validation';

if (isValidEmail(email)) {
  // válido
}
```

### 4. Use EmptyState para listas vazias

❌ **Ruim:**
```typescript
{data.length === 0 && <Text>Nenhum item</Text>}
```

✅ **Bom:**
```typescript
import { EmptyState } from '@/components';

{data.length === 0 && (
  <EmptyState
    title="Nenhum item encontrado"
    message="Adicione novos itens"
  />
)}
```

---

## 🔄 Atualizações Futuras

Componentes planejados:
- [ ] Loading (indicador de carregamento)
- [ ] Modal customizado
- [ ] DatePicker
- [ ] ImagePicker wrapper
- [ ] SearchBar
- [ ] Badge/Tag
- [ ] Avatar
- [ ] BottomSheet
- [ ] Toast/Snackbar
- [ ] Accordion

---

**Última atualização**: Outubro 2025
