/**
 * AuthenticationForm.jsx - Componente de Autenticação com Tema
 * Estados LOCAIS + Suporte a Modo Escuro
 * 
 * FUNCIONALIDADE v1.3.0:
 * - Classes Tailwind dark mode aplicadas
 * - Transições suaves entre temas
 * - Estados 100% locais mantidos
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Auth\AuthenticationForm.jsx
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme'; // ✅ CORRIGIDO: Import do hook correto
import dbManager from '../../db-manager.js';

const AuthenticationForm = () => {
  const { isDark } = useTheme();
  
  // Estados locais - SEM CONTEXT API PARA EVITAR LOOPS
  const [isSystemSetup, setIsSystemSetup] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados de formulário 100% locais - NUNCA PERDEM FOCO
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Inicialização simples - SEM HOOKS COMPLEXOS
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔐 Inicializando sistema de autenticação...');
        await dbManager.initialize();
        
        const setupCheck = await dbManager.checkSetup();
        setIsSystemSetup(setupCheck.isSetup);
        console.log('✅ Sistema setup:', setupCheck.isSetup);
        
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Erro ao inicializar auth:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Handlers simples - SEM DEPENDENCIES COMPLEXAS
  const handleSetup = async () => {
    if (password !== confirmPassword) {
      alert('Senhas não coincidem');
      return;
    }
    
    if (password.length < 6) {
      alert('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      await dbManager.setupAuth(password);
      alert('Sistema configurado com sucesso!');
      setIsSystemSetup(true);
      setAuthMode('login');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      alert('Erro ao configurar: ' + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await dbManager.login(password);
      sessionStorage.setItem('finance-app-authenticated', 'true');
      window.location.reload();
    } catch (error) {
      alert('Erro no login: ' + error.message);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Novas senhas não coincidem');
      return;
    }

    try {
      await dbManager.changePassword(currentPassword, newPassword);
      alert('Senha alterada com sucesso!');
      setAuthMode('login');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      alert('Erro ao alterar senha: ' + error.message);
    }
  };

  // Loading com tema
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">V&M Personal Finance PWA</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Inicializando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
      <div className="max-w-md w-full space-y-6">
        {/* Header com tema */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 transition-colors">
            <img 
              src="/icon-192.png" 
              alt="Logo" 
              className="h-12 w-12 object-contain" 
            />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100 transition-colors">
            V&M Personal Finance
          </h2>
          <p className="mt-2 text-sm text-blue-600 dark:text-blue-400 transition-colors">
            Progressive Web App {isDark ? '• Modo Escuro' : '• Modo Claro'}
          </p>
        </div>

        {/* Configuração Inicial */}
        {authMode === 'setup' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Configurar Sistema</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configure uma senha para proteger seus dados financeiros. 
              Esta senha será necessária para acessar o sistema.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  console.log('🔑 Digitando senha setup:', e.target.value.length, 'chars');
                  setPassword(e.target.value);
                }}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirmar Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  console.log('🔑 Confirmando senha:', e.target.value.length, 'chars');
                  setConfirmPassword(e.target.value);
                }}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                placeholder="Digite a senha novamente"
                autoComplete="new-password"
              />
            </div>

            <button
              onClick={handleSetup}
              className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Configurar Sistema
            </button>
          </div>
        )}

        {/* Login */}
        {authMode === 'login' && isSystemSetup && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Entrar</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  console.log('🔑 Digitando senha login:', e.target.value.length, 'chars');
                  setPassword(e.target.value);
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                autoFocus
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Entrar
            </button>

            <div className="text-center">
              <button
                onClick={() => setAuthMode('change-password')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Alterar senha
              </button>
            </div>
          </div>
        )}

        {/* Alterar Senha */}
        {authMode === 'change-password' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Alterar Senha</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Senha Atual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                placeholder="Sua senha atual"
                autoComplete="current-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nova Senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                placeholder="Nova senha (mínimo 6 caracteres)"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirmar Nova Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                placeholder="Confirme a nova senha"
                autoComplete="new-password"
              />
            </div>

            <button
              onClick={handleChangePassword}
              className="w-full bg-green-600 dark:bg-green-700 text-white py-3 px-4 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Alterar Senha
            </button>

            <button
              onClick={() => setAuthMode('login')}
              className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-2 transition-colors"
            >
              Voltar ao login
            </button>
          </div>
        )}

        {/* Sistema não configurado */}
        {!isSystemSetup && authMode === 'login' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4 text-center transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sistema Não Configurado</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Este é o primeiro acesso. Configure uma senha para proteger seus dados.
            </p>
            <button
              onClick={() => setAuthMode('setup')}
              className="w-full bg-green-600 dark:bg-green-700 text-white py-3 px-4 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Configurar Sistema
            </button>
          </div>
        )}

        {/* Info PWA com tema */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-colors">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200">Progressive Web App</h4>
          <div className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
            <p>• Funciona offline após carregamento inicial</p>
            <p>• Dados salvos localmente em seu dispositivo</p>
            <p>• Instale tocando "Adicionar à tela inicial"</p>
            <p>• Funciona em computador, tablet e celular</p>
            <p>• Suporte a {isDark ? 'modo escuro' : 'modo claro'} automático</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationForm;