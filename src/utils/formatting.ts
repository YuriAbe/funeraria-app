/**
 * Utilitários de Formatação
 * 
 * Funções auxiliares para formatação de dados
 */

/**
 * Formata preço para exibição (R$ 1.234,56)
 * @param price - Preço em string ou número
 * @returns String formatada
 */
export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return 'R$ 0,00';
  
  return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
};

/**
 * Formata telefone brasileiro ((XX) XXXXX-XXXX)
 * @param phone - Telefone com apenas números
 * @returns String formatada
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

/**
 * Aplica máscara de telefone enquanto digita
 * @param value - Valor atual
 * @returns String com máscara aplicada
 */
export const applyPhoneMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length <= 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  }
  
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

/**
 * Formata data (DD/MM/AAAA)
 * @param dateStr - Data com apenas números (DDMMAAAA)
 * @returns String formatada
 */
export const formatDate = (dateStr: string): string => {
  const cleaned = dateStr.replace(/\D/g, '');
  
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
  }
  
  return dateStr;
};

/**
 * Aplica máscara de data enquanto digita
 * @param value - Valor atual
 * @returns String com máscara aplicada
 */
export const applyDateMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  if (cleaned.length <= 8) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
  }
  
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
};

/**
 * Formata CPF (XXX.XXX.XXX-XX)
 * @param cpf - CPF com apenas números
 * @returns String formatada
 */
export const formatCPF = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }
  
  return cpf;
};

/**
 * Aplica máscara de CPF enquanto digita
 * @param value - Valor atual
 * @returns String com máscara aplicada
 */
export const applyCPFMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  }
  if (cleaned.length <= 11) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
  }
  
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
};

/**
 * Aplica máscara de preço enquanto digita
 * @param value - Valor atual
 * @returns String formatada
 */
export const applyPriceMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const formatted = (parseInt(cleaned || '0') / 100).toFixed(2);
  return formatted;
};

/**
 * Remove todos os caracteres não numéricos
 * @param value - Valor a ser limpo
 * @returns String apenas com números
 */
export const cleanNumericString = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Formata data ISO para exibição amigável
 * @param isoDate - Data no formato ISO
 * @returns String formatada (DD/MM/AAAA HH:mm)
 */
export const formatISODate = (isoDate: string): string => {
  const date = new Date(isoDate);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Capitaliza primeira letra de cada palavra
 * @param str - String a ser capitalizada
 * @returns String capitalizada
 */
export const capitalize = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Trunca texto longo
 * @param text - Texto a ser truncado
 * @param maxLength - Tamanho máximo
 * @returns Texto truncado com "..."
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
