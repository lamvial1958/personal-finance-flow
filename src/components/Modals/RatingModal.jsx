/**
 * RatingModal Component - Personal Finance Flow
 * Modal de solicitação de avaliação GitHub após 30+ dias de uso
 * Sistema Multilínguas + Suporte a Modo Escuro
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Modals\RatingModal.jsx
 * Versão: 1.6.0 - Sistema Multilínguas Integrado
 * Criado: Setembro 2025
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage'; // NOVO: Sistema multilínguas

const RatingModal = () => {
  const { t } = useLanguage(); // NOVO: Hook de tradução
  const {
    showRatingModal,
    setShowRatingModal
  } = useApp();

  // Não renderizar se modal não deve ser exibido
  if (!showRatingModal) {
    return null;
  }

  // Abrir GitHub para avaliação
  const handleOpenGitHub = () => {
    window.open('https://github.com/lamvial1958/personal-finance-flow', '_blank');
  };

  // Abrir GitHub e fechar modal
  const handleOpenGitHubAndClose = () => {
    handleOpenGitHub();
    setShowRatingModal(false);
  };

  // Fechar modal temporariamente
  const handleCloseRating = () => {
    setShowRatingModal(false);
  };

  // Dismiss permanentemente
  const handleDismissPermanently = () => {
    const ratingStatus = JSON.parse(localStorage.getItem('rating_status') || '{}');
    localStorage.setItem('rating_status', JSON.stringify({
      ...ratingStatus,
      dismissed: true
    }));
    setShowRatingModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl transition-colors">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">⭐</div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {t('modals.rating.title')}
          </h3>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          {t('modals.rating.description')}
        </p>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6 border border-yellow-200 dark:border-yellow-800 transition-colors">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t('modals.rating.instructions.clickButton')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {t('modals.rating.instructions.steps')}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleOpenGitHubAndClose}
            className="w-full bg-yellow-600 dark:bg-yellow-700 text-white py-3 rounded hover:bg-yellow-700 dark:hover:bg-yellow-600 font-medium transition-colors"
          >
            ⭐ {t('modals.rating.actions.rateOnGithub')}
          </button>
          
          <button
            onClick={handleCloseRating}
            className="w-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            {t('modals.rating.actions.remindLater')}
          </button>
          
          <button
            onClick={handleDismissPermanently}
            className="w-full text-gray-500 dark:text-gray-400 py-2 text-sm hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            {t('modals.rating.actions.dontShowAgain')}
          </button>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
          {t('modals.rating.footer.timeInfo')}
        </p>
      </div>
    </div>
  );
};

export default RatingModal;