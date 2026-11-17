import {chromium} from 'playwright';
import fs from 'node:fs/promises';
await fs.mkdir('qa/references',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:800}});
const demos=[...Array.from({length:11},(_,i)=>({name:`Seam-${i+1}`,url:`https://tympanus.net/Demos/SeamTransitions/index${i?i+1:''}.html`})),...['ScrollBasedLayoutAnimations','OneElementScroll','KineticTypePageTransition','3DCarousel'].map(name=>({name,url:`https://tympanus.net/Development/${name}/`})),{name:'interlude',url:'https://interlude.crnacura.workers.dev/'}];
const results=[];
for(const d of demos){try{const response=await page.goto(d.url,{waitUntil:'domcontentloaded',timeout:18000});await page.waitForTimeout(800);await page.mouse.wheel(0,520);await page.waitForTimeout(800);await page.screenshot({path:`qa/references/${d.name}.png`,timeout:10000});results.push({...d,status:response.status(),title:await page.title(),scroll:await page.evaluate(()=>({y:scrollY,height:document.documentElement.scrollHeight}))});console.log(d.name,response.status());}catch(e){results.push({...d,error:e.message.split('\n')[0]});console.log(d.name,'unavailable')}}
await fs.writeFile('qa/references/results.json',JSON.stringify(results,null,2));await browser.close();
