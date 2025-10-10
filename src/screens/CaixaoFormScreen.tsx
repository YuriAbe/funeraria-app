import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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

type NavigationProp = StackNavigationProp<RootStackParamList, 'CaixaoForm'>;
type RoutePropType = RouteProp<RootStackParamList, 'CaixaoForm'>;

interface Caixao {
  id: string;
  nome: string;
  material: string;
  cor: string;
  preco: string;
  descricao: string;
  createdAt: string;
}

export default function CaixaoFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { caixao } = route.params || {};

  const isEditing = !!caixao;

  // Estados do formulário
  const [nome, setNome] = useState(caixao?.nome || '');
  const [material, setMaterial] = useState(caixao?.material || '');
  const [cor, setCor] = useState(caixao?.cor || '');
  const [preco, setPreco] = useState(caixao?.preco || '');
  const [descricao, setDescricao] = useState(caixao?.descricao || '');
  const [loading, setLoading] = useState(false);

  // Validações
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Aplicar máscara de preço
  const applyPriceMask = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = (parseInt(cleaned) / 100).toFixed(2);
    return formatted;
  };

  const handlePriceChange = (text: string) => {
    if (text === '') {
      setPreco('');
      return;
    }
    const formatted = applyPriceMask(text);
    setPreco(formatted);
  };

  // Validar formulário
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!material.trim()) newErrors.material = 'Material é obrigatório';
    if (!cor.trim()) newErrors.cor = 'Cor é obrigatória';
    if (!preco.trim()) {
      newErrors.preco = 'Preço é obrigatório';
    } else {
      const precoNum = parseFloat(preco);
      if (isNaN(precoNum) || precoNum <= 0) {
        newErrors.preco = 'Preço deve ser um valor válido maior que zero';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Salvar caixão
  const saveCaixao = async () => {
    if (!validateForm()) {
      Alert.alert('Erro', 'Por favor, corrija os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      // Carregar caixões existentes
      const stored = await AsyncStorage.getItem('caixoes');
      const existingCaixoes: Caixao[] = stored ? JSON.parse(stored) : [];

      const caixaoData: Caixao = {
        id: isEditing ? caixao!.id : Date.now().toString(),
        nome: nome.trim(),
        material: material.trim(),
        cor: cor.trim(),
        preco: preco,
        descricao: descricao.trim(),
        createdAt: isEditing ? caixao!.createdAt : new Date().toISOString(),
      };

      let updatedCaixoes: Caixao[];
      if (isEditing) {
        // Atualizar caixão existente
        updatedCaixoes = existingCaixoes.map(c => 
          c.id === caixao!.id ? caixaoData : c
        );
      } else {
        // Adicionar novo caixão
        updatedCaixoes = [...existingCaixoes, caixaoData];
      }

      await AsyncStorage.setItem('caixoes', JSON.stringify(updatedCaixoes));
      
      Alert.alert(
        'Sucesso',
        `Caixão ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.error('Erro ao salvar caixão:', err);
      Alert.alert('Erro', 'Não foi possível salvar o caixão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEditing ? 'Editar Caixão' : 'Novo Caixão'}
          </Text>
        </View>

        <View style={styles.form}>
          {/* Nome */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome do Caixão *</Text>
            <TextInput
              style={[styles.input, errors.nome && styles.inputError]}
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Caixão Tradicional Mogno"
              maxLength={50}
            />
            {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
          </View>

          {/* Material */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Material *</Text>
            <TextInput
              style={[styles.input, errors.material && styles.inputError]}
              value={material}
              onChangeText={setMaterial}
              placeholder="Ex: Mogno, Cedro, MDF, Pinus"
              maxLength={30}
            />
            {errors.material && <Text style={styles.errorText}>{errors.material}</Text>}
          </View>

          {/* Cor */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cor *</Text>
            <TextInput
              style={[styles.input, errors.cor && styles.inputError]}
              value={cor}
              onChangeText={setCor}
              placeholder="Ex: Natural, Escuro, Branco, Marrom"
              maxLength={25}
            />
            {errors.cor && <Text style={styles.errorText}>{errors.cor}</Text>}
          </View>

          {/* Preço */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Preço (R$) *</Text>
            <TextInput
              style={[styles.input, errors.preco && styles.inputError]}
              value={preco}
              onChangeText={handlePriceChange}
              placeholder="0.00"
              keyboardType="numeric"
            />
            {errors.preco && <Text style={styles.errorText}>{errors.preco}</Text>}
          </View>

          {/* Descrição */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Descrição detalhada do caixão, acabamentos, características especiais..."
              multiline
              numberOfLines={4}
              maxLength={200}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{descricao.length}/200</Text>
          </View>

          <Text style={styles.requiredNote}>* Campos obrigatórios</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={saveCaixao}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Cadastrar')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2c3e50',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  characterCount: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'right',
    marginTop: 4,
  },
  requiredNote: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3a4774',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});