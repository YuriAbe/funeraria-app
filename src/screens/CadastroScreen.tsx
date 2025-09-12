import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../services/connectionFirebase';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  Main: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Cadastro'>;

export default function CadastroScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Regex para validações
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nomeRegex = /^[a-zA-ZÀ-ÿ\s]{2,}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

  // Validação em tempo real
  const isEmailValid = email === '' || emailRegex.test(email);
  const isNomeValid = nome === '' || nomeRegex.test(nome);
  const isPasswordValid = password === '' || passwordRegex.test(password);

  const handleCadastro = async () => {
    // Validações básicas
    if (!nome || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    // Validação do nome
    if (!nomeRegex.test(nome)) {
      Alert.alert('Erro', 'Nome deve conter apenas letras e ter pelo menos 2 caracteres');
      return;
    }

    // Validação do email
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    // Validação da senha
    if (!passwordRegex.test(password)) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres, incluindo pelo menos uma letra e um número');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      // Primeiro, verificar se o email já está em uso
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      
      if (signInMethods.length > 0) {
        Alert.alert(
          'Email já cadastrado', 
          'Este email já possui uma conta. Deseja fazer login?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Fazer Login', 
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
        setLoading(false);
        return;
      }

      // Criar usuário no Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Usuário criado com sucesso:', user.uid);
      
      Alert.alert(
        'Sucesso!', 
        'Conta criada com sucesso! Você será redirecionado para fazer login.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      
      // Tratar erros específicos do Firebase
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está em uso.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Senha muito fraca.';
          break;
        default:
          errorMessage = error.message || 'Erro desconhecido.';
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigation.navigate('Home');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.mainContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* Logo pequena no topo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logosemfundo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        {/* Título */}
        <Text style={styles.title}>Cadastro</Text>
        <Text style={styles.subtitle}>Crie sua conta para continuar</Text>
        
        {/* Formulário */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={[
                styles.input, 
                !isNomeValid && nome !== '' && styles.inputError
              ]}
              placeholder="Digite seu nome completo"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              autoCorrect={false}
            />
            {!isNomeValid && nome !== '' && (
              <Text style={styles.errorText}>Nome deve conter apenas letras e ter pelo menos 2 caracteres</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input, 
                !isEmailValid && email !== '' && styles.inputError
              ]}
              placeholder="Digite seu email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {!isEmailValid && email !== '' && (
              <Text style={styles.errorText}>Por favor, insira um email válido</Text>
            )}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={[
                styles.input, 
                !isPasswordValid && password !== '' && styles.inputError
              ]}
              placeholder="Mín. 6 caracteres, 1 letra e 1 número"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            {!isPasswordValid && password !== '' && (
              <Text style={styles.errorText}>Senha deve ter pelo menos 6 caracteres, incluindo 1 letra e 1 número</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput
              style={[
                styles.input, 
                confirmPassword !== '' && password !== confirmPassword && styles.inputError
              ]}
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            {confirmPassword !== '' && password !== confirmPassword && (
              <Text style={styles.errorText}>As senhas não coincidem</Text>
            )}
          </View>
          
          {/* Separador visual */}
          <View style={styles.separator} />
        
          {/* Botões */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.primaryButton, loading && styles.disabledButton]} 
              onPress={handleCadastro}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={handleVoltar}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Texto de login */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Já tem uma conta?{' '}
            <Text 
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              Faça login!
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    paddingBottom: 50,
    justifyContent: 'center',
    minHeight: '100%',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2c3e50',
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 20,
  },
  buttonContainer: {
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#3a4774',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3a4774',
  },
  secondaryButtonText: {
    color: '#3a4774',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    marginTop: 30,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    width: '100%',
    maxWidth: 350,
  },
  loginText: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  loginLink: {
    color: '#3498db',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
