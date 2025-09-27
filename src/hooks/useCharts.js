/**
 * useCharts Hook - Personal Finance Flow (Refatorado)
 * Gerencia dados e lógica para gráficos interativos
 * 
 * COMPATIBILIDADE: ChartsView.jsx
 * Interface ajustada para aceitar (transactions, selectedPeriod)
 * 
 * Localização: C:\Personal_Finance_Flow\src\hooks\useCharts.js
 * Versão: 1.1.0 - Compatível com ChartsView
 * Atualizado: Setembro 2025
 */

import { useMemo, useCallback } from 'react';

export const useCharts = (transactions = [], selectedPeriod = '6m') => {
  
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

  // Converter transações do formato Context para array processável
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

    return result;
  }, [transactions]);

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

    return processedTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= now;
    });
  }, [processedTransactions, selectedPeriod]);

  // DADOS PARA CHARTVIEW (nomes compatíveis)
  
  // monthlyData - Evolução mensal (era monthlyEvolutionData)
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
    return Object.entries(monthlyDataMap)
      .map(([monthKey, data]) => ({
        ...data,
        saldo: data.receitas - data.despesas,
        monthKey
      }))
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }, [filteredTransactions]);

  // categoryData - Gastos por categoria (era expensesByCategoryData)
  const categoryData = useMemo(() => {
    const categoryDataMap = {};

    filteredTransactions
      .filter(transaction => transaction.type === 'expenses')
      .forEach(transaction => {
        const category = transaction.category || 'Sem categoria';
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

    return Object.values(categoryDataMap)
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 8); // Top 8 categorias
  }, [filteredTransactions]);

  // evolutionData - Evolução patrimonial (era patrimonialEvolutionData)
  const evolutionData = useMemo(() => {
    let patrimonioAcumulado = 0;

    return monthlyData.map(data => {
      patrimonioAcumulado += data.saldo;
      return {
        mes: data.mes,
        patrimonio: patrimonioAcumulado
      };
    });
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
      mesesAnalisados: monthlyData.length
    };
  }, [filteredTransactions, monthlyData]);

  // Função de formatação para tooltips
  const formatTooltipValue = useCallback((value, name) => {
    if (typeof value === 'number') {
      return [formatCurrency(value), name];
    }
    return [value, name];
  }, [formatCurrency]);

  // Verificação de dados disponíveis
  const hasData = filteredTransactions.length > 0;
  const hasMonthlyData = monthlyData.length > 0;

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
    
    // Estado atual
    selectedPeriod,
    totalTransactions: filteredTransactions.length
  };
};

export default useCharts;