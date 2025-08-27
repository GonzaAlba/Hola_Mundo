/* Registro del Service Worker (necesario para que el navegador permita instalar la PWA) */
if ('serviceWorker' in navigator) {
  // Use an absolute path so the service worker registers correctly
  // even though this script lives in the /src directory.
  navigator.serviceWorker
    .register('/service-worker.js')
    .catch(console.error);
}

/* Manejo del evento beforeinstallprompt para mostrar nuestro botón “Instalar” */
let deferredPrompt; // guardamos el evento para dispararlo cuando el usuario toque el botón
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  // Evita que Chrome muestre su mini-infobar automática
  e.preventDefault();
  deferredPrompt = e;
  // Mostramos nuestro botón
  installBtn.hidden = false;
});

installBtn?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  installBtn.disabled = true;

  // Muestra el prompt nativo
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  // outcome: 'accepted' | 'dismissed'
  // Puedes enviar analytics si quieres
  // console.log('Instalación:', outcome);

  // Limpia la referencia
  deferredPrompt = null;
  installBtn.hidden = true;
  installBtn.disabled = false;
});

/* (Opcional) iOS: mostrar hint, ya que Safari no dispara beforeinstallprompt.
   Tip: en iPhone pide “Compartir → Añadir a pantalla de inicio”.
*/
const isIOS = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);
const isInStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

if (isIOS() && !isInStandalone()) {
  // Podrías mostrar un pequeño tooltip aquí si lo deseas.
  // Este ejemplo mantiene la UI minimalista.
}
