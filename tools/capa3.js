const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await p.goto('http://localhost:8765/');
  const set = async (o) => { await p.evaluate(o => localStorage.setItem('maira:v1', JSON.stringify(o)), o); await p.reload(); await p.waitForTimeout(800); };
  await set({ cfg: { iniciado: true, dpp: '2026-11-15', tema: 'claro' } }); await p.screenshot({ path: 'shots/k1.png', clip: { x: 0, y: 0, width: 390, height: 330 } });
  await set({ cfg: { iniciado: true, dpp: '2026-11-15', tema: 'noite' } }); await p.screenshot({ path: 'shots/k2.png', clip: { x: 0, y: 0, width: 390, height: 330 } });
  await set({ cfg: { iniciado: true, dpp: '2026-11-15', tema: 'claro', nasc: '2026-11-02T02:56', pesoNasc: '3250', compNasc: '49' } }); await p.screenshot({ path: 'shots/k3.png', clip: { x: 0, y: 0, width: 390, height: 330 } });
  await set({ cfg: { iniciado: true, dpp: '2026-11-15', tema: 'noite', nasc: '2026-10-20T02:56', pesoNasc: '3250', compNasc: '49' } }); await p.screenshot({ path: 'shots/k4.png', clip: { x: 0, y: 0, width: 390, height: 330 } });
  await b.close();
})();
