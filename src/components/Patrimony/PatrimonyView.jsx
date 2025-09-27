/**
 * PatrimonyView Component - Personal Finance Flow
 * Componente para gestão de patrimônio e investimentos
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Patrimony\PatrimonyView.jsx
 * Versão: 1.0.0
 * Criado: Setembro 2025
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const PatrimonyView = () => {
  const {
    initialBalances,
    updateInitialBalances,
    addInvestmentMovement,
    getCurrentPatrimony,
    formatCurrency,
    dataVersion
  } = useApp();

  // Estado local para saldos (cópia editável dos saldos iniciais)
  const [balances, setBalances] = useState(initialBalances);

  // Estado do formulário de nova movimentação
  const [newMovement, setNewMovement] = useState({
    investmentType: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Tipos de investimento disponíveis
  const investmentTypes = [
    'Tesouro Direto', 'CDB', 'LCI/LCA', 'Fundos de Investimento',
    'Ações', 'FIIs', 'Criptomoedas', 'Poupança', 'Outros'
  ];

  // Atualizar saldo de um tipo específico
  const handleBalanceChange = (type, value) => {
    setBalances(prev => ({
      ...prev,
      [type]: parseFloat(value) || 0
    }));
  };

  // Salvar saldos iniciais
  const handleSaveBalances = async () => {
    try {
      await updateInitialBalances(balances);
      alert('Saldos iniciais salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar saldos:', error);
      alert('Erro ao salvar saldos iniciais.');
    }
  };

  // Atualizar campo do formulário de movimentação
  const updateMovementField = (field, value) => {
    setNewMovement(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Submeter nova movimentação
  const handleMovementSubmit = async (e) => {
    e.preventDefault();
    
    if (!newMovement.investmentType || !newMovement.amount) {
      alert('Por favor, preencha tipo de investimento e valor.');
      return;
    }

    const amount = parseFloat(newMovement.amount);
    if (isNaN(amount) || amount === 0) {
      alert('Por favor, insira um valor válido (positivo para aplicação, negativo para resgate).');
      return;
    }

    try {
      await addInvestmentMovement(
        newMovement.date,
        newMovement.investmentType,
        amount,
        newMovement.description
      );
      
      // Limpar formulário após sucesso
      setNewMovement({
        investmentType: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      alert('Movimentação adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar movimentação:', error);
      alert('Erro ao adicionar movimento de investimento.');
    }
  };

  // Validação do formulário de movimentação
  const isMovementFormValid = () => {
    return newMovement.investmentType && 
           newMovement.amount && 
           !isNaN(parseFloat(newMovement.amount)) &&
           parseFloat(newMovement.amount) !== 0 &&
           newMovement.date;
  };

  // Resumo do patrimônio
  const PatrimonyHeader = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo do Patrimônio</h2>
      <div className="text-center">
        <p className="text-3xl font-bold text-purple-600">{formatCurrency(getCurrentPatrimony)}</p>
        <p className="text-gray-600 mt-2">Patrimônio Total</p>
      </div>
    </div>
  );

  // Formulário de saldos iniciais
  const InitialBalancesForm = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Saldos Iniciais por Investimento</h3>
      <div className="space-y-4">
        {investmentTypes.map(type => (
          <div key={type} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">{type}</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={balances[type] || ''}
              onChange={(e) => handleBalanceChange(type, e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0,00"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSaveBalances}
        className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
      >
        Salvar Saldos Iniciais
      </button>
    </div>
  );

  // Formulário de movimentação
  const MovementForm = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Movimentação</h3>
      <form onSubmit={handleMovementSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Investimento</label>
            <select
              value={newMovement.investmentType}
              onChange={(e) => updateMovementField('investmentType', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione...</option>
              {investmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
            <input
              type="date"
              value={newMovement.date}
              onChange={(e) => updateMovementField('date', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor (positivo para aplicação, negativo para resgate)
          </label>
          <input
            type="number"
            step="0.01"
            value={newMovement.amount}
            onChange={(e) => updateMovementField('amount', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0,00"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Use valores positivos para aplicações e negativos para resgates
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
          <input
            type="text"
            value={newMovement.description}
            onChange={(e) => updateMovementField('description', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descrição da movimentação (opcional)"
          />
        </div>

        <button
          type="submit"
          disabled={!isMovementFormValid()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Adicionar Movimentação
        </button>
      </form>
    </div>
  );

  // Informações sobre tipos de investimento
  const InvestmentInfo = () => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-semibold text-blue-800 mb-2">Como usar esta seção</h4>
      <div className="text-sm text-blue-700 space-y-1">
        <p>• Configure os <strong>saldos iniciais</strong> de cada tipo de investimento</p>
        <p>• Use <strong>movimentações</strong> para registrar aplicações e resgates</p>
        <p>• O <strong>patrimônio total</strong> é calculado automaticamente</p>
        <p>• Valores positivos = aplicações | Valores negativos = resgates</p>
      </div>
    </div>
  );

  // Resumo por categoria de investimento
  const InvestmentSummary = () => {
    const summary = investmentTypes.map(type => ({
      type,
      balance: balances[type] || 0,
      hasBalance: (balances[type] || 0) > 0
    })).filter(item => item.hasBalance);

    if (summary.length === 0) {
      return null;
    }

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo por Categoria</h3>
        <div className="space-y-3">
          {summary.map(item => (
            <div key={item.type} className="flex justify-between items-center">
              <span className="text-gray-700">{item.type}:</span>
              <span className="font-semibold text-blue-600">
                {formatCurrency(item.balance)}
              </span>
            </div>
          ))}
          <div className="border-t pt-2 mt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Total Saldos Iniciais:</span>
              <span className="font-bold text-lg text-purple-600">
                {formatCurrency(summary.reduce((sum, item) => sum + item.balance, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render principal
  return (
    <div key={`patrimony-${dataVersion}`} className="space-y-6">
      {/* Resumo do Patrimônio */}
      <PatrimonyHeader />

      {/* Informações sobre como usar */}
      <InvestmentInfo />

      {/* Formulário de Saldos Iniciais */}
      <InitialBalancesForm />

      {/* Resumo por Categoria (só exibe se houver saldos) */}
      <InvestmentSummary />

      {/* Formulário de Movimentação */}
      <MovementForm />
    </div>
  );
};

export default PatrimonyView;