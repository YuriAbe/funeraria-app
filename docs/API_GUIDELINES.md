# 🔌 API Guidelines

## Futuro: Firebase Realtime Database / Firestore

Este documento define as diretrizes para quando migrarmos de AsyncStorage para Firebase.

---

## 📊 Estrutura de Dados no Firebase

### Usuários

```json
{
  "users": {
    "userId123": {
      "email": "user@example.com",
      "displayName": "João Silva",
      "phoneNumber": "11987654321",
      "cidade": "São Paulo",
      "dataNascimento": "25101990",
      "photoURL": "https://...",
      "createdAt": "2025-10-17T10:30:00Z",
      "updatedAt": "2025-10-17T10:30:00Z"
    }
  }
}
```

### Caixões

```json
{
  "caixoes": {
    "caixaoId1": {
      "nome": "Caixão Tradicional Mogno",
      "material": "Mogno",
      "cor": "Natural",
      "preco": "5000.00",
      "descricao": "Caixão de mogno maciço...",
      "imageUrl": "https://...",
      "userId": "userId123",
      "createdAt": "2025-10-17T10:30:00Z",
      "updatedAt": "2025-10-17T10:30:00Z"
    }
  }
}
```

### Contratos

```json
{
  "contratos": {
    "contratoId1": {
      "caixaoId": "caixaoId1",
      "nomeCliente": "Maria Silva",
      "cpfCliente": "12345678909",
      "telefoneCliente": "11987654321",
      "endereco": "Rua X, 123",
      "valorTotal": "5000.00",
      "formaPagamento": "pix",
      "status": "pendente",
      "userId": "userId123",
      "createdAt": "2025-10-17T10:30:00Z",
      "updatedAt": "2025-10-17T10:30:00Z"
    }
  }
}
```

---

## 🔐 Security Rules (Firebase)

### Realtime Database Rules

```json
{
  "rules": {
    "users": {
      "$userId": {
        ".read": "$userId === auth.uid",
        ".write": "$userId === auth.uid"
      }
    },
    "caixoes": {
      "$caixaoId": {
        ".read": "auth != null",
        ".write": "auth != null && (!data.exists() || data.child('userId').val() === auth.uid)"
      }
    },
    "contratos": {
      "$contratoId": {
        ".read": "auth != null && data.child('userId').val() === auth.uid",
        ".write": "auth != null && (!data.exists() || data.child('userId').val() === auth.uid)"
      }
    }
  }
}
```

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Usuários
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Caixões
    match /caixoes/{caixaoId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
    
    // Contratos
    match /contratos/{contratoId} {
      allow read: if request.auth != null 
        && resource.data.userId == request.auth.uid;
      allow create, update, delete: if request.auth != null 
        && request.resource.data.userId == request.auth.uid;
    }
    
    // Terrenos, Jazigos, Decorações, Lápides (similar)
  }
}
```

---

## 🔄 Padrões de CRUD

### Create (Criar)

```typescript
import { ref, push, set } from 'firebase/database';
import { database } from '@/services/connectionFirebase';

const createCaixao = async (caixao: Omit<Caixao, 'id'>) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');
    
    const caixoesRef = ref(database, 'caixoes');
    const newCaixaoRef = push(caixoesRef);
    
    const caixaoData = {
      ...caixao,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await set(newCaixaoRef, caixaoData);
    return newCaixaoRef.key;
  } catch (error) {
    console.error('Erro ao criar caixão:', error);
    throw error;
  }
};
```

### Read (Ler)

```typescript
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';

const getCaixoes = async (): Promise<Caixao[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');
    
    const caixoesRef = ref(database, 'caixoes');
    const caixoesQuery = query(
      caixoesRef,
      orderByChild('userId'),
      equalTo(userId)
    );
    
    const snapshot = await get(caixoesQuery);
    
    if (!snapshot.exists()) return [];
    
    const caixoes: Caixao[] = [];
    snapshot.forEach((child) => {
      caixoes.push({
        id: child.key!,
        ...child.val(),
      });
    });
    
    return caixoes;
  } catch (error) {
    console.error('Erro ao buscar caixões:', error);
    throw error;
  }
};
```

### Update (Atualizar)

```typescript
import { ref, update } from 'firebase/database';

const updateCaixao = async (id: string, updates: Partial<Caixao>) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');
    
    const caixaoRef = ref(database, `caixoes/${id}`);
    
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await update(caixaoRef, updateData);
  } catch (error) {
    console.error('Erro ao atualizar caixão:', error);
    throw error;
  }
};
```

### Delete (Deletar)

```typescript
import { ref, remove } from 'firebase/database';

