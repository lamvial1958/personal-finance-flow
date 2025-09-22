# SUPER PROMPT PARA NOVA SESSÃO: PERSONAL FINANCE FLOW PWA

## CONTEXTO DO PROJETO

Sou desenvolvedor do **Personal Finance Flow**, uma Progressive Web App (PWA) completa para controle financeiro pessoal. O projeto está **100% FUNCIONAL** e pronto para produção. Preciso de ajuda para continuar o desenvolvimento, melhorias ou deployment.

## TECNOLOGIAS E ARQUITETURA IMPLEMENTADAS

### Stack Técnico FUNCIONANDO:
- **Frontend**: React 18 + Vite 5
- **Styling**: Tailwind CSS (via CDN)
- **Database**: SQLite WebAssembly (sql.js) - carregado via script global CDN
- **Persistência**: IndexedDB para armazenamento offline
- **PWA**: Service Worker + Web App Manifest
- **Segurança**: SHA-256 + Salt para autenticação

### Arquitetura de Dados:
```
React App ──▶ DatabaseManager ──▶ SQLite WASM (in-memory)
    │               │                      │
    └──────▶ IndexedDB (persistência) ◀────┘
```

## STATUS ATUAL - TUDO FUNCIONANDO ✅

### Funcionalidades Implementadas:
1. **Sistema de Autenticação**: Configuração de senha, login, alteração de senha
2. **Controle de Transações**: CRUD completo de receitas/despesas com categorias
3. **Gestão de Investimentos**: Saldos iniciais + movimentações
4. **Relatórios**: Relatório anual detalhado com análises
5. **PWA**: Instalável, offline, responsivo
6. **Backup**: Export/import de dados

### Problemas Críticos JÁ RESOLVIDOS:
1. **sql.js + Vite integration**: Resolvido com script loading global + `optimizeDeps.exclude`
2. **IndexedDB version conflicts**: Resolvido com detecção automática de versão
3. **SQL queries vazias**: Resolvido adicionando `step()` antes de `getAsObject()`
4. **Duplicação de métodos**: Corrigido método `login` duplicado

## ESTRUTURA DE ARQUIVOS ATUAL

```
C:\Personal_Finance_Flow\personal-finance-pwa\
├── vite.config.js          # ✅ Configurado com optimizeDeps.exclude: ['sql.js']
├── src/
│   ├── db-manager.js       # ✅ FUNCIONANDO - SQLite + IndexedDB
│   ├── App.jsx             # ✅ Interface React completa
│   └── main.jsx            # ✅ Entry point + Service Worker
├── public/
│   ├── manifest.json       # ✅ PWA manifest
│   └── icon-*.png          # ⚠️ Precisa ajustar tamanhos (192x192, 512x512)
└── package.json            # ✅ Dependências instaladas
```

## CONFIGURAÇÕES TÉCNICAS IMPORTANTES

### vite.config.js:
```javascript
optimizeDeps: {
  exclude: ['sql.js']  // CRÍTICO: Não remover
}
```

### db-manager.js - Método de Import sql.js:
```javascript
// Script loading global (FUNCIONA)
if (!window.initSqlJs) {
  await this.loadSqlJsScript();
}
this.SQL = await window.initSqlJs({
  locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
});
```

### Database Schema:
```sql
app_auth (id PRIMARY KEY CHECK(id=1), password_hash, salt, created_at, updated_at)
transactions (id, date, type, amount, description, category, created_at)
initial_balances (id, investment_type UNIQUE, amount, updated_at)
investment_movements (id, date, investment_type, amount, description, created_at)
```

## COMANDO PARA RODAR

```bash
cd C:\Personal_Finance_Flow\personal-finance-pwa
npm run dev
# Aplicação rodando em http://localhost:5173
```

## POSSÍVEIS PRÓXIMOS PASSOS

### Para Produção:
1. **Build**: `npm run build` + deploy para hosting com HTTPS
2. **Ícones PWA**: Ajustar tamanhos corretos (192x192, 512x512)
3. **Tailwind**: Migrar de CDN para instalação local
4. **Forms**: Envolver campos de senha em `<form>` tags

### Melhorias Funcionais:
1. **Gráficos**: Adicionar charts com bibliotecas como Chart.js
2. **Export**: Melhorar exports (Excel, CSV)
3. **Categorias**: Sistema de categorias personalizáveis
4. **Sync**: Sincronização opcional em nuvem
5. **Mobile**: Melhorias de UX mobile

### Melhorias Técnicas:
1. **TypeScript**: Migração para TS
2. **Testes**: Jest + Testing Library
3. **Estado**: Zustand ou Redux para estado global
4. **Performance**: Análise e otimizações

## INFORMAÇÕES CRÍTICAS

### ⚠️ NUNCA ALTERAR:
- `optimizeDeps.exclude: ['sql.js']` no vite.config.js
- Script loading global do sql.js (não usar dynamic import)
- Método `step()` antes de `getAsObject()` nas queries SQL
- Estrutura de sincronização SQLite ↔ IndexedDB

### ✅ PODE ALTERAR LIVREMENTE:
- Interface React (components, styles)
- Funcionalidades de negócio
- Relatórios e exports
- PWA manifest e ícones
- Melhorias de UX/UI

## COMANDOS ÚTEIS

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Preview build
npm run preview

# Limpar cache (se problemas)
rm -rf node_modules/.vite
npm install
```

## EXEMPLO DE SOLICITAÇÃO

"Olá! Estou trabalhando no Personal Finance Flow PWA (contexto acima). O sistema está 100% funcional. Gostaria de [ESPECIFICAR O QUE VOCÊ QUER]:

- Adicionar gráficos de receitas/despesas
- Melhorar a interface mobile
- Implementar export para Excel
- Criar testes automatizados
- Fazer deploy para produção
- Adicionar nova funcionalidade X
- Resolver problema Y
- Etc.

Por favor, mantenha a arquitetura sql.js + IndexedDB existente e não altere as configurações críticas do Vite."

---

**IMPORTANTE**: O projeto está FUNCIONANDO PERFEITAMENTE. Qualquer mudança deve preservar a arquitetura SQLite + IndexedDB que foi laboriosamente depurada e corrigida.