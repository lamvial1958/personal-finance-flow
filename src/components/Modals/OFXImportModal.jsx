/**
 * OFXImportModal Component - Personal Finance Flow
 * Modal de confirmação para importação de arquivos OFX bancários
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Modals\OFXImportModal.jsx
 * Versão: 1.0.0
 * Criado: Setembro 2025
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import dbManager from '../../db-manager.js';

const OFXImportModal = () => {
  const {
    showOFXImportModal,
    ofxImportResults,
    pendingOFXTransactions,
    setShowOFXImportModal,
    setOFXImportResults,
    setPendingOFXTransactions,
    setDailyTransactions,
    setDataVersion
  } = useApp();

  // Não renderizar se modal não deve ser exibido
  if (!showOFXImportModal || !ofxImportResults) {
    return null;
  }

  // Confirmar importação OFX
  const handleConfirmImport = async (importType) => {
    try {
      let transactionsToImport = [];
      
      if (importType === 'all') {
        transactionsToImport = pendingOFXTransactions;
      } else if (importType === 'unique') {
        transactionsToImport = ofxImportResults.unique;
      } else {
        // Cancelado
        handleCancelImport();
        return;
      }
      
      console.log('Importando', transactionsToImport.length, 'transações OFX');
      
      // Salvar no banco
      for (const transaction of transactionsToImport) {
        await dbManager.addTransaction(
          transaction.date,
          transaction.type,
          transaction.amount,
          transaction.description,
          transaction.category
        );
      }
      
      // Recarregar dados
      const freshTransactions = await dbManager.getTransactions();
      
      React.startTransition(() => {
        setDailyTransactions(freshTransactions || {});
        setDataVersion(prev => prev + 1);
      });
      
      // Limpar estado
      setShowOFXImportModal(false);
      setOFXImportResults(null);
      setPendingOFXTransactions([]);
      
      alert(`${transactionsToImport.length} transações importadas com sucesso!`);
      
    } catch (error) {
      console.error('Erro ao confirmar import OFX:', error);
      alert('Erro ao salvar transações importadas: ' + error.message);
    }
  };

  // Cancelar importação
  const handleCancelImport = () => {
    setShowOFXImportModal(false);
    setOFXImportResults(null);
    setPendingOFXTransactions([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl max-h-96 overflow-y-auto">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">📥</div>
          <h3 className="text-lg font-semibold text-gray-800">
            Importação OFX
          </h3>
        </div>
        
        <div className="mb-6">
          <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{ofxImportResults.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{ofxImportResults.uniqueCount}</p>
                <p className="text-sm text-gray-600">Novas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{ofxImportResults.duplicateCount}</p>
                <p className="text-sm text-gray-600">Duplicadas</p>
              </div>
            </div>
          </div>

          {ofxImportResults.duplicateCount > 0 && (
            <div className="bg-orange-50 rounded-lg p-3 mb-4 border border-orange-200">
              <p className="text-sm text-orange-800">
                <strong>Duplicatas encontradas:</strong> {ofxImportResults.duplicateCount} transações 
                já existem no sistema (baseado no ID do banco).
              </p>
            </div>
          )}
          
          {ofxImportResults.uniqueCount > 0 && (
            <div className="bg-green-50 rounded-lg p-3 mb-4 border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Transações novas:</strong> {ofxImportResults.uniqueCount} transações 
                serão adicionadas ao seu sistema.
              </p>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-center mb-6">
          Como você deseja prosseguir com a importação?
        </p>

        <div className="flex flex-col gap-3">
          {ofxImportResults.uniqueCount > 0 && (
            <button
              onClick={() => handleConfirmImport('unique')}
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 font-medium transition-colors"
            >
              📥 Importar Apenas Novas ({ofxImportResults.uniqueCount})
            </button>
          )}
          
          <button
            onClick={() => handleConfirmImport('all')}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-medium transition-colors"
          >
            📥 Importar Todas ({ofxImportResults.total})
          </button>
          
          <button
            onClick={handleCancelImport}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          Transações duplicadas são identificadas pelo ID único do banco (FITID)
        </p>
      </div>
    </div>
  );
};

export default OFXImportModal;