/**
 * DeleteModal Component - Personal Finance Flow
 * Modal de confirmação para exclusão de transações
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Modals\DeleteModal.jsx
 * Versão: 1.0.0
 * Criado: Setembro 2025
 */

import React from 'react';
import { useApp } from '../../context/AppContext';

const DeleteModal = () => {
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
      console.error('Erro ao excluir transação:', error);
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
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2 text-red-500">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800">
            Excluir Transação
          </h3>
        </div>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            <strong>ID:</strong> {transactionToDelete.id}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Data:</strong> {formatDate(transactionToDelete.date)}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Tipo:</strong> {transactionToDelete.type === 'income' ? 'Entrada' : 'Saída'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Descrição:</strong> {transactionToDelete.description}
          </p>
        </div>

        <p className="text-gray-600 text-center mb-6">
          Esta ação não pode ser desfeita. Deseja realmente excluir esta transação?
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleCancelDelete}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmDelete}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 font-medium transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;