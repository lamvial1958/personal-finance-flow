/**
 * useAuth Hook - Personal Finance Flow
 * Gerencia toda a lógica de autenticação e inicialização do sistema
 * 
 * Localização: C:\Personal_Finance_Flow\src\hooks\useAuth.js
 * Versão: 2.1.0 - Corrigido loops de re-render
 * Criado: Setembro 2025
 */

import { useEffect, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';
import dbManager from '../db-manager.js';

export const useAuth = () => {
  const {
    // Estados de autenticação
    isAuthenticated, setIsAuthenticated,
    isSystemSetup, setIsSystemSetup,
    authMode, setAuthMode,
    isLoading, setIsLoading,
    connectionStatus, setConnectionStatus,
    
    // Função de carregar dados
    loadAllData
  } = useApp();

  // Ref para evitar loops de useEffect
  const hasLoadedData = useRef(false);

  // Inicializar aplicação
  const initializeApp = useCallback(async () => {
    try {
      setConnectionStatus('Inicializando banco de dados...');
      await dbManager.initialize();
      
      const hasSession = sessionStorage.getItem('finance-app-authenticated') === 'true';
      const setupCheck = await dbManager.checkSetup();
      setIsSystemSetup(setupCheck.isSetup);
      
      if (hasSession && setupCheck.isSetup) {
        setIsAuthenticated(true);
        setConnectionStatus('Conectado');
      } else {
        setConnectionStatus('Aguardando autenticação');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao inicializar aplicativo:', error);
      setConnectionStatus('Erro de inicialização');
      setIsLoading(false);
    }
  }, []); // Dependências removidas para evitar loops

  // Configurar senha inicial - recebe parâmetros do formulário local
  const handleSetup = useCallback(async (setupData) => {
    const { password, confirmPassword } = setupData;
    
    if (password !== confirmPassword) {
      alert('Senhas não coincidem');
      return false;
    }
    
    if (password.length < 6) {
      alert('Senha deve ter pelo menos 6 caracteres');
      return false;
    }

    try {
      await dbManager.setupAuth(password);
      alert('Sistema configurado com sucesso!');
      setIsSystemSetup(true);
      setAuthMode('login');
      return true;
    } catch (error) {
      alert('Erro ao configurar: ' + error.message);
      return false;
    }
  }, []); // Dependências removidas

  // Fazer login - recebe parâmetros do formulário local
  const handleLogin = useCallback(async (loginData) => {
    const { password } = loginData;
    
    try {
      await dbManager.login(password);
      sessionStorage.setItem('finance-app-authenticated', 'true');
      setIsAuthenticated(true);
      
      // Carregar dados apenas uma vez, sem useEffect
      if (!hasLoadedData.current) {
        hasLoadedData.current = true;
        await loadAllData();
      }
      
      return true;
    } catch (error) {
      alert('Erro no login: ' + error.message);
      return false;
    }
  }, [loadAllData]); // Apenas loadAllData como dependência

  // Alterar senha - recebe parâmetros do formulário local
  const handleChangePassword = useCallback(async (changePasswordData) => {
    const { currentPassword, newPassword, confirmPassword } = changePasswordData;
    
    if (newPassword !== confirmPassword) {
      alert('Novas senhas não coincidem');
      return false;
    }

    if (newPassword.length < 6) {
      alert('Nova senha deve ter pelo menos 6 caracteres');
      return false;
    }

    try {
      await dbManager.changePassword(currentPassword, newPassword);
      alert('Senha alterada com sucesso!');
      setAuthMode('login');
      return true;
    } catch (error) {
      alert('Erro ao alterar senha: ' + error.message);
      return false;
    }
  }, []); // Dependências removidas

  // Logout
  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('finance-app-authenticated');
    setIsAuthenticated(false);
    setConnectionStatus('Desconectado');
    hasLoadedData.current = false; // Reset para próximo login
  }, []); // Dependências removidas

  // Função para mudança de modo de autenticação - SEM limpeza de campos
  const handleModeChange = useCallback((mode) => {
    setAuthMode(mode);
    // Não limpa campos - isso agora é responsabilidade dos componentes locais
  }, []); // Dependências removidas

  // Validações que recebem parâmetros em vez de usar estados globais
  const isSetupValid = useCallback((setupData) => {
    if (!setupData) return false;
    const { password, confirmPassword } = setupData;
    return password.length >= 6 && password === confirmPassword;
  }, []);

  const isLoginValid = useCallback((loginData) => {
    if (!loginData) return false;
    const { password } = loginData;
    return password.length > 0;
  }, []);

  const isChangePasswordValid = useCallback((changePasswordData) => {
    if (!changePasswordData) return false;
    const { currentPassword, newPassword, confirmPassword } = changePasswordData;
    return currentPassword.length > 0 && 
           newPassword.length >= 6 && 
           newPassword === confirmPassword;
  }, []);

  // Estados computados úteis
  const isReady = !isLoading && isSystemSetup !== null;
  const needsSetup = !isLoading && isSystemSetup === false;
  const isLoggedIn = isAuthenticated && isSystemSetup;
  const showLogin = isSystemSetup && !isAuthenticated && authMode === 'login';
  const showSetup = !isSystemSetup || authMode === 'setup';
  const showChangePassword = authMode === 'change-password';

  // ❌ REMOVIDO: useEffect que causava loops circulares
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     loadAllData();
  //   }
  // }, [isAuthenticated, loadAllData]);

  // Efeito de inicialização - APENAS UMA VEZ
  useEffect(() => {
    initializeApp();
  }, []); // Array vazio = executa apenas uma vez

  return {
    // Estados de autenticação
    isAuthenticated,
    isSystemSetup,
    authMode,
    isLoading,
    connectionStatus,
    
    // Estados computados
    isReady,
    needsSetup,
    isLoggedIn,
    showLogin,
    showSetup,
    showChangePassword,
    
    // Ações que recebem parâmetros
    handleSetup,
    handleLogin,
    handleChangePassword,
    handleLogout,
    handleModeChange,
    
    // Validações que recebem parâmetros
    isSetupValid,
    isLoginValid,
    isChangePasswordValid,
    
    // Utilitários
    initializeApp
  };
};

export default useAuth;