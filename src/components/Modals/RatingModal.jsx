/**
 * RatingModal Component - Personal Finance Flow
 * Modal de solicitação de avaliação GitHub após 30+ dias de uso
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Modals\RatingModal.jsx
 * Versão: 1.0.0
 * Criado: Setembro 2025
 */

import React from 'react';
import { useApp } from '../../context/AppContext';

const RatingModal = () => {
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
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">⭐</div>
          <h3 className="text-lg font-semibold text-gray-800">
            Gostou? Deixe uma ⭐ para ajudar outros a descobrir
          </h3>
        </div>
        
        <p className="text-gray-600 text-center mb-6">
          Você está usando há mais de 30 dias! Se o aplicativo tem sido útil, 
          uma avaliação no GitHub ajuda outras pessoas a encontrá-lo.
        </p>

        <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Clique no botão abaixo e depois na estrela ⭐
            </p>
            <p className="text-xs text-gray-500">
              GitHub → Botão "⭐ Star" → Pronto!
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleOpenGitHubAndClose}
            className="w-full bg-yellow-600 text-white py-3 rounded hover:bg-yellow-700 font-medium transition-colors"
          >
            ⭐ Avaliar no GitHub
          </button>
          
          <button
            onClick={handleCloseRating}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Lembrar mais tarde
          </button>
          
          <button
            onClick={handleDismissPermanently}
            className="w-full text-gray-500 py-2 text-sm hover:text-gray-700 transition-colors"
          >
            Não mostrar novamente
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          Leva apenas 10 segundos e ajuda muito o projeto
        </p>
      </div>
    </div>
  );
};

export default RatingModal;