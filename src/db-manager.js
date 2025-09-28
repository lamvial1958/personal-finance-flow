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
      
      // NOVO: Migrar categorias padrão se necessário
      await this.migrateDefaultCategories();
      
      // Save to IndexedDB after initialization
      await this.saveToIndexedDB();
      
      this.isInitialized = true;
      console.log('✅ Database Manager inicializado com sistema de categorias');
      
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
      )`,

      // NOVO: Custom categories table
      `CREATE TABLE IF NOT EXISTS custom_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('income', 'expenses')),
        color TEXT DEFAULT '#6b7280',
        icon TEXT DEFAULT 'tag',
        is_default BOOLEAN DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(name, type)
      )`
    ];

    tables.forEach(sql => {
      this.db.run(sql);
    });

    console.log('✅ Tabelas criadas/verificadas incluindo custom_categories');
  }

  // NOVO: Migração automática das categorias padrão
  async migrateDefaultCategories() {
    try {
      // Verificar se já foram migradas
      const checkStmt = this.db.prepare('SELECT COUNT(*) as count FROM custom_categories WHERE is_default = 1');
      checkStmt.step();
      const result = checkStmt.getAsObject();
      checkStmt.free();

      if (result.count > 0) {
        console.log('✅ Categorias padrão já migradas');
        return;
      }

      console.log('🔄 Migrando categorias padrão para sistema personalizável...');

      // Categorias padrão do sistema atual
      const defaultCategories = [
        // Receitas
        { name: 'Salário', type: 'income', color: '#10b981', icon: 'briefcase', sort_order: 1 },
        { name: 'Freelance', type: 'income', color: '#8b5cf6', icon: 'laptop', sort_order: 2 },
        { name: 'Investimentos', type: 'income', color: '#f59e0b', icon: 'trending-up', sort_order: 3 },
        { name: 'Vendas', type: 'income', color: '#06b6d4', icon: 'shopping-bag', sort_order: 4 },
        { name: 'Prêmio', type: 'income', color: '#eab308', icon: 'award', sort_order: 5 },
        { name: 'Outros', type: 'income', color: '#6b7280', icon: 'plus-circle', sort_order: 99 },
        
        // Despesas
        { name: 'Alimentação', type: 'expenses', color: '#ef4444', icon: 'utensils', sort_order: 1 },
        { name: 'Transporte', type: 'expenses', color: '#3b82f6', icon: 'car', sort_order: 2 },
        { name: 'Moradia', type: 'expenses', color: '#8b5cf6', icon: 'home', sort_order: 3 },
        { name: 'Saúde', type: 'expenses', color: '#ec4899', icon: 'heart', sort_order: 4 },
        { name: 'Educação', type: 'expenses', color: '#10b981', icon: 'book-open', sort_order: 5 },
        { name: 'Lazer', type: 'expenses', color: '#f59e0b', icon: 'smile', sort_order: 6 },
        { name: 'Compras', type: 'expenses', color: '#06b6d4', icon: 'shopping-cart', sort_order: 7 },
        { name: 'Outros', type: 'expenses', color: '#6b7280', icon: 'minus-circle', sort_order: 99 }
      ];

      // Inserir categorias padrão
      defaultCategories.forEach(category => {
        this.db.run(
          `INSERT INTO custom_categories (name, type, color, icon, is_default, sort_order) 
           VALUES (?, ?, ?, ?, 1, ?)`,
          [category.name, category.type, category.color, category.icon, category.sort_order]
        );
      });

      console.log('✅ Categorias padrão migradas com sucesso');

    } catch (error) {
      console.error('❌ Erro na migração de categorias:', error);
      // Não falhar a inicialização por causa da migração
    }
  }

  // NOVO: Métodos CRUD para categorias personalizáveis

  /**
   * Obter todas as categorias ou filtradas por tipo
   * @param {string} type - 'income', 'expenses' ou null para todas
   * @param {boolean} activeOnly - Se true, retorna apenas categorias ativas
   * @returns {Array} Lista de categorias
   */
  async getCategories(type = null, activeOnly = true) {
    try {
      let sql = 'SELECT * FROM custom_categories';
      const conditions = [];
      const params = [];

      if (activeOnly) {
        conditions.push('is_active = 1');
      }

      if (type) {
        conditions.push('type = ?');
        params.push(type);
      }

      if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
      }

      sql += ' ORDER BY sort_order ASC, name ASC';

      const stmt = this.db.prepare(sql);
      if (params.length > 0) {
        stmt.bind(params);
      }

      const categories = [];
      while (stmt.step()) {
        categories.push(stmt.getAsObject());
      }
      stmt.free();

      return categories;

    } catch (error) {
      console.error('❌ Erro ao obter categorias:', error);
      throw new Error('Falha ao carregar categorias: ' + error.message);
    }
  }

  /**
   * Obter categorias organizadas por tipo (formato compatível com sistema atual)
   * @returns {Object} { income: Array, expenses: Array }
   */
  async getCategoriesGrouped() {
    try {
      const allCategories = await this.getCategories();
      
      const grouped = {
        income: [],
        expenses: []
      };

      allCategories.forEach(category => {
        if (category.type === 'income' || category.type === 'expenses') {
          grouped[category.type].push(category.name);
        }
      });

      return grouped;

    } catch (error) {
      console.error('❌ Erro ao agrupar categorias:', error);
      throw new Error('Falha ao agrupar categorias: ' + error.message);
    }
  }

  /**
   * Adicionar nova categoria personalizada
   * @param {Object} categoryData - Dados da categoria
   * @returns {Object} Resultado da operação
   */
  async addCategory(categoryData) {
    try {
      const { name, type, color = '#6b7280', icon = 'tag', sortOrder = 0 } = categoryData;

      // Validações
      if (!name || !name.trim()) {
        throw new Error('Nome da categoria é obrigatório');
      }

      if (!['income', 'expenses'].includes(type)) {
        throw new Error('Tipo deve ser "income" ou "expenses"');
      }

      const trimmedName = name.trim();

      // Verificar se categoria já existe para este tipo
      const existsStmt = this.db.prepare('SELECT id FROM custom_categories WHERE LOWER(name) = LOWER(?) AND type = ?');
      existsStmt.bind([trimmedName, type]);
      const exists = existsStmt.step();
      existsStmt.free();

      if (exists) {
        throw new Error(`Categoria "${trimmedName}" já existe para ${type === 'income' ? 'receitas' : 'despesas'}`);
      }

      // Inserir nova categoria
      this.db.run(
        `INSERT INTO custom_categories (name, type, color, icon, is_default, sort_order) 
         VALUES (?, ?, ?, ?, 0, ?)`,
        [trimmedName, type, color, icon, sortOrder]
      );

      await this.saveToIndexedDB();

      console.log('✅ Nova categoria adicionada:', trimmedName);
      return { 
        success: true, 
        message: `Categoria "${trimmedName}" criada com sucesso`,
        category: { name: trimmedName, type, color, icon }
      };

    } catch (error) {
      console.error('❌ Erro ao adicionar categoria:', error);
      throw new Error('Falha ao criar categoria: ' + error.message);
    }
  }

  /**
   * Atualizar categoria existente
   * @param {number} categoryId - ID da categoria
   * @param {Object} updateData - Dados para atualizar
   * @returns {Object} Resultado da operação
   */
  async updateCategory(categoryId, updateData) {
    try {
      // Verificar se categoria existe
      const checkStmt = this.db.prepare('SELECT * FROM custom_categories WHERE id = ?');
      checkStmt.bind([categoryId]);
      let existingCategory = null;
      if (checkStmt.step()) {
        existingCategory = checkStmt.getAsObject();
      }
      checkStmt.free();

      if (!existingCategory) {
        throw new Error('Categoria não encontrada');
      }

      // Validar dados de atualização
      const allowedFields = ['name', 'color', 'icon', 'sort_order', 'is_active'];
      const updateFields = [];
      const updateValues = [];

      Object.entries(updateData).forEach(([field, value]) => {
        if (allowedFields.includes(field) && value !== undefined) {
          if (field === 'name' && (!value || !value.trim())) {
            throw new Error('Nome da categoria não pode estar vazio');
          }
          
          updateFields.push(`${field} = ?`);
          updateValues.push(field === 'name' ? value.trim() : value);
        }
      });

      if (updateFields.length === 0) {
        throw new Error('Nenhum campo válido para atualizar');
      }

      // Verificar duplicatas se nome está sendo alterado
      if (updateData.name && updateData.name.trim() !== existingCategory.name) {
        const duplicateStmt = this.db.prepare(
          'SELECT id FROM custom_categories WHERE LOWER(name) = LOWER(?) AND type = ? AND id != ?'
        );
        duplicateStmt.bind([updateData.name.trim(), existingCategory.type, categoryId]);
        const hasDuplicate = duplicateStmt.step();
        duplicateStmt.free();

        if (hasDuplicate) {
          throw new Error(`Categoria "${updateData.name.trim()}" já existe para este tipo`);
        }
      }

      // Adicionar timestamp de atualização
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(categoryId);

      // Executar atualização
      const updateSQL = `UPDATE custom_categories SET ${updateFields.join(', ')} WHERE id = ?`;
      this.db.run(updateSQL, updateValues);

      await this.saveToIndexedDB();

      console.log('✅ Categoria atualizada:', categoryId);
      return { 
        success: true, 
        message: 'Categoria atualizada com sucesso'
      };

    } catch (error) {
      console.error('❌ Erro ao atualizar categoria:', error);
      throw new Error('Falha ao atualizar categoria: ' + error.message);
    }
  }

  /**
   * Excluir categoria (soft delete se usada em transações)
   * @param {number} categoryId - ID da categoria
   * @returns {Object} Resultado da operação
   */
  async deleteCategory(categoryId) {
    try {
      // Verificar se categoria existe
      const checkStmt = this.db.prepare('SELECT * FROM custom_categories WHERE id = ?');
      checkStmt.bind([categoryId]);
      let category = null;
      if (checkStmt.step()) {
        category = checkStmt.getAsObject();
      }
      checkStmt.free();

      if (!category) {
        throw new Error('Categoria não encontrada');
      }

      // Não permitir exclusão de categorias padrão ativas
      if (category.is_default === 1) {
        throw new Error('Categorias padrão não podem ser excluídas');
      }

      // Verificar se categoria está sendo usada em transações
      const usageStmt = this.db.prepare('SELECT COUNT(*) as count FROM transactions WHERE category = ?');
      usageStmt.bind([category.name]);
      usageStmt.step();
      const usage = usageStmt.getAsObject();
      usageStmt.free();

      if (usage.count > 0) {
        // Soft delete - marcar como inativa
        this.db.run(
          'UPDATE custom_categories SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [categoryId]
        );
        
        await this.saveToIndexedDB();
        
        return { 
          success: true, 
          message: `Categoria "${category.name}" foi desativada pois está sendo usada em ${usage.count} transação(ões)`,
          type: 'deactivated'
        };
      } else {
        // Hard delete - remover completamente
        this.db.run('DELETE FROM custom_categories WHERE id = ?', [categoryId]);
        
        await this.saveToIndexedDB();
        
        return { 
          success: true, 
          message: `Categoria "${category.name}" foi excluída permanentemente`,
          type: 'deleted'
        };
      }

    } catch (error) {
      console.error('❌ Erro ao excluir categoria:', error);
      throw new Error('Falha ao excluir categoria: ' + error.message);
    }
  }

  /**
   * Reordenar categorias
   * @param {Array} categoryOrders - Array de { id, sortOrder }
   * @returns {Object} Resultado da operação
   */
  async reorderCategories(categoryOrders) {
    try {
      if (!Array.isArray(categoryOrders) || categoryOrders.length === 0) {
        throw new Error('Lista de ordenação inválida');
      }

      // Atualizar ordem de cada categoria
      categoryOrders.forEach(({ id, sortOrder }) => {
        if (typeof id === 'number' && typeof sortOrder === 'number') {
          this.db.run(
            'UPDATE custom_categories SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [sortOrder, id]
          );
        }
      });

      await this.saveToIndexedDB();

      console.log('✅ Categorias reordenadas');
      return { 
        success: true, 
        message: 'Ordem das categorias atualizada com sucesso' 
      };

    } catch (error) {
      console.error('❌ Erro ao reordenar categorias:', error);
      throw new Error('Falha ao reordenar categorias: ' + error.message);
    }
  }

  /**
   * Obter estatísticas de uso das categorias
   * @param {string} type - 'income', 'expenses' ou null para todas
   * @returns {Array} Estatísticas de uso
   */
  async getCategoryUsageStats(type = null) {
    try {
      let sql = `
        SELECT 
          c.id,
          c.name,
          c.type,
          c.color,
          c.icon,
          COALESCE(COUNT(t.id), 0) as usage_count,
          COALESCE(SUM(t.amount), 0) as total_amount,
          COALESCE(AVG(t.amount), 0) as avg_amount,
          MAX(t.date) as last_used
        FROM custom_categories c
        LEFT JOIN transactions t ON c.name = t.category AND c.type = t.type
        WHERE c.is_active = 1
      `;

      const params = [];
      if (type) {
        sql += ' AND c.type = ?';
        params.push(type);
      }

      sql += ' GROUP BY c.id ORDER BY usage_count DESC, c.sort_order ASC';

      const stmt = this.db.prepare(sql);
      if (params.length > 0) {
        stmt.bind(params);
      }

      const stats = [];
      while (stmt.step()) {
        stats.push(stmt.getAsObject());
      }
      stmt.free();

      return stats;

    } catch (error) {
      console.error('❌ Erro ao obter estatísticas de categorias:', error);
      throw new Error('Falha ao obter estatísticas: ' + error.message);
    }
  }

  // Métodos existentes preservados sem alteração...

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

  async updateTransaction(id, updatedFields) {
    console.log('🔍 DEBUG updateTransaction - ID recebido:', id, 'campos:', updatedFields);
    
    // Verificar se transação existe antes de atualizar
    const checkStmt = this.db.prepare('SELECT * FROM transactions WHERE id = ?');
    checkStmt.bind([id]);
    let exists = null;
    if (checkStmt.step()) {
      exists = checkStmt.getAsObject();
    }
    checkStmt.free();
    
    console.log('🔍 DEBUG - Transação com ID', id, 'existe?', exists);
    
    if (!exists) {
      throw new Error('Transaction not found');
    }
    
    // Construir query de UPDATE dinamicamente
    const allowedFields = ['date', 'type', 'amount', 'description', 'category'];
    const updateFields = [];
    const updateValues = [];
    
    Object.entries(updatedFields).forEach(([field, value]) => {
      if (allowedFields.includes(field)) {
        updateFields.push(`${field} = ?`);
        updateValues.push(value);
      }
    });
    
    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    // Adicionar ID no final dos valores para WHERE clause
    updateValues.push(id);
    
    try {
      const updateSQL = `UPDATE transactions SET ${updateFields.join(', ')} WHERE id = ?`;
      console.log('🔍 DEBUG - SQL executado:', updateSQL, 'valores:', updateValues);
      
      this.db.run(updateSQL, updateValues);
      
      // Verificar se foi realmente atualizado
      const checkAfterStmt = this.db.prepare('SELECT * FROM transactions WHERE id = ?');
      checkAfterStmt.bind([id]);
      let updatedTransaction = null;
      if (checkAfterStmt.step()) {
        updatedTransaction = checkAfterStmt.getAsObject();
      }
      checkAfterStmt.free();
      
      console.log('🔍 DEBUG - Transação após UPDATE:', updatedTransaction);
      
      await this.saveToIndexedDB();
      console.log('✅ DEBUG - Transação atualizada com sucesso!');
      
      return { message: 'Transaction updated successfully', transaction: updatedTransaction };
      
    } catch (error) {
      console.error('❌ DEBUG - Erro no UPDATE:', error);
      throw new Error('Failed to update transaction: ' + error.message);
    }
  }

  async deleteTransaction(id) {
    console.log('🔍 DEBUG deleteTransaction - ID recebido:', id, 'tipo:', typeof id);
    
    // Listar TODAS as transações para debug
    const allStmt = this.db.prepare('SELECT * FROM transactions');
    const allTransactions = [];
    while (allStmt.step()) {
      allTransactions.push(allStmt.getAsObject());
    }
    allStmt.free();
    console.log('🔍 DEBUG - TODAS as transações no banco:', allTransactions);
    
    // Verificar se transação existe antes de deletar
    const checkStmt = this.db.prepare('SELECT * FROM transactions WHERE id = ?');
    checkStmt.bind([id]);
    let exists = null;
    if (checkStmt.step()) {
      exists = checkStmt.getAsObject();
    }
    checkStmt.free();
    
    console.log('🔍 DEBUG - Transação com ID', id, 'existe?', exists);
    
    if (!exists) {
      throw new Error('Transaction not found');
    }
    
    try {
      const deleteSQL = `DELETE FROM transactions WHERE id = ${id}`;
      console.log('🔍 DEBUG - SQL executado:', deleteSQL);
      
      this.db.exec(deleteSQL);
      
      // Verificar se foi realmente deletado
      const checkAfterStmt = this.db.prepare('SELECT * FROM transactions WHERE id = ?');
      checkAfterStmt.bind([id]);
      let stillExists = false;
      if (checkAfterStmt.step()) {
        stillExists = checkAfterStmt.getAsObject();
      }
      checkAfterStmt.free();
      
      console.log('🔍 DEBUG - Transação ainda existe após DELETE?', stillExists);
      
      if (stillExists) {
        throw new Error('Failed to delete transaction');
      }
      
      await this.saveToIndexedDB();
      console.log('✅ DEBUG - Transação deletada com sucesso!');
      
      return { message: 'Transaction deleted successfully' };
      
    } catch (error) {
      console.error('❌ DEBUG - Erro no DELETE:', error);
      throw new Error('Failed to delete transaction: ' + error.message);
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
    const [transactions, balances, movements, categories] = await Promise.all([
      this.getAllTableData('transactions'),
      this.getAllTableData('initial_balances'),
      this.getAllTableData('investment_movements'),
      this.getAllTableData('custom_categories')
    ]);

    return {
      timestamp: new Date().toISOString(),
      database: 'SQLite WebAssembly',
      data: {
        transactions,
        initialBalances: balances,
        investmentMovements: movements,
        customCategories: categories
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