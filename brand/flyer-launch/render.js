const puppeteer = require('puppeteer-core');
const file = process.argv[2], out = process.argv[3], dpr = parseFloat(process.argv[4]||'1.4');
(async () => {
  const b = await puppeteer.launch({executablePath:'/home/claude/flyer/chrome/chromium',
    args:['--no-sandbox','--disable-setuid-sandbox','--font-render-hinting=none','--disable-gpu','--single-process'], headless:'new'});
  const p = await b.newPage();
  await p.setViewport({width:1200,height:2000,deviceScaleFactor:dpr});
  await p.goto('file:///home/claude/flyer/'+file,{waitUntil:'networkidle0'});
  await p.evaluate(()=>document.fonts.ready);
  await new Promise(r=>setTimeout(r,2500));
  const s = await p.$('.sheet');
  await s.screenshot({path:out});
  await b.close(); console.log('rendered '+out);
})();
