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
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Debug - remover depois
  console.log('LoginScreen renderizada');

  const handleLogin = () => {
    // Aqui você pode adicionar a lógica de login
    console.log('Login:', { email, password });
    // Por enquanto, vamos apenas voltar para a home
    navigation.goBack();
  };

  const handleVoltar = () => {
    navigation.goBack();
  };

    return (
    <View style={styles.mainContainer}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        bounces={true}
        alwaysBounceVertical={true}
        style={{ flex: 1 }}
        nestedScrollEnabled={true}
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
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Entre com suas credenciais para continuar</Text>
      
      {/* Formulário */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          {/* Link "Esqueci a minha senha" */}
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Esqueci a minha senha</Text>
          </TouchableOpacity>
        </View>
        
        {/* Separador visual */}
        <View style={styles.separator} />
      
        {/* Botões */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Entrar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleVoltar}>
            <Text style={styles.secondaryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Texto de cadastro - Posição tradicional */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>
          Não tem uma conta?{' '}
          <Text 
            style={styles.signupLink}
            onPress={() => navigation.navigate('Cadastro')}
          >
            Arrume seu lugar!
          </Text>
        </Text>
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 100, // Mais espaço no final
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    alignItems: 'center',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
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
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: '#2c3e50',
  },
  separator: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 20,
    width: '100%',
  },
  buttonContainer: {
    gap: 15,
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#3a4774',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
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
  forgotPasswordContainer: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    color: '#3a4774',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  signupContainer: {
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
  signupText: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  signupLink: {
    color: '#3a4774',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  cadastroContainer: {
    marginTop: 30,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cadastroText: {
    fontSize: 18,
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  cadastroLink: {
    color: '#3a4774',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  debugContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ffeb3b',
    borderRadius: 5,
  },
  debugText: {
    color: '#000',
    fontSize: 12,
    textAlign: 'center',
  },
});
