/**
 * useCategories.js - Hook de Gestão de Categorias Personalizáveis
 * Personal Finance Flow - Sistema de Categorias Completo
 * 
 * Funcionalidades:
 * - CRUD completo de categorias personalizadas
 * - Integração com db-manager e sistema existente
 * - Compatibilidade com filtros e gráficos
 * - Validações robustas e tratamento de erros
 * - Performance otimizada com memoização
 * - Estados reativos para interface
 * 
 * Localização: C:\Personal_Finance_Flow\src\hooks\useCategories.js
 * Versão: Sistema de Categorias Personalizáveis
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import dbManager from '../db-manager.js';

// Cores padrão para novas categorias
const DEFAULT_COLORS = {
  income: [
    '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4', '#eab308', 
    '#ec4899', '#3b82f6', '#ef4444', '#84cc16', '#f97316'
  ],
  expenses: [
    '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981',
    '#f59e0b', '#06b6d4', '#eab308', '#84cc16', '#f97316'
  ]
};

// Ícones padrão disponíveis (Lucide React)
const AVAILABLE_ICONS = [
  'tag', 'folder', 'bookmark', 'star', 'heart', 'circle', 'square',
  'briefcase', 'laptop', 'trending-up', 'shopping-bag', 'award', 'plus-circle',
  'utensils', 'car', 'home', 'book-open', 'smile', 'shopping-cart', 'minus-circle',
  'credit-card', 'dollar-sign', 'piggy-bank', 'wallet', 'banknote', 'coins',
  'coffee', 'pizza', 'fuel', 'plane', 'train', 'bus', 'bicycle',
  'stethoscope', 'pill', 'dumbbell', 'graduation-cap', 'book', 'music',
  'gamepad-2', 'tv', 'phone', 'wifi', 'zap', 'droplets', 'wrench'
];

/**
 * Hook customizado para gerenciar categorias personalizáveis
 * Integra com db-manager e fornece interface reativa para componentes
 */
