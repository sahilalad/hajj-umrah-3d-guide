(() => {
  const loading=document.getElementById('loading');
  function showError(message){
    if(!loading)return;
    loading.classList.remove('hide');
    loading.innerHTML=`<div style="max-width:620px;padding:28px;text-align:center;color:#fff"><h2 style="margin:0 0 10px">3D map could not start</h2><p style="line-height:1.6;opacity:.9;word-break:break-word">${message}</p><button onclick="location.reload()" style="border:0;border-radius:12px;padding:12px 18px;background:#d9b55d;color:#17362f;font-weight:800">Retry</button></div>`;
  }
  async function start(){
    try{
      const response=await fetch('./app-v12.js?v=13',{cache:'no-store'});
      if(!response.ok)throw new Error(`V12 application file returned HTTP ${response.status}`);
      let source=await response.text();
      const followInjection="        .replace(\"      const run=new Function('THREE','OrbitControls'\", \"      code=code\\n        .replace(/let lang='en',mode='hajj',selected='haram',scene,camera,renderer,controls,root,raycaster,mouse,routeCurve,traveller,playing=false,rt=0,labelsOn=true,terrainOn=true,photos=\\\\[\\\\],photoIndex=0;/, \\\"let lang='en',mode='hajj',selected='haram',scene,camera,renderer,controls,root,raycaster,mouse,routeCurve,traveller,playing=false,followRoute=false,rt=0,labelsOn=true,terrainOn=true,photos=[],photoIndex=0;\\\")\\n        .replace(/Q\\\\('#routeBtn'\\\\)\\\\.onclick=\\\\(\\\\)=>\\\\{playing=!playing;setUI\\\\(\\\\)\\\\}/, \\\"Q('#routeBtn').onclick=()=>{playing=!playing;followRoute=playing;if(playing){controls.enabled=false}else{controls.enabled=true}setUI()}\\\")\\n        .replace(/Q\\\\('#routeSlider'\\\\)\\\\.oninput=e=>\\\\{rt=\\\\+e\\\\.target\\\\.value\\\\/1000;playing=false;setUI\\\\(\\\\)\\\\}/, \\\"Q('#routeSlider').oninput=e=>{rt=+e.target.value/1000;playing=false;followRoute=false;controls.enabled=true;setUI()}\\\")\\n        .replace(/function loop\\\\(t\\\\)\\\\{[\\\\s\\\\S]*?renderer\\\\.render\\\\(scene,camera\\\\)\\\\}/, \\\"function loop(t){\\n  requestAnimationFrame(loop);\\n  if(!playing&&!controls.enabled)controls.enabled=true;\\n  if(playing&&routeCurve){rt=(rt+.00065)%1;Q('#routeSlider').value=Math.round(rt*1000)}\\n  if(routeCurve&&traveller){\\n    const p=routeCurve.getPoint(rt);\\n    traveller.position.copy(p).add(new THREE.Vector3(0,.85,0));\\n    if(playing&&followRoute){\\n      const ahead=routeCurve.getPoint((rt+.018)%1);\\n      const dir=ahead.clone().sub(p);dir.y=0;if(dir.lengthSq()<.0001)dir.set(0,0,1);dir.normalize();\\n      const side=new THREE.Vector3(-dir.z,0,dir.x);\\n      const back=mode==='hajj'?11:7.5;\\n      const height=mode==='hajj'?8.5:5.2;\\n      const lateral=mode==='hajj'?4.5:2.8;\\n      const desired=p.clone().addScaledVector(dir,-back).addScaledVector(side,lateral).add(new THREE.Vector3(0,height,0));\\n      camera.position.lerp(desired,.045);\\n      const look=ahead.clone().add(new THREE.Vector3(0,mode==='hajj'?1.3:.9,0));\\n      controls.target.lerp(look,.075);\\n      camera.lookAt(controls.target);\\n    }else{\\n      controls.update();\\n    }\\n  }else{\\n    controls.update();\\n  }\\n  if(mode==='haram'){root.traverse(o=>{if(o.userData.pilgrim){const a=(t*.00015+o.userData.t)*Math.PI*2,r=8+(o.userData.t%3)*1.7;o.position.set(Math.cos(a)*r,.2,Math.sin(a)*r)}})}\\n  renderer.render(scene,camera)\\n}\\\");\\n      const run=new Function('THREE','OrbitControls'\")\n";
      const anchorLine='      const anchor = "        .replace(/  const accurateBuildHaram";';
      if(!source.includes(anchorLine))throw new Error('Could not locate the V12 route-follow patch point.');
      source=source.replace(anchorLine,`      const followInjection=${JSON.stringify(followInjection)};\n${anchorLine}`);
      source=source.replace('source = source.replace(anchor, injection + anchor);','source = source.replace(anchor, injection + followInjection + anchor);');
      new Function(`${source}\n//# sourceURL=app-v13-patched-loader.js`)();
    }catch(error){
      console.error('V13 patch startup failed:',error);
      showError(error?.message||String(error));
    }
  }
  start();
})();
