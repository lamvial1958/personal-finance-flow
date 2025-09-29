/**
 * OFXImportModal Component - Personal Finance Flow
 * Modal de confirmação para importação de arquivos OFX bancários
 * Sistema Multilínguas + Suporte a Modo Escuro
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Modals\OFXImportModal.jsx
 * Versão: Sistema Multilínguas Integrado
 * Criado: Setembro 2025
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage'; // NOVO: Sistema multilínguas
import dbManager from '../../db-manager.js';

const OFXImportModal = () => {
  const { t } = useLanguage(); // NOVO: Hook de tradução
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
      
      console.log('Importing', transactionsToImport.length, 'OFX transactions');
      
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
      
      alert(t('modals.ofxImport.messages.importSuccess', { count: transactionsToImport.length }));
      
    } catch (error) {
      console.error('OFX import confirmation error:', error);
      alert(t('modals.ofxImport.messages.importError') + ': ' + error.message);
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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full shadow-xl max-h-96 overflow-y-auto transition-colors">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">📥</div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {t('modals.ofxImport.title')}
          </h3>
        </div>
        
        <div className="mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-800 transition-colors">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{ofxImportResults.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('modals.ofxImport.stats.total')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{ofxImportResults.uniqueCount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('modals.ofxImport.stats.new')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{ofxImportResults.duplicateCount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('modals.ofxImport.stats.duplicates')}</p>
              </div>
            </div>
          </div>

          {ofxImportResults.duplicateCount > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 mb-4 border border-orange-200 dark:border-orange-800 transition-colors">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                <strong>{t('modals.ofxImport.warnings.duplicatesFound')}:</strong> {
                  t('modals.ofxImport.warnings.duplicatesDescription', { count: ofxImportResults.duplicateCount })
                }
              </p>
            </div>
          )}
          
          {ofxImportResults.uniqueCount > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-4 border border-green-200 dark:border-green-800 transition-colors">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>{t('modals.ofxImport.info.newTransactions')}:</strong> {
                  t('modals.ofxImport.info.newTransactionsDescription', { count: ofxImportResults.uniqueCount })
                }
              </p>
            </div>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          {t('modals.ofxImport.question')}
        </p>

        <div className="flex flex-col gap-3">
          {ofxImportResults.uniqueCount > 0 && (
            <button
              onClick={() => handleConfirmImport('unique')}
              className="w-full bg-green-600 dark:bg-green-700 text-white py-3 rounded hover:bg-green-700 dark:hover:bg-green-600 font-medium transition-colors"
            >
              📥 {t('modals.ofxImport.actions.importOnlyNew', { count: ofxImportResults.uniqueCount })}
            </button>
          )}
          
          <button
            onClick={() => handleConfirmImport('all')}
            className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded hover:bg-blue-700 dark:hover:bg-blue-600 font-medium transition-colors"
          >
            📥 {t('modals.ofxImport.actions.importAll', { count: ofxImportResults.total })}
          </button>
          
          <button
            onClick={handleCancelImport}
            className="w-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            {t('common.cancel')}
          </button>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
          {t('modals.ofxImport.footer.duplicateInfo')}
        </p>
      </div>
    </div>
  );
};

export default OFXImportModal;