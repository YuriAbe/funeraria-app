import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  JazigoList: undefined;
  JazigoForm: { jazigo?: Jazigo };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'JazigoList'>;

export interface Jazigo {
  id: string;
  nomeFamilia: string;
  localizacao: string;
  capacidade: string;
  preco: string;
  dataAquisicao: string;
  createdAt: string;
}

export default function JazigoListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [jazigos, setJazigos] = useState<Jazigo[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadJazigos = async () => {
    try {
      const saved = await AsyncStorage.getItem('jazigos');
      if (saved) {
        const parsedJazigos = JSON.parse(saved);
        const sortedJazigos = parsedJazigos.sort((a: Jazigo, b: Jazigo) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setJazigos(sortedJazigos);
      }
    } catch (error) {
      console.error('Erro ao carregar jazigos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os jazigos');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadJazigos();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadJazigos();
    setRefreshing(false);
  }, []);

  const handleDelete = (jazigoId: string) => {
    const jazigo = jazigos.find(j => j.id === jazigoId);
    
    Alert.alert(
      'Excluir Jazigo',
      `Tem certeza que deseja excluir o jazigo da família "${jazigo?.nomeFamilia}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedJazigos = jazigos.filter(j => j.id !== jazigoId);
              await AsyncStorage.setItem('jazigos', JSON.stringify(updatedJazigos));
              setJazigos(updatedJazigos);
              Alert.alert('Sucesso', 'Jazigo excluído com sucesso');
            } catch (error) {
              console.error('Erro ao excluir jazigo:', error);
              Alert.alert('Erro', 'Não foi possível excluir o jazigo');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (jazigo: Jazigo) => {
    navigation.navigate('JazigoForm', { jazigo });
  };

  const formatPrice = (price: string) => {
    return price.startsWith('R$') ? price : `R$ ${price}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const renderJazigo = ({ item }: { item: Jazigo }) => (
    <View style={styles.jazigoCard}>
      <View style={styles.jazigoHeader}>
        <View style={styles.jazigoInfo}>
          <Text style={styles.jazigoFamilia}>{item.nomeFamilia}</Text>
          <Text style={styles.jazigoLocalizacao}>{item.localizacao}</Text>
        </View>
        <View style={styles.jazigoActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.jazigoDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Capacidade:</Text>
          <Text style={styles.detailValue}>{item.capacidade}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Preço:</Text>
          <Text style={[styles.detailValue, styles.priceText]}>{formatPrice(item.preco)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Data de Aquisição:</Text>
          <Text style={styles.detailValue}>{formatDate(item.dataAquisicao)}</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require('../../assets/logosemfundo.png')}
        style={styles.emptyLogo}
        resizeMode="contain"
      />
      <Text style={styles.emptyTitle}>Nenhum jazigo encontrado</Text>
      <Text style={styles.emptySubtitle}>
        Comece cadastrando o primeiro jazigo familiar
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('JazigoForm', {})}
      >
        <Text style={styles.emptyButtonText}>Cadastrar Primeiro Jazigo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={jazigos}
        keyExtractor={(item) => item.id}
        renderItem={renderJazigo}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#696969']}
            tintColor="#696969"
          />
        }
      />
      
      {jazigos.length > 0 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('JazigoForm', {})}
        >
          <Text style={styles.addButtonText}>+ Novo Jazigo</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  listContainer: {
    flexGrow: 1,
    padding: 16,
  },
  jazigoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#696969',
  },
  jazigoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jazigoInfo: {
    flex: 1,
  },
  jazigoFamilia: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  jazigoLocalizacao: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  jazigoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  editButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  deleteButtonText: {
    fontSize: 16,
  },
  jazigoDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
  },
  priceText: {
    color: '#27ae60',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#696969',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyLogo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: '#696969',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});