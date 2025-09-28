/**
 * EditModal Component - Personal Finance Flow (VERSÃO LIMPA)
 * Modal de edição auto-gerenciado - dados preenchidos automaticamente
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Modals\EditModal.jsx
 * Versão: 1.5.1 - Versão otimizada sem logs excessivos
 * Atualização: Setembro 2025
 */

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const EditModal = React.memo(() => {
  const {
    formatDate,
    categories,
    showEditModal,
    setShowEditModal,
    transactionToEdit,
    setTransactionToEdit,
    updateTransaction
  } = useApp();

  // Estado local do formulário (auto-gerenciado)
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: '',
    date: ''
  });

  // Popular formulário automaticamente quando transactionToEdit mudar
  useEffect(() => {
    if (showEditModal && transactionToEdit) {
      // Log apenas para operações importantes
      console.log('📝 Editando transação ID:', transactionToEdit.id);
      setFormData({
        type: transactionToEdit.type,
        amount: transactionToEdit.amount.toString(),
        description: transactionToEdit.description || '',
        category: transactionToEdit.category || '',
        date: transactionToEdit.date
      });
    }
  }, [showEditModal, transactionToEdit]);

  // Limpar formulário quando modal fechar
  useEffect(() => {
    if (!showEditModal) {
      setFormData({
        type: 'income',
        amount: '',
        description: '',
        category: '',
        date: ''
      });
    }
  }, [showEditModal]);

  // Handlers para campos do formulário (memoizados para performance)
  const handleTypeChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      type: e.target.value,
      category: '' // Limpar categoria quando mudar tipo
    }));
  }, []);

  const handleDateChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, date: e.target.value }));
  }, []);

  const handleAmountChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, amount: e.target.value }));
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, category: e.target.value }));
  }, []);

  const handleDescriptionChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  }, []);

  // Validação do formulário (memoizada)
  const formValidation = useMemo(() => {
    const hasAmount = formData.amount && parseFloat(formData.amount) > 0;
    const hasValidDate = formData.date && new Date(formData.date).getTime();
    
    return {
      isValid: hasAmount && hasValidDate,
      hasAmount,
      hasValidDate,
      errors: {
        amount: !hasAmount ? 'Valor é obrigatório e deve ser maior que zero' : null,
        date: !hasValidDate ? 'Data inválida' : null
      }
    };
  }, [formData.amount, formData.date]);

  // Opções de categoria baseadas no tipo selecionado (memoizada)
  const categoryOptions = useMemo(() => {
    return categories[formData.type] || [];
  }, [categories, formData.type]);

  // Submeter edição
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!transactionToEdit || !formValidation.isValid) return;

    try {
      const updatedFields = {
        date: formData.date,
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description || '',
        category: formData.category || ''
      };

      console.log('✅ Atualizando transação ID:', transactionToEdit.id, 'com campos:', updatedFields);

      await updateTransaction(transactionToEdit.id, updatedFields);
      
      // Fechar modal e limpar estados
      setShowEditModal(false);
      setTransactionToEdit(null);
      
      console.log('✅ Transação atualizada com sucesso!');
      alert('Transação atualizada com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao editar transação:', error);
      alert('Erro ao atualizar transação: ' + error.message);
    }
  }, [formData, transactionToEdit, formValidation.isValid, updateTransaction, setShowEditModal, setTransactionToEdit]);

  // Cancelar edição
  const handleCancel = useCallback(() => {
    setShowEditModal(false);
    setTransactionToEdit(null);
  }, [setShowEditModal, setTransactionToEdit]);

  // Não renderizar se modal não deve ser exibido
  if (!showEditModal || !transactionToEdit) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl max-h-96 overflow-y-auto">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">✏️</div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Editar Transação
          </h3>
        </div>
        
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <strong>ID:</strong> {transactionToEdit.id}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <strong>Data Original:</strong> {formatDate(transactionToEdit.date)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <strong>Tipo Original:</strong> {transactionToEdit.type === 'income' ? 'Entrada' : 'Saída'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Descrição Original:</strong> {transactionToEdit.description || 'Sem descrição'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo e Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo
              </label>
              <select
                value={formData.type}
                onChange={handleTypeChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="income">Entrada</option>
                <option value="expenses">Saída</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={handleDateChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
              {formValidation.errors.date && (
                <p className="text-red-500 text-xs mt-1">{formValidation.errors.date}</p>
              )}
            </div>
          </div>

          {/* Valor e Categoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
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
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Selecione uma categoria</option>
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={handleDescriptionChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Descrição da transação (opcional)"
              autoComplete="off"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={!formValidation.isValid}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✅ Salvar Alterações
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
          Os gráficos serão atualizados automaticamente após a edição
        </p>
      </div>
    </div>
  );
});

EditModal.displayName = 'EditModal';

export default EditModal;