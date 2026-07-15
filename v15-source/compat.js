(() => {
  // Compatibility fallback for older Android WebViews/Samsung Internet builds.
  const proto = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
  if (proto && !proto.roundRect) {
    proto.roundRect = function (x, y, w, h, r = 0) {
      const radius = Array.isArray(r) ? Number(r[0] || 0) : Number(r || 0);
      const rr = Math.max(0, Math.min(radius, Math.abs(w) / 2, Math.abs(h) / 2));
      this.beginPath();
      this.moveTo(x + rr, y);
      this.lineTo(x + w - rr, y);
      this.quadraticCurveTo(x + w, y, x + w, y + rr);
      this.lineTo(x + w, y + h - rr);
      this.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
      this.lineTo(x + rr, y + h);
      this.quadraticCurveTo(x, y + h, x, y + h - rr);
      this.lineTo(x, y + rr);
      this.quadraticCurveTo(x, y, x + rr, y);
      this.closePath();
      return this;
    };
  }

  function showStartupError(message) {
    const loader = document.getElementById('loading');
    if (!loader || loader.classList.contains('hide')) return;
    loader.innerHTML = `
      <div style="max-width:520px;padding:28px;text-align:center;color:#fff">
        <div style="font-size:42px;margin-bottom:12px">⚠</div>
        <h2 style="margin:0 0 10px">3D map could not start</h2>
        <p style="line-height:1.6;opacity:.88">${message || 'A required 3D file did not load. This can be caused by a blocked CDN, unstable connection, or unsupported browser feature.'}</p>
        <button onclick="location.reload()" style="border:0;border-radius:12px;padding:12px 18px;background:#d9b55d;color:#17362f;font-weight:800">Retry</button>
      </div>`;
  }

  window.addEventListener('error', (event) => {
    if (event?.target?.tagName === 'SCRIPT' || event?.message) {
      showStartupError('A required 3D script failed to load or an initialization error occurred. Please retry once.');
    }
  }, true);

  window.addEventListener('unhandledrejection', () => {
    showStartupError('The 3D engine could not finish loading. Please retry or open the page in the latest Chrome browser.');
  });

  window.setTimeout(() => {
    const loader = document.getElementById('loading');
    if (loader && !loader.classList.contains('hide')) {
      showStartupError('Loading exceeded 12 seconds. The external Three.js engine may be blocked or the connection may be too slow.');
    }
  }, 12000);
})();
