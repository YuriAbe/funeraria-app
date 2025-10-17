import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  rightComponent?: React.ReactNode;
}

/**
 * Header customizado reutilizável
 * 
 * @param title - Título principal
 * @param subtitle - Subtítulo (opcional)
 * @param backgroundColor - Cor de fundo do header
 * @param rightComponent - Componente à direita (ex: botão)
 * 
 * @example
 * <CustomHeader
 *   title="Catálogo de Caixões"
 *   subtitle="Gerencie seus produtos"
 *   rightComponent={<Button title="Novo" />}
 * />
 */
export default function CustomHeader({
  title,
  subtitle,
  backgroundColor = '#ffffff',
  rightComponent,
}: HeaderProps) {
  return (
    <View style={[styles.header, { backgroundColor }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {rightComponent && (
          <View style={styles.headerRight}>
            {rightComponent}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  headerRight: {
    marginLeft: 12,
  },
});
