import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importar telas
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import MainScreen from './src/screens/MainScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CaixaoListScreen from './src/screens/CaixaoListScreen';
import CaixaoFormScreen from './src/screens/CaixaoFormScreen';
import ContratoListScreen from './src/screens/ContratoListScreen';
import ContratoFormScreen from './src/screens/ContratoFormScreen';
import TerrenoListScreen from './src/screens/TerrenoListScreen';
import TerrenoFormScreen from './src/screens/TerrenoFormScreen';
import JazigoListScreen from './src/screens/JazigoListScreen';
import JazigoFormScreen from './src/screens/JazigoFormScreen';
import DecoracaoListScreen from './src/screens/DecoracaoListScreen';
import DecoracaoFormScreen from './src/screens/DecoracaoFormScreen';
import LapideListScreen from './src/screens/LapideListScreen';
import LapideFormScreen from './src/screens/LapideFormScreen';

// Tipos para navegação
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  Main: undefined;
  Profile: undefined;
  CaixaoList: undefined;
  CaixaoForm: { caixao?: any };
  ContratoList: undefined;
  ContratoForm: { contrato?: any };
  TerrenoList: undefined;
  TerrenoForm: { terreno?: any };
  JazigoList: undefined;
  JazigoForm: { jazigo?: any };
  DecoracaoList: undefined;
  DecoracaoForm: { decoracao?: any };
  LapideList: undefined;
  LapideForm: { lapide?: any };
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
        
        {/* Tela principal da funerária */}
        <Stack.Screen 
          name="Main" 
          component={MainScreen}
          options={{
            headerShown: false,
          }}
        />
        {/* Profile */}
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: true, title: 'Perfil' }}
        />
        
        {/* CRUD de Caixões */}
        <Stack.Screen
          name="CaixaoList"
          component={CaixaoListScreen}
          options={{
            headerShown: true,
            title: 'Catálogo de Caixões',
            headerStyle: { backgroundColor: '#3a4774' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />
        
        <Stack.Screen
          name="CaixaoForm"
          component={CaixaoFormScreen}
          options={{
            headerShown: true,
            title: 'Caixão',
            headerStyle: { backgroundColor: '#3a4774' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />

        {/* CRUD de Contratos */}
        <Stack.Screen
          name="ContratoList"
          component={ContratoListScreen}
          options={{
            headerShown: true,
            title: 'Contratos de Caixão',
            headerStyle: { backgroundColor: '#8B4513' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />
        
        <Stack.Screen
          name="ContratoForm"
          component={ContratoFormScreen}
          options={{
            headerShown: true,
            title: 'Contrato',
            headerStyle: { backgroundColor: '#8B4513' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />

        {/* CRUD de Terrenos */}
        <Stack.Screen
          name="TerrenoList"
          component={TerrenoListScreen}
          options={{
            headerShown: true,
            title: 'Terrenos para Sepultamento',
            headerStyle: { backgroundColor: '#228B22' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />
        
        <Stack.Screen
          name="TerrenoForm"
          component={TerrenoFormScreen}
          options={{
            headerShown: true,
            title: 'Terreno',
            headerStyle: { backgroundColor: '#228B22' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />

        {/* CRUD de Jazigos */}
        <Stack.Screen
          name="JazigoList"
          component={JazigoListScreen}
          options={{
            headerShown: true,
            title: 'Jazigos Familiares',
            headerStyle: { backgroundColor: '#696969' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />
        
        <Stack.Screen
          name="JazigoForm"
          component={JazigoFormScreen}
          options={{
            headerShown: true,
            title: 'Jazigo',
            headerStyle: { backgroundColor: '#696969' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />

        {/* CRUD de Decorações */}
        <Stack.Screen
          name="DecoracaoList"
          component={DecoracaoListScreen}
          options={{
            headerShown: true,
            title: 'Decorações de Cemitério',
            headerStyle: { backgroundColor: '#FF69B4' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />
        
        <Stack.Screen
          name="DecoracaoForm"
          component={DecoracaoFormScreen}
          options={{
            headerShown: true,
            title: 'Decoração',
            headerStyle: { backgroundColor: '#FF69B4' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />

        {/* CRUD de Lápides */}
        <Stack.Screen
          name="LapideList"
          component={LapideListScreen}
          options={{
            headerShown: true,
            title: 'Personalização de Lápides',
            headerStyle: { backgroundColor: '#A9A9A9' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />
        
        <Stack.Screen
          name="LapideForm"
          component={LapideFormScreen}
          options={{
            headerShown: true,
            title: 'Lápide',
            headerStyle: { backgroundColor: '#A9A9A9' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

