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
import { Decoracao } from './DecoracaoListScreen';

type RootStackParamList = {
  DecoracaoList: undefined;
  DecoracaoForm: { decoracao?: Decoracao };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'DecoracaoForm'>;
type DecoracaoFormRouteProp = RouteProp<RootStackParamList, 'DecoracaoForm'>;

export default function DecoracaoFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DecoracaoFormRouteProp>();
  
  const isEditing = !!route.params?.decoracao;
  const decoracaoToEdit = route.params?.decoracao;

  const [tipoDecoracao, setTipoDecoracao] = useState(decoracaoToEdit?.tipoDecoracao || '');
  const [descricao, setDescricao] = useState(decoracaoToEdit?.descricao || '');
  const [preco, setPreco] = useState(decoracaoToEdit?.preco?.replace('R$ ', '') || '');
  const [dataEvento, setDataEvento] = useState(decoracaoToEdit?.dataEvento || '');
  const [observacoes, setObservacoes] = useState(decoracaoToEdit?.observacoes || '');

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
    setDataEvento(maskedValue);
    if (errors.dataEvento) setErrors(prev => ({ ...prev, dataEvento: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!tipoDecoracao.trim()) {
      newErrors.tipoDecoracao = 'Tipo de decoração é obrigatório';
    }

    if (!descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (descricao.trim().length < 10) {
      newErrors.descricao = 'Descrição deve ter pelo menos 10 caracteres';
    }

    if (!preco.trim()) {
      newErrors.preco = 'Preço é obrigatório';
    } else {
      const numericValue = parseFloat(preco.replace(/[^\d,]/g, '').replace(',', '.'));
      if (numericValue <= 0) {
        newErrors.preco = 'Preço deve ser maior que zero';
      }
    }

    if (!dataEvento.trim()) {
      newErrors.dataEvento = 'Data do evento é obrigatória';
    } else if (!isValidDate(dataEvento)) {
      newErrors.dataEvento = 'Data inválida (use DD/MM/AAAA)';
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
      const decoracaoData: Decoracao = {
        id: isEditing ? decoracaoToEdit!.id : Date.now().toString(),
        tipoDecoracao: tipoDecoracao.trim(),
        descricao: descricao.trim(),
        preco: `R$ ${preco}`,
        dataEvento: dataEvento.trim(),
        observacoes: observacoes.trim(),
        createdAt: isEditing ? decoracaoToEdit!.createdAt : new Date().toISOString(),
      };

      const existingDecoracoes = await AsyncStorage.getItem('decoracoes');
      let decoracoes: Decoracao[] = existingDecoracoes ? JSON.parse(existingDecoracoes) : [];

      if (isEditing) {
        const index = decoracoes.findIndex(d => d.id === decoracaoToEdit!.id);
        if (index !== -1) {
          decoracoes[index] = decoracaoData;
        }
      } else {
        decoracoes.push(decoracaoData);
      }

      await AsyncStorage.setItem('decoracoes', JSON.stringify(decoracoes));
      
      Alert.alert(
        'Sucesso',
        isEditing ? 'Decoração atualizada com sucesso!' : 'Decoração cadastrada com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Erro ao salvar decoração:', error);
      Alert.alert('Erro', 'Não foi possível salvar a decoração');
    }
  };

  const handleCancel = () => {
    if (tipoDecoracao || descricao || preco || dataEvento || observacoes) {
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
              {isEditing ? 'Editar Decoração' : 'Nova Decoração'}
            </Text>
            <Text style={styles.subtitle}>
              {isEditing ? 'Modifique as informações da decoração' : 'Cadastre uma nova decoração de cemitério'}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de Decoração *</Text>
              <TextInput
                style={[styles.input, errors.tipoDecoracao && styles.inputError]}
                value={tipoDecoracao}
                onChangeText={(text) => {
                  setTipoDecoracao(text);
                  if (errors.tipoDecoracao) {
                    setErrors(prev => ({ ...prev, tipoDecoracao: '' }));
                  }
                }}
                placeholder="Ex: Coroa de Flores, Arranjo Funeral, Velas"
                placeholderTextColor="#95a5a6"
                maxLength={80}
              />
              {errors.tipoDecoracao && <Text style={styles.errorText}>{errors.tipoDecoracao}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição *</Text>
              <TextInput
                style={[styles.textArea, errors.descricao && styles.inputError]}
                value={descricao}
                onChangeText={(text) => {
                  setDescricao(text);
                  if (errors.descricao) {
                    setErrors(prev => ({ ...prev, descricao: '' }));
                  }
                }}
                placeholder="Descreva os detalhes da decoração, cores, tamanho, materiais..."
                placeholderTextColor="#95a5a6"
                multiline
                numberOfLines={4}
                maxLength={200}
              />
              {errors.descricao && <Text style={styles.errorText}>{errors.descricao}</Text>}
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
              <Text style={styles.label}>Data do Evento *</Text>
              <TextInput
                style={[styles.input, errors.dataEvento && styles.inputError]}
                value={dataEvento}
                onChangeText={handleDateChange}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#95a5a6"
                keyboardType="numeric"
                maxLength={10}
              />
              {errors.dataEvento && <Text style={styles.errorText}>{errors.dataEvento}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observações</Text>
              <TextInput
                style={styles.textArea}
                value={observacoes}
                onChangeText={setObservacoes}
                placeholder="Informações adicionais, instruções especiais..."
                placeholderTextColor="#95a5a6"
                multiline
                numberOfLines={3}
                maxLength={150}
              />
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
  textArea: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2c3e50',
    minHeight: 100,
    textAlignVertical: 'top',
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
    backgroundColor: '#FF69B4',
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