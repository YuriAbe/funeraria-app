# 🔄 Guia de Refatoração - Usando Novos Componentes

Este guia mostra como refatorar as telas existentes para usar os componentes reutilizáveis criados.

---

## 📋 Índice

1. [Refatorando Formulários](#refatorando-formulários)
2. [Refatorando Listas](#refatorando-listas)
3. [Refatorando Headers](#refatorando-headers)
4. [Usando Utilitários](#usando-utilitários)
5. [Checklist de Migração](#checklist-de-migração)

---

## 🔧 Refatorando Formulários

### Antes: CaixaoFormScreen (código atual)

```typescript
// ❌ Código antigo - muito repetitivo
<View style={styles.inputContainer}>
  <Text style={styles.label}>Nome do Caixão *</Text>
  <TextInput
    style={[styles.input, errors.nome && styles.inputError]}
    value={nome}
    onChangeText={setNome}
    placeholder="Ex: Caixão Tradicional Mogno"
    maxLength={50}
  />
  {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
</View>

<View style={styles.inputContainer}>
  <Text style={styles.label}>Material *</Text>
  <TextInput
    style={[styles.input, errors.material && styles.inputError]}
    value={material}
    onChangeText={setMaterial}
    placeholder="Ex: Mogno, Cedro, MDF, Pinus"
    maxLength={30}
  />
  {errors.material && <Text style={styles.errorText}>{errors.material}</Text>}
</View>
```

### Depois: Com CustomInput

```typescript
// ✅ Código novo - muito mais limpo
import { CustomInput, CustomButton } from '@/components';
import { CHAR_LIMITS } from '@/utils';

<CustomInput
  label="Nome do Caixão"
  value={nome}
  onChangeText={setNome}
  placeholder="Ex: Caixão Tradicional Mogno"
  maxLength={CHAR_LIMITS.name}
  error={errors.nome}
  required
/>

<CustomInput
  label="Material"
  value={material}
  onChangeText={setMaterial}
  placeholder="Ex: Mogno, Cedro, MDF, Pinus"
  maxLength={CHAR_LIMITS.shortText}
  error={errors.material}
  required
/>
```

**Benefícios:**
- ✅ Menos código (redução de ~60%)
- ✅ Mais legível
- ✅ Estilo consistente
- ✅ Validação automática

---

## 📝 Refatorando Botões

### Antes

```typescript
// ❌ Código antigo
<View style={styles.buttonContainer}>
  <TouchableOpacity
    style={styles.cancelButton}
    onPress={() => navigation.goBack()}
    disabled={loading}
  >
    <Text style={styles.cancelButtonText}>Cancelar</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.saveButton, loading && styles.disabledButton]}
    onPress={saveCaixao}
    disabled={loading}
  >
    <Text style={styles.saveButtonText}>
      {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Cadastrar')}
    </Text>
  </TouchableOpacity>
</View>

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3a4774',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
});
```

### Depois

```typescript
// ✅ Código novo
import { CustomButton } from '@/components';

<View style={{ flexDirection: 'row', padding: 20, gap: 12 }}>
  <CustomButton
    title="Cancelar"
    variant="secondary"
    onPress={() => navigation.goBack()}
    disabled={loading}
    style={{ flex: 1 }}
  />

  <CustomButton
    title={loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Cadastrar')}
    variant="primary"
    onPress={saveCaixao}
    disabled={loading}
    style={{ flex: 1 }}
  />
</View>

// Não precisa de estilos de botão!
```

**Benefícios:**
- ✅ Menos código (redução de ~70%)
- ✅ Sem estilos duplicados
- ✅ Comportamento consistente

---

## 📋 Refatorando Listas

### Antes: CaixaoListScreen

```typescript
// ❌ Código antigo
const renderCaixao = ({ item }: { item: Caixao }) => (
  <View style={styles.caixaoCard}>
    <View style={styles.cardHeader}>
      <Text style={styles.caixaoNome}>{item.nome}</Text>
      <Text style={styles.caixaoPreco}>{formatPrice(item.preco)}</Text>
    </View>
    
    <View style={styles.cardContent}>
      <Text style={styles.attribute}>
        <Text style={styles.attributeLabel}>Material: </Text>
        {item.material}
      </Text>
      <Text style={styles.attribute}>
        <Text style={styles.attributeLabel}>Cor: </Text>
        {item.cor}
      </Text>
    </View>

    <View style={styles.cardActions}>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('CaixaoForm', { caixao: item })}
      >
        <Text style={styles.editButtonText}>Editar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteCaixao(item.id)}
      >
        <Text style={styles.deleteButtonText}>Deletar</Text>
      </TouchableOpacity>
    </View>
  </View>
);
```

### Depois: Com Card e CustomButton

```typescript
// ✅ Código novo
import Card, { CardHeader, CardContent, CardActions } from '@/components/Card';
import { CustomButton } from '@/components';
import { formatPrice } from '@/utils';
import { COLORS } from '@/utils';

const renderCaixao = ({ item }: { item: Caixao }) => (
  <Card borderColor={COLORS.caixao}>
    <CardHeader>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.text }}>
          {item.nome}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.success }}>
          {formatPrice(item.preco)}
        </Text>
      </View>
    </CardHeader>
    
    <CardContent>
      <Text style={{ fontSize: 14, color: COLORS.text, marginBottom: 4 }}>
        <Text style={{ fontWeight: '600' }}>Material: </Text>
        {item.material}
      </Text>
      <Text style={{ fontSize: 14, color: COLORS.text }}>
        <Text style={{ fontWeight: '600' }}>Cor: </Text>
        {item.cor}
      </Text>
    </CardContent>

    <CardActions>
      <CustomButton 
        title="Editar"
        variant="info"
        onPress={() => navigation.navigate('CaixaoForm', { caixao: item })}
      />
      <CustomButton 
        title="Deletar"
        variant="danger"
        onPress={() => deleteCaixao(item.id)}
      />
    </CardActions>
  </Card>
);
```

**Benefícios:**
- ✅ Estrutura mais clara
- ✅ Separação de responsabilidades
- ✅ Mais fácil de manter

---

## 🎯 Refatorando Headers

### Antes: CaixaoListScreen Header

```typescript
// ❌ Código antigo
<View style={styles.header}>
  <Text style={styles.title}>Catálogo de Caixões</Text>
  <TouchableOpacity
    style={styles.addButton}
    onPress={() => navigation.navigate('CaixaoForm', {})}
  >
    <Text style={styles.addButtonText}>+ Novo Caixão</Text>
  </TouchableOpacity>
</View>

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#3a4774',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
```

### Depois: Com CustomHeader

```typescript
// ✅ Código novo
import { CustomHeader, CustomButton } from '@/components';

<CustomHeader
  title="Catálogo de Caixões"
  rightComponent={
    <CustomButton 
      title="+ Novo Caixão"
      variant="primary"
      onPress={() => navigation.navigate('CaixaoForm', {})}
    />
  }
/>
```

**Benefícios:**
- ✅ 90% menos código
- ✅ Sem estilos duplicados
- ✅ Consistência automática

---

## 🔍 Usando Utilitários de Validação

### Antes: LoginScreen

```typescript
// ❌ Código antigo - validação manual
const handleLogin = () => {
  if (!email || !email.includes('@')) {
    Alert.alert('Erro', 'Email inválido');
    return;
  }
  
  if (!password || password.length < 6) {
    Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres');
    return;
  }
  
  // continuar...
};
```

### Depois: Com Utilitários

```typescript
// ✅ Código novo - validação padronizada
import { isValidEmail, isValidPassword } from '@/utils/validation';
import { ERROR_MESSAGES } from '@/utils/constants';

const handleLogin = () => {
  if (!isValidEmail(email)) {
    Alert.alert('Erro', ERROR_MESSAGES.invalidEmail);
    return;
  }
  
  if (!isValidPassword(password)) {
    Alert.alert('Erro', ERROR_MESSAGES.invalidPassword);
    return;
  }
  
  // continuar...
};
```

---

## 🎨 Usando Constantes de Estilo

### Antes: Estilos Hardcoded

```typescript
// ❌ Código antigo
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3a4774',
    padding: 16,
    borderRadius: 10,
  },
});
```

### Depois: Com Constantes

```typescript
// ✅ Código novo
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/utils/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.medium,
  },
});
```

**Benefícios:**
- ✅ Cores consistentes em todo app
- ✅ Fácil mudar tema global
- ✅ Mais semântico

---

## ✅ Checklist de Migração

### Para cada tela:

#### Inputs
- [ ] Substituir `TextInput` por `CustomInput`
- [ ] Adicionar validações com utils
- [ ] Usar `CHAR_LIMITS` para maxLength

#### Botões
- [ ] Substituir `TouchableOpacity` por `CustomButton`
- [ ] Remover estilos de botão duplicados
- [ ] Usar variantes apropriadas

#### Cards
- [ ] Usar componente `Card`
- [ ] Separar em `CardHeader`, `CardContent`, `CardActions`
- [ ] Remover estilos de card

#### Headers
- [ ] Usar `CustomHeader`
- [ ] Passar componentes direitos como props

#### Estados Vazios
- [ ] Substituir por `EmptyState`
- [ ] Adicionar mensagens apropriadas

#### Constantes
- [ ] Substituir cores hardcoded por `COLORS`
- [ ] Usar `FONT_SIZES`, `SPACING`, etc
- [ ] Usar mensagens de `ERROR_MESSAGES` e `SUCCESS_MESSAGES`

#### Validações
- [ ] Usar funções de `validation.ts`
- [ ] Remover validações duplicadas

#### Formatações
- [ ] Usar funções de `formatting.ts`
- [ ] Aplicar máscaras consistentes

---

## 📊 Estimativa de Redução de Código

| Componente | Antes (linhas) | Depois (linhas) | Redução |
|------------|----------------|-----------------|---------|
| Input com validação | ~25 | ~8 | 68% |
| Botão customizado | ~30 | ~5 | 83% |
| Card completo | ~40 | ~15 | 62% |
| Header com botão | ~35 | ~8 | 77% |
| **Total médio** | | | **~70%** |

---

## 🎯 Exemplo Completo: ProfileScreen Refatorado

### Antes (fragmento)
```typescript
<View style={styles.card}>
  <View style={styles.cardRow}>
    <View style={{ flex: 1 }}>
      <Text style={styles.fieldLabel}>Nome</Text>
      {isEditingNome ? (
        <TextInput
          style={[styles.input, { marginTop: 6 }]}
          value={tempNome}
          onChangeText={setTempNome}
          placeholder="Digite o nome"
        />
      ) : (
        <Text style={styles.fieldValue}>{displayName || 'Usuário'}</Text>
      )}
    </View>
    {/* ... mais 30 linhas ... */}
  </View>
</View>
```

### Depois
```typescript
import { CustomInput, Card, CardContent } from '@/components';
import { isNotEmpty } from '@/utils/validation';
import { CHAR_LIMITS } from '@/utils/constants';

<Card>
  <CardContent>
    {isEditingNome ? (
      <CustomInput
        label="Nome"
        value={tempNome}
        onChangeText={setTempNome}
        placeholder="Digite o nome"
        maxLength={CHAR_LIMITS.name}
        required
      />
    ) : (
      <>
        <Text style={{ fontSize: 14, fontWeight: '600' }}>Nome</Text>
        <Text style={{ fontSize: 16, marginTop: 6 }}>
          {displayName || 'Usuário'}
        </Text>
      </>
    )}
  </CardContent>
</Card>
```

---

## 🚀 Começando a Refatoração

### Passo a Passo

1. **Escolha uma tela simples** (ex: LoginScreen)
2. **Refatore inputs primeiro**
3. **Depois botões**
4. **Por último, cards e layout**
5. **Teste completamente**
6. **Repita para próxima tela**

### Ordem Sugerida

1. ✅ LoginScreen (mais simples)
2. ✅ CadastroScreen
3. ✅ ProfileScreen
4. ✅ CaixaoFormScreen
5. ✅ CaixaoListScreen
6. ✅ Outras telas CRUD (seguem mesmo padrão)

---

## 💡 Dicas Importantes

### Não Refatore Tudo de Uma Vez
- Faça incrementalmente
- Teste após cada mudança
- Commit frequente

### Mantenha Backup
- Crie branch antes de refatorar
- ```git checkout -b refactor/use-custom-components```

### Teste Rigorosamente
- Teste todos os fluxos
- Verifique validações
- Confira estilos visuais

---

<p align="center">
  <strong>Boa refatoração! 🎉</strong><br>
  <sub>Com os novos componentes, seu código ficará muito mais limpo e manutenível.</sub>
</p>
