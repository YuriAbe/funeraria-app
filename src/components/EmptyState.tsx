import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface EmptyStateProps {
  icon?: 'logo' | 'empty';
  title: string;
  message: string;
  iconSource?: any;
}

/**
 * Componente de estado vazio reutilizável
 * 
 * @param icon - Tipo de ícone ('logo' ou 'empty')
 * @param title - Título do estado vazio
 * @param message - Mensagem explicativa
 * @param iconSource - Fonte customizada para o ícone (opcional)
 * 
 * @example
 * <EmptyState
 *   icon="logo"
 *   title="Nenhum caixão cadastrado"
 *   message="Clique em 'Novo Caixão' para adicionar"
 * />
 */
export default function EmptyState({
  icon = 'logo',
  title,
  message,
  iconSource,
}: EmptyStateProps) {
  
  const getIconSource = () => {
    if (iconSource) return iconSource;
    if (icon === 'logo') return require('../../assets/logosemfundo.png');
    return require('../../assets/logosemfundo.png'); // default
  };

  return (
    <View style={styles.container}>
      <Image 
        source={getIconSource()} 
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    width: 80,
    height: 60,
    marginBottom: 16,
    opacity: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
});
