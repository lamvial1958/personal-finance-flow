/**
 * ThemeToggle.jsx - Componente para alternar entre modo claro/escuro
 * 
 * Funcionalidades:
 * - Toggle visual estilizado
 * - Ícones sol/lua animados
 * - Feedback visual suave
 * - Integração com ThemeContext
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Configuration\ThemeToggle.jsx
 * Versão: 1.3.0 - Modo Escuro
 */

import React from 'react';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <div className="space-y-4">
      {/* Cabeçalho da seção */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Aparência
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Escolha entre modo claro ou escuro para melhor experiência visual
        </p>
      </div>

      {/* Toggle principal */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          {/* Ícone do tema atual */}
          <div className="p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            {isDark ? (
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </div>

          {/* Informações do tema */}
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {isDark ? 'Modo Escuro' : 'Modo Claro'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isDark 
                ? 'Interface escura para reduzir cansaço visual' 
                : 'Interface clara e limpa para uso diurno'
              }
            </p>
          </div>
        </div>

        {/* Toggle switch */}
        <button
          onClick={toggleTheme}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
            isDark 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
          role="switch"
          aria-checked={isDark}
          aria-label={`Alternar para ${isDark ? 'modo claro' : 'modo escuro'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isDark ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Opções adicionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Modo Claro */}
        <button
          onClick={() => !isDark && null}
          disabled={!isDark}
          className={`p-4 rounded-lg border-2 transition-all ${
            !isDark
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-gray-100">Claro</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Interface tradicional</p>
            </div>
            {!isDark && (
              <div className="ml-auto">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </button>

        {/* Modo Escuro */}
        <button
          onClick={() => isDark && null}
          disabled={isDark}
          className={`p-4 rounded-lg border-2 transition-all ${
            isDark
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-gray-100">Escuro</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Reduz cansaço visual</p>
            </div>
            {isDark && (
              <div className="ml-auto">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Informações adicionais */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Sobre o tema
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Sua preferência é salva automaticamente e aplicada em todas as sessões. 
              O modo escuro pode ajudar a reduzir o cansaço visual durante uso prolongado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;