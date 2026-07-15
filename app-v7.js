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

  const enhancedKaaba = String.raw`function kaaba(p,s=1,key='haram'){
    const g=new THREE.Group();g.position.copy(p);g.scale.setScalar(s);
    const cloth=new THREE.MeshStandardMaterial({color:0x070707,roughness:.96,metalness:0});
    const cloth2=new THREE.MeshStandardMaterial({color:0x111111,roughness:.92,metalness:0});
    const gold=new THREE.MeshStandardMaterial({color:0xc79a35,roughness:.34,metalness:.62});
    const goldDark=new THREE.MeshStandardMaterial({color:0x9d6e18,roughness:.42,metalness:.55});
    const silver=new THREE.MeshStandardMaterial({color:0xd7d7d2,roughness:.28,metalness:.82});
    const marble=new THREE.MeshStandardMaterial({color:0xded8cb,roughness:.78,metalness:.03});

    const body=new THREE.Mesh(new THREE.BoxGeometry(5.52,6.58,4.74),cloth);body.position.y=3.29;body.castShadow=body.receiveShadow=true;g.add(body);
    const roof=new THREE.Mesh(new THREE.BoxGeometry(5.58,.12,4.80),cloth2);roof.position.y=6.64;roof.castShadow=true;g.add(roof);

    const baseFront=new THREE.Mesh(new THREE.BoxGeometry(5.72,.24,.28),marble);baseFront.position.set(0,.12,2.43);g.add(baseFront);
    const baseBack=baseFront.clone();baseBack.position.z=-2.43;g.add(baseBack);
    const baseSide=new THREE.Mesh(new THREE.BoxGeometry(.28,.24,4.72),marble);baseSide.position.set(2.83,.12,0);g.add(baseSide);
    const baseSide2=baseSide.clone();baseSide2.position.x=-2.83;g.add(baseSide2);

    const bandFront=new THREE.Mesh(new THREE.BoxGeometry(5.48,.72,.10),gold);bandFront.position.set(0,5.18,2.42);g.add(bandFront);
    const bandBack=bandFront.clone();bandBack.position.z=-2.42;g.add(bandBack);
    const bandSide=new THREE.Mesh(new THREE.BoxGeometry(.10,.72,4.68),gold);bandSide.position.set(2.79,5.18,0);g.add(bandSide);
    const bandSide2=bandSide.clone();bandSide2.position.x=-2.79;g.add(bandSide2);

    for(let i=-2.2;i<=2.2;i+=.55){
      const fold=new THREE.Mesh(new THREE.BoxGeometry(.035,4.25,.025),cloth2);fold.position.set(i,2.75,2.39);g.add(fold);
      const foldBack=fold.clone();foldBack.position.z=-2.39;g.add(foldBack);
    }
    for(let z=-1.9;z<=1.9;z+=.55){
      const fold=new THREE.Mesh(new THREE.BoxGeometry(.025,4.25,.035),cloth2);fold.position.set(2.76,2.75,z);g.add(fold);
      const fold2=fold.clone();fold2.position.x=-2.76;g.add(fold2);
    }

    for(let i=-2.15;i<=2.15;i+=.72){
      const motif=new THREE.Mesh(new THREE.BoxGeometry(.38,.12,.025),goldDark);motif.position.set(i,5.18,2.49);g.add(motif);
      const motif2=motif.clone();motif2.position.z=-2.49;g.add(motif2);
    }

    const doorFrame=new THREE.Mesh(new THREE.BoxGeometry(1.62,2.58,.16),gold);doorFrame.position.set(1.02,2.80,2.47);g.add(doorFrame);
    const door=new THREE.Mesh(new THREE.BoxGeometry(1.38,2.32,.20),goldDark);door.position.set(1.02,2.80,2.53);g.add(door);
    for(let y=2.05;y<=3.55;y+=.50){const panel=new THREE.Mesh(new THREE.BoxGeometry(1.12,.055,.025),gold);panel.position.set(1.02,y,2.65);g.add(panel)}
    for(let x=.62;x<=1.42;x+=.40){const panel=new THREE.Mesh(new THREE.BoxGeometry(.055,1.90,.025),gold);panel.position.set(x,2.80,2.65);g.add(panel)}
    const curtainTop=new THREE.Mesh(new THREE.BoxGeometry(1.92,.48,.11),gold);curtainTop.position.set(1.02,4.27,2.50);g.add(curtainTop);

    const silverFrame=new THREE.Mesh(new THREE.TorusGeometry(.29,.085,12,34),silver);silverFrame.position.set(2.79,1.48,2.40);silverFrame.rotation.y=-Math.PI/4;g.add(silverFrame);
    const stone=new THREE.Mesh(new THREE.SphereGeometry(.215,20,14),new THREE.MeshStandardMaterial({color:0x020202,roughness:.65}));stone.position.set(2.83,1.48,2.45);stone.rotation.y=-Math.PI/4;stone.scale.set(.75,1,.32);g.add(stone);

    const mizab=new THREE.Mesh(new THREE.CylinderGeometry(.115,.115,1.35,16),gold);mizab.rotation.x=Math.PI/2;mizab.position.set(0,6.53,-2.90);g.add(mizab);
    const spout=new THREE.Mesh(new THREE.CylinderGeometry(.16,.12,.26,16),gold);spout.rotation.x=Math.PI/2;spout.position.set(0,6.53,-3.55);g.add(spout);
    const support1=new THREE.Mesh(new THREE.BoxGeometry(.13,.42,.13),goldDark);support1.position.set(-.27,6.35,-2.57);g.add(support1);
    const support2=support1.clone();support2.position.x=.27;g.add(support2);

    const corner1=new THREE.Mesh(new THREE.BoxGeometry(.09,6.38,.09),cloth2);corner1.position.set(2.78,3.25,2.39);g.add(corner1);
    const corner2=corner1.clone();corner2.position.x=-2.78;g.add(corner2);
    const corner3=corner1.clone();corner3.position.z=-2.39;g.add(corner3);
    const corner4=corner3.clone();corner4.position.x=-2.78;g.add(corner4);

    root.add(g);keyify(g,key);return g
  }`;

  async function start() {
    try {
      if (!window.WebGLRenderingContext) {
        throw new Error('WebGL is disabled or unavailable in this browser. Enable hardware acceleration or open the site in the latest Chrome browser.');
      }

      const engine = await loadEngine();
      status('Preparing sacred-sites model…', `3D engine loaded from ${engine.source}. Building the scene now.`);

      const response = await fetch('./app-v5.js?v=9', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Application file returned HTTP ${response.status}`);
      let code = await response.text();
      code = code
        .replace(/^\s*import\s+\*\s+as\s+THREE\s+from\s+['"][^'"]+['"];?\s*$/m, '')
        .replace(/^\s*import\s+\{\s*OrbitControls\s*\}\s+from\s+['"][^'"]+['"];?\s*$/m, '')
        .replace(/\.n\[lang\]/g, ".n[lang==='en'?0:1]")
        .replace(/\.i\[lang\]/g, ".i[lang==='en'?0:1]")
        .replace(/\.d\[lang\]/g, ".d[lang==='en'?0:1]")
        .replace(/\.t\[lang\]/g, ".t[lang==='en'?0:1]")
        .replace(/\.f\[lang\]/g, ".f[lang==='en'?0:1]")
        .replace(/function kaaba\(p,s=1,key='haram'\)\{.*?return g\}/s, enhancedKaaba)
        .replace("const stone=sph(.32,0x151515);stone.position.set(2.82,1.45,2.42);stone.userData.key='blackstone';root.add(stone);clickable.push(stone);", "const stone=sph(.18,0x030303);stone.position.set(2.86,1.48,2.50);stone.scale.set(.72,1,.30);stone.userData.key='blackstone';root.add(stone);clickable.push(stone);");

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