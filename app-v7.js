(() => {
  const loading = document.getElementById('loading');

  function status(title, message, canRetry = false) {
    if (!loading) return;
    loading.classList.remove('hide');
    loading.innerHTML = `
      <div style="max-width:560px;padding:28px;text-align:center;color:#fff">
        <div class="loader" style="${canRetry ? 'display:none' : ''}"></div>
        <h2 style="margin:0 0 10px">${title}</h2>
        <p style="line-height:1.6;opacity:.9;word-break:break-word">${message}</p>
        ${canRetry ? '<button onclick="location.reload()" style="border:0;border-radius:12px;padding:12px 18px;background:#d9b55d;color:#17362f;font-weight:800">Retry</button>' : ''}
      </div>`;
  }

  async function fromEsmSh() {
    const THREE = await import('https://esm.sh/three@0.164.1');
    const controls = await import('https://esm.sh/three@0.164.1/examples/jsm/controls/OrbitControls.js');
    return { THREE, OrbitControls: controls.OrbitControls, source: 'esm.sh' };
  }

  async function fromJsDelivr() {
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.164.1/+esm');
    const controls = await import('https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/controls/OrbitControls.js/+esm');
    return { THREE, OrbitControls: controls.OrbitControls, source: 'jsDelivr' };
  }

  async function fromSkypack() {
    const THREE = await import('https://cdn.skypack.dev/three@0.164.1');
    const controls = await import('https://cdn.skypack.dev/three@0.164.1/examples/jsm/controls/OrbitControls.js');
    return { THREE, OrbitControls: controls.OrbitControls, source: 'Skypack' };
  }

  async function loadEngine() {
    const attempts = [fromEsmSh, fromJsDelivr, fromSkypack];
    const errors = [];
    for (let i = 0; i < attempts.length; i++) {
      status('Loading interactive 3D map…', `Connecting to 3D engine source ${i + 1} of ${attempts.length}.`);
      try {
        const engine = await Promise.race([
          attempts[i](),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timed out')), 9000))
        ]);
        if (!engine.THREE || !engine.OrbitControls) throw new Error('3D engine exports were incomplete');
        return engine;
      } catch (error) {
        errors.push(error?.message || String(error));
      }
    }
    throw new Error(`All 3D engine sources failed: ${errors.join(' | ')}`);
  }

  async function start() {
    try {
      if (!window.WebGLRenderingContext) {
        throw new Error('WebGL is disabled or unavailable in this browser. Enable hardware acceleration or open the site in the latest Chrome browser.');
      }

      const engine = await loadEngine();
      status('Preparing sacred-sites model…', `3D engine loaded from ${engine.source}. Building the scene now.`);

      const response = await fetch('./app-v5.js?v=8', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Application file returned HTTP ${response.status}`);
      let code = await response.text();
      code = code
        .replace(/^\s*import\s+\*\s+as\s+THREE\s+from\s+['"][^'"]+['"];?\s*$/m, '')
        .replace(/^\s*import\s+\{\s*OrbitControls\s*\}\s+from\s+['"][^'"]+['"];?\s*$/m, '')
        .replace(/\.n\[lang\]/g, ".n[lang==='en'?0:1]")
        .replace(/\.i\[lang\]/g, ".i[lang==='en'?0:1]")
        .replace(/\.d\[lang\]/g, ".d[lang==='en'?0:1]")
        .replace(/\.t\[lang\]/g, ".t[lang==='en'?0:1]")
        .replace(/\.f\[lang\]/g, ".f[lang==='en'?0:1]");

      const run = new Function('THREE', 'OrbitControls', `${code}\n//# sourceURL=app-v5-runtime.js`);
      run(engine.THREE, engine.OrbitControls);
    } catch (error) {
      console.error('3D startup failed:', error);
      const detail = error?.stack ? `${error.message}<br><small style="opacity:.7">${String(error.stack).split('\n').slice(0,3).join('<br>')}</small>` : (error?.message || String(error));
      status('3D map could not start', detail, true);
    }
  }

  start();
})();