const deleteCaixao = async (id: string) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');
    
    const caixaoRef = ref(database, `caixoes/${id}`);
    await remove(caixaoRef);
  } catch (error) {
    console.error('Erro ao deletar caixão:', error);
    throw error;
  }
};
```

---

## 🎯 Boas Práticas

### 1. Sempre Validar Autenticação

```typescript
const userId = auth.currentUser?.uid;
if (!userId) {
  throw new Error('Usuário não autenticado');
}
```

### 2. Usar Timestamps

```typescript
{
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
```

### 3. Validar Dados Antes de Salvar

```typescript
import { isValidEmail, isNotEmpty } from '@/utils/validation';

if (!isValidEmail(email) || !isNotEmpty(nome)) {
  throw new Error('Dados inválidos');
}
```

### 4. Tratar Erros Apropriadamente

```typescript
try {
  // operação
} catch (error: any) {
  console.error('Contexto:', error);
  
  if (error.code === 'PERMISSION_DENIED') {
    Alert.alert('Erro', 'Você não tem permissão para esta ação');
  } else {
    Alert.alert('Erro', 'Ocorreu um erro inesperado');
  }
}
```

### 5. Usar Loading States

```typescript
const [loading, setLoading] = useState(false);

const handleSave = async () => {
  setLoading(true);
  try {
    await createCaixao(data);
    Alert.alert('Sucesso', 'Caixão criado!');
  } catch (error) {
    // tratar erro
  } finally {
    setLoading(false);
  }
};
```

---

## 📦 Migração de AsyncStorage para Firebase

### Passo 1: Criar Serviço de Migração

```typescript
// src/services/migration.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, set } from 'firebase/database';
import { database, auth } from './connectionFirebase';

export const migrateToFirebase = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');
    
    // Migrar caixões
    const caixoesLocal = await AsyncStorage.getItem('caixoes');
    if (caixoesLocal) {
      const caixoes = JSON.parse(caixoesLocal);
      const caixoesRef = ref(database, `users/${userId}/caixoes`);
      await set(caixoesRef, caixoes);
    }
    
    // Migrar outros dados...
    
    console.log('Migração concluída com sucesso');
  } catch (error) {
    console.error('Erro na migração:', error);
    throw error;
  }
};
```

### Passo 2: Criar Hook Customizado

```typescript
// src/hooks/useCaixoes.ts
import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database, auth } from '@/services/connectionFirebase';

export const useCaixoes = () => {
  const [caixoes, setCaixoes] = useState<Caixao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setLoading(false);
      return;
    }
    
    const caixoesRef = ref(database, `users/${userId}/caixoes`);
    
    const unsubscribe = onValue(
      caixoesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const caixoesArray = Object.entries(data).map(([id, value]) => ({
            id,
            ...(value as any),
          }));
          setCaixoes(caixoesArray);
        } else {
          setCaixoes([]);
        }
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
    
    return () => off(caixoesRef, 'value', unsubscribe);
  }, []);
  
  return { caixoes, loading, error };
};
```

---

## 🔍 Queries Avançadas

### Filtrar por Múltiplos Critérios

```typescript
import { ref, query, orderByChild, startAt, endAt } from 'firebase/database';

const getCaixoesPorPreco = async (minPreco: number, maxPreco: number) => {
  const caixoesRef = ref(database, 'caixoes');
  const caixoesQuery = query(
    caixoesRef,
    orderByChild('preco'),
    startAt(minPreco),
    endAt(maxPreco)
  );
  
  const snapshot = await get(caixoesQuery);
  // processar dados...
};
```

### Paginação

```typescript
const getCaixoesPaginados = async (limit: number, lastKey?: string) => {
  const caixoesRef = ref(database, 'caixoes');
  let caixoesQuery;
  
  if (lastKey) {
    caixoesQuery = query(
      caixoesRef,
      orderByKey(),
      startAfter(lastKey),
      limitToFirst(limit)
    );
  } else {
    caixoesQuery = query(
      caixoesRef,
      orderByKey(),
      limitToFirst(limit)
    );
  }
  
  const snapshot = await get(caixoesQuery);
  // processar dados...
};
```

---

## 📸 Upload de Imagens

### Firebase Storage

```typescript
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/services/connectionFirebase';

const uploadImage = async (uri: string, path: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const imageRef = storageRef(storage, path);
    await uploadBytes(imageRef, blob);
    
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
  }
};

// Uso
const imageUrl = await uploadImage(
  imageUri,
  `caixoes/${userId}/${Date.now()}.jpg`
);
```

---

## 🚀 Performance

### Indexação

No Firebase Console, crie índices para queries frequentes:

```json
{
  "rules": {
    "caixoes": {
      ".indexOn": ["userId", "preco", "material"]
    }
  }
}
```

### Cache Offline

```typescript
import { enableNetwork, disableNetwork } from 'firebase/database';

// Habilitar modo offline
await disableNetwork(database);

// Voltar online
await enableNetwork(database);
```

---

## 📊 Monitoramento

### Firebase Analytics

```typescript
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/services/connectionFirebase';

// Log de eventos
logEvent(analytics, 'caixao_criado', {
  material: 'mogno',
  preco: 5000,
});
```

---

**Última atualização**: Outubro 2025
**Status**: 📝 Planejado para versão 1.1
