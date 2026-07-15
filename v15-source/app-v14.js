(() => {
  const loading = document.getElementById('loading');

  function showError(message) {
    if (!loading) return;
    loading.classList.remove('hide');
    loading.innerHTML = `<div style="max-width:620px;padding:28px;text-align:center;color:#fff"><h2 style="margin:0 0 10px">3D map could not start</h2><p style="line-height:1.6;opacity:.9;word-break:break-word">${message}</p><button onclick="location.reload()" style="border:0;border-radius:12px;padding:12px 18px;background:#d9b55d;color:#17362f;font-weight:800">Retry</button></div>`;
  }

  const correctedCity = String.raw`function city(p){
    const g=new THREE.Group();g.position.copy(p);root.add(g);
    const marble=mat(0xeee9df),glassMat=new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.22,transmission:.80,roughness:.07,depthWrite:false});
    const pad=cyl(8.8,8.8,.22,0xece6da,72);pad.position.y=.11;g.add(pad);
    const mataf=new THREE.Mesh(new THREE.CircleGeometry(6.25,80),marble);mataf.rotation.x=-Math.PI/2;mataf.position.y=.24;g.add(mataf);
    const local=new THREE.Group();g.add(local);const oldRoot=root;root=local;kaaba(new THREE.Vector3(0,.24,0),.50,'haram');root=oldRoot;
    const hijrCurve=new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.72,.34,-1.12),new THREE.Vector3(2.30,.34,-1.60),new THREE.Vector3(3.05,.34,-1.33),
      new THREE.Vector3(3.42,.34,0),new THREE.Vector3(3.05,.34,1.33),new THREE.Vector3(2.30,.34,1.60),new THREE.Vector3(1.72,.34,1.12)
    ]);
    const hijr=new THREE.Mesh(new THREE.TubeGeometry(hijrCurve,72,.105,10,false),mat(0xf0ece3));hijr.castShadow=hijr.receiveShadow=true;g.add(hijr);
    const hijrShape=new THREE.Shape();hijrShape.moveTo(1.84,-1.02);hijrShape.quadraticCurveTo(3.18,-1.62,3.30,0);hijrShape.quadraticCurveTo(3.18,1.62,1.84,1.02);hijrShape.lineTo(1.84,-1.02);
    const hijrFloor=new THREE.Mesh(new THREE.ShapeGeometry(hijrShape),mat(0xe7e1d6));hijrFloor.rotation.x=-Math.PI/2;hijrFloor.position.y=.255;g.add(hijrFloor);
    const maq=new THREE.Group();maq.position.set(-.58,.24,3.60);g.add(maq);
    const maqBase=cyl(.36,.40,.13,0xcaa03e,8);maqBase.position.y=.065;maq.add(maqBase);
    const maqGlass=new THREE.Mesh(new THREE.CylinderGeometry(.33,.33,.82,8),glassMat);maqGlass.position.y=.50;maq.add(maqGlass);
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2,pole=cyl(.022,.027,.88,0xcaa03e,8);pole.position.set(Math.cos(a)*.31,.50,Math.sin(a)*.31);maq.add(pole)}
    const maqTop=cyl(.24,.34,.14,0xcaa03e,8);maqTop.position.y=.96;maq.add(maqTop);
    const footprint=new THREE.Mesh(new THREE.BoxGeometry(.17,.09,.17),mat(0x8a7452));footprint.position.y=.28;maq.add(footprint);
    for(let i=0;i<36;i++){const a=i/36*Math.PI*2,r=7.15;const pier=box(.42,1.05+(i%4)*.10,.42,0xe8e1d2);pier.position.set(Math.cos(a)*r,pier.geometry.parameters.height/2+.23,Math.sin(a)*r);g.add(pier)}
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2,m=cyl(.085,.145,2.75,0xeee6d5,12);m.position.set(Math.cos(a)*7.85,1.60,Math.sin(a)*7.85);g.add(m);const cap=cyl(0,.19,.24,0xeee6d5,12);cap.position.set(Math.cos(a)*7.85,3.09,Math.sin(a)*7.85);g.add(cap)}
    const tower=box(1.55,7.2,1.55,0xb7ad9b);tower.position.set(-6.35,3.82,-6.15);g.add(tower);
    const clock=box(1.72,1.02,1.72,0x657f70);clock.position.set(-6.35,6.95,-6.15);g.add(clock);
    const spire=cyl(0,.14,1.35,0xcaa03e,10);spire.position.set(-6.35,8.14,-6.15);g.add(spire);
    const hajarCue=new THREE.Mesh(new THREE.TorusGeometry(.12,.028,8,24),new THREE.MeshStandardMaterial({color:0xd7d7d2,roughness:.25,metalness:.85}));hajarCue.position.set(-1.43,.66,1.22);hajarCue.rotation.y=Math.PI/4;g.add(hajarCue);
    const ruknCue=new THREE.Mesh(new THREE.BoxGeometry(.07,.60,.07),new THREE.MeshStandardMaterial({color:0x1a1a1a,roughness:.9}));ruknCue.position.set(-1.43,.60,-1.22);g.add(ruknCue);
    keyify(g,'haram')
  }`;

  const variableFrom = "let lang='en',mode='hajj',selected='haram',scene,camera,renderer,controls,root,raycaster,mouse,routeCurve,traveller,playing=false,rt=0,labelsOn=true,terrainOn=true,photos=[],photoIndex=0;";
  const variableTo = "let lang='en',mode='hajj',selected='haram',scene,camera,renderer,controls,root,raycaster,mouse,routeCurve,traveller,playing=false,followRoute=false,rt=0,labelsOn=true,terrainOn=true,photos=[],photoIndex=0;";
  const routeButtonFrom = "Q('#routeBtn').onclick=()=>{playing=!playing;setUI()}";
  const routeButtonTo = "Q('#routeBtn').onclick=()=>{playing=!playing;followRoute=playing;controls.enabled=!playing;setUI()}";
  const sliderFrom = "Q('#routeSlider').oninput=e=>{rt=+e.target.value/1000;playing=false;setUI()}";
  const sliderTo = "Q('#routeSlider').oninput=e=>{rt=+e.target.value/1000;playing=false;followRoute=false;controls.enabled=true;setUI()}";
  const loopPattern = "function loop\\(t\\)\\{[\\s\\S]*?renderer\\.render\\(scene,camera\\)\\}";
  const loopTo = String.raw`function loop(t){
    requestAnimationFrame(loop);
    if(!playing&&!controls.enabled)controls.enabled=true;
    if(playing&&routeCurve){
      rt=(rt+.00065)%1;
      Q('#routeSlider').value=Math.round(rt*1000)
    }
    if(routeCurve&&traveller){
      const p=routeCurve.getPoint(rt);
      traveller.position.copy(p).add(new THREE.Vector3(0,.85,0));
      if(playing&&followRoute){
        const ahead=routeCurve.getPoint((rt+.018)%1);
        const dir=ahead.clone().sub(p);dir.y=0;
        if(dir.lengthSq()<.0001)dir.set(0,0,1);
        dir.normalize();
        const side=new THREE.Vector3(-dir.z,0,dir.x);
        const back=mode==='hajj'?11:7.5;
        const height=mode==='hajj'?8.5:5.2;
        const lateral=mode==='hajj'?4.5:2.8;
        const desired=p.clone().addScaledVector(dir,-back).addScaledVector(side,lateral).add(new THREE.Vector3(0,height,0));
        camera.position.lerp(desired,.045);
        const look=ahead.clone().add(new THREE.Vector3(0,mode==='hajj'?1.3:.9,0));
        controls.target.lerp(look,.075);
        camera.lookAt(controls.target)
      }else{
        controls.update()
      }
    }else{
      controls.update()
    }
    if(mode==='haram'){
      root.traverse(o=>{if(o.userData.pilgrim){const a=(t*.00015+o.userData.t)*Math.PI*2,r=8+(o.userData.t%3)*1.7;o.position.set(Math.cos(a)*r,.2,Math.sin(a)*r)}})
    }
    renderer.render(scene,camera)
  }`;

  const runAnchor = "      const run=new Function('THREE','OrbitControls'";
  const appV10Patch = `      code=code
        .replace(${JSON.stringify(variableFrom)},${JSON.stringify(variableTo)})
        .replace(${JSON.stringify(routeButtonFrom)},${JSON.stringify(routeButtonTo)})
        .replace(${JSON.stringify(sliderFrom)},${JSON.stringify(sliderTo)})
        .replace(new RegExp(${JSON.stringify(loopPattern)}),${JSON.stringify(loopTo)});
      const run=new Function('THREE','OrbitControls'`;
  const appV11Injection = `      code = code.replace(${JSON.stringify(runAnchor)}, ${JSON.stringify(appV10Patch)});\n`;

  async function start() {
    try {
      const response = await fetch('./app-v11.js?v=14', { cache: 'no-store' });
      if (!response.ok) throw new Error(`V11 application file returned HTTP ${response.status}`);
      let source = await response.text();

      const cityReplacement = "  const accurateCity = String.raw`" + correctedCity + "`;\n  const accurateTents";
      const cityInjection = "        .replace(/  const accurateCity = String\\.raw`[\\s\\S]*?`;\\n  const accurateTents/, " + JSON.stringify(cityReplacement) + ")\n";
      const cityAnchor = "        .replace(/  const accurateBuildHaram";
      if (!source.includes(cityAnchor)) throw new Error('Could not locate the V11 city-model patch point.');
      source = source.replace(cityAnchor, cityInjection + cityAnchor);

      const fetchAnchor = "      let code = await response.text();\n";
      if (!source.includes(fetchAnchor)) throw new Error('Could not locate the V11 route-follow patch point.');
      source = source.replace(fetchAnchor, fetchAnchor + appV11Injection);

      new Function(`${source}\n//# sourceURL=app-v14-patched-loader.js`)();
    } catch (error) {
      console.error('V14 startup failed:', error);
      showError(error?.message || String(error));
    }
  }

  start();
})();