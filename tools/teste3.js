const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  const erros = []; p.on('pageerror', e => erros.push(e.message)); p.on('console', m => m.type() === 'error' && !m.text().includes('404') && erros.push(m.text()));
  const sh = n => p.screenshot({ path: `/home/claude/maira/shots/v10-${n}.png` });
  // estado: gestação, versão antiga com recados e vacina antiga (testa migração)
  await p.goto('http://localhost:8765/');
  await p.evaluate(() => localStorage.setItem('maira:v1', JSON.stringify({ cfg: { iniciado: true, dpp: '2026-11-15', tema: 'claro', recados: ['Você é a mulher mais forte que eu conheço. Te amo! 💛', 'Recado antigo que ela editou'] }, chk: { 'vac:bcg': 1793000000000 } })));
  await p.reload(); await p.waitForTimeout(900); await sh('01-inicio');
  const st = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('maira:v1')); return { rb: s.cfg.recadosBruno, rec: s.cfg.recados, vac: s.vac, chk: s.chk }; });
  console.log('MIGRACAO', JSON.stringify(st));
  await p.evaluate(() => window.scrollTo(0, 99999)); await sh('02-inicio-baixo');
  // swipe na tela: início -> maya (semana)
  const swipe = async (dx) => { await p.evaluate((dx) => { const v = document.querySelector('#view'); const mk = (type, x) => { const t = new Touch({ identifier: 1, target: v, clientX: x, clientY: 400 }); v.dispatchEvent(new TouchEvent(type, { touches: type === 'touchend' ? [] : [t], changedTouches: [t], bubbles: true })); }; mk('touchstart', 200); mk('touchend', 200 + dx); }, dx); await p.waitForTimeout(450); };
  await p.evaluate(() => window.scrollTo(0, 0));
  await swipe(-150); console.log('APOS SWIPE', await p.evaluate(() => document.querySelector('#nav .ativo').textContent.trim() + ' / ' + (document.querySelector('.abas .on') || {}).textContent));
  await sh('03-semana');
  await swipe(-150); console.log('APOS SWIPE2', await p.evaluate(() => (document.querySelector('.abas .on') || {}).textContent));
  await swipe(150); await swipe(150); console.log('VOLTOU', await p.evaluate(() => document.querySelector('#nav .ativo').textContent.trim()));
  // caderneta
  await p.click('#nav [data-tab=maya]'); await p.click('[data-sub=vacinas]'); await p.waitForTimeout(300); await sh('04-caderneta');
  // recados secretos
  await p.click('#nav [data-tab=mais]'); await p.click('[data-sub=ajustes]');
  for (let i = 0; i < 5; i++) await p.click('[data-a=cantinho]');
  await p.waitForTimeout(300); await sh('05-cantinho');
  await p.click('[data-a=fecharCantinho]');
  // consultas
  await p.click('[data-sub=consultas]'); await p.click('[data-a=consNova]'); await p.fill('#cL', 'Hospital Angatuba'); await p.click('[data-a=consSalvar]');
  await p.fill('[data-novaperg=mae]', 'Posso tomar dipirona?'); await p.keyboard.press('Enter'); await p.waitForTimeout(300); await sh('06-consultas');
  // nascimento
  await p.click('#nav [data-tab=inicio]'); await p.click('[data-a=nasceu]'); await p.fill('#nP', '3250'); await p.fill('#nC', '49'); await p.click('[data-a=nasceuOk]'); await p.waitForTimeout(400);
  await p.click('#nav [data-tab=maya]'); await p.click('[data-a=mIni][data-l=E]'); await p.waitForTimeout(1200); await p.click('[data-a=mFim]');
  await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('maira:v1')); const n = Date.now(); for (let i = 1; i < 8; i++) s.mam.push({ id: 'x' + i, tipo: 'peito', ini: n - i * 3 * 3600e3, fim: n - i * 3 * 3600e3 + 25 * 60e3, segE: 600e3, segD: 600e3, ladoFim: 'D' }); for (let i = 0; i < 4; i++) s.sono.push({ id: 's' + i, ini: n - (i * 5 + 2) * 3600e3, fim: n - (i * 5 + 0.5) * 3600e3 }); for (let i = 0; i < 6; i++) s.fr.push({ id: 'f' + i, t: n - i * 4 * 3600e3, xixi: true, coco: i % 2 }); localStorage.setItem('maira:v1', JSON.stringify(s)); });
  await p.reload(); await p.waitForTimeout(700); await sh('07-inicio-bebe');
  await p.click('#nav [data-tab=maya]'); await p.click('[data-sub=mamadas]'); await p.waitForTimeout(300); await sh('08-mamadas-linha');
  await p.click('[data-sub=saude]'); await p.fill('#tempV', '37,9'); await p.click('[data-a=tempAdd]'); await p.waitForTimeout(300); await sh('09-saude-febre');
  await p.click('[data-sub=vacinas]'); await p.click('[data-a=vacTodas]'); await p.click('.dose >> nth=2'); await p.waitForTimeout(300); await sh('10-vac-modal');
  await p.click('[data-a=vacSalvar]'); await p.waitForTimeout(400); await sh('11-caderneta-carimbos');
  // filminho: foto paisagem
  await p.click('[data-sub=marcos]'); await p.fill('#marcoTxt', 'Primeiro sorriso'); await p.setInputFiles('[data-midia=novo]', ['/tmp/paisagem.jpg', '/tmp/m2.jpg']); await p.waitForTimeout(1500); await p.click('[data-a=marcoAdd]'); await p.waitForTimeout(300);
  await p.click('[data-a=filme]'); await p.waitForTimeout(4200);
  await sh('12-filme-paisagem');
  // segurar = pausa
  const w1 = await p.evaluate(() => [...document.querySelectorAll('#filme .barras b')].map(b => b.style.width).join(','));
  await p.mouse.move(200, 400); await p.mouse.down(); await p.waitForTimeout(1200);
  const w2 = await p.evaluate(() => [...document.querySelectorAll('#filme .barras b')].map(b => b.style.width).join(','));
  await sh('13-filme-segurando');
  await p.waitForTimeout(800);
  const w3 = await p.evaluate(() => [...document.querySelectorAll('#filme .barras b')].map(b => b.style.width).join(','));
  await p.mouse.up(); await p.waitForTimeout(700);
  const w4 = await p.evaluate(() => [...document.querySelectorAll('#filme .barras b')].map(b => b.style.width).join(','));
  console.log('PAUSA', w2 === w3 ? 'ok-parado' : 'MOVEU', '| antes', w1, '| durante', w2, w3, '| depois', w4);
  // toque esquerda volta
  await p.mouse.click(30, 400); await p.waitForTimeout(400); console.log('CENA apos toque esq', await p.evaluate(() => [...document.querySelectorAll('#filme .barras b')].findIndex(b => b.style.width !== '100%')));
  await p.click('#filme .fechar');
  await p.click('#nav [data-tab=mais]'); await p.click('[data-sub=resumo]'); await sh('14-resumo');
  console.log('ERROS:', JSON.stringify(erros)); await b.close();
})();
