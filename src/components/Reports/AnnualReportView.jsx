/**
 * AnnualReportView Component - Personal Finance Flow
 * Componente para geração e visualização de relatórios anuais
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Reports\AnnualReportView.jsx
 * Versão: 1.1.0 - CORRIGIDO: Database timing issue + Modo Escuro
 * Criado: Setembro 2025
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import dbManager from '../../db-manager.js';

const AnnualReportView = () => {
  const {
    selectedYear,
    setSelectedYear,
    formatCurrency,
    dataVersion
  } = useApp();

  const { isDark } = useTheme();

  // Estado local do componente
  const [reportData, setReportData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Anos disponíveis para seleção
  const availableYears = [2025, 2024, 2023, 2022, 2021, 2020];

  // Nomes dos meses
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // ✅ CORREÇÃO CRÍTICA: Gerar relatório com verificação de inicialização
  const generateReport = async (year) => {
    setLoadingReport(true);
    setReportError(null);
    
    try {
      // ✅ NOVA VERIFICAÇÃO: Aguardar inicialização do database
      if (!dbManager.isInitialized) {
        console.log('⏳ Database não inicializado, inicializando...');
        setIsInitializing(true);
        await dbManager.initialize();
        setIsInitializing(false);
      }

      // ✅ VERIFICAÇÃO ADICIONAL: Garantir que database existe
      if (!dbManager.db) {
        throw new Error('Database não está disponível. Tente recarregar a página.');
      }
      
      const data = await dbManager.getAnnualReport(year);
      setReportData(data);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      setIsInitializing(false);
      
      // ✅ MENSAGEM DE ERRO MAIS ESPECÍFICA
      if (error.message.includes('prepare')) {
        setReportError('Sistema inicializando. Aguarde alguns segundos e tente novamente.');
      } else {
        setReportError('Erro ao gerar relatório anual. Tente novamente.');
      }
      setReportData(null);
    } finally {
      setLoadingReport(false);
      setIsInitializing(false);
    }
  };

  // Efeito para gerar relatório quando year mudar
  useEffect(() => {
    generateReport(selectedYear);
  }, [selectedYear, dataVersion]);

  // Atualizar ano selecionado
  const handleYearChange = (year) => {
    setSelectedYear(parseInt(year));
  };

  // Cabeçalho com seletor de ano (COM TEMA)
  const ReportHeader = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">
          Relatório Anual {selectedYear}
        </h2>
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>
  );

  // Cards de resumo (COM TEMA)
  const SummaryCards = () => {
    if (!reportData) return null;

    const { summary } = reportData;
    const netBalance = summary.totalIncome - summary.totalExpenses;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">Receitas Totais</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors">
            {formatCurrency(summary.totalIncome)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">Despesas Totais</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 transition-colors">
            {formatCurrency(summary.totalExpenses)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">Saldo Líquido</h3>
          <p className={`text-2xl font-bold transition-colors ${
            netBalance >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(netBalance)}
          </p>
        </div>
      </div>
    );
  };

  // Tabela de evolução mensal (COM TEMA)
  const MonthlyTable = () => {
    if (!reportData) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors">Evolução Mensal</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700 transition-colors">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors">
                  Mês
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors">
                  Receitas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors">
                  Despesas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors">
                  Saldo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors">
                  Investimentos
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors">
              {Object.entries(reportData.monthlyData).map(([month, data]) => {
                const monthIndex = parseInt(month) - 1;
                const monthName = monthNames[monthIndex];
                const balance = data.income - data.expenses;
                
                return (
                  <tr key={month} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors">
                      {monthName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 transition-colors">
                      {formatCurrency(data.income)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400 transition-colors">
                      {formatCurrency(data.expenses)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium transition-colors ${
                      balance >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(balance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400 transition-colors">
                      {formatCurrency(data.investmentMovements)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ✅ Estado de loading MELHORADO (COM TEMA)
  const LoadingState = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      <span className="ml-2 text-gray-600 dark:text-gray-400 transition-colors">
        {isInitializing ? 'Inicializando sistema...' : 'Gerando relatório...'}
      </span>
    </div>
  );

  // Estado de erro (COM TEMA)
  const ErrorState = () => (
    <div className="text-center py-12">
      <div className="text-4xl mb-4 text-red-500 dark:text-red-400">⚠️</div>
      <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors">{reportError}</p>
      <button
        onClick={() => generateReport(selectedYear)}
        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Tentar Novamente
      </button>
    </div>
  );

  // Estado vazio (sem dados) (COM TEMA)
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="text-4xl mb-4 text-gray-400 dark:text-gray-500">📊</div>
      <p className="text-gray-600 dark:text-gray-400 mb-2 transition-colors">Nenhum dado encontrado para {selectedYear}</p>
      <p className="text-sm text-gray-500 dark:text-gray-500 transition-colors">
        Adicione algumas transações para gerar relatórios
      </p>
    </div>
  );

  // Informações sobre o relatório (COM TEMA)
  const ReportInfo = () => (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-colors">
      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 transition-colors">Como interpretar o relatório</h4>
      <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1 transition-colors">
        <p>• <strong>Receitas:</strong> Todas as entradas registradas no ano</p>
        <p>• <strong>Despesas:</strong> Todas as saídas registradas no ano</p>
        <p>• <strong>Saldo:</strong> Diferença entre receitas e despesas mensais</p>
        <p>• <strong>Investimentos:</strong> Movimentações de aplicações e resgates</p>
      </div>
    </div>
  );

  // Estatísticas adicionais (COM TEMA)
  const AdditionalStats = () => {
    if (!reportData || !reportData.summary) return null;

    const { summary, monthlyData } = reportData;
    const monthsWithData = Object.values(monthlyData).filter(m => m.income > 0 || m.expenses > 0).length;
    const avgMonthlyIncome = monthsWithData > 0 ? summary.totalIncome / monthsWithData : 0;
    const avgMonthlyExpenses = monthsWithData > 0 ? summary.totalExpenses / monthsWithData : 0;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors">Estatísticas Adicionais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Meses com Dados</p>
            <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 transition-colors">{monthsWithData}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Média Mensal Receitas</p>
            <p className="text-xl font-semibold text-green-600 dark:text-green-400 transition-colors">{formatCurrency(avgMonthlyIncome)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Média Mensal Despesas</p>
            <p className="text-xl font-semibold text-red-600 dark:text-red-400 transition-colors">{formatCurrency(avgMonthlyExpenses)}</p>
          </div>
        </div>
      </div>
    );
  };

  // Verificar se há dados para exibir
  const hasReportData = reportData && reportData.summary && 
    (reportData.summary.totalIncome > 0 || reportData.summary.totalExpenses > 0);

  // ✅ RENDER PRINCIPAL COM TEMA
  return (
    <div key={`report-${dataVersion}-${selectedYear}`} className="space-y-6">
      {/* Cabeçalho */}
      <ReportHeader />

      {/* Informações sobre o relatório */}
      <ReportInfo />

      {/* Conteúdo baseado no estado */}
      {(loadingReport || isInitializing) && <LoadingState />}
      
      {reportError && !loadingReport && !isInitializing && <ErrorState />}
      
      {!loadingReport && !isInitializing && !reportError && !hasReportData && <EmptyState />}
      
      {!loadingReport && !isInitializing && !reportError && hasReportData && (
        <>
          {/* Cards de Resumo */}
          <SummaryCards />

          {/* Estatísticas Adicionais */}
          <AdditionalStats />

          {/* Tabela Mensal */}
          <MonthlyTable />
        </>
      )}
    </div>
  );
};

export default AnnualReportView;