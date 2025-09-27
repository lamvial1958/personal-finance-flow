/**
 * Dashboard Component - Personal Finance Flow
 * Componente principal do painel com resumo, transações e funcionalidades Fase 1
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Dashboard\Dashboard.jsx
 * Versão: 1.1.0 - CORRIGIDO para Vite 7.x (problema de perda de foco resolvido)
 * ATUALIZAÇÃO: Campo descrição tornado opcional
 * Criado: Setembro 2025
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import useTransactions from '../../hooks/useTransactions';

const Dashboard = () => {
  const {
    connectionStatus,
    dailyTransactions,
    investmentMovements,
    getCurrentPatrimony,
    dataVersion
  } = useApp();

  const {
    // Estados e dados
    transactions: filteredTransactions,
    searchTerm,
    sortBy,
    sortOrder,
    todayStats,
    transactionStats,
    categories,
    sortOptions,
    
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
    
    // Funções utilitárias
    formatCurrency,
    formatDate,
    highlightSearchTerm,
    hasTransactions,
    transactionCount
  } = useTransactions();

  // ✅ CORREÇÃO CRÍTICA: useCallback para prevenir re-criação de funções
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

  // ✅ CORREÇÃO: Memoizar opções de categoria para evitar re-renders
  const categoryOptions = useMemo(() => {
    return categories[newTransaction.type] || [];
  }, [categories, newTransaction.type]);

  // Cards de status financeiro
  const StatusCards = useMemo(() => (
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
            <p className="text-2xl font-bold text-green-600">{formatCurrency(todayStats.income)}</p>
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
            <p className="text-2xl font-bold text-red-600">{formatCurrency(todayStats.expenses)}</p>
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
  ), [todayStats, getCurrentPatrimony, formatCurrency]);

  // ✅ CORREÇÃO: Formulário de nova transação memoizado
  const TransactionForm = useMemo(() => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova Transação</h3>
      <form onSubmit={handleTransactionSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={newTransaction.type}
              onChange={handleTypeChange}
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
              onChange={handleDateChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valor *</label>
            <input
              key="amount-input" 
              type="number"
              step="0.01"
              min="0.01"
              value={newTransaction.amount}
              onChange={handleAmountChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0,00"
              required
              autoComplete="off"
            />
            {formValidation.errors.amount && (
              <p className="text-red-500 text-xs mt-1">{formValidation.errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <select
              value={newTransaction.category}
              onChange={handleCategoryChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione uma categoria</option>
              {categoryOptions.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
          <input
            key="description-input"
            type="text"
            value={newTransaction.description}
            onChange={handleDescriptionChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descrição da transação (opcional)"
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
          Adicionar Transação
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
    handleDescriptionChange
  ]);

  // ✅ CORREÇÃO: Controles de busca e ordenação memoizados
  const SearchAndSortControls = useMemo(() => (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Transações Recentes ({transactionCount})
      </h3>
      
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
            placeholder="Buscar por descrição ou categoria"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-64"
            autoComplete="off"
          />
        </div>
        
        {/* Ordenação */}
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={handleSortChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  ), [
    transactionCount, 
    searchTerm, 
    sortBy, 
    sortOrder, 
    sortOptions,
    handleSearchTermChange,
    handleSortChange
  ]);

  // Lista de transações (mantida igual - não precisa memoização pois já é otimizada)
  const TransactionList = () => (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'Nenhuma transação encontrada para esta busca.' : 'Nenhuma transação encontrada.'}
        </div>
      ) : (
        filteredTransactions.map((transaction) => (
          <div key={`${transaction.date}-${transaction.id}`} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
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
                      __html: highlightSearchTerm(transaction.description || 'Sem descrição', searchTerm)
                    }} />
                  ) : (
                    transaction.description || 'Sem descrição'
                  )}
                </p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-600">
                    {searchTerm ? (
                      <span dangerouslySetInnerHTML={{
                        __html: highlightSearchTerm(transaction.category || 'Sem categoria', searchTerm)
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
                  transaction.description || 'Sem descrição'
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
  );

  // Resumo de liquidez (memoizado)
  const LiquiditySummary = useMemo(() => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Liquidez Mensal</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total de entradas:</span>
          <span className="font-semibold text-green-600">{formatCurrency(transactionStats.totalIncome)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Saídas totais:</span>
          <span className="font-semibold text-red-600">{formatCurrency(transactionStats.totalExpenses)}</span>
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-900 font-medium">Saldo Liquidez:</span>
            <span className={`font-bold text-lg ${transactionStats.liquidBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(transactionStats.liquidBalance)}
            </span>
          </div>
        </div>
      </div>
    </div>
  ), [transactionStats, formatCurrency]);

  // Status do sistema (memoizado)
  const SystemStatus = useMemo(() => (
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
  ), [connectionStatus, dailyTransactions, investmentMovements]);

  // Render principal
  return (
    <div key={`dashboard-${dataVersion}`} className="space-y-6">
      {/* Cards de Status */}
      {StatusCards}

      {/* Formulário de Nova Transação */}
      {TransactionForm}

      {/* Seção de Transações */}
      <div className="bg-white rounded-lg shadow p-6">
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

// ✅ CORREÇÃO FINAL: Export memoizado para evitar re-renders desnecessários
export default React.memo(Dashboard);