export const useCategories = () => {
  // Estados principais
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Estados para interface de edição
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' | 'edit'

  // Função para logging consistente
  const logCategory = useCallback((type, message, data = null) => {
    const timestamp = new Date().toISOString();
    const logPrefix = `[CATEGORIES ${timestamp}]`;
    
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
    }
  }, []);

  // Carregar todas as categorias
  const loadCategories = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      logCategory('info', 'Carregando categorias...');

      const categoriesData = await dbManager.getCategories();
      
      setCategories(categoriesData);
      setLastUpdated(new Date());
      
      logCategory('success', `${categoriesData.length} categorias carregadas`);

    } catch (error) {
      logCategory('error', 'Erro ao carregar categorias', error);
      setError('Falha ao carregar categorias: ' + error.message);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [logCategory]);

  // Carregar categorias na inicialização
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Obter categorias agrupadas por tipo (compatibilidade com sistema atual)
  const getCategoriesGrouped = useCallback(async () => {
    try {
      return await dbManager.getCategoriesGrouped();
    } catch (error) {
      logCategory('error', 'Erro ao agrupar categorias', error);
      return { income: [], expenses: [] };
    }
  }, [logCategory]);

  // Obter categorias por tipo
  const getCategoriesByType = useMemo(() => {
    const grouped = { income: [], expenses: [] };
    
    categories.forEach(category => {
      if (category.type === 'income' || category.type === 'expenses') {
        grouped[category.type].push(category);
      }
    });

    // Ordenar por sort_order, depois por nome
    Object.keys(grouped).forEach(type => {
      grouped[type].sort((a, b) => {
        if (a.sort_order !== b.sort_order) {
          return a.sort_order - b.sort_order;
        }
        return a.name.localeCompare(b.name);
      });
    });

    return grouped;
  }, [categories]);

  // Obter próxima cor disponível para tipo
  const getNextColor = useCallback((type) => {
    const usedColors = categories
      .filter(cat => cat.type === type)
      .map(cat => cat.color);
    
    const availableColors = DEFAULT_COLORS[type] || DEFAULT_COLORS.income;
    
    for (const color of availableColors) {
      if (!usedColors.includes(color)) {
        return color;
      }
    }
    
    // Se todas as cores estão em uso, retornar uma aleatória
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  }, [categories]);

  // Validar dados de categoria
  const validateCategory = useCallback((categoryData, isEdit = false) => {
    const errors = {};

    // Nome obrigatório
    if (!categoryData.name || !categoryData.name.trim()) {
      errors.name = 'Nome da categoria é obrigatório';
    } else if (categoryData.name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    } else if (categoryData.name.trim().length > 50) {
      errors.name = 'Nome deve ter no máximo 50 caracteres';
    }

    // Tipo obrigatório
    if (!categoryData.type || !['income', 'expenses'].includes(categoryData.type)) {
      errors.type = 'Tipo deve ser "income" ou "expenses"';
    }

    // Verificar duplicatas
    if (categoryData.name && categoryData.type) {
      const trimmedName = categoryData.name.trim();
      const duplicate = categories.find(cat => 
        cat.name.toLowerCase() === trimmedName.toLowerCase() && 
        cat.type === categoryData.type &&
        (!isEdit || cat.id !== categoryData.id)
      );
      
      if (duplicate) {
        errors.name = `Categoria "${trimmedName}" já existe para ${categoryData.type === 'income' ? 'receitas' : 'despesas'}`;
      }
    }

    // Cor válida
    if (categoryData.color && !/^#[0-9A-F]{6}$/i.test(categoryData.color)) {
      errors.color = 'Cor deve estar no formato hexadecimal (#RRGGBB)';
    }

    // Ícone válido
    if (categoryData.icon && !AVAILABLE_ICONS.includes(categoryData.icon)) {
      errors.icon = 'Ícone selecionado não está disponível';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, [categories]);

  // Adicionar nova categoria
  const addCategory = useCallback(async (categoryData) => {
    try {
      setIsUpdating(true);
      setError(null);

      // Validar dados
      const validation = validateCategory(categoryData);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors)[0];
        throw new Error(errorMessage);
      }

      // Preparar dados com valores padrão
      const newCategoryData = {
        name: categoryData.name.trim(),
        type: categoryData.type,
        color: categoryData.color || getNextColor(categoryData.type),
        icon: categoryData.icon || 'tag',
        sortOrder: categoryData.sortOrder || 0
      };

      logCategory('info', 'Criando nova categoria', newCategoryData);

      const result = await dbManager.addCategory(newCategoryData);
      
      if (result.success) {
        // Recarregar categorias
        await loadCategories(false);
        logCategory('success', 'Categoria criada com sucesso', result.category);
        return result;
      } else {
        throw new Error(result.message || 'Falha ao criar categoria');
      }

    } catch (error) {
      logCategory('error', 'Erro ao adicionar categoria', error);
      setError(error.message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [validateCategory, getNextColor, loadCategories, logCategory]);

  // Atualizar categoria existente
  const updateCategory = useCallback(async (categoryId, updateData) => {
    try {
      setIsUpdating(true);
      setError(null);

      // Encontrar categoria atual
      const currentCategory = categories.find(cat => cat.id === categoryId);
      if (!currentCategory) {
        throw new Error('Categoria não encontrada');
      }

      // Validar dados com contexto de edição
      const dataWithId = { ...currentCategory, ...updateData, id: categoryId };
      const validation = validateCategory(dataWithId, true);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors)[0];
        throw new Error(errorMessage);
      }

      // Preparar dados de atualização
      const cleanedUpdateData = {};
      if (updateData.name && updateData.name.trim() !== currentCategory.name) {
        cleanedUpdateData.name = updateData.name.trim();
      }
      if (updateData.color && updateData.color !== currentCategory.color) {
        cleanedUpdateData.color = updateData.color;
      }
      if (updateData.icon && updateData.icon !== currentCategory.icon) {
        cleanedUpdateData.icon = updateData.icon;
      }
      if (updateData.sortOrder !== undefined && updateData.sortOrder !== currentCategory.sort_order) {
        cleanedUpdateData.sort_order = updateData.sortOrder;
      }
      if (updateData.isActive !== undefined && updateData.isActive !== currentCategory.is_active) {
        cleanedUpdateData.is_active = updateData.isActive ? 1 : 0;
      }

      if (Object.keys(cleanedUpdateData).length === 0) {
        throw new Error('Nenhuma alteração detectada');
      }

      logCategory('info', 'Atualizando categoria', { id: categoryId, changes: cleanedUpdateData });

      const result = await dbManager.updateCategory(categoryId, cleanedUpdateData);
      
      if (result.success) {
        // Recarregar categorias
        await loadCategories(false);
        logCategory('success', 'Categoria atualizada com sucesso');
        return result;
      } else {
        throw new Error(result.message || 'Falha ao atualizar categoria');
      }

    } catch (error) {
      logCategory('error', 'Erro ao atualizar categoria', error);
      setError(error.message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [categories, validateCategory, loadCategories, logCategory]);

  // Excluir categoria
  const deleteCategory = useCallback(async (categoryId) => {
    try {
      setIsUpdating(true);
      setError(null);

      const category = categories.find(cat => cat.id === categoryId);
      if (!category) {
        throw new Error('Categoria não encontrada');
      }

      logCategory('info', 'Excluindo categoria', category);

      const result = await dbManager.deleteCategory(categoryId);
      
      if (result.success) {
        // Recarregar categorias
        await loadCategories(false);
        logCategory('success', result.message, { type: result.type });
        return result;
      } else {
        throw new Error(result.message || 'Falha ao excluir categoria');
      }

    } catch (error) {
      logCategory('error', 'Erro ao excluir categoria', error);
      setError(error.message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [categories, loadCategories, logCategory]);

  // Reordenar categorias (drag & drop)
  const reorderCategories = useCallback(async (categoryOrders) => {
    try {
      setIsUpdating(true);
      setError(null);

      if (!Array.isArray(categoryOrders) || categoryOrders.length === 0) {
        throw new Error('Lista de ordenação inválida');
      }

      logCategory('info', 'Reordenando categorias', categoryOrders);

      const result = await dbManager.reorderCategories(categoryOrders);
      
      if (result.success) {
        // Recarregar categorias para refletir nova ordem
        await loadCategories(false);
        logCategory('success', 'Categorias reordenadas com sucesso');
        return result;
      } else {
        throw new Error(result.message || 'Falha ao reordenar categorias');
      }

    } catch (error) {
      logCategory('error', 'Erro ao reordenar categorias', error);
      setError(error.message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [loadCategories, logCategory]);

  // Obter estatísticas de uso das categorias
  const getCategoryStats = useCallback(async (type = null) => {
    try {
      logCategory('info', 'Carregando estatísticas de categorias', { type });
      
      const stats = await dbManager.getCategoryUsageStats(type);
      
      logCategory('success', `${stats.length} estatísticas carregadas`);
      return stats;

    } catch (error) {
      logCategory('error', 'Erro ao carregar estatísticas', error);
      throw error;
    }
  }, [logCategory]);

  // Funções de controle da interface
  const startAddCategory = useCallback((type = 'income') => {
    setEditingCategory({
      name: '',
      type,
      color: getNextColor(type),
      icon: 'tag',
      sortOrder: 0
    });
    setFormMode('add');
    setShowCategoryForm(true);
    setError(null);
  }, [getNextColor]);

  const startEditCategory = useCallback((category) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
      sortOrder: category.sort_order,
      isActive: category.is_active === 1
    });
    setFormMode('edit');
    setShowCategoryForm(true);
    setError(null);
  }, []);

  const cancelCategoryForm = useCallback(() => {
    setEditingCategory(null);
    setShowCategoryForm(false);
    setFormMode('add');
    setError(null);
  }, []);

  // Submeter formulário (add ou edit)
  const submitCategoryForm = useCallback(async (categoryData) => {
    try {
      if (formMode === 'add') {
        const result = await addCategory(categoryData);
        cancelCategoryForm();
        return result;
      } else if (formMode === 'edit' && editingCategory?.id) {
        const result = await updateCategory(editingCategory.id, categoryData);
        cancelCategoryForm();
        return result;
      } else {
        throw new Error('Modo de formulário inválido');
      }
    } catch (error) {
      // Erro já logado nas funções individuais
      throw error;
    }
  }, [formMode, editingCategory, addCategory, updateCategory, cancelCategoryForm]);

  // Utilitários memoizados
  const categoryUtils = useMemo(() => ({
    // Obter categoria por nome e tipo
    getCategoryByName: (name, type) => {
      return categories.find(cat => 
        cat.name.toLowerCase() === name.toLowerCase() && 
        cat.type === type
      );
    },

    // Verificar se categoria existe
    categoryExists: (name, type, excludeId = null) => {
      return categories.some(cat => 
        cat.name.toLowerCase() === name.toLowerCase() && 
        cat.type === type &&
        (excludeId === null || cat.id !== excludeId)
      );
    },

    // Obter categorias ativas
    getActiveCategories: (type = null) => {
      return categories.filter(cat => 
        cat.is_active === 1 && 
        (type === null || cat.type === type)
      );
    },

    // Obter categorias padrão
    getDefaultCategories: (type = null) => {
      return categories.filter(cat => 
        cat.is_default === 1 && 
        (type === null || cat.type === type)
      );
    },

    // Formatar nome para exibição
    formatCategoryName: (name) => {
      return name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : '';
    }
  }), [categories]);

  // Estado de carregamento geral
  const isBusy = isLoading || isUpdating;

  // Retornar interface do hook
  return {
    // Estados principais
    categories,
    isLoading,
    isUpdating,
    isBusy,
    error,
    lastUpdated,

    // Estados da interface
    editingCategory,
    showCategoryForm,
    formMode,

    // Dados processados
    categoriesByType: getCategoriesByType,

    // Funções principais
    loadCategories,
    getCategoriesGrouped,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    getCategoryStats,

    // Controle da interface
    startAddCategory,
    startEditCategory,
    cancelCategoryForm,
    submitCategoryForm,

    // Utilitários
    ...categoryUtils,
    
    // Configurações
    availableIcons: AVAILABLE_ICONS,
    defaultColors: DEFAULT_COLORS,
    getNextColor,
    validateCategory,

    // Controle de erro
    clearError: () => setError(null)
  };
};