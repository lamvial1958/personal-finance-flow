const CACHE_NAME = 'vm-finance-v1';
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
  
  // Só fazer cache inicial se não for desenvolvimento
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
  // Claim todos os clientes imediatamente
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = request.url;
  
  // Em desenvolvimento, não interceptar recursos do Vite
  if (isDevelopment() && isViteResource(url)) {
    return; // Deixa o Vite lidar com esses recursos
  }
  
  // Não cachear requests POST, PUT, DELETE
  if (request.method !== 'GET') {
    return;
  }
  
  // Strategy: Cache First para recursos estáticos, Network First para páginas
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Se encontrou no cache
        if (response) {
          // Para recursos estáticos (imagens, CSS, JS), retorna do cache
          if (isStaticAsset(url)) {
            return response;
          }
          
          // Para páginas HTML, tenta network primeiro em desenvolvimento
          if (isDevelopment() && isHTMLRequest(request)) {
            return fetch(request).catch(() => response);
          }
          
          return response;
        }
        
        // Se não encontrou no cache, busca na network
        return fetch(request)
          .then((networkResponse) => {
            // Só cacheia em produção ou recursos específicos
            if (!isDevelopment() && shouldCache(request, networkResponse)) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch((error) => {
            // Se network falha e estamos offline, tenta servir página offline
            if (isHTMLRequest(request)) {
              return caches.match('/') || new Response('App offline', {
                status: 503,
                statusText: 'Service Unavailable'
              });
            }
            throw error;
          });
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