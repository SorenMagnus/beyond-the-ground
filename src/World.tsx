import {useEffect,useMemo,useRef} from 'react';
import type {MutableRefObject} from 'react';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {OrbitControls,Html} from '@react-three/drei';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import * as T from 'three';
import {bladeGeometry,fuselageGeometry,parts,wingGeometry} from './model';
import {clamp,smooth} from './scene';
import type {SceneState,WorldControls} from './types';

interface Props {state:MutableRefObject<SceneState>;controls:WorldControls;onSelect:(id:string)=>void;onReady:()=>void;onLost:()=>void;}
function Aircraft({state,controls,onSelect}:{state:Props['state'];controls:WorldControls;onSelect:Props['onSelect']}){
 const root=useRef<T.Group>(null),wing=useRef<T.Group>(null),tail=useRef<T.Group>(null),battery=useRef<T.Group>(null);
 const rotors=useRef<(T.Group|null)[]>([]),spinners=useRef<(T.Group|null)[]>([]);
 const geom=useMemo(()=>({body:fuselageGeometry(),wing:wingGeometry(),tail:wingGeometry(2.5,1.05,.7),blade:bladeGeometry(),nacelle:new T.SphereGeometry(1,24,16),battery:new T.BoxGeometry(1.1,.36,.55)}),[]);
 const silver=useMemo(()=>new T.MeshPhysicalMaterial({color:'#c7d2da',metalness:.62,roughness:.29,clearcoat:.6,side:T.DoubleSide}),[]);
 const dark=useMemo(()=>new T.MeshPhysicalMaterial({color:'#11232f',metalness:.45,roughness:.17,clearcoat:1}),[]);
 const graphite=useMemo(()=>new T.MeshStandardMaterial({color:'#263039',metalness:.6,roughness:.4,side:T.DoubleSide}),[]);
 const energyMat=useMemo(()=>new T.MeshStandardMaterial({color:'#1f6067',metalness:.5,roughness:.4,emissive:'#16434a',emissiveIntensity:.5}),[]);
 const lineMat=useMemo(()=>new T.LineBasicMaterial({color:'#96e5ef',transparent:true,opacity:0,depthWrite:false}),[]);
 const edges=useMemo(()=>({body:new T.WireframeGeometry(geom.body),wing:new T.EdgesGeometry(geom.wing,18),tail:new T.EdgesGeometry(geom.tail,18)}),[geom]);
 const uniforms=useMemo(()=>({scan:{value:0}}),[]);
 useEffect(()=>{
  const mats=[silver,dark,graphite];mats.forEach(m=>{m.onBeforeCompile=s=>{s.uniforms.uScan=uniforms.scan;s.vertexShader='varying vec3 vScanPosition;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvScanPosition = (modelMatrix * vec4(position, 1.0)).xyz;');s.fragmentShader='uniform float uScan; varying vec3 vScanPosition;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <dithering_fragment>','#include <dithering_fragment>\nfloat scanEdge = mix(-12.0, 12.0, uScan);\nif(uScan > 0.001 && vScanPosition.x < scanEdge) discard;\nfloat scanBand = 1.0-smoothstep(0.0,0.13,abs(vScanPosition.x-scanEdge));\ngl_FragColor.rgb += vec3(0.1,0.7,0.8)*scanBand*step(0.001,uScan);');};m.needsUpdate=true;});
  const outlines:T.LineSegments[]=[];const geometries=new Map<T.BufferGeometry,T.EdgesGeometry>();
  root.current?.traverse(o=>{if(o instanceof T.Mesh){let g=geometries.get(o.geometry);if(!g){g=new T.EdgesGeometry(o.geometry,18);geometries.set(o.geometry,g)}const lines=new T.LineSegments(g,lineMat);lines.scale.setScalar(1.002);outlines.push(lines);}});
  let n=0;const meshes:T.Mesh[]=[];root.current?.traverse(o=>{if(o instanceof T.Mesh)meshes.push(o)});meshes.forEach(m=>m.add(outlines[n++]));
  return()=>{outlines.forEach(l=>l.removeFromParent());geometries.forEach(g=>g.dispose());Object.values(geom).forEach(g=>g.dispose());Object.values(edges).forEach(g=>g.dispose());[silver,dark,graphite,energyMat,lineMat].forEach(m=>m.dispose());};
 },[geom,edges,silver,dark,graphite,energyMat,lineMat,uniforms]);
 const rotorPositions=useMemo(()=>[[1.1,.9,2.35],[.45,.9,4.7],[1.1,.9,-2.35],[.45,.9,-4.7],[-3.8,1.1,1.9],[-3.8,1.1,-1.9]],[]);
 useFrame((_,dt)=>{
  const s=state.current,e=s.explode,f=controls.flight===null?null:controls.flight/100;
  const tilt=f===null?s.tilt:f<.2?0:f<.45?smooth((f-.2)/.25):f<.75?1:1-smooth((f-.75)/.2);
  uniforms.scan.value=controls.wireframe?1:s.scan;
  lineMat.opacity=controls.wireframe?.68:s.scan*.45;
  wing.current?.position.set(0,e*2.1,0);tail.current?.position.set(-e*1.8,e*1.3,0);
  if(battery.current){battery.current.position.set(-.4,-.6-e*1.6,e*2.3);battery.current.visible=e>.04;}
  rotors.current.forEach((r,i)=>{if(!r)return;const p=rotorPositions[i];r.position.set(p[0]+(i>=4?-e*.8:0),p[1]+e*2.7,p[2]+Math.sign(p[2])*e*1.2);r.rotation.z=-tilt*Math.PI/2;});
  spinners.current.forEach((r,i)=>{if(r&&!controls.reduced)r.rotation.y+=Math.min(dt,.05)*(s.scene>=4?12:1.8)*(i%2?1:-1)});
  if(root.current){root.current.rotation.y=s.scene===0?-.08:s.scene===8?-.08-s.progress*.3:0;root.current.position.y=f!==null?(f<.2?smooth(f/.2)*1.5:f>.75?(1-smooth((f-.75)/.25))*1.5:1.5):s.scene===4?smooth(s.progress)*1.1:s.scene>=5?1.1:0;root.current.position.x=f!==null?Math.sin(f*Math.PI)*1.2:0;root.current.scale.setScalar(s.scene===8?1-s.progress*.38:1)}
  if(window.__flight)window.__flight.parts={wing:wing.current?.position.toArray()??[],tail:tail.current?.position.toArray()??[],rotor:rotors.current[0]?.position.toArray()??[]};
 });
 const choose=(id:string)=>(e:{stopPropagation:()=>void})=>{if(controls.mode==='inspect'){e.stopPropagation();onSelect(id)}};
 function highlight(id:string){return controls.selected===id&&controls.mode==='inspect'}
 return <group ref={root} name="research-aircraft">
  <group onClick={choose('fuselage')}>
   <mesh geometry={geom.body} material={silver}/><lineSegments geometry={edges.body} material={lineMat}/>
   <mesh position={[1.45,.61,0]} scale={[1.72,.66,.79]} material={dark}><sphereGeometry args={[1,40,24]}/></mesh>
   {[-1.45,-.48,.4].map((x,i)=><group key={x}>{[-1,1].map(sign=><mesh key={sign} position={[x,.36,sign*(.855-i*.025)]} rotation={[0,0,-.03]} scale={[.36,.41,.053]} material={dark}><sphereGeometry args={[1,20,16]}/></mesh>)}</group>)}
   {[-1,1].map(sign=><mesh key={sign} position={[-.9,-.23,sign*.9]} rotation={[Math.PI/2,0,0]}><boxGeometry args={[3.1,.018,.025]}/><meshStandardMaterial color="#4d778a" metalness={.5} roughness={.4}/></mesh>)}
   {highlight('fuselage')&&<mesh geometry={geom.body} scale={1.008}><meshBasicMaterial color="#94e9e5" wireframe transparent opacity={.18}/></mesh>}
  </group>
  <group ref={wing} onClick={choose('wing')}>
   {[-1,1].map(sign=><group key={sign} position={[-.6,.68,0]} scale={[1,1,sign]}><mesh geometry={geom.wing} material={silver}/><lineSegments geometry={edges.wing} material={lineMat}/>{highlight('wing')&&<mesh geometry={geom.wing}><meshBasicMaterial color="#94e9e5" wireframe/></mesh>}<mesh position={[-1, .17,5.6]}><sphereGeometry args={[.055,8,8]}/><meshBasicMaterial color={sign===1?'#67dac5':'#ff9e85'}/></mesh></group>)}
  </group>
  <group ref={tail} onClick={choose('tail')}>
   {[-1,1].map(sign=><group key={sign} position={[-3.75,.28,0]} rotation={[sign*-.48,0,0]} scale={[1,1,sign]}><mesh geometry={geom.tail} material={silver}/><lineSegments geometry={edges.tail} material={lineMat}/></group>)}
  </group>
  {rotorPositions.map((p,i)=><group key={i} ref={el=>{rotors.current[i]=el}} position={p as [number,number,number]} onClick={choose('propulsion')}>
    <mesh geometry={geom.nacelle} scale={[.22,.63,.22]} material={silver}/>
    <mesh position={[0,.56,0]}><cylinderGeometry args={[.16,.2,.2,24]}/><primitive object={graphite} attach="material"/></mesh>
    <group position={[0,.69,0]} ref={el=>{spinners.current[i]=el}}>{Array.from({length:5},(_,j)=><mesh key={j} geometry={geom.blade} rotation={[0,j*Math.PI*2/5,0]} material={graphite}/>)}</group>
    <mesh position={[0,.73,0]} scale={[.15,.13,.15]} geometry={geom.nacelle} material={silver}/>
    {(highlight('propulsion')||controls.wireframe)&&<mesh rotation={[Math.PI/2,0,0]} position={[0,.69,0]}><torusGeometry args={[1.48,.012,6,64]}/><meshBasicMaterial color="#95e9e5"/></mesh>}
  </group>)}
  <group ref={battery} visible={false} onClick={choose('battery')}>
   {[-1,1].map(sign=>[0,1,2].map(i=><mesh key={`${sign}${i}`} geometry={geom.battery} material={energyMat} position={[i*1.15-1.15,0,sign*.35]}/>))}
  </group>
  {[[2.3,-.95,0],[-1.3,-.85,1],[-1.3,-.85,-1]].map((p,i)=><group key={i} position={p as [number,number,number]}><mesh position={[0,-.3,0]} rotation={[0,0,.2]} material={silver}><cylinderGeometry args={[.048,.06,.7,12]}/></mesh><mesh position={[.07,-.64,0]} rotation={[Math.PI/2,0,0]} material={graphite}><torusGeometry args={[.2,.085,12,20]}/></mesh><mesh position={[.07,-.64,0]} rotation={[Math.PI/2,0,0]} material={silver}><cylinderGeometry args={[.12,.12,.12,16]}/></mesh></group>)}
 </group>;
}
function City({state,controls}:{state:Props['state'];controls:WorldControls}){
 const ref=useRef<T.InstancedMesh>(null);const dummy=useMemo(()=>new T.Object3D(),[]);const labels=useRef<(HTMLSpanElement|null)[]>([]);const costs=controls.costs??[56,450,571];
 const buildings=useMemo(()=>Array.from({length:48},(_,i)=>({x:(i%8-3.5)*3.4,z:(Math.floor(i/8)-2.5)*3.5,h:1+((i*13)%17)/4})),[]);
 useFrame(()=>{if(!ref.current)return;const s=state.current;ref.current.visible=s.city>.005;buildings.forEach((b,i)=>{const m=s.morph,h=T.MathUtils.lerp(b.h,costs[i%3]/Math.max(...costs,1)*5,m)*s.city;dummy.position.set(T.MathUtils.lerp(b.x,(i%3-1)*4,m),-4+h*.5,T.MathUtils.lerp(b.z,0,m));const visibility=i<3?1:Math.max(.001,1-m);dummy.scale.set(T.MathUtils.lerp(1.5,2,m)*visibility,Math.max(.001,h),T.MathUtils.lerp(1.5,.8,m)*visibility);dummy.updateMatrix();ref.current!.setMatrixAt(i,dummy.matrix)});ref.current.instanceMatrix.needsUpdate=true;labels.current.forEach(el=>{if(el)el.style.opacity=String(s.scene===6?clamp((s.morph-.4)/.6):0)});});
 return <><instancedMesh ref={ref} args={[undefined,undefined,48]}><boxGeometry/><meshStandardMaterial color="#42596a" roughness={.65} metalness={.3}/></instancedMesh>{['电费','维护','固定分摊'].map((label,i)=><Html key={label} position={[(i-1)*4,-4.2,0]} center zIndexRange={[1,0]}><span ref={el=>{labels.current[i]=el}} className="world-cost-label">{label}<b>¥{costs[i].toFixed(0)}</b></span></Html>)}</>;
}
function Stage({state,controls,onSelect,onReady,onLost}:Props){
 const {gl,scene,camera,size}=useThree(),orbit=useRef<any>(null),ring=useRef<T.Mesh>(null),floor=useRef<T.Mesh>(null),track=useRef<T.Group>(null);
 const cameraTarget=useRef(new T.Vector3()),desired=useMemo(()=>new T.Vector3(),[]),look=useMemo(()=>new T.Vector3(),[]);
 const refControls=useRef(controls);refControls.current=controls;
 const routeGeometry=useMemo(()=>{const curve=new T.CatmullRomCurve3([new T.Vector3(-14,-.2,-6),new T.Vector3(-8,1,-3),new T.Vector3(0,1,0),new T.Vector3(8,2,3),new T.Vector3(16,3,1)]);return new T.TubeGeometry(curve,100,.025,6,false)},[]);
 useEffect(()=>{
  const pmrem=new T.PMREMGenerator(gl),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);scene.environment=env.texture;
  const ext=gl.getContext().getExtension('WEBGL_debug_renderer_info');const renderer=ext?gl.getContext().getParameter(ext.UNMASKED_RENDERER_WEBGL):'unknown';
  window.__flight={state:state.current,camera:[],calls:0,triangles:0,frames:[],renderer,parts:{}};
  const lost=(e:Event)=>{e.preventDefault();onLost()};gl.domElement.addEventListener('webglcontextlost',lost);onReady();
  return()=>{gl.domElement.removeEventListener('webglcontextlost',lost);scene.environment=null;env.dispose();room.dispose();pmrem.dispose();routeGeometry.dispose()};
 },[gl,scene,state,onReady,onLost,routeGeometry]);
 useEffect(()=>{
  if(controls.mode==='inspect'&&orbit.current){orbit.current.target.copy(cameraTarget.current);orbit.current.update()}
 },[controls.mode]);
 useEffect(()=>{
  if(controls.preset!=='story'){
    const poses={front:[19,2.5,0],side:[0,4,21],top:[0,23,.01]};camera.position.fromArray(poses[controls.preset]);camera.lookAt(0,0,0);cameraTarget.current.set(0,0,0);if(orbit.current){orbit.current.target.set(0,0,0);orbit.current.update()}
  }
 },[controls.preset,controls.reset,camera]);
 useFrame((_,dt)=>{
  const s=state.current,c=refControls.current,mobile=size.width<650;
  if(c.mode!=='inspect'){
   desired.fromArray(s.camera);look.fromArray(s.target);
   if(mobile)desired.multiplyScalar(.94);
   if(s.portal>0&&!mobile){desired.lerp(new T.Vector3(4,2.2,7),s.portal*.64);look.lerp(new T.Vector3(.45,1,4.7),s.portal*.4)}
   const a=1-Math.exp(-Math.min(dt,.05)*9);camera.position.lerp(desired,a);cameraTarget.current.lerp(look,a);camera.lookAt(cameraTarget.current);
  }
  if(ring.current){ring.current.visible=s.portal>.01;ring.current.position.set(.45,1,4.7);ring.current.quaternion.copy(camera.quaternion);ring.current.scale.setScalar(1+s.portal*3.8);(ring.current.material as T.MeshBasicMaterial).opacity=Math.sin(s.portal*Math.PI*.85)*.5;}
  if(floor.current){(floor.current.material as T.ShaderMaterial).uniforms.fade.value=1-smooth(s.scene===4?s.progress:s.scene>4?1:0)}
  if(track.current){track.current.visible=s.scene>=4;track.current.scale.setScalar(.5+s.tilt*.5)}
  if(window.__flight){window.__flight.state={...s};window.__flight.camera=camera.position.toArray();window.__flight.calls=gl.info.render.calls;window.__flight.triangles=gl.info.render.triangles;if(window.__flight.frames.length<1200)window.__flight.frames.push(dt*1000)}
 });
 return <>
  <ambientLight intensity={.45}/><hemisphereLight args={['#d1e5f4','#16232d',2.2]}/>
  <directionalLight position={[4,10,6]} intensity={4.5} color="#e1eef6"/><directionalLight position={[-7,4,-6]} intensity={5} color="#83adca"/><directionalLight position={[7,2,-7]} intensity={2} color="#f4f0e2"/>
  <Aircraft state={state} controls={controls} onSelect={onSelect}/>
  <mesh ref={floor} rotation={[-Math.PI/2,0,0]} position={[0,-1.8,0]}><planeGeometry args={[28,28]}/><shaderMaterial transparent depthWrite={false} uniforms={{fade:{value:1}}} vertexShader={'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}'} fragmentShader={'varying vec2 vUv;uniform float fade;void main(){float r=length(vUv-.5)*3.;gl_FragColor=vec4(.065,.095,.12,(1.-smoothstep(.1,.9,r))*.6*fade);}'}/></mesh>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.79,0]}><ringGeometry args={[7.1,7.12,128]}/><meshBasicMaterial color="#39505e" transparent opacity={.5}/></mesh>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.78,0]}><ringGeometry args={[7.7,7.72,128]}/><meshBasicMaterial color="#263b49" transparent opacity={.5}/></mesh>
  <City state={state} controls={controls}/>
  <group ref={track}><mesh geometry={routeGeometry}><meshBasicMaterial color="#a2e6e8" transparent opacity={.6}/></mesh>{[0,1,2].map(i=><mesh key={i} geometry={routeGeometry} position={[0,-.15*i,-.22*i]}><meshBasicMaterial color="#78a9bb" transparent opacity={.2}/></mesh>)}</group>
  <mesh ref={ring}><torusGeometry args={[1.5,.018,8,128]}/><meshBasicMaterial color="#b0ebf1" transparent depthWrite={false}/></mesh>
  <OrbitControls ref={orbit} enabled={controls.mode==='inspect'} enablePan={false} enableZoom={false} enableDamping dampingFactor={.1} minPolarAngle={.12} maxPolarAngle={Math.PI*.84}/>
 </>;
}
export default function World(props:Props){return <Canvas camera={{position:[12,6,17],fov:37,near:.1,far:180}} dpr={[1,window.innerWidth<700?1:1.5]} gl={{antialias:true,alpha:true,powerPreference:'high-performance',preserveDrawingBuffer:true}}><Stage {...props}/></Canvas>}
