/**
 * useCharts Hook - Personal Finance Flow
 * Gerencia dados e lógica para gráficos interativos com categorias dinâmicas
 * 
 * CORREÇÃO: Compatibilidade com categorias personalizáveis + Multilínguas
 * - Aceita categorias dinâmicas como parâmetro
 * - Processa corretamente dados de categorias customizadas
 * - Mantém compatibilidade com ChartsView.jsx
 * - Performance otimizada com memoização
 * - Labels de período traduzidos automaticamente
 * 
 * Localização: C:\Personal_Finance_Flow\src\hooks\useCharts.js
 * Versão: Categorias Dinâmicas + Sistema Multilínguas
 * Atualizado: Setembro 2025
 */

import React, { useMemo, useCallback } from 'react';
import { useLanguage } from './useLanguage';

export const useCharts = (transactions = {}, selectedPeriod = '6m', categories = null) => {
  
  // Integração com sistema de tradução
  const { t, language } = useLanguage();
  
  // Opções de período (traduzidas dinamicamente)
  const periodOptions = useMemo(() => [
    { value: '1m', label: t('charts.filters.last1Month') },
    { value: '3m', label: t('charts.filters.last3Months') },
    { value: '6m', label: t('charts.filters.last6Months') },
    { value: '12m', label: t('charts.filters.last12Months') },
    { value: 'all', label: t('charts.filters.allTime') }
  ], [t]);

  // Função para formatar moeda (reutilizável e localizada) com tratamento de erro
  const formatCurrency = useCallback((value) => {
    if (typeof value !== 'number') return '$ 0.00';
    
    let currencyConfig = { code: 'USD', symbol: '$' };
    
    try {
      const stored = localStorage.getItem('vm-finance-currency');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && parsed.code) {
          currencyConfig = parsed;
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar configuração de moeda, usando padrão USD:', error);
    }
    
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: currencyConfig.code
    }).format(value);
  }, [language]);

  // Função para cores dos gráficos baseada no tema
  const getChartColors = useCallback((isDark = false) => {
    if (isDark) {
      return {
        income: '#22C55E',
        expense: '#F87171',
        balance: '#60A5FA',
        evolution: '#A78BFA',
        categories: [
          '#60A5FA',
          '#22C55E',
          '#FBBF24',
          '#F87171',
          '#A78BFA',
          '#22D3EE',
          '#A3E635',
          '#FB923C'
        ]
      };
    } else {
      return {
        income: '#10B981',
        expense: '#EF4444',
        balance: '#3B82F6',
        evolution: '#8B5CF6',
        categories: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#06B6D4',
          '#84CC16',
          '#F97316'
        ]
      };
    }
  }, []);

  // Converter transações do formato Context para array processável
  const processedTransactions = useMemo(() => {
    if (!transactions || typeof transactions !== 'object') {
      return [];
    }

    const result = [];
    
    Object.entries(transactions).forEach(([date, dayData]) => {
      if (dayData && typeof dayData === 'object') {
        if (dayData.income && typeof dayData.income === 'object') {
          Object.entries(dayData.income).forEach(([id, transaction]) => {
            result.push({
              id,
              date,
              type: 'income',
              amount: parseFloat(transaction.amount) || 0,
              description: transaction.description || '',
              category: transaction.category || 'Sem categoria'
            });
          });
        }
        
        if (dayData.expenses && typeof dayData.expenses === 'object') {
          Object.entries(dayData.expenses).forEach(([id, transaction]) => {
            result.push({
              id,
              date,
              type: 'expenses', 
              amount: parseFloat(transaction.amount) || 0,
              description: transaction.description || '',
              category: transaction.category || 'Sem categoria'
            });
          });
        }
      }
    });

    if (result.length > 0) {
      console.log(`📊 useCharts - ${result.length} transações processadas`, {
        receitas: result.filter(t => t.type === 'income').length,
        despesas: result.filter(t => t.type === 'expenses').length,
        categorias: [...new Set(result.map(t => t.category))].length
      });
    }

    return result;
  }, [transactions]);

  // Obter todas as categorias disponíveis
  const availableCategories = useMemo(() => {
    const transactionCategories = [...new Set(
      processedTransactions
        .map(t => t.category)
        .filter(cat => cat && cat !== 'Sem categoria')
    )];

    if (categories) {
      const dynamicCategories = [
        ...(categories.income || []),
        ...(categories.expenses || [])
      ].map(cat => typeof cat === 'string' ? cat : cat.name);

      return [...new Set([...transactionCategories, ...dynamicCategories])];
    }

    return transactionCategories;
  }, [processedTransactions, categories]);

  // Filtrar transações por período
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate;

    switch (selectedPeriod) {
      case '1m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case '3m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case '6m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case '12m':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      case 'all':
        return processedTransactions;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    }

    const filtered = processedTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= now;
    });

    console.log(`📊 useCharts - Filtro ${selectedPeriod}: ${filtered.length} transações no período`);
    return filtered;
  }, [processedTransactions, selectedPeriod]);

  // monthlyData - Evolução mensal
  const monthlyData = useMemo(() => {
    const monthlyDataMap = {};

    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyDataMap[monthKey]) {
        monthlyDataMap[monthKey] = {
          mes: date.toLocaleDateString(language, { month: 'short', year: '2-digit' }),
          receitas: 0,
          despesas: 0,
          saldo: 0
        };
      }

      if (transaction.type === 'income') {
        monthlyDataMap[monthKey].receitas += transaction.amount;
      } else {
        monthlyDataMap[monthKey].despesas += transaction.amount;
      }
    });

    const result = Object.entries(monthlyDataMap)
      .map(([monthKey, data]) => ({
        ...data,
        saldo: data.receitas - data.despesas,
        monthKey
      }))
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));

    console.log(`📊 useCharts - Dados mensais: ${result.length} meses processados`);
    return result;
  }, [filteredTransactions, language]);

  // categoryData - Gastos por categoria
  const categoryData = useMemo(() => {
    const categoryDataMap = {};

    const expenseTransactions = filteredTransactions.filter(transaction => 
      transaction.type === 'expenses' && 
      transaction.category && 
      transaction.category.trim() !== '' &&
      transaction.category !== 'Sem categoria'
    );

    console.log(`📊 useCharts - Despesas com categoria: ${expenseTransactions.length} de ${filteredTransactions.filter(t => t.type === 'expenses').length} despesas`);

    expenseTransactions.forEach(transaction => {
      const category = transaction.category.trim();
      if (!categoryDataMap[category]) {
        categoryDataMap[category] = {
          categoria: category,
          valor: 0,
          transacoes: 0
        };
      }
      categoryDataMap[category].valor += transaction.amount;
      categoryDataMap[category].transacoes += 1;
    });

    const result = Object.values(categoryDataMap)
      .filter(cat => cat.valor > 0)
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 8);

    console.log(`📊 useCharts - Categorias processadas: ${result.length}`, 
      result.map(cat => `${cat.categoria}: ${formatCurrency(cat.valor)}`));

    return result;
  }, [filteredTransactions, formatCurrency]);

  // evolutionData - Evolução patrimonial
  const evolutionData = useMemo(() => {
    let patrimonioAcumulado = 0;

    const result = monthlyData.map(data => {
      patrimonioAcumulado += data.saldo;
      return {
        mes: data.mes,
        patrimonio: patrimonioAcumulado
      };
    });

    console.log(`📊 useCharts - Evolução patrimonial: ${result.length} pontos de dados`);
    return result;
  }, [monthlyData]);

  // Estatísticas adicionais
  const chartStats = useMemo(() => {
    const totalReceitas = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDespesas = filteredTransactions
      .filter(t => t.type === 'expenses')
      .reduce((sum, t) => sum + t.amount, 0);

    const saldoTotal = totalReceitas - totalDespesas;

    return {
      totalReceitas,
      totalDespesas,
      saldoTotal,
      transacoesTotal: filteredTransactions.length,
      mesesAnalisados: monthlyData.length,
      categoriasUnicas: availableCategories.length
    };
  }, [filteredTransactions, monthlyData, availableCategories]);

  // Função de formatação para tooltips
  const formatTooltipValue = useCallback((value, name) => {
    if (typeof value === 'number') {
      return [formatCurrency(value), name];
    }
    return [value, name];
  }, [formatCurrency]);

  // Verificação de dados disponíveis
  const hasData = useMemo(() => {
    const hasTransactions = filteredTransactions.length > 0;
    const hasCategories = categoryData.length > 0;
    
    console.log(`📊 useCharts - Verificação de dados: transações=${hasTransactions}, categorias=${hasCategories}`);
    return hasTransactions;
  }, [filteredTransactions, categoryData]);

  const hasMonthlyData = monthlyData.length > 0;
  const hasCategoryData = categoryData.length > 0;

  // Debug do estado atual
  React.useEffect(() => {
    if (categories) {
      console.log('📊 useCharts - Categorias dinâmicas recebidas:', {
        income: categories.income?.length || 0,
        expenses: categories.expenses?.length || 0,
        available: availableCategories.length
      });
    }
  }, [categories, availableCategories]);

  // RETORNO COMPATÍVEL COM CHARTVIEW
  return {
    // Dados principais
    monthlyData,
    categoryData, 
    evolutionData,
    
    // Configurações
    periodOptions,
    formatCurrency,
    getChartColors,
    
    // Estatísticas adicionais
    chartStats,
    
    // Utilitários
    formatTooltipValue,
    hasData,
    hasMonthlyData,
    hasCategoryData,
    
    // Informações sobre categorias
    availableCategories,
    
    // Estado atual
    selectedPeriod,
    totalTransactions: filteredTransactions.length
  };
};

export default useCharts;