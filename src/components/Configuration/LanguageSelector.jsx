/**
 * LanguageSelector.jsx - Componente para seleção de idioma
 * 
 * Funcionalidades:
 * - Dropdown com 6 idiomas disponíveis
 * - Bandeiras e nomes nativos
 * - Integração com useLanguage hook
 * - Suporte completo a modo escuro/claro
 * - Interface similar ao ThemeToggle
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Configuration\LanguageSelector.jsx
 * Versão: 1.6.0 - Sistema Multilínguas
 */

import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';

const LanguageSelector = () => {
  const { 
    language, 
    languageInfo, 
    availableLanguages, 
    changeLanguage,
    t,
    isReady  // CORRIGIDO: era isI18nReady
  } = useLanguage();
  
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  // Handler para mudança de idioma
  const handleLanguageChange = async (languageCode) => {
    if (languageCode === language || isChanging) return;
    
    setIsChanging(true);
    try {
      const success = await changeLanguage(languageCode);
      if (success) {
        console.log('🌍 Idioma alterado com sucesso para:', languageCode);
        setIsOpen(false);
      } else {
        console.error('❌ Erro ao alterar idioma para:', languageCode);
      }
    } catch (error) {
      console.error('❌ Erro na mudança de idioma:', error);
    } finally {
      setIsChanging(false);
    }
  };

  // Função para detectar idioma automaticamente
  const handleAutoDetect = async () => {
    const browserLang = navigator.language.split('-')[0];
    const supportedLang = availableLanguages.find(lang => lang.code === browserLang);
    
    if (supportedLang && supportedLang.code !== language) {
      await handleLanguageChange(supportedLang.code);
    } else {
      console.log('🌍 Idioma do browser já está sendo usado ou não é suportado');
    }
  };

  // CORRIGIDO: if (!isReady) ao invés de if (!isI18nReady)
  if (!isReady) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Título e Descrição */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {t('configuration.language.title')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t('configuration.language.description')}
        </p>
      </div>

      {/* Seletor Principal */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isChanging}
          className={`w-full flex items-center justify-between px-4 py-3 text-left border rounded-lg transition-colors ${
            isDark
              ? 'bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600'
              : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
          } ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex items-center space-x-3">
            <span className="text-xl">{languageInfo.flag}</span>
            <div>
              <div className="font-medium">{languageInfo.nativeName}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('configuration.language.current')}: {languageInfo.name}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isChanging && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
            <svg 
              className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </button>

        {/* Dropdown de Idiomas */}
        {isOpen && (
          <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-50 ${
            isDark 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-white border-gray-300'
          }`}>
            <div className="py-1">
              {/* Opção de Detecção Automática */}
              <button
                onClick={handleAutoDetect}
                disabled={isChanging}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  isDark
                    ? 'text-gray-300 hover:bg-gray-600'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🌍</span>
                  <span className="italic">{t('configuration.language.detectAutomatic')}</span>
                </div>
              </button>
              
              <hr className={`my-1 ${isDark ? 'border-gray-600' : 'border-gray-200'}`} />
              
              {/* Lista de Idiomas */}
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  disabled={isChanging}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    lang.code === language
                      ? isDark
                        ? 'bg-blue-800 text-blue-200'
                        : 'bg-blue-100 text-blue-800'
                      : isDark
                        ? 'text-gray-200 hover:bg-gray-600'
                        : 'text-gray-700 hover:bg-gray-100'
                  } ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{lang.flag}</span>
                      <div>
                        <div className="font-medium">{lang.nativeName}</div>
                        <div className={`text-xs ${
                          lang.code === language
                            ? 'text-blue-600 dark:text-blue-300'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {lang.name}
                        </div>
                      </div>
                    </div>
                    {lang.code === language && (
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Informações Adicionais */}
      <div className={`p-3 rounded-lg ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      } border`}>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              {t('configuration.language.current')}:
            </span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {languageInfo.flag} {languageInfo.nativeName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Código:
            </span>
            <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
              {language.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Idiomas disponíveis:
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {availableLanguages.length}
            </span>
          </div>
        </div>
      </div>

      {/* Debug Info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <details className={`text-xs p-2 rounded ${
          isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
        }`}>
          <summary className="cursor-pointer">Debug Info</summary>
          <pre className="mt-2 overflow-auto">
            {JSON.stringify({
              currentLanguage: language,
              browserLanguage: navigator.language,
              i18nReady: isReady,
              availableCount: availableLanguages.length
            }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default LanguageSelector;