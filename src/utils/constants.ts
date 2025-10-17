/**
 * Constantes do Projeto
 * 
 * Definições de cores, tamanhos e outras constantes reutilizáveis
 */

/**
 * Paleta de cores do aplicativo
 */
export const COLORS = {
  // Cores principais
  primary: '#3a4774',
  secondary: '#2c3e50',
  
  // Cores de feedback
  success: '#27ae60',
  danger: '#e74c3c',
  warning: '#DAA520',
  info: '#3498db',
  
  // Cores neutras
  background: '#f8f9fa',
  white: '#ffffff',
  black: '#000000',
  
  // Cores de texto
  text: '#2c3e50',
  textSecondary: '#7f8c8d',
  textLight: '#6c757d',
  
  // Cores de borda
  border: '#e9ecef',
  borderDark: '#dee2e6',
  
  // Cores de serviços
  caixao: '#654321',
  contrato: '#8B4513',
  terreno: '#228B22',
  jazigo: '#696969',
  decoracao: '#FF69B4',
  lapide: '#A9A9A9',
  servicos: '#DAA520',
  transporte: '#2F4F4F',
  documentacao: '#4682B4',
} as const;

/**
 * Tamanhos de fonte padronizados
 */
export const FONT_SIZES = {
  tiny: 10,
  small: 12,
  regular: 14,
  medium: 16,
  large: 18,
  xlarge: 20,
  xxlarge: 24,
  huge: 28,
  giant: 32,
} as const;

/**
 * Espaçamentos padronizados
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  huge: 32,
} as const;

/**
 * Raios de borda padronizados
 */
export const BORDER_RADIUS = {
  small: 5,
  medium: 10,
  large: 15,
  xlarge: 20,
  round: 50,
} as const;

/**
 * Configurações de sombra
 */
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;

/**
 * Ícones de serviços (emojis)
 */
export const SERVICE_ICONS = {
  caixao: '📦',
  contrato: '⚰️',
  terreno: '🏞️',
  jazigo: '🏛️',
  decoracao: '🌸',
  lapide: '🗿',
  servicos: '🕯️',
  transporte: '🚗',
  documentacao: '📋',
} as const;

/**
 * Mensagens de erro padrão
 */
export const ERROR_MESSAGES = {
  required: 'Este campo é obrigatório',
  invalidEmail: 'Email inválido',
  invalidPassword: 'Senha deve ter pelo menos 6 caracteres',
  invalidPhone: 'Telefone inválido',
  invalidDate: 'Data inválida',
  invalidCPF: 'CPF inválido',
  invalidPrice: 'Preço inválido',
  minValue: (min: number) => `Valor mínimo: ${min}`,
  maxValue: (max: number) => `Valor máximo: ${max}`,
  minLength: (min: number) => `Mínimo de ${min} caracteres`,
  maxLength: (max: number) => `Máximo de ${max} caracteres`,
} as const;

/**
 * Mensagens de sucesso padrão
 */
export const SUCCESS_MESSAGES = {
  created: 'Cadastrado com sucesso!',
  updated: 'Atualizado com sucesso!',
  deleted: 'Deletado com sucesso!',
  saved: 'Salvo com sucesso!',
} as const;

/**
 * Chaves AsyncStorage
 */
export const STORAGE_KEYS = {
  caixoes: 'caixoes',
  contratos: 'contratos',
  terrenos: 'terrenos',
  jazigos: 'jazigos',
  decoracoes: 'decoracoes',
  lapides: 'lapides',
  profile: (userId: string) => `profile_${userId}`,
  user: 'user',
} as const;

/**
 * Limites de caracteres
 */
export const CHAR_LIMITS = {
  name: 50,
  title: 60,
  description: 200,
  shortText: 100,
  longText: 500,
} as const;

/**
 * Configurações de animação
 */
export const ANIMATION = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;
