/**
 * useOFX Hook - Personal Finance Flow
 * Gerencia toda a funcionalidade OFX (Import/Export de arquivos bancários)
 * 
 * Localização: C:\Personal_Finance_Flow\src\hooks\useOFX.js
 * Versão: 1.0.0
 * Criado: Setembro 2025
 */

import React, { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import ofxManager from '../ofx-manager.js';
import dbManager from '../db-manager.js';

export const useOFX = () => {
  const {
    // Estados OFX
    isImportingOFX, setIsImportingOFX,
    isExportingOFX, setIsExportingOFX,
    showOFXImportModal, setShowOFXImportModal,
    ofxImportResults, setOFXImportResults,
    pendingOFXTransactions, setPendingOFXTransactions,
    
    // Dados da aplicação
    dailyTransactions,
    setDailyTransactions,
    setDataVersion
  } = useApp();

  // Função auxiliar para ler arquivo
  const readFileContent = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file, 'utf-8');
    });
  }, []);

  // Converter transações para lista (para exportação e detecção de duplicatas)
  const convertDailyTransactionsToList = useCallback(() => {
    const list = [];
    Object.entries(dailyTransactions).forEach(([date, dayData]) => {
      // Receitas
      Object.entries(dayData.income || {}).forEach(([id, transaction]) => {
        list.push({
          id: parseInt(id),
          date,
          type: 'income',
          amount: transaction.amount,
          description: transaction.description,
          category: transaction.category,
          fitid: transaction.fitid || null
        });
      });
      // Despesas
      Object.entries(dayData.expenses || {}).forEach(([id, transaction]) => {
        list.push({
          id: parseInt(id),
          date,
          type: 'expenses',
          amount: transaction.amount,
          description: transaction.description,
          category: transaction.category,
          fitid: transaction.fitid || null
        });
      });
    });
    return list;
  }, [dailyTransactions]);

  // Import OFX
  const handleOFXImport = useCallback(async () => {
    try {
      // Criar input file oculto
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.ofx,.qfx';
      input.style.display = 'none';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        console.log('Arquivo OFX selecionado:', file.name, file.size, 'bytes');
        
        setIsImportingOFX(true);
        
        try {
          // Ler arquivo
          const content = await readFileContent(file);
          console.log('Conteúdo lido, processando...');
          
          // Validar se é OFX
          if (!ofxManager.isValidOFX(content)) {
            throw new Error('Arquivo não é um OFX válido');
          }
          
          // Importar via OFX Manager
          const importedTransactions = await ofxManager.importOFX(content);
          console.log('Transações importadas:', importedTransactions.length);
          
          if (importedTransactions.length === 0) {
            alert('Nenhuma transação encontrada no arquivo OFX.');
            return;
          }
          
          // Converter transações existentes para verificar duplicatas
          const existingTransactions = convertDailyTransactionsToList();
          
          // Detectar duplicatas
          const duplicateResults = ofxManager.detectDuplicates(importedTransactions, existingTransactions);
          
          // Mostrar modal de confirmação
          setOFXImportResults(duplicateResults);
          setPendingOFXTransactions(importedTransactions);
          setShowOFXImportModal(true);
          
        } catch (error) {
          console.error('Erro no import OFX:', error);
          alert('Erro ao importar arquivo OFX: ' + error.message);
        } finally {
          setIsImportingOFX(false);
        }
      };
      
      // Trigger file picker
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
      
    } catch (error) {
      console.error('Erro ao iniciar import OFX:', error);
      alert('Erro ao iniciar importação OFX.');
      setIsImportingOFX(false);
    }
  }, [readFileContent, convertDailyTransactionsToList, setIsImportingOFX, setOFXImportResults, setPendingOFXTransactions, setShowOFXImportModal]);

  // Export OFX
  const handleOFXExport = useCallback(async () => {
    try {
      setIsExportingOFX(true);
      
      // Converter transações para formato lista
      const transactionsList = convertDailyTransactionsToList();
      
      if (transactionsList.length === 0) {
        alert('Nenhuma transação encontrada para exportar.');
        return;
      }
      
      console.log('Exportando', transactionsList.length, 'transações para OFX');
      
      // Gerar OFX
      const ofxContent = await ofxManager.exportOFX(transactionsList, {
        bankId: '000',
        accountId: 'PERSONAL_FINANCE'
      });
      
      // Download
      const blob = new Blob([ofxContent], { type: 'application/x-ofx;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transacoes_financeiras_${new Date().toISOString().split('T')[0]}.ofx`;
      a.click();
      URL.revokeObjectURL(url);
      
      alert('Arquivo OFX exportado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao exportar OFX:', error);
      alert('Erro ao exportar dados para OFX: ' + error.message);
    } finally {
      setIsExportingOFX(false);
    }
  }, [convertDailyTransactionsToList, setIsExportingOFX]);

  // Confirmar importação OFX
  const confirmOFXImport = useCallback(async (importType) => {
    try {
      let transactionsToImport = [];
      
      if (importType === 'all') {
        transactionsToImport = pendingOFXTransactions;
      } else if (importType === 'unique') {
        transactionsToImport = ofxImportResults.unique;
      } else {
        // Cancelado
        setShowOFXImportModal(false);
        setOFXImportResults(null);
        setPendingOFXTransactions([]);
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
  }, [pendingOFXTransactions, ofxImportResults, setShowOFXImportModal, setOFXImportResults, setPendingOFXTransactions, setDailyTransactions, setDataVersion]);

  // Cancelar importação OFX
  const cancelOFXImport = useCallback(() => {
    setShowOFXImportModal(false);
    setOFXImportResults(null);
    setPendingOFXTransactions([]);
  }, [setShowOFXImportModal, setOFXImportResults, setPendingOFXTransactions]);

  // Validar arquivo OFX antes do processamento
  const validateOFXFile = useCallback(async (file) => {
    try {
      // Verificar extensão
      const validExtensions = ['.ofx', '.qfx'];
      const fileName = file.name.toLowerCase();
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
      
      if (!hasValidExtension) {
        throw new Error('Arquivo deve ter extensão .ofx ou .qfx');
      }
      
      // Verificar tamanho (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('Arquivo muito grande. Máximo 10MB.');
      }
      
      // Ler primeiros bytes para verificar se é texto
      const preview = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
        reader.readAsText(file.slice(0, 1000), 'utf-8'); // Primeiros 1000 chars
      });
      
      // Verificar se contém elementos OFX básicos
      if (!preview.includes('OFX') && !preview.includes('STMTTRN')) {
        throw new Error('Arquivo não parece ser um OFX válido');
      }
      
      return true;
    } catch (error) {
      console.error('Erro na validação do arquivo OFX:', error);
      throw error;
    }
  }, []);

  // Obter estatísticas da importação
  const getImportStats = useCallback(() => {
    if (!ofxImportResults) return null;
    
    return {
      total: ofxImportResults.total,
      unique: ofxImportResults.uniqueCount,
      duplicates: ofxImportResults.duplicateCount,
      hasUnique: ofxImportResults.uniqueCount > 0,
      hasDuplicates: ofxImportResults.duplicateCount > 0,
      canImportAll: ofxImportResults.total > 0,
      canImportUnique: ofxImportResults.uniqueCount > 0
    };
  }, [ofxImportResults]);

  // Obter informações sobre bancos suportados
  const getSupportedBanks = useCallback(() => {
    return [
      { name: 'Itaú', formats: ['OFX', 'QFX'], accounts: ['Conta Corrente', 'Cartão'] },
      { name: 'Bradesco', formats: ['OFX'], accounts: ['Extratos Completos'] },
      { name: 'Santander', formats: ['OFX'], accounts: ['Movimentações'] },
      { name: 'Banco do Brasil', formats: ['OFX'], accounts: ['PF e PJ'] },
      { name: 'Nubank', formats: ['OFX'], accounts: ['Cartão via Export'] },
      { name: 'Inter', formats: ['OFX'], accounts: ['Conta Digital'] },
      { name: 'BTG Pactual', formats: ['OFX'], accounts: ['Investimentos'] }
    ];
  }, []);

  // Estados computados úteis
  const ofxStates = {
    isImporting: isImportingOFX,
    isExporting: isExportingOFX,
    showImportModal: showOFXImportModal,
    hasImportResults: !!ofxImportResults,
    hasPendingTransactions: pendingOFXTransactions.length > 0,
    isProcessing: isImportingOFX || isExportingOFX
  };

  // Ações disponíveis
  const ofxActions = {
    importOFX: handleOFXImport,
    exportOFX: handleOFXExport,
    confirmImport: confirmOFXImport,
    cancelImport: cancelOFXImport,
    validateFile: validateOFXFile
  };

  // Dados e utilitários
  const ofxData = {
    importResults: ofxImportResults,
    pendingTransactions: pendingOFXTransactions,
    importStats: getImportStats(),
    supportedBanks: getSupportedBanks()
  };

  return {
    // Estados
    ...ofxStates,
    
    // Ações
    ...ofxActions,
    
    // Dados
    ...ofxData,
    
    // Utilitários
    convertTransactionsToList: convertDailyTransactionsToList,
    
    // Estados específicos para componentes
    importModalProps: {
      show: showOFXImportModal,
      results: ofxImportResults,
      onConfirm: confirmOFXImport,
      onCancel: cancelOFXImport,
      stats: getImportStats()
    }
  };
};

export default useOFX;