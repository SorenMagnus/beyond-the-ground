import {describe,it,expect} from 'vitest';
import {engineering,engineeringDefaults as E,business,businessDefaults as B} from './calculations';
import {sceneAt} from './scene';
describe('engineering units and boundaries',()=>{
  it('matches independent hover and cruise calculations',()=>{const r=engineering(E);expect(r.hoverPower).toBeCloseTo(490.5,0);expect(r.cruiseEnergy).toBeCloseTo(E.mass*9.80665*(E.distance*1000)/E.liftDrag/E.efficiency/3.6e6,8);expect(r.energy).toBeCloseTo(r.hoverEnergy+r.cruiseEnergy,8)});
  it('mass raises hover power superlinearly and area reduces it',()=>{expect(engineering({...E,mass:E.mass*2}).hoverPower/engineering(E).hoverPower).toBeCloseTo(2**1.5);expect(engineering({...E,area:E.area*4}).hoverPower).toBeCloseTo(engineering(E).hoverPower/2)});
  it('zero distance retains hover and invalid efficiencies fail',()=>{expect(engineering({...E,distance:0}).cruiseEnergy).toBe(0);expect(()=>engineering({...E,efficiency:0})).toThrow();expect(()=>engineering({...E,mass:NaN})).toThrow()});
  it('reserve and depleted capacity gate feasibility',()=>{expect(engineering({...E,battery:10}).feasible).toBe(false);expect(engineering({...E,reserve:50}).available).toBe(60)});
});
describe('business constraints',()=>{
  it('zero occupancy has undefined per-person price and negative profit',()=>{const r=business({...B,occupancy:0},engineering(E));expect(r.breakEven).toBeNull();expect(r.annualProfit).toBeLessThan(0)});
  it('unflyable missions and zero hours cannot produce revenue',()=>{expect(business(B,engineering({...E,battery:1})).flights).toBe(0);expect(business({...B,hours:0},engineering(E)).annualProfit).toBe(-B.fixed)});
  it('charging limits utilization and higher fares increase profit',()=>{const e=engineering(E);expect(business({...B,charging:20},e).flights).toBeLessThan(business(B,e).flights);expect(business({...B,fare:900},e).annualProfit).toBeGreaterThan(business(B,e).annualProfit)});
});
describe('reversible cinematic state',()=>{
  it('seeking back is independent of history',()=>{const a=sceneAt(3,.5);sceneAt(8,1);sceneAt(1,0);expect(sceneAt(3,.5)).toEqual(a)});
  it('parts restore at start and next scene joins previous end',()=>{expect(sceneAt(3,0).explode).toBe(0);expect(sceneAt(3,1).explode).toBe(1);expect(sceneAt(4,0).explode).toBe(1);expect(sceneAt(4,.5).explode).toBe(0);for(let i=0;i<8;i++)expect(sceneAt(i,1).camera).toEqual(sceneAt(i+1,0).camera)});
});
