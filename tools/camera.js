const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const erros = []; p.on('pageerror', e => erros.push(e.message));
  await p.goto('http://localhost:8765/');
  await p.evaluate(() => localStorage.setItem('maira:v1', JSON.stringify({ cfg: { iniciado: true, dpp: '2026-11-15', tema: 'noite' } })));
  await p.reload(); await p.waitForTimeout(500);
  await p.click('#nav [data-tab=maya]'); await p.click('[data-sub=marcos]');
  const caps = await p.$$eval('[data-midia=novo]', els => els.map(e => e.accept + '|' + (e.getAttribute('capture') || '-') + '|' + e.multiple));
  console.log('INPUTS', caps.join(' ; '));
  await p.fill('#marcoTxt', 'Barrigão 35 semanas');
  await p.setInputFiles('[data-midia=novo] >> nth=0', '/tmp/m1.jpg'); await p.waitForTimeout(1000);
  await p.setInputFiles('[data-midia=novo] >> nth=0', '/tmp/m1.jpg'); await p.waitForTimeout(1000);
  console.log('RASCUNHO', await p.$$eval('#prevMidias div', d => d.length));
  await p.evaluate(() => document.querySelector('.midia-btns').scrollIntoView({ block: 'center' })); await p.screenshot({ path: 'shots/cam1.png' });
  await p.click('[data-a=marcoAdd]'); await p.waitForTimeout(300); await p.click('.pola'); await p.waitForTimeout(800); await p.screenshot({ path: 'shots/cam2.png' });
  console.log('ERROS', JSON.stringify(erros)); await b.close();
})();
