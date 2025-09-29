/**
 * DateFormatSelector.jsx - Componente para seleção de formato de data
 * 
 * Funcionalidades:
 * - Dropdown com formatos de data populares
 * - Preview em tempo real
 * - Persistência no localStorage
 * - Suporte completo a modo escuro/claro
 * - Formatos regionais comuns
 * - Sistema multilínguas integrado
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Configuration\DateFormatSelector.jsx
 * Versão: 1.6.0 - Sistema Multilínguas
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';

// Configurações de formatos de data disponíveis
const AVAILABLE_DATE_FORMATS = {
  'dd-mm-yyyy': {
    id: 'dd-mm-yyyy',
    label: 'DD/MM/YYYY',
    pattern: 'DD/MM/YYYY',
    separator: '/',
    order: ['DD', 'MM', 'YYYY'],
    regions: 'dateFormat.regions.ddmmyyyy',
    flag: '🇧🇷'
  },
  'mm-dd-yyyy': {
    id: 'mm-dd-yyyy',
    label: 'MM/DD/YYYY',
    pattern: 'MM/DD/YYYY',
    separator: '/',
    order: ['MM', 'DD', 'YYYY'],
    regions: 'dateFormat.regions.mmddyyyy',
    flag: '🇺🇸'
  },
  'dd-dot-mm-yyyy': {
    id: 'dd-dot-mm-yyyy',
    label: 'DD.MM.YYYY',
    pattern: 'DD.MM.YYYY',
    separator: '.',
    order: ['DD', 'MM', 'YYYY'],
    regions: 'dateFormat.regions.dddotmm',
    flag: '🇩🇪'
  },
  'yyyy-mm-dd': {
    id: 'yyyy-mm-dd',
    label: 'YYYY-MM-DD',
    pattern: 'YYYY-MM-DD',
    separator: '-',
    order: ['YYYY', 'MM', 'DD'],
    regions: 'dateFormat.regions.iso',
    flag: '🌍'
  },
  'dd-hyphen-mm-yyyy': {
    id: 'dd-hyphen-mm-yyyy',
    label: 'DD-MM-YYYY',
    pattern: 'DD-MM-YYYY',
    separator: '-',
    order: ['DD', 'MM', 'YYYY'],
    regions: 'dateFormat.regions.ddhyphen',
    flag: '🇪🇺'
  },
  'dd-mm-yy': {
    id: 'dd-mm-yy',
    label: 'DD/MM/YY',
    pattern: 'DD/MM/YY',
    separator: '/',
    order: ['DD', 'MM', 'YY'],
    regions: 'dateFormat.regions.shorteu',
    flag: '📅'
  },
  'mm-dd-yy': {
    id: 'mm-dd-yy',
    label: 'MM/DD/YY',
    pattern: 'MM/DD/YY',
    separator: '/',
    order: ['MM', 'DD', 'YY'],
    regions: 'dateFormat.regions.shortus',
    flag: '📅'
  }
};

const DateFormatSelector = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  
  const [dateFormat, setDateFormat] = useState('dd-mm-yyyy');
  const [isOpen, setIsOpen] = useState(false);

  // Carregar configuração do localStorage
  useEffect(() => {
    try {
      const savedFormat = localStorage.getItem('vm-finance-date-format') || 'dd-mm-yyyy';
      
      if (AVAILABLE_DATE_FORMATS[savedFormat]) {
        setDateFormat(savedFormat);
      }
      
      console.log('📅 Formato de data carregado:', savedFormat);
    } catch (error) {
      console.error('Erro ao carregar formato de data:', error);
    }
  }, []);

  // Salvar configuração
  const saveDateFormat = (newFormat) => {
    try {
      localStorage.setItem('vm-finance-date-format', newFormat);
      console.log('📅 Formato de data salvo:', newFormat);
    } catch (error) {
      console.error('Erro ao salvar formato de data:', error);
    }
  };

  // Handler para mudança de formato
  const handleFormatChange = (formatId) => {
    if (formatId === dateFormat) return;
    
    setDateFormat(formatId);
    saveDateFormat(formatId);
    setIsOpen(false);
  };

  // Função para formatar data de exemplo
  const formatExampleDate = (formatConfig) => {
    const exampleDate = new Date(2025, 11, 25);
    const day = exampleDate.getDate().toString().padStart(2, '0');
    const month = (exampleDate.getMonth() + 1).toString().padStart(2, '0');
    const year = exampleDate.getFullYear().toString();
    const yearShort = year.slice(-2);

    let result = formatConfig.pattern;
    result = result.replace('DD', day);
    result = result.replace('MM', month);
    result = result.replace('YYYY', year);
    result = result.replace('YY', yearShort);

    return result;
  };

  // Obter configuração atual
  const currentFormat = AVAILABLE_DATE_FORMATS[dateFormat];

  return (
    <div className="space-y-4">
      {/* Título e Descrição */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {t('configuration.dateFormat.title')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t('configuration.dateFormat.description')}
        </p>
      </div>

      {/* Seletor Principal */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('configuration.dateFormat.format')}
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
              <span className="text-xl">{currentFormat.flag}</span>
              <div>
                <div className="font-medium">{currentFormat.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('configuration.dateFormat.example')}: {formatExampleDate(currentFormat)}
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

          {/* Dropdown de Formatos */}
          {isOpen && (
            <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto ${
              isDark 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-white border-gray-300'
            }`}>
              <div className="py-1">
                {Object.entries(AVAILABLE_DATE_FORMATS).map(([id, config]) => (
                  <button
                    key={id}
                    onClick={() => handleFormatChange(id)}
                    className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                      id === dateFormat
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
                          <div className="font-medium">{config.label}</div>
                          <div className={`text-xs ${
                            id === dateFormat
                              ? 'text-blue-600 dark:text-blue-300'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {formatExampleDate(config)} • {t('configuration.' + config.regions)}
                          </div>
                        </div>
                      </div>
                      {id === dateFormat && (
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
            <span className="text-gray-600 dark:text-gray-400">{t('configuration.dateFormat.currentFormat')}:</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {currentFormat.flag} {currentFormat.label}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('configuration.dateFormat.pattern')}:</span>
            <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
              {currentFormat.pattern}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('configuration.dateFormat.separator')}:</span>
            <span className="text-gray-900 dark:text-gray-100 font-mono">
              "{currentFormat.separator}"
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('configuration.dateFormat.regionsLabel')}:</span>
            <span className="text-gray-900 dark:text-gray-100 text-xs">
              {t('configuration.' + currentFormat.regions)}
            </span>
          </div>
        </div>

        {/* Exemplos com datas diferentes */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">{t('configuration.dateFormat.examples')}:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">{t('configuration.dateFormat.today')}:</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  {formatExampleDate(currentFormat)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">{t('configuration.dateFormat.newYear')}:</span>
                <span className="font-mono text-green-600 dark:text-green-400">
                  {(() => {
                    const newYear = new Date(2026, 0, 1);
                    const day = newYear.getDate().toString().padStart(2, '0');
                    const month = (newYear.getMonth() + 1).toString().padStart(2, '0');
                    const year = newYear.getFullYear().toString();
                    const yearShort = year.slice(-2);

                    let result = currentFormat.pattern;
                    result = result.replace('DD', day);
                    result = result.replace('MM', month);
                    result = result.replace('YYYY', year);
                    result = result.replace('YY', yearShort);
                    return result;
                  })()}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">{t('configuration.dateFormat.birthday')}:</span>
                <span className="font-mono text-purple-600 dark:text-purple-400">
                  {(() => {
                    const birth = new Date(1990, 4, 15);
                    const day = birth.getDate().toString().padStart(2, '0');
                    const month = (birth.getMonth() + 1).toString().padStart(2, '0');
                    const year = birth.getFullYear().toString();
                    const yearShort = year.slice(-2);

                    let result = currentFormat.pattern;
                    result = result.replace('DD', day);
                    result = result.replace('MM', month);
                    result = result.replace('YYYY', year);
                    result = result.replace('YY', yearShort);
                    return result;
                  })()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">{t('configuration.dateFormat.contract')}:</span>
                <span className="font-mono text-orange-600 dark:text-orange-400">
                  {(() => {
                    const contract = new Date(2024, 2, 30);
                    const day = contract.getDate().toString().padStart(2, '0');
                    const month = (contract.getMonth() + 1).toString().padStart(2, '0');
                    const year = contract.getFullYear().toString();
                    const yearShort = year.slice(-2);

                    let result = currentFormat.pattern;
                    result = result.replace('DD', day);
                    result = result.replace('MM', month);
                    result = result.replace('YYYY', year);
                    result = result.replace('YY', yearShort);
                    return result;
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informação sobre Formatação */}
      <div className={`p-3 rounded-lg text-xs ${
        isDark ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'
      }`}>
        <div className="flex items-start space-x-2">
          <span>💡</span>
          <div>
            <strong>{t('configuration.dateFormat.tip')}:</strong> {t('configuration.dateFormat.tipDescription')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateFormatSelector;