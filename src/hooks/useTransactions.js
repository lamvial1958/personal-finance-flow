/**
 * useTransactions Hook - Personal Finance Flow
 * Gerencia toda a lógica de transações, busca, ordenação, exclusão, edição e filtros avançados
 * 
 * Localização: C:\Personal_Finance_Flow\src\hooks\useTransactions.js
 * Versão: Filtros avançados implementados
 * Criado: Setembro 2025
 */

import { useCallback, useState, useMemo, useEffect } from 'react';
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
    
    // Estados de edição do AppContext
    showEditModal, setShowEditModal,
    transactionToEdit, setTransactionToEdit,
    
    // Estados de filtros avançados
    advancedFilters, setAdvancedFilters,
    showAdvancedFilters, setShowAdvancedFilters,
    
    // Funções do Context
    addTransaction,
    deleteTransaction,
    updateTransaction,
    exportToCSV,
    getFilteredAndSortedTransactions,
    getDailyTotals,
    formatDate,
    formatCurrency,
    categories,
    
    // Funções de filtros avançados
    updateAdvancedFilters,
    clearAdvancedFilters,
    toggleCategoryFilter,
    toggleTypeFilter
  } = useApp();

  // Estado local para formulário de nova transação
  const [newTransaction, setNewTransaction] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Estado local para formulário de edição
  const [editTransaction, setEditTransaction] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: '',
    date: ''
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

  // Preparar edição de transação usando AppContext
  const handleEditClick = useCallback((transactionId, date, type, amount, description, category) => {
    console.log('Preparando edição:', { transactionId, date, type, amount, description, category });
    
    setTransactionToEdit({ 
      id: transactionId, 
      date, 
      type, 
      amount, 
      description: description || '', 
      category: category || '' 
    });
    
    setShowEditModal(true);
  }, [setTransactionToEdit, setShowEditModal]);

  // Confirmar edição usando AppContext
  const confirmEdit = useCallback(async () => {
    if (!transactionToEdit) return;

    try {
      // Validar dados antes de atualizar
      if (!editTransaction.amount || parseFloat(editTransaction.amount) <= 0) {
        alert('Por favor, preencha um valor válido.');
        return;
      }

      if (!editTransaction.date) {
        alert('Por favor, preencha uma data válida.');
        return;
      }

      // Preparar campos para atualização
      const updatedFields = {
        date: editTransaction.date,
        type: editTransaction.type,
        amount: parseFloat(editTransaction.amount),
        description: editTransaction.description || '',
        category: editTransaction.category || ''
      };

      console.log('Atualizando transação ID:', transactionToEdit.id, 'com campos:', updatedFields);

      // Usar função do AppContext
      await updateTransaction(transactionToEdit.id, updatedFields);
      
      // Fechar modal e limpar estados
      setShowEditModal(false);
      setTransactionToEdit(null);
      setEditTransaction({
        type: 'income',
        amount: '',
        description: '',
        category: '',
        date: ''
      });
      
      alert('Transação atualizada com sucesso!');
      
    } catch (error) {
      console.error('Erro ao editar transação:', error);
      alert('Erro ao atualizar transação: ' + error.message);
    }
  }, [transactionToEdit, editTransaction, updateTransaction, setShowEditModal, setTransactionToEdit]);

  // Cancelar edição usando AppContext
  const cancelEdit = useCallback(() => {
    setShowEditModal(false);
    setTransactionToEdit(null);
    setEditTransaction({
      type: 'income',
      amount: '',
      description: '',
      category: '',
      date: ''
    });
  }, [setShowEditModal, setTransactionToEdit]);

  // Atualizar campo do formulário de edição
  const updateEditTransactionField = useCallback((field, value) => {
    setEditTransaction(prev => ({
      ...prev,
      [field]: value,
      // Limpar categoria quando mudar tipo
      ...(field === 'type' && { category: '' })
    }));
  }, []);

  // Submeter nova transação
  const handleTransactionSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Apenas valor é obrigatório, descrição é opcional
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
        newTransaction.description || '', // Descrição opcional: usa string vazia se não preenchida
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

  // ✅ NOVO: Atualizar campo de filtro avançado
  const updateAdvancedFilterField = useCallback((field, value) => {
    updateAdvancedFilters({ [field]: value });
  }, [updateAdvancedFilters]);

  // ✅ NOVO: Aplicar filtro rápido de período
  const applyQuickDateFilter = useCallback((period) => {
    const today = new Date();
    let dateStart = '';
    
    switch (period) {
      case 'today':
        dateStart = today.toISOString().split('T')[0];
        updateAdvancedFilters({ 
          dateStart, 
          dateEnd: dateStart 
        });
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 7);
        updateAdvancedFilters({ 
          dateStart: weekStart.toISOString().split('T')[0], 
          dateEnd: today.toISOString().split('T')[0] 
        });
        break;
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        updateAdvancedFilters({ 
          dateStart: monthStart.toISOString().split('T')[0], 
          dateEnd: today.toISOString().split('T')[0] 
        });
        break;
      case 'year':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        updateAdvancedFilters({ 
          dateStart: yearStart.toISOString().split('T')[0], 
          dateEnd: today.toISOString().split('T')[0] 
        });
        break;
      default:
        clearAdvancedFilters();
    }
  }, [updateAdvancedFilters, clearAdvancedFilters]);

  // ✅ NOVO: Aplicar filtro rápido de valor
  const applyQuickAmountFilter = useCallback((range) => {
    switch (range) {
      case 'small':
        updateAdvancedFilters({ amountMin: '0', amountMax: '100' });
        break;
      case 'medium':
        updateAdvancedFilters({ amountMin: '100', amountMax: '1000' });
        break;
      case 'large':
        updateAdvancedFilters({ amountMin: '1000', amountMax: '' });
        break;
      default:
        updateAdvancedFilters({ amountMin: '', amountMax: '' });
    }
  }, [updateAdvancedFilters]);

  // ✅ NOVO: Toggle filtro de categoria (mantém múltiplas seleções)
  const handleCategoryToggle = useCallback((category) => {
    toggleCategoryFilter(category);
  }, [toggleCategoryFilter]);

  // ✅ NOVO: Toggle filtro de tipo (mantém múltiplas seleções)
  const handleTypeToggle = useCallback((type) => {
    toggleTypeFilter(type);
  }, [toggleTypeFilter]);

  // ✅ NOVO: Limpar todos os filtros avançados
  const handleClearAllFilters = useCallback(() => {
    clearAdvancedFilters();
    setSearchTerm('');
    resetSort();
  }, [clearAdvancedFilters, setSearchTerm, resetSort]);

  // ✅ NOVO: Toggle visibilidade dos filtros avançados
  const toggleAdvancedFilters = useCallback(() => {
    setShowAdvancedFilters(prev => !prev);
  }, [setShowAdvancedFilters]);

  // Estatísticas de transações
  const transactionStats = useMemo(() => {
    const filtered = getFilteredAndSortedTransactions;
    const total = Object.keys(dailyTransactions).length;
    
    const totalIncome = Object.values(getDailyTotals).reduce((sum, day) => sum + day.income, 0);
    const totalExpenses = Object.values(getDailyTotals).reduce((sum, day) => sum + day.expenses, 0);
    const liquidBalance = totalIncome - totalExpenses;

    // ✅ NOVO: Estatísticas dos dados filtrados
    const filteredIncome = filtered
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const filteredExpenses = filtered
      .filter(t => t.type === 'expenses')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const filteredBalance = filteredIncome - filteredExpenses;

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

    // ✅ NOVO: Verificar se há filtros ativos
    const hasActiveFilters = advancedFilters.isActive || searchTerm.trim().length > 0;
    const hasAdvancedFilters = advancedFilters.isActive;

    return {
      totalRecords: total,
      filteredCount: filtered.length,
      totalIncome,
      totalExpenses,
      liquidBalance,
      // ✅ NOVO: Estatísticas filtradas
      filteredIncome,
      filteredExpenses,
      filteredBalance,
      categoryStats,
      hasTransactions: total > 0,
      hasFilteredResults: filtered.length > 0,
      isFiltered: searchTerm.trim().length > 0,
      isSorted: sortBy !== 'date' || sortOrder !== 'desc',
      // ✅ NOVO: Status dos filtros
      hasActiveFilters,
      hasAdvancedFilters,
      activeFiltersCount: [
        advancedFilters.dateStart,
        advancedFilters.dateEnd,
        advancedFilters.amountMin,
        advancedFilters.amountMax,
        advancedFilters.selectedCategories.length > 0,
        advancedFilters.selectedTypes.length > 0
      ].filter(Boolean).length
    };
  }, [getFilteredAndSortedTransactions, dailyTransactions, getDailyTotals, searchTerm, sortBy, sortOrder, advancedFilters]);

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

  // Validações do formulário - descrição não é mais obrigatória
  const formValidation = useMemo(() => {
    const hasAmount = newTransaction.amount && parseFloat(newTransaction.amount) > 0;
    const hasValidDate = newTransaction.date && new Date(newTransaction.date).getTime();
    
    return {
      isValid: hasAmount && hasValidDate, // Removida validação de descrição
      hasAmount,
      hasValidDate,
      errors: {
        amount: !hasAmount ? 'Valor é obrigatório e deve ser maior que zero' : null,
        date: !hasValidDate ? 'Data inválida' : null
      }
    };
  }, [newTransaction]);

  // Validações do formulário de edição
  const editFormValidation = useMemo(() => {
    const hasAmount = editTransaction.amount && parseFloat(editTransaction.amount) > 0;
    const hasValidDate = editTransaction.date && new Date(editTransaction.date).getTime();
    
    return {
      isValid: hasAmount && hasValidDate,
      hasAmount,
      hasValidDate,
      errors: {
        amount: !hasAmount ? 'Valor é obrigatório e deve ser maior que zero' : null,
        date: !hasValidDate ? 'Data inválida' : null
      }
    };
  }, [editTransaction]);

  // ✅ NOVO: Opções de filtros rápidos
  const quickFilterOptions = {
    dates: [
      { value: '', label: 'Qualquer período' },
      { value: 'today', label: 'Hoje' },
      { value: 'week', label: 'Última semana' },
      { value: 'month', label: 'Este mês' },
      { value: 'year', label: 'Este ano' }
    ],
    amounts: [
      { value: '', label: 'Qualquer valor' },
      { value: 'small', label: 'Até $100' },
      { value: 'medium', label: '$100 - $1.000' },
      { value: 'large', label: 'Acima de $1.000' }
    ],
    types: [
      { value: 'income', label: 'Entradas' },
      { value: 'expenses', label: 'Saídas' }
    ]
  };

  // ✅ NOVO: Lista de todas as categorias únicas
  const allCategories = useMemo(() => {
    const categoriesSet = new Set();
    
    // Adicionar categorias predefinidas
    [...categories.income, ...categories.expenses].forEach(cat => {
      categoriesSet.add(cat);
    });
    
    // Adicionar categorias usadas nas transações
    Object.values(dailyTransactions).forEach(dayData => {
      [...Object.values(dayData.income || {}), ...Object.values(dayData.expenses || {})].forEach(transaction => {
        if (transaction.category) {
          categoriesSet.add(transaction.category);
        }
      });
    });
    
    return Array.from(categoriesSet).sort();
  }, [categories, dailyTransactions]);

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
          description: transaction.description || '', // Trata descrição vazia
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
          description: transaction.description || '', // Trata descrição vazia
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
    
    // Estados do formulário de nova transação
    newTransaction,
    formValidation,
    
    // Estados do formulário de edição do AppContext
    editTransaction,
    editFormValidation,
    
    // Estados de modal de exclusão
    showDeleteModal,
    transactionToDelete,
    
    // Estados de modal de edição do AppContext
    showEditModal,
    transactionToEdit,
    
    // ✅ NOVO: Estados de filtros avançados
    advancedFilters,
    showAdvancedFilters,
    
    // Estatísticas e dados calculados
    transactionStats,
    todayStats,
    
    // Funções principais
    addTransaction: handleTransactionSubmit,
    updateTransactionField,
    
    // Funções de edição corrigidas
    updateEditTransactionField,
    
    // Funções de busca e ordenação
    updateSearchTerm,
    updateSortCriteria,
    clearSearch,
    resetSort,
    
    // Funções de exclusão
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    
    // Funções de edição corrigidas
    handleEditClick,
    confirmEdit,
    cancelEdit,
    
    // ✅ NOVO: Funções de filtros avançados
    updateAdvancedFilterField,
    applyQuickDateFilter,
    applyQuickAmountFilter,
    handleCategoryToggle,
    handleTypeToggle,
    handleClearAllFilters,
    toggleAdvancedFilters,
    updateAdvancedFilters,
    clearAdvancedFilters,
    
    // Funções utilitárias
    exportToCSV,
    highlightSearchTerm,
    convertTransactionsToList,
    formatCurrency,
    formatDate,
    
    // Opções e dados estáticos
    categories,
    sortOptions,
    // ✅ NOVO: Opções de filtros
    quickFilterOptions,
    allCategories,
    
    // Estados computados úteis
    hasSearchResults: transactionStats.hasFilteredResults,
    isSearching: transactionStats.isFiltered,
    hasTransactions: transactionStats.hasTransactions,
    transactionCount: transactionStats.filteredCount,
    totalTransactionCount: transactionStats.totalRecords,
    // ✅ NOVO: Estados dos filtros
    hasActiveFilters: transactionStats.hasActiveFilters,
    hasAdvancedFilters: transactionStats.hasAdvancedFilters,
    activeFiltersCount: transactionStats.activeFiltersCount
  };
};

export default useTransactions;