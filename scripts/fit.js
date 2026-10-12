// Scales main content containers to fit viewport height when necessary
(function(){
  function fit(selector){
    const el = document.querySelector(selector);
    if(!el) return;
    function apply(){
      // reset
      el.style.transition = 'transform 160ms ease';
      el.style.transformOrigin = 'top center';
      el.style.transform = '';
      document.documentElement.style.overflow = '';

      const rect = el.getBoundingClientRect();
      const contentH = rect.height;
      const vh = window.innerHeight;
      if(contentH <= vh) {
        document.documentElement.style.overflow = 'hidden';
        return;
      }
      let scale = vh / contentH;
      // clamp scale to reasonable range
      scale = Math.max(0.6, Math.min(1, scale));
      el.style.transform = `scale(${scale})`;
      document.documentElement.style.overflow = 'hidden';
    }
    addEventListener('resize', apply);
    addEventListener('orientationchange', apply);
    addEventListener('load', apply);
    // slight delay to let layout settle
    setTimeout(apply, 80);
  }
  fit('.st-frame');
  fit('.dashboard');
})();
