/**
 * App.jsx - Personal Finance Flow (Com Suporte a Tema + Gráficos + Edição + Atualização Automática)
 * Loops de re-render ELIMINADOS + Modo Escuro/Claro + Análise Gráfica + Edição de Transações + Atualização Automática Desktop
 * 
 * NOVA FUNCIONALIDADE v1.5.1:
 * - Sistema de atualização automática agressiva
 * - Debugging completo de atualizações PWA
 * - Verificação periódica em background
 * - Logs detalhados para troubleshooting
 * 
 * Localização: C:\Personal_Finance_Flow\src\App.jsx
 * Versão: 1.5.1 - Sistema de Atualização Automática Integrado
 */

import React, { useState, useEffect } from 'react';

// Context Providers
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './hooks/useTheme';

// NOVO: Hook de atualização automática
import { useAutoUpdate } from './hooks/useAutoUpdate';

// Componente de autenticação ISOLADO
import AuthenticationForm from './components/Auth/AuthenticationForm';

// Componentes principais (APENAS para app autenticado)
import Dashboard from './components/Dashboard/Dashboard';
import PatrimonyView from './components/Patrimony/PatrimonyView';
import AnnualReportView from './components/Reports/AnnualReportView';
import ConfigurationView from './components/Configuration/ConfigurationView';
import ChartsView from './components/Charts/ChartsView';

// Componentes de modais
import DeleteModal from './components/Modals/DeleteModal';
import EditModal from './components/Modals/EditModal';
import OFXImportModal from './components/Modals/OFXImportModal';
import DonationModal from './components/Modals/DonationModal';
import RatingModal from './components/Modals/RatingModal';

// COMPONENTE DE VERIFICAÇÃO SIMPLES (SEM LOOPS)
const AuthChecker = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Verificando autenticação...');
    
    // VERIFICAÇÃO SIMPLES - SEM HOOKS COMPLEXOS
    const checkAuth = () => {
      const hasSession = sessionStorage.getItem('finance-app-authenticated') === 'true';
      console.log('✅ Status sessão:', hasSession);
      
      setIsAuthenticated(hasSession);
      setIsLoading(false);
    };

    checkAuth();
  }, []); // Dependências vazias - executa apenas uma vez

  // LOADING SIMPLES
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">V&M Personal Finance PWA</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  // RETORNA COMPONENTE ISOLADO OU FILHOS
  if (!isAuthenticated) {
    return <AuthenticationForm />; // Estados 100% locais
  }

  return children; // App autenticado com Context
};

// APP AUTENTICADO (APENAS COM CONTEXT QUANDO NECESSÁRIO)
const AuthenticatedApp = () => {
  const { theme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // NOVO: Sistema de atualização automática
  const {
    updateStatus,
    lastCheck,
    manualUpdateCheck,
    isProduction,
    supportsServiceWorker
  } = useAutoUpdate();

  // NOVO: Log de status de atualização para debugging
  useEffect(() => {
    if (updateStatus && updateStatus !== 'checking') {
      console.log(`[PWA-STATUS] Estado: ${updateStatus} | Produção: ${isProduction} | SW Support: ${supportsServiceWorker}`);
      
      if (lastCheck) {
        console.log(`[PWA-STATUS] Última verificação: ${lastCheck.toLocaleString('pt-BR')}`);
      }
    }
  }, [updateStatus, lastCheck, isProduction, supportsServiceWorker]);

  // CABEÇALHO DA APLICAÇÃO (Com suporte a tema)
  const AppHeader = () => (
    <header className="bg-white dark:bg-gray-800 shadow-lg transition-colors border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg transition-colors">
              <img 
                src="/icon-192.png" 
                alt="V&M Finance Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
                V&M Personal Finance
              </h1>
              <p className="text-sm text-blue-600 dark:text-blue-400 transition-colors">
                Progressive Web App + OFX + {isDark ? 'Modo Escuro' : 'Modo Claro'}
                {/* NOVO: Indicador de status de atualização em desenvolvimento */}
                {!isProduction && updateStatus && (
                  <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                    DEV: {updateStatus}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* NOVO: Botão de verificação manual (apenas em desenvolvimento para debugging) */}
            {!isProduction && __PWA_DEBUG__ && (
              <button
                onClick={manualUpdateCheck}
                className="p-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Verificar Atualização (Debug)"
              >
                🔄
              </button>
            )}
            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Configurações"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  // NAVEGAÇÃO POR ABAS (Com suporte a tema + Nova aba Análise)
  const TabNavigation = () => (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setIsConfigOpen(false);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'dashboard' && !isConfigOpen
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Painel
          </button>
          <button
            onClick={() => {
              setActiveTab('charts');
              setIsConfigOpen(false);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'charts' && !isConfigOpen
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Análise
          </button>
          <button
            onClick={() => {
              setActiveTab('patrimony');
              setIsConfigOpen(false);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'patrimony' && !isConfigOpen
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Patrimônio
          </button>
          <button
            onClick={() => {
              setActiveTab('annual-report');
              setIsConfigOpen(false);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'annual-report' && !isConfigOpen
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Relatório Anual
          </button>
        </div>
      </div>
    </nav>
  );

  // CONTEÚDO PRINCIPAL (Com ChartsView integrado)
  const MainContent = () => {
    if (isConfigOpen) {
      return <ConfigurationView onClose={() => setIsConfigOpen(false)} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'charts':
        return <ChartsView />;
      case 'patrimony':
        return <PatrimonyView />;
      case 'annual-report':
        return <AnnualReportView />;
      default:
        return <Dashboard />;
    }
  };

  // LAYOUT PRINCIPAL AUTENTICADO (Com suporte a tema)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Cabeçalho */}
      <AppHeader />

      {/* Navegação */}
      <TabNavigation />

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MainContent />
      </main>

      {/* Modais */}
      <DonationModal />
      <RatingModal />
      <DeleteModal />
      <EditModal />
      <OFXImportModal />

      {/* NOVO: Status de atualização no footer (apenas desenvolvimento) */}
      {!isProduction && __PWA_DEBUG__ && (
        <div className="fixed bottom-4 right-4 bg-black dark:bg-white bg-opacity-80 dark:bg-opacity-80 text-white dark:text-black text-xs px-3 py-2 rounded shadow-lg">
          <div>PWA: {updateStatus}</div>
          {lastCheck && (
            <div>Última verificação: {lastCheck.toLocaleTimeString('pt-BR')}</div>
          )}
          <div>SW: {supportsServiceWorker ? 'OK' : 'N/A'}</div>
        </div>
      )}
    </div>
  );
};

// COMPONENTE RAIZ (ARQUITETURA COM TEMA + GRÁFICOS + EDIÇÃO + ATUALIZAÇÃO)
export default function App() {
  // NOVO: Log de inicialização da aplicação
  useEffect(() => {
    console.log(`[APP-INIT] V&M Personal Finance v${__APP_VERSION__} iniciado`);
    console.log(`[APP-INIT] Build: ${__BUILD_DATE__}`);
    console.log(`[APP-INIT] Ambiente: ${window.location.hostname}`);
  }, []);

  return (
    <ThemeProvider>
      <AuthChecker>
        {/* AppProvider apenas para app autenticado (EVITA LOOPS) */}
        <AppProvider>
          <AuthenticatedApp />
        </AppProvider>
      </AuthChecker>
    </ThemeProvider>
  );
}