/**
 * i18n/index.js - Configuração Sistema Multilínguas
 * 
 * Sistema completo de internacionalização com:
 * - 6 idiomas suportados (PT, EN, IT, ES, FR, DE)
 * - Detecção automática do idioma do browser
 * - Fallback para português
 * - Sistema híbrido de tradução de categorias
 * - Persistência localStorage
 * 
 * Localização: C:\Personal_Finance_Flow\src\i18n\index.js
 * Versão: 1.6.0 - Sistema Multilínguas
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar recursos de tradução
import ptTranslations from './resources/pt.json';
import enTranslations from './resources/en.json';
import itTranslations from './resources/it.json';
import esTranslations from './resources/es.json';
import frTranslations from './resources/fr.json';
import deTranslations from './resources/de.json';

// Mapeamento de idiomas suportados
export const SUPPORTED_LANGUAGES = {
  pt: {
    name: 'Português',
    nativeName: 'Português',
    flag: '🇧🇷',
    code: 'pt'
  },
  en: {
    name: 'English',
    nativeName: 'English (UK)',
    flag: '🇬🇧',
    code: 'en'
  },
  it: {
    name: 'Italiano',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    code: 'it'
  },
  es: {
    name: 'Español',
    nativeName: 'Español',
    flag: '🇪🇸',
    code: 'es'
  },
  fr: {
    name: 'Français',
    nativeName: 'Français',
    flag: '🇫🇷',
    code: 'fr'
  },
  de: {
    name: 'Deutsch',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    code: 'de'
  }
};

// Recursos de tradução organizados
const resources = {
  pt: { translation: ptTranslations },
  en: { translation: enTranslations },
  it: { translation: itTranslations },
  es: { translation: esTranslations },
  fr: { translation: frTranslations },
  de: { translation: deTranslations }
};

// Configuração do detector de idioma
const detectionOptions = {
  // Ordem de detecção: localStorage → navigator → fallback
  order: ['localStorage', 'navigator', 'htmlTag'],
  
  // Chaves do localStorage
  lookupLocalStorage: 'vm-finance-language',
  
  // Cache da detecção
  caches: ['localStorage'],
  
  // Não detectar do subdomain/path
  excludeCacheFor: ['cimode'],
  
  // Fallback se não detectar
  fallbackLng: 'pt',
  
  // Log de debugging (apenas em desenvolvimento)
  debug: process.env.NODE_ENV === 'development'
};

// Inicializar i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Recursos de tradução
    resources,
    
    // Idioma padrão/fallback
    fallbackLng: 'pt',
    
    // Debugging apenas em desenvolvimento
    debug: process.env.NODE_ENV === 'development',
    
    // Configuração de detecção
    detection: detectionOptions,
    
    // Interpolação
    interpolation: {
      escapeValue: false, // React já escapa por padrão
      format: function(value, format, lng) {
        // Formatação customizada se necessário
        if (format === 'number') {
          return new Intl.NumberFormat(lng).format(value);
        }
        return value;
      }
    },
    
    // Configurações de namespace
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Configurações de carregamento
    load: 'languageOnly', // Carregar apenas 'pt' ao invés de 'pt-BR'
    
    // Configurações de comportamento
    returnEmptyString: false,
    returnNull: false,
    
    // Configuração de plurais
    pluralSeparator: '_',
    contextSeparator: '_',
    
    // Configurações React
    react: {
      useSuspense: false // Evitar suspense para compatibilidade
    }
  });

// Log de inicialização
if (process.env.NODE_ENV === 'development') {
  console.log('🌍 i18n Sistema Multilínguas inicializado');
  console.log('🔍 Idioma detectado:', i18n.language);
  console.log('🎯 Idiomas suportados:', Object.keys(SUPPORTED_LANGUAGES));
}

// Função helper para traduzir categoria (sistema híbrido)
export const translateCategory = (categoryName, type = 'expense') => {
  if (!categoryName || !i18n.isInitialized) return categoryName;
  
  try {
    // Mapeamento de categorias do DB (português) para chaves i18n (inglês)
    const categoryKeyMap = {
      // Receitas (income)
      'salário': 'salary',
      'freelance': 'freelance',
      'investimentos': 'investments',
      'vendas': 'sales',
      'prêmio': 'bonus',
      'prêmios': 'bonus',
      'outros': 'other',
      
      // Despesas (expenses)
      'alimentação': 'food',
      'transporte': 'transport',
      'moradia': 'housing',
      'saúde': 'health',
      'educação': 'education',
      'lazer': 'entertainment',
      'compras': 'shopping',
      'contas': 'utilities',
      'utilidades': 'utilities',
      'seguros': 'insurance',
      'impostos': 'taxes'
    };
    
    // Normalizar nome da categoria
    const normalizedCategory = categoryName.toLowerCase().trim();
    
    // Obter chave em inglês
    const englishKey = categoryKeyMap[normalizedCategory] || normalizedCategory;
    
    // Tentar traduzir usando a chave em inglês
    const mappingKey = `categoryMapping.${type}.${englishKey}`;
    const translated = i18n.t(mappingKey);
    
    // Se encontrou tradução diferente da chave, usar ela
    if (translated !== mappingKey) {
      return translated;
    }
    
    // Caso contrário, manter original (categorias personalizadas)
    return categoryName;
  } catch (error) {
    console.warn('Erro na tradução de categoria:', error);
    return categoryName;
  }
};

// Função helper para obter idioma atual
export const getCurrentLanguage = () => {
  return i18n.language || 'pt';
};

// Função helper para mudar idioma
export const changeLanguage = async (languageCode) => {
  try {
    if (!SUPPORTED_LANGUAGES[languageCode]) {
      console.warn(`Idioma não suportado: ${languageCode}`);
      return false;
    }
    
    await i18n.changeLanguage(languageCode);
    
    // Log de mudança
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌍 Idioma alterado para: ${languageCode}`);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao alterar idioma:', error);
    return false;
  }
};

// Função helper para detectar idioma do browser
export const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0]; // 'pt-BR' → 'pt'
  
  // Retornar apenas se for suportado
  return SUPPORTED_LANGUAGES[langCode] ? langCode : 'pt';
};

// Função helper para validar se idioma é suportado
export const isLanguageSupported = (languageCode) => {
  return !!SUPPORTED_LANGUAGES[languageCode];
};

// Função helper para obter lista de idiomas
export const getAvailableLanguages = () => {
  return Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => ({
    code,
    ...info
  }));
};

// Função helper para obter informações do idioma atual
export const getCurrentLanguageInfo = () => {
  const currentLang = getCurrentLanguage();
  return SUPPORTED_LANGUAGES[currentLang] || SUPPORTED_LANGUAGES.pt;
};

// Event listener para mudanças de idioma
i18n.on('languageChanged', (lng) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🌍 [i18n] Idioma alterado para: ${lng}`);
  }
  
  // Emitir evento customizado para componentes
  window.dispatchEvent(new CustomEvent('languageChanged', { 
    detail: { language: lng } 
  }));
});

// Verificar se inicialização foi bem-sucedida
i18n.on('initialized', (options) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🌍 [i18n] Sistema multilínguas inicializado com sucesso');
    console.log('📊 [i18n] Idiomas carregados:', Object.keys(options.resources));
  }
});

// Tratar erros de carregamento
i18n.on('failedLoading', (lng, ns, msg) => {
  console.error(`❌ [i18n] Erro ao carregar idioma ${lng}:`, msg);
});

export default i18n;