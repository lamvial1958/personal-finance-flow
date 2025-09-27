/**
 * AdvancedFilters Component - Personal Finance Flow
 * Componente de filtros avançados para análise detalhada de transações
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Dashboard\AdvancedFilters.jsx
 * Versão: 1.5.0 - Filtros avançados V1.5.0
 * Criado: Setembro 2025
 */

import React, { useCallback, useMemo } from 'react';
import useTransactions from '../../hooks/useTransactions';

const AdvancedFilters = () => {
  const {
    // Estados de filtros avançados
    advancedFilters,
    allCategories,
    quickFilterOptions,
    
    // Funções de filtros avançados
    updateAdvancedFilterField,
    applyQuickDateFilter,
    applyQuickAmountFilter,
    handleCategoryToggle,
    handleTypeToggle,
    clearAdvancedFilters,
    
    // Utilitários
    formatCurrency
  } = useTransactions();

  // Handlers otimizados com useCallback
  const handleDateStartChange = useCallback((e) => {
    updateAdvancedFilterField('dateStart', e.target.value);
  }, [updateAdvancedFilterField]);

  const handleDateEndChange = useCallback((e) => {
    updateAdvancedFilterField('dateEnd', e.target.value);
  }, [updateAdvancedFilterField]);

  const handleAmountMinChange = useCallback((e) => {
    updateAdvancedFilterField('amountMin', e.target.value);
  }, [updateAdvancedFilterField]);

  const handleAmountMaxChange = useCallback((e) => {
    updateAdvancedFilterField('amountMax', e.target.value);
  }, [updateAdvancedFilterField]);

  const handleQuickDateFilter = useCallback((e) => {
    applyQuickDateFilter(e.target.value);
  }, [applyQuickDateFilter]);

  const handleQuickAmountFilter = useCallback((e) => {
    applyQuickAmountFilter(e.target.value);
  }, [applyQuickAmountFilter]);

  // Validação de datas
  const dateValidation = useMemo(() => {
    const { dateStart, dateEnd } = advancedFilters;
    if (!dateStart || !dateEnd) return { isValid: true, error: null };
    
    const start = new Date(dateStart);
    const end = new Date(dateEnd);
    
    if (start > end) {
      return {
        isValid: false,
        error: 'Data inicial deve ser anterior à data final'
      };
    }
    
    return { isValid: true, error: null };
  }, [advancedFilters.dateStart, advancedFilters.dateEnd]);

  // Validação de valores
  const amountValidation = useMemo(() => {
    const { amountMin, amountMax } = advancedFilters;
    if (!amountMin || !amountMax) return { isValid: true, error: null };
    
    const min = parseFloat(amountMin);
    const max = parseFloat(amountMax);
    
    if (min > max) {
      return {
        isValid: false,
        error: 'Valor mínimo deve ser menor que o máximo'
      };
    }
    
    return { isValid: true, error: null };
  }, [advancedFilters.amountMin, advancedFilters.amountMax]);

  // Seção de filtros por período
  const DateFilters = useMemo(() => (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        Filtrar por Período
      </h4>
      
      {/* Filtros rápidos de data */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
          Períodos Rápidos
        </label>
        <select
          value=""
          onChange={handleQuickDateFilter}
          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {quickFilterOptions.dates.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Filtros personalizados de data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Data Inicial
          </label>
          <input
            type="date"
            value={advancedFilters.dateStart}
            onChange={handleDateStartChange}
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Data Final
          </label>
          <input
            type="date"
            value={advancedFilters.dateEnd}
            onChange={handleDateEndChange}
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      
      {/* Erro de validação de data */}
      {!dateValidation.isValid && (
        <p className="text-red-500 text-xs mt-1">{dateValidation.error}</p>
      )}
    </div>
  ), [
    advancedFilters.dateStart,
    advancedFilters.dateEnd,
    quickFilterOptions.dates,
    handleDateStartChange,
    handleDateEndChange,
    handleQuickDateFilter,
    dateValidation
  ]);

  // Seção de filtros por valor
  const AmountFilters = useMemo(() => (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
        </svg>
        Filtrar por Valor
      </h4>
      
      {/* Filtros rápidos de valor */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
          Faixas Rápidas
        </label>
        <select
          value=""
          onChange={handleQuickAmountFilter}
          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {quickFilterOptions.amounts.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Filtros personalizados de valor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Valor Mínimo
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={advancedFilters.amountMin}
            onChange={handleAmountMinChange}
            placeholder="0.00"
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Valor Máximo
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={advancedFilters.amountMax}
            onChange={handleAmountMaxChange}
            placeholder="0.00"
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      
      {/* Erro de validação de valor */}
      {!amountValidation.isValid && (
        <p className="text-red-500 text-xs mt-1">{amountValidation.error}</p>
      )}
    </div>
  ), [
    advancedFilters.amountMin,
    advancedFilters.amountMax,
    quickFilterOptions.amounts,
    handleAmountMinChange,
    handleAmountMaxChange,
    handleQuickAmountFilter,
    amountValidation
  ]);

  // Seção de filtros por tipo
  const TypeFilters = useMemo(() => (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>
        Tipo de Transação
      </h4>
      
      <div className="space-y-2">
        {quickFilterOptions.types.map(type => (
          <label
            key={type.value}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={advancedFilters.selectedTypes.includes(type.value)}
              onChange={() => handleTypeToggle(type.value)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className={`text-sm font-medium ${
              type.value === 'income' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {type.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  ), [advancedFilters.selectedTypes, quickFilterOptions.types, handleTypeToggle]);

  // Seção de filtros por categoria
  const CategoryFilters = useMemo(() => (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
        Categorias
        {advancedFilters.selectedCategories.length > 0 && (
          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
            {advancedFilters.selectedCategories.length} selecionada{advancedFilters.selectedCategories.length !== 1 ? 's' : ''}
          </span>
        )}
      </h4>
      
      {allCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3">
          {allCategories.map(category => (
            <label
              key={category}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={advancedFilters.selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
                {category}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          Nenhuma categoria disponível
        </p>
      )}
    </div>
  ), [allCategories, advancedFilters.selectedCategories, handleCategoryToggle]);

  // Resumo dos filtros ativos
  const FilterSummary = useMemo(() => {
    const activeFilters = [];
    
    if (advancedFilters.dateStart && advancedFilters.dateEnd) {
      activeFilters.push(`Período: ${advancedFilters.dateStart} a ${advancedFilters.dateEnd}`);
    } else if (advancedFilters.dateStart) {
      activeFilters.push(`A partir de: ${advancedFilters.dateStart}`);
    } else if (advancedFilters.dateEnd) {
      activeFilters.push(`Até: ${advancedFilters.dateEnd}`);
    }
    
    if (advancedFilters.amountMin && advancedFilters.amountMax) {
      activeFilters.push(`Valor: $${advancedFilters.amountMin} - $${advancedFilters.amountMax}`);
    } else if (advancedFilters.amountMin) {
      activeFilters.push(`Mín: $${advancedFilters.amountMin}`);
    } else if (advancedFilters.amountMax) {
      activeFilters.push(`Máx: $${advancedFilters.amountMax}`);
    }
    
    if (advancedFilters.selectedTypes.length > 0) {
      const typeLabels = advancedFilters.selectedTypes.map(type => 
        type === 'income' ? 'Entradas' : 'Saídas'
      ).join(', ');
      activeFilters.push(`Tipos: ${typeLabels}`);
    }
    
    if (advancedFilters.selectedCategories.length > 0) {
      if (advancedFilters.selectedCategories.length <= 3) {
        activeFilters.push(`Categorias: ${advancedFilters.selectedCategories.join(', ')}`);
      } else {
        activeFilters.push(`Categorias: ${advancedFilters.selectedCategories.length} selecionadas`);
      }
    }
    
    return activeFilters;
  }, [advancedFilters]);

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Filtros Avançados
        </h3>
        
        {advancedFilters.isActive && (
          <button
            onClick={clearAdvancedFilters}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Limpar Todos
          </button>
        )}
      </div>

      {/* Grid de filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Filtros de Data */}
        <div className="space-y-4">
          {DateFilters}
        </div>

        {/* Filtros de Valor */}
        <div className="space-y-4">
          {AmountFilters}
        </div>

        {/* Filtros de Tipo */}
        <div className="space-y-4">
          {TypeFilters}
        </div>

        {/* Filtros de Categoria */}
        <div className="space-y-4">
          {CategoryFilters}
        </div>
      </div>

      {/* Resumo dos filtros ativos */}
      {FilterSummary.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Filtros Aplicados:
          </h4>
          <div className="flex flex-wrap gap-2">
            {FilterSummary.map((filter, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full"
              >
                {filter}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mensagem quando nenhum filtro está ativo */}
      {!advancedFilters.isActive && (
        <div className="text-center py-6 border-t border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configure os filtros acima para refinar sua análise de transações
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(AdvancedFilters);