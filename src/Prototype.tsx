import {useCallback,useRef,useState} from 'react';
import World from './World';
import {sceneAt} from './scene';
import type {WorldControls} from './types';
export default function Prototype(){
 const kind=Number(new URLSearchParams(location.search).get('prototype')??1),state=useRef(sceneAt(0,0));
 const [p,setP]=useState(0),[ready,setReady]=useState(false),[lost,setLost]=useState(false);
 const [controls,setControls]=useState<WorldControls>({mode:'story',wireframe:false,selected:'',preset:'story',reset:0,flight:null,reduced:false});
 const update=(v:number)=>{setP(v);const t=v/100*2.999;state.current=sceneAt((kind===2?2:0)+Math.floor(t),t%1)};
 const onReady=useCallback(()=>setReady(true),[]),onLost=useCallback(()=>setLost(true),[]);
 return <div className="prototype"><h1>Prototype {kind.toString().padStart(2,'0')} · {['','Continuity','Transition','Camera'][kind]}</h1><p>{ready?'WebGL ready':'Preparing'} {lost&&'Context lost'} · 连续性 / 可逆性 / 控制权</p><div className="prototype-stage"><World state={state} controls={controls} onSelect={id=>setControls(c=>({...c,selected:id}))} onReady={onReady} onLost={onLost}/></div><label>时间线 {p}%<input aria-label="原型进度" type="range" min="0" max="100" value={p} onChange={e=>update(+e.target.value)}/></label><button onClick={()=>setControls(c=>({...c,mode:c.mode==='inspect'?'story':'inspect'}))}>{controls.mode==='inspect'?'返回叙事':'探索模型'}</button><button onClick={()=>{update(0);setControls(c=>({...c,mode:'story',reset:c.reset+1}))}}>复位</button><a href="./">返回作品</a><output data-testid="prototype-state">{JSON.stringify({kind,p,mode:controls.mode,scene:state.current.scene,explode:state.current.explode,scan:state.current.scan})}</output></div>
}
