class DatabaseManager {
  constructor() {
    this.db = null;
    this.SQL = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Carregar sql.js via script loading global (mais robusto)
      if (!window.initSqlJs) {
        await this.loadSqlJsScript();
      }

      // Inicializar SQL.js usando a função global
      this.SQL = await window.initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      });

      // Try to load existing database from IndexedDB
      const savedDb = await this.loadFromIndexedDB();
      
      if (savedDb) {
        this.db = new this.SQL.Database(savedDb);
        console.log('✅ Banco de dados carregado do armazenamento local');
      } else {
        // Create new database
        this.db = new this.SQL.Database();
        console.log('✅ Novo banco de dados criado');
      }

      // Create tables if they don't exist
      await this.createTables();
      
      // Save to IndexedDB after initialization
      await this.saveToIndexedDB();
      
      this.isInitialized = true;
      console.log('✅ Database Manager inicializado com script loading');
      
    } catch (error) {
      console.error('❌ Erro ao inicializar banco de dados:', error);
      throw error;
    }
  }

  async loadSqlJsScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
      script.onload = () => {
        console.log('✅ sql.js script carregado via CDN');
        resolve();
      };
      script.onerror = (error) => {
        console.error('❌ Erro ao carregar sql.js script:', error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  }

  async createTables() {
    const tables = [
      // Authentication table
      `CREATE TABLE IF NOT EXISTS app_auth (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Transactions table
      `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT NOT NULL,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Initial balances table
      `CREATE TABLE IF NOT EXISTS initial_balances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        investment_type TEXT UNIQUE NOT NULL,
        amount REAL NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Investment movements table
      `CREATE TABLE IF NOT EXISTS investment_movements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        investment_type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    tables.forEach(sql => {
      this.db.run(sql);
    });

    console.log('✅ Tabelas criadas/verificadas');
  }

  async saveToIndexedDB() {
    try {
      const data = this.db.export();
      
      // Primeiro, detectar a versão atual do banco
      const currentVersion = await this.getCurrentDBVersion();
      const request = indexedDB.open('PersonalFinanceDB', currentVersion || 1);
      
      return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error);
        
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('database')) {
            db.createObjectStore('database');
          }
        };
        
        request.onsuccess = () => {
          const db = request.result;
          
          if (!db.objectStoreNames.contains('database')) {
            // Se object store não existe, precisa fazer upgrade
            db.close();
            const upgradeRequest = indexedDB.open('PersonalFinanceDB', db.version + 1);
            
            upgradeRequest.onupgradeneeded = () => {
              const upgradeDb = upgradeRequest.result;
              if (!upgradeDb.objectStoreNames.contains('database')) {
                upgradeDb.createObjectStore('database');
              }
            };
            
            upgradeRequest.onsuccess = () => {
              const upgradeDb = upgradeRequest.result;
              const transaction = upgradeDb.transaction(['database'], 'readwrite');
              const store = transaction.objectStore('database');
              store.put(data, 'main');
              transaction.oncomplete = () => {
                upgradeDb.close();
                resolve();
              };
              transaction.onerror = () => reject(transaction.error);
            };
            
            upgradeRequest.onerror = () => reject(upgradeRequest.error);
          } else {
            // Object store existe, proceder normalmente
            const transaction = db.transaction(['database'], 'readwrite');
            const store = transaction.objectStore('database');
            store.put(data, 'main');
            transaction.oncomplete = () => {
              db.close();
              resolve();
            };
            transaction.onerror = () => reject(transaction.error);
          }
        };
      });
    } catch (error) {
      console.error('❌ Erro ao salvar no IndexedDB:', error);
    }
  }

  async getCurrentDBVersion() {
    return new Promise((resolve) => {
      const request = indexedDB.open('PersonalFinanceDB');
      request.onsuccess = () => {
        const db = request.result;
        const version = db.version;
        db.close();
        resolve(version);
      };
      request.onerror = () => resolve(1); // Default para versão 1
    });
  }

  async loadFromIndexedDB() {
    try {
      const currentVersion = await this.getCurrentDBVersion();
      const request = indexedDB.open('PersonalFinanceDB', currentVersion || 1);
      
      return new Promise((resolve, reject) => {
        request.onerror = () => resolve(null);
        
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('database')) {
            db.createObjectStore('database');
          }
        };
        
        request.onsuccess = () => {
          const db = request.result;
          
          if (!db.objectStoreNames.contains('database')) {
            db.close();
            resolve(null);
            return;
          }
          
          const transaction = db.transaction(['database'], 'readonly');
          const store = transaction.objectStore('database');
          const getRequest = store.get('main');
          
          getRequest.onsuccess = () => {
            db.close();
            resolve(getRequest.result || null);
          };
          getRequest.onerror = () => {
            db.close();
            resolve(null);
          };
        };
      });
    } catch (error) {
      console.error('❌ Erro ao carregar do IndexedDB:', error);
      return null;
    }
  }

  // Authentication methods
  async checkSetup() {
    const stmt = this.db.prepare('SELECT id FROM app_auth WHERE id = 1');
    let result = {};
    if (stmt.step()) {
      result = stmt.getAsObject();
    }
    stmt.free();
    
    console.log('🔍 checkSetup result JSON:', JSON.stringify(result));
    console.log('🔍 isSetup:', !!result.id);
    
    await this.saveToIndexedDB();
    return { isSetup: !!result.id };
  }

  async setupAuth(password) {
    // Verificar se já existe
    const existing = this.db.prepare('SELECT id FROM app_auth WHERE id = 1');
    let existingData = {};
    if (existing.step()) {
      existingData = existing.getAsObject();
    }
    existing.free();
    
    console.log('🔍 setupAuth - existing JSON:', JSON.stringify(existingData));
    
    if (existingData.id) {
      throw new Error('Sistema já foi configurado');
    }

    const salt = this.generateSalt();
    const passwordHash = await this.hashPassword(password, salt);

    console.log('🔍 setupAuth - salvando senha...');
    
    try {
      this.db.run('INSERT INTO app_auth (id, password_hash, salt) VALUES (1, ?, ?)', [passwordHash, salt]);
      console.log('🔍 setupAuth - INSERT executado com sucesso');
    } catch (error) {
      console.log('🔍 setupAuth - erro no INSERT:', error);
      // Se já existe, fazer UPDATE em vez de INSERT
      this.db.run('UPDATE app_auth SET password_hash = ?, salt = ? WHERE id = 1', [passwordHash, salt]);
      console.log('🔍 setupAuth - UPDATE executado');
    }
    
    // Verificar se foi salvo
    const verify = this.db.prepare('SELECT * FROM app_auth WHERE id = 1');
    let verifyData = {};
    if (verify.step()) {
      verifyData = verify.getAsObject();
    }
    verify.free();
    console.log('🔍 setupAuth - verificação JSON:', JSON.stringify(verifyData));
    
    await this.saveToIndexedDB();
    
    return { success: true, message: 'Senha configurada com sucesso' };
  }

  async login(password) {
    console.log('🔍 login - iniciando...');
    const stmt = this.db.prepare('SELECT password_hash, salt FROM app_auth WHERE id = 1');
    let auth = {};
    if (stmt.step()) {
      auth = stmt.getAsObject();
    }
    stmt.free();

    console.log('🔍 login - dados encontrados JSON:', JSON.stringify(auth));

    if (!auth.password_hash) {
      console.log('❌ login - password_hash não encontrado');
      throw new Error('Sistema não configurado');
    }

    const passwordHash = await this.hashPassword(password, auth.salt);
    console.log('🔍 login - hash calculado');
    
    if (passwordHash !== auth.password_hash) {
      throw new Error('Senha incorreta');
    }

    console.log('✅ login - sucesso!');
    return { success: true, message: 'Login realizado com sucesso' };
  }

  async changePassword(currentPassword, newPassword) {
    const stmt = this.db.prepare('SELECT password_hash, salt FROM app_auth WHERE id = 1');
    let auth = {};
    if (stmt.step()) {
      auth = stmt.getAsObject();
    }
    stmt.free();

    if (!auth.password_hash) {
      throw new Error('Sistema não configurado');
    }

    const currentHash = await this.hashPassword(currentPassword, auth.salt);
    if (currentHash !== auth.password_hash) {
      throw new Error('Senha atual incorreta');
    }

    const newSalt = this.generateSalt();
    const newPasswordHash = await this.hashPassword(newPassword, newSalt);

    this.db.run('UPDATE app_auth SET password_hash = ?, salt = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1', 
      [newPasswordHash, newSalt]);
    await this.saveToIndexedDB();

    return { success: true, message: 'Senha alterada com sucesso' };
  }

  // Transaction methods
  async getTransactions() {
    const stmt = this.db.prepare('SELECT * FROM transactions ORDER BY date DESC, created_at DESC');
    const transactions = [];
    
    while (stmt.step()) {
      transactions.push(stmt.getAsObject());
    }
    stmt.free();

    // Organize by date like original format
    const organized = {};
    transactions.forEach(t => {
      if (!organized[t.date]) {
        organized[t.date] = { income: {}, expenses: {} };
      }
      organized[t.date][t.type][t.id] = {
        amount: t.amount,
        description: t.description,
        category: t.category,
        timestamp: t.created_at
      };
    });

    return organized;
  }

  async addTransaction(date, type, amount, description, category) {
    this.db.run('INSERT INTO transactions (date, type, amount, description, category) VALUES (?, ?, ?, ?, ?)',
      [date, type, amount, description, category]);
    await this.saveToIndexedDB();
    
    return { message: 'Transaction added successfully' };
  }

  async deleteTransaction(id) {
    const result = this.db.run('DELETE FROM transactions WHERE id = ?', [id]);
    await this.saveToIndexedDB();
    
    if (result.changes > 0) {
      return { message: 'Transaction deleted successfully' };
    } else {
      throw new Error('Transaction not found');
    }
  }

  // Initial balances methods
  async getInitialBalances() {
    const stmt = this.db.prepare('SELECT * FROM initial_balances');
    const balances = {};
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      balances[row.investment_type] = row.amount;
    }
    stmt.free();

    return balances;
  }

  async updateInitialBalances(balances) {
    // Clear existing balances
    this.db.run('DELETE FROM initial_balances');
    
    // Insert new balances
    Object.entries(balances).forEach(([investment_type, amount]) => {
      if (amount && amount > 0) {
        this.db.run('INSERT INTO initial_balances (investment_type, amount) VALUES (?, ?)',
          [investment_type, amount]);
      }
    });
    
    await this.saveToIndexedDB();
    return { message: 'Initial balances updated successfully' };
  }

  // Investment movements methods
  async getInvestmentMovements() {
    const stmt = this.db.prepare('SELECT * FROM investment_movements ORDER BY date DESC, created_at DESC');
    const movements = {};
    
    while (stmt.step()) {
      const m = stmt.getAsObject();
      if (!movements[m.date]) {
        movements[m.date] = {};
      }
      movements[m.date][m.id] = {
        investmentType: m.investment_type,
        amount: m.amount,
        description: m.description,
        timestamp: m.created_at
      };
    }
    stmt.free();

    return movements;
  }

  async addInvestmentMovement(date, investmentType, amount, description) {
    this.db.run('INSERT INTO investment_movements (date, investment_type, amount, description) VALUES (?, ?, ?, ?)',
      [date, investmentType, amount, description]);
    await this.saveToIndexedDB();
    
    return { message: 'Investment movement added successfully' };
  }

  async deleteInvestmentMovement(id) {
    const result = this.db.run('DELETE FROM investment_movements WHERE id = ?', [id]);
    await this.saveToIndexedDB();
    
    if (result.changes > 0) {
      return { message: 'Investment movement deleted successfully' };
    } else {
      throw new Error('Investment movement not found');
    }
  }

  // Reports methods
  async getAnnualReport(year) {
    // Get transactions for the year
    const transactionsStmt = this.db.prepare('SELECT * FROM transactions WHERE substr(date, 1, 4) = ? ORDER BY date');
    const transactions = [];
    transactionsStmt.bind([year.toString()]);
    
    while (transactionsStmt.step()) {
      transactions.push(transactionsStmt.getAsObject());
    }
    transactionsStmt.free();

    // Get initial balances
    const balancesStmt = this.db.prepare('SELECT * FROM initial_balances');
    const balances = [];
    
    while (balancesStmt.step()) {
      balances.push(balancesStmt.getAsObject());
    }
    balancesStmt.free();

    // Get investment movements for the year
    const movementsStmt = this.db.prepare('SELECT * FROM investment_movements WHERE substr(date, 1, 4) = ? ORDER BY date');
    const movements = [];
    movementsStmt.bind([year.toString()]);
    
    while (movementsStmt.step()) {
      movements.push(movementsStmt.getAsObject());
    }
    movementsStmt.free();

    // Organize data for report
    const monthlyData = {};
    for (let month = 1; month <= 12; month++) {
      const monthKey = month.toString().padStart(2, '0');
      monthlyData[monthKey] = {
        income: 0,
        expenses: 0,
        investmentMovements: 0,
        transactions: []
      };
    }

    // Process transactions
    transactions.forEach(t => {
      const month = t.date.substring(5, 7);
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expenses += t.amount;
      }
      monthlyData[month].transactions.push(t);
    });

    // Process investment movements
    movements.forEach(m => {
      const month = m.date.substring(5, 7);
      monthlyData[month].investmentMovements += m.amount;
    });

    // Calculate initial patrimony
    const initialPatrimony = balances.reduce((sum, b) => sum + b.amount, 0);

    return {
      year: parseInt(year),
      initialPatrimony,
      monthlyData,
      summary: {
        totalIncome: Object.values(monthlyData).reduce((sum, m) => sum + m.income, 0),
        totalExpenses: Object.values(monthlyData).reduce((sum, m) => sum + m.expenses, 0),
        totalInvestmentMovements: Object.values(monthlyData).reduce((sum, m) => sum + m.investmentMovements, 0)
      }
    };
  }

  // Export data
  async exportData() {
    const [transactions, balances, movements] = await Promise.all([
      this.getAllTableData('transactions'),
      this.getAllTableData('initial_balances'),
      this.getAllTableData('investment_movements')
    ]);

    return {
      timestamp: new Date().toISOString(),
      database: 'SQLite WebAssembly',
      data: {
        transactions,
        initialBalances: balances,
        investmentMovements: movements
      }
    };
  }

  async getAllTableData(tableName) {
    const stmt = this.db.prepare(`SELECT * FROM ${tableName}`);
    const data = [];
    
    while (stmt.step()) {
      data.push(stmt.getAsObject());
    }
    stmt.free();
    
    return data;
  }

  // Utility methods
  generateSalt() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);
    return Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Database backup methods
  async downloadBackup() {
    const data = this.db.export();
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personal_finance_backup_${new Date().toISOString().split('T')[0]}.db`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async uploadBackup(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          this.db = new this.SQL.Database(data);
          this.saveToIndexedDB().then(() => {
            resolve({ success: true, message: 'Backup restaurado com sucesso' });
          });
        } catch (error) {
          reject(new Error('Arquivo de backup inválido'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsArrayBuffer(file);
    });
  }
}

const dbManager = new DatabaseManager();
export default dbManager;