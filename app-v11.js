(() => {
  const loading = document.getElementById('loading');

  function showError(message) {
    if (!loading) return;
    loading.classList.remove('hide');
    loading.innerHTML = `<div style="max-width:620px;padding:28px;text-align:center;color:#fff"><h2 style="margin:0 0 10px">3D map could not start</h2><p style="line-height:1.6;opacity:.9;word-break:break-word">${message}</p><button onclick="location.reload()" style="border:0;border-radius:12px;padding:12px 18px;background:#d9b55d;color:#17362f;font-weight:800">Retry</button></div>`;
  }

  const correctedKaaba = String.raw`function kaaba(p,s=1,key='haram'){
    const g=new THREE.Group();g.position.copy(p);g.scale.setScalar(s);
    const cloth=new THREE.MeshStandardMaterial({color:0x050505,roughness:.98,metalness:0});
    const cloth2=new THREE.MeshStandardMaterial({color:0x111111,roughness:.93,metalness:0});
    const gold=new THREE.MeshStandardMaterial({color:0xc99b32,roughness:.31,metalness:.70});
    const goldDark=new THREE.MeshStandardMaterial({color:0x8c6117,roughness:.43,metalness:.58});
    const silver=new THREE.MeshStandardMaterial({color:0xdadad6,roughness:.23,metalness:.90});
    const marble=new THREE.MeshStandardMaterial({color:0xe4dfd4,roughness:.80,metalness:.02});

    const body=new THREE.Mesh(new THREE.BoxGeometry(5.52,6.58,4.74),cloth);body.position.y=3.29;body.castShadow=body.receiveShadow=true;g.add(body);
    const roof=new THREE.Mesh(new THREE.BoxGeometry(5.58,.13,4.80),cloth2);roof.position.y=6.64;roof.castShadow=true;g.add(roof);

    const skirtF=new THREE.Mesh(new THREE.BoxGeometry(5.70,.24,.25),marble);skirtF.position.set(0,.12,2.43);g.add(skirtF);const skirtB=skirtF.clone();skirtB.position.z=-2.43;g.add(skirtB);
    const skirtS=new THREE.Mesh(new THREE.BoxGeometry(.25,.24,4.72),marble);skirtS.position.set(2.83,.12,0);g.add(skirtS);const skirtS2=skirtS.clone();skirtS2.position.x=-2.83;g.add(skirtS2);

    const beltY=4.50;
    const bf=new THREE.Mesh(new THREE.BoxGeometry(5.50,.62,.10),gold);bf.position.set(0,beltY,2.42);g.add(bf);const bb=bf.clone();bb.position.z=-2.42;g.add(bb);
    const bs=new THREE.Mesh(new THREE.BoxGeometry(.10,.62,4.70),gold);bs.position.set(2.79,beltY,0);g.add(bs);const bs2=bs.clone();bs2.position.x=-2.79;g.add(bs2);

    for(let i=-2.18;i<=2.18;i+=.54){const f=new THREE.Mesh(new THREE.BoxGeometry(.032,3.68,.024),cloth2);f.position.set(i,2.22,2.39);g.add(f);const b=f.clone();b.position.z=-2.39;g.add(b)}
    for(let z=-1.88;z<=1.88;z+=.54){const f=new THREE.Mesh(new THREE.BoxGeometry(.024,3.68,.032),cloth2);f.position.set(2.76,2.22,z);g.add(f);const b=f.clone();b.position.x=-2.76;g.add(b)}
    for(let i=-2.10;i<=2.10;i+=.70){const m=new THREE.Mesh(new THREE.BoxGeometry(.36,.10,.026),goldDark);m.position.set(i,beltY,2.49);g.add(m);const m2=m.clone();m2.position.z=-2.49;g.add(m2)}

    const doorX=-1.18;
    const frame=new THREE.Mesh(new THREE.BoxGeometry(1.08,1.82,.17),gold);frame.position.set(doorX,2.00,2.47);g.add(frame);
    const door=new THREE.Mesh(new THREE.BoxGeometry(.92,1.64,.21),goldDark);door.position.set(doorX,2.00,2.54);g.add(door);
    for(let y=1.48;y<=2.50;y+=.34){const p1=new THREE.Mesh(new THREE.BoxGeometry(.76,.045,.026),gold);p1.position.set(doorX,y,2.66);g.add(p1)}
    for(let x=doorX-.28;x<=doorX+.28;x+=.28){const p1=new THREE.Mesh(new THREE.BoxGeometry(.045,1.30,.026),gold);p1.position.set(x,2.00,2.66);g.add(p1)}
    const sitara=new THREE.Mesh(new THREE.BoxGeometry(1.30,.42,.12),gold);sitara.position.set(doorX,3.14,2.50);g.add(sitara);

    const silverFrame=new THREE.Mesh(new THREE.TorusGeometry(.235,.067,14,40),silver);silverFrame.position.set(-2.78,.80,2.39);silverFrame.rotation.y=Math.PI/4;g.add(silverFrame);
    const blackStone=new THREE.Mesh(new THREE.SphereGeometry(.175,24,16),new THREE.MeshStandardMaterial({color:0x010101,roughness:.72}));blackStone.position.set(-2.82,.80,2.44);blackStone.scale.set(.74,1,.30);g.add(blackStone);

    const mizab=new THREE.Mesh(new THREE.CylinderGeometry(.105,.105,1.30,18),gold);mizab.rotation.z=-Math.PI/2;mizab.position.set(3.18,6.51,0);g.add(mizab);
    const lip=new THREE.Mesh(new THREE.CylinderGeometry(.15,.11,.28,18),gold);lip.rotation.z=-Math.PI/2;lip.position.set(3.82,6.51,0);g.add(lip);
    const support1=new THREE.Mesh(new THREE.BoxGeometry(.13,.40,.13),goldDark);support1.position.set(2.58,6.34,-.27);g.add(support1);const support2=support1.clone();support2.position.z=.27;g.add(support2);

    const c1=new THREE.Mesh(new THREE.BoxGeometry(.10,6.35,.10),cloth2);c1.position.set(2.77,3.24,2.38);g.add(c1);const c2=c1.clone();c2.position.x=-2.77;g.add(c2);const c3=c1.clone();c3.position.z=-2.38;g.add(c3);const c4=c3.clone();c4.position.x=-2.77;g.add(c4);
    root.add(g);keyify(g,key);return g
  }`;

  const correctedBuildHaram = String.raw`function buildHaram(){
    const marble=new THREE.Mesh(new THREE.CircleGeometry(43,128),mat(0xf1efe9));marble.rotation.x=-Math.PI/2;marble.receiveShadow=true;root.add(marble);
    for(let r=8;r<=29;r+=3.5){const ring=new THREE.Mesh(new THREE.RingGeometry(r-.035,r+.035,128),new THREE.MeshBasicMaterial({color:0xcfc9bb,side:THREE.DoubleSide,transparent:true,opacity:.68}));ring.rotation.x=-Math.PI/2;ring.position.y=.05;root.add(ring)}
    kaaba(new THREE.Vector3(0,.05,0),1,'kaaba');

    const hajarHit=new THREE.Mesh(new THREE.SphereGeometry(.34,16,12),new THREE.MeshBasicMaterial({transparent:true,opacity:.01,depthWrite:false}));hajarHit.position.set(-2.88,.80,2.50);hajarHit.userData.key='blackstone';root.add(hajarHit);clickable.push(hajarHit);
    const doorHit=box(1.10,1.86,.12,0x050505);doorHit.material.transparent=true;doorHit.material.opacity=.015;doorHit.position.set(-1.18,2.00,2.67);doorHit.userData.key='door';root.add(doorHit);clickable.push(doorHit);

    const hijrCurve=new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.45,.43,-2.25),new THREE.Vector3(4.65,.43,-3.20),new THREE.Vector3(6.15,.43,-2.65),
      new THREE.Vector3(6.85,.43,0),new THREE.Vector3(6.15,.43,2.65),new THREE.Vector3(4.65,.43,3.20),new THREE.Vector3(3.45,.43,2.25)
    ]);
    const hijr=new THREE.Mesh(new THREE.TubeGeometry(hijrCurve,96,.18,14,false),mat(0xeee8dc));hijr.castShadow=hijr.receiveShadow=true;root.add(hijr);keyify(hijr,'hijr');
    const hijrFloor=new THREE.Mesh(new THREE.ShapeGeometry((()=>{const s=new THREE.Shape();s.moveTo(3.70,-2.05);s.quadraticCurveTo(6.30,-3.20,6.55,0);s.quadraticCurveTo(6.30,3.20,3.70,2.05);s.lineTo(3.70,-2.05);return s})()),mat(0xe9e4d9));hijrFloor.rotation.x=-Math.PI/2;hijrFloor.position.y=.07;root.add(hijrFloor);

    const maq=new THREE.Group();maq.position.set(-1.05,0,7.20);
    const footprint=new THREE.Mesh(new THREE.BoxGeometry(.34,.17,.34),mat(0x8c7551));footprint.position.y=.42;maq.add(footprint);
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2,pole=cyl(.035,.045,1.68,0xcaa03e,8);pole.position.set(Math.cos(a)*.56,.92,Math.sin(a)*.56);maq.add(pole)}
    const base=cyl(.72,.78,.20,0xcaa03e,8);base.position.y=.10;maq.add(base);const top=cyl(.48,.67,.22,0xcaa03e,8);top.position.y=1.78;maq.add(top);
    const glass=new THREE.Mesh(new THREE.CylinderGeometry(.66,.66,1.55,8),new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.20,transmission:.82,roughness:.06,depthWrite:false}));glass.position.y=.95;maq.add(glass);root.add(maq);keyify(maq,'maqam');

    const corridor=new THREE.Group();corridor.position.set(27,0,0);root.add(corridor);const floor=box(8.2,.16,42,0xdedbd2);floor.position.y=.10;corridor.add(floor);const roof=box(8.2,.16,42,0xe8e5dc);roof.position.y=4.20;corridor.add(roof);
    for(let z=-20;z<=20;z+=2.5){[-3.85,3.85].forEach(x=>{const col=cyl(.11,.14,4.0,0xe8e3d8,10);col.position.set(x,2.0,z);corridor.add(col)})}
    [-4.2,4.2].forEach(z=>{const green=box(8.0,3.7,.16,0x36b27a);green.position.set(0,2.05,z);corridor.add(green)});for(let x=-2.4;x<=2.4;x+=1.2){const lane=box(.045,.03,40,0xb6b3aa);lane.position.set(x,.20,0);corridor.add(lane)}
    rockCluster(new THREE.Vector3(27,0,-20),'safa');rockCluster(new THREE.Vector3(27,0,20),'marwah');tube([new THREE.Vector3(27,.38,-19),new THREE.Vector3(27,.38,19),new THREE.Vector3(27,.38,-19)],0x39a878);

    const ruknHit=new THREE.Mesh(new THREE.SphereGeometry(.30,14,10),new THREE.MeshBasicMaterial({transparent:true,opacity:.01,depthWrite:false}));ruknHit.position.set(-2.88,1.10,-2.50);ruknHit.userData.key='rukn';root.add(ruknHit);clickable.push(ruknHit);
    const multazamHit=box(.88,1.75,.10,0x050505);multazamHit.material.transparent=true;multazamHit.material.opacity=.02;multazamHit.position.set(-2.18,1.72,2.56);multazamHit.userData.key='multazam';root.add(multazamHit);clickable.push(multazamHit);
    const mizabHit=new THREE.Mesh(new THREE.SphereGeometry(.32,14,10),new THREE.MeshBasicMaterial({transparent:true,opacity:.01,depthWrite:false}));mizabHit.position.set(3.45,6.45,0);mizabHit.userData.key='mizab';root.add(mizabHit);clickable.push(mizabHit);

    [['kaaba',new THREE.Vector3(0,0,0)],['door',new THREE.Vector3(-1.18,0,3.35)],['blackstone',new THREE.Vector3(-3.15,0,2.80)],['rukn',new THREE.Vector3(-3.15,0,-2.80)],['multazam',new THREE.Vector3(-2.15,0,3.45)],['hijr',new THREE.Vector3(7.15,0,0)],['mizab',new THREE.Vector3(4.25,0,0)],['maqam',new THREE.Vector3(-1.05,0,7.20)],['safa',new THREE.Vector3(27,0,-20)],['marwah',new THREE.Vector3(27,0,20)]].forEach(([k,p])=>marker(k,p,DATA.haram[k].n[lang==='en'?0:1]));
    for(let i=0;i<38;i++){const pilgrim=sph(.10,0xffffff);pilgrim.userData.t=i/38;pilgrim.userData.pilgrim=true;root.add(pilgrim)}Q('#scaleLabel').textContent='50 m'
  }`;

  const correctedReset = String.raw`function resetView(){if(mode==='hajj'){camera.position.set(0,88,-118);controls.target.set(0,0,2);controls.minDistance=18;controls.maxDistance=190}else{camera.position.set(34,28,46);controls.target.set(1.0,1.25,1.3);controls.minDistance=7;controls.maxDistance=120}controls.update()}`;

  const doorData = "DATA.haram.door={n:['Kaaba Door','કાબાનો દરવાજો'],a:'بَابُ الكَعْبَة',day:'Kaaba landmark',d:['Raised door on the same face as Maqam Ibrahim','મકામે ઇબ્રાહીમ તરફના કાબાના ભાગ પર ઊંચો દરવાજો'],i:['The door is placed on the same visible face as Maqam Ibrahim, close to the Hajar al-Aswad corner, matching the uploaded reference orientation.','દરવાજો મકામે ઇબ્રાહીમવાળા દેખાતા ભાગ પર અને હજરે અસ્વદના ખૂણા નજીક ગોઠવ્યો છે, અપલોડ કરેલ સંદર્ભ મુજબ.'],t:[['Use the door, Hajar al-Aswad and Maqam Ibrahim together to understand the orientation of this Kaaba face.'],['કાબાની આ બાજુની દિશા સમજવા દરવાજો, હજરે અસ્વદ અને મકામે ઇબ્રાહીમને સાથે ઓળખો.']],f:[['The door is raised above the Mataf floor and is not represented as a ground-level entrance.'],['દરવાજો મતાફના ફ્લોરથી ઊંચો છે; તેને જમીન-સ્તરનો પ્રવેશ બતાવ્યો નથી.']],dua:['','',''],p:[P.kaaba]};\n";

  async function start() {
    try {
      const response = await fetch('./app-v10.js?v=11', { cache: 'no-store' });
      if (!response.ok) throw new Error(`V10 application file returned HTTP ${response.status}`);
      let code = await response.text();
      code = code
        .replace(/  const enhancedKaaba = String\.raw`[\s\S]*?`;\n\n  const accurateProject/, `  const enhancedKaaba = String.raw\`${correctedKaaba}\`;\n\n  const accurateProject`)
        .replace(/  const accurateBuildHaram = String\.raw`[\s\S]*?`;\n  const accurateReset/, `  const accurateBuildHaram = String.raw\`${correctedBuildHaram}\`;\n  const accurateReset`)
        .replace(/  const accurateReset = String\.raw`[\s\S]*?`;/, `  const accurateReset = String.raw\`${correctedReset}\`;`)
        .replace("  const additions = String.raw`\n", `  const additions = String.raw\`\n${doorData}`);
      new Function(`${code}\n//# sourceURL=app-v11-patched-loader.js`)();
    } catch (error) {
      console.error('V11 patch startup failed:', error);
      showError(error?.message || String(error));
    }
  }

  start();
})();