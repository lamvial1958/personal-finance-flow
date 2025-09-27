/**
 * useTransactions Hook - Personal Finance Flow
 * Gerencia toda a lógica de transações, busca, ordenação e exclusão
 * 
 * Localização: C:\Personal_Finance_Flow\src\hooks\useTransactions.js
 * Versão: 1.1.0 - Campo descrição tornado opcional
 * Criado: Setembro 2025
 */

import { useCallback, useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

export const useTransactions = () => {
  const {
    // Estados principais
    dailyTransactions,
    searchTerm, setSearchTerm,
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    showDeleteModal, setShowDeleteModal,
    transactionToDelete, setTransactionToDelete,
    dataVersion,
    
    // Funções do Context
    addTransaction,
    deleteTransaction,
    exportToCSV,
    getFilteredAndSortedTransactions,
    getDailyTotals,
    formatDate,
    formatCurrency,
    categories
  } = useApp();

  // Estado local para formulário de nova transação
  const [newTransaction, setNewTransaction] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Preparar exclusão de transação
  const handleDeleteClick = useCallback((transactionId, date, type, description) => {
    console.log('Preparando exclusão:', { transactionId, date, type, description });
    setTransactionToDelete({ id: transactionId, date, type, description });
    setShowDeleteModal(true);
  }, [setTransactionToDelete, setShowDeleteModal]);

  // Confirmar exclusão
  const confirmDelete = useCallback(async () => {
    if (!transactionToDelete) return;

    try {
      await deleteTransaction(transactionToDelete.id);
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  }, [transactionToDelete, deleteTransaction, setShowDeleteModal, setTransactionToDelete]);

  // Cancelar exclusão
  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setTransactionToDelete(null);
  }, [setShowDeleteModal, setTransactionToDelete]);

  // Submeter nova transação
  const handleTransactionSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // ✅ ALTERAÇÃO: Apenas valor é obrigatório, descrição é opcional
    if (!newTransaction.amount) {
      alert('Por favor, preencha o valor.');
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
        newTransaction.description || '', // ✅ Descrição opcional: usa string vazia se não preenchida
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
  }, [newTransaction, addTransaction]);

  // Atualizar campo do formulário
  const updateTransactionField = useCallback((field, value) => {
    setNewTransaction(prev => ({
      ...prev,
      [field]: value,
      // Limpar categoria quando mudar tipo
      ...(field === 'type' && { category: '' })
    }));
  }, []);

  // Utilitários de busca e ordenação
  const updateSearchTerm = useCallback((term) => {
    setSearchTerm(term);
  }, [setSearchTerm]);

  const updateSortCriteria = useCallback((criteria) => {
    const [newSortBy, newSortOrder] = criteria.split('-');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  }, [setSortBy, setSortOrder]);

  // Limpar busca
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, [setSearchTerm]);

  // Reset ordenação para padrão
  const resetSort = useCallback(() => {
    setSortBy('date');
    setSortOrder('desc');
  }, [setSortBy, setSortOrder]);

  // Estatísticas de transações
  const transactionStats = useMemo(() => {
    const filtered = getFilteredAndSortedTransactions;
    const total = Object.keys(dailyTransactions).length;
    
    const totalIncome = Object.values(getDailyTotals).reduce((sum, day) => sum + day.income, 0);
    const totalExpenses = Object.values(getDailyTotals).reduce((sum, day) => sum + day.expenses, 0);
    const liquidBalance = totalIncome - totalExpenses;

    // Contadores por categoria
    const categoryStats = {};
    filtered.forEach(transaction => {
      const cat = transaction.category || 'Sem categoria';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { count: 0, amount: 0 };
      }
      categoryStats[cat].count++;
      categoryStats[cat].amount += transaction.amount;
    });

    return {
      totalRecords: total,
      filteredCount: filtered.length,
      totalIncome,
      totalExpenses,
      liquidBalance,
      categoryStats,
      hasTransactions: total > 0,
      hasFilteredResults: filtered.length > 0,
      isFiltered: searchTerm.trim().length > 0,
      isSorted: sortBy !== 'date' || sortOrder !== 'desc'
    };
  }, [getFilteredAndSortedTransactions, dailyTransactions, getDailyTotals, searchTerm, sortBy, sortOrder]);

  // Hoje - cálculos específicos
  const todayStats = useMemo(() => {
    const today = newTransaction.date;
    const todayTotals = getDailyTotals[today] || { income: 0, expenses: 0, balance: 0 };
    
    return {
      date: today,
      income: todayTotals.income,
      expenses: todayTotals.expenses,
      balance: todayTotals.balance
    };
  }, [newTransaction.date, getDailyTotals]);

  // ✅ ALTERAÇÃO: Validações do formulário - descrição não é mais obrigatória
  const formValidation = useMemo(() => {
    const hasAmount = newTransaction.amount && parseFloat(newTransaction.amount) > 0;
    const hasValidDate = newTransaction.date && new Date(newTransaction.date).getTime();
    
    return {
      isValid: hasAmount && hasValidDate, // ✅ Removida validação de descrição
      hasAmount,
      hasValidDate,
      errors: {
        amount: !hasAmount ? 'Valor é obrigatório e deve ser maior que zero' : null,
        date: !hasValidDate ? 'Data inválida' : null
        // ✅ Removida validação de erro de descrição
      }
    };
  }, [newTransaction]);

  // Opções de ordenação disponíveis
  const sortOptions = [
    { value: 'date-desc', label: 'Data ↓ (mais recente)' },
    { value: 'date-asc', label: 'Data ↑ (mais antiga)' },
    { value: 'amount-desc', label: 'Valor ↓ (maior)' },
    { value: 'amount-asc', label: 'Valor ↑ (menor)' },
    { value: 'category-asc', label: 'Categoria A-Z' },
    { value: 'category-desc', label: 'Categoria Z-A' }
  ];

  // Função para destacar termos de busca
  const highlightSearchTerm = useCallback((text, term) => {
    if (!term || !text) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  }, []);

  // Converter lista de transações para formato de exportação
  const convertTransactionsToList = useCallback(() => {
    const list = [];
    Object.entries(dailyTransactions).forEach(([date, dayData]) => {
      // Receitas
      Object.entries(dayData.income || {}).forEach(([id, transaction]) => {
        list.push({
          id: parseInt(id),
          date,
          type: 'income',
          amount: transaction.amount,
          description: transaction.description || '', // ✅ Trata descrição vazia
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
          description: transaction.description || '', // ✅ Trata descrição vazia
          category: transaction.category,
          fitid: transaction.fitid || null
        });
      });
    });
    return list;
  }, [dailyTransactions]);

  return {
    // Estados principais
    transactions: getFilteredAndSortedTransactions,
    searchTerm,
    sortBy,
    sortOrder,
    
    // Estados do formulário
    newTransaction,
    formValidation,
    
    // Estados de modal de exclusão
    showDeleteModal,
    transactionToDelete,
    
    // Estatísticas e dados calculados
    transactionStats,
    todayStats,
    
    // Funções principais
    addTransaction: handleTransactionSubmit,
    updateTransactionField,
    
    // Funções de busca e ordenação
    updateSearchTerm,
    updateSortCriteria,
    clearSearch,
    resetSort,
    
    // Funções de exclusão
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    
    // Funções utilitárias
    exportToCSV,
    highlightSearchTerm,
    convertTransactionsToList,
    formatCurrency,
    formatDate,
    
    // Opções e dados estáticos
    categories,
    sortOptions,
    
    // Estados computados úteis
    hasSearchResults: transactionStats.hasFilteredResults,
    isSearching: transactionStats.isFiltered,
    hasTransactions: transactionStats.hasTransactions,
    transactionCount: transactionStats.filteredCount,
    totalTransactionCount: transactionStats.totalRecords
  };
};

export default useTransactions;