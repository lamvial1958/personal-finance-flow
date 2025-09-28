/**
 * useAutoUpdate.js - Hook para Atualização Automática Agressiva
 * Personal Finance Flow V1.5.1 - Sistema de Atualização Desktop
 * 
 * Funcionalidades:
 * - Verificação automática de atualizações no carregamento
 * - Logs detalhados para debugging
 * - Integração com VitePWA
 * - Verificação periódica em background
 * - Recarregamento automático forçado
 * 
 * Localização: C:\Personal_Finance_Flow\src\hooks\useAutoUpdate.js
 * Versão: 1.5.1 - Sistema de Atualização Automática
 */

import { useEffect, useRef, useState } from 'react';

// Constantes de configuração
const UPDATE_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutos
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 segundos

/**
 * Hook customizado para gerenciar atualizações automáticas
 * Integra com VitePWA e força atualizações em desktop
 */
export const useAutoUpdate = () => {
  const [updateStatus, setUpdateStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);
  const intervalRef = useRef(null);
  const retryCountRef = useRef(0);
  const swRegistrationRef = useRef(null);

  // Função para logging detalhado
  const logUpdate = (type, message, data = null) => {
    const timestamp = new Date().toISOString();
    const logPrefix = `[PWA-UPDATE ${timestamp}]`;
    
    switch (type) {
      case 'info':
        console.log(`${logPrefix} ℹ️ ${message}`, data || '');
        break;
      case 'success':
        console.log(`${logPrefix} ✅ ${message}`, data || '');
        break;
      case 'warning':
        console.warn(`${logPrefix} ⚠️ ${message}`, data || '');
        break;
      case 'error':
        console.error(`${logPrefix} ❌ ${message}`, data || '');
        break;
      case 'debug':
        if (__PWA_DEBUG__) {
          console.debug(`${logPrefix} 🔍 ${message}`, data || '');
        }
        break;
    }
  };

  // Função para detectar se estamos em ambiente de produção
  const isProduction = () => {
    return window.location.hostname !== 'localhost' && 
           window.location.hostname !== '127.0.0.1' &&
           !window.location.port;
  };

  // Função para verificar disponibilidade do Service Worker
  const checkServiceWorkerSupport = () => {
    if (!('serviceWorker' in navigator)) {
      logUpdate('warning', 'Service Worker não suportado pelo navegador');
      return false;
    }
    return true;
  };

  // Função para obter registro atual do Service Worker
  const getCurrentRegistration = async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      logUpdate('debug', `Encontrados ${registrations.length} registrations`, registrations.map(r => r.scope));
      
      if (registrations.length > 0) {
        // Priorizar registration do VitePWA se existir
        const viteRegistration = registrations.find(reg => 
          reg.scope.includes('/personal-finance-flow/') || 
          reg.scope === window.location.origin + '/'
        );
        
        return viteRegistration || registrations[0];
      }
      
      return null;
    } catch (error) {
      logUpdate('error', 'Erro ao obter registrations', error);
      return null;
    }
  };

  // Função para forçar verificação de atualização
  const forceUpdateCheck = async () => {
    if (!isProduction()) {
      logUpdate('info', 'Verificação de atualização pulada - ambiente de desenvolvimento');
      setUpdateStatus('dev-mode');
      return;
    }

    if (!checkServiceWorkerSupport()) {
      setUpdateStatus('unsupported');
      return;
    }

    try {
      logUpdate('info', 'Iniciando verificação forçada de atualização...');
      setUpdateStatus('checking');

      const registration = await getCurrentRegistration();
      
      if (!registration) {
        logUpdate('warning', 'Nenhum Service Worker encontrado');
        setUpdateStatus('no-sw');
        return;
      }

      swRegistrationRef.current = registration;
      logUpdate('info', `Service Worker encontrado: ${registration.scope}`);

      // Forçar verificação de atualização
      await registration.update();
      logUpdate('success', 'Verificação de atualização executada');

      // Verificar se há nova versão aguardando
      if (registration.waiting) {
        logUpdate('success', 'Nova versão detectada! Aplicando atualização...');
        await applyUpdate(registration.waiting);
      } else if (registration.installing) {
        logUpdate('info', 'Nova versão sendo instalada...');
        setUpdateStatus('installing');
        
        // Aguardar instalação completar
        registration.installing.addEventListener('statechange', () => {
          if (registration.installing.state === 'installed') {
            logUpdate('success', 'Nova versão instalada! Aplicando...');
            applyUpdate(registration.installing);
          }
        });
      } else {
        logUpdate('info', 'Aplicação já está na versão mais recente');
        setUpdateStatus('up-to-date');
      }

      setLastCheck(new Date());
      retryCountRef.current = 0; // Reset retry counter on success

    } catch (error) {
      logUpdate('error', 'Erro durante verificação de atualização', error);
      setUpdateStatus('error');
      
      // Implementar retry logic
      if (retryCountRef.current < MAX_RETRY_ATTEMPTS) {
        retryCountRef.current++;
        logUpdate('info', `Tentando novamente em ${RETRY_DELAY/1000}s (tentativa ${retryCountRef.current}/${MAX_RETRY_ATTEMPTS})`);
        
        setTimeout(() => {
          forceUpdateCheck();
        }, RETRY_DELAY);
      } else {
        logUpdate('error', 'Máximo de tentativas atingido para verificação de atualização');
      }
    }
  };

  // Função para aplicar atualização forçada
  const applyUpdate = async (serviceWorker) => {
    try {
      logUpdate('info', 'Aplicando atualização e recarregando aplicação...');
      setUpdateStatus('updating');

      // Postar mensagem para Service Worker para aplicar atualização
      if (serviceWorker) {
        serviceWorker.postMessage({ type: 'SKIP_WAITING' });
      }

      // Aguardar um momento para o SW processar
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Forçar recarregamento completo da página
      logUpdate('success', 'Recarregando aplicação com nova versão...');
      window.location.reload();

    } catch (error) {
      logUpdate('error', 'Erro ao aplicar atualização', error);
      setUpdateStatus('error');
      
      // Fallback: recarregamento hard
      logUpdate('info', 'Tentando recarregamento forçado...');
      window.location.href = window.location.href;
    }
  };

  // Função para configurar verificação periódica
  const setupPeriodicCheck = () => {
    if (!isProduction()) {
      return;
    }

    // Limpar interval anterior se existir
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Configurar novo interval
    intervalRef.current = setInterval(() => {
      logUpdate('info', 'Executando verificação periódica de atualização...');
      forceUpdateCheck();
    }, UPDATE_CHECK_INTERVAL);

    logUpdate('info', `Verificação periódica configurada: a cada ${UPDATE_CHECK_INTERVAL/60000} minutos`);
  };

  // Função para configurar listeners de Service Worker
  const setupServiceWorkerListeners = async () => {
    if (!checkServiceWorkerSupport() || !isProduction()) {
      return;
    }

    try {
      // Listener para controllerchange (nova versão ativa)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        logUpdate('success', 'Nova versão do Service Worker ativa - recarregando...');
        window.location.reload();
      });

      // Listener para messages do Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        logUpdate('debug', 'Mensagem recebida do Service Worker', event.data);
        
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          logUpdate('info', 'Atualização disponível notificada pelo SW');
          forceUpdateCheck();
        }
      });

      logUpdate('info', 'Listeners do Service Worker configurados');

    } catch (error) {
      logUpdate('error', 'Erro ao configurar listeners do Service Worker', error);
    }
  };

  // Effect principal - executa na inicialização
  useEffect(() => {
    logUpdate('info', `Inicializando sistema de atualização automática v${__APP_VERSION__}`);
    logUpdate('info', `Build: ${__BUILD_DATE__}`);
    logUpdate('info', `Ambiente: ${isProduction() ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`);
    
    // Verificação inicial após pequeno delay
    const initialCheckTimer = setTimeout(() => {
      forceUpdateCheck();
    }, 2000);

    // Configurar listeners e verificação periódica
    setupServiceWorkerListeners();
    setupPeriodicCheck();

    // Cleanup
    return () => {
      clearTimeout(initialCheckTimer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      logUpdate('info', 'Sistema de atualização automática finalizado');
    };
  }, []); // Executa apenas uma vez

  // Função manual para verificar atualizações (para debugging)
  const manualUpdateCheck = () => {
    logUpdate('info', 'Verificação manual de atualização solicitada');
    forceUpdateCheck();
  };

  // Retornar estado e funções para debugging
  return {
    updateStatus,
    lastCheck,
    manualUpdateCheck,
    isProduction: isProduction(),
    supportsServiceWorker: checkServiceWorkerSupport()
  };
};