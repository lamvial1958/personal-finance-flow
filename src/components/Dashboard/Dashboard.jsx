/**
 * Dashboard Component - Personal Finance Flow
 * Componente principal do painel com resumo, transações, filtros avançados e funcionalidades Fase 1 + Edição
 * 
 * NOVA FUNCIONALIDADE V1.6.0:
 * - Sistema multilínguas completo integrado
 * - Interface traduzida para 6 idiomas
 * - Sistema híbrido de categorias traduzidas
 * - Todas funcionalidades mantidas
 * 
 * CORREÇÃO V1.6.1:
 * - 100% dos textos agora traduzidos
 * - Remoção completa de strings hardcoded
 * - Labels e mensagens internacionalizadas
 * 
 * CORREÇÃO: Integração com categorias dinâmicas do AppContext
 * - Categorias personalizáveis no formulário
 * - Sincronização automática com CategoryManager
 * - Compatibilidade total com sistema
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Dashboard\Dashboard.jsx
 * Versão: V1.6.1 - Multilínguas Completo + Categorias Dinâmicas Integradas
 * ATUALIZAÇÃO: Interface de filtros avançados + componente AdvancedFilters integrado
 * Criado: Setembro 2025
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';
import useTransactions from '../../hooks/useTransactions';
import AdvancedFilters from './AdvancedFilters';

const Dashboard = () => {
  const {
    connectionStatus,
    dailyTransactions,
    investmentMovements,
    getCurrentPatrimony,
    dataVersion,
    // Categorias dinâmicas do AppContext
    categories: dynamicCategories
  } = useApp();

  // Hook de tradução multilínguas
  const { t, translateCategory } = useLanguage();

  const {
    // Estados e dados
    transactions: filteredTransactions,
    searchTerm,
    sortBy,
    sortOrder,
    todayStats,
    transactionStats,
    sortOptions,
    
    // Estados de filtros avançados
    advancedFilters,
    showAdvancedFilters,
    hasActiveFilters,
    hasAdvancedFilters,
    activeFiltersCount,
    
    // Funções de busca e ordenação
    updateSearchTerm,
    updateSortCriteria,
    
    // Funções de transação
    addTransaction: handleTransactionSubmit,
    updateTransactionField,
    newTransaction,
    formValidation,
    
    // Funções de exclusão
    handleDeleteClick,
    
    // Funções de edição
    handleEditClick,
    
    // Funções de filtros avançados
    toggleAdvancedFilters,
    handleClearAllFilters,
    
    // Funções utilitárias
    formatCurrency,
    formatDate,
    highlightSearchTerm,
    hasTransactions,
    transactionCount
  } = useTransactions();

  // Usar APENAS categorias dinâmicas do AppContext
  const categoryOptions = useMemo(() => {
    // Sempre usar categorias dinâmicas - sem fallback
    if (dynamicCategories && dynamicCategories[newTransaction.type]) {
      // Retornar apenas os nomes das categorias (compatibilidade com formato atual)
      return dynamicCategories[newTransaction.type].map(cat => 
        typeof cat === 'string' ? cat : cat.name
      );
    }
    
    // Se não há categorias dinâmicas, retornar array vazio
    return [];
  }, [dynamicCategories, newTransaction.type]);

  // Tradução das opções de ordenação
  const translatedSortOptions = useMemo(() => {
    const sortMapping = {
      'dateDesc': 'dashboard.sortOptions.dateDesc',
      'dateAsc': 'dashboard.sortOptions.dateAsc', 
      'valueDesc': 'dashboard.sortOptions.valueDesc',
      'valueAsc': 'dashboard.sortOptions.valueAsc',
      'categoryAsc': 'dashboard.sortOptions.categoryAsc',
      'categoryDesc': 'dashboard.sortOptions.categoryDesc'
    };
    
    return sortOptions.map(option => ({
      ...option,
      label: sortMapping[option.key] ? t(sortMapping[option.key]) : option.label
    }));
  }, [sortOptions, t]);

  // Logs de debug para verificar integração
  React.useEffect(() => {
    if (dynamicCategories) {
      console.log('🔍 Dashboard - Categorias dinâmicas disponíveis:', dynamicCategories);
      console.log('🔍 Dashboard - Categorias para tipo atual:', categoryOptions);
    }
  }, [dynamicCategories, categoryOptions]);

  // Handlers com useCallback
  const handleTypeChange = useCallback((e) => {
    updateTransactionField('type', e.target.value);
  }, [updateTransactionField]);

  const handleDateChange = useCallback((e) => {
    updateTransactionField('date', e.target.value);
  }, [updateTransactionField]);

  const handleAmountChange = useCallback((e) => {
    updateTransactionField('amount', e.target.value);
  }, [updateTransactionField]);

  const handleCategoryChange = useCallback((e) => {
    updateTransactionField('category', e.target.value);
  }, [updateTransactionField]);

  const handleDescriptionChange = useCallback((e) => {
    updateTransactionField('description', e.target.value);
  }, [updateTransactionField]);

  const handleSearchTermChange = useCallback((e) => {
    updateSearchTerm(e.target.value);
  }, [updateSearchTerm]);

  const handleSortChange = useCallback((e) => {
    updateSortCriteria(e.target.value);
  }, [updateSortCriteria]);

  // Cards de status financeiro
  const StatusCards = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {hasActiveFilters ? `${t('dashboard.revenue')} (${t('dashboard.filtered')})` : `${t('dashboard.revenue')} ${t('dashboard.thisMonth')}`}
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {hasActiveFilters ? formatCurrency(transactionStats.filteredIncome) : formatCurrency(todayStats.income)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {hasActiveFilters ? `${t('dashboard.expenses')} (${t('dashboard.filtered')})` : `${t('dashboard.expenses')} ${t('dashboard.thisMonth')}`}
            </p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {hasActiveFilters ? formatCurrency(transactionStats.filteredExpenses) : formatCurrency(todayStats.expenses)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {hasActiveFilters ? `${t('dashboard.balance')} (${t('dashboard.filtered')})` : t('dashboard.balance')}
            </p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {hasActiveFilters ? formatCurrency(transactionStats.filteredBalance) : formatCurrency(getCurrentPatrimony)}
            </p>
          </div>
        </div>
      </div>
    </div>
  ), [todayStats, getCurrentPatrimony, formatCurrency, hasActiveFilters, transactionStats, t]);

  // Formulário de Nova Transação
  const TransactionForm = useMemo(() => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {t('dashboard.addTransaction')}
      </h3>
      <form onSubmit={handleTransactionSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('dashboard.transactionForm.type')}
            </label>
            <select
              value={newTransaction.type}
              onChange={handleTypeChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="income">{t('dashboard.transactionTypes.income')}</option>
              <option value="expenses">{t('dashboard.transactionTypes.expense')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('dashboard.transactionForm.date')}
            </label>
            <input
              type="date"
              value={newTransaction.date}
              onChange={handleDateChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('dashboard.transactionForm.amount')} *
            </label>
            <input
              key="amount-input" 
              type="number"
              step="0.01"
              min="0.01"
              value={newTransaction.amount}
              onChange={handleAmountChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="0,00"
              required
              autoComplete="off"
            />
            {formValidation.errors.amount && (
              <p className="text-red-500 text-xs mt-1">{formValidation.errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('dashboard.transactionForm.category')}
              {dynamicCategories && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                  {t('configuration.categories.customizable')}
                </span>
              )}
            </label>
            <select
              value={newTransaction.category}
              onChange={handleCategoryChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">{t('dashboard.selectCategory')}</option>
              {categoryOptions.map(cat => (
                <option key={cat} value={cat}>
                  {translateCategory ? translateCategory(cat, newTransaction.type) : cat}
                </option>
              ))}
            </select>
            {process.env.NODE_ENV === 'development' && categoryOptions.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {categoryOptions.length} {t('configuration.categories.customizable').toLowerCase()}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('dashboard.transactionForm.description')}
          </label>
          <input
            key="description-input"
            type="text"
            value={newTransaction.description}
            onChange={handleDescriptionChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder={t('dashboard.transactionForm.description')}
            autoComplete="off"
          />
          {formValidation.errors.description && (
            <p className="text-red-500 text-xs mt-1">{formValidation.errors.description}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!formValidation.isValid}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('dashboard.transactionForm.save')}
        </button>
      </form>
    </div>
  ), [
    newTransaction, 
    categoryOptions, 
    formValidation, 
    handleTransactionSubmit,
    handleTypeChange,
    handleDateChange,
    handleAmountChange,
    handleCategoryChange,
    handleDescriptionChange,
    dynamicCategories,
    t,
    translateCategory
  ]);

  // Controles de busca e ordenação com filtros avançados
  const SearchAndSortControls = useMemo(() => (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('dashboard.showingTransactions', { count: transactionCount, total: transactionCount })}
          </h3>
          
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                {activeFiltersCount} {activeFiltersCount !== 1 ? t('dashboard.activeFiltersPlural') : t('dashboard.activeFilters')}
              </span>
              <button
                onClick={handleClearAllFilters}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
                title={t('dashboard.clearFilters')}
              >
                {t('common.clear')}
              </button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Campo de Busca */}
          <div className="relative">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              key="search-input"
              type="text"
              value={searchTerm}
              onChange={handleSearchTermChange}
              placeholder={t('dashboard.searchPlaceholder')}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              autoComplete="off"
            />
          </div>
          
          {/* Ordenação */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={handleSortChange}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {translatedSortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Botão de filtros avançados */}
          <button
            onClick={toggleAdvancedFilters}
            className={`
              flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors font-medium
              ${showAdvancedFilters
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }
            `}
            title={t('filters.advanced.title')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"/>
            </svg>
            <span className="hidden sm:inline">
              {t('filters.advanced.filters')} {hasAdvancedFilters && `(${activeFiltersCount})`}
            </span>
          </button>
        </div>
      </div>
      
      {/* Componente de filtros avançados */}
      {showAdvancedFilters && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <AdvancedFilters />
        </div>
      )}
    </div>
  ), [
    transactionCount, 
    searchTerm, 
    sortBy, 
    sortOrder, 
    translatedSortOptions,
    handleSearchTermChange,
    handleSortChange,
    showAdvancedFilters,
    toggleAdvancedFilters,
    hasActiveFilters,
    hasAdvancedFilters,
    activeFiltersCount,
    handleClearAllFilters,
    t
  ]);

  // Lista de transações com botão editar
  const TransactionList = () => (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {hasActiveFilters ? (
            <div className="space-y-2">
              <p>{t('dashboard.noTransactionsWithFilters')}</p>
              <button
                onClick={handleClearAllFilters}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline text-sm"
              >
                {t('dashboard.clearFilters')}
              </button>
            </div>
          ) : (
            t('dashboard.noTransactions')
          )}
        </div>
      ) : (
        filteredTransactions.map((transaction) => (
          <div key={`${transaction.date}-${transaction.id}`} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {transaction.type === 'income' ? t('dashboard.transactionTypes.income') : t('dashboard.transactionTypes.expense')}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(transaction.date)}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">ID: {transaction.id}</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-gray-100 mt-1">
                  {searchTerm ? (
                    <span dangerouslySetInnerHTML={{
                      __html: highlightSearchTerm(transaction.description || t('dashboard.noDescription'), searchTerm)
                    }} />
                  ) : (
                    transaction.description || t('dashboard.noDescription')
                  )}
                </p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {searchTerm ? (
                      <span dangerouslySetInnerHTML={{
                        __html: highlightSearchTerm(
                          translateCategory ? translateCategory(transaction.category || t('dashboard.noCategory'), transaction.type) : (transaction.category || t('dashboard.noCategory')), 
                          searchTerm
                        )
                      }} />
                    ) : (
                      translateCategory ? translateCategory(transaction.category || t('dashboard.noCategory'), transaction.type) : (transaction.category || t('dashboard.noCategory'))
                    )}
                  </span>
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              </div>
              
              {/* Botões de Edição e Exclusão */}
              <div className="flex items-center gap-2 ml-4">
                {/* Botão de Edição */}
                <button
                  onClick={() => handleEditClick(
                    transaction.id,
                    transaction.date,
                    transaction.type,
                    transaction.amount,
                    transaction.description || '',
                    transaction.category || ''
                  )}
                  className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                  title={t('dashboard.editTransaction')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>

                {/* Botão de Exclusão */}
                <button
                  onClick={() => handleDeleteClick(
                    transaction.id, 
                    transaction.date, 
                    transaction.type, 
                    transaction.description || t('dashboard.noDescription')
                  )}
                  className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                  title={t('dashboard.deleteTransaction')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  // Resumo de liquidez (memoizado)
  const LiquiditySummary = useMemo(() => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {hasActiveFilters ? t('dashboard.summaryFiltered') : `${t('dashboard.balance')} ${t('dashboard.thisMonth')}`}
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{t('dashboard.totalIncome')}:</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            {hasActiveFilters ? formatCurrency(transactionStats.filteredIncome) : formatCurrency(transactionStats.totalIncome)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{t('dashboard.totalExpenses')}:</span>
          <span className="font-semibold text-red-600 dark:text-red-400">
            {hasActiveFilters ? formatCurrency(transactionStats.filteredExpenses) : formatCurrency(transactionStats.totalExpenses)}
          </span>
        </div>
        <div className="border-t dark:border-gray-700 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {hasActiveFilters ? `${t('dashboard.balanceFiltered')}:` : `${t('dashboard.balance')}:`}
            </span>
            <span className={`font-bold text-lg ${
              (hasActiveFilters ? transactionStats.filteredBalance : transactionStats.liquidBalance) >= 0 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {hasActiveFilters ? formatCurrency(transactionStats.filteredBalance) : formatCurrency(transactionStats.liquidBalance)}
            </span>
          </div>
        </div>
      </div>
    </div>
  ), [transactionStats, formatCurrency, hasActiveFilters, t]);

  // Status do sistema (memoizado)
  const SystemStatus = useMemo(() => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {t('configuration.system.title')}
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{t('configuration.system.type')}:</span>
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-green-600 dark:text-green-400 font-medium">Progressive Web App</span>
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{t('dashboard.database')}:</span>
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-green-600 dark:text-green-400 font-medium">{connectionStatus}</span>
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{t('dashboard.recentTransactions')}:</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            {Object.keys(dailyTransactions).length} {t('dashboard.records')}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{t('patrimony.recentMovements')}:</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            {Object.keys(investmentMovements).length} {t('dashboard.movements')}
          </span>
        </div>
        {dynamicCategories && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">{t('configuration.categories.title')}:</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {(dynamicCategories.income?.length || 0) + (dynamicCategories.expenses?.length || 0)} {t('configuration.categories.customizable').toLowerCase()}
            </span>
          </div>
        )}
        {hasActiveFilters && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">{t('filters.advanced.filters')} {activeFiltersCount !== 1 ? t('dashboard.activeFiltersPlural') : t('dashboard.activeFilters')}:</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">{activeFiltersCount}</span>
          </div>
        )}
      </div>
    </div>
  ), [connectionStatus, dailyTransactions, investmentMovements, hasActiveFilters, activeFiltersCount, dynamicCategories, t]);

  // Render principal
  return (
    <div key={`dashboard-${dataVersion}`} className="space-y-6">
      {/* Cards de Status */}
      {StatusCards}

      {/* Formulário de Nova Transação */}
      {TransactionForm}

      {/* Seção de Transações */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {SearchAndSortControls}
        <TransactionList />
      </div>

      {/* Resumo de Liquidez */}
      {LiquiditySummary}

      {/* Status do Sistema */}
      {SystemStatus}
    </div>
  );
};

// Export memoizado para evitar re-renders desnecessários
export default React.memo(Dashboard);