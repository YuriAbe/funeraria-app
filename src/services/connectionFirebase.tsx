// Importa funções específicas do SDK modular
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Exemplo para autenticação
import { getDatabase } from 'firebase/database'; // Exemplo para o Realtime Database

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa e exporta serviços
export const auth = getAuth(app);
export const database = getDatabase(app);

// Se precisar do app em outro lugar, pode exportá-lo também
export default app;