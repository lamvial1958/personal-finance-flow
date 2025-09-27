const CACHE_NAME = 'vm-finance-v1.5.0';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.ico'
];

// Lista de recursos do Vite que nunca devem ser cacheados
const VITE_RESOURCES = [
  '/@vite/',
  '/@react-refresh',
  '/src/',
  '/node_modules/',
  '/@fs/',
  '/__vite_ping',
  '/vite.svg'
];

// Função para verificar se é um recurso do Vite
function isViteResource(url) {
  return VITE_RESOURCES.some(pattern => url.includes(pattern));
}

// Função para verificar se estamos em modo desenvolvimento
function isDevelopment() {
  return self.location.hostname === 'localhost' || 
         self.location.hostname === '127.0.0.1' ||
         self.location.port === '5173';
}

self.addEventListener('install', (event) => {
  // Skip waiting para ativar imediatamente
  self.skipWaiting();
  
  // CORREÇÃO: Não fazer cache inicial em desenvolvimento
  if (!isDevelopment()) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(urlsToCache))
        .catch((error) => {
          console.log('Cache install failed:', error);
        })
    );
  }
});

self.addEventListener('activate', (event) => {
  // Claim todos os clientes imediatamente + limpeza de caches antigos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Limpar caches antigos (v1, v1.4.0, etc.)
          if (cacheName !== CACHE_NAME && cacheName.startsWith('vm-finance-')) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = request.url;
  
  // CORREÇÃO CRÍTICA: Em desenvolvimento, ignorar TODOS os requests problemáticos
  if (isDevelopment()) {
    // Ignorar recursos do Vite
    if (isViteResource(url)) {
      return;
    }
    
    // Ignorar requests para paths que não existem em desenvolvimento
    if (url.includes('/personal-finance-flow/')) {
      return;
    }
    
    // Ignorar requests de módulos ES
    if (url.includes('.js?') || url.includes('.jsx?') || url.includes('.ts?') || url.includes('.tsx?')) {
      return;
    }
  }
  
  // Não cachear requests POST, PUT, DELETE
  if (request.method !== 'GET') {
    return;
  }
  
  // Strategy simplificada para desenvolvimento
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Se encontrou no cache, usar cache
        if (response) {
          return response;
        }
        
        // Se não encontrou no cache, buscar na network
        return fetch(request)
          .then((networkResponse) => {
            // CORREÇÃO: Só cachear em produção
            if (!isDevelopment() && shouldCache(request, networkResponse)) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                })
                .catch(() => {
                  // Silenciosamente ignorar erros de cache em desenvolvimento
                });
            }
            return networkResponse;
          })
          .catch((error) => {
            // CORREÇÃO: Em desenvolvimento, não tentar servir fallbacks
            if (isDevelopment()) {
              console.log('SW fetch failed in dev mode:', url, error);
              throw error; // Deixa o browser lidar com isso
            }
            
            // Em produção, tentar servir página offline
            if (isHTMLRequest(request)) {
              return caches.match('/') || new Response('App offline', {
                status: 503,
                statusText: 'Service Unavailable'
              });
            }
            throw error;
          });
      })
      .catch((error) => {
        // CORREÇÃO: Em desenvolvimento, log e re-throw
        if (isDevelopment()) {
          console.log('SW cache match failed in dev:', url, error);
        }
        throw error;
      })
  );
});

// Função para verificar se é um asset estático
function isStaticAsset(url) {
  return /\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i.test(url);
}

// Função para verificar se é request HTML
function isHTMLRequest(request) {
  return request.headers.get('accept')?.includes('text/html');
}

// Função para verificar se deve cachear
function shouldCache(request, response) {
  return response.status === 200 && 
         response.type === 'basic' &&
         !isViteResource(request.url);
}

// Event listener para messages do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});