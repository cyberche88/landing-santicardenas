/* =========================================================
   CONFIGURACIÓN — edita SOLO este bloque
   ---------------------------------------------------------
   WHATSAPP_GENERAL : link de WhatsApp para los botones
                      "Quiero conocer más" / "Hablar con el equipo"
   WHATSAPP_ASESOR  : link para "Asegurar mi cupo con un asesor"
                      (si está vacío usa WHATSAPP_GENERAL)
   META_PIXEL_ID    : ID numérico del Pixel de Meta
   GA4_ID           : ID de Google Analytics 4 (G-XXXXXXX)
   Vacío = desactivado (botones de WhatsApp llevan a la sección
   de compra y no se carga el tracking).
========================================================= */
window.SITE_CONFIG = {
  WHATSAPP_GENERAL: 'https://wa.link/353jf0',
  WHATSAPP_ASESOR:  '',
  META_PIXEL_ID:    '2932505073768693',
  GA4_ID:           '',
  PRICE_COP:        299000
};

/* ---------- Tracking (no editar) ---------- */
(function (cfg) {
  if (cfg.META_PIXEL_ID) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', cfg.META_PIXEL_ID);
    fbq('track', 'PageView');
  }
  if (cfg.GA4_ID) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.GA4_ID);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', cfg.GA4_ID);
  }

  // Envía un evento a Pixel y GA4 si están activos
  window.trackEvent = function (fbName, gaName, params) {
    try { if (window.fbq && fbName) fbq('track', fbName, params || {}); } catch (_) {}
    try { if (window.gtag && gaName) gtag('event', gaName, params || {}); } catch (_) {}
  };
})(window.SITE_CONFIG);
