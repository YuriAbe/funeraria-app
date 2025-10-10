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
import { Terreno } from './TerrenoListScreen';

type RootStackParamList = {
  TerrenoList: undefined;
  TerrenoForm: { terreno?: Terreno };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'TerrenoForm'>;
type TerrenoFormRouteProp = RouteProp<RootStackParamList, 'TerrenoForm'>;

export default function TerrenoFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TerrenoFormRouteProp>();
  
  const isEditing = !!route.params?.terreno;
  const terrenoToEdit = route.params?.terreno;

  const [localizacao, setLocalizacao] = useState(terrenoToEdit?.localizacao || '');
  const [tamanho, setTamanho] = useState(terrenoToEdit?.tamanho || '');
  const [preco, setPreco] = useState(terrenoToEdit?.preco?.replace('R$ ', '') || '');
  const [disponibilidade, setDisponibilidade] = useState(terrenoToEdit?.disponibilidade || 'Disponível');
  const [cemiterio, setCemiterio] = useState(terrenoToEdit?.cemiterio || '');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const disponibilidadeOptions = ['Disponível', 'Reservado', 'Vendido'];

  const applyPriceMask = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    
    if (!numericValue) return '';
    
    const number = parseInt(numericValue) / 100;
    
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handlePriceChange = (text: string) => {
    const maskedValue = applyPriceMask(text);
    setPreco(maskedValue);
    
    if (errors.preco) {
      setErrors(prev => ({ ...prev, preco: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!localizacao.trim()) {
      newErrors.localizacao = 'Localização é obrigatória';
    } else if (localizacao.trim().length < 3) {
      newErrors.localizacao = 'Localização deve ter pelo menos 3 caracteres';
    }

    if (!tamanho.trim()) {
      newErrors.tamanho = 'Tamanho é obrigatório';
    }

    if (!preco.trim()) {
      newErrors.preco = 'Preço é obrigatório';
    } else {
      const numericValue = parseFloat(preco.replace(/[^\d,]/g, '').replace(',', '.'));
      if (numericValue <= 0) {
        newErrors.preco = 'Preço deve ser maior que zero';
      }
    }

    if (!cemiterio.trim()) {
      newErrors.cemiterio = 'Cemitério é obrigatório';
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
      const terrenoData: Terreno = {
        id: isEditing ? terrenoToEdit!.id : Date.now().toString(),
        localizacao: localizacao.trim(),
        tamanho: tamanho.trim(),
        preco: `R$ ${preco}`,
        disponibilidade,
        cemiterio: cemiterio.trim(),
        createdAt: isEditing ? terrenoToEdit!.createdAt : new Date().toISOString(),
      };

      const existingTerrenos = await AsyncStorage.getItem('terrenos');
      let terrenos: Terreno[] = existingTerrenos ? JSON.parse(existingTerrenos) : [];

      if (isEditing) {
        const index = terrenos.findIndex(t => t.id === terrenoToEdit!.id);
        if (index !== -1) {
          terrenos[index] = terrenoData;
        }
      } else {
        terrenos.push(terrenoData);
      }

      await AsyncStorage.setItem('terrenos', JSON.stringify(terrenos));
      
      Alert.alert(
        'Sucesso',
        isEditing ? 'Terreno atualizado com sucesso!' : 'Terreno cadastrado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Erro ao salvar terreno:', error);
      Alert.alert('Erro', 'Não foi possível salvar o terreno');
    }
  };

  const handleCancel = () => {
    if (localizacao || tamanho || preco || cemiterio) {
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
              {isEditing ? 'Editar Terreno' : 'Novo Terreno'}
            </Text>
            <Text style={styles.subtitle}>
              {isEditing ? 'Modifique as informações do terreno' : 'Cadastre um novo terreno para sepultamento'}
            </Text>
          </View>

          <View style={styles.form}>
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
                placeholder="Ex: Quadra A, Lote 15"
                placeholderTextColor="#95a5a6"
                maxLength={100}
              />
              {errors.localizacao && <Text style={styles.errorText}>{errors.localizacao}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tamanho *</Text>
              <TextInput
                style={[styles.input, errors.tamanho && styles.inputError]}
                value={tamanho}
                onChangeText={(text) => {
                  setTamanho(text);
                  if (errors.tamanho) {
                    setErrors(prev => ({ ...prev, tamanho: '' }));
                  }
                }}
                placeholder="Ex: 2m x 1m, 2,5m²"
                placeholderTextColor="#95a5a6"
                maxLength={50}
              />
              {errors.tamanho && <Text style={styles.errorText}>{errors.tamanho}</Text>}
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
              <Text style={styles.label}>Disponibilidade *</Text>
              <View style={styles.radioContainer}>
                {disponibilidadeOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.radioOption}
                    onPress={() => setDisponibilidade(option)}
                  >
                    <View style={[
                      styles.radioCircle,
                      disponibilidade === option && styles.radioCircleSelected
                    ]}>
                      {disponibilidade === option && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[
                      styles.radioText,
                      disponibilidade === option && styles.radioTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cemitério *</Text>
              <TextInput
                style={[styles.input, errors.cemiterio && styles.inputError]}
                value={cemiterio}
                onChangeText={(text) => {
                  setCemiterio(text);
                  if (errors.cemiterio) {
                    setErrors(prev => ({ ...prev, cemiterio: '' }));
                  }
                }}
                placeholder="Ex: Cemitério São João, Parque da Paz"
                placeholderTextColor="#95a5a6"
                maxLength={80}
              />
              {errors.cemiterio && <Text style={styles.errorText}>{errors.cemiterio}</Text>}
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
    borderColor: '#228B22',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#228B22',
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
    backgroundColor: '#228B22',
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