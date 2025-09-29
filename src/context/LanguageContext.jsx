/**
 * LanguageContext.jsx - Context para gerenciamento de idioma
 * 
 * Funcionalidades:
 * - Estado global do idioma (pt/en/it/es/fr/de)
 * - Persistência no localStorage
 * - Integração automática com i18next
 * - Detecção automática do browser
 * - Context Provider
 * 
 * Hook associado: src/hooks/useLanguage.js
 * Baseado no padrão: src/context/ThemeContext.jsx
 * 
 * Localização: C:\Personal_Finance_Flow\src\context\LanguageContext.jsx
 * Versão: 1.6.0 - Sistema Multilínguas
 */

import React, { createContext, useEffect, useState } from 'react';
import i18n, { 
  SUPPORTED_LANGUAGES, 
  changeLanguage, 
  detectBrowserLanguage,
  isLanguageSupported 
} from '../i18n';

// Criar context - exportado para uso no hook
export const LanguageContext = createContext(undefined);

// Provider do idioma
export const LanguageProvider = ({ children }) => {
  // Estado do idioma - default português
  const [language, setLanguage] = useState('pt');
  const [isLoading, setIsLoading] = useState(true);
  
  // NOVO: Estado local para controlar inicialização do i18n
  const [isI18nReady, setIsI18nReady] = useState(false);

  // Carregar idioma do localStorage na inicialização
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('vm-finance-language');
      const browserLanguage = detectBrowserLanguage();
      
      // Usar idioma salvo, ou preferência do browser, ou português como padrão
      const initialLanguage = savedLanguage || browserLanguage;
      
      // Validar se o idioma é suportado
      if (isLanguageSupported(initialLanguage)) {
        setLanguage(initialLanguage);
        applyLanguage(initialLanguage);
      } else {
        setLanguage('pt');
        applyLanguage('pt');
      }
      
      console.log('🌍 Idioma carregado:', initialLanguage);
    } catch (error) {
      console.error('❌ Erro ao carregar idioma:', error);
      setLanguage('pt');
      applyLanguage('pt');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // NOVO: Escutar evento de inicialização do i18n
  useEffect(() => {
    const handleInitialized = () => {
      setIsI18nReady(true);
      console.log('✅ i18n inicializado - LanguageContext atualizado');
    };

    // Se já estiver inicializado, setar imediatamente
    if (i18n.isInitialized) {
      setIsI18nReady(true);
      console.log('✅ i18n já estava inicializado');
    } else {
      // Caso contrário, escutar evento
      i18n.on('initialized', handleInitialized);
      console.log('👂 Aguardando inicialização do i18n...');
    }

    // Cleanup: remover listener quando componente desmontar
    return () => {
      i18n.off('initialized', handleInitialized);
    };
  }, []);

  // Aplicar idioma ao i18next
  const applyLanguage = async (newLanguage) => {
    try {
      // Alterar idioma no i18next
      await changeLanguage(newLanguage);
      
      // Aplicar atributo lang no documento HTML
      document.documentElement.lang = newLanguage;
      
      console.log('✅ Idioma aplicado:', newLanguage);
    } catch (error) {
      console.error('❌ Erro ao aplicar idioma:', error);
    }
  };

  // Alterar idioma
  const changeCurrentLanguage = async (newLanguage) => {
    if (!isLanguageSupported(newLanguage)) {
      console.error('❌ Idioma não suportado:', newLanguage);
      return false;
    }
    
    try {
      setLanguage(newLanguage);
      localStorage.setItem('vm-finance-language', newLanguage);
      await applyLanguage(newLanguage);
      
      console.log('✅ Idioma alterado para:', newLanguage);
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar idioma:', error);
      return false;
    }
  };

  // Detectar mudanças na preferência do browser
  useEffect(() => {
    const handleLanguageChange = () => {
      // Só aplicar preferência do browser se não houver idioma salvo
      const savedLanguage = localStorage.getItem('vm-finance-language');
      if (!savedLanguage) {
        const browserLanguage = detectBrowserLanguage();
        if (browserLanguage !== language) {
          setLanguage(browserLanguage);
          applyLanguage(browserLanguage);
          console.log('🌍 Idioma automático do browser:', browserLanguage);
        }
      }
    };

    // Escutar mudanças no navegador (menos comum, mas possível)
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, [language]);

  // Escutar mudanças do i18next
  useEffect(() => {
    const handleI18nChange = (lng) => {
      if (lng !== language) {
        setLanguage(lng);
      }
    };

    i18n.on('languageChanged', handleI18nChange);
    return () => i18n.off('languageChanged', handleI18nChange);
  }, [language]);

  // Obter informações do idioma atual
  const getCurrentLanguageInfo = () => {
    return SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES.pt;
  };

  // Obter lista de idiomas disponíveis
  const getAvailableLanguages = () => {
    return Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => ({
      code,
      ...info,
      isCurrent: code === language
    }));
  };

  // Verificar se é idioma específico
  const isLanguage = (langCode) => {
    return language === langCode;
  };

  // Valores do context
  const value = {
    // Estado atual
    language,
    isLoading,
    
    // Informações do idioma
    languageInfo: getCurrentLanguageInfo(),
    availableLanguages: getAvailableLanguages(),
    
    // Verificações rápidas
    isPortuguese: language === 'pt',
    isEnglish: language === 'en',
    isItalian: language === 'it',
    isSpanish: language === 'es',
    isFrench: language === 'fr',
    isGerman: language === 'de',
    
    // Funções
    changeLanguage: changeCurrentLanguage,
    isLanguage,
    
    // Helpers para tradução
    t: i18n.t, // Função de tradução direta
    
    // Informações técnicas
    supportedLanguages: SUPPORTED_LANGUAGES,
    
    // CORRIGIDO: Usar estado local ao invés de i18n.isInitialized
    isI18nReady: isI18nReady
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};