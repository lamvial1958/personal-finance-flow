/**
 * CategoryManager.jsx - Interface de Gestão de Categorias Personalizáveis
 * Personal Finance Flow - Sistema de Categorias Completo
 * 
 * Funcionalidades:
 * - Interface visual para CRUD de categorias
 * - Formulário inline para adicionar/editar categorias
 * - Drag & drop para reordenação (futuro)
 * - Estatísticas de uso por categoria
 * - Suporte completo ao modo escuro
 * - Design responsivo e acessível
 * 
 * Localização: C:\Personal_Finance_Flow\src\components\Configuration\CategoryManager.jsx
 * Sistema de Categorias Personalizáveis
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useTheme } from '../../hooks/useTheme';

// Mapeamento de ícones Lucide React para componentes
const IconMap = {
  'tag': '🏷️', 'folder': '📁', 'bookmark': '🔖', 'star': '⭐', 'heart': '❤️',
  'circle': '⚪', 'square': '⬜', 'briefcase': '💼', 'laptop': '💻', 
  'trending-up': '📈', 'shopping-bag': '🛍️', 'award': '🏆', 'plus-circle': '➕',
  'utensils': '🍽️', 'car': '🚗', 'home': '🏠', 'book-open': '📖', 
  'smile': '😊', 'shopping-cart': '🛒', 'minus-circle': '➖',
  'credit-card': '💳', 'dollar-sign': '💲', 'piggy-bank': '🐷', 'wallet': '👛',
  'banknote': '💴', 'coins': '🪙', 'coffee': '☕', 'pizza': '🍕', 'fuel': '⛽',
  'plane': '✈️', 'train': '🚆', 'bus': '🚌', 'bicycle': '🚲',
  'stethoscope': '🩺', 'pill': '💊', 'dumbbell': '🏋️', 'graduation-cap': '🎓',
  'book': '📚', 'music': '🎵', 'gamepad-2': '🎮', 'tv': '📺', 'phone': '📱',
  'wifi': '📶', 'zap': '⚡', 'droplets': '💧', 'wrench': '🔧'
};

const CategoryManager = () => {
  const { isDark } = useTheme();
  const {
    categories,
    categoriesByType,
    isLoading,
    isUpdating,
    error,
    showCategoryForm,
    formMode,
    editingCategory,
    availableIcons,
    defaultColors,
    startAddCategory,
    startEditCategory,
    cancelCategoryForm,
    submitCategoryForm,
    deleteCategory,
    getCategoryStats,
    clearError
  } = useCategories();

  // Estados locais
  const [activeTab, setActiveTab] = useState('income');
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Estados do formulário
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    icon: 'tag'
  });

  // Inicializar formulário quando editingCategory mudar
  React.useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name || '',
        color: editingCategory.color || defaultColors[activeTab][0],
        icon: editingCategory.icon || 'tag'
      });
    } else {
      setFormData({
        name: '',
        color: defaultColors[activeTab][0],
        icon: 'tag'
      });
    }
  }, [editingCategory, activeTab, defaultColors]);

  // Limpar erro quando mudar de aba
  React.useEffect(() => {
    clearError();
  }, [activeTab, clearError]);

  // Carregar estatísticas
  const loadStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const categoryStats = await getCategoryStats();
      setStats(categoryStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  }, [getCategoryStats]);

  // Alternar exibição de estatísticas
  const toggleStats = useCallback(() => {
    if (!showStats && stats.length === 0) {
      loadStats();
    }
    setShowStats(!showStats);
  }, [showStats, stats.length, loadStats]);

  // Atualizar campo do formulário
  const updateFormField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Submeter formulário
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      const categoryData = {
        ...formData,
        type: activeTab,
        name: formData.name.trim()
      };

      await submitCategoryForm(categoryData);
      
      // Resetar formulário
      setFormData({
        name: '',
        color: defaultColors[activeTab][0],
        icon: 'tag'
      });

    } catch (error) {
      // Erro já tratado no hook
      console.error('Erro no formulário:', error);
    }
  }, [formData, activeTab, submitCategoryForm, defaultColors]);

  // Confirmar exclusão
  const handleDelete = useCallback(async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
    }
  }, [deleteCategory]);

  // Categorias filtradas por aba ativa
  const activeCategories = useMemo(() => {
    return categoriesByType[activeTab] || [];
  }, [categoriesByType, activeTab]);

  // Estatísticas filtradas por aba ativa
  const activeStats = useMemo(() => {
    return stats.filter(stat => stat.type === activeTab);
  }, [stats, activeTab]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">Carregando categorias...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Gerenciar Categorias
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Personalize as categorias para suas transações
          </p>
        </div>
        <button
          onClick={toggleStats}
          className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {showStats ? 'Ocultar' : 'Ver'} Estatísticas
        </button>
      </div>

      {/* Abas de Tipo */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('income')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'income'
              ? 'bg-white dark:bg-gray-700 text-green-700 dark:text-green-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Receitas ({categoriesByType.income?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'expenses'
              ? 'bg-white dark:bg-gray-700 text-red-700 dark:text-red-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Despesas ({categoriesByType.expenses?.length || 0})
        </button>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      {showStats && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
            Estatísticas de Uso - {activeTab === 'income' ? 'Receitas' : 'Despesas'}
          </h4>
          
          {loadingStats ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Carregando...</span>
            </div>
          ) : activeStats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeStats.map(stat => (
                <div key={stat.id} className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <span style={{ color: stat.color }}>{IconMap[stat.icon] || '🏷️'}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{stat.name}</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div>Uso: {stat.usage_count} vezes</div>
                    <div>Total: ${Number(stat.total_amount).toFixed(2)}</div>
                    {stat.last_used && <div>Último uso: {new Date(stat.last_used).toLocaleDateString('pt-BR')}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">Nenhuma estatística disponível</p>
          )}
        </div>
      )}

      {/* Lista de Categorias */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">
              Categorias de {activeTab === 'income' ? 'Receitas' : 'Despesas'}
            </h4>
            <button
              onClick={() => startAddCategory(activeTab)}
              disabled={isUpdating}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Adicionar Categoria
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {activeCategories.length > 0 ? (
            activeCategories.map(category => (
              <div key={category.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: category.color }}
                    >
                      {IconMap[category.icon] || '🏷️'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {category.name}
                        </span>
                        {category.is_default === 1 && (
                          <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                            Padrão
                          </span>
                        )}
                        {category.is_active === 0 && (
                          <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                            Inativa
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Cor: {category.color} • Ícone: {category.icon}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startEditCategory(category)}
                      disabled={isUpdating}
                      className="px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded disabled:opacity-50 transition-colors"
                    >
                      Editar
                    </button>
                    {category.is_default !== 1 && (
                      <button
                        onClick={() => setDeleteConfirm(category)}
                        disabled={isUpdating}
                        className="px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded disabled:opacity-50 transition-colors"
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma categoria encontrada para {activeTab === 'income' ? 'receitas' : 'despesas'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Formulário de Categoria */}
      {showCategoryForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">
              {formMode === 'add' ? 'Adicionar' : 'Editar'} Categoria
            </h4>
            <button
              onClick={cancelCategoryForm}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome da Categoria
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormField('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite o nome da categoria"
                required
                minLength={2}
                maxLength={50}
              />
            </div>

            {/* Cor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cor
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => updateFormField('color', e.target.value)}
                  className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => updateFormField('color', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#000000"
                  pattern="^#[0-9A-Fa-f]{6}$"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {defaultColors[activeTab].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => updateFormField('color', color)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      formData.color === color 
                        ? 'border-gray-400 dark:border-gray-500' 
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Ícone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ícone
              </label>
              <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2">
                {availableIcons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => updateFormField('icon', icon)}
                    className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${
                      formData.icon === icon 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                    title={icon}
                  >
                    {IconMap[icon] || '🏷️'}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview
              </label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: formData.color }}
                >
                  {IconMap[formData.icon] || '🏷️'}
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formData.name || 'Nome da categoria'}
                </span>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={cancelCategoryForm}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isUpdating || !formData.name.trim()}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isUpdating ? 'Salvando...' : (formMode === 'add' ? 'Adicionar' : 'Salvar')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Confirmar Exclusão
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Tem certeza que deseja excluir a categoria "{deleteConfirm.name}"?
              Esta ação não pode ser desfeita.
            </p>
            
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={isUpdating}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isUpdating ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;