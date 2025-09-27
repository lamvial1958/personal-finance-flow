import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import dbManager from '../db-manager.js';
import ofxManager from '../ofx-manager.js';
import Papa from 'papaparse';

// Criar Context
const AppContext = createContext();

// Hook customizado para usar o contexto
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
};

// Provider do contexto
export const AppProvider = ({ children }) => {
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

  // Estados OFX
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

  // Função de formatação de moeda
  const formatCurrency = useCallback((value) => {
    if (typeof value !== 'number' || isNaN(value)) return '$ 0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }, []);

  // Função de formatação de data
  const formatDate = useCallback((date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  }, []);

  // Carregar todos os dados
  const loadAllData = useCallback(async () => {
    try {
      console.log('🔄 AppContext - Iniciando carregamento de dados...');
      setConnectionStatus('Carregando dados...');
      
      // Garantir que o database está inicializado
      if (!dbManager.isInitialized) {
        console.log('🔧 AppContext - Inicializando database...');
        await dbManager.initialize();
      }

      const [transactions, balances, movements] = await Promise.all([
        dbManager.getTransactions(),
        dbManager.getInitialBalances(), 
        dbManager.getInvestmentMovements()
      ]);

      console.log('✅ AppContext - Dados carregados do SQLite:', {
        transactions: Object.keys(transactions || {}).length,
        balances: Object.keys(balances || {}).length,
        movements: Object.keys(movements || {}).length
      });

      React.startTransition(() => {
        setDailyTransactions(transactions || {});
        setInitialBalances(balances || {});
        setInvestmentMovements(movements || {});
        setDataVersion(prev => prev + 1);
        setConnectionStatus('Conectado');
        setIsLoading(false);
      });

      console.log('✅ AppContext - Interface atualizada com dados');
      
    } catch (error) {
      console.error('❌ AppContext - Erro ao carregar dados:', error);
      setConnectionStatus('Erro ao carregar dados');
      setIsLoading(false);
      
      React.startTransition(() => {
        setDailyTransactions({});
        setInitialBalances({});
        setInvestmentMovements({});
      });
    }
  }, []);

  // ✅ CORREÇÃO CRÍTICA: useEffect para carregar dados na inicialização
  useEffect(() => {
    console.log('🚀 AppContext - Componente montado, carregando dados...');
    loadAllData();
  }, [loadAllData]);

  // Adicionar transação
  const addTransaction = useCallback(async (type, amount, description, category, date) => {
    try {
      const dateKey = date || new Date().toISOString().split('T')[0];
      console.log('Adicionando transação:', { type, amount, description, category, dateKey });
      
      await dbManager.addTransaction(dateKey, type, parseFloat(amount), description, category);
      console.log('Transação salva no banco');
      
      // Recarregar dados fresh do banco
      const freshTransactions = await dbManager.getTransactions();
      console.log('Dados recarregados após inserção:', freshTransactions);
      
      React.startTransition(() => {
        setDailyTransactions(freshTransactions || {});
        setDataVersion(prev => prev + 1);
      });
      
      console.log('Interface atualizada');
      
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      throw error;
    }
  }, []);

  // Atualizar saldos iniciais
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

  // Adicionar movimento de investimento
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

  // Excluir transação
  const deleteTransaction = useCallback(async (transactionId) => {
    try {
      console.log('Iniciando exclusão - ID:', transactionId);
      
      await dbManager.deleteTransaction(transactionId);
      console.log('Exclusão realizada no banco');
      
      // Recarregar dados FRESH do banco
      const freshTransactions = await dbManager.getTransactions();
      console.log('Dados recarregados:', freshTransactions);
      
      React.startTransition(() => {
        setDailyTransactions(freshTransactions || {});
        setDataVersion(prev => prev + 1);
      });
      
      alert('Transação excluída com sucesso!');
      
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      alert('Erro ao excluir transação: ' + error.message);
    }
  }, []);

  // Export CSV
  const exportToCSV = useCallback(() => {
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
  }, [dailyTransactions, formatDate]);

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
    
    const totalPatrimony = initialTotal + movementsTotal + liquidBalance;
    
    console.log('💰 AppContext - Cálculo patrimônio:', {
      initialTotal,
      movementsTotal,
      liquidBalance,
      totalPatrimony
    });
    
    return totalPatrimony;
  }, [initialBalances, investmentMovements, getDailyTotals, dataVersion]);

  // Transações filtradas e ordenadas
  const getFilteredAndSortedTransactions = useMemo(() => {
    const transactionsList = [];
    
    Object.entries(dailyTransactions).forEach(([date, dayData]) => {
      // Receitas
      Object.entries(dayData.income || {}).forEach(([id, transaction]) => {
        transactionsList.push({
          id: parseInt(id),
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
        transactionsList.push({
          id: parseInt(id),
          date,
          type: 'expenses',
          amount: transaction.amount,
          description: transaction.description,
          category: transaction.category,
          timestamp: transaction.timestamp
        });
      });
    });

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

  // Valor do contexto
  const value = {
    // Estados
    isAuthenticated, setIsAuthenticated,
    isSystemSetup, setIsSystemSetup,
    authMode, setAuthMode,
    dailyTransactions, setDailyTransactions,
    initialBalances, setInitialBalances,
    investmentMovements, setInvestmentMovements,
    activeTab, setActiveTab,
    isConfigOpen, setIsConfigOpen,
    selectedYear, setSelectedYear,
    isLoading, setIsLoading,
    connectionStatus, setConnectionStatus,
    dataVersion, setDataVersion,
    
    // Estados de doação e avaliação
    showDonationModal, setShowDonationModal,
    donationStage, setDonationStage,
    showRatingModal, setShowRatingModal,
    
    // Estados Fase 1
    searchTerm, setSearchTerm,
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    showDeleteModal, setShowDeleteModal,
    transactionToDelete, setTransactionToDelete,
    
    // Estados OFX
    isImportingOFX, setIsImportingOFX,
    isExportingOFX, setIsExportingOFX,
    showOFXImportModal, setShowOFXImportModal,
    ofxImportResults, setOFXImportResults,
    pendingOFXTransactions, setPendingOFXTransactions,
    
    // Dados e constantes
    categories,
    
    // Funções
    formatCurrency,
    formatDate,
    loadAllData,
    addTransaction,
    updateInitialBalances,
    addInvestmentMovement,
    deleteTransaction,
    exportToCSV,
    
    // Cálculos
    getDailyTotals,
    monthlyTotals,
    getCurrentPatrimony,
    getFilteredAndSortedTransactions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;