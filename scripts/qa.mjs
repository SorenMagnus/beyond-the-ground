import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.QA_URL||'http://127.0.0.1:5173/';
const out=process.env.QA_OUT||'qa/final';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});
const report={base,started:new Date().toISOString(),checks:[],errors:[],resourceErrors:[],screenshots:[],performance:null};
const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
page.on('pageerror',e=>report.errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))report.resourceErrors.push({url:r.url(),status:r.status()})});
const check=(name,condition)=>{assert.ok(condition,name);report.checks.push(name);console.log('PASS',name)};
const shot=async(name,p=page)=>{await p.screenshot({path:`${out}/${name}.png`});report.screenshots.push(name)};
const seek=async(id,p=.15,target=page)=>{await target.evaluate(({id,p})=>{const el=document.getElementById(id),els=[...document.querySelectorAll('.scene-section')],i=els.indexOf(el),end=els[i+1]?.offsetTop??document.documentElement.scrollHeight-innerHeight;scrollTo(0,el.offsetTop+(end-el.offsetTop)*p)},{id,p});await target.waitForTimeout(350)};
try{
 await page.goto(base);await page.waitForFunction(()=>window.__flight?.frames.length>12);await page.waitForTimeout(600);
 const canvas=page.locator('canvas');const identity=await canvas.evaluate(c=>c.dataset.qaIdentity='persistent-canvas');
 await shot('1440-hero');check('one live canvas',await canvas.count()===1);
 // User navigation, inspection, presets, reset, and keyboard exit.
 await page.getByRole('button',{name:'开启飞行探索'}).click();await page.waitForTimeout(1000);check('hero CTA navigates to aircraft',await page.evaluate(()=>document.body.dataset.scene)==='1');
 await page.getByRole('button',{name:'工程探索 ENGINEERING'}).click();await page.waitForTimeout(1000);
 await page.getByRole('button',{name:'探索模型',exact:true}).click();const before=await page.evaluate(()=>window.__flight.camera);
 await page.mouse.move(990,390);await page.mouse.down();await page.mouse.move(1120,490,{steps:15});await page.mouse.up();await page.waitForTimeout(250);
 check('manual orbit moves camera',JSON.stringify(before)!==JSON.stringify(await page.evaluate(()=>window.__flight.camera)));
 for(const label of ['模型正视图','模型侧视图','模型俯视图']){await page.getByRole('button',{name:label,exact:true}).click();await page.waitForTimeout(200);check(label,await page.getByRole('button',{name:'退出探索',exact:true}).count()===1)}
 await page.getByRole('button',{name:'切换线框',exact:true}).click();check('wireframe toggle on',await page.getByRole('button',{name:'切换线框',exact:true}).getAttribute('aria-pressed')==='true');
 await page.getByRole('button',{name:'切换线框',exact:true}).click();
 await page.getByRole('button',{name:'05 电池与能源路径'}).click();check('part selection exposes schematic label',await page.locator('.part-note').innerText().then(t=>t.includes('教学示意')));
 await page.getByRole('button',{name:'复位模型',exact:true}).click();await page.waitForTimeout(800);check('reset restores story controls',await page.getByRole('button',{name:'探索模型',exact:true}).count()===1);
 await page.getByRole('button',{name:'探索模型',exact:true}).click();await page.keyboard.press('Escape');await page.waitForTimeout(800);check('Escape exits inspection',await page.getByRole('button',{name:'探索模型',exact:true}).count()===1);
 await page.getByRole('button',{name:'探索模型',exact:true}).click();await page.mouse.wheel(0,200);await page.waitForTimeout(900);check('scroll relinquishes manual camera',await page.getByRole('button',{name:'探索模型',exact:true}).count()===1);
 // Forward/reverse/fast seeks produce the same absolute structural state.
 await seek('structure',.55);const original=await page.evaluate(()=>({s:window.__flight.state,p:window.__flight.parts}));
 await seek('finale',1);await seek('scan',.2);await seek('structure',.55);const reversed=await page.evaluate(()=>({s:window.__flight.state,p:window.__flight.parts}));
 check('reverse seeking restores complete scene and part positions',JSON.stringify(original)===JSON.stringify(reversed));
 check('shared canvas survived all chapter jumps',await canvas.getAttribute('data-qa-identity')===identity);
 await seek('propulsion',.35);
 for(const phase of ['垂直起飞','过渡飞行','前飞巡航','降落']){await page.getByRole('button',{name:phase,exact:true}).click();await page.waitForTimeout(150);report.checks.push(`flight phase ${phase}`)}
 await page.getByRole('slider',{name:'飞行阶段',exact:true}).fill('50');await page.getByRole('button',{name:'跟随叙事'}).click();
 // Calculations respond to real inputs, boundary conditions and reset.
 await seek('limits',.1);const energy=await page.getByTestId('mission-energy').innerText();await page.getByRole('slider',{name:'总质量',exact:true}).fill('2800');check('mass increases mission energy',parseFloat(await page.getByTestId('mission-energy').innerText())>parseFloat(energy));
 await page.getByRole('slider',{name:'电池标称容量',exact:true}).fill('40');check('low battery flags infeasible mission',await page.getByTestId('engineering-lab').innerText().then(t=>t.includes('超出能量预算')));
 await page.getByRole('button',{name:'重置参数',exact:true}).click();check('engineering reset',await page.getByRole('slider',{name:'总质量',exact:true}).inputValue()==='2200');
 await page.locator('summary').filter({hasText:'更多工程参数'}).click();for(const label of ['总旋翼盘面积','等效效率','巡航升阻比','起降悬停合计','储备电量比例']){await page.getByRole('slider',{name:label,exact:true}).focus();await page.keyboard.press('ArrowRight')};await page.getByRole('button',{name:'重置参数',exact:true}).click();await page.locator('summary').filter({hasText:'更多工程参数'}).click();
 await page.getByRole('button',{name:'模拟电源 A 隔离'}).click();check('safety isolation changes network and result',await page.locator('.network button.failed').count()===1);await shot('safety-isolated');await page.getByRole('button',{name:'恢复电源 A'}).click();for(const label of ['感知与状态估计','飞行控制计算','电源通道 A','电源通道 B','电驱与执行机构','受控飞行功能'])await page.locator('.network').getByRole('button',{name:label,exact:true}).click();
 await seek('business',.12);await page.getByRole('slider',{name:'客座率',exact:true}).fill('0');check('zero occupancy has undefined per-passenger cost',await page.getByTestId('break-even').innerText().then(t=>t.includes('—')));await page.getByRole('button',{name:'重置情景',exact:true}).click();
 await page.getByRole('slider',{name:'每客票价',exact:true}).fill('200');check('low fare produces loss',await page.getByTestId('business-lab').innerText().then(t=>t.includes('未覆盖成本')));await page.getByRole('button',{name:'重置情景',exact:true}).click();
 await page.locator('summary').filter({hasText:'运营与成本假设'}).click();for(const label of ['地面周转时间','平均充电功率','电价','单航次维护及杂费','年度运营天数']){await page.getByRole('slider',{name:label,exact:true}).focus();await page.keyboard.press('ArrowRight')};await page.getByRole('button',{name:'重置情景',exact:true}).click();await page.locator('summary').filter({hasText:'运营与成本假设'}).click();
 // Dialog focus, keyboard close, chapter menu, reduced motion.
 await page.getByRole('button',{name:'商业可行性、竞争与最终判断'}).click();check('research dialog and sources',await page.locator('dialog[open] .source-list a').count()===9);await shot('research-dialog');await page.keyboard.press('Escape');check('dialog closes and returns focus',await page.locator('dialog[open]').count()===0&&await page.getByRole('button',{name:'商业可行性、竞争与最终判断'}).evaluate(e=>e===document.activeElement));
 await page.getByRole('button',{name:'打开章节菜单'}).click();await page.getByRole('navigation',{name:'章节目录'}).getByRole('button',{name:'倾转飞行 A DIFFERENT KIND OF LIFT'}).click();await page.waitForTimeout(1000);check('chapter menu navigation',await page.evaluate(()=>document.body.dataset.scene)==='4');
 await page.getByRole('button',{name:'阅读模式',exact:true}).click();await page.waitForTimeout(500);check('reduced motion control',await page.evaluate(()=>document.body.dataset.reduced)==='true');await page.getByRole('button',{name:'恢复动效'}).click();await page.waitForTimeout(500);
 // Visual matrix: all chapters at meaningful states, each transition at 0/.5/1.
 const ids=['hangar','aircraft','scan','structure','propulsion','limits','city','business','finale'];
 for(const [w,h] of [[1440,900],[1920,1080],[390,844],[768,1024]]){
  await page.setViewportSize({width:w,height:h});await page.waitForTimeout(400);
  for(const id of ids){await seek(id,id==='hangar'?0:id==='finale'?1:.4);await shot(`${w}-${id}`);check(`no horizontal overflow ${w} ${id}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1))}
 }
 await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(300);
 for(const id of ['hangar','aircraft','scan','structure','propulsion','city','finale'])for(const p of [0,.5,.999]){await seek(id,p);await shot(`transition-${id}-${p}`)}
 await seek('aircraft',.3);await page.evaluate(()=>window.__flight.frames=[]);await page.mouse.wheel(0,600);await page.waitForTimeout(4000);
 report.performance=await page.evaluate(()=>{const f=window.__flight,sorted=[...f.frames].sort((a,b)=>a-b);return {renderer:f.renderer,ua:navigator.userAgent,viewport:[innerWidth,innerHeight],dpr:devicePixelRatio,drawCalls:f.calls,triangles:f.triangles,frames:sorted.length,medianMs:sorted[Math.floor(sorted.length*.5)],p95Ms:sorted[Math.floor(sorted.length*.95)],averageFPS:1000/(sorted.reduce((a,b)=>a+b,0)/sorted.length)}});
 await page.goto(`${base}#structure`);await page.waitForFunction(()=>window.__flight?.state.scene===3);check('direct hash refresh restores section',await page.evaluate(()=>window.__flight.state.scene)===3);
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const phone=await mobile.newPage();await phone.goto(base);await phone.waitForFunction(()=>window.__flight?.frames.length>10);await phone.getByRole('button',{name:'打开章节菜单'}).tap();await phone.getByRole('navigation',{name:'章节目录'}).getByRole('button',{name:'工程拆解 ENGINEERING, EXPOSED'}).tap();await phone.waitForTimeout(900);await phone.getByRole('button',{name:'探索模型',exact:true}).tap();check('touch opens inspection',await phone.getByRole('button',{name:'退出探索',exact:true}).count()===1);await phone.getByRole('button',{name:'复位模型',exact:true}).tap();await shot('phone-touch-inspector',phone);await mobile.close();
 const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const rp=await reduced.newPage();await rp.goto(base);await rp.waitForFunction(()=>document.body.dataset.reduced==='true');await shot('prefers-reduced-motion',rp);check('OS reduced motion respected',await rp.getByRole('button',{name:'恢复动效'}).count()===1);await reduced.close();
 await page.goto(`${base}?no3d=1#limits`);await page.getByRole('slider',{name:'总质量',exact:true}).waitFor();await page.getByRole('slider',{name:'总质量',exact:true}).fill('2500');check('no-WebGL fallback retains calculators',await page.locator('canvas').count()===0);await shot('no-webgl-fallback');
 await page.goto(base);await page.waitForFunction(()=>window.__flight?.frames.length>10);await page.locator('canvas').evaluate(c=>c.getContext('webgl2').getExtension('WEBGL_lose_context')?.loseContext());await page.waitForTimeout(500);check('WebGL context loss falls back safely',await page.locator('canvas').count()===0);await shot('context-loss');
 check('no uncaught browser errors',report.errors.length===0);check('no failed local resources',report.resourceErrors.length===0);
}catch(e){report.failure=e.stack;console.error(e);await shot('FAILURE').catch(()=>{});process.exitCode=1}
finally{report.finished=new Date().toISOString();await fs.writeFile(`${out}/results.json`,JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify({checks:report.checks.length,errors:report.errors,resourceErrors:report.resourceErrors,failure:report.failure,performance:report.performance}))}
