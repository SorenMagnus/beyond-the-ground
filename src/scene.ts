import type { SceneState, Vec3 } from './types';
export const chapters = [
  {id:'hangar',label:'启程',en:'BEYOND THE GROUND'},
  {id:'aircraft',label:'飞行器',en:'THE AIRCRAFT'},
  {id:'scan',label:'结构扫描',en:'BENEATH THE SURFACE'},
  {id:'structure',label:'工程拆解',en:'ENGINEERING, EXPOSED'},
  {id:'propulsion',label:'倾转飞行',en:'A DIFFERENT KIND OF LIFT'},
  {id:'limits',label:'工程边界',en:'THE PHYSICS OF POSSIBILITY'},
  {id:'city',label:'城市应用',en:'A NEW DIMENSION'},
  {id:'business',label:'商业判断',en:'BEYOND THE PROMISE'},
  {id:'finale',label:'结论',en:'THE SKY IS NOT THE LIMIT'},
];
export const clamp=(v:number,min=0,max=1)=>Math.max(min,Math.min(max,v));
export const smooth=(v:number)=>{const t=clamp(v);return t*t*(3-2*t)};
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
const mix3=(a:Vec3,b:Vec3,t:number):Vec3=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];
const poses:Vec3[]=[[12,6,17],[8,4.5,17],[9,7,16],[8,9,18],[11,6,16],[11,8,19],[14,12,23],[11,12,24],[17,11,28],[23,14,33]];
export function sceneAt(scene:number,progress:number,reduced=false):SceneState {
  const i=clamp(Math.floor(scene),0,8),p=clamp(progress),t=smooth(p);
  const scan=i===2?t:i===3?1-smooth(p*3):0;
  const explode=i===3?t:i===4?1-smooth(p*3):0;
  const tilt=i===4?smooth((p-.2)/.6):i>=5?1:0;
  const city=i===6?t:i===7?1:i===8?1-t:0;
  const morph=i===6?smooth((p-.65)/.35):i>=7?1:0;
  const portal=i===4&&!reduced?Math.sin(clamp((p-.25)/.55)*Math.PI):0;
  return {scene:i,progress:p,scan,explode,tilt,city,morph,portal,camera:reduced?[11,7,20]:mix3(poses[i],poses[i+1],t),target:[0,0,0]};
}
