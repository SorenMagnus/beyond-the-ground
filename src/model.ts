import * as THREE from 'three';
import type {PartDefinition} from './types';
export const parts:PartDefinition[]=[
 {id:'fuselage',label:'复合材料机身',description:'流线型座舱与固定翼构成升力巡航平台。此模型为原创外形研究，不是制造级 CAD。',evidence:'外形研究',rest:[0,0,0],explode:[0,0,0]},
 {id:'wing',label:'主翼与升力',description:'巡航中由机翼承担主要升力，降低持续悬停的功率需求。翼型与梁结构未公开，此处仅展示功能关系。',evidence:'外形研究',rest:[0,0,0],explode:[0,2.1,0]},
 {id:'propulsion',label:'六组倾转推进',description:'六组推进器在垂直升力与前向推力之间转换。独立电驱有助于故障隔离；不等于任意失效都可安全飞行。',evidence:'外形研究',rest:[0,0,0],explode:[0,2.7,1]},
 {id:'tail',label:'尾翼与姿态控制',description:'尾翼在前飞中参与稳定和控制。控制分配需要随速度、气动状态和推进器倾角连续变化。',evidence:'外形研究',rest:[0,0,0],explode:[-1.8,1.3,0]},
 {id:'battery',label:'电池与能源路径',description:'能源模块的几何、数量与位置是教学示意，并非 Joby 内部布置。关注比能量、倍率、散热和热失控隔离的权衡。',evidence:'教学示意',rest:[0,-.5,0],explode:[0,-2,2.3]},
];
export function fuselageGeometry(){
 const rings=64,sides=48,pos:number[]=[],uv:number[]=[],idx:number[]=[];
 const profile=[[-4.8,.06,.06],[-4,.23,.3],[-3,.5,.57],[-2,.76,.86],[-1,.91,1.04],[0,.96,1.12],[1,.88,1.07],[2,.72,.86],[3,.51,.61],[3.8,.25,.3],[4.1,.025,.03]];
 for(let i=0;i<=rings;i++){const x=-4.8+8.9*i/rings;let j=0;while(j<profile.length-2&&x>profile[j+1][0])j++;const a=profile[j],b=profile[j+1],t=(x-a[0])/(b[0]-a[0]);const w=a[1]+(b[1]-a[1])*t,h=a[2]+(b[2]-a[2])*t;
 for(let k=0;k<=sides;k++){const ang=k/sides*Math.PI*2;pos.push(x,Math.cos(ang)*h+(x>1?.05:0),Math.sin(ang)*w);uv.push(i/rings,k/sides);if(i<rings&&k<sides){const n=i*(sides+1)+k;idx.push(n,n+sides+1,n+1,n+1,n+sides+1,n+sides+2)}}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
}
export function wingGeometry(span=5.8,chord=1.65,sweep=.35){
 const p:number[]=[],idx:number[]=[];const nz=24,nx=24;
 for(let side=0;side<2;side++)for(let z=0;z<=nz;z++)for(let i=0;i<=nx;i++){const t=i/nx,s=z/nz,w=chord*(1-.55*s),th=.12*5*(.2969*Math.sqrt(t)-.126*t-.3516*t*t+.2843*t**3-.1015*t**4)*w;
 p.push(.1-s*sweep-t*w,(side===0?1:-1)*th+s*.14,s*span);}
 const plane=(nz+1)*(nx+1);for(let side=0;side<2;side++)for(let z=0;z<nz;z++)for(let i=0;i<nx;i++){const n=side*plane+z*(nx+1)+i;side===0?idx.push(n,n+1,n+nx+1,n+1,n+nx+2,n+nx+1):idx.push(n,n+nx+1,n+1,n+1,n+nx+1,n+nx+2)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
export function bladeGeometry(){const s=new THREE.Shape();s.moveTo(.12,-.07);s.bezierCurveTo(.5,-.12,1.1,-.1,1.35,.03);s.lineTo(1.46,.14);s.bezierCurveTo(.9,.2,.4,.15,.12,.07);s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:.028,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.018,bevelThickness:.012});g.rotateX(-Math.PI/2);return g;}
