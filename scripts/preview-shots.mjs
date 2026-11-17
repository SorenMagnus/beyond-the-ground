import {chromium} from 'playwright';
import fs from 'node:fs/promises';
await fs.mkdir('qa/desktop',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
page.on('pageerror',e=>console.log('PAGEERROR',e.message));
await page.goto('http://127.0.0.1:5173/');
await page.waitForFunction(()=>window.__flight?.frames.length>10);
await page.waitForTimeout(1000);
const data=await page.locator('canvas').evaluate(c=>c.toDataURL('image/webp',.9));
await fs.writeFile('public/aircraft-poster.webp',Buffer.from(data.split(',')[1],'base64'));
console.log('renderer',await page.evaluate(()=>window.__flight.renderer));
await page.screenshot({path:'qa/desktop/hero.png'});
for(const id of ['aircraft','scan','structure','propulsion','limits','city','business','finale']){
 await page.evaluate(id=>{const e=document.getElementById(id);window.scrollTo(0,e.offsetTop+(id==='structure'?600:0))},id);
 await page.waitForTimeout(500);
 await page.screenshot({path:`qa/desktop/${id}.png`});
 console.log('captured',id);
}
await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:5173/');await page.waitForFunction(()=>window.__flight?.frames.length>10);await page.screenshot({path:'qa/mobile-hero.png'});
await browser.close();
