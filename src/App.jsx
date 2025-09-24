import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Papa from 'papaparse';
import dbManager from './db-manager.js';
import ofxManager from './ofx-manager.js';

export default function PersonalFinanceFlow() {
  // Estados de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSystemSetup, setIsSystemSetup] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  
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
  const [donationStage, setDonationStage] = useState(null);

  // Estados do sistema de avaliação GitHub Stars
  const [showRatingModal, setShowRatingModal] = useState(false);

  // Estados FASE 1
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Estados OFX - NOVOS
  const [isImportingOFX, setIsImportingOFX] = useState(false);
  const [isExportingOFX, setIsExportingOFX] = useState(false);
  const [showOFXImportModal, setShowOFXImportModal] = useState(false);
  const [ofxImportResults, setOFXImportResults] = useState(null);
  const [pendingOFXTransactions, setPendingOFXTransactions] = useState([]);

  // Categorias predefinidas
  const categories = {
    income: ['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Prêmio', 'Outros'],
    expenses: ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Compras', 'Outros']
  };

  // Inicializar banco de dados
  useEffect(() => {
    const initializeApp = async () => {
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
    };

    initializeApp();
  }, []);

  // Verificar avisos de doação
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        checkDonationStatus();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Verificar avaliação GitHub Stars após 30 dias
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        checkRatingStatus();
      }, 7000); // 2 segundos após donation check
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
    
    if (daysSinceFirstUse >= 60 && !donations.day60_dismissed) {
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

  const checkRatingStatus = () => {
    const firstUse = localStorage.getItem('app_first_use');
    const ratingStatus = JSON.parse(localStorage.getItem('rating_status') || '{}');
    
    if (!firstUse) return;

    const firstUseDate = new Date(firstUse);
    const daysSinceFirstUse = Math.floor((new Date() - firstUseDate) / (1000 * 60 * 60 * 24));
    
    // Mostrar após 30 dias, se não foi dismissed e não foi mostrado recentemente
    if (daysSinceFirstUse >= 30 && !ratingStatus.dismissed) {
      const lastShown = ratingStatus.last_shown ? new Date(ratingStatus.last_shown) : null;
      if (!lastShown || (new Date() - lastShown) / (1000 * 60 * 60 * 24) >= 7) {
        setShowRatingModal(true);
        localStorage.setItem('rating_status', JSON.stringify({
          ...ratingStatus,
          last_shown: new Date().toISOString()
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

  const dismissRatingPermanently = () => {
    const ratingStatus = JSON.parse(localStorage.getItem('rating_status') || '{}');
    localStorage.setItem('rating_status', JSON.stringify({
      ...ratingStatus,
      dismissed: true
    }));
    setShowRatingModal(false);
  };

  const openGitHubRating = () => {
    window.open('https://github.com/lamvial1958/personal-finance-flow', '_blank');
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
      
      const [transactions, balances, movements] = await Promise.all([
        dbManager.getTransactions(),
        dbManager.getInitialBalances(), 
        dbManager.getInvestmentMovements()
      ]);

      React.startTransition(() => {
        setDailyTransactions(transactions || {});
        setInitialBalances(balances || {});
        setInvestmentMovements(movements || {});
        setDataVersion(prev => prev + 1);
        setConnectionStatus('Conectado');
      });

      console.log('Dados carregados do SQLite WebAssembly');
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
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

  // FASE 1 - Exclusão de transações
  const handleDeleteClick = (transactionId, date, type, description) => {
    console.log('Preparando exclusão:', { transactionId, date, type, description });
    setTransactionToDelete({ id: transactionId, date, type, description });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      console.log('Iniciando exclusão - ID:', transactionToDelete.id);
      console.log('Estrutura atual dailyTransactions:', dailyTransactions);
      
      await dbManager.deleteTransaction(transactionToDelete.id);
      console.log('Exclusão realizada no banco');
      
      // Recarregar dados FRESH do banco
      const freshTransactions = await dbManager.getTransactions();
      console.log('Dados recarregados:', freshTransactions);
      
      React.startTransition(() => {
        setDailyTransactions(freshTransactions || {});
        setDataVersion(prev => prev + 1);
      });
      
      setShowDeleteModal(false);
      setTransactionToDelete(null);
      alert('Transação excluída com sucesso!');
      
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      alert('Erro ao excluir transação: ' + error.message);
    }
  };

  // FASE 1 - Export CSV
  const exportToCSV = () => {
    try {
      const csvData = [];
      
      Object.entries(dailyTransactions).forEach(([date, dayData]) => {
        // Receitas
        Object.entries(dayData.income || {}).forEach(([id, transaction]) => {
          csvData.push({
            Data: formatDate(date),
            Tipo: 'Entrada',
            Valor: transaction.amount.toFixed(2).replace('.', ','),
            Categoria: transaction.category || '',
            Descrição: transaction.description || ''
          });
        });
        
        // Despesas
        Object.entries(dayData.expenses || {}).forEach(([id, transaction]) => {
          csvData.push({
            Data: formatDate(date),
            Tipo: 'Saída',
            Valor: transaction.amount.toFixed(2).replace('.', ','),
            Categoria: transaction.category || '',
            Descrição: transaction.description || ''
          });
        });
      });
      
      // Ordenar por data
      csvData.sort((a, b) => {
        const dateA = new Date(a.Data.split('/').reverse().join('-'));
        const dateB = new Date(b.Data.split('/').reverse().join('-'));
        return dateB - dateA;
      });
      
      // Converter para CSV
      const csv = Papa.unparse(csvData, {
        delimiter: ',',
        header: true,
        encoding: 'utf-8'
      });
      
      // Download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transacoes_financeiras_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      alert('Arquivo CSV exportado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      alert('Erro ao exportar dados para CSV.');
    }
  };

  // OFX - Import NOVO
  const handleOFXImport = async () => {
    try {
      // Criar input file oculto
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.ofx,.qfx';
      input.style.display = 'none';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        console.log('Arquivo OFX selecionado:', file.name, file.size, 'bytes');
        
        setIsImportingOFX(true);
        
        try {
          // Ler arquivo
          const content = await readFileContent(file);
          console.log('Conteúdo lido, processando...');
          
          // Validar se é OFX
          if (!ofxManager.isValidOFX(content)) {
            throw new Error('Arquivo não é um OFX válido');
          }
          
          // Importar via OFX Manager
          const importedTransactions = await ofxManager.importOFX(content);
          console.log('Transações importadas:', importedTransactions.length);
          
          if (importedTransactions.length === 0) {
            alert('Nenhuma transação encontrada no arquivo OFX.');
            return;
          }
          
          // Converter transações existentes para verificar duplicatas
          const existingTransactions = convertDailyTransactionsToList();
          
          // Detectar duplicatas
          const duplicateResults = ofxManager.detectDuplicates(importedTransactions, existingTransactions);
          
          // Mostrar modal de confirmação
          setOFXImportResults(duplicateResults);
          setPendingOFXTransactions(importedTransactions);
          setShowOFXImportModal(true);
          
        } catch (error) {
          console.error('Erro no import OFX:', error);
          alert('Erro ao importar arquivo OFX: ' + error.message);
        } finally {
          setIsImportingOFX(false);
        }
      };
      
      // Trigger file picker
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
      
    } catch (error) {
      console.error('Erro ao iniciar import OFX:', error);
      alert('Erro ao iniciar importação OFX.');
      setIsImportingOFX(false);
    }
  };

  // OFX - Export NOVO
  const handleOFXExport = async () => {
    try {
      setIsExportingOFX(true);
      
      // Converter transações para formato lista
      const transactionsList = convertDailyTransactionsToList();
      
      if (transactionsList.length === 0) {
        alert('Nenhuma transação encontrada para exportar.');
        return;
      }
      
      console.log('Exportando', transactionsList.length, 'transações para OFX');
      
      // Gerar OFX
      const ofxContent = await ofxManager.exportOFX(transactionsList, {
        bankId: '000',
        accountId: 'PERSONAL_FINANCE'
      });
      
      // Download
      const blob = new Blob([ofxContent], { type: 'application/x-ofx;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transacoes_financeiras_${new Date().toISOString().split('T')[0]}.ofx`;
      a.click();
      URL.revokeObjectURL(url);
      
      alert('Arquivo OFX exportado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao exportar OFX:', error);
      alert('Erro ao exportar dados para OFX: ' + error.message);
    } finally {
      setIsExportingOFX(false);
    }
  };

  // Funções auxiliares para OFX
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file, 'utf-8');
    });
  };

  const convertDailyTransactionsToList = () => {
    const list = [];
    Object.entries(dailyTransactions).forEach(([date, dayData]) => {
      // Receitas
      Object.entries(dayData.income || {}).forEach(([id, transaction]) => {
        list.push({
          id: parseInt(id),
          date,
          type: 'income',
          amount: transaction.amount,
          description: transaction.description,
          category: transaction.category,
          fitid: transaction.fitid || null
        });
      });
      // Despesas
      Object.entries(dayData.expenses || {}).forEach(([id, transaction]) => {
        list.push({
          id: parseInt(id),
          date,
          type: 'expenses',
          amount: transaction.amount,
          description: transaction.description,
          category: transaction.category,
          fitid: transaction.fitid || null
        });
      });
    });
    return list;
  };

  // Confirmar importação OFX
  const confirmOFXImport = async (importType) => {
    try {
      let transactionsToImport = [];
      
      if (importType === 'all') {
        transactionsToImport = pendingOFXTransactions;
      } else if (importType === 'unique') {
        transactionsToImport = ofxImportResults.unique;
      } else {
        return; // Cancelado
      }
      
      console.log('Importando', transactionsToImport.length, 'transações OFX');
      
      // Salvar no banco
      for (const transaction of transactionsToImport) {
        await dbManager.addTransaction(
          transaction.date,
          transaction.type,
          transaction.amount,
          transaction.description,
          transaction.category
        );
      }
      
      // Recarregar dados
      const freshTransactions = await dbManager.getTransactions();
      
      React.startTransition(() => {
        setDailyTransactions(freshTransactions || {});
        setDataVersion(prev => prev + 1);
      });
      
      // Limpar estado
      setShowOFXImportModal(false);
      setOFXImportResults(null);
      setPendingOFXTransactions([]);
      
      alert(`${transactionsToImport.length} transações importadas com sucesso!`);
      
    } catch (error) {
      console.error('Erro ao confirmar import OFX:', error);
      alert('Erro ao salvar transações importadas: ' + error.message);
    }
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
      console.log('Adicionando transação:', { type, amount, description, category, dateKey });
      
      await dbManager.addTransaction(dateKey, type, parseFloat(amount), description, category);
      console.log('Transação salva no banco');
      
      // SEMPRE recarregar dados fresh do banco após inserção
      const freshTransactions = await dbManager.getTransactions();
      console.log('Dados recarregados após inserção:', freshTransactions);
      
      React.startTransition(() => {
        setDailyTransactions(freshTransactions || {});
        setDataVersion(prev => prev + 1);
      });
      
      console.log('Interface atualizada');
      
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      throw error; // Re-throw para ser capturado no formulário
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

  // FASE 1 - Função de filtragem e ordenação
  const getFilteredAndSortedTransactions = useMemo(() => {
    const transactionsList = [];
    
    console.log('Processando dailyTransactions para lista:', dailyTransactions);
    
    Object.entries(dailyTransactions).forEach(([date, dayData]) => {
      // Receitas - ID é a chave da estrutura (que vem do SQLite)
      Object.entries(dayData.income || {}).forEach(([id, transaction]) => {
        console.log(`Receita encontrada - ID: ${id}, Dados:`, transaction);
        transactionsList.push({
          id: parseInt(id), // Converter para number para garantir match com SQLite
          date,
          type: 'income',
          amount: transaction.amount,
          description: transaction.description,
          category: transaction.category,
          timestamp: transaction.timestamp
        });
      });
      
      // Despesas
      Object.entries(dayData.expenses || {}).forEach(([id, transaction]) => {
        console.log(`Despesa encontrada - ID: ${id}, Dados:`, transaction);
        transactionsList.push({
          id: parseInt(id), // Converter para number para garantir match com SQLite
          date,
          type: 'expenses',
          amount: transaction.amount,
          description: transaction.description,
          category: transaction.category,
          timestamp: transaction.timestamp
        });
      });
    });

    console.log('Lista completa de transações:', transactionsList);

    // Aplicar filtro de busca
    let filteredTransactions = transactionsList;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filteredTransactions = transactionsList.filter(t => 
        (t.description || '').toLowerCase().includes(term) ||
        (t.category || '').toLowerCase().includes(term)
      );
    }

    // Aplicar ordenação
    filteredTransactions.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '');
          break;
        case 'description':
          comparison = (a.description || '').localeCompare(b.description || '');
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filteredTransactions;
  }, [dailyTransactions, searchTerm, sortBy, sortOrder, dataVersion]);

  // Modal de Doação
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

  // Modal de Avaliação GitHub Stars
  const RatingModal = () => {
    if (!showRatingModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-lg font-semibold text-gray-800">
              Gostou? Deixe uma ⭐ para ajudar outros a descobrir
            </h3>
          </div>
          
          <p className="text-gray-600 text-center mb-6">
            Você está usando há mais de 30 dias! Se o aplicativo tem sido útil, 
            uma avaliação no GitHub ajuda outras pessoas a encontrá-lo.
          </p>

          <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Clique no botão abaixo e depois na estrela ⭐
              </p>
              <p className="text-xs text-gray-500">
                GitHub → Botão "⭐ Star" → Pronto!
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                openGitHubRating();
                setShowRatingModal(false);
              }}
              className="w-full bg-yellow-600 text-white py-3 rounded hover:bg-yellow-700 font-medium"
            >
              ⭐ Avaliar no GitHub
            </button>
            
            <button
              onClick={() => setShowRatingModal(false)}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
            >
              Lembrar mais tarde
            </button>
            
            <button
              onClick={dismissRatingPermanently}
              className="w-full text-gray-500 py-2 text-sm hover:text-gray-700"
            >
              Não mostrar novamente
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Leva apenas 10 segundos e ajuda muito o projeto
          </p>
        </div>
      </div>
    );
  };

  // Modal de Exclusão
  const DeleteModal = () => {
    if (!showDeleteModal || !transactionToDelete) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2 text-red-500">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800">
              Excluir Transação
            </h3>
          </div>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>ID:</strong> {transactionToDelete.id}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Data:</strong> {formatDate(transactionToDelete.date)}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Tipo:</strong> {transactionToDelete.type === 'income' ? 'Entrada' : 'Saída'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Descrição:</strong> {transactionToDelete.description}
            </p>
          </div>

          <p className="text-gray-600 text-center mb-6">
            Esta ação não pode ser desfeita. Deseja realmente excluir esta transação?
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setTransactionToDelete(null);
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 font-medium"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal de Importação OFX - NOVO
  const OFXImportModal = () => {
    if (!showOFXImportModal || !ofxImportResults) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl max-h-96 overflow-y-auto">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">📥</div>
            <h3 className="text-lg font-semibold text-gray-800">
              Importação OFX
            </h3>
          </div>
          
          <div className="mb-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{ofxImportResults.total}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{ofxImportResults.uniqueCount}</p>
                  <p className="text-sm text-gray-600">Novas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{ofxImportResults.duplicateCount}</p>
                  <p className="text-sm text-gray-600">Duplicadas</p>
                </div>
              </div>
            </div>

            {ofxImportResults.duplicateCount > 0 && (
              <div className="bg-orange-50 rounded-lg p-3 mb-4 border border-orange-200">
                <p className="text-sm text-orange-800">
                  <strong>Duplicatas encontradas:</strong> {ofxImportResults.duplicateCount} transações 
                  já existem no sistema (baseado no ID do banco).
                </p>
              </div>
            )}
            
            {ofxImportResults.uniqueCount > 0 && (
              <div className="bg-green-50 rounded-lg p-3 mb-4 border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Transações novas:</strong> {ofxImportResults.uniqueCount} transações 
                  serão adicionadas ao seu sistema.
                </p>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-center mb-6">
            Como você deseja prosseguir com a importação?
          </p>

          <div className="flex flex-col gap-3">
            {ofxImportResults.uniqueCount > 0 && (
              <button
                onClick={() => confirmOFXImport('unique')}
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 font-medium"
              >
                📥 Importar Apenas Novas ({ofxImportResults.uniqueCount})
              </button>
            )}
            
            <button
              onClick={() => confirmOFXImport('all')}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-medium"
            >
              📥 Importar Todas ({ofxImportResults.total})
            </button>
            
            <button
              onClick={() => {
                setShowOFXImportModal(false);
                setOFXImportResults(null);
                setPendingOFXTransactions([]);
              }}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Transações duplicadas são identificadas pelo ID único do banco (FITID)
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

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!newTransaction.amount || !newTransaction.description) {
        alert('Por favor, preencha valor e descrição.');
        return;
      }

      if (parseFloat(newTransaction.amount) <= 0) {
        alert('O valor deve ser maior que zero.');
        return;
      }

      try {
        await addTransaction(
          newTransaction.type,
          newTransaction.amount,
          newTransaction.description,
          newTransaction.category,
          newTransaction.date
        );
        
        // Limpar formulário após sucesso
        setNewTransaction({
          type: 'income',
          amount: '',
          description: '',
          category: '',
          date: new Date().toISOString().split('T')[0]
        });
        
        alert('Transação adicionada com sucesso!');
        
      } catch (error) {
        console.error('Erro no formulário:', error);
        alert('Erro ao adicionar transação: ' + error.message);
      }
    };

    const todayTotals = getDailyTotals[newTransaction.date] || { income: 0, expenses: 0, balance: 0 };
    const totalIncome = Object.values(getDailyTotals).reduce((sum, day) => sum + day.income, 0);
    const totalExpenses = Object.values(getDailyTotals).reduce((sum, day) => sum + day.expenses, 0);
    const filteredTransactions = getFilteredAndSortedTransactions;

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value, category: ''})}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0,00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories[newTransaction.type].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
              <input
                type="text"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descrição da transação"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Adicionar Transação
            </button>
          </form>
        </div>

        {/* FASE 1 - Busca e Ordenação */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Transações Recentes ({filteredTransactions.length})
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Campo de Busca */}
              <div className="relative">
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por descrição ou categoria"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-64"
                />
              </div>
              
              {/* Ordenação */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date-desc">Data ↓ (mais recente)</option>
                <option value="date-asc">Data ↑ (mais antiga)</option>
                <option value="amount-desc">Valor ↓ (maior)</option>
                <option value="amount-asc">Valor ↑ (menor)</option>
                <option value="category-asc">Categoria A-Z</option>
                <option value="category-desc">Categoria Z-A</option>
              </select>
            </div>
          </div>

          {/* Lista de Transações */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'Nenhuma transação encontrada para esta busca.' : 'Nenhuma transação encontrada.'}
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={`${transaction.date}-${transaction.id}`} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'income' ? 'Entrada' : 'Saída'}
                        </span>
                        <span className="text-sm text-gray-500">{formatDate(transaction.date)}</span>
                        <span className="text-xs text-gray-400">ID: {transaction.id}</span>
                      </div>
                      <p className="font-medium text-gray-900 mt-1">
                        {searchTerm ? (
                          <span dangerouslySetInnerHTML={{
                            __html: (transaction.description || '').replace(
                              new RegExp(`(${searchTerm})`, 'gi'),
                              '<mark class="bg-yellow-200">$1</mark>'
                            )
                          }} />
                        ) : (
                          transaction.description
                        )}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">
                          {searchTerm ? (
                            <span dangerouslySetInnerHTML={{
                              __html: (transaction.category || 'Sem categoria').replace(
                                new RegExp(`(${searchTerm})`, 'gi'),
                                '<mark class="bg-yellow-200">$1</mark>'
                              )
                            }} />
                          ) : (
                            transaction.category || 'Sem categoria'
                          )}
                        </span>
                        <span className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Botão de Exclusão */}
                    <button
                      onClick={() => handleDeleteClick(
                        transaction.id, 
                        transaction.date, 
                        transaction.type, 
                        transaction.description
                      )}
                      className="ml-4 p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      title="Excluir transação"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo do Patrimônio</h2>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{formatCurrency(getCurrentPatrimony)}</p>
            <p className="text-gray-600 mt-2">Patrimônio Total</p>
          </div>
        </div>

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

  // Configuration View Component - ATUALIZADO COM OFX E NAVEGAÇÃO MELHORADA
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
        {/* Cabeçalho com botão voltar */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Configurações</h2>
            <button
              onClick={() => setIsConfigOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              <span>Voltar</span>
            </button>
          </div>
          
          <div className="space-y-6">
            {/* NOVA SEÇÃO OFX */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Funcionalidade OFX</h3>
              <p className="text-gray-600 mb-4">
                Importe transações de arquivos .ofx/.qfx dos bancos ou exporte seus dados em formato OFX
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleOFXImport}
                  disabled={isImportingOFX}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImportingOFX ? 'Importando...' : '📥 Importar OFX'}
                </button>
                <button
                  onClick={handleOFXExport}
                  disabled={isExportingOFX}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExportingOFX ? 'Exportando...' : '📤 Exportar OFX'}
                </button>
              </div>
              <div className="mt-3 text-xs text-gray-500 space-y-1">
                <p>• Compatível com Itaú, Bradesco, Santander, Banco do Brasil</p>
                <p>• Importação detecta duplicatas automaticamente</p>
                <p>• Categorização inteligente baseada na descrição</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Backup e Exportação</h3>
              <p className="text-gray-600 mb-4">Faça backup dos seus dados financeiros</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <button
                  onClick={exportToCSV}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Exportar CSV
                </button>
                <button
                  onClick={exportData}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Exportar JSON
                </button>
                <button
                  onClick={downloadDBBackup}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Baixar Banco (.db)
                </button>
                <button
                  onClick={() => setAuthMode('change-password')}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Alterar Senha
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Sair
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Avaliação</h3>
              <p className="text-gray-600 mb-4">Se você gostou do aplicativo, ajude outros a descobri-lo</p>
              <button
                onClick={openGitHubRating}
                className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                Gostou? Deixe uma ⭐ para ajudar outros a descobrir
              </button>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Funcionalidades Implementadas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <p>✅ Exclusão de transações com logs</p>
                <p>✅ Busca por descrição/categoria</p>
                <p>✅ Ordenação flexível</p>
                <p>✅ Export CSV completo</p>
                <p>✅ Categorias predefinidas</p>
                <p>✅ Validação de formulários</p>
                <p>✅ Import/Export OFX</p>
                <p>✅ Detecção de duplicatas</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Informações do Sistema</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Progressive Web App (PWA)</p>
                <p>• SQLite WebAssembly</p>
                <p>• Dados locais (IndexedDB)</p>
                <p>• Funciona offline</p>
                <p>• Versão: 1.2 + Funcionalidade OFX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
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
                <p className="text-sm text-blue-600">Progressive Web App + OFX</p>
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

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setIsConfigOpen(false);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard' && !isConfigOpen
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Painel
            </button>
            <button
              onClick={() => {
                setActiveTab('patrimony');
                setIsConfigOpen(false);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'patrimony' && !isConfigOpen
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Patrimônio
            </button>
            <button
              onClick={() => {
                setActiveTab('annual-report');
                setIsConfigOpen(false);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'annual-report' && !isConfigOpen
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Relatório Anual
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isConfigOpen && <ConfigurationView />}
        {!isConfigOpen && activeTab === 'dashboard' && <Dashboard />}
        {!isConfigOpen && activeTab === 'patrimony' && <PatrimonyView />}
        {!isConfigOpen && activeTab === 'annual-report' && <AnnualReportView />}
      </main>

      <DonationModal />
      <RatingModal />
      <DeleteModal />
      <OFXImportModal />
    </div>
  );
}