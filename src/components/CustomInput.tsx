import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  containerStyle?: object;
}

/**
 * Input customizado reutilizável com label e validação
 * 
 * @param label - Texto do label
 * @param error - Mensagem de erro (se houver)
 * @param required - Se o campo é obrigatório
 * @param containerStyle - Estilos adicionais do container
 * @param ...props - Outras props do TextInput
 * 
 * @example
 * <CustomInput
 *   label="Nome"
 *   value={name}
 *   onChangeText={setName}
 *   error={errors.name}
 *   required
 * />
 */
export default function CustomInput({
  label,
  error,
  required = false,
  containerStyle,
  ...props
}: CustomInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          props.multiline && styles.textArea,
        ]}
        placeholderTextColor="#999"
        {...props}
      />
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    backgroundColor: '#ffffff',
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
    textAlignVertical: 'top',
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
});
