/**
 * useCharts Hook - Personal Finance Flow
 * Gerencia dados e lógica para gráficos interativos com categorias dinâmicas
 * 
 * CORREÇÃO: Compatibilidade com categorias personalizáveis
 * - Aceita categorias dinâmicas como parâmetro
 * - Processa corretamente dados de categorias customizadas
 * - Mantém compatibilidade com ChartsView.jsx
 * - Performance otimizada com memoização
 * 
 * Localização: C:\Personal_Finance_Flow\src\hooks\useCharts.js
 * Versão: Categorias Dinâmicas Integradas
 * Atualizado: Setembro 2025
 */

import React, { useMemo, useCallback } from 'react';

export const useCharts = (transactions = {}, selectedPeriod = '6m', categories = null) => {
  
  // Opções de período (mantidas do hook original)
  const periodOptions = [
    { value: '1m', label: '1 Mês' },
    { value: '3m', label: '3 Meses' },
    { value: '6m', label: '6 Meses' },
    { value: '12m', label: '12 Meses' },
    { value: 'all', label: 'Todos' }
  ];

  // Função para formatar moeda (reutilizável)
  const formatCurrency = useCallback((value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }, []);

  // Função para cores dos gráficos baseada no tema
  const getChartColors = useCallback((isDark = false) => {
    if (isDark) {
      return {
        income: '#22C55E',     // green-500 mais brilhante para dark mode
        expense: '#F87171',    // red-400 mais suave para dark mode  
        balance: '#60A5FA',    // blue-400 mais suave para dark mode
        evolution: '#A78BFA',  // violet-400 mais suave para dark mode
        categories: [
          '#60A5FA', // blue-400
          '#22C55E', // green-500
          '#FBBF24', // amber-400
          '#F87171', // red-400
          '#A78BFA', // violet-400
          '#22D3EE', // cyan-400
          '#A3E635', // lime-400
          '#FB923C'  // orange-400
        ]
      };
    } else {
      return {
        income: '#10B981',     // green-500
        expense: '#EF4444',    // red-500
        balance: '#3B82F6',    // blue-500
        evolution: '#8B5CF6',  // violet-500
        categories: [
          '#3B82F6', // blue-500
          '#10B981', // green-500
          '#F59E0B', // amber-500
          '#EF4444', // red-500
          '#8B5CF6', // violet-500
          '#06B6D4', // cyan-500
          '#84CC16', // lime-500
          '#F97316'  // orange-500
        ]
      };
    }
  }, []);

  // ✅ CORREÇÃO: Converter transações do formato Context para array processável
  const processedTransactions = useMemo(() => {
    if (!transactions || typeof transactions !== 'object') {
      return [];
    }

    const result = [];
    
    // Se transactions é um objeto com datas como chaves
    Object.entries(transactions).forEach(([date, dayData]) => {
      if (dayData && typeof dayData === 'object') {
        // Processar receitas
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
        
        // Processar despesas
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

    // ✅ NOVO: Log de debug para verificar transações processadas
    if (result.length > 0) {
      console.log(`📊 useCharts - ${result.length} transações processadas`, {
        receitas: result.filter(t => t.type === 'income').length,
        despesas: result.filter(t => t.type === 'expenses').length,
        categorias: [...new Set(result.map(t => t.category))].length
      });
    }

    return result;
  }, [transactions]);

  // ✅ NOVO: Obter todas as categorias disponíveis (dinâmicas + das transações)
  const availableCategories = useMemo(() => {
    // Começar com categorias das transações existentes
    const transactionCategories = [...new Set(
      processedTransactions
        .map(t => t.category)
        .filter(cat => cat && cat !== 'Sem categoria')
    )];

    // Se temos categorias dinâmicas, incluí-las
    if (categories) {
      const dynamicCategories = [
        ...(categories.income || []),
        ...(categories.expenses || [])
      ].map(cat => typeof cat === 'string' ? cat : cat.name);

      // Combinar e remover duplicatas
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

  // DADOS PARA CHARTVIEW (nomes compatíveis)
  
  // monthlyData - Evolução mensal
  const monthlyData = useMemo(() => {
    const monthlyDataMap = {};

    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyDataMap[monthKey]) {
        monthlyDataMap[monthKey] = {
          mes: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
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

    // Calcular saldo e ordenar por data
    const result = Object.entries(monthlyDataMap)
      .map(([monthKey, data]) => ({
        ...data,
        saldo: data.receitas - data.despesas,
        monthKey
      }))
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));

    console.log(`📊 useCharts - Dados mensais: ${result.length} meses processados`);
    return result;
  }, [filteredTransactions]);

  // ✅ CORRIGIDO: categoryData - Gastos por categoria com verificação aprimorada
  const categoryData = useMemo(() => {
    const categoryDataMap = {};

    // Filtrar apenas despesas com categoria válida
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
      .filter(cat => cat.valor > 0) // Só categorias com valor > 0
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 8); // Top 8 categorias

    console.log(`📊 useCharts - Categorias processadas: ${result.length}`, 
      result.map(cat => `${cat.categoria}: R$ ${cat.valor.toFixed(2)}`));

    return result;
  }, [filteredTransactions]);

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

  // ✅ CORREÇÃO: Verificação de dados disponíveis mais rigorosa
  const hasData = useMemo(() => {
    const hasTransactions = filteredTransactions.length > 0;
    const hasCategories = categoryData.length > 0;
    
    console.log(`📊 useCharts - Verificação de dados: transações=${hasTransactions}, categorias=${hasCategories}`);
    return hasTransactions;
  }, [filteredTransactions, categoryData]);

  const hasMonthlyData = monthlyData.length > 0;
  const hasCategoryData = categoryData.length > 0;

  // ✅ NOVO: Debug do estado atual
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
    // Dados principais (nomes exatos esperados pelo ChartsView)
    monthlyData,
    categoryData, 
    evolutionData,
    
    // Configurações (nomes exatos esperados pelo ChartsView)
    periodOptions,
    formatCurrency,
    getChartColors,
    
    // Estatísticas adicionais
    chartStats,
    
    // Utilitários
    formatTooltipValue,
    hasData,
    hasMonthlyData,
    hasCategoryData, // ✅ NOVO: Estado específico para dados de categoria
    
    // ✅ NOVO: Informações sobre categorias
    availableCategories,
    
    // Estado atual
    selectedPeriod,
    totalTransactions: filteredTransactions.length
  };
};

export default useCharts;