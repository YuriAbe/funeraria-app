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
import { Lapide } from './LapideListScreen';

type RootStackParamList = {
  LapideList: undefined;
  LapideForm: { lapide?: Lapide };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'LapideForm'>;
type LapideFormRouteProp = RouteProp<RootStackParamList, 'LapideForm'>;

export default function LapideFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LapideFormRouteProp>();
  
  const isEditing = !!route.params?.lapide;
  const lapideToEdit = route.params?.lapide;

  const [nomePersonalizado, setNomePersonalizado] = useState(lapideToEdit?.nomePersonalizado || '');
  const [tipoGravacao, setTipoGravacao] = useState(lapideToEdit?.tipoGravacao || '');
  const [material, setMaterial] = useState(lapideToEdit?.material || '');
  const [preco, setPreco] = useState(lapideToEdit?.preco?.replace('R$ ', '') || '');
  const [dataEntrega, setDataEntrega] = useState(lapideToEdit?.dataEntrega || '');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const tiposGravacao = ['Gravação Simples', 'Gravação com Foto', 'Gravação Artística', 'Gravação Dourada', 'Gravação em Relevo'];
  const materiaisDisponiveis = ['Granito', 'Mármore', 'Bronze', 'Pedra Natural', 'Cerâmica'];

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
    setDataEntrega(maskedValue);
    if (errors.dataEntrega) setErrors(prev => ({ ...prev, dataEntrega: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!nomePersonalizado.trim()) {
      newErrors.nomePersonalizado = 'Nome personalizado é obrigatório';
    } else if (nomePersonalizado.trim().length < 2) {
      newErrors.nomePersonalizado = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!tipoGravacao.trim()) {
      newErrors.tipoGravacao = 'Tipo de gravação é obrigatório';
    }

    if (!material.trim()) {
      newErrors.material = 'Material é obrigatório';
    }

    if (!preco.trim()) {
      newErrors.preco = 'Preço é obrigatório';
    } else {
      const numericValue = parseFloat(preco.replace(/[^\d,]/g, '').replace(',', '.'));
      if (numericValue <= 0) {
        newErrors.preco = 'Preço deve ser maior que zero';
      }
    }

    if (!dataEntrega.trim()) {
      newErrors.dataEntrega = 'Data de entrega é obrigatória';
    } else if (!isValidDate(dataEntrega)) {
      newErrors.dataEntrega = 'Data inválida (use DD/MM/AAAA)';
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
      const lapideData: Lapide = {
        id: isEditing ? lapideToEdit!.id : Date.now().toString(),
        nomePersonalizado: nomePersonalizado.trim(),
        tipoGravacao: tipoGravacao.trim(),
        material: material.trim(),
        preco: `R$ ${preco}`,
        dataEntrega: dataEntrega.trim(),
        createdAt: isEditing ? lapideToEdit!.createdAt : new Date().toISOString(),
      };

      const existingLapides = await AsyncStorage.getItem('lapides');
      let lapides: Lapide[] = existingLapides ? JSON.parse(existingLapides) : [];

      if (isEditing) {
        const index = lapides.findIndex(l => l.id === lapideToEdit!.id);
        if (index !== -1) {
          lapides[index] = lapideData;
        }
      } else {
        lapides.push(lapideData);
      }

      await AsyncStorage.setItem('lapides', JSON.stringify(lapides));
      
      Alert.alert(
        'Sucesso',
        isEditing ? 'Lápide atualizada com sucesso!' : 'Lápide cadastrada com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Erro ao salvar lápide:', error);
      Alert.alert('Erro', 'Não foi possível salvar a lápide');
    }
  };

  const handleCancel = () => {
    if (nomePersonalizado || tipoGravacao || material || preco || dataEntrega) {
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
              {isEditing ? 'Editar Lápide' : 'Nova Lápide'}
            </Text>
            <Text style={styles.subtitle}>
              {isEditing ? 'Modifique as informações da lápide' : 'Cadastre uma nova personalização de lápide'}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Personalizado *</Text>
              <TextInput
                style={[styles.input, errors.nomePersonalizado && styles.inputError]}
                value={nomePersonalizado}
                onChangeText={(text) => {
                  setNomePersonalizado(text);
                  if (errors.nomePersonalizado) {
                    setErrors(prev => ({ ...prev, nomePersonalizado: '' }));
                  }
                }}
                placeholder="Ex: Maria Silva Santos"
                placeholderTextColor="#95a5a6"
                maxLength={100}
              />
              {errors.nomePersonalizado && <Text style={styles.errorText}>{errors.nomePersonalizado}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de Gravação *</Text>
              <View style={styles.radioContainer}>
                {tiposGravacao.map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={styles.radioOption}
                    onPress={() => setTipoGravacao(tipo)}
                  >
                    <View style={[
                      styles.radioCircle,
                      tipoGravacao === tipo && styles.radioCircleSelected
                    ]}>
                      {tipoGravacao === tipo && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[
                      styles.radioText,
                      tipoGravacao === tipo && styles.radioTextSelected
                    ]}>
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.tipoGravacao && <Text style={styles.errorText}>{errors.tipoGravacao}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Material *</Text>
              <View style={styles.radioContainer}>
                {materiaisDisponiveis.map((mat) => (
                  <TouchableOpacity
                    key={mat}
                    style={styles.radioOption}
                    onPress={() => setMaterial(mat)}
                  >
                    <View style={[
                      styles.radioCircle,
                      material === mat && styles.radioCircleSelected
                    ]}>
                      {material === mat && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[
                      styles.radioText,
                      material === mat && styles.radioTextSelected
                    ]}>
                      {mat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.material && <Text style={styles.errorText}>{errors.material}</Text>}
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
              <Text style={styles.label}>Data de Entrega *</Text>
              <TextInput
                style={[styles.input, errors.dataEntrega && styles.inputError]}
                value={dataEntrega}
                onChangeText={handleDateChange}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#95a5a6"
                keyboardType="numeric"
                maxLength={10}
              />
              {errors.dataEntrega && <Text style={styles.errorText}>{errors.dataEntrega}</Text>}
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
  radioContainer: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#A9A9A9',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#A9A9A9',
  },
  radioText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  radioTextSelected: {
    color: '#2c3e50',
    fontWeight: '600',
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
    backgroundColor: '#A9A9A9',
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