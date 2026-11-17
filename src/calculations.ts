export interface EngineeringInputs { mass:number; area:number; efficiency:number; liftDrag:number; speed:number; distance:number; hover:number; battery:number; reserve:number; }
export interface EngineeringResult { hoverPower:number; cruisePower:number; hoverEnergy:number; cruiseEnergy:number; energy:number; available:number; remaining:number; minutes:number; feasible:boolean; }
export const engineeringDefaults:EngineeringInputs={mass:2200,area:28,efficiency:.78,liftDrag:12,speed:220,distance:40,hover:2,battery:120,reserve:20};
export function engineering(i:EngineeringInputs):EngineeringResult {
  if(Object.values(i).some(v=>!Number.isFinite(v))||i.mass<=0||i.area<=0||i.efficiency<=0||i.efficiency>1||i.liftDrag<=0||i.speed<=0||i.distance<0||i.hover<0||i.battery<=0||i.reserve<0||i.reserve>=100)throw new RangeError('工程参数超出有效范围');
  const weight=i.mass*9.80665;
  const hoverPower=weight**1.5/Math.sqrt(2*1.225*i.area)/i.efficiency/1000;
  const cruisePower=weight*(i.speed/3.6)/i.liftDrag/i.efficiency/1000;
  const hoverEnergy=hoverPower*i.hover/60,cruiseEnergy=cruisePower*i.distance/i.speed;
  const energy=hoverEnergy+cruiseEnergy,available=i.battery*(1-i.reserve/100);
  return {hoverPower,cruisePower,hoverEnergy,cruiseEnergy,energy,available,remaining:available-energy,minutes:i.distance/i.speed*60+i.hover,feasible:energy<=available};
}
export interface BusinessInputs { occupancy:number; fare:number; hours:number; turnaround:number; electricity:number; charging:number; maintenance:number; fixed:number; days:number; }
export interface BusinessResult { flights:number; passengers:number; cost:number; revenue:number; perPassenger:number|null; breakEven:number|null; annualProfit:number; cycle:number; feasible:boolean; }
export const businessDefaults:BusinessInputs={occupancy:75,fare:600,hours:10,turnaround:12,electricity:1.2,charging:180,maintenance:450,fixed:3600000,days:300};
export function business(i:BusinessInputs,e:EngineeringResult):BusinessResult {
  if(Object.values(i).some(v=>!Number.isFinite(v)||v<0)||i.occupancy>100||i.days<=0||i.charging<=0)throw new RangeError('运营参数超出有效范围');
  // Charging and passenger turnaround overlap; 90% grid-to-pack efficiency.
  const cycle=e.minutes+Math.max(i.turnaround,e.energy/.9/i.charging*60);
  const flights=e.feasible?Math.floor(i.hours*60/cycle):0;
  const passengers=4*i.occupancy/100;
  const variable=e.energy/.9*i.electricity+i.maintenance;
  const cost=flights>0?variable+i.fixed/(flights*i.days):0;
  const revenue=passengers*i.fare;
  return {flights,passengers,cost,revenue,perPassenger:passengers>0&&flights>0?cost/passengers:null,breakEven:passengers>0&&flights>0?cost/passengers:null,annualProfit:flights*i.days*(revenue-variable)-i.fixed,cycle,feasible:e.feasible&&flights>0};
}
