const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await p.goto('http://localhost:8765/');
  await p.evaluate(() => { localStorage.setItem('maira:v1', JSON.stringify({ cfg: { iniciado: true, dpp: '2026-11-20', telPai: '15997771234', tema: 'claro' } })); });
  await p.reload(); await p.waitForTimeout(800); await p.screenshot({ path: 'shots/capa-claro.png' });
  await p.click('#btnTema'); await p.waitForTimeout(500); await p.screenshot({ path: 'shots/capa-escuro.png' });
  await b.close();
})();
