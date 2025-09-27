import React, { useState, useMemo } from 'react';
import { useCharts } from '../../hooks/useCharts';
import { useTheme } from '../../hooks/useTheme';
import { useApp } from '../../context/AppContext';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ChartsView = () => {
  const { dailyTransactions } = useApp();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('12m');

  // Verificação defensiva e debugging
  const transactions = dailyTransactions || {};
  
  // Debug logs para verificar estrutura de dados
  console.log('🔍 ChartsView DEBUG - dailyTransactions:', dailyTransactions);
  console.log('🔍 ChartsView DEBUG - transactions type:', typeof transactions);
  console.log('🔍 ChartsView DEBUG - transactions keys:', Object.keys(transactions));
  console.log('🔍 ChartsView DEBUG - sample transaction:', Object.values(transactions)[0]);

  const {
    monthlyData,
    categoryData,
    evolutionData,
    periodOptions,
    formatCurrency,
    getChartColors,
    hasData
  } = useCharts(transactions, selectedPeriod);

  const isDark = theme === 'dark';
  const colors = getChartColors(isDark);

  // Estado de loading/sem dados
  if (!hasData) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            Nenhum dado encontrado
          </h2>
          <p className={`text-lg mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Adicione algumas transações para ver os gráficos
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Vá para o Painel e adicione receitas ou despesas, ou importe dados OFX
          </p>
        </div>
      </div>
    );
  }

  // Dados formatados para diferentes gráficos com verificação defensiva
  const formattedMonthlyData = useMemo(() => {
    if (!monthlyData || !Array.isArray(monthlyData)) {
      console.log('⚠️ ChartsView - monthlyData não é array:', monthlyData);
      return [];
    }
    
    return monthlyData.map(item => ({
      ...item,
      receitas: parseFloat(item.receitas) || 0,
      despesas: Math.abs(parseFloat(item.despesas)) || 0,
      saldo: parseFloat(item.saldo) || 0
    }));
  }, [monthlyData]);

  const formattedCategoryData = useMemo(() => {
    if (!categoryData || !Array.isArray(categoryData)) {
      console.log('⚠️ ChartsView - categoryData não é array:', categoryData);
      return [];
    }
    
    return categoryData.filter(item => item.valor > 0).map(item => ({
      ...item,
      valor: Math.abs(parseFloat(item.valor))
    }));
  }, [categoryData]);

  // Componente do Tooltip customizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`
          p-3 rounded-lg shadow-lg border
          ${isDark 
            ? 'bg-gray-800 border-gray-600 text-gray-100' 
            : 'bg-white border-gray-200 text-gray-900'
          }
        `}>
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Componente de filtros de período
  const PeriodFilters = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {periodOptions.map(option => (
        <button
          key={option.value}
          onClick={() => setSelectedPeriod(option.value)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${selectedPeriod === option.value
              ? isDark
                ? 'bg-blue-600 text-white'
                : 'bg-blue-500 text-white'
              : isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  // Componente de abas
  const TabNavigation = () => {
    const tabs = [
      { id: 'overview', label: 'Visão Geral', icon: '📊' },
      { id: 'trends', label: 'Tendências', icon: '📈' },
      { id: 'categories', label: 'Categorias', icon: '🥧' },
      { id: 'evolution', label: 'Evolução', icon: '📉' }
    ];

    return (
      <div className="flex flex-wrap gap-1 mb-6 p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
              ${activeTab === tab.id
                ? isDark
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'bg-white text-gray-900 shadow-sm'
                : isDark
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    );
  };

  // Gráfico de visão geral (Receitas vs Despesas)
  const OverviewChart = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de linha mensal */}
        <div className={`
          p-6 rounded-xl shadow-sm border
          ${isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
          }
        `}>
          <h3 className={`
            text-lg font-semibold mb-4
            ${isDark ? 'text-gray-100' : 'text-gray-900'}
          `}>
            Receitas vs Despesas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedMonthlyData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? '#374151' : '#e5e7eb'} 
              />
              <XAxis 
                dataKey="mes" 
                stroke={isDark ? '#9ca3af' : '#6b7280'}
                fontSize={12}
              />
              <YAxis 
                stroke={isDark ? '#9ca3af' : '#6b7280'}
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="receitas"
                stroke={colors.income}
                strokeWidth={2}
                name="Receitas"
                dot={{ fill: colors.income, strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="despesas"
                stroke={colors.expense}
                strokeWidth={2}
                name="Despesas"
                dot={{ fill: colors.expense, strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de barras do saldo */}
        <div className={`
          p-6 rounded-xl shadow-sm border
          ${isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
          }
        `}>
          <h3 className={`
            text-lg font-semibold mb-4
            ${isDark ? 'text-gray-100' : 'text-gray-900'}
          `}>
            Saldo Mensal
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formattedMonthlyData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? '#374151' : '#e5e7eb'} 
              />
              <XAxis 
                dataKey="mes" 
                stroke={isDark ? '#9ca3af' : '#6b7280'}
                fontSize={12}
              />
              <YAxis 
                stroke={isDark ? '#9ca3af' : '#6b7280'}
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="saldo"
                name="Saldo"
                fill={colors.balance}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // Gráfico de categorias (Pizza)
  const CategoriesChart = () => (
    <div className={`
      p-6 rounded-xl shadow-sm border
      ${isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
      }
    `}>
      <h3 className={`
        text-lg font-semibold mb-4
        ${isDark ? 'text-gray-100' : 'text-gray-900'}
      `}>
        Gastos por Categoria
      </h3>
      
      {formattedCategoryData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={formattedCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="valor"
              >
                {formattedCategoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors.categories[index % colors.categories.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Valor']}
                labelStyle={{ color: isDark ? '#f3f4f6' : '#111827' }}
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {formattedCategoryData.map((item, index) => (
              <div
                key={item.categoria}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: colors.categories[index % colors.categories.length] }}
                  />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {item.categoria}
                  </span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(item.valor)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum dado de categoria encontrado para o período selecionado
          </p>
        </div>
      )}
    </div>
  );

  // Gráfico de evolução patrimonial
  const EvolutionChart = () => (
    <div className={`
      p-6 rounded-xl shadow-sm border
      ${isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
      }
    `}>
      <h3 className={`
        text-lg font-semibold mb-4
        ${isDark ? 'text-gray-100' : 'text-gray-900'}
      `}>
        Evolução Patrimonial
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={evolutionData}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDark ? '#374151' : '#e5e7eb'} 
          />
          <XAxis 
            dataKey="mes" 
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            fontSize={12}
          />
          <YAxis 
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="patrimonio"
            stroke={colors.evolution}
            fill={colors.evolution}
            fillOpacity={0.3}
            name="Patrimônio Acumulado"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  // Renderizar conteúdo baseado na aba ativa
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewChart />;
      case 'trends':
        return <OverviewChart />; // Mesmo que overview por agora
      case 'categories':
        return <CategoriesChart />;
      case 'evolution':
        return <EvolutionChart />;
      default:
        return <OverviewChart />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`
            text-2xl font-bold
            ${isDark ? 'text-gray-100' : 'text-gray-900'}
          `}>
            Análise Gráfica
          </h1>
          <p className={`
            mt-1 text-sm
            ${isDark ? 'text-gray-400' : 'text-gray-500'}
          `}>
            Visualize suas finanças através de gráficos interativos
          </p>
        </div>
        
        {/* Estatísticas rápidas */}
        <div className="flex gap-4">
          <div className={`
            px-4 py-2 rounded-lg text-center
            ${isDark ? 'bg-gray-800' : 'bg-gray-50'}
          `}>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Transações</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {Object.keys(transactions).length || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros de período */}
      <PeriodFilters />

      {/* Navegação por abas */}
      <TabNavigation />

      {/* Conteúdo do gráfico ativo */}
      <div className="min-h-[500px]">
        {renderActiveTab()}
      </div>

      {/* Footer com informações */}
      <div className={`
        text-xs text-center py-4 border-t
        ${isDark 
          ? 'text-gray-500 border-gray-700' 
          : 'text-gray-400 border-gray-200'
        }
      `}>
        Dados baseados nas suas transações importadas • Período: {selectedPeriod} • 
        Atualizados em tempo real
      </div>
    </div>
  );
};

export default ChartsView;