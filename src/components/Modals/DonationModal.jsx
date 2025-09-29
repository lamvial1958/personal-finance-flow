/**
 * DonationModal Component - Personal Finance Flow
 * Modal de solicitação de doação baseado no tempo de uso
 * Sistema Multilínguas + Suporte a Modo Escuro + Híbrido PIX/IBAN
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Modals\DonationModal.jsx
 * Versão: 1.6.0 - Sistema Multilínguas Integrado
 * Criado: Setembro 2025
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';

const DonationModal = () => {
  const { t, currentLanguage } = useLanguage();
  const {
    showDonationModal,
    donationStage,
    setShowDonationModal
  } = useApp();

  // Estado para controlar qual método de pagamento está visível
  const [showingMethod, setShowingMethod] = useState(
    currentLanguage === 'pt' ? 'pix' : 'international'
  );

  // Não renderizar se modal não deve ser exibido
  if (!showDonationModal) {
    return null;
  }

  // Copiar PIX para clipboard
  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText('lamvial@outlook.com');
      alert(t('modals.donation.messages.pixCopied'));
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = 'lamvial@outlook.com';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(t('modals.donation.messages.pixCopied'));
    }
  };

  // Copiar IBAN para clipboard
  const handleCopyIBAN = async () => {
    try {
      await navigator.clipboard.writeText('BE18 9675 2559 4765');
      alert(t('modals.donation.messages.ibanCopied'));
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = 'BE18 9675 2559 4765';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(t('modals.donation.messages.ibanCopied'));
    }
  };

  // Copiar e fechar modal
  const handleCopyAndClose = () => {
    if (showingMethod === 'pix') {
      handleCopyPix();
    } else {
      handleCopyIBAN();
    }
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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl transition-colors">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">💙</div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {donationStage === 60 
              ? t('modals.donation.titles.twoMonths') 
              : t('modals.donation.titles.threeMonths')
            }
          </h3>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
          {t('modals.donation.description')}
        </p>

        {/* Toggle entre PIX e Internacional */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowingMethod('pix')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
              showingMethod === 'pix'
                ? 'bg-blue-600 text-white dark:bg-blue-700'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            🇧🇷 PIX (Brasil)
          </button>
          <button
            onClick={() => setShowingMethod('international')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
              showingMethod === 'international'
                ? 'bg-blue-600 text-white dark:bg-blue-700'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            🌍 {t('modals.donation.payment.international')}
          </button>
        </div>

        {/* Método PIX */}
        {showingMethod === 'pix' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800 transition-colors">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {t('modals.donation.pix.label')}:
                </p>
                <p className="font-mono text-lg font-semibold text-blue-800 dark:text-blue-200">
                  lamvial@outlook.com
                </p>
              </div>
              <button
                onClick={handleCopyPix}
                className="w-full bg-blue-600 dark:bg-blue-700 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                {t('modals.donation.actions.copy')} PIX
              </button>
            </div>
          </div>
        )}

        {/* Método Internacional */}
        {showingMethod === 'international' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800 transition-colors">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {t('modals.donation.iban.label')}:
                </p>
                <p className="font-mono text-sm font-semibold text-blue-800 dark:text-blue-200 break-all">
                  BE18 9675 2559 4765
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Swift/BIC:
                </p>
                <p className="font-mono text-sm font-semibold text-blue-800 dark:text-blue-200">
                  TRWIBEB1XXX
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {t('modals.donation.iban.accountHolder')}:
                </p>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Luiz Antonio Machado Vial
                </p>
              </div>
              <button
                onClick={handleCopyIBAN}
                className="w-full bg-blue-600 dark:bg-blue-700 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                {t('modals.donation.actions.copy')} IBAN
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {t('modals.donation.iban.currencies')}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={handleCopyAndClose}
            className="w-full bg-green-600 dark:bg-green-700 text-white py-3 rounded hover:bg-green-700 dark:hover:bg-green-600 font-medium transition-colors"
          >
            💚 {t('modals.donation.actions.thankYou')}
          </button>
          
          <button
            onClick={handleCloseDonation}
            className="w-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            {t('modals.donation.actions.remindLater')}
          </button>
          
          <button
            onClick={handleDismissPermanently}
            className="w-full text-gray-500 dark:text-gray-400 py-2 text-sm hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            {t('modals.donation.actions.dontShowAgain')}
          </button>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
          {t('modals.donation.footer.appInfo')}
        </p>
      </div>
    </div>
  );
};

export default DonationModal;