/**
 * DonationModal Component - Personal Finance Flow
 * Modal de solicitação de doação baseado no tempo de uso
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Modals\DonationModal.jsx
 * Versão: 1.0.0
 * Criado: Setembro 2025
 */

import React from 'react';
import { useApp } from '../../context/AppContext';

const DonationModal = () => {
  const {
    showDonationModal,
    donationStage,
    setShowDonationModal
  } = useApp();

  // Não renderizar se modal não deve ser exibido
  if (!showDonationModal) {
    return null;
  }

  // Copiar PIX para clipboard
  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText('lamvial@outlook.com');
      alert('PIX copiado para a área de transferência!');
    } catch (err) {
      // Fallback para navegadores que não suportam clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = 'lamvial@outlook.com';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('PIX copiado para a área de transferência!');
    }
  };

  // Copiar PIX e fechar modal
  const handleCopyPixAndClose = () => {
    handleCopyPix();
    setShowDonationModal(false);
  };

  // Fechar modal temporariamente
  const handleCloseDonation = () => {
    setShowDonationModal(false);
  };

  // Dismiss permanentemente
  const handleDismissPermanently = () => {
    const donations = JSON.parse(localStorage.getItem('donation_status') || '{}');
    localStorage.setItem('donation_status', JSON.stringify({
      ...donations,
      [`day${donationStage}_dismissed`]: true
    }));
    setShowDonationModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">💙</div>
          <h3 className="text-lg font-semibold text-gray-800">
            {donationStage === 60 ? 'Você está usando há 2 meses!' : 'Você está usando há 3 meses!'}
          </h3>
        </div>
        
        <p className="text-gray-600 text-center mb-6">
          Se você está gostando do programa, ajude a mantê-lo e melhorá-lo. 
          A doação de qualquer valor ajuda no desenvolvimento de novas funcionalidades.
        </p>

        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">PIX:</p>
              <p className="font-mono text-lg font-semibold text-blue-800">
                lamvial@outlook.com
              </p>
            </div>
            <button
              onClick={handleCopyPix}
              className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Copiar
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleCopyPixAndClose}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 font-medium transition-colors"
          >
            💚 Obrigado, vou considerar!
          </button>
          
          <button
            onClick={handleCloseDonation}
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
          Este app é totalmente gratuito e seus dados ficam no seu dispositivo
        </p>
      </div>
    </div>
  );
};

export default DonationModal;