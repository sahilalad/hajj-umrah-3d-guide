import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Text } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { JourneyStep } from '../types';

function MovingMarker({points}:{points:THREE.Vector3[]}) {
  const ref=useRef<THREE.Mesh>(null);
  const curve=useMemo(()=>new THREE.CatmullRomCurve3(points),[points]);
  useFrame(({clock})=>{const p=curve.getPoint((clock.elapsedTime*.08)%1);if(ref.current)ref.current.position.copy(p)});
  return <mesh ref={ref} position={points[0]}><sphereGeometry args={[.12,24,24]}/><meshStandardMaterial color="#f0c75e" emissive="#9f6e08" emissiveIntensity={1.2}/></mesh>;
}

function Site({position,label,kind}:{position:[number,number,number];label:string;kind:string}) {
  return <group position={position}>
    {kind==='kaaba'||kind==='tawaf'?<RoundedBox args={[1.2,1.2,1.2]} radius={.03}><meshStandardMaterial color="#111"/></RoundedBox>:<mesh><cylinderGeometry args={[.5,.7,.45,8]}/><meshStandardMaterial color={kind==='arafah'?'#9c7a51':kind==='mina'?'#e9e2cc':'#cfc7b8'}/></mesh>}
    <Text position={[0,1,0]} fontSize={.25} color="#f6edda" anchorX="center" outlineWidth={.008} outlineColor="#071c19">{label}</Text>
  </group>;
}

export function JourneyVisual({step}:{step:JourneyStep}) {
  const labels:Record<string,string>={miqat:'Miqat',kaaba:'Kaaba',tawaf:'Tawaf',sai:'Safa ↔ Marwah',mina:'Mina',arafah:'Arafah',muzdalifah:'Muzdalifah',jamarat:'Jamarat',halq:'Halq / Taqsir',complete:'Complete'};
  const points=[new THREE.Vector3(-2.8,.42,1.2),new THREE.Vector3(-1,.42,-1.2),new THREE.Vector3(1.4,.42,-.7),new THREE.Vector3(2.8,.42,1.1),new THREE.Vector3(.2,.42,1.8),new THREE.Vector3(-2.8,.42,1.2)];
  return <div className="journey-visual"><Canvas camera={{position:[0,5.6,7],fov:48}}>
    <color attach="background" args={['#08251f']}/><ambientLight intensity={1.2}/><directionalLight position={[4,7,3]} intensity={2.1}/>
    <mesh rotation={[-Math.PI/2,0,0]}><planeGeometry args={[9,6]}/><meshStandardMaterial color="#b79b6b" roughness={1}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,.02,0]}><ringGeometry args={[1.8,1.86,72]}/><meshStandardMaterial color="#f0c75e" emissive="#805d10"/></mesh>
    <Site position={[0,.65,0]} label={labels[step.visual]} kind={step.visual}/>
    <MovingMarker points={points}/>
    <OrbitControls enablePan={false} minDistance={5} maxDistance={10} maxPolarAngle={1.45}/>
  </Canvas></div>;
}
