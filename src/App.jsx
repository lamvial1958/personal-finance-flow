import React, { useState, useCallback, useMemo, useEffect } from 'react';
import dbManager from './db-manager.js';

export default function PersonalFinanceFlow() {
  // Estados de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSystemSetup, setIsSystemSetup] = useState(null); // null = checking, true = setup, false = needs setup
  const [authMode, setAuthMode] = useState('login'); // 'login', 'setup', 'change-password'
  
  // Estados da aplicação
  const [dailyTransactions, setDailyTransactions] = useState({});
  const [initialBalances, setInitialBalances] = useState({});
  const [investmentMovements, setInvestmentMovements] = useState({});
  
  // Estados de controle
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('Inicializando...');
  const [dataVersion, setDataVersion] = useState(0);

  // Estados de formulários
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Estados do sistema de doação
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationStage, setDonationStage] = useState(null); // 60 ou 90 dias

  // Inicializar banco de dados
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setConnectionStatus('Inicializando banco de dados...');
        await dbManager.initialize();
        
        // Verificar se há sessão ativa
        const hasSession = sessionStorage.getItem('finance-app-authenticated') === 'true';
        
        // Verificar se sistema foi configurado
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
    };

    initializeApp();
  }, []);

  // Verificar avisos de doação após autenticação
  useEffect(() => {
    if (isAuthenticated) {
      // Aguarda 5 segundos após login para verificar
      const timer = setTimeout(() => {
        checkDonationStatus();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const checkDonationStatus = () => {
    const firstUse = localStorage.getItem('app_first_use');
    const donations = JSON.parse(localStorage.getItem('donation_status') || '{}');
    
    if (!firstUse) {
      localStorage.setItem('app_first_use', new Date().toISOString());
      return;
    }

    const firstUseDate = new Date(firstUse);
    const daysSinceFirstUse = Math.floor((new Date() - firstUseDate) / (1000 * 60 * 60 * 24));
    
    // Para teste rápido, descomente a linha abaixo (usa minutos ao invés de dias):
    // const daysSinceFirstUse = Math.floor((new Date() - firstUseDate) / (1000 * 60));
    
    if (daysSinceFirstUse >= 60 && !donations.day60_dismissed) {
      // Só mostra uma vez por semana após 60 dias
      const lastShown60 = donations.day60_last_shown ? new Date(donations.day60_last_shown) : null;
      if (!lastShown60 || (new Date() - lastShown60) / (1000 * 60 * 60 * 24) >= 7) {
        setDonationStage(60);
        setShowDonationModal(true);
        localStorage.setItem('donation_status', JSON.stringify({
          ...donations,
          day60_last_shown: new Date().toISOString()
        }));
      }
    }
    else if (daysSinceFirstUse >= 90 && !donations.day90_dismissed) {
      const lastShown90 = donations.day90_last_shown ? new Date(donations.day90_last_shown) : null;
      if (!lastShown90 || (new Date() - lastShown90) / (1000 * 60 * 60 * 24) >= 7) {
        setDonationStage(90);
        setShowDonationModal(true);
        localStorage.setItem('donation_status', JSON.stringify({
          ...donations,
          day90_last_shown: new Date().toISOString()
        }));
      }
    }
  };

  const dismissDonationPermanently = () => {
    const donations = JSON.parse(localStorage.getItem('donation_status') || '{}');
    localStorage.setItem('donation_status', JSON.stringify({
      ...donations,
      [`day${donationStage}_dismissed`]: true
    }));
    setShowDonationModal(false);
  };

  const copyPixToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('lamvial@outlook.com');
      alert('PIX copiado para a área de transferência!');
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = 'lamvial@outlook.com';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('PIX copiado para a área de transferência!');
    }
  };

  // Carregar dados quando autenticado
  const loadAllData = useCallback(async () => {
    try {
      setConnectionStatus('Carregando dados...');
      
      // Carregar dados em paralelo
      const [transactions, balances, movements] = await Promise.all([
        dbManager.getTransactions(),
        dbManager.getInitialBalances(), 
        dbManager.getInvestmentMovements()
      ]);

      // Usar React.startTransition para batch updates
      React.startTransition(() => {
        setDailyTransactions(transactions || {});
        setInitialBalances(balances || {});
        setInvestmentMovements(movements || {});
        setDataVersion(prev => prev + 1);
        setConnectionStatus('Conectado');
      });

      console.log('✅ Dados carregados do SQLite WebAssembly');
      
    } catch (error) {
      console.error('⚠️ Erro ao carregar dados:', error);
      setConnectionStatus('Erro ao carregar dados');
      
      React.startTransition(() => {
        setDailyTransactions({});
        setInitialBalances({});
        setInvestmentMovements({});
      });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated, loadAllData]);

  // Configurar senha inicial
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

  // Fazer login
  const handleLogin = async () => {
    try {
      await dbManager.login(password);
      sessionStorage.setItem('finance-app-authenticated', 'true');
      setIsAuthenticated(true);
      setPassword('');
    } catch (error) {
      alert('Erro no login: ' + error.message);
    }
  };

  // Alterar senha
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

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem('finance-app-authenticated');
    setIsAuthenticated(false);
    setDailyTransactions({});
    setInitialBalances({});
    setInvestmentMovements({});
    setDataVersion(0);
    setConnectionStatus('Desconectado');
  };

  // Funções de formatação
  const formatCurrency = useCallback((value) => {
    if (typeof value !== 'number' || isNaN(value)) return '$ 0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }, []);

  const formatDate = useCallback((date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  }, []);

  // Funções principais
  const addTransaction = useCallback(async (type, amount, description, category, date) => {
    try {
      const dateKey = date || new Date().toISOString().split('T')[0];
      
      await dbManager.addTransaction(dateKey, type, parseFloat(amount), description, category);
      const transactions = await dbManager.getTransactions();
      
      React.startTransition(() => {
        setDailyTransactions(transactions || {});
        setDataVersion(prev => prev + 1);
      });
      
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      alert('Erro ao adicionar transação.');
    }
  }, []);

  const updateInitialBalances = useCallback(async (balances) => {
    try {
      await dbManager.updateInitialBalances(balances);

      React.startTransition(() => {
        setInitialBalances(balances);
        setDataVersion(prev => prev + 1);
      });
      
    } catch (error) {
      console.error('Erro ao atualizar saldos:', error);
      alert('Erro ao salvar saldos iniciais.');
    }
  }, []);

  const addInvestmentMovement = useCallback(async (date, investmentType, amount, description) => {
    try {
      await dbManager.addInvestmentMovement(date, investmentType, parseFloat(amount), description);
      const movements = await dbManager.getInvestmentMovements();
      
      React.startTransition(() => {
        setInvestmentMovements(movements || {});
        setDataVersion(prev => prev + 1);
      });
      
    } catch (error) {
      console.error('Erro ao adicionar movimento:', error);
      alert('Erro ao adicionar movimento de investimento.');
    }
  }, []);

  // Cálculos memoizados
  const getDailyTotals = useMemo(() => {
    const totals = {};
    Object.entries(dailyTransactions).forEach(([date, data]) => {
      const income = Object.values(data.income || {}).reduce((sum, t) => sum + (t.amount || 0), 0);
      const expenses = Object.values(data.expenses || {}).reduce((sum, t) => sum + (t.amount || 0), 0);
      totals[date] = { income, expenses, balance: income - expenses };
    });
    return totals;
  }, [dailyTransactions, dataVersion]);

  const monthlyTotals = useMemo(() => {
    const monthly = {};
    Object.entries(getDailyTotals).forEach(([date, totals]) => {
      const monthKey = date.substring(0, 7);
      if (!monthly[monthKey]) {
        monthly[monthKey] = { income: 0, expenses: 0, balance: 0 };
      }
      monthly[monthKey].income += totals.income;
      monthly[monthKey].expenses += totals.expenses;
      monthly[monthKey].balance += totals.balance;
    });
    return monthly;
  }, [getDailyTotals, dataVersion]);

  const getCurrentPatrimony = useMemo(() => {
    const initialTotal = Object.values(initialBalances).reduce((sum, balance) => sum + (balance || 0), 0);
    const movementsTotal = Object.values(investmentMovements).reduce((sum, dayMovements) => {
      return sum + Object.values(dayMovements).reduce((daySum, movement) => daySum + (movement.amount || 0), 0);
    }, 0);
    const liquidBalance = Object.values(getDailyTotals).reduce((sum, day) => sum + day.balance, 0);
    
    return initialTotal + movementsTotal + liquidBalance;
  }, [initialBalances, investmentMovements, getDailyTotals, dataVersion]);

  // Componente Modal de Doação
  const DonationModal = () => {
    if (!showDonationModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">💙</div>
            <h3 className="text-lg font-semibold text-gray-800">
              {donationStage === 60 ? 'Você está usando há 2 meses!' : 'Você está usando há 3 meses!'}
            </h3>
          </div>
          
          <p className="text-gray-600 text-center mb-6">
            Se você está gostando do programa, ajude a mantê-lo e melhorá-lo. 
            A doação de qualquer valor ajuda no desenvolvimento de novas funcionalidades.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">PIX:</p>
                <p className="font-mono text-lg font-semibold text-blue-800">
                  lamvial@outlook.com
                </p>
              </div>
              <button
                onClick={copyPixToClipboard}
                className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
              >
                Copiar
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                copyPixToClipboard();
                setShowDonationModal(false);
              }}
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 font-medium"
            >
              💚 Obrigado, vou considerar!
            </button>
            
            <button
              onClick={() => setShowDonationModal(false)}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
            >
              Lembrar mais tarde
            </button>
            
            <button
              onClick={dismissDonationPermanently}
              className="w-full text-gray-500 py-2 text-sm hover:text-gray-700"
            >
              Não mostrar novamente
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Este app é totalmente gratuito e seus dados ficam no seu dispositivo
          </p>
        </div>
      </div>
    );
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">V&M Personal Finance PWA</h2>
          <p className="text-gray-500 mt-2">{connectionStatus}</p>
        </div>
      </div>
    );
  }

  // Tela de autenticação
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <img src="/icon-192.png" alt="Logo" className="mx-auto h-16 w-16 object-contain" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              V&M Personal Finance
            </h2>
            <p className="mt-2 text-sm text-blue-600">Progressive Web App</p>
          </div>

          {/* Setup inicial */}
          {authMode === 'setup' && (
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Configurar Sistema</h3>
              <p className="text-sm text-gray-600">
                Configure uma senha para proteger seus dados financeiros. 
                Esta senha será necessária para acessar o sistema.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite a senha novamente"
                />
              </div>

              <button
                onClick={handleSetup}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Configurar Sistema
              </button>
            </div>
          )}

          {/* Login */}
          {authMode === 'login' && isSystemSetup && (
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Entrar</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite sua senha"
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Entrar
              </button>

              <div className="text-center">
                <button
                  onClick={() => setAuthMode('change-password')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Alterar senha
                </button>
              </div>
            </div>
          )}

          {/* Alterar senha */}
          {authMode === 'change-password' && (
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Alterar Senha</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Senha Atual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Sua senha atual"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nova senha (mínimo 6 caracteres)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirme a nova senha"
                />
              </div>

              <button
                onClick={handleChangePassword}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Alterar Senha
              </button>

              <button
                onClick={() => setAuthMode('login')}
                className="w-full text-gray-600 hover:text-gray-700"
              >
                Voltar ao login
              </button>
            </div>
          )}

          {/* Sistema precisa ser configurado */}
          {!isSystemSetup && authMode === 'login' && (
            <div className="bg-white rounded-lg shadow p-6 space-y-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">Sistema Não Configurado</h3>
              <p className="text-gray-600">
                Este é o primeiro acesso. Configure uma senha para proteger seus dados.
              </p>
              <button
                onClick={() => setAuthMode('setup')}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Configurar Sistema
              </button>
            </div>
          )}

          {/* Informações sobre PWA */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800">Progressive Web App</h4>
            <div className="text-sm text-blue-700 mt-2 space-y-1">
              <p>• Funciona offline após carregamento inicial</p>
              <p>• Dados salvos localmente em seu dispositivo</p>
              <p>• Instale tocando "Adicionar à tela inicial"</p>
              <p>• Funciona em computador, tablet e celular</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Component
  const Dashboard = () => {
    const [newTransaction, setNewTransaction] = useState({
      type: 'income',
      amount: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async () => {
      if (newTransaction.amount && newTransaction.description) {
        await addTransaction(
          newTransaction.type,
          newTransaction.amount,
          newTransaction.description,
          newTransaction.category,
          newTransaction.date
        );
        setNewTransaction({
          type: 'income',
          amount: '',
          description: '',
          category: '',
          date: new Date().toISOString().split('T')[0]
        });
      }
    };

    const todayTotals = getDailyTotals[newTransaction.date] || { income: 0, expenses: 0, balance: 0 };
    const totalIncome = Object.values(getDailyTotals).reduce((sum, day) => sum + day.income, 0);
    const totalExpenses = Object.values(getDailyTotals).reduce((sum, day) => sum + day.expenses, 0);

    return (
      <div key={`dashboard-${dataVersion}`} className="space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entradas Hoje</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(todayTotals.income)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Saídas Hoje</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(todayTotals.expenses)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Patrimônio Total</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(getCurrentPatrimony)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova Transação</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="income">Entrada</option>
                  <option value="expenses">Saída</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0,00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <input
                  type="text"
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Alimentação, Salário..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <input
                type="text"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descrição da transação"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Adicionar Transação
            </button>
          </div>
        </div>

        {/* Liquidity Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Liquidez Mensal</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de entradas:</span>
              <span className="font-semibold text-green-600">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Saídas totais:</span>
              <span className="font-semibold text-red-600">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium">Saldo Liquidez:</span>
                <span className={`font-bold text-lg ${totalIncome - totalExpenses >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(totalIncome - totalExpenses)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status do Sistema</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Aplicativo:</span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-600 font-medium">Progressive Web App</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Banco de dados:</span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-600 font-medium">{connectionStatus}</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Transações:</span>
              <span className="text-gray-900 font-medium">{Object.keys(dailyTransactions).length} registros</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Investimentos:</span>
              <span className="text-gray-900 font-medium">{Object.keys(investmentMovements).length} movimentos</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Patrimony View Component
  const PatrimonyView = () => {
    const [balances, setBalances] = useState(initialBalances);
    const [newMovement, setNewMovement] = useState({
      investmentType: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });

    const investmentTypes = [
      'Tesouro Direto', 'CDB', 'LCI/LCA', 'Fundos de Investimento',
      'Ações', 'FIIs', 'Criptomoedas', 'Poupança', 'Outros'
    ];

    const handleBalanceChange = (type, value) => {
      setBalances(prev => ({
        ...prev,
        [type]: parseFloat(value) || 0
      }));
    };

    const saveBalances = async () => {
      await updateInitialBalances(balances);
      alert('Saldos iniciais salvos com sucesso!');
    };

    const handleMovementSubmit = async () => {
      if (newMovement.investmentType && newMovement.amount) {
        await addInvestmentMovement(
          newMovement.date,
          newMovement.investmentType,
          newMovement.amount,
          newMovement.description
        );
        setNewMovement({
          investmentType: '',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
      }
    };

    return (
      <div key={`patrimony-${dataVersion}`} className="space-y-6">
        {/* Patrimony Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo do Patrimônio</h2>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{formatCurrency(getCurrentPatrimony)}</p>
            <p className="text-gray-600 mt-2">Patrimônio Total</p>
          </div>
        </div>

        {/* Initial Balances */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Saldos Iniciais por Investimento</h3>
          <div className="space-y-4">
            {investmentTypes.map(type => (
              <div key={type} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">{type}</label>
                <input
                  type="number"
                  step="0.01"
                  value={balances[type] || ''}
                  onChange={(e) => handleBalanceChange(type, e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0,00"
                />
              </div>
            ))}
          </div>
          <button
            onClick={saveBalances}
            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Salvar Saldos Iniciais
          </button>
        </div>

        {/* Add Movement */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Movimentação</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Investimento</label>
                <select
                  value={newMovement.investmentType}
                  onChange={(e) => setNewMovement({...newMovement, investmentType: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  {investmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <input
                  type="date"
                  value={newMovement.date}
                  onChange={(e) => setNewMovement({...newMovement, date: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor (positivo para aplicação, negativo para resgate)</label>
              <input
                type="number"
                step="0.01"
                value={newMovement.amount}
                onChange={(e) => setNewMovement({...newMovement, amount: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <input
                type="text"
                value={newMovement.description}
                onChange={(e) => setNewMovement({...newMovement, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descrição da movimentação"
              />
            </div>

            <button
              onClick={handleMovementSubmit}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Adicionar Movimentação
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Annual Report Component
  const AnnualReportView = () => {
    const [reportData, setReportData] = useState(null);
    const [loadingReport, setLoadingReport] = useState(false);

    const generateReport = async (year) => {
      setLoadingReport(true);
      try {
        const data = await dbManager.getAnnualReport(year);
        setReportData(data);
      } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        alert('Erro ao gerar relatório anual.');
      } finally {
        setLoadingReport(false);
      }
    };

    useEffect(() => {
      generateReport(selectedYear);
    }, [selectedYear]);

    if (loadingReport) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!reportData) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">Carregando relatório...</p>
        </div>
      );
    }

    return (
      <div key={`report-${dataVersion}-${selectedYear}`} className="space-y-6">
        {/* Year Selector */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Relatório Anual {selectedYear}</h2>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[2025, 2024, 2023, 2022, 2021, 2020].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Annual Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Receitas Totais</h3>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(reportData.summary.totalIncome)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Despesas Totais</h3>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(reportData.summary.totalExpenses)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Saldo Líquido</h3>
            <p className={`text-2xl font-bold ${reportData.summary.totalIncome - reportData.summary.totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(reportData.summary.totalIncome - reportData.summary.totalExpenses)}
            </p>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução Mensal</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mês</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receitas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Despesas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investimentos</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(reportData.monthlyData).map(([month, data]) => {
                  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                  const monthName = monthNames[parseInt(month) - 1];
                  const balance = data.income - data.expenses;
                  
                  return (
                    <tr key={month}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{monthName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(data.income)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{formatCurrency(data.expenses)}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(balance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{formatCurrency(data.investmentMovements)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Configurações Component
  const ConfigurationView = () => {
    const exportData = async () => {
      try {
        const data = await dbManager.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `personal_finance_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Erro ao exportar dados:', error);
        alert('Erro ao exportar dados.');
      }
    };

    const downloadDBBackup = async () => {
      try {
        await dbManager.downloadBackup();
      } catch (error) {
        console.error('Erro ao baixar backup:', error);
        alert('Erro ao baixar backup do banco de dados.');
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Configurações</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Backup e Exportação</h3>
              <p className="text-gray-600 mb-4">Faça backup dos seus dados financeiros</p>
              <div className="space-y-2">
                <button
                  onClick={exportData}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-4"
                >
                  Exportar Dados (JSON)
                </button>
                <button
                  onClick={downloadDBBackup}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors mr-4"
                >
                  Baixar Banco (.db)
                </button>
                <button
                  onClick={() => setAuthMode('change-password')}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors mr-4"
                >
                  Alterar Senha
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Informações do Sistema</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Aplicativo: Progressive Web App (PWA)</p>
                <p>• Banco de dados: SQLite WebAssembly</p>
                <p>• Persistência: IndexedDB do navegador</p>
                <p>• Funciona offline após carregamento inicial</p>
                <p>• Dados salvos localmente no dispositivo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render (aplicação autenticada)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <img 
                  src="/icon-192.png" 
                  alt="V&M Finance Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">V&M Personal Finance</h1>
                <p className="text-sm text-blue-600">Progressive Web App</p>
              </div>
            </div>
            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Painel
            </button>
            <button
              onClick={() => setActiveTab('patrimony')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'patrimony'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Patrimônio
            </button>
            <button
              onClick={() => setActiveTab('annual-report')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'annual-report'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Relatório Anual
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isConfigOpen && <ConfigurationView />}
        {!isConfigOpen && activeTab === 'dashboard' && <Dashboard />}
        {!isConfigOpen && activeTab === 'patrimony' && <PatrimonyView />}
        {!isConfigOpen && activeTab === 'annual-report' && <AnnualReportView />}
      </main>

      {/* Modal de Doação */}
      <DonationModal />
    </div>
  );
}