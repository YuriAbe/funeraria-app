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
  TerrenoList: undefined;
  TerrenoForm: { terreno?: Terreno };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'TerrenoList'>;

export interface Terreno {
  id: string;
  localizacao: string;
  tamanho: string;
  preco: string;
  disponibilidade: string;
  cemiterio: string;
  createdAt: string;
}

export default function TerrenoListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [terrenos, setTerrenos] = useState<Terreno[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadTerrenos = async () => {
    try {
      const saved = await AsyncStorage.getItem('terrenos');
      if (saved) {
        const parsedTerrenos = JSON.parse(saved);
        const sortedTerrenos = parsedTerrenos.sort((a: Terreno, b: Terreno) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTerrenos(sortedTerrenos);
      }
    } catch (error) {
      console.error('Erro ao carregar terrenos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os terrenos');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTerrenos();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTerrenos();
    setRefreshing(false);
  }, []);

  const handleDelete = (terrenoId: string) => {
    const terreno = terrenos.find(t => t.id === terrenoId);
    
    Alert.alert(
      'Excluir Terreno',
      `Tem certeza que deseja excluir o terreno em "${terreno?.localizacao}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedTerrenos = terrenos.filter(t => t.id !== terrenoId);
              await AsyncStorage.setItem('terrenos', JSON.stringify(updatedTerrenos));
              setTerrenos(updatedTerrenos);
              Alert.alert('Sucesso', 'Terreno excluído com sucesso');
            } catch (error) {
              console.error('Erro ao excluir terreno:', error);
              Alert.alert('Erro', 'Não foi possível excluir o terreno');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (terreno: Terreno) => {
    navigation.navigate('TerrenoForm', { terreno });
  };

  const formatPrice = (price: string) => {
    return price.startsWith('R$') ? price : `R$ ${price}`;
  };

  const getDisponibilidadeColor = (disponibilidade: string) => {
    switch (disponibilidade.toLowerCase()) {
      case 'disponível':
        return '#27ae60';
      case 'reservado':
        return '#f39c12';
      case 'vendido':
        return '#e74c3c';
      default:
        return '#7f8c8d';
    }
  };

  const renderTerreno = ({ item }: { item: Terreno }) => (
    <View style={styles.terrenoCard}>
      <View style={styles.terrenoHeader}>
        <View style={styles.terrenoInfo}>
          <Text style={styles.terrenoLocalizacao}>{item.localizacao}</Text>
          <Text style={styles.terrenoCemiterio}>{item.cemiterio}</Text>
        </View>
        <View style={styles.terrenoActions}>
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
      
      <View style={styles.terrenoDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tamanho:</Text>
          <Text style={styles.detailValue}>{item.tamanho}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Preço:</Text>
          <Text style={[styles.detailValue, styles.priceText]}>{formatPrice(item.preco)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getDisponibilidadeColor(item.disponibilidade) }]}>
            <Text style={styles.statusText}>{item.disponibilidade}</Text>
          </View>
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
      <Text style={styles.emptyTitle}>Nenhum terreno encontrado</Text>
      <Text style={styles.emptySubtitle}>
        Comece cadastrando o primeiro terreno para sepultamento
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('TerrenoForm', {})}
      >
        <Text style={styles.emptyButtonText}>Cadastrar Primeiro Terreno</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={terrenos}
        keyExtractor={(item) => item.id}
        renderItem={renderTerreno}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#228B22']}
            tintColor="#228B22"
          />
        }
      />
      
      {terrenos.length > 0 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('TerrenoForm', {})}
        >
          <Text style={styles.addButtonText}>+ Novo Terreno</Text>
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
  terrenoCard: {
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
    borderLeftColor: '#228B22',
  },
  terrenoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  terrenoInfo: {
    flex: 1,
  },
  terrenoLocalizacao: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  terrenoCemiterio: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  terrenoActions: {
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
  terrenoDetails: {
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#228B22',
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
    backgroundColor: '#228B22',
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