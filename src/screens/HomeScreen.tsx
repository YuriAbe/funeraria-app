import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleAssinarPlano = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Logo centralizada sem fundo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logosemfundo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      {/* Título e subtítulo */}
      <Text style={styles.title}>Bem vindo a funerária bom descanso</Text>
      <Text style={styles.subtitle}>Cuidando de quem você ama com respeito e dignidade</Text>
      
      {/* Botão único */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleAssinarPlano}>
          <Text style={styles.primaryButtonText}>Assinar plano</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 250,
    height: 180,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3a4774',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
