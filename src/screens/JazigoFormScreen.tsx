import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Jazigo } from './JazigoListScreen';

type RootStackParamList = {
  JazigoList: undefined;
  JazigoForm: { jazigo?: Jazigo };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'JazigoForm'>;
type JazigoFormRouteProp = RouteProp<RootStackParamList, 'JazigoForm'>;

export default function JazigoFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<JazigoFormRouteProp>();
  
  const isEditing = !!route.params?.jazigo;
  const jazigoToEdit = route.params?.jazigo;

  const [nomeFamilia, setNomeFamilia] = useState(jazigoToEdit?.nomeFamilia || '');
  const [localizacao, setLocalizacao] = useState(jazigoToEdit?.localizacao || '');
  const [capacidade, setCapacidade] = useState(jazigoToEdit?.capacidade || '');
  const [preco, setPreco] = useState(jazigoToEdit?.preco?.replace('R$ ', '') || '');
  const [dataAquisicao, setDataAquisicao] = useState(jazigoToEdit?.dataAquisicao || '');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const applyPriceMask = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (!numericValue) return '';
    const number = parseInt(numericValue) / 100;
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const applyDateMask = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 2) return numericValue;
    if (numericValue.length <= 4) return `${numericValue.slice(0, 2)}/${numericValue.slice(2)}`;
    return `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}/${numericValue.slice(4, 8)}`;
  };

  const isValidDate = (dateString: string) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(regex);
    if (!match) return false;
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  };

  const handlePriceChange = (text: string) => {
    const maskedValue = applyPriceMask(text);
    setPreco(maskedValue);
    if (errors.preco) setErrors(prev => ({ ...prev, preco: '' }));
  };

  const handleDateChange = (text: string) => {
    const maskedValue = applyDateMask(text);
    setDataAquisicao(maskedValue);
    if (errors.dataAquisicao) setErrors(prev => ({ ...prev, dataAquisicao: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!nomeFamilia.trim()) {
      newErrors.nomeFamilia = 'Nome da família é obrigatório';
    } else if (nomeFamilia.trim().length < 2) {
      newErrors.nomeFamilia = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!localizacao.trim()) {
      newErrors.localizacao = 'Localização é obrigatória';
    }

    if (!capacidade.trim()) {
      newErrors.capacidade = 'Capacidade é obrigatória';
    }

    if (!dataAquisicao.trim()) {
      newErrors.dataAquisicao = 'Data de aquisição é obrigatória';
    } else if (!isValidDate(dataAquisicao)) {
      newErrors.dataAquisicao = 'Data inválida (use DD/MM/AAAA)';
    }

    if (!preco.trim()) {
      newErrors.preco = 'Preço é obrigatório';
    } else {
      const numericValue = parseFloat(preco.replace(/[^\d,]/g, '').replace(',', '.'));
      if (numericValue <= 0) {
        newErrors.preco = 'Preço deve ser maior que zero';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Erro', 'Por favor, corrija os campos destacados');
      return;
    }

    try {
      const jazigoData: Jazigo = {
        id: isEditing ? jazigoToEdit!.id : Date.now().toString(),
        nomeFamilia: nomeFamilia.trim(),
        localizacao: localizacao.trim(),
        capacidade: capacidade.trim(),
        preco: `R$ ${preco}`,
        dataAquisicao: dataAquisicao.trim(),
        createdAt: isEditing ? jazigoToEdit!.createdAt : new Date().toISOString(),
      };

      const existingJazigos = await AsyncStorage.getItem('jazigos');
      let jazigos: Jazigo[] = existingJazigos ? JSON.parse(existingJazigos) : [];

      if (isEditing) {
        const index = jazigos.findIndex(j => j.id === jazigoToEdit!.id);
        if (index !== -1) {
          jazigos[index] = jazigoData;
        }
      } else {
        jazigos.push(jazigoData);
      }

      await AsyncStorage.setItem('jazigos', JSON.stringify(jazigos));
      
      Alert.alert(
        'Sucesso',
        isEditing ? 'Jazigo atualizado com sucesso!' : 'Jazigo cadastrado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Erro ao salvar jazigo:', error);
      Alert.alert('Erro', 'Não foi possível salvar o jazigo');
    }
  };

  const handleCancel = () => {
    if (nomeFamilia || localizacao || capacidade || preco || dataAquisicao) {
      Alert.alert(
        'Descartar alterações?',
        'Você tem alterações não salvas. Deseja realmente sair?',
        [
          { text: 'Continuar editando', style: 'cancel' },
          { text: 'Descartar', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditing ? 'Editar Jazigo' : 'Novo Jazigo'}
            </Text>
            <Text style={styles.subtitle}>
              {isEditing ? 'Modifique as informações do jazigo' : 'Cadastre um novo jazigo familiar'}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome da Família *</Text>
              <TextInput
                style={[styles.input, errors.nomeFamilia && styles.inputError]}
                value={nomeFamilia}
                onChangeText={(text) => {
                  setNomeFamilia(text);
                  if (errors.nomeFamilia) {
                    setErrors(prev => ({ ...prev, nomeFamilia: '' }));
                  }
                }}
                placeholder="Ex: Família Silva"
                placeholderTextColor="#95a5a6"
                maxLength={100}
              />
              {errors.nomeFamilia && <Text style={styles.errorText}>{errors.nomeFamilia}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Localização *</Text>
              <TextInput
                style={[styles.input, errors.localizacao && styles.inputError]}
                value={localizacao}
                onChangeText={(text) => {
                  setLocalizacao(text);
                  if (errors.localizacao) {
                    setErrors(prev => ({ ...prev, localizacao: '' }));
                  }
                }}
                placeholder="Ex: Setor B, Quadra 10, Jazigo 25"
                placeholderTextColor="#95a5a6"
                maxLength={100}
              />
              {errors.localizacao && <Text style={styles.errorText}>{errors.localizacao}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Capacidade *</Text>
              <TextInput
                style={[styles.input, errors.capacidade && styles.inputError]}
                value={capacidade}
                onChangeText={(text) => {
                  setCapacidade(text);
                  if (errors.capacidade) {
                    setErrors(prev => ({ ...prev, capacidade: '' }));
                  }
                }}
                placeholder="Ex: 6 pessoas, 4 gavetas"
                placeholderTextColor="#95a5a6"
                maxLength={50}
              />
              {errors.capacidade && <Text style={styles.errorText}>{errors.capacidade}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preço *</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>R$</Text>
                <TextInput
                  style={[styles.priceInput, errors.preco && styles.inputError]}
                  value={preco}
                  onChangeText={handlePriceChange}
                  placeholder="0,00"
                  placeholderTextColor="#95a5a6"
                  keyboardType="numeric"
                />
              </View>
              {errors.preco && <Text style={styles.errorText}>{errors.preco}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data de Aquisição *</Text>
              <TextInput
                style={[styles.input, errors.dataAquisicao && styles.inputError]}
                value={dataAquisicao}
                onChangeText={handleDateChange}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#95a5a6"
                keyboardType="numeric"
                maxLength={10}
              />
              {errors.dataAquisicao && <Text style={styles.errorText}>{errors.dataAquisicao}</Text>}
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Atualizar' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 22,
  },
  form: {
    flex: 1,
    gap: 20,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2c3e50',
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    paddingLeft: 16,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '600',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 0,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
    paddingBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#696969',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});