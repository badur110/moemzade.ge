// Moemzade.ge analytics bootstrap
// When Google Analytics is ready, replace the empty value below with your GA4 Measurement ID, e.g. G-XXXXXXXXXX.
(function(){
  var GA_ID = '';
  if(!GA_ID || !/^G-[A-Z0-9]+$/i.test(GA_ID)) return;
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
})();
