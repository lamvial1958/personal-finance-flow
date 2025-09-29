/**
 * useLanguage.js - Hook para Sistema Multilínguas
 * 
 * Hook personalizado que centraliza o acesso ao sistema de tradução:
 * - Função t() para traduções
 * - Estado do idioma atual
 * - Funções para alterar idioma
 * - Sistema híbrido de tradução de categorias
 * - Informações do idioma atual
 * - Lista de idiomas disponíveis
 * 
 * Uso: const { t, language, changeLanguage } = useLanguage();
 * 
 * Localização: C:\Personal_Finance_Flow\src\hooks\useLanguage.js
 * Versão: 1.6.0 - Sistema Multilínguas
 */

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../context/LanguageContext';
import { translateCategory as translateCategoryHelper } from '../i18n';

// Hook principal para usar o sistema multilínguas
export const useLanguage = () => {
  // Context do idioma
  const context = useContext(LanguageContext);
  
  // Verificar se está dentro do provider
  if (context === undefined) {
    throw new Error('useLanguage deve ser usado dentro de LanguageProvider');
  }
  
  // Hook do react-i18next para função t()
  const { t, i18n, ready } = useTranslation();
  
  // Extrair valores do context
  const {
    language,
    isLoading,
    languageInfo,
    availableLanguages,
    isPortuguese,
    isEnglish,
    isItalian,
    isSpanish,
    isFrench,
    isGerman,
    changeLanguage,
    isLanguage,
    supportedLanguages,
    isI18nReady
  } = context;

  // Função para traduzir categorias (sistema híbrido)
  const translateCategory = (categoryName, type = 'expense') => {
    if (!categoryName) return '';
    
    try {
      return translateCategoryHelper(categoryName, type);
    } catch (error) {
      console.warn('Erro na tradução de categoria:', error);
      return categoryName;
    }
  };

  // Função t() com fallback seguro
  const safeT = (key, options = {}) => {
    try {
      if (!ready || !isI18nReady) {
        // Fallback para chave se ainda não estiver pronto
        return key;
      }
      
      const translated = t(key, options);
      
      // Se tradução é igual à chave, pode ser que não existe
      if (translated === key && process.env.NODE_ENV === 'development') {
        console.warn(`Chave de tradução não encontrada: ${key}`);
      }
      
      return translated;
    } catch (error) {
      console.error('Erro na tradução:', error);
      return key; // Fallback para a chave original
    }
  };

  // Função para obter texto formatado com interpolação
  const formatText = (key, values = {}) => {
    try {
      return safeT(key, values);
    } catch (error) {
      console.error('Erro ao formatar texto:', error);
      return key;
    }
  };

  // Função para verificar se tradução existe
  const hasTranslation = (key) => {
    try {
      if (!ready || !isI18nReady) return false;
      
      const translated = t(key);
      return translated !== key;
    } catch (error) {
      return false;
    }
  };

  // Função para obter tradução com fallback customizado
  const getTranslation = (key, fallback = '') => {
    try {
      if (!ready || !isI18nReady) return fallback;
      
      const translated = t(key);
      return translated !== key ? translated : fallback;
    } catch (error) {
      return fallback;
    }
  };

  // Função para obter lista de idiomas formatada para select
  const getLanguageOptions = () => {
    return availableLanguages.map(lang => ({
      value: lang.code,
      label: `${lang.flag} ${lang.nativeName}`,
      name: lang.name,
      nativeName: lang.nativeName,
      flag: lang.flag,
      isCurrent: lang.isCurrent
    }));
  };

  // Função para detectar direção do texto (RTL/LTR)
  const getTextDirection = () => {
    // Todos os idiomas suportados são LTR
    return 'ltr';
  };

  // Função para formatar números conforme idioma
  const formatNumber = (number, options = {}) => {
    try {
      return new Intl.NumberFormat(language, options).format(number);
    } catch (error) {
      console.error('Erro ao formatar número:', error);
      return number.toString();
    }
  };

  // Função para formatar moeda conforme idioma
  const formatCurrency = (amount, currency = 'BRL') => {
    try {
      return new Intl.NumberFormat(language, {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch (error) {
      console.error('Erro ao formatar moeda:', error);
      return `${currency} ${amount}`;
    }
  };

  // Função para formatar datas conforme idioma
  const formatDate = (date, options = {}) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat(language, options).format(dateObj);
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return date.toString();
    }
  };

  // Retornar interface do hook
  return {
    // Função principal de tradução
    t: safeT,
    
    // Funções auxiliares de tradução
    formatText,
    hasTranslation,
    getTranslation,
    translateCategory,
    
    // Estado do idioma
    language,
    languageInfo,
    isLoading,
    isReady: ready && isI18nReady,
    
    // Verificações de idioma
    isPortuguese,
    isEnglish,
    isItalian,
    isSpanish,
    isFrench,
    isGerman,
    isLanguage,
    
    // Funções de controle
    changeLanguage,
    
    // Listas e opções
    availableLanguages,
    languageOptions: getLanguageOptions(),
    supportedLanguages,
    
    // Formatação localizada
    formatNumber,
    formatCurrency,
    formatDate,
    getTextDirection,
    
    // Informações técnicas
    currentLanguageCode: language,
    i18nInstance: i18n,
    
    // Debug (apenas desenvolvimento)
    ...(process.env.NODE_ENV === 'development' && {
      debug: {
        isReady: ready,
        isI18nReady,
        currentLanguage: language,
        loadedLanguages: i18n.languages
      }
    })
  };
};

// Hook simplificado apenas para função t()
export const useTranslate = () => {
  const { t } = useLanguage();
  return t;
};

// Hook para informações do idioma atual
export const useCurrentLanguage = () => {
  const { language, languageInfo } = useLanguage();
  return { language, languageInfo };
};

// Hook para alterar idioma
export const useLanguageChange = () => {
  const { changeLanguage, availableLanguages } = useLanguage();
  return { changeLanguage, availableLanguages };
};

export default useLanguage;