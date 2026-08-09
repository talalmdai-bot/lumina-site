const puppeteer = require('/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/puppeteer-core');
(async () => {
  const b = await puppeteer.launch({executablePath:'/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome', args:['--no-sandbox','--disable-setuid-sandbox','--font-render-hinting=none'], headless:'new'});
  const p = await b.newPage();
  await p.setViewport({width:1200,height:1300,deviceScaleFactor:4});
  await p.goto('file:///home/claude/flyer/square.html',{waitUntil:'networkidle0'});
  await new Promise(r=>setTimeout(r,3500));
  const s = await p.$('.sheet');
  await s.screenshot({path:'square-8k.png'});
  await b.close(); console.log('ok');
})();
