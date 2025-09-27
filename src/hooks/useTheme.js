/**
 * useTheme.js - Hook customizado para gerenciamento de tema
 * 
 * Funcionalidades:
 * - Acesso ao contexto de tema
 * - Helpers para classes CSS condicionais
 * - Validação de contexto
 * - Integração com ThemeContext
 * 
 * Localização: C:\Personal_Finance_Flow\src\hooks\useTheme.js
 * Versão: 1.3.0 - Modo Escuro
 */

import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Hook customizado para usar o tema
 * Deve ser usado dentro de um ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  
  return context;
};

/**
 * Hook com helpers CSS para componentes
 * Retorna classes condicionais baseadas no tema atual
 */
export const useThemeClasses = () => {
  const { isDark } = useTheme();
  
  return {
    // Backgrounds
    bg: isDark ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDark ? 'bg-gray-800' : 'bg-white',
    modalBg: isDark ? 'bg-gray-800' : 'bg-white',
    headerBg: isDark ? 'bg-gray-800' : 'bg-white',
    
    // Text colors
    text: isDark ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
    
    // Borders
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    borderLight: isDark ? 'border-gray-600' : 'border-gray-300',
    
    // Input styles
    input: isDark 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
      
    // Button styles
    primaryButton: isDark
      ? 'bg-blue-700 hover:bg-blue-600 focus:ring-blue-400'
      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      
    secondaryButton: isDark
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600'
      : 'bg-gray-200 hover:bg-gray-300 text-gray-700 border-gray-300',
      
    // Status colors (mantém consistência entre temas)
    success: isDark ? 'text-green-400' : 'text-green-600',
    error: isDark ? 'text-red-400' : 'text-red-600',
    warning: isDark ? 'text-yellow-400' : 'text-yellow-600',
    info: isDark ? 'text-blue-400' : 'text-blue-600',
    
    // Hover states
    hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    cardHover: isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50',
    
    // Focus states
    focusRing: isDark 
      ? 'focus:ring-blue-400 focus:ring-offset-gray-800' 
      : 'focus:ring-blue-500 focus:ring-offset-white'
  };
};

/**
 * Hook para detectar preferência do sistema
 */
export const useSystemTheme = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

export default useTheme;