import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  style?: object;
  fullWidth?: boolean;
}

/**
 * Botão customizado reutilizável
 * 
 * @param title - Texto do botão
 * @param onPress - Função executada ao clicar
 * @param variant - Estilo do botão (primary, secondary, danger, success)
 * @param disabled - Se o botão está desabilitado
 * @param style - Estilos adicionais
 * @param fullWidth - Se o botão deve ocupar toda a largura
 * 
 * @example
 * <CustomButton 
 *   title="Salvar" 
 *   onPress={handleSave}
 *   variant="primary"
 * />
 */
export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  fullWidth = false,
}: CustomButtonProps) {
  
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'danger':
        return styles.dangerButton;
      case 'success':
        return styles.successButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButtonText;
      default:
        return styles.buttonText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, getTextStyle()]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  fullWidth: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#3a4774',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3a4774',
  },
  dangerButton: {
    backgroundColor: '#e74c3c',
  },
  successButton: {
    backgroundColor: '#27ae60',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#3a4774',
  },
});
