import {chromium} from 'playwright';
import fs from 'node:fs/promises';
await fs.mkdir('qa/prototypes',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const result=[];
for(const n of [1,2,3]){
 await page.goto(`http://127.0.0.1:5173/?prototype=${n}`);
 await page.waitForFunction(()=>window.__flight?.frames.length>10);
 const slider=page.getByRole('slider');
 const states=[];
 for(const p of [0,25,50,75,100,50,0]){
  await slider.fill(String(p));await page.waitForTimeout(200);
  states.push({p,...await page.evaluate(()=>({state:window.__flight.state,parts:window.__flight.parts}))});
  if([0,50,100].includes(p))await page.screenshot({path:`qa/prototypes/${n}-${p}.png`});
 }
 if(n===3){await page.getByRole('button',{name:'探索模型'}).click();const before=await page.evaluate(()=>window.__flight.camera);await page.mouse.move(900,400);await page.mouse.down();await page.mouse.move(1100,440,{steps:12});await page.mouse.up();await page.waitForTimeout(300);const after=await page.evaluate(()=>window.__flight.camera);if(JSON.stringify(before)===JSON.stringify(after))throw Error('Orbit drag failed');await page.getByRole('button',{name:'复位',exact:true}).click();}
 result.push({prototype:n,states,canvasCount:await page.locator('canvas').count(),diagnostics:await page.evaluate(()=>({calls:window.__flight.calls,triangles:window.__flight.triangles,renderer:window.__flight.renderer}))});
}
await fs.writeFile('qa/prototypes/results.json',JSON.stringify({errors,result},null,2));
await browser.close();
console.log(JSON.stringify({errors,prototypes:result.map(r=>({id:r.prototype,canvas:r.canvasCount,...r.diagnostics}))}));
if(errors.length)process.exit(1);
