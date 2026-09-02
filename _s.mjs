import puppeteer from 'puppeteer';
const [,,url,vw,vh,prefix] = process.argv;
const W=+vw, H=+vh;
const b = await puppeteer.launch({headless:'new',args:['--no-sandbox']});
const p = await b.newPage();
await p.setViewport({width:W,height:H,deviceScaleFactor:2});
await p.goto(url,{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,2200));
const total = await p.evaluate(()=>document.body.scrollHeight);
const steps = Math.min(11, Math.ceil(total/H));
for(let i=0;i<steps;i++){
  const y = Math.min(Math.round(i*(total-H)/(steps-1)), total-H);
  await p.evaluate(v=>scrollTo(0,v), y);
  await new Promise(r=>setTimeout(r,900));
  await p.screenshot({path:`${prefix}-${String(i).padStart(2,'0')}.png`});
}
await b.close();
console.log('done', steps, 'shots, page', total);
