// 🐾 SERVICE WORKER REGISTRATION - PWA Support, nyaa~!

export function register(config) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('🐾 [SW] Registered successfully, nyaa~!');

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;

            if (installingWorker == null) {
              return;
            }

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New update available
                  console.log('🐾 [SW] New content available, desu~!');

                  if (config && config.onUpdate) {
                    config.onUpdate(registration);
                  }
                } else {
                  // Content cached for offline use
                  console.log('🐾 [SW] Content cached for offline, nyaa~!');

                  if (config && config.onSuccess) {
                    config.onSuccess(registration);
                  }
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('🐾 [SW] Registration failed:', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
