// Service Worker Oficial do Portal UEMG Carangola
// Versão do Cache
const CACHE_NAME = 'uemg-carangola-v1';

// Recursos Estáticos Essenciais do App Shell
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Instalação do Service Worker & Pré-cache do App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação e Limpeza de Caches Antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia de Fetch com Isolamento de Segurança:
// 1. Áreas restritas (/restrito/*), APIs (/api/*) e submissões são estritamente NETWORK-ONLY.
// 2. Recursos estáticos públicos utilizam STALE-WHILE-REVALIDATE.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignorar requisições não-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Regra Inviolável de Segurança Zero-Trust:
  // NUNCA cachear rotas restritas ou chamadas autenticadas do Supabase em disco!
  if (
    url.pathname.startsWith('/restrito') ||
    url.pathname.startsWith('/meus-artigos') ||
    url.pathname.startsWith('/fale-com-a-direcao/sucesso') ||
    url.pathname.startsWith('/fale-com-a-direcao/consulta') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('/auth/') ||
    url.hostname.includes('supabase.co')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Estratégia Stale-While-Revalidate para o App Shell e assets públicos
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Tratamento de Web Push Notifications Nativas (VAPID)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nova notificação institucional da UEMG Carangola.',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/',
      },
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'UEMG Carangola', options)
    );
  } catch {
    // Fallback caso não seja JSON
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('UEMG Carangola', {
        body: text,
        icon: '/icons/icon-192.png',
      })
    );
  }
});

// Redirecionamento ao clicar na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
