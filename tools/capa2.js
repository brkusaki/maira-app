const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const erros = []; p.on('pageerror', e => erros.push(e.message));
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(900); await p.screenshot({ path: 'shots/c2-1.png' });
  await p.fill('#bvDpp', '2026-11-15'); await p.click('[data-a=inicioOk]'); await p.evaluate(() => { document.documentElement.classList.remove('noite'); });
  await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('maira:v1')); s.cfg.tema = 'claro'; localStorage.setItem('maira:v1', JSON.stringify(s)); }); await p.reload(); await p.waitForTimeout(900);
  await p.screenshot({ path: 'shots/c2-2.png' });
  await p.click('#btnTema'); await p.waitForTimeout(600); await p.screenshot({ path: 'shots/c2-3.png' });
  await p.click('#nav [data-tab=mais]'); await p.click('[data-sub=ajustes]'); await p.evaluate(() => document.querySelector('.foto-prev').scrollIntoView({block:'center'})); await p.waitForTimeout(300); await p.screenshot({ path: 'shots/c2-4.png' });
  console.log('ERROS', JSON.stringify(erros)); await b.close();
})();
