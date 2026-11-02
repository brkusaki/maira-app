const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await p.goto('http://localhost:8765/');
  await p.evaluate(() => localStorage.setItem('maira:v1', JSON.stringify({ cfg: { iniciado: true, dpp: '2026-11-15', tema: 'noite', nasc: '2026-08-20T02:56', pesoNasc: '3250' }, vac: { bcg: { t: 1787000000000 }, hepb: { t: 1787000000000 }, penta1: { t: 1792000000000, lote: 'AB12', local: 'UBS Centro' } } })));
  await p.reload(); await p.waitForTimeout(600);
  await p.click('#nav [data-tab=maya]'); await p.click('[data-sub=vacinas]'); await p.waitForTimeout(400); await p.evaluate(() => window.scrollTo(0, 330)); await p.waitForTimeout(200);
  await p.screenshot({ path: 'shots/e1.png' });
  await p.click('[data-sub=semana]'); await p.waitForTimeout(400); await p.screenshot({ path: 'shots/e2.png' });
  await b.close();
})();
