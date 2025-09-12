import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  Main: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const { width } = Dimensions.get('window');

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export default function MainScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const services: ServiceCard[] = [
    {
      id: '1',
      title: 'Contratos de Caixão',
      description: 'Diversos modelos e materiais disponíveis',
      icon: '⚰️',
      color: '#8B4513',
    },
    {
      id: '2',
      title: 'Catálogo de Caixões',
      description: 'Madeira nobre, metal, ecológicos e luxo',
      icon: '📦',
      color: '#654321',
    },
    {
      id: '3',
      title: 'Terrenos para Sepultamento',
      description: 'Locais disponíveis em nossos cemitérios',
      icon: '🏞️',
      color: '#228B22',
    },
    {
      id: '4',
      title: 'Jazigos Familiares',
      description: 'Espaços perpétuos para famílias',
      icon: '🏛️',
      color: '#696969',
    },
    {
      id: '5',
      title: 'Decorações de Cemitério',
      description: 'Flores, coroas, arranjos e ornamentos',
      icon: '🌸',
      color: '#FF69B4',
    },
    {
      id: '6',
      title: 'Personalização de Lápides',
      description: 'Gravações, fotos e designs únicos',
      icon: '🗿',
      color: '#A9A9A9',
    },
    {
      id: '7',
      title: 'Serviços Funerários',
      description: 'Velório, cremação e cerimônias',
      icon: '🕯️',
      color: '#DAA520',
    },
    {
      id: '8',
      title: 'Transporte Funerário',
      description: 'Veículos especializados e acompanhamento',
      icon: '🚗',
      color: '#2F4F4F',
    },
    {
      id: '9',
      title: 'Documentação',
      description: 'Certidões, registros e trâmites legais',
      icon: '📋',
      color: '#4682B4',
    },
  ];

  const categories = [
    { id: 'todos', name: 'Todos os Serviços', icon: '🏠' },
    { id: 'caixoes', name: 'Caixões', icon: '⚰️' },
    { id: 'terrenos', name: 'Terrenos', icon: '🏞️' },
    { id: 'decoracao', name: 'Decoração', icon: '🌸' },
    { id: 'lapides', name: 'Lápides', icon: '🗿' },
  ];

  const filteredServices = selectedCategory === 'todos' 
    ? services 
    : services.filter(service => {
        switch (selectedCategory) {
          case 'caixoes':
            return service.id === '1' || service.id === '2';
          case 'terrenos':
            return service.id === '3' || service.id === '4';
          case 'decoracao':
            return service.id === '5';
          case 'lapides':
            return service.id === '6';
          default:
            return true;
        }
      });

  const handleServicePress = (service: ServiceCard) => {
    Alert.alert(
      service.title,
      `${service.description}\n\nEm breve você será direcionado para mais detalhes sobre este serviço.`,
      [
        { text: 'Fechar', style: 'cancel' },
        { text: 'Solicitar Orçamento', onPress: () => handleRequestQuote(service) }
      ]
    );
  };

  const handleRequestQuote = (service: ServiceCard) => {
    Alert.alert(
      'Orçamento Solicitado',
      `Sua solicitação para "${service.title}" foi enviada. Entraremos em contato em breve.`,
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da aplicação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: () => navigation.navigate('Home') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            source={require('../../assets/logosemfundo.png')} 
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.welcomeText}>Bem-vindo aos nossos serviços</Text>
        <Text style={styles.subtitleText}>Estamos aqui para ajudar em momentos difíceis</Text>
      </View>

      {/* Categories Filter */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Services Grid */}
      <ScrollView 
        style={styles.servicesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.servicesContent}
      >
        <View style={styles.servicesGrid}>
          {filteredServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceCard, { borderLeftColor: service.color }]}
              onPress={() => handleServicePress(service)}
              activeOpacity={0.7}
            >
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceIcon}>{service.icon}</Text>
                <View style={[styles.serviceIndicator, { backgroundColor: service.color }]} />
              </View>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
              <View style={styles.serviceFooter}>
                <Text style={styles.serviceAction}>Solicitar →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Contact */}
        <View style={styles.emergencyContainer}>
          <Text style={styles.emergencyTitle}>📞 Atendimento 24h</Text>
          <Text style={styles.emergencyText}>
            Para situações urgentes, ligue para nosso atendimento 24 horas
          </Text>
          <TouchableOpacity style={styles.emergencyButton}>
            <Text style={styles.emergencyButtonText}>Ligar Agora</Text>
          </TouchableOpacity>
        </View>

        {/* Footer spacing */}
        <View style={styles.footerSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerLogo: {
    width: 60,
    height: 40,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitleText: {
    color: '#bdc3c7',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  categoriesContainer: {
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 15,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    minWidth: 90,
  },
  categoryButtonActive: {
    backgroundColor: '#3498db',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  servicesContainer: {
    flex: 1,
  },
  servicesContent: {
    padding: 20,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceIcon: {
    fontSize: 28,
  },
  serviceIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    lineHeight: 22,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    lineHeight: 18,
    marginBottom: 12,
  },
  serviceFooter: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 10,
  },
  serviceAction: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '600',
    textAlign: 'right',
  },
  emergencyContainer: {
    backgroundColor: '#e74c3c',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  emergencyText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  emergencyButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emergencyButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerSpacing: {
    height: 30,
  },
});