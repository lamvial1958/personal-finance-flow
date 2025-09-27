/**
 * useModals Hook - Personal Finance Flow
 * Gerencia todos os modais da aplicação (doação, avaliação, etc.)
 * 
 * Localização: C:\Personal_Finance_Flow\src\hooks\useModals.js
 * Versão: 1.0.0
 * Criado: Setembro 2025
 */

import { useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';

export const useModals = () => {
  const {
    // Estados de modais
    showDonationModal, setShowDonationModal,
    donationStage, setDonationStage,
    showRatingModal, setShowRatingModal,
    
    // Estado de autenticação (para triggers automáticos)
    isAuthenticated
  } = useApp();

  // Verificar status de doação
  const checkDonationStatus = useCallback(() => {
    const firstUse = localStorage.getItem('app_first_use');
    const donations = JSON.parse(localStorage.getItem('donation_status') || '{}');
    
    if (!firstUse) {
      localStorage.setItem('app_first_use', new Date().toISOString());
      return;
    }

    const firstUseDate = new Date(firstUse);
    const daysSinceFirstUse = Math.floor((new Date() - firstUseDate) / (1000 * 60 * 60 * 24));
    
    // Verificar aviso de 60 dias
    if (daysSinceFirstUse >= 60 && !donations.day60_dismissed) {
      const lastShown60 = donations.day60_last_shown ? new Date(donations.day60_last_shown) : null;
      if (!lastShown60 || (new Date() - lastShown60) / (1000 * 60 * 60 * 24) >= 7) {
        setDonationStage(60);
        setShowDonationModal(true);
        localStorage.setItem('donation_status', JSON.stringify({
          ...donations,
          day60_last_shown: new Date().toISOString()
        }));
      }
    }
    // Verificar aviso de 90 dias
    else if (daysSinceFirstUse >= 90 && !donations.day90_dismissed) {
      const lastShown90 = donations.day90_last_shown ? new Date(donations.day90_last_shown) : null;
      if (!lastShown90 || (new Date() - lastShown90) / (1000 * 60 * 60 * 24) >= 7) {
        setDonationStage(90);
        setShowDonationModal(true);
        localStorage.setItem('donation_status', JSON.stringify({
          ...donations,
          day90_last_shown: new Date().toISOString()
        }));
      }
    }
  }, [setDonationStage, setShowDonationModal]);

  // Verificar status de avaliação GitHub
  const checkRatingStatus = useCallback(() => {
    const firstUse = localStorage.getItem('app_first_use');
    const ratingStatus = JSON.parse(localStorage.getItem('rating_status') || '{}');
    
    if (!firstUse) return;

    const firstUseDate = new Date(firstUse);
    const daysSinceFirstUse = Math.floor((new Date() - firstUseDate) / (1000 * 60 * 60 * 24));
    
    // Mostrar após 30 dias, se não foi dismissed e não foi mostrado recentemente
    if (daysSinceFirstUse >= 30 && !ratingStatus.dismissed) {
      const lastShown = ratingStatus.last_shown ? new Date(ratingStatus.last_shown) : null;
      if (!lastShown || (new Date() - lastShown) / (1000 * 60 * 60 * 24) >= 7) {
        setShowRatingModal(true);
        localStorage.setItem('rating_status', JSON.stringify({
          ...ratingStatus,
          last_shown: new Date().toISOString()
        }));
      }
    }
  }, [setShowRatingModal]);

  // Dismiss modal de doação permanentemente
  const dismissDonationPermanently = useCallback(() => {
    const donations = JSON.parse(localStorage.getItem('donation_status') || '{}');
    localStorage.setItem('donation_status', JSON.stringify({
      ...donations,
      [`day${donationStage}_dismissed`]: true
    }));
    setShowDonationModal(false);
  }, [donationStage, setShowDonationModal]);

  // Dismiss modal de avaliação permanentemente
  const dismissRatingPermanently = useCallback(() => {
    const ratingStatus = JSON.parse(localStorage.getItem('rating_status') || '{}');
    localStorage.setItem('rating_status', JSON.stringify({
      ...ratingStatus,
      dismissed: true
    }));
    setShowRatingModal(false);
  }, [setShowRatingModal]);

  // Fechar modal de doação temporariamente
  const closeDonationModal = useCallback(() => {
    setShowDonationModal(false);
  }, [setShowDonationModal]);

  // Fechar modal de avaliação temporariamente
  const closeRatingModal = useCallback(() => {
    setShowRatingModal(false);
  }, [setShowRatingModal]);

  // Abrir GitHub para avaliação
  const openGitHubRating = useCallback(() => {
    window.open('https://github.com/lamvial1958/personal-finance-flow', '_blank');
  }, []);

  // Copiar PIX para clipboard
  const copyPixToClipboard = useCallback(async () => {
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
  }, []);

  // Copiar PIX e fechar modal
  const copyPixAndClose = useCallback(() => {
    copyPixToClipboard();
    setShowDonationModal(false);
  }, [copyPixToClipboard, setShowDonationModal]);

  // Abrir GitHub e fechar modal
  const openGitHubAndClose = useCallback(() => {
    openGitHubRating();
    setShowRatingModal(false);
  }, [openGitHubRating, setShowRatingModal]);

  // Obter informações sobre o tempo de uso
  const getUsageInfo = useCallback(() => {
    const firstUse = localStorage.getItem('app_first_use');
    if (!firstUse) return null;

    const firstUseDate = new Date(firstUse);
    const daysSinceFirstUse = Math.floor((new Date() - firstUseDate) / (1000 * 60 * 60 * 24));
    
    return {
      firstUse: firstUseDate,
      daysSinceFirstUse,
      shouldShowDonation60: daysSinceFirstUse >= 60,
      shouldShowDonation90: daysSinceFirstUse >= 90,
      shouldShowRating: daysSinceFirstUse >= 30
    };
  }, []);

  // Obter status de dismissals
  const getDismissalStatus = useCallback(() => {
    const donations = JSON.parse(localStorage.getItem('donation_status') || '{}');
    const rating = JSON.parse(localStorage.getItem('rating_status') || '{}');
    
    return {
      donation60Dismissed: donations.day60_dismissed || false,
      donation90Dismissed: donations.day90_dismissed || false,
      ratingDismissed: rating.dismissed || false,
      donation60LastShown: donations.day60_last_shown,
      donation90LastShown: donations.day90_last_shown,
      ratingLastShown: rating.last_shown
    };
  }, []);

  // Resetar todos os status (útil para desenvolvimento/teste)
  const resetAllModalStatus = useCallback(() => {
    localStorage.removeItem('donation_status');
    localStorage.removeItem('rating_status');
    // Manter app_first_use para não afetar outras funcionalidades
  }, []);

  // Forçar exibição de modal específico (útil para desenvolvimento/teste)
  const forceShowModal = useCallback((modalType, stage = null) => {
    switch (modalType) {
      case 'donation':
        setDonationStage(stage || 60);
        setShowDonationModal(true);
        break;
      case 'rating':
        setShowRatingModal(true);
        break;
      default:
        console.warn('Tipo de modal desconhecido:', modalType);
    }
  }, [setDonationStage, setShowDonationModal, setShowRatingModal]);

  // Efeitos automáticos quando usuário está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      // Verificar doação após 5 segundos
      const donationTimer = setTimeout(() => {
        checkDonationStatus();
      }, 5000);

      // Verificar avaliação após 7 segundos
      const ratingTimer = setTimeout(() => {
        checkRatingStatus();
      }, 7000);

      return () => {
        clearTimeout(donationTimer);
        clearTimeout(ratingTimer);
      };
    }
  }, [isAuthenticated, checkDonationStatus, checkRatingStatus]);

  // Estados computados úteis
  const modalStates = {
    showDonationModal,
    showRatingModal,
    donationStage,
    anyModalOpen: showDonationModal || showRatingModal
  };

  // Ações principais
  const modalActions = {
    // Doação
    dismissDonationPermanently,
    closeDonationModal,
    copyPixToClipboard,
    copyPixAndClose,
    
    // Avaliação
    dismissRatingPermanently,
    closeRatingModal,
    openGitHubRating,
    openGitHubAndClose,
    
    // Verificações manuais
    checkDonationStatus,
    checkRatingStatus,
    
    // Utilitários
    forceShowModal,
    resetAllModalStatus
  };

  // Informações sobre o sistema
  const modalInfo = {
    usageInfo: getUsageInfo(),
    dismissalStatus: getDismissalStatus(),
    pixEmail: 'lamvial@outlook.com',
    githubUrl: 'https://github.com/lamvial1958/personal-finance-flow'
  };

  // Props prontas para componentes
  const donationModalProps = {
    show: showDonationModal,
    stage: donationStage,
    onClose: closeDonationModal,
    onDismissPermanently: dismissDonationPermanently,
    onCopyPix: copyPixToClipboard,
    onCopyPixAndClose: copyPixAndClose,
    pixEmail: 'lamvial@outlook.com'
  };

  const ratingModalProps = {
    show: showRatingModal,
    onClose: closeRatingModal,
    onDismissPermanently: dismissRatingPermanently,
    onOpenGitHub: openGitHubRating,
    onOpenGitHubAndClose: openGitHubAndClose,
    githubUrl: 'https://github.com/lamvial1958/personal-finance-flow'
  };

  return {
    // Estados
    ...modalStates,
    
    // Ações
    ...modalActions,
    
    // Informações
    ...modalInfo,
    
    // Props para componentes
    donationModalProps,
    ratingModalProps,
    
    // Estados computados úteis para renderização condicional
    shouldBlockInteraction: showDonationModal || showRatingModal,
    hasActiveModal: showDonationModal || showRatingModal,
    
    // Informações de debug/desenvolvimento
    debugInfo: {
      usageInfo: getUsageInfo(),
      dismissalStatus: getDismissalStatus(),
      timersActive: isAuthenticated
    }
  };
};

export default useModals;