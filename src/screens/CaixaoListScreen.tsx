import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  Main: undefined;
  Profile: undefined;
  CaixaoList: undefined;
  CaixaoForm: { caixao?: Caixao };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'CaixaoList'>;

interface Caixao {
  id: string;
  nome: string;
  material: string;
  cor: string;
  preco: string;
  descricao: string;
  createdAt: string;
}

export default function CaixaoListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [caixoes, setCaixoes] = useState<Caixao[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar caixões do AsyncStorage
  const loadCaixoes = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem('caixoes');
      if (stored) {
        const parsedCaixoes = JSON.parse(stored);
        setCaixoes(parsedCaixoes);
        console.log('Caixões carregados:', parsedCaixoes.length);
      }
    } catch (err) {
      console.error('Erro ao carregar caixões:', err);
      Alert.alert('Erro', 'Não foi possível carregar a lista de caixões');
    } finally {
      setLoading(false);
    }
  };

  // Deletar caixão
  const deleteCaixao = async (id: string) => {
    Alert.alert(
      'Deletar Caixão',
      'Tem certeza que deseja deletar este caixão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedCaixoes = caixoes.filter(c => c.id !== id);
              await AsyncStorage.setItem('caixoes', JSON.stringify(updatedCaixoes));
              setCaixoes(updatedCaixoes);
              Alert.alert('Sucesso', 'Caixão deletado com sucesso');
            } catch (err) {
              console.error('Erro ao deletar caixão:', err);
              Alert.alert('Erro', 'Não foi possível deletar o caixão');
            }
          }
        }
      ]
    );
  };

  // Formatar preço para exibição
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? 'R$ 0,00' : `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
  };

  // Recarregar quando a tela entrar em foco
  useFocusEffect(
    React.useCallback(() => {
      loadCaixoes();
    }, [])
  );

  const renderCaixao = ({ item }: { item: Caixao }) => (
    <View style={styles.caixaoCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.caixaoNome}>{item.nome}</Text>
        <Text style={styles.caixaoPreco}>{formatPrice(item.preco)}</Text>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.attribute}>
          <Text style={styles.attributeLabel}>Material: </Text>
          {item.material}
        </Text>
        <Text style={styles.attribute}>
          <Text style={styles.attributeLabel}>Cor: </Text>
          {item.cor}
        </Text>
        <Text style={styles.attribute}>
          <Text style={styles.attributeLabel}>Descrição: </Text>
          {item.descricao || 'Sem descrição'}
        </Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('CaixaoForm', { caixao: item })}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteCaixao(item.id)}
        >
          <Text style={styles.deleteButtonText}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Catálogo de Caixões</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CaixaoForm', {})}
        >
          <Text style={styles.addButtonText}>+ Novo Caixão</Text>
        </TouchableOpacity>
      </View>

      {caixoes.length === 0 ? (
        <View style={styles.emptyState}>
          <Image source={require('../../assets/logosemfundo.png')} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>Nenhum caixão cadastrado</Text>
          <Text style={styles.emptyText}>
            Clique em "Novo Caixão" para adicionar o primeiro item ao catálogo
          </Text>
        </View>
      ) : (
        <FlatList
          data={caixoes}
          renderItem={renderCaixao}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#3a4774',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  caixaoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  caixaoNome: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    flex: 1,
  },
  caixaoPreco: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
  },
  cardContent: {
    marginBottom: 16,
  },
  attribute: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 4,
  },
  attributeLabel: {
    fontWeight: '600',
    color: '#6c757d',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    width: 80,
    height: 60,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
});