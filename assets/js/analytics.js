(function () {
  const GA_ID = window.ABASPIE_GA4_ID || 'G-XXXXXXXXXX';
  if (!GA_ID || GA_ID === 'G-XXXXXXXXXX') return;

  function loadGA() {
    if (window.__abaspie_ga_loaded) return;
    window.__abaspie_ga_loaded = true;

    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;

    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  document.addEventListener('abaspie:consent:analytics', loadGA);
})();
