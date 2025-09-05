import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importar telas
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';

// Tipos para navegação
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#f8f9fa' },
        }}
      >
        {/* Tela principal */}
        <Stack.Screen name="Home" component={HomeScreen} />
        
        {/* Tela de login */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            headerShown: true,
            title: 'Login',
            headerStyle: { backgroundColor: '#3a4774' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />
        
        {/* Tela de cadastro */}
        <Stack.Screen 
          name="Cadastro" 
          component={CadastroScreen}
          options={{
            headerShown: true,
            title: 'Criar Conta',
            headerStyle: { backgroundColor: '#3a4774' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

