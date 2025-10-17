import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: object;
  onPress?: () => void;
  borderColor?: string;
}

/**
 * Card container reutilizável
 * 
 * @param children - Conteúdo do card
 * @param style - Estilos adicionais
 * @param onPress - Função executada ao clicar (torna o card clicável)
 * @param borderColor - Cor da borda esquerda
 * 
 * @example
 * <Card borderColor="#3a4774">
 *   <Text>Conteúdo do card</Text>
 * </Card>
 */
export default function Card({
  children,
  style,
  onPress,
  borderColor,
}: CardProps) {
  
  const cardStyle = [
    styles.card,
    borderColor && { borderLeftColor: borderColor, borderLeftWidth: 4 },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  style?: object;
}

/**
 * Header do Card
 */
export function CardHeader({ children, style }: CardHeaderProps) {
  return (
    <View style={[styles.cardHeader, style]}>
      {children}
    </View>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  style?: object;
}

/**
 * Conteúdo do Card
 */
export function CardContent({ children, style }: CardContentProps) {
  return (
    <View style={[styles.cardContent, style]}>
      {children}
    </View>
  );
}

interface CardActionsProps {
  children: React.ReactNode;
  style?: object;
}

/**
 * Ações do Card (botões)
 */
export function CardActions({ children, style }: CardActionsProps) {
  return (
    <View style={[styles.cardActions, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
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
    marginBottom: 12,
  },
  cardContent: {
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 10,
  },
});
