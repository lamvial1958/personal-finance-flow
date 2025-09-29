/**
 * PatrimonyView Component - Personal Finance Flow
 * Componente para gestão de patrimônio e investimentos
 * 
 * CORREÇÃO V1.6.1:
 * - 100% dos textos agora traduzidos
 * - Integração completa com sistema i18n
 * - Tipos de investimento traduzidos
 * - Mensagens de validação internacionalizadas
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Patrimony\PatrimonyView.jsx
 * Versão: 1.6.1 - Multilínguas Completo
 * Criado: Setembro 2025
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';

const PatrimonyView = () => {
  const {
    initialBalances,
    updateInitialBalances,
    addInvestmentMovement,
    getCurrentPatrimony,
    formatCurrency,
    dataVersion
  } = useApp();

  const { t } = useLanguage();

  // Estado local para saldos (cópia editável dos saldos iniciais)
  const [balances, setBalances] = useState(initialBalances);

  // Estado do formulário de nova movimentação
  const [newMovement, setNewMovement] = useState({
    investmentType: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Tipos de investimento disponíveis - traduzidos
  const investmentTypes = [
    { key: 'treasuryDirect', label: t('patrimony.investmentTypes.treasuryDirect') },
    { key: 'cdb', label: t('patrimony.investmentTypes.cdb') },
    { key: 'lciLca', label: t('patrimony.investmentTypes.lciLca') },
    { key: 'investmentFunds', label: t('patrimony.investmentTypes.investmentFunds') },
    { key: 'stocks', label: t('patrimony.investmentTypes.stocks') },
    { key: 'fiis', label: t('patrimony.investmentTypes.fiis') },
    { key: 'crypto', label: t('patrimony.investmentTypes.crypto') },
    { key: 'savings', label: t('patrimony.investmentTypes.savings') },
    { key: 'others', label: t('patrimony.investmentTypes.others') }
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
      alert(t('patrimony.messages.saveSuccess'));
    } catch (error) {
      console.error('Erro ao salvar saldos:', error);
      alert(t('patrimony.messages.saveError'));
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
      alert(t('patrimony.messages.fillRequired'));
      return;
    }

    const amount = parseFloat(newMovement.amount);
    if (isNaN(amount) || amount === 0) {
      alert(t('patrimony.messages.invalidAmount'));
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
      
      alert(t('patrimony.messages.movementSuccess'));
    } catch (error) {
      console.error('Erro ao adicionar movimentação:', error);
      alert(t('patrimony.messages.movementError'));
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {t('patrimony.summary')}
      </h2>
      <div className="text-center">
        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
          {formatCurrency(getCurrentPatrimony)}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t('patrimony.totalPatrimony')}
        </p>
      </div>
    </div>
  );

  // Formulário de saldos iniciais
  const InitialBalancesForm = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {t('patrimony.initialBalances')}
      </h3>
      <div className="space-y-4">
        {investmentTypes.map(type => (
          <div key={type.key} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {type.label}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={balances[type.key] || ''}
              onChange={(e) => handleBalanceChange(type.key, e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="0,00"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSaveBalances}
        className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium"
      >
        {t('patrimony.saveInitialBalances')}
      </button>
    </div>
  );

  // Formulário de movimentação
  const MovementForm = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {t('patrimony.addMovement')}
      </h3>
      <form onSubmit={handleMovementSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('patrimony.investmentType')}
            </label>
            <select
              value={newMovement.investmentType}
              onChange={(e) => updateMovementField('investmentType', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            >
              <option value="">{t('patrimony.selectPlaceholder')}</option>
              {investmentTypes.map(type => (
                <option key={type.key} value={type.key}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('patrimony.date')}
            </label>
            <input
              type="date"
              value={newMovement.date}
              onChange={(e) => updateMovementField('date', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('patrimony.amount')}
          </label>
          <input
            type="number"
            step="0.01"
            value={newMovement.amount}
            onChange={(e) => updateMovementField('amount', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="0,00"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t('patrimony.amountHint')}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('patrimony.description')}
          </label>
          <input
            type="text"
            value={newMovement.description}
            onChange={(e) => updateMovementField('description', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder={t('patrimony.descriptionPlaceholder')}
          />
        </div>

        <button
          type="submit"
          disabled={!isMovementFormValid()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('patrimony.addMovement')}
        </button>
      </form>
    </div>
  );

  // Informações sobre tipos de investimento
  const InvestmentInfo = () => (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
        {t('patrimony.howToUse.title')}
      </h4>
      <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
        <p>• {t('patrimony.howToUse.step1')}</p>
        <p>• {t('patrimony.howToUse.step2')}</p>
        <p>• {t('patrimony.howToUse.step3')}</p>
        <p>• {t('patrimony.howToUse.step4')}</p>
      </div>
    </div>
  );

  // Resumo por categoria de investimento
  const InvestmentSummary = () => {
    const summary = investmentTypes.map(type => ({
      type: type.label,
      key: type.key,
      balance: balances[type.key] || 0,
      hasBalance: (balances[type.key] || 0) > 0
    })).filter(item => item.hasBalance);

    if (summary.length === 0) {
      return null;
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {t('patrimony.categoryBreakdown')}
        </h3>
        <div className="space-y-3">
          {summary.map(item => (
            <div key={item.key} className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">{item.type}:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {formatCurrency(item.balance)}
              </span>
            </div>
          ))}
          <div className="border-t dark:border-gray-700 pt-2 mt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {t('patrimony.totalInitialBalances')}
              </span>
              <span className="font-bold text-lg text-purple-600 dark:text-purple-400">
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