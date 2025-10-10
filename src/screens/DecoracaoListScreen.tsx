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
  DecoracaoList: undefined;
  DecoracaoForm: { decoracao?: Decoracao };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'DecoracaoList'>;

export interface Decoracao {
  id: string;
  tipoDecoracao: string;
  descricao: string;
  preco: string;
  dataEvento: string;
  observacoes: string;
  createdAt: string;
}

export default function DecoracaoListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [decoracoes, setDecoracoes] = useState<Decoracao[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDecoracoes = async () => {
    try {
      const saved = await AsyncStorage.getItem('decoracoes');
      if (saved) {
        const parsedDecoracoes = JSON.parse(saved);
        const sortedDecoracoes = parsedDecoracoes.sort((a: Decoracao, b: Decoracao) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setDecoracoes(sortedDecoracoes);
      }
    } catch (error) {
      console.error('Erro ao carregar decorações:', error);
      Alert.alert('Erro', 'Não foi possível carregar as decorações');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDecoracoes();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDecoracoes();
    setRefreshing(false);
  }, []);

  const handleDelete = (decoracaoId: string) => {
    const decoracao = decoracoes.find(d => d.id === decoracaoId);
    
    Alert.alert(
      'Excluir Decoração',
      `Tem certeza que deseja excluir "${decoracao?.tipoDecoracao}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedDecoracoes = decoracoes.filter(d => d.id !== decoracaoId);
              await AsyncStorage.setItem('decoracoes', JSON.stringify(updatedDecoracoes));
              setDecoracoes(updatedDecoracoes);
              Alert.alert('Sucesso', 'Decoração excluída com sucesso');
            } catch (error) {
              console.error('Erro ao excluir decoração:', error);
              Alert.alert('Erro', 'Não foi possível excluir a decoração');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (decoracao: Decoracao) => {
    navigation.navigate('DecoracaoForm', { decoracao });
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

  const renderDecoracao = ({ item }: { item: Decoracao }) => (
    <View style={styles.decoracaoCard}>
      <View style={styles.decoracaoHeader}>
        <View style={styles.decoracaoInfo}>
          <Text style={styles.decoracaoTipo}>{item.tipoDecoracao}</Text>
          <Text style={styles.decoracaoDescricao} numberOfLines={2}>{item.descricao}</Text>
        </View>
        <View style={styles.decoracaoActions}>
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
      
      <View style={styles.decoracaoDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Preço:</Text>
          <Text style={[styles.detailValue, styles.priceText]}>{formatPrice(item.preco)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Data do Evento:</Text>
          <Text style={styles.detailValue}>{formatDate(item.dataEvento)}</Text>
        </View>
        {item.observacoes && (
          <View style={styles.observacoesContainer}>
            <Text style={styles.observacoesLabel}>Observações:</Text>
            <Text style={styles.observacoesText}>{item.observacoes}</Text>
          </View>
        )}
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
      <Text style={styles.emptyTitle}>Nenhuma decoração encontrada</Text>
      <Text style={styles.emptySubtitle}>
        Comece cadastrando a primeira decoração de cemitério
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('DecoracaoForm', {})}
      >
        <Text style={styles.emptyButtonText}>Cadastrar Primeira Decoração</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={decoracoes}
        keyExtractor={(item) => item.id}
        renderItem={renderDecoracao}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF69B4']}
            tintColor="#FF69B4"
          />
        }
      />
      
      {decoracoes.length > 0 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('DecoracaoForm', {})}
        >
          <Text style={styles.addButtonText}>+ Nova Decoração</Text>
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
  decoracaoCard: {
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
    borderLeftColor: '#FF69B4',
  },
  decoracaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  decoracaoInfo: {
    flex: 1,
  },
  decoracaoTipo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  decoracaoDescricao: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  decoracaoActions: {
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
  decoracaoDetails: {
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
  observacoesContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  observacoesLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '600',
    marginBottom: 4,
  },
  observacoesText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 18,
  },
  addButton: {
    backgroundColor: '#FF69B4',
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
    backgroundColor: '#FF69B4',
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