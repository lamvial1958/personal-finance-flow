/**
 * CurrencySelector.jsx - Componente para seleção de moeda
 * 
 * Funcionalidades:
 * - Dropdown com moedas principais mundiais
 * - Símbolos e códigos de moeda
 * - Formatos de exibição personalizáveis
 * - Persistência no localStorage
 * - Suporte completo a modo escuro/claro
 * - Sistema multilínguas integrado
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Configuration\CurrencySelector.jsx
 * Versão: 1.6.0 - Sistema Multilínguas
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';

// Configurações de moedas disponíveis
const AVAILABLE_CURRENCIES = {
  USD: {
    code: 'USD',
    nameKey: 'currency.currencies.usd',
    symbol: '$',
    flag: '🇺🇸',
    formats: [
      { id: 'before-dot', label: '$100.00', pattern: '{symbol}{amount}' },
      { id: 'after-dot', label: '100.00$', pattern: '{amount}{symbol}' }
    ]
  },
  EUR: {
    code: 'EUR',
    nameKey: 'currency.currencies.eur',
    symbol: '€',
    flag: '🇪🇺',
    formats: [
      { id: 'before-comma', label: '€100,00', pattern: '{symbol}{amount}' },
      { id: 'after-comma', label: '100,00€', pattern: '{amount}{symbol}' }
    ]
  },
  GBP: {
    code: 'GBP',
    nameKey: 'currency.currencies.gbp',
    symbol: '£',
    flag: '🇬🇧',
    formats: [
      { id: 'before-dot', label: '£100.00', pattern: '{symbol}{amount}' },
      { id: 'after-dot', label: '100.00£', pattern: '{amount}{symbol}' }
    ]
  },
  BRL: {
    code: 'BRL',
    nameKey: 'currency.currencies.brl',
    symbol: 'R$',
    flag: '🇧🇷',
    formats: [
      { id: 'before-comma', label: 'R$100,00', pattern: '{symbol}{amount}' },
      { id: 'after-comma', label: '100,00R$', pattern: '{amount}{symbol}' }
    ]
  },
  CAD: {
    code: 'CAD',
    nameKey: 'currency.currencies.cad',
    symbol: 'C$',
    flag: '🇨🇦',
    formats: [
      { id: 'before-dot', label: 'C$100.00', pattern: '{symbol}{amount}' },
      { id: 'after-dot', label: '100.00C$', pattern: '{amount}{symbol}' }
    ]
  },
  AUD: {
    code: 'AUD',
    nameKey: 'currency.currencies.aud',
    symbol: 'A$',
    flag: '🇦🇺',
    formats: [
      { id: 'before-dot', label: 'A$100.00', pattern: '{symbol}{amount}' },
      { id: 'after-dot', label: '100.00A$', pattern: '{amount}{symbol}' }
    ]
  },
  JPY: {
    code: 'JPY',
    nameKey: 'currency.currencies.jpy',
    symbol: '¥',
    flag: '🇯🇵',
    formats: [
      { id: 'before', label: '¥100', pattern: '{symbol}{amount}' },
      { id: 'after', label: '100¥', pattern: '{amount}{symbol}' }
    ]
  },
  CHF: {
    code: 'CHF',
    nameKey: 'currency.currencies.chf',
    symbol: 'CHF',
    flag: '🇨🇭',
    formats: [
      { id: 'before-dot', label: 'CHF100.00', pattern: '{symbol}{amount}' },
      { id: 'after-dot', label: '100.00CHF', pattern: '{amount}{symbol}' }
    ]
  }
};

const CurrencySelector = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  
  const [currency, setCurrency] = useState('USD');
  const [format, setFormat] = useState('before-dot');
  const [isOpen, setIsOpen] = useState(false);
  const [showFormats, setShowFormats] = useState(false);

  // Carregar configurações do localStorage
  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem('vm-finance-currency') || 'USD';
      const savedFormat = localStorage.getItem('vm-finance-currency-format') || 'before-dot';
      
      if (AVAILABLE_CURRENCIES[savedCurrency]) {
        setCurrency(savedCurrency);
      }
      setFormat(savedFormat);
      
      console.log('💰 Configuração de moeda carregada:', { currency: savedCurrency, format: savedFormat });
    } catch (error) {
      console.error('Erro ao carregar configuração de moeda:', error);
    }
  }, []);

  // Salvar configurações
  const saveCurrencySettings = (newCurrency, newFormat) => {
    try {
      localStorage.setItem('vm-finance-currency', newCurrency);
      localStorage.setItem('vm-finance-currency-format', newFormat);
      console.log('💰 Configuração de moeda salva:', { currency: newCurrency, format: newFormat });
    } catch (error) {
      console.error('Erro ao salvar configuração de moeda:', error);
    }
  };

  // Handler para mudança de moeda
  const handleCurrencyChange = (currencyCode) => {
    if (currencyCode === currency) return;
    
    setCurrency(currencyCode);
    const newFormat = AVAILABLE_CURRENCIES[currencyCode].formats[0].id;
    setFormat(newFormat);
    saveCurrencySettings(currencyCode, newFormat);
    setIsOpen(false);
    setShowFormats(false);
  };

  // Handler para mudança de formato
  const handleFormatChange = (formatId) => {
    setFormat(formatId);
    saveCurrencySettings(currency, formatId);
    setShowFormats(false);
  };

  // Obter configuração atual
  const currentCurrency = AVAILABLE_CURRENCIES[currency];
  const currentFormat = currentCurrency?.formats.find(f => f.id === format) || currentCurrency?.formats[0];

  // Função para formatar valor de exemplo
  const formatExample = (amount, currencyConfig, formatConfig) => {
    return formatConfig.pattern
      .replace('{symbol}', currencyConfig.symbol)
      .replace('{amount}', amount.toString());
  };

  return (
    <div className="space-y-4">
      {/* Título e Descrição */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {t('configuration.currency.title')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t('configuration.currency.description')}
        </p>
      </div>

      {/* Seletor de Moeda */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('configuration.currency.currency')}
        </label>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 text-left border rounded-lg transition-colors ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600'
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{currentCurrency.flag}</span>
              <div>
                <div className="font-medium">{t(currentCurrency.nameKey)}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {currentCurrency.code} • {currentCurrency.symbol}
                </div>
              </div>
            </div>
            <svg 
              className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          {/* Dropdown de Moedas */}
          {isOpen && (
            <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto ${
              isDark 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-white border-gray-300'
            }`}>
              <div className="py-1">
                {Object.entries(AVAILABLE_CURRENCIES).map(([code, config]) => (
                  <button
                    key={code}
                    onClick={() => handleCurrencyChange(code)}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      code === currency
                        ? isDark
                          ? 'bg-blue-800 text-blue-200'
                          : 'bg-blue-100 text-blue-800'
                        : isDark
                          ? 'text-gray-200 hover:bg-gray-600'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{config.flag}</span>
                        <div>
                          <div className="font-medium">{t(config.nameKey)}</div>
                          <div className={`text-xs ${
                            code === currency
                              ? 'text-blue-600 dark:text-blue-300'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {config.code} • {config.symbol}
                          </div>
                        </div>
                      </div>
                      {code === currency && (
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
      </div>

      {/* Seletor de Formato */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('configuration.currency.displayFormat')}
        </label>
        <div className="relative">
          <button
            onClick={() => setShowFormats(!showFormats)}
            className={`w-full flex items-center justify-between px-4 py-3 text-left border rounded-lg transition-colors ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600'
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">🎨</span>
              <div>
                <div className="font-medium">{currentFormat?.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('configuration.currency.example')}: {formatExample(1250.75, currentCurrency, currentFormat)}
                </div>
              </div>
            </div>
            <svg 
              className={`w-5 h-5 transition-transform ${showFormats ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          {/* Dropdown de Formatos */}
          {showFormats && (
            <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-50 ${
              isDark 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-white border-gray-300'
            }`}>
              <div className="py-1">
                {currentCurrency.formats.map((formatConfig) => (
                  <button
                    key={formatConfig.id}
                    onClick={() => handleFormatChange(formatConfig.id)}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      formatConfig.id === format
                        ? isDark
                          ? 'bg-blue-800 text-blue-200'
                          : 'bg-blue-100 text-blue-800'
                        : isDark
                          ? 'text-gray-200 hover:bg-gray-600'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{formatConfig.label}</div>
                        <div className={`text-xs ${
                          formatConfig.id === format
                            ? 'text-blue-600 dark:text-blue-300'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatExample(1250.75, currentCurrency, formatConfig)}
                        </div>
                      </div>
                      {formatConfig.id === format && (
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
      </div>

      {/* Preview da Configuração */}
      <div className={`p-4 rounded-lg ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      } border`}>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('configuration.currency.currentCurrency')}:</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {currentCurrency.flag} {t(currentCurrency.nameKey)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('configuration.currency.code')}:</span>
            <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
              {currentCurrency.code}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('configuration.currency.format')}:</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {currentFormat?.label}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('configuration.currency.example')}:</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatExample(1250.75, currentCurrency, currentFormat)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector;