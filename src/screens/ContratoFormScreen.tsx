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
import { Contrato } from './ContratoListScreen';

type RootStackParamList = {
  ContratoList: undefined;
  ContratoForm: { contrato?: Contrato };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'ContratoForm'>;
type ContratoFormRouteProp = RouteProp<RootStackParamList, 'ContratoForm'>;

export default function ContratoFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ContratoFormRouteProp>();
  
  const isEditing = !!route.params?.contrato;
  const contratoToEdit = route.params?.contrato;

  const [nomeCliente, setNomeCliente] = useState(contratoToEdit?.nomeCliente || '');
  const [modeloCaixao, setModeloCaixao] = useState(contratoToEdit?.modeloCaixao || '');
  const [material, setMaterial] = useState(contratoToEdit?.material || '');
  const [dataContrato, setDataContrato] = useState(contratoToEdit?.dataContrato || '');
  const [valorTotal, setValorTotal] = useState(contratoToEdit?.valorTotal?.replace('R$ ', '') || '');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const applyPriceMask = (value: string) => {
    // Remove tudo que não é número
    const numericValue = value.replace(/[^\d]/g, '');
    
    if (!numericValue) return '';
    
    // Converte para número e divide por 100 para ter os centavos
    const number = parseInt(numericValue) / 100;
    
    // Formata como moeda
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const applyDateMask = (value: string) => {
    // Remove tudo que não é número
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
    setValorTotal(maskedValue);
    
    if (errors.valorTotal) {
      setErrors(prev => ({ ...prev, valorTotal: '' }));
    }
  };

  const handleDateChange = (text: string) => {
    const maskedValue = applyDateMask(text);
    setDataContrato(maskedValue);
    
    if (errors.dataContrato) {
      setErrors(prev => ({ ...prev, dataContrato: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!nomeCliente.trim()) {
      newErrors.nomeCliente = 'Nome do cliente é obrigatório';
    } else if (nomeCliente.trim().length < 2) {
      newErrors.nomeCliente = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!modeloCaixao.trim()) {
      newErrors.modeloCaixao = 'Modelo do caixão é obrigatório';
    }

    if (!material.trim()) {
      newErrors.material = 'Material é obrigatório';
    }

    if (!dataContrato.trim()) {
      newErrors.dataContrato = 'Data do contrato é obrigatória';
    } else if (!isValidDate(dataContrato)) {
      newErrors.dataContrato = 'Data inválida (use DD/MM/AAAA)';
    }

    if (!valorTotal.trim()) {
      newErrors.valorTotal = 'Valor total é obrigatório';
    } else {
      const numericValue = parseFloat(valorTotal.replace(/[^\d,]/g, '').replace(',', '.'));
      if (numericValue <= 0) {
        newErrors.valorTotal = 'Valor deve ser maior que zero';
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
      const contratoData: Contrato = {
        id: isEditing ? contratoToEdit!.id : Date.now().toString(),
        nomeCliente: nomeCliente.trim(),
        modeloCaixao: modeloCaixao.trim(),
        material: material.trim(),
        dataContrato: dataContrato.trim(),
        valorTotal: `R$ ${valorTotal}`,
        createdAt: isEditing ? contratoToEdit!.createdAt : new Date().toISOString(),
      };

      const existingContratos = await AsyncStorage.getItem('contratos');
      let contratos: Contrato[] = existingContratos ? JSON.parse(existingContratos) : [];

      if (isEditing) {
        const index = contratos.findIndex(c => c.id === contratoToEdit!.id);
        if (index !== -1) {
          contratos[index] = contratoData;
        }
      } else {
        contratos.push(contratoData);
      }

      await AsyncStorage.setItem('contratos', JSON.stringify(contratos));
      
      Alert.alert(
        'Sucesso',
        isEditing ? 'Contrato atualizado com sucesso!' : 'Contrato criado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Erro ao salvar contrato:', error);
      Alert.alert('Erro', 'Não foi possível salvar o contrato');
    }
  };

  const handleCancel = () => {
    if (nomeCliente || modeloCaixao || material || dataContrato || valorTotal) {
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
              {isEditing ? 'Editar Contrato' : 'Novo Contrato'}
            </Text>
            <Text style={styles.subtitle}>
              {isEditing ? 'Modifique as informações do contrato' : 'Preencha as informações do novo contrato'}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome do Cliente *</Text>
              <TextInput
                style={[styles.input, errors.nomeCliente && styles.inputError]}
                value={nomeCliente}
                onChangeText={(text) => {
                  setNomeCliente(text);
                  if (errors.nomeCliente) {
                    setErrors(prev => ({ ...prev, nomeCliente: '' }));
                  }
                }}
                placeholder="Ex: João Silva"
                placeholderTextColor="#95a5a6"
                maxLength={100}
              />
              {errors.nomeCliente && <Text style={styles.errorText}>{errors.nomeCliente}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Modelo do Caixão *</Text>
              <TextInput
                style={[styles.input, errors.modeloCaixao && styles.inputError]}
                value={modeloCaixao}
                onChangeText={(text) => {
                  setModeloCaixao(text);
                  if (errors.modeloCaixao) {
                    setErrors(prev => ({ ...prev, modeloCaixao: '' }));
                  }
                }}
                placeholder="Ex: Modelo Premium, Simples, Luxo"
                placeholderTextColor="#95a5a6"
                maxLength={80}
              />
              {errors.modeloCaixao && <Text style={styles.errorText}>{errors.modeloCaixao}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Material *</Text>
              <TextInput
                style={[styles.input, errors.material && styles.inputError]}
                value={material}
                onChangeText={(text) => {
                  setMaterial(text);
                  if (errors.material) {
                    setErrors(prev => ({ ...prev, material: '' }));
                  }
                }}
                placeholder="Ex: Madeira Nobre, Metal, MDF"
                placeholderTextColor="#95a5a6"
                maxLength={50}
              />
              {errors.material && <Text style={styles.errorText}>{errors.material}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data do Contrato *</Text>
              <TextInput
                style={[styles.input, errors.dataContrato && styles.inputError]}
                value={dataContrato}
                onChangeText={handleDateChange}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#95a5a6"
                keyboardType="numeric"
                maxLength={10}
              />
              {errors.dataContrato && <Text style={styles.errorText}>{errors.dataContrato}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Valor Total *</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>R$</Text>
                <TextInput
                  style={[styles.priceInput, errors.valorTotal && styles.inputError]}
                  value={valorTotal}
                  onChangeText={handlePriceChange}
                  placeholder="0,00"
                  placeholderTextColor="#95a5a6"
                  keyboardType="numeric"
                />
              </View>
              {errors.valorTotal && <Text style={styles.errorText}>{errors.valorTotal}</Text>}
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
    backgroundColor: '#8B4513',
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