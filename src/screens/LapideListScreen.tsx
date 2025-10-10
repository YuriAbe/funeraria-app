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
  LapideList: undefined;
  LapideForm: { lapide?: Lapide };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'LapideList'>;

export interface Lapide {
  id: string;
  nomePersonalizado: string;
  tipoGravacao: string;
  material: string;
  preco: string;
  dataEntrega: string;
  createdAt: string;
}

export default function LapideListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [lapides, setLapides] = useState<Lapide[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadLapides = async () => {
    try {
      const saved = await AsyncStorage.getItem('lapides');
      if (saved) {
        const parsedLapides = JSON.parse(saved);
        const sortedLapides = parsedLapides.sort((a: Lapide, b: Lapide) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setLapides(sortedLapides);
      }
    } catch (error) {
      console.error('Erro ao carregar lápides:', error);
      Alert.alert('Erro', 'Não foi possível carregar as lápides');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLapides();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadLapides();
    setRefreshing(false);
  }, []);

  const handleDelete = (lapideId: string) => {
    const lapide = lapides.find(l => l.id === lapideId);
    
    Alert.alert(
      'Excluir Lápide',
      `Tem certeza que deseja excluir a lápide "${lapide?.nomePersonalizado}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedLapides = lapides.filter(l => l.id !== lapideId);
              await AsyncStorage.setItem('lapides', JSON.stringify(updatedLapides));
              setLapides(updatedLapides);
              Alert.alert('Sucesso', 'Lápide excluída com sucesso');
            } catch (error) {
              console.error('Erro ao excluir lápide:', error);
              Alert.alert('Erro', 'Não foi possível excluir a lápide');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (lapide: Lapide) => {
    navigation.navigate('LapideForm', { lapide });
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

  const renderLapide = ({ item }: { item: Lapide }) => (
    <View style={styles.lapideCard}>
      <View style={styles.lapideHeader}>
        <View style={styles.lapideInfo}>
          <Text style={styles.lapideNome}>{item.nomePersonalizado}</Text>
          <Text style={styles.lapideTipo}>{item.tipoGravacao}</Text>
        </View>
        <View style={styles.lapideActions}>
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
      
      <View style={styles.lapideDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Material:</Text>
          <Text style={styles.detailValue}>{item.material}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Preço:</Text>
          <Text style={[styles.detailValue, styles.priceText]}>{formatPrice(item.preco)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Data de Entrega:</Text>
          <Text style={styles.detailValue}>{formatDate(item.dataEntrega)}</Text>
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
      <Text style={styles.emptyTitle}>Nenhuma lápide encontrada</Text>
      <Text style={styles.emptySubtitle}>
        Comece cadastrando a primeira personalização de lápide
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('LapideForm', {})}
      >
        <Text style={styles.emptyButtonText}>Cadastrar Primeira Lápide</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={lapides}
        keyExtractor={(item) => item.id}
        renderItem={renderLapide}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#A9A9A9']}
            tintColor="#A9A9A9"
          />
        }
      />
      
      {lapides.length > 0 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('LapideForm', {})}
        >
          <Text style={styles.addButtonText}>+ Nova Lápide</Text>
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
  lapideCard: {
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
    borderLeftColor: '#A9A9A9',
  },
  lapideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  lapideInfo: {
    flex: 1,
  },
  lapideNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  lapideTipo: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  lapideActions: {
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
  lapideDetails: {
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
    backgroundColor: '#A9A9A9',
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
    backgroundColor: '#A9A9A9',
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