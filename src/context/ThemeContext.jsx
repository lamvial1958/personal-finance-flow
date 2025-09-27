/**
 * ThemeContext.jsx - Context para gerenciamento de tema claro/escuro
 * 
 * Funcionalidades:
 * - Estado global do tema (light/dark)
 * - Persistência no localStorage
 * - Aplicação automática de classes CSS
 * - Context Provider
 * 
 * Hook associado: src/hooks/useTheme.js
 * 
 * Localização: C:\Personal_Finance_Flow\src\context\ThemeContext.jsx
 * Versão: 1.3.0 - Modo Escuro
 */

import React, { createContext, useEffect, useState } from 'react';

// Criar context - exportado para uso no hook
export const ThemeContext = createContext(undefined);

// Provider do tema
export const ThemeProvider = ({ children }) => {
  // Estado do tema - default light
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  // Carregar tema do localStorage na inicialização
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('vm-finance-theme');
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      
      // Usar tema salvo, ou preferência do sistema, ou light como padrão
      const initialTheme = savedTheme || systemPreference;
      
      setTheme(initialTheme);
      applyTheme(initialTheme);
      
      console.log('🎨 Tema carregado:', initialTheme);
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
      setTheme('light');
      applyTheme('light');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Aplicar tema ao DOM
  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Aplicar meta theme-color dinâmico
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#1f2937' : '#2563eb');
    }
  };

  // Alternar tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    try {
      setTheme(newTheme);
      localStorage.setItem('vm-finance-theme', newTheme);
      applyTheme(newTheme);
      
      console.log('🎨 Tema alterado para:', newTheme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  // Definir tema específico
  const setThemeMode = (mode) => {
    if (mode !== 'light' && mode !== 'dark') {
      console.error('Tema inválido:', mode);
      return;
    }
    
    try {
      setTheme(mode);
      localStorage.setItem('vm-finance-theme', mode);
      applyTheme(mode);
      
      console.log('🎨 Tema definido para:', mode);
    } catch (error) {
      console.error('Erro ao definir tema:', error);
    }
  };

  // Detectar mudanças na preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Só aplicar preferência do sistema se não houver tema salvo
      const savedTheme = localStorage.getItem('vm-finance-theme');
      if (!savedTheme) {
        const systemTheme = e.matches ? 'dark' : 'light';
        setTheme(systemTheme);
        applyTheme(systemTheme);
        console.log('🎨 Tema automático do sistema:', systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Valores do context
  const value = {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isLoading,
    toggleTheme,
    setTheme: setThemeMode,
    
    // Helpers para componentes (deprecated - usar useThemeClasses)
    bg: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    text: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    input: theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};