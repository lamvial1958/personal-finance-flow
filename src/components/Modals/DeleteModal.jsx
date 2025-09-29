/**
 * DeleteModal Component - Personal Finance Flow
 * Modal de confirmação para exclusão de transações
 * Sistema Multilínguas + Suporte a Modo Escuro
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Modals\DeleteModal.jsx
 * Versão: 1.6.0 - Sistema Multilínguas Integrado
 * Criado: Setembro 2025
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage'; // NOVO: Sistema multilínguas

const DeleteModal = () => {
  const { t } = useLanguage(); // NOVO: Hook de tradução
  const {
    showDeleteModal,
    transactionToDelete,
    setShowDeleteModal,
    setTransactionToDelete,
    deleteTransaction,
    formatDate
  } = useApp();

  // Não renderizar se modal não deve ser exibido
  if (!showDeleteModal || !transactionToDelete) {
    return null;
  }

  // Confirmar exclusão
  const handleConfirmDelete = async () => {
    try {
      await deleteTransaction(transactionToDelete.id);
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    } catch (error) {
      console.error('Transaction deletion error:', error);
      // Erro já é tratado no hook/context
    }
  };

  // Cancelar exclusão
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTransactionToDelete(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl transition-colors">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2 text-red-500">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {t('modals.delete.title')}
          </h3>
        </div>
        
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <strong>{t('modals.delete.fields.id')}:</strong> {transactionToDelete.id}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <strong>{t('modals.delete.fields.date')}:</strong> {formatDate(transactionToDelete.date)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <strong>{t('modals.delete.fields.type')}:</strong> {
              transactionToDelete.type === 'income' 
                ? t('dashboard.transactionTypes.income')
                : t('dashboard.transactionTypes.expense')
            }
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>{t('modals.delete.fields.description')}:</strong> {
              transactionToDelete.description || t('common.noDescription')
            }
          </p>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          {t('modals.delete.confirmMessage')}
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleCancelDelete}
            className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleConfirmDelete}
            className="flex-1 bg-red-600 dark:bg-red-700 text-white py-2 rounded hover:bg-red-700 dark:hover:bg-red-600 font-medium transition-colors"
          >
            {t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;