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
  ContratoList: undefined;
  ContratoForm: { contrato?: Contrato };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'ContratoList'>;

export interface Contrato {
  id: string;
  nomeCliente: string;
  modeloCaixao: string;
  material: string;
  dataContrato: string;
  valorTotal: string;
  createdAt: string;
}

export default function ContratoListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadContratos = async () => {
    try {
      const saved = await AsyncStorage.getItem('contratos');
      if (saved) {
        const parsedContratos = JSON.parse(saved);
        // Ordenar por data de criação (mais recentes primeiro)
        const sortedContratos = parsedContratos.sort((a: Contrato, b: Contrato) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setContratos(sortedContratos);
      }
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os contratos');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadContratos();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadContratos();
    setRefreshing(false);
  }, []);

  const handleDelete = (contratoId: string) => {
    const contrato = contratos.find(c => c.id === contratoId);
    
    Alert.alert(
      'Excluir Contrato',
      `Tem certeza que deseja excluir o contrato de "${contrato?.nomeCliente}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedContratos = contratos.filter(c => c.id !== contratoId);
              await AsyncStorage.setItem('contratos', JSON.stringify(updatedContratos));
              setContratos(updatedContratos);
              Alert.alert('Sucesso', 'Contrato excluído com sucesso');
            } catch (error) {
              console.error('Erro ao excluir contrato:', error);
              Alert.alert('Erro', 'Não foi possível excluir o contrato');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (contrato: Contrato) => {
    navigation.navigate('ContratoForm', { contrato });
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

  const renderContrato = ({ item }: { item: Contrato }) => (
    <View style={styles.contratoCard}>
      <View style={styles.contratoHeader}>
        <View style={styles.contratoInfo}>
          <Text style={styles.contratoCliente}>{item.nomeCliente}</Text>
          <Text style={styles.contratoModelo}>{item.modeloCaixao}</Text>
        </View>
        <View style={styles.contratoActions}>
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
      
      <View style={styles.contratoDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Material:</Text>
          <Text style={styles.detailValue}>{item.material}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Data do Contrato:</Text>
          <Text style={styles.detailValue}>{formatDate(item.dataContrato)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Valor Total:</Text>
          <Text style={[styles.detailValue, styles.priceText]}>{formatPrice(item.valorTotal)}</Text>
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
      <Text style={styles.emptyTitle}>Nenhum contrato encontrado</Text>
      <Text style={styles.emptySubtitle}>
        Comece criando seu primeiro contrato de caixão
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('ContratoForm', {})}
      >
        <Text style={styles.emptyButtonText}>Criar Primeiro Contrato</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={contratos}
        keyExtractor={(item) => item.id}
        renderItem={renderContrato}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3a4774']}
            tintColor="#3a4774"
          />
        }
      />
      
      {contratos.length > 0 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ContratoForm', {})}
        >
          <Text style={styles.addButtonText}>+ Novo Contrato</Text>
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
  contratoCard: {
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
    borderLeftColor: '#8B4513',
  },
  contratoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contratoInfo: {
    flex: 1,
  },
  contratoCliente: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  contratoModelo: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  contratoActions: {
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
  contratoDetails: {
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
    backgroundColor: '#8B4513',
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
    backgroundColor: '#8B4513',
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