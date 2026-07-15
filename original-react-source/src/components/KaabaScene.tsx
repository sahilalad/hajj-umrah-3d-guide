import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, RoundedBox, Sparkles } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function Pilgrim({index}:{index:number}) {
  const ref = useRef<THREE.Group>(null);
  const offset = useMemo(()=>index*Math.PI*2/28,[index]);
  const radius = 3.05 + (index%3)*0.32;
  useFrame(({clock})=>{
    const t=clock.elapsedTime*.22+offset;
    if(ref.current){ref.current.position.set(Math.cos(t)*radius,.18,Math.sin(t)*radius);ref.current.rotation.y=-t;}
  });
  return <group ref={ref}><mesh castShadow><capsuleGeometry args={[.055,.18,4,8]}/><meshStandardMaterial color={index%5===0?'#d8c9a7':'#ffffff'} roughness={.8}/></mesh></group>;
}

function KaabaModel() {
  return <group position={[0,1.3,0]}>
    <RoundedBox args={[2.65,2.65,2.65]} radius={.04} smoothness={4} castShadow receiveShadow><meshStandardMaterial color="#0b0b0c" roughness={.78}/></RoundedBox>
    <mesh position={[0,.42,1.334]}><boxGeometry args={[2.5,.32,.035]}/><meshStandardMaterial color="#b68a32" metalness={.35} roughness={.45}/></mesh>
    <mesh position={[.62,-.53,1.36]}><boxGeometry args={[.52,1.08,.04]}/><meshStandardMaterial color="#c69a3d" metalness={.55} roughness={.38}/></mesh>
    <mesh position={[.62,-.34,1.39]}><boxGeometry args={[.34,.55,.02]}/><meshStandardMaterial color="#8f6a21" metalness={.7}/></mesh>
    {[-1.15,-.75,-.35,.05,.45,.85,1.25].map((x,i)=><mesh key={i} position={[x,.42,1.375]}><boxGeometry args={[.16,.2,.015]}/><meshStandardMaterial color="#e4c56d" metalness={.45}/></mesh>)}
  </group>;
}

export function KaabaScene({compact=false}:{compact?:boolean}) {
  return <div className={compact?'scene scene-compact':'scene'}>
    <Canvas shadows dpr={[1,1.7]} camera={{position:[6,4.8,7],fov:42}}>
      <color attach="background" args={['#071c19']}/>
      <fog attach="fog" args={['#071c19',10,22]}/>
      <ambientLight intensity={.85}/><directionalLight castShadow position={[5,8,4]} intensity={2.2} color="#fff0d3" shadow-mapSize={[1024,1024]}/>
      <pointLight position={[-5,3,-4]} intensity={18} color="#1b8b72" distance={11}/>
      <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><circleGeometry args={[7,96]}/><meshStandardMaterial color="#e9e4da" roughness={.95}/></mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,.012,0]}><ringGeometry args={[2.8,4.15,96]}/><meshStandardMaterial color="#d4cec0" roughness={1}/></mesh>
      <KaabaModel/>
      {Array.from({length:28},(_,i)=><Pilgrim key={i} index={i}/>) }
      <Sparkles count={55} scale={[10,5,10]} size={1.2} speed={.25} opacity={.18}/>
      <Environment preset="sunset"/>
      <OrbitControls enablePan={false} minDistance={5.5} maxDistance={10} minPolarAngle={.55} maxPolarAngle={1.38} autoRotate autoRotateSpeed={.35}/>
    </Canvas>
    <div className="scene-hint">Drag to rotate • Pinch or scroll to zoom</div>
  </div>;
}
