const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const erros = []; p.on('pageerror', e => erros.push(e.message)); p.on('console', m => m.type()==='error' && !m.text().includes('404') && erros.push(m.text()));
  const sh = n => p.screenshot({ path: `/home/claude/maira/shots/v6-${n}.png` });
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(800); await sh('01-boasvindas');
  await p.fill('#bvDpp', '2026-11-15'); await p.click('[data-a=inicioOk]'); await p.waitForTimeout(400); await sh('02-inicio');
  await p.click('[data-a=ir][data-sub=marcos]'); await p.click('[data-a=marcoSug] >> nth=0');
  await p.fill('#marcoNota', 'A barriga mais linda do mundo');
  await p.setInputFiles('[data-midia=novo]', ['/tmp/m1.jpg', '/tmp/m2.jpg']); await p.waitForTimeout(1500); await sh('03-form');
  await p.click('[data-a=marcoAdd]'); await p.waitForTimeout(400);
  await p.fill('#marcoTxt', 'Quartinho pronto'); await p.setInputFiles('[data-midia=novo]', ['/tmp/m2.jpg']); await p.waitForTimeout(1000); await p.click('[data-a=marcoAdd]'); await p.waitForTimeout(400);
  await p.evaluate(() => window.scrollTo(0, 99999)); await sh('04-grade');
  await p.click('.pola >> nth=1'); await p.waitForTimeout(800); await sh('05-detalhe');
  await p.click('#modalBox [data-a=filme]'); await p.waitForTimeout(2500); await sh('06-filme');
  await p.mouse.click(10, 400); await p.waitForTimeout(200);
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(500);
  await p.click('[data-a=ir][data-sub=marcos]'); await p.click('[data-a=filme]'); await p.waitForTimeout(1500); await sh('07-filme-abertura');
  await p.mouse.click(380, 400); await p.waitForTimeout(2500); await sh('08-filme-foto');
  await p.click('#filme .fechar');
  await p.click('#nav [data-tab=inicio]'); await p.click('#btnTema'); await p.waitForTimeout(400); await sh('09-inicio-escuro');
  // sprite de teste
  await p.route('**/img/sprite.json', r => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ arquivo: 'sprite-teste.png', quadros: 4, fps: 5, vaiVolta: true }) }));
  await p.route('**/img/sprite-teste.png', r => r.fulfill({ path: '/tmp/sprite-teste.png' }));
  await p.reload(); await p.waitForTimeout(1200); await sh('10-sprite');
  const pos = []; for (let i = 0; i < 4; i++) { pos.push(await p.$eval('.capa .sprite', e => e.style.backgroundPosition)); await p.waitForTimeout(220); }
  console.log('SPRITE POS', pos.join(' | '));
  console.log('ERROS:', JSON.stringify(erros)); await b.close();
})();
