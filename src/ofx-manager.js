/**
 * OFX Manager - Personal Finance Flow
 * Gerenciador de importação e exportação de arquivos OFX (Open Financial Exchange)
 * Compatível com bancos brasileiros e padrões internacionais
 * 
 * Localização: C:\Personal_Finance_Flow\src\ofx-manager.js
 * Versão: 1.0.0
 * Criado: Setembro 2025
 */

import { XMLParser, XMLBuilder } from 'fast-xml-parser';

class OFXManager {
  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: true,
      trimValues: true,
      parseTrueNumberOnly: false,
      parseNodeValue: true
    });
    
    this.builder = new XMLBuilder({
      ignoreAttributes: false,
      format: true,
      suppressEmptyNode: true,
      suppressBooleanAttributes: false
    });

    // Categorias para mapeamento automático (expandir baseado em palavras-chave)
    this.categoryMappings = {
      income: {
        'SALARIO': 'Salário',
        'SAL': 'Salário', 
        'FOLHA': 'Salário',
        'PIX RECEBIDO': 'Transferência',
        'TED RECEBIDO': 'Transferência',
        'DOC RECEBIDO': 'Transferência',
        'ESTORNO': 'Outros',
        'REEMBOLSO': 'Outros',
        'RENDIMENTO': 'Investimentos',
        'JUROS': 'Investimentos',
        'DIVIDENDO': 'Investimentos'
      },
      expenses: {
        'SUPERMERCADO': 'Alimentação',
        'MERCADO': 'Alimentação',
        'PADARIA': 'Alimentação',
        'RESTAURANTE': 'Alimentação',
        'LANCHONETE': 'Alimentação',
        'POSTO': 'Transporte',
        'COMBUSTIVEL': 'Transporte',
        'GASOLINA': 'Transporte',
        'UBER': 'Transporte',
        '99': 'Transporte',
        'TAXI': 'Transporte',
        'ONIBUS': 'Transporte',
        'METRO': 'Transporte',
        'FARMACIA': 'Saúde',
        'CLINICA': 'Saúde',
        'HOSPITAL': 'Saúde',
        'MEDIC': 'Saúde',
        'DOUTOR': 'Saúde',
        'FACULDADE': 'Educação',
        'UNIVERSIDADE': 'Educação',
        'ESCOLA': 'Educação',
        'CURSO': 'Educação',
        'CINEMA': 'Lazer',
        'TEATRO': 'Lazer',
        'SHOPPING': 'Compras',
        'LOJA': 'Compras',
        'MAGAZINE': 'Compras',
        'ALUGUEL': 'Moradia',
        'CONDOMINIO': 'Moradia',
        'ENERGIA': 'Moradia',
        'AGUA': 'Moradia',
        'GAS': 'Moradia',
        'INTERNET': 'Moradia',
        'TELEFONE': 'Moradia'
      }
    };

    console.log('✅ OFX Manager inicializado');
  }

  /**
   * Importar arquivo OFX e converter para formato da aplicação
   * @param {string} fileContent - Conteúdo do arquivo OFX
   * @returns {Promise<Array>} Lista de transações convertidas
   */
  async importOFX(fileContent) {
    try {
      console.log('📁 Iniciando importação OFX...');
      console.log('📄 Tamanho do arquivo:', fileContent.length, 'caracteres');
      
      // Limpar e preparar conteúdo OFX
      const cleanContent = this.cleanOFXContent(fileContent);
      console.log('🧹 Conteúdo limpo, tamanho:', cleanContent.length);
      
      // Fazer parse do XML
      const parsed = this.parser.parse(cleanContent);
      console.log('🔍 Parse XML realizado:', !!parsed.OFX);
      
      // Extrair transações da estrutura OFX
      const ofxTransactions = this.extractTransactions(parsed);
      console.log('📊 Transações extraídas:', ofxTransactions.length);
      
      // Converter para formato da aplicação
      const appTransactions = this.mapToAppFormat(ofxTransactions);
      console.log('🔄 Transações convertidas:', appTransactions.length);
      
      return appTransactions;
      
    } catch (error) {
      console.error('❌ Erro ao importar OFX:', error);
      throw new Error(`Erro ao processar arquivo OFX: ${error.message}`);
    }
  }

  /**
   * Exportar transações para formato OFX
   * @param {Array} transactions - Lista de transações da aplicação
   * @param {Object} accountInfo - Informações da conta (opcional)
   * @returns {string} Conteúdo OFX formatado
   */
  async exportOFX(transactions, accountInfo = {}) {
    try {
      console.log('📤 Iniciando exportação OFX...');
      console.log('📊 Transações para exportar:', transactions.length);
      
      // Construir estrutura OFX
      const ofxStructure = this.buildOFXStructure(transactions, accountInfo);
      
      // Gerar header OFX
      const header = this.getOFXHeader();
      
      // Construir XML
      const xmlContent = this.builder.build(ofxStructure);
      
      // Combinar header + XML
      const fullContent = header + xmlContent;
      
      console.log('✅ Exportação OFX concluída, tamanho:', fullContent.length);
      return fullContent;
      
    } catch (error) {
      console.error('❌ Erro ao exportar OFX:', error);
      throw new Error(`Erro ao gerar arquivo OFX: ${error.message}`);
    }
  }

  /**
   * Limpar conteúdo OFX removendo headers específicos do banco
   * @param {string} content - Conteúdo bruto do arquivo
   * @returns {string} Conteúdo XML limpo
   */
  cleanOFXContent(content) {
    console.log('🧹 Limpando conteúdo OFX...');
    
    // Dividir em linhas
    const lines = content.split('\n');
    
    // Encontrar início do XML (linha que começa com <OFX)
    let xmlStartIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed.startsWith('<OFX') || trimmed.startsWith('<?xml')) {
        xmlStartIndex = i;
        break;
      }
    }
    
    if (xmlStartIndex === -1) {
      console.warn('⚠️ Não encontrou início XML, usando conteúdo completo');
      return content;
    }
    
    // Retornar apenas a parte XML
    const xmlContent = lines.slice(xmlStartIndex).join('\n');
    console.log('✅ Conteúdo XML extraído');
    return xmlContent;
  }

  /**
   * Extrair transações da estrutura OFX parseada
   * @param {Object} parsed - Objeto JSON do OFX parseado
   * @returns {Array} Lista de transações OFX
   */
  extractTransactions(parsed) {
    console.log('🔍 Extraindo transações da estrutura OFX...');
    
    try {
      // Navegar pela estrutura OFX
      const ofx = parsed.OFX;
      if (!ofx) {
        throw new Error('Estrutura OFX inválida: tag OFX não encontrada');
      }
      
      // Tentar diferentes caminhos para encontrar transações
      let transactionList = [];
      
      // Caminho para contas bancárias
      const bankMsgs = ofx.BANKMSGSRSV1;
      if (bankMsgs && bankMsgs.STMTTRNRS) {
        const stmtRes = bankMsgs.STMTTRNRS;
        const stmt = stmtRes.STMTRS;
        
        if (stmt && stmt.BANKTRANLIST && stmt.BANKTRANLIST.STMTTRN) {
          transactionList = Array.isArray(stmt.BANKTRANLIST.STMTTRN) 
            ? stmt.BANKTRANLIST.STMTTRN 
            : [stmt.BANKTRANLIST.STMTTRN];
        }
      }
      
      // Caminho para cartões de crédito
      const ccMsgs = ofx.CREDITCARDMSGSRSV1;
      if (ccMsgs && ccMsgs.CCSTMTTRNRS) {
        const ccStmtRes = ccMsgs.CCSTMTTRNRS;
        const ccStmt = ccStmtRes.CCSTMTRS;
        
        if (ccStmt && ccStmt.BANKTRANLIST && ccStmt.BANKTRANLIST.STMTTRN) {
          const ccTransactions = Array.isArray(ccStmt.BANKTRANLIST.STMTTRN)
            ? ccStmt.BANKTRANLIST.STMTTRN
            : [ccStmt.BANKTRANLIST.STMTTRN];
          transactionList = transactionList.concat(ccTransactions);
        }
      }
      
      console.log('📊 Transações encontradas:', transactionList.length);
      return transactionList.filter(t => t && t.TRNAMT); // Filtrar transações válidas
      
    } catch (error) {
      console.error('❌ Erro ao extrair transações:', error);
      throw new Error('Erro ao extrair transações do arquivo OFX');
    }
  }

  /**
   * Converter transações OFX para formato da aplicação
   * @param {Array} ofxTransactions - Transações no formato OFX
   * @returns {Array} Transações no formato da aplicação
   */
  mapToAppFormat(ofxTransactions) {
    console.log('🔄 Convertendo transações para formato da aplicação...');
    
    return ofxTransactions.map((trn, index) => {
      try {
        // Extrair dados básicos
        const amount = Math.abs(parseFloat(trn.TRNAMT || 0));
        const isCredit = parseFloat(trn.TRNAMT || 0) >= 0;
        const type = isCredit ? 'income' : 'expenses';
        
        // Construir descrição
        const description = this.buildDescription(trn);
        
        // Categorizar automaticamente
        const category = this.categorizeTransaction(trn, isCredit);
        
        // Converter data
        const date = this.parseOFXDate(trn.DTPOSTED);
        
        const transaction = {
          // Dados principais
          date: date,
          type: type,
          amount: amount,
          description: description,
          category: category,
          
          // Metadados de importação
          fitid: trn.FITID || `import_${Date.now()}_${index}`,
          imported: true,
          importDate: new Date().toISOString(),
          originalData: {
            trnType: trn.TRNTYPE,
            checkNum: trn.CHECKNUM,
            memo: trn.MEMO,
            name: trn.NAME
          }
        };
        
        console.log(`✅ Transação ${index + 1} convertida:`, {
          date: transaction.date,
          type: transaction.type,
          amount: transaction.amount,
          category: transaction.category
        });
        
        return transaction;
        
      } catch (error) {
        console.error(`❌ Erro ao converter transação ${index}:`, error, trn);
        return null;
      }
    }).filter(t => t !== null); // Remover transações com erro
  }

  /**
   * Construir descrição da transação combinando campos disponíveis
   * @param {Object} trn - Transação OFX
   * @returns {string} Descrição formatada
   */
  buildDescription(trn) {
    const parts = [];
    
    if (trn.NAME) {
      parts.push(trn.NAME);
    }
    
    if (trn.MEMO && trn.MEMO !== trn.NAME) {
      parts.push(trn.MEMO);
    }
    
    if (trn.CHECKNUM) {
      parts.push(`(Cheque: ${trn.CHECKNUM})`);
    }
    
    const description = parts.join(' - ');
    return description || 'Transação Importada';
  }

  /**
   * Categorizar transação automaticamente baseado em palavras-chave
   * @param {Object} trn - Transação OFX
   * @param {boolean} isCredit - Se é crédito (entrada) ou débito (saída)
   * @returns {string} Categoria determinada
   */
  categorizeTransaction(trn, isCredit) {
    const description = ((trn.NAME || '') + ' ' + (trn.MEMO || '')).toUpperCase();
    
    const mappings = isCredit ? this.categoryMappings.income : this.categoryMappings.expenses;
    
    // Buscar palavras-chave na descrição
    for (const [keyword, category] of Object.entries(mappings)) {
      if (description.includes(keyword)) {
        console.log(`🏷️ Categoria detectada: "${keyword}" -> ${category}`);
        return category;
      }
    }
    
    // Categoria padrão baseado no tipo de transação OFX
    if (trn.TRNTYPE) {
      switch (trn.TRNTYPE.toUpperCase()) {
        case 'DEBIT':
        case 'PAYMENT':
        case 'CHECK':
          return 'Outros';
        case 'CREDIT':
        case 'DEPOSIT':
        case 'DIRECTDEP':
          return isCredit ? 'Outros' : 'Outros';
        case 'ATM':
          return 'Outros';
        case 'FEE':
          return 'Outros';
        default:
          return 'Outros';
      }
    }
    
    return 'Outros';
  }

  /**
   * Converter data OFX (YYYYMMDD[HHMMSS]) para formato ISO (YYYY-MM-DD)
   * @param {string|number} ofxDate - Data no formato OFX
   * @returns {string} Data no formato ISO
   */
  parseOFXDate(ofxDate) {
    try {
      const dateStr = ofxDate.toString();
      
      if (dateStr.length < 8) {
        throw new Error('Data OFX inválida: muito curta');
      }
      
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      
      // Validar valores
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        throw new Error('Mês inválido na data OFX');
      }
      
      if (parseInt(day) < 1 || parseInt(day) > 31) {
        throw new Error('Dia inválido na data OFX');
      }
      
      const isoDate = `${year}-${month}-${day}`;
      console.log(`📅 Data convertida: ${ofxDate} -> ${isoDate}`);
      
      return isoDate;
      
    } catch (error) {
      console.error('❌ Erro ao converter data OFX:', ofxDate, error);
      // Usar data atual como fallback
      return new Date().toISOString().split('T')[0];
    }
  }

  /**
   * Construir estrutura OFX para exportação
   * @param {Array} transactions - Transações da aplicação
   * @param {Object} accountInfo - Informações da conta
   * @returns {Object} Estrutura OFX completa
   */
  buildOFXStructure(transactions, accountInfo) {
    console.log('🏗️ Construindo estrutura OFX para exportação...');
    
    // Converter transações para formato OFX
    const ofxTransactions = transactions.map((t, index) => ({
      TRNTYPE: t.type === 'income' ? 'CREDIT' : 'DEBIT',
      DTPOSTED: this.formatOFXDate(t.date),
      TRNAMT: t.type === 'income' ? t.amount : -t.amount,
      FITID: t.fitid || `export_${Date.now()}_${index}`,
      NAME: t.description || 'Transação Exportada',
      MEMO: t.category || '',
      BANKACCTTO: accountInfo.accountId || 'EXPORTED'
    }));
    
    console.log('📊 Transações convertidas para OFX:', ofxTransactions.length);
    
    return {
      OFX: {
        SIGNONMSGSRSV1: {
          SONRS: {
            STATUS: {
              CODE: 0,
              SEVERITY: 'INFO'
            },
            DTSERVER: this.formatOFXDate(new Date()),
            LANGUAGE: 'POR'
          }
        },
        BANKMSGSRSV1: {
          STMTTRNRS: {
            TRNUID: Date.now().toString(),
            STATUS: {
              CODE: 0,
              SEVERITY: 'INFO'
            },
            STMTRS: {
              CURDEF: 'BRL',
              BANKACCTFROM: {
                BANKID: accountInfo.bankId || '000',
                ACCTID: accountInfo.accountId || 'EXPORTED',
                ACCTTYPE: 'CHECKING'
              },
              BANKTRANLIST: {
                DTSTART: this.formatOFXDate(this.getOldestTransactionDate(transactions)),
                DTEND: this.formatOFXDate(this.getNewestTransactionDate(transactions)),
                STMTTRN: ofxTransactions
              }
            }
          }
        }
      }
    };
  }

  /**
   * Converter data ISO (YYYY-MM-DD) para formato OFX (YYYYMMDD)
   * @param {string|Date} date - Data no formato ISO ou objeto Date
   * @returns {string} Data no formato OFX
   */
  formatOFXDate(date) {
    try {
      const dateObj = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
      
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      
      return `${year}${month}${day}`;
      
    } catch (error) {
      console.error('❌ Erro ao formatar data OFX:', date, error);
      return '19700101'; // Fallback para epoch
    }
  }

  /**
   * Obter data da transação mais antiga
   * @param {Array} transactions - Lista de transações
   * @returns {string} Data mais antiga
   */
  getOldestTransactionDate(transactions) {
    if (transactions.length === 0) return new Date();
    
    return transactions.reduce((oldest, t) => {
      return new Date(t.date) < new Date(oldest.date) ? t : oldest;
    }).date;
  }

  /**
   * Obter data da transação mais recente
   * @param {Array} transactions - Lista de transações
   * @returns {string} Data mais recente
   */
  getNewestTransactionDate(transactions) {
    if (transactions.length === 0) return new Date();
    
    return transactions.reduce((newest, t) => {
      return new Date(t.date) > new Date(newest.date) ? t : newest;
    }).date;
  }

  /**
   * Gerar header OFX padrão
   * @returns {string} Header OFX formatado
   */
  getOFXHeader() {
    return `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

`;
  }

  /**
   * Verificar se arquivo é OFX válido
   * @param {string} content - Conteúdo do arquivo
   * @returns {boolean} True se for OFX válido
   */
  isValidOFX(content) {
    try {
      // Verificações básicas
      const hasOFXHeader = content.includes('OFXHEADER') || content.includes('<OFX');
      const hasTransactions = content.includes('STMTTRN') || content.includes('BANKTRANLIST');
      
      console.log('🔍 Validação OFX:', { hasOFXHeader, hasTransactions });
      
      return hasOFXHeader && hasTransactions;
      
    } catch (error) {
      console.error('❌ Erro na validação OFX:', error);
      return false;
    }
  }

  /**
   * Detectar duplicatas baseado no FITID
   * @param {Array} newTransactions - Novas transações
   * @param {Array} existingTransactions - Transações existentes
   * @returns {Object} Resultado da detecção de duplicatas
   */
  detectDuplicates(newTransactions, existingTransactions) {
    console.log('🔍 Detectando duplicatas...');
    
    // Criar set com FITIDs existentes
    const existingFitids = new Set(
      existingTransactions
        .filter(t => t.fitid)
        .map(t => t.fitid)
    );
    
    const duplicates = [];
    const unique = [];
    
    newTransactions.forEach(transaction => {
      if (transaction.fitid && existingFitids.has(transaction.fitid)) {
        duplicates.push(transaction);
      } else {
        unique.push(transaction);
      }
    });
    
    console.log(`📊 Duplicatas detectadas: ${duplicates.length}, Únicas: ${unique.length}`);
    
    return {
      duplicates,
      unique,
      total: newTransactions.length,
      duplicateCount: duplicates.length,
      uniqueCount: unique.length
    };
  }
}

// Instanciar e exportar gerenciador
const ofxManager = new OFXManager();
export default ofxManager;