/* App da Maíra & Maya — feito pelo Bruno 💛
   Tudo fica salvo só neste celular (localStorage). */
(() => {
'use strict';
const C = window.CONTEUDO;
const LS = 'maira:v1';
const MIN = 60e3, H = 60 * MIN, DIA = 24 * H;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ic = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${(window.ICONES || {})[n] || ''}</svg>`;
let ILUS = '';

/* ---------------- Dados ---------------- */
let LEU_OK = true;
function carregar() { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { LEU_OK = false; return {}; } }
const S = carregar();
S.cfg = Object.assign({
  mae: 'Maíra', bebe: 'Maya', pai: 'Bruno', dpp: '', nasc: '', pesoNasc: '', compNasc: '', tipoParto: '',
  telPai: '', intervaloMamada: 180, lembreteMamada: true, metaAgua: 3000, lembreteAgua: false,
  recadoDiario: true, recadosBruno: [], tema: 'auto', iniciado: false,
  regra: { freq: 5, dur: 60, janela: 60 },
  contatos: [
    { nome: 'SAMU', tel: '192' }, { nome: 'Maternidade', tel: '' }, { nome: 'Médica obstetra', tel: '' }, { nome: 'Pediatra', tel: '' },
  ],
}, S.cfg || {});
for (const k of ['contr', 'chutes', 'mam', 'fr', 'sono', 'cres', 'rem', 'doses', 'agua', 'humor', 'marcos', 'lemb', 'temp', 'consultas', 'perguntas']) S[k] = S[k] || [];
if (S.cfg.recados) { const extra = S.cfg.recados.filter(r => !C.recados.includes(r)); if (extra.length) S.cfg.recadosBruno = (S.cfg.recadosBruno || []).concat(extra); delete S.cfg.recados; }
const TEL_BRUNO = '15981125349';
S.cfg.telPai = TEL_BRUNO;
S.chk = S.chk || {};
S.vac = S.vac || {};
for (const g of C.vacinas) { const k = 'vac:' + g[0]; if (S.chk[k]) { for (const d of g[3]) if (!S.vac[d[0]]) S.vac[d[0]] = { t: S.chk[k] === true ? Date.now() : S.chk[k] }; delete S.chk[k]; } } S.plano = S.plano || {}; S.ativo = S.ativo || {}; S.extraMala = S.extraMala || {};
if (LEU_OK) try { localStorage.setItem(LS, JSON.stringify(S)); } catch {}
const salvar = () => { localStorage.setItem(LS, JSON.stringify(S)); agendarDepois(); };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const cfg = S.cfg;

/* ---------------- Utilidades ---------------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const hora = t => { const d = new Date(t); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
const data = t => { const d = new Date(t); return pad(d.getDate()) + '/' + pad(d.getMonth() + 1); };
const dataHora = t => (mesmoDia(t, Date.now()) ? 'Hoje' : mesmoDia(t, Date.now() - DIA) ? 'Ontem' : data(t)) + ' ' + hora(t);
const mesmoDia = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();
const inicioDia = (t = Date.now()) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return +d; };
const crono = ms => { ms = Math.max(0, ms); const s = Math.floor(ms / 1000), h = Math.floor(s / 3600); return (h ? h + ':' + pad(Math.floor(s / 60) % 60) : Math.floor(s / 60)) + ':' + pad(s % 60); };
const dur = ms => { const m = Math.round(ms / MIN); if (m < 60) return m + ' min'; return Math.floor(m / 60) + 'h' + (m % 60 ? ' ' + pad(m % 60) : ''); };
const rel = t => 'há ' + (Date.now() - t < MIN ? 'menos de 1 min' : dur(Date.now() - t));
const paraInput = t => { const d = new Date(t); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + hora(t); };
const deInput = v => v ? +new Date(v) : Date.now();
const dataLocal = s => { if (!s) return null; const [y, m, d] = s.split('-').map(Number); return +new Date(y, m - 1, d); };
const soDigitos = s => String(s || '').replace(/\D/g, '');
const telWa = s => { let d = soDigitos(s); if (d.length === 10 || d.length === 11) d = '55' + d; return d; };
const nascida = () => !!cfg.nasc;
const ultimos = (arr, campo = 'ini') => arr.slice().sort((a, b) => b[campo] - a[campo]);
const hojeDe = (arr, campo = 'ini') => arr.filter(x => x[campo] >= inicioDia());
const ult24 = (arr, campo = 'ini') => arr.filter(x => x[campo] >= Date.now() - DIA);
const ladoNome = l => ({ E: 'esquerdo', D: 'direito' }[l] || '');

function toast(msg, ms = 2600) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, ms); }
function modal(html, centro) { $('#modal').classList.toggle('centro', !!centro); $('#modalBox').innerHTML = html; $('#modal').hidden = false; }
function fecharModal() { $('#modal').hidden = true; $('#modalBox').innerHTML = ''; }
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal' && cfg.iniciado) fecharModal(); });

function vibrar(ms = 30) { try { navigator.vibrate && navigator.vibrate(ms); } catch {} }

/* Idades / gestação */
function gestacao() {
  const dpp = dataLocal(cfg.dpp); if (!dpp) return null;
  const falta = Math.round((dpp - inicioDia()) / DIA);
  const ig = 280 - falta;
  return { falta, sem: Math.floor(ig / 7), dias: ig % 7, pct: Math.min(100, Math.max(0, ig / 280 * 100)) };
}
function idadeBebe() {
  const n = +new Date(cfg.nasc); const d = Math.floor((inicioDia() - inicioDia(n)) / DIA);
  let txt;
  if (d === 0) txt = 'nasceu hoje'; else if (d < 14) txt = d + (d === 1 ? ' dia' : ' dias');
  else if (d < 60) txt = Math.floor(d / 7) + ' semanas' + (d % 7 ? ' e ' + (d % 7) + (d % 7 === 1 ? ' dia' : ' dias') : '');
  else { const m = Math.floor(d / 30.44); txt = m + (m === 1 ? ' mês' : ' meses'); }
  return { d, txt, diaVida: d + 1 };
}
function saudacao() { const h = new Date().getHours(); return h < 5 ? 'Boa madrugada' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'; }
function recadosTodos() { return [...new Set(C.recados.concat(cfg.recadosBruno || []).filter(Boolean))]; }
let RECADO_I = -1;
function sortearRecado() {
  const r = recadosTodos(); if (!r.length) return;
  let ult = -1; try { ult = +localStorage.getItem('maira:ultRecado'); } catch {}
  let i; do { i = Math.floor(Math.random() * r.length); } while (r.length > 1 && i === ult);
  RECADO_I = i; try { localStorage.setItem('maira:ultRecado', i); } catch {}
}
function recadoDoDia() { const r = recadosTodos(); if (!r.length) return ''; if (RECADO_I < 0 || RECADO_I >= r.length) sortearRecado(); return r[RECADO_I]; }

/* ---------------- Notificações ---------------- */
const CAP = window.Capacitor;
const NATIVO = !!(CAP && CAP.isNativePlatform && CAP.isNativePlatform());
const plugin = n => NATIVO ? (CAP.Plugins[n] || CAP.registerPlugin(n)) : null;
const LN = plugin('LocalNotifications');
const N = {
  timeouts: [],
  async iniciar() {
    if (!LN) return;
    try { await LN.createChannel({ id: 'maira', name: 'Lembretes', description: 'Mamadas, remédios e lembretes', importance: 5, visibility: 1, vibration: true }); } catch {}
    try { await LN.createChannel({ id: 'urgente', name: 'Alertas de parto', importance: 5, visibility: 1, vibration: true }); } catch {}
    LN.addListener('localNotificationActionPerformed', e => { const x = e.notification && e.notification.extra; if (x && x.tab) ir(x.tab, x.sub); });
  },
  async status() {
    if (LN) { try { return (await LN.checkPermissions()).display; } catch { return 'erro'; } }
    return 'Notification' in window ? Notification.permission : 'indisponivel';
  },
  async pedir() {
    if (LN) { let p = await LN.checkPermissions(); if (p.display !== 'granted') p = await LN.requestPermissions(); return p.display === 'granted'; }
    if ('Notification' in window) return (await Notification.requestPermission()) === 'granted';
    return false;
  },
  async agora(title, body, tab, sub) {
    if (LN) return LN.schedule({ notifications: [{ id: 9, title, body, channelId: 'urgente', smallIcon: 'ic_stat_icon', schedule: { at: new Date(Date.now() + 800), allowWhileIdle: true }, extra: { tab, sub } }] });
    this.web(title, body);
  },
  web(title, body) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    navigator.serviceWorker && navigator.serviceWorker.ready.then(r => r.showNotification(title, { body, icon: 'icons/icon-192.png' })).catch(() => new Notification(title, { body }));
  },
  async substituir(lista) {
    lista = lista.filter(n => n.at > Date.now() + 5000).slice(0, 120);
    if (LN) {
      try {
        const p = await LN.getPending();
        if (p.notifications.length) await LN.cancel({ notifications: p.notifications.map(n => ({ id: n.id })) });
        if (lista.length) await LN.schedule({ notifications: lista.map(n => ({
          id: n.id, title: n.title, body: n.body, channelId: 'maira', smallIcon: 'ic_stat_icon',
          schedule: { at: new Date(n.at), allowWhileIdle: true }, extra: { tab: n.tab, sub: n.sub },
        })) });
      } catch (e) { console.warn('notif', e); }
      return;
    }
    this.timeouts.forEach(clearTimeout); this.timeouts = [];
    for (const n of lista) { const ms = n.at - Date.now(); if (ms < DIA) this.timeouts.push(setTimeout(() => this.web(n.title, n.body), ms)); }
  },
};

function emHorario(diaOffset, hhmm) { const [h, m] = hhmm.split(':').map(Number); const d = new Date(inicioDia() + diaOffset * DIA); d.setHours(h, m || 0, 0, 0); return +d; }

function listaNotificacoes() {
  const L = []; const agora = Date.now();
  // Mamada
  if (nascida() && cfg.lembreteMamada) {
    const u = ultimos(S.mam)[0];
    if (u && !S.ativo.mamada) {
      const prox = u.tipo === 'peito' ? (u.ladoFim === 'E' ? 'D' : 'E') : '';
      L.push({ id: 1, at: u.ini + cfg.intervaloMamada * MIN, tab: 'maya', sub: 'mamadas', title: `Hora da mamada da ${cfg.bebe} 🍼`,
        body: `A última começou às ${hora(u.ini)}.` + (prox ? ` Comece pelo lado ${ladoNome(prox)}.` : '') });
    }
  }
  // Remédios
  S.rem.filter(r => r.ativo !== false).forEach((r, i) => {
    const quem = r.quem === 'bebe' ? cfg.bebe : cfg.mae;
    const title = `💊 ${r.nome}` + (r.dose ? ` — ${r.dose}` : ''); const body = `Remédio de ${quem}. Toque para marcar que tomou.`;
    if (r.modo === 'horarios') {
      (r.horarios || []).forEach((hh, k) => { for (let d = 0; d < 3; d++) L.push({ id: 200 + i * 30 + k * 3 + d, at: emHorario(d, hh), tab: 'mae', sub: 'remedios', title, body }); });
    } else {
      const u = ultimos(S.doses.filter(d => d.remId === r.id), 't')[0];
      if (u) L.push({ id: 100 + i, at: u.t + (+r.h || 8) * H, tab: 'mae', sub: 'remedios', title, body });
    }
  });
  // Água
  if (cfg.lembreteAgua) [9, 11, 13, 15, 17, 19, 21].forEach((h, k) => { for (let d = 0; d < 2; d++) L.push({ id: 400 + k * 2 + d, at: emHorario(d, h + ':00'), tab: 'mae', sub: 'hoje', title: 'Hora de beber água 💧', body: 'Um copo agora ajuda no leite e na recuperação.' }); });
  // Vacinas, testes e documentos
  if (nascida()) {
    const n = inicioDia(+new Date(cfg.nasc));
    C.vacinas.forEach((g, k) => {
      const [id, dias, quando] = g;
      if (!dias || grupoFeito(g)) return;
      const dia = n + dias * DIA; if (dia - agora > 120 * DIA) return;
      const quais = pendentesGrupo(g).join(', ');
      L.push({ id: 500 + k * 2, at: dia - DIA + 19 * H, tab: 'maya', sub: 'vacinas', title: `Amanhã: vacinas de ${quando} 💉`, body: quais + '. Leve a caderneta!' });
      L.push({ id: 501 + k * 2, at: dia + 9 * H, tab: 'maya', sub: 'vacinas', title: `Hoje: vacinas de ${quando} 💉`, body: quais });
    });
    if (!S.chk['teste:pezinho']) L.push({ id: 600, at: n + 3 * DIA + 9 * H, tab: 'maya', sub: 'testes', title: 'Teste do pezinho 🦶', body: `Entre hoje e o 5º dia de vida da ${cfg.bebe}.` });
    if (!S.chk['doc:plano']) L.push({ id: 601, at: n + 20 * DIA + 10 * H, tab: 'mais', sub: 'docs', title: 'Plano de saúde 📄', body: `Incluir a ${cfg.bebe} no plano até 30 dias do nascimento.` });
    if (!S.chk['doc:revisao']) L.push({ id: 602, at: n + 30 * DIA + 10 * H, tab: 'mais', sub: 'docs', title: 'Sua consulta pós-parto 🌷', body: 'Já marcou a revisão com a médica?' });
  }
  // Recado diário do Bruno
  if (cfg.recadoDiario) { const r = recadosTodos(); if (r.length) for (let d = 0; d < 14; d++) { const at = emHorario(d, '10:00'); L.push({ id: 700 + d, at, tab: 'inicio', title: `Recado do ${cfg.pai} 💛`, body: r[Math.floor(inicioDia(at) / DIA) % r.length] }); } }
  // Consultas
  S.consultas.filter(c => c.quando > agora).sort((a, b) => a.quando - b.quando).slice(0, 10).forEach((c, k) => {
    const tit = `${c.titulo} · ${quemNome(c.quem)}`;
    L.push({ id: 900 + k * 2, at: inicioDia(c.quando) - DIA + 19 * H, tab: 'mais', sub: 'consultas', title: 'Amanhã: ' + tit + ' 🩺', body: `Às ${hora(c.quando)}${c.local ? ' · ' + c.local : ''}. Leve suas perguntas anotadas!` });
    L.push({ id: 901 + k * 2, at: c.quando - 2 * H, tab: 'mais', sub: 'consultas', title: 'Daqui a 2 horas: ' + tit, body: `Às ${hora(c.quando)}${c.local ? ' · ' + c.local : ''}` });
  });
  // Lembretes livres
  S.lemb.filter(l => l.quando > agora).sort((a, b) => a.quando - b.quando).slice(0, 40).forEach((l, k) => L.push({ id: 800 + k, at: l.quando, tab: 'mais', sub: 'lembretes', title: '⏰ ' + l.titulo, body: l.obs || 'Lembrete' }));
  return L;
}
let filaNotif = Promise.resolve();
function agendarDepois() { clearTimeout(agendarDepois.t); agendarDepois.t = setTimeout(() => { filaNotif = filaNotif.then(() => N.substituir(listaNotificacoes())); }, 600); }

/* ---------------- Atualização automática ---------------- */
const SITE = 'https://brkusaki.github.io/maira-app/';
const VERSAO = window.VERSAO || 0;
const UPD = plugin('CapacitorUpdater');
if (UPD) UPD.notifyAppReady().catch(() => {});
let PRONTA = null, ultimaBusca = 0, ERRO_ATUALIZ = '';
async function lerJSON(url) {
  const HTTP = NATIVO && CAP.Plugins.CapacitorHttp;
  if (HTTP) {
    const r = await HTTP.get({ url, headers: { 'Cache-Control': 'no-cache' } });
    if (r.status !== 200) throw new Error('servidor respondeu ' + r.status);
    return typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
  }
  const r = await fetch(url, { cache: 'no-store' }); if (!r.ok) throw new Error('servidor respondeu ' + r.status); return r.json();
}
async function procurarAtualizacao(manual) {
  if (!UPD) { if (manual) toast('A atualização automática funciona no app instalado'); return; }
  if (!manual && Date.now() - ultimaBusca < 20 * MIN) return;
  ultimaBusca = Date.now();
  let etapa = 'verificar';
  try {
    const v = await lerJSON(SITE + 'versao.json?t=' + Date.now());
    if (!(v.versao > VERSAO)) { ERRO_ATUALIZ = ''; if (manual) toast('Já está na versão mais nova ✅'); return; }
    if (!PRONTA || PRONTA.versao !== v.versao) {
      if (manual) toast('Baixando atualização...', 8000);
      etapa = 'baixar';
      const b = await UPD.download({ url: SITE + 'www.zip?v=' + v.versao, version: String(v.versao), checksum: v.sha256 || '' });
      etapa = 'preparar';
      await UPD.next({ id: b.id });
      PRONTA = { id: b.id, versao: v.versao, novidades: v.novidades || '' };
    }
    ERRO_ATUALIZ = ''; render();
  } catch (e) {
    const msg = (e && (e.message || e.errorMessage)) || String(e);
    ERRO_ATUALIZ = `Erro ao ${etapa}: ${msg}`; console.warn('atualizacao', e);
    if (manual) toast(ERRO_ATUALIZ.slice(0, 140), 7000);
    if (V.tab === 'mais') render();
  }
}
function cardAtualizacao() {
  if (!PRONTA) return '';
  return `<div class="card linha entre" style="border-color:var(--verde)"><span class="linha"><i class="bolha b-verde">${ic('sparkles')}</i><span><b>Atualização pronta</b><br><small>${esc(PRONTA.novidades) || 'Melhorias no app'}</small></span></span><button class="btn verde mini" data-a="aplicarAtualiz">Atualizar</button></div>`;
}

/* ---------------- Navegação ---------------- */
const V = { tab: 'inicio', sub: { maya: cfg.nasc ? 'mamadas' : 'semana', mae: 'hoje', parto: 'contr', mais: 'docs' } };
let ANIM = '';
function ir(tab, sub) { V.tab = tab; if (sub) V.sub[tab] = sub; render(); window.scrollTo(0, 0); }
$('#nav').addEventListener('click', e => { const b = e.target.closest('button'); if (b) ir(b.dataset.tab); });
const SUBS = {
  maya: () => nascida()
    ? [['mamadas', 'Mamadas'], ['fraldas', 'Fraldas'], ['sono', 'Sono'], ['ninar', 'Ninar'], ['marcos', 'Momentos'], ['semana', 'Semana a semana'], ['saude', 'Saúde'], ['cres', 'Peso'], ['vacinas', 'Vacinas'], ['testes', 'Testes']]
    : [['semana', 'Semana a semana'], ['marcos', 'Momentos'], ['ninar', 'Ninar'], ['vacinas', 'Vacinas'], ['mamadas', 'Mamadas'], ['fraldas', 'Fraldas'], ['sono', 'Sono'], ['saude', 'Saúde'], ['cres', 'Peso'], ['testes', 'Testes']],
  mae: () => [['hoje', 'Hoje'], ['remedios', 'Remédios'], ['bruno', 'Chamar ' + esc(cfg.pai)], ['dicas', 'Cuidados'], ['alertas', 'Alertas']],
  parto: () => [['contr', 'Contrações'], ['chutes', 'Movimentos'], ['mala', 'Mala'], ['plano', 'Plano de parto'], ['quando', 'Quando ir'], ['contatos', 'Contatos']],
  mais: () => [['docs', 'Documentos'], ['consultas', 'Consultas'], ['lembretes', 'Lembretes'], ['resumo', 'Resumo'], ['ajustes', 'Ajustes']],
};
const TABS = ['inicio', 'maya', 'mae', 'parto', 'mais'];
const abas = (tab, itens = SUBS[tab]()) => `<div class="abas">${itens.map(([k, n]) => `<button data-a="sub" data-tab="${tab}" data-sub="${k}" class="${V.sub[tab] === k ? 'on' : ''}">${n}</button>`).join('')}</div>`;

const SB = plugin('StatusBar');
function tema() {
  const h = new Date().getHours();
  const noite = cfg.tema === 'noite' || (cfg.tema === 'auto' && (h >= 19 || h < 6));
  const R = document.documentElement;
  R.classList.toggle('noite', noite);
  const cor = noite ? '#1c1117' : '#fdecee';
  $('meta[name=theme-color]').content = cor;
  $('#btnTema').innerHTML = ic(noite ? 'sun' : 'moon');
  if (SB) { SB.setBackgroundColor({ color: cor }).catch(() => {}); SB.setStyle({ style: noite ? 'DARK' : 'LIGHT' }).catch(() => {}); }
  const f = fotoFundo();
  R.classList.toggle('foto', !!f); $('#fundo').hidden = !f;
  if (f) { $('#fundo').style.backgroundImage = `url(${f})`; R.style.setProperty('--veu', cfg.veu ?? 0.55); }
}
function fotoFundo() { try { return localStorage.getItem('maira:fundo') || (cfg.semFundo ? '' : 'img/fundo.jpg'); } catch { return ''; } }
const fotoPropria = () => { try { return !!localStorage.getItem('maira:fundo'); } catch { return false; } };

function render() {
  tema();
  $('#saudacao').textContent = `${saudacao()}, ${cfg.mae}`;
  const g = gestacao();
  $('#subtitulo').textContent = nascida() ? `${cfg.bebe} ${idadeBebe().d === 0 ? 'nasceu hoje 🎉' : 'tem ' + idadeBebe().txt}` : g ? `${g.sem} semanas e ${g.dias} ${g.dias === 1 ? 'dia' : 'dias'}` : `Esperando a ${cfg.bebe}`;
  $$('#nav button').forEach(b => b.classList.toggle('ativo', b.dataset.tab === V.tab));
  const fn = { inicio: vInicio, maya: vMaya, mae: vMae, parto: vParto, mais: vMais }[V.tab];
  const vw = $('#view'); vw.innerHTML = fn();
  if (ANIM) { vw.classList.remove('da-direita', 'da-esquerda'); void vw.offsetWidth; vw.classList.add(ANIM); ANIM = ''; }
  const on = $('.abas .on'); if (on) { const c = on.parentElement; c.scrollLeft = on.offsetLeft - c.clientWidth / 2 + on.clientWidth / 2; }
  tick();
}

/* ---------------- Telas: Início ---------------- */
function tile(icone, cor, txt, attrs, sub = '') { return `<button class="acao" ${attrs}><i class="bolha b-${cor}">${ic(icone)}</i><span>${txt}${sub ? `<small>${sub}</small>` : ''}</span></button>`; }
function banner(icone, cor, txt, desde, attrs) { return `<button class="card linha entre" ${attrs}><span class="linha"><i class="bolha b-${cor}">${ic(icone)}</i><b>${txt}</b></span><b class="num" data-desde="${desde}"></b></button>`; }
const BRILHOS = [[62, 18, 0], [88, 12, 1.1], [94, 46, 2.2], [70, 70, .6], [84, 84, 1.7], [56, 40, 2.6]];
function capa(o) {
  return `<div class="capa capa-foto"><div class="respira"></div><div class="brilhos">${BRILHOS.map(([x, y, d]) => `<i style="left:${x}%;top:${y}%;animation-delay:${d}s"></i>`).join('')}</div>
  <div class="txt"><div><div class="rotulo">${o.rotulo}</div><div class="linha-capa">${o.linha || ''}</div></div>
  <div><div class="grande">${o.grande}</div><div class="sub">${o.sub || ''}</div></div>
  <div>${o.barra != null ? `<div class="barra"><i style="width:${o.barra}%"></i></div>` : ''}${o.rodape ? `<div class="rodape-capa">${o.rodape}</div>` : ''}</div></div></div>`;
}
const dataLonga = t => new Date(t).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
function vInicio() {
  let h = cardAtualizacao();
  const g = gestacao();
  if (S.ativo.contr) h += banner('timer', 'alerta', 'Contração em andamento', S.ativo.contr, 'data-a="ir" data-tab="parto" data-sub="contr"');
  if (S.ativo.mamada) h += banner('milk', 'rosa', 'Mamando · ' + ladoNome(S.ativo.mamada.lado), S.ativo.mamada.ini, 'data-a="ir" data-tab="maya" data-sub="mamadas"');
  if (S.ativo.sono) h += banner('moon', 'lilas', esc(cfg.bebe) + ' dormindo', S.ativo.sono, 'data-a="ir" data-tab="maya" data-sub="sono"');
  if (S.ativo.chutes) h += banner('footprints', 'ouro', `Movimentos: ${S.ativo.chutes.n}/10`, S.ativo.chutes.ini, 'data-a="ir" data-tab="parto" data-sub="chutes"');

  if (!nascida()) {
    if (g) h += capa({ rotulo: 'Data provável do parto', linha: dataLonga(dataLocal(cfg.dpp)),
      grande: g.falta > 0 ? g.falta + (g.falta === 1 ? ' dia' : ' dias') : g.falta === 0 ? 'É hoje!' : `+${-g.falta} ${g.falta === -1 ? 'dia' : 'dias'}`,
      sub: g.falta > 0 ? `para conhecer a ${esc(cfg.bebe)}` : `A ${esc(cfg.bebe)} chega quando estiver pronta 💛`,
      barra: g.pct, rodape: `${Math.round(g.pct)}% do caminho 💛` });
    else h += `<button class="capa" style="width:100%;text-align:left" data-a="ajustes"><div class="deco">${ic('calendar-heart')}</div><div class="rotulo">Primeiro passo</div><h2 style="margin:6px 0 2px">Coloque a data provável do parto</h2><div class="sub">Toque aqui</div></button>`;
  } else {
    const i = idadeBebe(); const n = +new Date(cfg.nasc);
    h += capa({ rotulo: `A ${esc(cfg.bebe)} nasceu`, linha: `${new Date(n).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}, às ${hora(n)}`, grande: i.d === 0 ? 'Bem-vinda!' : i.txt,
      sub: cfg.pesoNasc ? `${esc(cfg.pesoNasc)} g${cfg.compNasc ? ' · ' + esc(cfg.compNasc) + ' cm' : ''}` : 'de muito amor',
      rodape: i.d < 40 ? `Dia ${i.d + 1} do resguardo da ${esc(cfg.mae)} 🌷` : `${i.d + 1}º dia de vida` });
  }

  const rec = recadoDoDia();
  if (rec) h += `<div class="card recado" data-a="outroRecado"><div class="linha" style="margin-bottom:6px"><i class="bolha b-rosa" style="width:34px;height:34px;border-radius:11px">${ic('heart')}</i><span class="rotulo">Recado do ${esc(cfg.pai)}</span></div><p style="font-size:1.08rem;font-weight:600;margin:4px 0 0">${esc(rec)}</p><small class="mute">toque para outro recado</small></div>`;

  if (!nascida()) {
    const tot = Object.values(C.mala).flat().length + Object.values(S.extraMala).flat().length;
    const feitos = Object.keys(S.chk).filter(k => k.startsWith('mala:') && S.chk[k]).length;
    h += `<div class="grade">
      ${tile('timer', 'rosa', 'Contrações', 'data-a="ir" data-tab="parto" data-sub="contr"', 'cronômetro')}
      ${tile('footprints', 'ouro', 'Movimentos', 'data-a="ir" data-tab="parto" data-sub="chutes"', 'contar até 10')}
      ${tile('luggage', 'verde', 'Mala', 'data-a="ir" data-tab="parto" data-sub="mala"', `${feitos} de ${tot} itens`)}
      ${tile('message-circle-heart', 'lilas', 'Chamar ' + esc(cfg.pai), 'data-a="ir" data-tab="mae" data-sub="bruno"', 'pelo WhatsApp')}
    </div>
    ${cardSemana()}${cardConsulta()}${cardMomentos()}
    <button class="btn destaque-btn" data-a="nasceu">${ic('party-popper')} A ${esc(cfg.bebe)} nasceu!</button>
    <button class="card linha" data-a="ir" data-tab="parto" data-sub="quando"><i class="bolha b-alerta">${ic('siren')}</i><span><h3>Quando ir para a maternidade?</h3><small>Bolsa, sangramento, ${esc(cfg.bebe)} mexendo menos, contrações.</small></span></button>`;
  } else {
    const u = ultimos(S.mam)[0];
    const fh = hojeDe(S.fr, 't');
    const sono24 = ult24(S.sono).reduce((s, x) => s + (x.fim - x.ini), 0) + (S.ativo.sono ? Date.now() - S.ativo.sono : 0);
    const espXixi = Math.min(6, idadeBebe().diaVida);
    h += `<div class="grade3">
      ${tile('milk', 'rosa', 'Mamada', 'data-a="ir" data-tab="maya" data-sub="mamadas"')}
      ${tile('droplet', 'azul', 'Xixi', 'data-a="fralda" data-x="1" data-c="0"')}
      ${tile('coco', 'ouro', 'Cocô', 'data-a="fralda" data-x="0" data-c="1"')}
      ${tile(S.ativo.sono ? 'sun' : 'moon', 'lilas', S.ativo.sono ? 'Acordou' : 'Dormiu', 'data-a="sono"')}
      ${tile('pill', 'verde', 'Remédios', 'data-a="ir" data-tab="mae" data-sub="remedios"')}
      ${tile('message-circle-heart', 'rosa', esc(cfg.pai), 'data-a="ir" data-tab="mae" data-sub="bruno"')}
    </div>
    ${cardConsulta()}
    <div class="card"><div class="linha entre"><span class="rotulo">Última mamada</span>${u ? `<small data-rel="${u.ini}"></small>` : ''}</div>
      ${u ? `<div class="linha entre" style="margin-top:6px"><span class="grande" style="font-size:2rem">${hora(u.ini)}</span><span class="tag">${u.tipo === 'peito' ? 'terminou no ' + ladoNome(u.ladoFim) : 'mamadeira ' + (u.ml || '') + ' ml'}</span></div>
      <p class="mute">Próxima por volta das <b style="color:var(--ink)">${hora(u.ini + cfg.intervaloMamada * MIN)}</b>${u.tipo === 'peito' ? ' · começar pelo ' + ladoNome(u.ladoFim === 'E' ? 'D' : 'E') : ''} · ${ult24(S.mam).length} em 24h</p>` : '<p class="mute">Nenhuma registrada ainda.</p>'}</div>
    <div class="grade">
      <div class="card"><span class="rotulo">Fraldas hoje</span><p style="font-size:1.15rem;font-weight:700">${fh.filter(f => f.xixi).length} xixi <small>/ ${espXixi}+</small><br>${fh.filter(f => f.coco).length} cocô</p></div>
      <div class="card"><span class="rotulo">Sono 24h</span><p style="font-size:1.15rem;font-weight:700">${dur(sono24)}</p></div>
    </div>`;
    h += cardSemana() + cardMomentos();
    const pv = proximaVacina(); if (pv) h += `<button class="card linha" data-a="ir" data-tab="maya" data-sub="vacinas"><i class="bolha b-azul">${ic('syringe')}</i><span><h3>Vacinas de ${pv.quando} · ${data(pv.dia)}</h3><small>${pv.quais}</small></span></button>`;
  }
  const prox = listaNotificacoes().filter(n => n.at > Date.now() && ((n.id >= 100 && n.id < 700 && n.at < Date.now() + 12 * H) || (n.id >= 800 && n.at < Date.now() + DIA))).sort((a, b) => a.at - b.at).slice(0, 4);
  if (prox.length) h += `<div class="card"><span class="rotulo">Próximos lembretes</span><ul class="lista">${prox.map(n => `<li><span>${esc(n.title)}</span><small>${dataHora(n.at)}</small></li>`).join('')}</ul></div>`;
  return h;
}
function cardSemana() {
  const i = infoSemana(); if (!i) return '';
  return `<button class="card linha" data-a="ir" data-tab="maya" data-sub="semana"><i class="bolha b-ouro">${ic('sparkles')}</i><span style="flex:1"><span class="rotulo">Esta semana</span><h3 style="margin:2px 0">${i.titulo}</h3><small>${i.texto.length > 95 ? i.texto.slice(0, 95).replace(/\s+\S*$/, '') + '…' : i.texto}</small></span></button>`;
}
function cardConsulta() {
  const c = proxConsulta(); if (!c || c.quando - Date.now() > 7 * DIA) return '';
  return `<button class="card linha" data-a="ir" data-tab="mais" data-sub="consultas"><i class="bolha b-lilas">${ic('stethoscope')}</i><span style="flex:1"><span class="rotulo">Próxima consulta</span><h3 style="margin:2px 0">${esc(c.titulo)} · ${esc(quemNome(c.quem))}</h3><small>${dataHora(c.quando)}${S.perguntas.some(p => p.quem === c.quem && !p.feita) ? ' · ' + S.perguntas.filter(p => p.quem === c.quem && !p.feita).length + ' perguntas anotadas' : ''}</small></span></button>`;
}
function cardMomentos() {
  const ths = S.marcos.slice().sort((a, b) => b.t - a.t).flatMap(m => (m.midias || []).map(x => x.th)).filter(Boolean).slice(0, 5);
  return `<button class="card" data-a="ir" data-tab="maya" data-sub="marcos"><div class="linha entre"><span class="linha"><i class="bolha b-rosa">${ic('image')}</i><span><h3 style="margin:0">Nossos momentos</h3><small>${S.marcos.length ? S.marcos.length + (S.marcos.length === 1 ? ' momento guardado' : ' momentos guardados') : 'Guarde fotos e vídeos de cada fase'}</small></span></span>${ic('plus')}</div>${ths.length ? `<div class="strip">${ths.map(t => `<div style="background-image:url(${t})"></div>`).join('')}</div>` : ''}</button>`;
}
function proximaVacina() {
  if (!nascida()) return null; const n = inicioDia(+new Date(cfg.nasc));
  const v = C.vacinas.find(g => !grupoFeito(g)); if (!v) return null;
  return { quando: v[2], quais: pendentesGrupo(v).join(', '), dia: n + v[1] * DIA };
}

/* ---------------- Telas: Maya ---------------- */
function vMaya() {
  const sub = V.sub.maya;
  let h = abas('maya');
  if (!nascida() && ['mamadas', 'fraldas', 'sono', 'cres', 'testes', 'saude'].includes(sub)) h += `<div class="card"><p>Isso começa a contar quando a ${esc(cfg.bebe)} nascer. Já pode ir conhecendo! 💛</p></div>`;
  return h + ({ mamadas: vMamadas, fraldas: vFraldas, sono: vSono, ninar: vNinar, cres: vCres, vacinas: vVacinas, testes: vTestes, marcos: vMarcos, semana: vSemana, saude: vSaude, alertas: vSaude }[sub] || vMamadas)();
}

function vMamadas() {
  const a = S.ativo.mamada; let h = '';
  if (a) {
    const segE = a.segE + (a.lado === 'E' && a.desde ? Date.now() - a.desde : 0);
    const segD = a.segD + (a.lado === 'D' && a.desde ? Date.now() - a.desde : 0);
    h += `<div class="card" style="text-align:center">
      <div class="mute">Mamando desde ${hora(a.ini)}</div>
      <div class="grande num" data-desde="${a.ini}"></div>
      <div class="grade" style="margin:12px 0">
        <button class="acao" data-a="mLado" data-l="E" style="${a.lado === 'E' ? 'border:2px solid var(--rosa)' : ''}"><i class="bolha b-rosa">${ic('heart')}</i>Esquerdo<b class="num" ${a.lado === 'E' && a.desde ? `data-desde="${a.desde}" data-base="${a.segE}"` : ''}>${crono(segE)}</b></button>
        <button class="acao" data-a="mLado" data-l="D" style="${a.lado === 'D' ? 'border:2px solid var(--rosa)' : ''}"><i class="bolha b-rosa">${ic('heart')}</i>Direito<b class="num" ${a.lado === 'D' && a.desde ? `data-desde="${a.desde}" data-base="${a.segD}"` : ''}>${crono(segD)}</b></button>
      </div>
      <div class="grade"><button class="btn sec" data-a="mPausa">${a.desde ? ic('pause') + ' Pausar' : ic('play') + ' Continuar'}</button><button class="btn verde" data-a="mFim">${ic('check')} Terminar</button></div>
      <button class="btn sec mini" style="margin-top:10px" data-a="mCancelar">Cancelar</button></div>`;
  } else {
    const u = ultimos(S.mam)[0]; const sug = u && u.tipo === 'peito' ? (u.ladoFim === 'E' ? 'D' : 'E') : 'E';
    h += `<div class="card" style="text-align:center">
      ${u ? `<p class="mute">Última: ${hora(u.ini)} (<span data-rel="${u.ini}"></span>)${u.tipo === 'peito' ? ' · sugestão: começar pelo <b>' + ladoNome(sug) + '</b>' : ''}</p>` : ''}
      <div class="grade" style="margin:10px 0">
        <button class="btn ${sug === 'E' ? '' : 'sec'}" style="min-height:64px" data-a="mIni" data-l="E">Esquerdo</button>
        <button class="btn ${sug === 'D' ? '' : 'sec'}" style="min-height:64px" data-a="mIni" data-l="D">Direito</button>
      </div>
      <div class="grade"><button class="btn sec" data-a="mManual" data-t="mamadeira">${ic('milk')} Mamadeira</button><button class="btn sec" data-a="mManual" data-t="peito">${ic('notebook-pen')} Anotar</button></div></div>`;
  }
  if (nascida()) h += linhaDia();
  const l = ult24(S.mam);
  const peitoMin = l.reduce((s, m) => s + (m.segE || 0) + (m.segD || 0), 0);
  const ml = l.reduce((s, m) => s + (+m.ml || 0), 0);
  const ord = l.slice().sort((x, y) => x.ini - y.ini); let somaInt = 0;
  for (let i = 1; i < ord.length; i++) somaInt += ord[i].ini - ord[i - 1].ini;
  h += `<div class="card"><h3>Últimas 24 horas</h3><div class="grade3" style="text-align:center">
    <div><div class="grande">${l.length}</div><small>mamadas</small></div>
    <div><div class="grande" style="font-size:1.5rem">${ord.length > 1 ? dur(somaInt / (ord.length - 1)) : '—'}</div><small>intervalo médio</small></div>
    <div><div class="grande" style="font-size:1.5rem">${ml ? ml + 'ml' : dur(peitoMin)}</div><small>${ml ? 'mamadeira' : 'no peito'}</small></div></div>
    <p class="mute" style="margin-top:10px">${C.mamadaDica}</p></div>`;
  h += historico(ultimos(S.mam).slice(0, 30), m => `<span><b>${dataHora(m.ini)}</b><br><small>${m.tipo === 'peito' ? `E ${dur(m.segE || 0)} · D ${dur(m.segD || 0)} · terminou ${ladoNome(m.ladoFim)}` : 'Mamadeira ' + (m.ml || '?') + ' ml'}</small></span>`, 'mam');
  return h;
}
function historico(itens, linha, col) {
  if (!itens.length) return '';
  return `<div class="card"><h3>Histórico</h3><ul class="lista">${itens.map(x => `<li>${linha(x)}<button class="btn sec mini" data-a="apagar" data-col="${col}" data-id="${x.id}">${ic('trash-2')}</button></li>`).join('')}</ul></div>`;
}

function vFraldas() {
  const fh = hojeDe(S.fr, 't'); const iv = nascida() ? idadeBebe() : { diaVida: 6 };
  const esp = Math.min(6, iv.diaVida);
  const x = fh.filter(f => f.xixi).length;
  let h = `<div class="grade3">
    <button class="acao" data-a="fralda" data-x="1" data-c="0"><span>💧</span>Xixi</button>
    <button class="acao" data-a="fralda" data-x="0" data-c="1"><span>💩</span>Cocô</button>
    <button class="acao" data-a="fralda" data-x="1" data-c="1"><span>💧💩</span>Os dois</button></div>
    <div class="card"><h3>Hoje</h3><p>💧 Xixi: <b>${x}</b> <span class="mute">(esperado ${esp}+ no ${iv.diaVida}º dia)</span> · 💩 Cocô: <b>${fh.filter(f => f.coco).length}</b></p>
    <div class="barra"><i style="width:${Math.min(100, x / esp * 100)}%"></i></div><p class="mute" style="margin-top:10px">${C.fraldaDica}</p></div>`;
  h += historico(ultimos(S.fr, 't').slice(0, 30), f => `<span><b>${dataHora(f.t)}</b> ${f.xixi ? '💧' : ''}${f.coco ? '💩' : ''}${f.cor ? ' <small>' + esc(f.cor) + '</small>' : ''}</span>`, 'fr');
  return h;
}

function vSono() {
  const a = S.ativo.sono;
  const l = ult24(S.sono); const tot = l.reduce((s, x) => s + x.fim - x.ini, 0) + (a ? Date.now() - a : 0);
  let h = `<div class="card" style="text-align:center"><button class="circulo ${a ? 'on' : ''}" data-a="sono">${a ? `<span class="num" data-desde="${a}"></span><small>Toque quando acordar</small>` : `${ic('moon')}<small>Toque quando ela dormir</small>`}</button>
    <p>Dormiu <b>${dur(tot)}</b> nas últimas 24h</p><p class="mute">Recém-nascidos dormem de 14 a 17 horas por dia, em vários cochilos. Sempre de barriga para cima, no berço, sem travesseiro nem bichinhos.</p></div>`;
  h += historico(ultimos(S.sono).slice(0, 30), s => `<span><b>${dataHora(s.ini)}</b> → ${hora(s.fim)}<br><small>${dur(s.fim - s.ini)}</small></span>`, 'sono');
  return h;
}

/* Ruído branco */
const Som = { ctx: null, node: null, gain: null, tipo: null, fimEm: 0, t: null };
function tocar(tipo) {
  pararSom();
  const ctx = Som.ctx || (Som.ctx = new (window.AudioContext || window.webkitAudioContext)());
  ctx.resume && ctx.resume();
  const len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    if (tipo === 'branco') d[i] = w * 0.35;
    else if (tipo === 'rosa') { b0 = 0.99765 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.0527; d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.08; }
    else { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; }
    if (tipo === 'utero') d[i] *= 0.75 + 0.25 * Math.max(0, Math.sin(2 * Math.PI * i / ctx.sampleRate * 1.1)) ** 6;
  }
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
  const g = ctx.createGain(); g.gain.value = (S.vol ?? 0.7);
  src.connect(g).connect(ctx.destination); src.start();
  Object.assign(Som, { node: src, gain: g, tipo });
  render();
}
function pararSom() { try { Som.node && Som.node.stop(); } catch {} Som.node = null; Som.tipo = null; clearTimeout(Som.t); Som.fimEm = 0; }
function vNinar() {
  const tipos = [['branco', 'sparkles', 'azul', 'Ruído branco', 'Chiado tipo TV fora do ar'], ['rosa', 'droplets', 'verde', 'Chuva', 'Mais suave'], ['marrom', 'glass-water', 'lilas', 'Mar / ventilador', 'Grave e calmo'], ['utero', 'heart', 'rosa', 'Barriguinha', 'Som grave com pulsação']];
  return `<div class="card"><p class="mute" style="margin:0">Sons contínuos acalmam muitos bebês porque lembram o barulho de dentro da barriga. Deixe o celular a uns 2 metros dela e o volume baixo.</p></div>
  ${tipos.map(([k, i, c, n, d]) => `<button class="card linha entre" style="${Som.tipo === k ? 'border:2px solid var(--rosa)' : ''}" data-a="${Som.tipo === k ? 'somParar' : 'som'}" data-t="${k}"><span class="linha"><i class="bolha b-${c}">${ic(i)}</i><span><b>${n}</b><br><small>${d}</small></span></span><i class="bolha ${Som.tipo === k ? 'b-alerta' : 'b-rosa'}" style="border-radius:50%">${ic(Som.tipo === k ? 'square' : 'play')}</i></button>`).join('')}
  <div class="card"><label style="margin-top:0">Volume</label><input type="range" min="0.05" max="1" step="0.05" value="${S.vol ?? 0.7}" data-in="vol">
  <label>Desligar sozinho</label><div class="chips">${[15, 30, 60, 0].map(m => `<button class="chip" data-a="somTimer" data-m="${m}">${m ? m + ' min' : 'Nunca'}</button>`).join('')}</div>
  ${Som.fimEm ? `<p class="mute">Desliga às ${hora(Som.fimEm)}</p>` : ''}</div>
  <button class="card linha" data-a="luz"><i class="bolha b-ouro">${ic('lamp-desk')}</i><span><h3>Luz de mamada</h3><small>Deixa a tela com uma luz laranja bem fraquinha para amamentar de madrugada sem acender a luz do quarto. Toque na tela para sair.</small></span></button>`;
}

function vCres() {
  const l = ultimos(S.cres, 't'); const pn = +cfg.pesoNasc;
  let h = `<button class="btn bloco" data-a="cresNovo">${ic('plus')} Anotar peso / altura</button>`;
  if (pn) {
    const u = l[0];
    if (u && u.g) { const p = (u.g - pn) / pn * 100; h += `<div class="card"><h3>Desde o nascimento</h3><p><b>${(u.g / 1000).toFixed(3).replace('.', ',')} kg</b> (${p >= 0 ? '+' : ''}${p.toFixed(1).replace('.', ',')}%)</p><p class="mute">É normal perder até uns 10% do peso nos primeiros dias e recuperar até umas 2 semanas de vida.</p></div>`; }
  }
  h += historico(l, c => `<span><b>${data(c.t)}</b> · ${c.g ? (c.g / 1000).toFixed(3).replace('.', ',') + ' kg' : ''}${c.cm ? ' · ' + esc(c.cm) + ' cm' : ''}${c.pc ? ' · PC ' + esc(c.pc) + ' cm' : ''}</span>`, 'cres');
  return h;
}

/* Caderneta de vacinação */
const todasDoses = () => C.vacinas.flatMap(g => g[3]);
const grupoFeito = g => g[3].every(d => S.vac[d[0]]);
const pendentesGrupo = g => g[3].filter(d => !S.vac[d[0]]).map(d => `${d[1]} (${d[2]})`);
function statusGrupo(g, n) {
  if (grupoFeito(g)) return ['ok', 'Completa'];
  if (n == null) return ['fut', g[1] ? `com ${g[2]} de vida` : 'na maternidade'];
  const dia = n + g[1] * DIA, falta = Math.round((dia - inicioDia()) / DIA);
  if (falta < 0) return ['atr', `Atrasada · era ${data(dia)}`];
  if (falta === 0) return ['hoje', 'É hoje!'];
  if (falta <= 7) return ['prox', `Em ${falta} ${falta === 1 ? 'dia' : 'dias'} · ${data(dia)}`];
  return ['fut', new Date(dia).toLocaleDateString('pt-BR')];
}
function vVacinas() {
  const n = nascida() ? inicioDia(+new Date(cfg.nasc)) : null;
  const doses = todasDoses(), feitas = doses.filter(d => S.vac[d[0]]).length;
  let h = `<div class="cad-capa"><div class="cad-furos"></div><div class="rotulo">Caderneta de vacinação</div><div class="cad-nome">${esc(cfg.bebe)}</div>
    <small>${n ? 'Nascida em ' + new Date(n).toLocaleDateString('pt-BR') : 'Esperando chegar 💛'}</small>
    <div class="barra" style="margin-top:14px"><i style="width:${feitas / doses.length * 100}%"></i></div><small>${feitas} de ${doses.length} doses aplicadas</small></div>`;
  h += C.vacinas.map(g => {
    const [st, txt] = statusGrupo(g, n); const feito = grupoFeito(g);
    return `<div class="pagina"><div class="pag-topo"><span><b>${g[2]}</b></span><span class="cad-st st-${st}">${txt}</span></div>
      ${g[3].map(d => { const r = S.vac[d[0]]; return `<button class="dose" data-a="vacReg" data-d="${d[0]}"><span><b>${d[1]}</b><small>${d[2]} · ${d[3]}</small></span>${r ? `<span class="carimbo"><em>Aplicada</em><strong>${new Date(r.t).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}</strong></span>` : `<span class="vazio-dose">${ic('plus')}<small>registrar</small></span>`}</button>`; }).join('')}
      ${!feito && g[3].length > 1 ? `<button class="btn sec mini" style="margin:8px 0 2px" data-a="vacTodas" data-g="${g[0]}">${ic('check')} Tomou todas desta idade hoje</button>` : ''}</div>`;
  }).join('');
  h += `<div class="card"><p class="mute" style="margin:0">Calendário Nacional de Vacinação 2026 (SUS). Toque numa vacina para registrar o dia, o lote e o posto. Confira sempre com a caderneta de papel e com a pediatra. Gripe (influenza): todo ano a partir dos 6 meses. Em campanhas podem aparecer vacinas extras.</p></div>`;
  return h;
}
function achaDose(id) { for (const g of C.vacinas) for (const d of g[3]) if (d[0] === id) return { g, d }; return null; }
function vTestes() {
  return `<div class="card">${C.testes.map(([id, n, d]) => { const k = 'teste:' + id, f = S.chk[k]; return `<label class="check ${f ? 'feito' : ''}"><input type="checkbox" data-chk="${k}" ${f ? 'checked' : ''}><span><b class="t">${n}</b><br><small>${d}${f && f !== true ? ' · feito ' + data(f) : ''}</small></span></label>`; }).join('')}</div>`;
}
function vAlertas(lista, titulo) {
  return `<div class="card alerta"><h3>${titulo}</h3><p>Na dúvida, sempre ligue. Emergência: <a href="tel:192"><b>SAMU 192</b></a></p></div>` +
    lista.map(([t, d]) => `<details><summary>${t}</summary><p>${d}</p></details>`).join('');
}

/* ---------------- Mídia (fotos/vídeos dos momentos) em IndexedDB ---------------- */
const MDB = {
  db: null,
  abrir() { return this.db || (this.db = new Promise((ok, erro) => { const r = indexedDB.open('maira-midia', 1); r.onupgradeneeded = () => r.result.createObjectStore('m'); r.onsuccess = () => ok(r.result); r.onerror = () => erro(r.error); })); },
  async op(modo, fn) { const db = await this.abrir(); return new Promise((ok, erro) => { const t = db.transaction('m', modo); const req = fn(t.objectStore('m')); t.oncomplete = () => ok(req && req.result); t.onerror = () => erro(t.error); }); },
  put(k, v) { return this.op('readwrite', s => s.put(v, k)); },
  get(k) { return this.op('readonly', s => s.get(k)); },
  del(k) { return this.op('readwrite', s => s.delete(k)); },
};
const urls = {};
async function urlMidia(k) { if (urls[k]) return urls[k]; const b = await MDB.get(k); if (!b) return ''; return urls[k] = URL.createObjectURL(b); }
function reduzirFoto(file, max = 1600, q = 0.85) {
  return new Promise((ok, erro) => {
    const u = URL.createObjectURL(file); const im = new Image();
    im.onload = () => { const k = Math.min(1, max / Math.max(im.width, im.height)); const c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); c.toBlob(b => ok({ blob: b, canvas: c }), 'image/jpeg', q); };
    im.onerror = () => { URL.revokeObjectURL(u); erro(new Error('foto')); }; im.src = u;
  });
}
function miniatura(fonte, w, h, lado = 240) { const c = document.createElement('canvas'); const k = lado / Math.min(w, h); c.width = c.height = lado; c.getContext('2d').drawImage(fonte, (lado - w * k) / 2, (lado - h * k) / 2, w * k, h * k); return c.toDataURL('image/jpeg', 0.7); }
function quadroVideo(file) {
  return new Promise(ok => {
    const v = document.createElement('video'); v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = URL.createObjectURL(file);
    const fim = th => { URL.revokeObjectURL(v.src); ok(th); };
    v.onloadeddata = () => { v.currentTime = Math.min(0.5, (v.duration || 1) / 2); };
    v.onseeked = () => { try { fim(miniatura(v, v.videoWidth, v.videoHeight)); } catch { fim(''); } };
    v.onerror = () => fim(''); setTimeout(() => fim(''), 8000);
  });
}
let RASCUNHO = [];   // mídias escolhidas antes de guardar o momento
async function processarArquivos(files) {
  const novos = [];
  for (const f of files) {
    try {
      const k = 'm' + uid();
      if (f.type.startsWith('video')) {
        if (f.size > 150 * 1024 * 1024) { toast('Vídeo muito grande (máx. 150 MB)'); continue; }
        const th = await quadroVideo(f); await MDB.put(k, f); novos.push({ k, tipo: 'video', th });
      } else {
        const { blob, canvas } = await reduzirFoto(f); await MDB.put(k, blob);
        novos.push({ k, tipo: 'foto', th: miniatura(canvas, canvas.width, canvas.height) });
      }
    } catch (e) { console.warn(e); toast('Não consegui abrir um dos arquivos'); }
  }
  return novos;
}

const SUG_GRAVIDEZ = ['Barrigão de ' + (gestacao() ? gestacao().sem : 38) + ' semanas', 'Quartinho pronto', 'Mala pronta', 'Chá de bebê', 'Última foto da barriga'];
const SUG_BEBE = ['Primeiro banho', 'Conheceu a irmã e o irmão', 'Caiu o umbigo', 'Primeira saída de casa', 'Primeiro sorriso', 'Segurou o dedo', 'Primeira noite inteira', 'Primeira vez no colo do papai'];
const temMidia = () => S.marcos.some(m => (m.midias || []).length);

function vMarcos() {
  const sug = nascida() ? SUG_BEBE : SUG_GRAVIDEZ.concat(['Nasceu! 💛']);
  const lista = S.marcos.slice().sort((a, b) => b.t - a.t);
  const nFotos = S.marcos.reduce((s, m) => s + (m.midias || []).length, 0);
  let h = '';
  if (nFotos) h += `<button class="filme-btn" data-a="filme"><span class="play">${ic('play')}</span><span><b style="font-size:1.1rem">Ver nossos momentos</b><br><small>${lista.length} ${lista.length === 1 ? 'momento' : 'momentos'} · ${nFotos} ${nFotos === 1 ? 'foto/vídeo' : 'fotos e vídeos'}</small></span></button>`;
  h += `<div class="card"><h3>Guardar um momento</h3><div class="chips" style="margin:8px 0 10px">${sug.map(s => `<button class="chip" data-a="marcoSug" data-t="${esc(s)}">${esc(s)}</button>`).join('')}</div>
  <input id="marcoTxt" placeholder="Que momento foi esse?">
  <label>Quando</label><input id="marcoData" type="date" value="${paraInput(Date.now()).slice(0, 10)}">
  <label>Uma frase sobre ele (opcional)</label><input id="marcoNota" placeholder="Ex.: Ela sorriu olhando pro papai">
  ${botoesMidia('novo')}
  <div class="midias-prev" id="prevMidias">${RASCUNHO.map(m => `<div style="background-image:url(${m.th})"></div>`).join('')}</div>
  <button class="btn bloco" style="margin-top:12px" data-a="marcoAdd">${ic('heart')} Guardar momento</button></div>`;
  if (lista.length) h += `<div class="polas">${lista.map(m => { const md = m.midias || []; const th = md[0] && md[0].th; return `<button class="pola" data-a="marcoVer" data-id="${m.id}"><div class="ft" style="${th ? `background-image:url(${th})` : ''}">${th ? '' : ic('star')}</div>${md.length > 1 ? `<span class="qtd">${ic('image')}${md.length}</span>` : ''}<b>${esc(m.texto)}</b><small>${data(m.t)}</small></button>`; }).join('')}</div>`;
  return h;
}
async function abrirMarco(id) {
  const m = S.marcos.find(x => x.id === id); if (!m) return;
  const md = m.midias || [];
  modal(`<h2>${esc(m.texto)}</h2><p class="mute" style="margin-top:-8px">${dataExtenso(m.t)}</p>${m.nota ? `<p style="font-size:1.05rem">${esc(m.nota)}</p>` : ''}
    <div class="det-midia" id="detMidia">${md.map((x, i) => `<div data-k="${x.k}" data-tipo="${x.tipo}" data-i="${i}" style="aspect-ratio:1;border-radius:18px;margin-bottom:10px;background:var(--rosa-s) url(${x.th}) center/cover"></div>`).join('')}</div>
    ${botoesMidia(m.id)}
    <div class="grade" style="margin-top:12px">${md.length ? `<button class="btn" data-a="filme" data-id="${m.id}">${ic('play')} Assistir</button>` : '<span></span>'}<button class="btn sec" data-a="marcoApagar" data-id="${m.id}">${ic('trash-2')} Apagar</button></div>`);
  for (const el of $$('#detMidia [data-k]')) {
    const u = await urlMidia(el.dataset.k); if (!u) continue;
    const salvarBtn = `<button class="btn sec mini salvar-midia" data-a="midiaSalvar" data-k="${el.dataset.k}" data-tipo="${el.dataset.tipo}">${ic('download')} Salvar / compartilhar</button>`;
    el.outerHTML = (el.dataset.tipo === 'video' ? `<div class="vid-wrap"><video src="${u}" playsinline preload="metadata"></video><button class="vid-play" data-a="filme" data-id="${m.id}" data-i="${el.dataset.i}">${ic('play')}</button></div>` : `<img src="${u}" alt="" data-a="filme" data-id="${m.id}" data-i="${el.dataset.i}">`) + salvarBtn;
  }
}
function botoesMidia(alvo) {
  return `<div class="midia-btns">
    <label class="mbtn">${ic('camera')}<span>Tirar foto</span><input type="file" accept="image/*" capture="environment" data-midia="${alvo}" hidden></label>
    <label class="mbtn">${ic('video')}<span>Gravar vídeo</span><input type="file" accept="video/*" capture="environment" data-midia="${alvo}" hidden></label>
    <label class="mbtn">${ic('images')}<span>Da galeria</span><input type="file" accept="image/*,video/*" multiple data-midia="${alvo}" hidden></label></div>`;
}
async function salvarMidia(k, tipo) {
  const blob = await MDB.get(k); if (!blob) return toast('Arquivo não encontrado');
  const ext = tipo === 'video' ? 'mp4' : 'jpg', nome = `${cfg.bebe}-${k}.${ext}`.toLowerCase();
  if (NATIVO && CAP.isPluginAvailable && CAP.isPluginAvailable('Filesystem') && CAP.isPluginAvailable('Share')) {
    if (blob.size > 80 * 1024 * 1024) return toast('Vídeo grande demais para compartilhar por aqui');
    try {
      toast('Preparando...', 3000);
      const b64 = await new Promise((ok, erro) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1]); r.onerror = () => erro(r.error); r.readAsDataURL(blob); });
      const w = await plugin('Filesystem').writeFile({ path: nome, data: b64, directory: 'CACHE' });
      await plugin('Share').share({ title: cfg.bebe, files: [w.uri], dialogTitle: 'Salvar ou enviar' });
    } catch (e) { if (!/cancel/i.test(String(e && e.message || e))) toast('Não consegui compartilhar: ' + (e && e.message || e)); }
    return;
  }
  if (NATIVO) return toast('Instale a versão nova do app (APK) para salvar fotos');
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nome; a.click();
}
function dataExtenso(t) { return new Date(t).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }); }

/* Filminho estilo status do WhatsApp:
   toque à direita = próxima, toque à esquerda = anterior, segurar = pausa, soltar = continua, arrastar pra baixo = fecha */
const F = { cenas: [], i: 0, dur: 0, gasto: 0, pausado: false, segurando: false, raf: 0, ultimo: 0, video: null };
async function abrirFilme(soId, inicio = 0) {
  const ms = S.marcos.filter(m => (m.midias || []).length && (!soId || m.id === soId)).sort((a, b) => a.t - b.t);
  F.cenas = [];
  if (!soId) F.cenas.push({ tipo: 'abertura' });
  for (const m of ms) for (const x of m.midias) F.cenas.push({ tipo: x.tipo, k: x.k, titulo: m.texto, quando: dataExtenso(m.t), nota: m.nota });
  if (!soId) F.cenas.push({ tipo: 'fim' });
  if (!F.cenas.length) return;
  const el = document.createElement('div'); el.id = 'filme';
  el.innerHTML = `<div class="barras">${F.cenas.map(() => '<i><b></b></i>').join('')}</div><button class="fechar" aria-label="Fechar">${ic('plus', 'x')}</button><div id="palco"></div><div class="dica-filme">Segure para pausar · toque nos lados para passar</div>`;
  document.body.appendChild(el);
  try { if (Som.tipo) pararSom(); } catch {}
  let x0 = 0, y0 = 0, t0 = 0, holdT = 0, arrastou = false, apertado = false;
  el.addEventListener('pointerdown', e => {
    if (e.target.closest('.fechar')) return;
    x0 = e.clientX; y0 = e.clientY; t0 = Date.now(); arrastou = false; apertado = true;
    holdT = setTimeout(() => { F.segurando = true; el.classList.add('segurando'); pausar(true); }, 180);
  });
  el.addEventListener('pointermove', e => {
    if (!apertado) return;
    const dy = e.clientY - y0;
    if (dy > 10 && Math.abs(dy) > Math.abs(e.clientX - x0)) { arrastou = true; clearTimeout(holdT); el.style.transform = `translateY(${dy}px)`; el.style.opacity = Math.max(.3, 1 - dy / 600); }
  });
  const soltar = e => {
    if (!apertado) return; apertado = false;
    clearTimeout(holdT);
    if (e.target.closest && e.target.closest('.fechar')) return;
    const dy = e.clientY - y0;
    if (arrastou) { if (dy > 120) return fecharFilme(); el.style.transform = ''; el.style.opacity = ''; if (!F.segurando) return; }
    if (F.segurando) { F.segurando = false; el.classList.remove('segurando'); pausar(false); return; }
    if (Date.now() - t0 < 400) { if (e.clientX < innerWidth * 0.3) cena(F.i - 1); else cena(F.i + 1); }
  };
  el.addEventListener('pointerup', soltar);
  el.addEventListener('pointercancel', () => { apertado = false; clearTimeout(holdT); if (F.segurando) { F.segurando = false; el.classList.remove('segurando'); pausar(false); } el.style.transform = ''; el.style.opacity = ''; });
  el.querySelector('.fechar').addEventListener('click', fecharFilme);
  el.addEventListener('contextmenu', e => e.preventDefault());
  setTimeout(() => { const d = el.querySelector('.dica-filme'); if (d) d.classList.add('some'); }, 3500);
  cena(Math.min(inicio + (soId ? 0 : 0), F.cenas.length - 1));
  F.ultimo = performance.now(); cancelAnimationFrame(F.raf); F.raf = requestAnimationFrame(passoFilme);
}
function passoFilme(t) {
  const dt = t - F.ultimo; F.ultimo = t;
  if (!$('#filme')) return;
  const v = F.video;
  if (!F.pausado) {
    if (v) { if (v.duration) { F.dur = v.duration * 1000; F.gasto = v.currentTime * 1000; } }
    else F.gasto += dt;
  }
  const b = $$('#filme .barras b')[F.i];
  if (b && F.dur) b.style.width = Math.min(100, F.gasto / F.dur * 100) + '%';
  if (!v && F.dur && F.gasto >= F.dur && !F.pausado) { cena(F.i + 1); }
  F.raf = requestAnimationFrame(passoFilme);
}
function pausar(sim) {
  F.pausado = sim;
  const v = F.video; if (v) { try { sim ? v.pause() : v.play(); } catch {} }
  $$('#filme .cena img.principal').forEach(i => i.style.animationPlayState = sim ? 'paused' : 'running');
}
function fecharFilme() { cancelAnimationFrame(F.raf); if (F.video) { try { F.video.pause(); } catch {} } F.video = null; const el = $('#filme'); if (el) el.remove(); }
async function cena(i) {
  if (i < 0) i = 0;
  if (i >= F.cenas.length) return fecharFilme();
  F.i = i; F.gasto = 0; F.pausado = F.segurando; F.dur = 6000;
  if (F.video) { try { F.video.pause(); } catch {} F.video = null; }
  const c = F.cenas[i];
  $$('#filme .barras b').forEach((b, k) => b.style.width = k < i ? '100%' : '0');
  const palco = $('#palco'); if (!palco) return;
  const div = document.createElement('div'); div.className = 'cena' + (i % 2 ? ' alt' : '');
  if (c.tipo === 'abertura') { div.classList.add('abertura'); div.innerHTML = `${ILUS ? `<img src="${ILUS}" alt="">` : ''}<h1>Os momentos da ${esc(cfg.bebe)}</h1><p style="opacity:.9;font-weight:600">com amor, ${esc(cfg.mae)} e ${esc(cfg.pai)} 💛</p>`; F.dur = 3500; }
  else if (c.tipo === 'fim') { div.classList.add('abertura'); div.innerHTML = `<h1>Continua...</h1><p style="opacity:.9;font-weight:600">Cada dia com a ${esc(cfg.bebe)} é um momento novo 💛</p>`; F.dur = 3500; }
  else {
    const u = await urlMidia(c.k); if (F.i !== i) return;
    const leg = `<div class="leg"><b>${esc(c.titulo)}</b><span>${esc(c.quando)}${c.nota ? ' · ' + esc(c.nota) : ''}</span></div>`;
    if (c.tipo === 'video') { div.innerHTML = `<div class="desfoque" style="background:#000"></div><video src="${u}" playsinline autoplay></video>${leg}`; F.dur = 0; }
    else div.innerHTML = `<div class="desfoque" style="background-image:url(${u})"></div><img class="principal" src="${u}" alt="">${leg}`;
  }
  palco.appendChild(div);
  requestAnimationFrame(() => div.classList.add('on'));
  [...palco.children].slice(0, -1).forEach(o => { o.classList.remove('on'); const vv = o.querySelector('video'); if (vv) vv.pause(); setTimeout(() => o.remove(), 700); });
  const v = div.querySelector('video');
  if (v) { F.video = v; v.onended = () => { if (F.video === v) cena(i + 1); }; v.onerror = () => { if (F.video === v) cena(i + 1); }; if (F.pausado) v.pause(); }
  if (F.pausado) pausar(true);
}

/* ---------------- Semana a semana ---------------- */
function infoSemana() {
  if (nascida()) { const d = idadeBebe().d; const s = C.semanasBebe.find(x => d <= x[0]); return { tipo: 'bebe', titulo: s[1], texto: s[2], dica: s[3], quando: idadeBebe().txt }; }
  const g = gestacao(); if (!g) return null;
  const sem = Math.max(36, Math.min(42, g.sem)); const s = C.semanasGestacao.find(x => x[0] === sem);
  return { tipo: 'gest', titulo: s[1], texto: s[2], dica: s[3], quando: `${g.sem} semanas e ${g.dias} ${g.dias === 1 ? 'dia' : 'dias'}`, sem: g.sem };
}
function vSemana() {
  const i = infoSemana();
  if (!i) return `<div class="card"><p>Coloque a data provável do parto nos ajustes para ver o semana a semana.</p></div>`;
  const lista = i.tipo === 'bebe' ? C.semanasBebe : C.semanasGestacao;
  return `<div class="semana-hero"><div class="rotulo">${i.tipo === 'bebe' ? `${esc(cfg.bebe)} · ${i.quando}` : i.quando}</div><h2>${i.titulo}</h2><p>${i.texto}</p>
    <div class="dica">${ic('lightbulb')}<span>${i.dica}</span></div></div>
    ${lista.filter(x => x[1] !== i.titulo).map(x => `<details><summary>${i.tipo === 'gest' ? x[0] + ' semanas · ' : ''}${x[1]}</summary><p>${x[2]}</p><p class="mute">${x[3]}</p></details>`).join('')}
    <p class="mute" style="text-align:center;font-size:.85rem">Cada ${i.tipo === 'bebe' ? 'bebê' : 'gravidez'} tem seu tempo. Na dúvida, pergunte nas consultas.</p>`;
}

/* ---------------- Saúde da Maya (temperatura) ---------------- */
function classTemp(c) {
  const menor3m = !nascida() || idadeBebe().d < 90;
  if (c < 35.5) return ['alerta', 'Temperatura baixa', 'Agasalhe, coloque no colo pele a pele e meça de novo em 30 min. Se continuar baixa ou ela estiver molinha, procure atendimento.'];
  if (c < 37.5) return ['verde', 'Normal', 'Tudo certo.'];
  if (c < 37.8) return ['ouro', 'Um pouco alta', 'Tire o excesso de roupa, ofereça o peito e meça de novo em 30 minutos.'];
  return ['alerta', 'Febre', menor3m ? `A ${esc(cfg.bebe)} tem menos de 3 meses: procure o pronto-socorro agora, mesmo que ela pareça bem.` : 'Fale com a pediatra. Se estiver molinha, com dificuldade para respirar ou recusando mamar, procure atendimento.'];
}
function vSaude() {
  const l = ultimos(S.temp, 't'); const u = l[0];
  let h = `<div class="card"><h3>Medir temperatura</h3><p class="mute" style="margin-top:0">Termômetro na axila (debaixo do braço), seco, até apitar.</p>
    <div class="linha"><input id="tempV" type="text" inputmode="decimal" autocomplete="off" placeholder="36,5" style="font-size:1.4rem;font-weight:800;text-align:center"><span style="font-size:1.3rem;font-weight:800">°C</span></div>
    <input id="tempN" placeholder="Observação (opcional): ex. depois da vacina" style="margin-top:8px">
    <button class="btn bloco" style="margin-top:10px" data-a="tempAdd">${ic('check')} Anotar</button></div>`;
  if (u) { const [cor, tit, txt] = classTemp(u.c); h += `<div class="card ${cor === 'alerta' ? 'alerta' : ''}"><div class="linha entre"><span class="rotulo">Última medida · ${dataHora(u.t)}</span><span class="tag" style="background:var(--${cor}-s);color:var(--${cor})">${tit}</span></div><div class="grande">${String(u.c).replace('.', ',')} °C</div><p>${txt}</p>${cor === 'alerta' ? `<a class="btn perigo bloco" href="tel:192">${ic('phone')} SAMU 192</a>` : ''}</div>`; }
  h += historico(l.slice(0, 20), x => `<span><b>${String(x.c).replace('.', ',')} °C</b> · ${dataHora(x.t)}${x.nota ? `<br><small>${esc(x.nota)}</small>` : ''}</span>`, 'temp');
  h += `<h2 style="margin-top:22px">Quando procurar ajuda</h2>` + vAlertas(C.alertasBebe, 'Sinais de alerta da ' + esc(cfg.bebe));
  return h;
}

/* ---------------- Consultas e perguntas ---------------- */
const quemNome = q => q === 'bebe' ? cfg.bebe : cfg.mae;
function proxConsulta() { return S.consultas.filter(c => c.quando > Date.now() - 2 * H).sort((a, b) => a.quando - b.quando)[0]; }
function vConsultas() {
  const prox = S.consultas.filter(c => c.quando > Date.now() - 2 * H).sort((a, b) => a.quando - b.quando);
  const pass = S.consultas.filter(c => c.quando <= Date.now() - 2 * H).sort((a, b) => b.quando - a.quando);
  const blocoPerg = q => { const ps = S.perguntas.filter(p => p.quem === q); return `<div class="card"><h3>Perguntas para ${q === 'bebe' ? 'a pediatra' : 'a médica'} (${esc(quemNome(q))})</h3><p class="mute" style="margin-top:0">Anote as dúvidas quando surgirem, pra não esquecer na hora da consulta.</p>
    ${ps.map(p => `<label class="check ${p.feita ? 'feito' : ''}"><input type="checkbox" data-perg="${p.id}" ${p.feita ? 'checked' : ''}><span class="t">${esc(p.texto)}</span><button class="btn sec mini" style="margin-left:auto" data-a="pergApagar" data-id="${p.id}">${ic('trash-2')}</button></label>`).join('')}
    <div class="linha" style="margin-top:8px"><input placeholder="Nova pergunta..." data-novaperg="${q}"><button class="btn mini" data-a="pergAdd" data-q="${q}">${ic('plus')}</button></div></div>`; };
  let h = `<button class="btn bloco" data-a="consNova">${ic('calendar-heart')} Marcar consulta</button>`;
  h += prox.length ? prox.map(c => `<button class="card linha" data-a="consEd" data-id="${c.id}"><i class="bolha ${c.quem === 'bebe' ? 'b-rosa' : 'b-lilas'}">${ic('stethoscope')}</i><span style="flex:1"><h3 style="margin:0">${esc(c.titulo)} · ${esc(quemNome(c.quem))}</h3><small>${dataLonga(c.quando)}, ${hora(c.quando)}${c.local ? ' · ' + esc(c.local) : ''}</small></span></button>`).join('') : `<div class="card vazio">Nenhuma consulta marcada. Você recebe lembrete na véspera e 2 horas antes.</div>`;
  h += blocoPerg(nascida() ? 'bebe' : 'mae') + blocoPerg(nascida() ? 'mae' : 'bebe');
  if (pass.length) h += `<div class="card"><h3>Consultas anteriores</h3><ul class="lista">${pass.map(c => `<li data-a="consEd" data-id="${c.id}"><span><b>${esc(c.titulo)} · ${esc(quemNome(c.quem))}</b><br><small>${data(c.quando)}${c.notas ? ' · ' + esc(c.notas.slice(0, 60)) : ''}</small></span>${ic('pencil')}</li>`).join('')}</ul></div>`;
  return h;
}
function formConsulta(c) {
  modal(`<h2>${c.id ? 'Consulta' : 'Marcar consulta'}</h2>
  <div class="grade"><div><label>Para</label><select id="cQ"><option value="bebe" ${c.quem !== 'mae' ? 'selected' : ''}>${esc(cfg.bebe)}</option><option value="mae" ${c.quem === 'mae' ? 'selected' : ''}>${esc(cfg.mae)}</option></select></div>
  <div><label>Com</label><input id="cT" value="${esc(c.titulo || '')}" placeholder="Pediatra" list="cTl"><datalist id="cTl"><option>Pediatra</option><option>Obstetra</option><option>Revisão pós-parto</option><option>Vacinas</option><option>Teste do pezinho</option></datalist></div></div>
  <label>Quando</label><input id="cW" type="datetime-local" value="${paraInput(c.quando || Date.now() + DIA)}">
  <label>Onde (opcional)</label><input id="cL" value="${esc(c.local || '')}">
  <label>Anotações da consulta (peso, orientações, receitas...)</label><textarea id="cN">${esc(c.notas || '')}</textarea>
  <button class="btn bloco" style="margin-top:12px" data-a="consSalvar" data-id="${c.id || ''}">Salvar</button>
  ${c.id ? `<button class="btn sec bloco" style="margin-top:8px" data-a="consApagar" data-id="${c.id}">Apagar</button>` : ''}`);
}

/* ---------------- Linha do dia (últimas 24h) ---------------- */
function linhaDia() {
  const fim = Date.now(), ini = fim - DIA, W = 320, x = t => Math.max(0, Math.min(W, (t - ini) / DIA * W));
  const blocos = (arr, y, cor, ativo) => arr.filter(m => (m.fim || fim) > ini).map(m => `<rect x="${x(m.ini)}" y="${y}" width="${Math.max(2.5, x(m.fim || fim) - x(m.ini))}" height="14" rx="4" fill="${cor}"/>`).join('') + (ativo ? `<rect x="${x(ativo)}" y="${y}" width="${Math.max(2.5, x(fim) - x(ativo))}" height="14" rx="4" fill="${cor}" opacity=".55"/>` : '');
  const marcas = [0, 6, 12, 18, 24].map(k => { const t = ini + k * H; return `<line x1="${x(t)}" y1="6" x2="${x(t)}" y2="76" stroke="var(--line)" stroke-dasharray="2 3"/><text x="${Math.min(W - 14, Math.max(14, x(t)))}" y="92" text-anchor="middle" font-size="9" fill="var(--mute)">${k === 24 ? 'agora' : hora(t)}</text>`; }).join('');
  const fr = S.fr.filter(f => f.t > ini).map(f => `<circle cx="${x(f.t)}" cy="69" r="4.5" fill="${f.coco ? 'var(--ouro)' : 'var(--azul)'}"/>`).join('');
  return `<div class="card"><div class="linha entre"><span class="rotulo">Últimas 24 horas</span><small>${ic('milk')} mamadas · ${ic('moon')} sono · ${ic('droplet')} fraldas</small></div>
  <svg viewBox="0 0 ${W} 96" class="linha-dia">${marcas}
   <text x="2" y="18" font-size="0"></text>${blocos(S.mam, 12, 'var(--rosa)', S.ativo.mamada && S.ativo.mamada.ini)}${blocos(S.sono, 37, 'var(--lilas)', S.ativo.sono)}${fr}</svg></div>`;
}

/* ---------------- Telas: Mãe ---------------- */
function vMae() {
  const sub = V.sub.mae;
  return abas('mae') +
    ({ hoje: vHoje, remedios: vRemedios, bruno: vBruno, dicas: vDicas, alertas: () => vAlertas(C.alertasMae, 'Sinais de alerta pra você') }[sub])();
}
function vHoje() {
  const ag = hojeDe(S.agua, 't').reduce((s, a) => s + a.ml, 0);
  const hm = S.humor.find(x => mesmoDia(x.t, Date.now()));
  const caras = ['😢', '😕', '😐', '🙂', '😄'];
  let h = `<div class="card"><div class="linha entre"><h3>Água hoje</h3><b>${(ag / 1000).toFixed(1).replace('.', ',')} / ${(cfg.metaAgua / 1000).toFixed(1).replace('.', ',')} L</b></div>
    <div class="barra" style="margin:8px 0 12px"><i style="width:${Math.min(100, ag / cfg.metaAgua * 100)}%;background:var(--azul)"></i></div>
    <div class="grade3">${[200, 300, 500].map(m => `<button class="btn azul" data-a="agua" data-ml="${m}">+${m} ml</button>`).join('')}</div>
    <label class="check" style="border:0"><input type="checkbox" data-cfg="lembreteAgua" ${cfg.lembreteAgua ? 'checked' : ''}><span class="t">Lembrar de beber água a cada 2 horas (9h às 21h)</span></label></div>
    <div class="card"><h3>Como você está hoje?</h3><div class="linha entre" style="font-size:2rem">${caras.map((c, i) => `<button data-a="humor" data-n="${i}" style="font-size:2.1rem;opacity:${!hm || hm.n === i ? 1 : .35}">${c}</button>`).join('')}</div>`;
  if (hm && hm.n <= 1) h += `<p>Dias difíceis fazem parte, ainda mais com pouco sono. Você não precisa passar por isso sozinha. 💛</p><div class="grade"><button class="btn sec" data-a="ir" data-tab="mae" data-sub="bruno">Chamar o ${esc(cfg.pai)}</button><a class="btn sec" href="tel:188">CVV 188</a></div><p class="mute">Se a tristeza durar mais de 2 semanas ou vierem pensamentos de se machucar, fale com a médica ou com o CVV (188, 24h, gratuito).</p>`;
  h += `</div>`;
  const ult7 = S.humor.filter(x => x.t > Date.now() - 7 * DIA).sort((a, b) => a.t - b.t);
  if (ult7.length > 1) h += `<div class="card"><h3>Últimos dias</h3><div class="linha" style="font-size:1.5rem;gap:6px">${ult7.map(x => `<span title="${data(x.t)}">${caras[x.n]}</span>`).join('')}</div></div>`;
  return h;
}
function vRemedios() {
  const l = S.rem;
  let h = `<button class="btn bloco" data-a="remNovo">${ic('plus')} Adicionar remédio/vitamina</button>`;
  if (!l.length) h += `<div class="card vazio">Cadastre os remédios da ${esc(cfg.mae)} e da ${esc(cfg.bebe)} (só os que a médica/pediatra passou). O app avisa a hora de cada dose.</div>`;
  l.forEach(r => {
    const u = ultimos(S.doses.filter(d => d.remId === r.id), 't')[0];
    let prox = '';
    if (r.modo === 'horarios') { const hs = (r.horarios || []).map(x => emHorario(0, x)).concat((r.horarios || []).map(x => emHorario(1, x))).filter(t => t > Date.now()).sort(); prox = hs[0] ? 'Próxima: ' + dataHora(hs[0]) : ''; }
    else if (u) prox = 'Próxima: ' + dataHora(u.t + (+r.h || 8) * H);
    h += `<div class="card" style="${r.ativo === false ? 'opacity:.55' : ''}"><div class="linha entre"><span><b>${esc(r.nome)}</b> <span class="tag">${r.quem === 'bebe' ? esc(cfg.bebe) : esc(cfg.mae)}</span><br><small>${esc(r.dose || '')} · ${r.modo === 'horarios' ? (r.horarios || []).join(', ') : 'a cada ' + (r.h || 8) + 'h'}</small></span>
      <button class="btn sec mini" data-a="remEditar" data-id="${r.id}">${ic('pencil')}</button></div>
      <p class="mute">${u ? 'Última dose: ' + dataHora(u.t) : 'Nenhuma dose marcada'}${prox ? ' · ' + prox : ''}</p>
      <button class="btn verde bloco" data-a="dose" data-id="${r.id}">${ic('check')} Tomou agora</button></div>`;
  });
  return h;
}
function vBruno() {
  const tel = telWa(cfg.telPai);
  if (!tel) return `<div class="card"><p>Coloque o WhatsApp do ${esc(cfg.pai)} nos ajustes para mandar pedidos com um toque.</p><button class="btn" data-a="ajustes">Abrir ajustes</button></div>`;
  return `<div class="card"><p class="mute">Toque e a mensagem abre pronta no WhatsApp do ${esc(cfg.pai)}.</p></div>
  ${C.pedidosBruno.map(m => `<button class="card" style="width:100%;text-align:left;font-weight:600" data-a="wa" data-m="${esc(m)}">${esc(m)}</button>`).join('')}
  <div class="card"><input id="waTxt" placeholder="Outra mensagem..."><button class="btn bloco" style="margin-top:8px" data-a="waLivre">Enviar</button></div>
  <a class="btn sec bloco" href="tel:+${tel}">${ic('phone')} Ligar para o ${esc(cfg.pai)}</a>`;
}
function vDicas() {
  let extra = '';
  if (cfg.tipoParto === 'cesarea') extra = `<details open><summary>Recuperação da cesárea</summary><p>Não pegue peso maior que a ${esc(cfg.bebe)} nas primeiras semanas, segure a barriga com um travesseiro ao tossir ou rir, mantenha a cicatriz limpa e seca e não dirija até a médica liberar.</p></details>`;
  if (cfg.tipoParto === 'normal') extra = `<details open><summary>Recuperação do parto normal</summary><p>Compressa fria nas primeiras 24h ajuda no inchaço. Lave a região com água após ir ao banheiro e seque sem esfregar. Se tiver pontos, eles costumam cair sozinhos.</p></details>`;
  return extra + C.dicasMae.map(([t, d]) => `<details><summary>${t}</summary><p>${d}</p></details>`).join('') +
    `<details><summary>Sangramento depois do parto</summary><p>É normal sangrar por algumas semanas, começando vermelho vivo e ficando rosado e depois amarelado. Se voltar a ficar vermelho forte, encher um absorvente em 1 hora ou tiver cheiro ruim, procure a médica.</p></details>`;
}

/* ---------------- Telas: Parto ---------------- */
function vParto() {
  const sub = V.sub.parto;
  return abas('parto') +
    ({ contr: vContr, chutes: vChutes, mala: vMala, plano: vPlano, quando: () => vAlertas(C.alertasGestacao, 'Quando ir para a maternidade'), contatos: vContatos }[sub])();
}
function statsContr() {
  const r = cfg.regra; const desde = Date.now() - r.janela * MIN;
  const l = S.contr.filter(c => c.ini >= desde).sort((a, b) => a.ini - b.ini);
  if (l.length < 2) return { l, n: l.length };
  let si = 0; for (let i = 1; i < l.length; i++) si += l[i].ini - l[i - 1].ini;
  const int = si / (l.length - 1), du = l.reduce((s, c) => s + c.fim - c.ini, 0) / l.length;
  const span = l[l.length - 1].ini - l[0].ini;
  const ok = int <= r.freq * MIN * 1.1 && du >= r.dur * 1000 * 0.9 && span >= (r.janela - r.freq * 1.5) * MIN;
  return { l, n: l.length, int, du, ok };
}
function vContr() {
  const a = S.ativo.contr; const st = statsContr(); const r = cfg.regra;
  let h = `<div class="card" style="text-align:center"><button class="circulo ${a ? 'on' : ''}" data-a="contr">${a ? `<span class="num" style="font-size:2rem" data-desde="${a}"></span><small>Toque quando PASSAR</small>` : `Começou<small>Toque quando a contração começar</small>`}</button>
  ${st.n >= 2 ? `<div class="grade3"><div><b>${st.n}</b><br><small>na última hora</small></div><div><b>${dur(st.int)}</b><br><small>de intervalo</small></div><div><b>${Math.round(st.du / 1000)} s</b><br><small>de duração</small></div></div>` : '<p class="mute">Marque o começo e o fim de cada contração.</p>'}</div>`;
  if (st.ok) h += `<div class="card alerta"><h3>Contrações regulares!</h3><p>A cada ${r.freq} min ou menos, durando ${r.dur}s ou mais, por cerca de ${r.janela} min. Hora de ligar para a maternidade/médica e se preparar para sair.</p><div class="grade"><button class="btn perigo" data-a="wa" data-m="Acho que entrei em trabalho de parto! 🚨 As contrações estão a cada ${Math.round(st.int / MIN)} min.">Avisar ${esc(cfg.pai)}</button><button class="btn sec" data-a="ir" data-tab="parto" data-sub="contatos">Contatos</button></div></div>`;
  h += `<div class="card"><p class="mute">Regra usada: a cada <b>${r.freq} min</b>, durando <b>${r.dur}s</b>, por <b>${r.janela} min</b> (dá pra mudar nos ajustes). Como é o seu 3º parto, ele pode andar mais rápido: siga o que a médica combinou com você.</p></div>`;
  const ord = S.contr.slice().sort((x, y) => y.ini - x.ini).slice(0, 25);
  if (ord.length) h += `<div class="card"><div class="linha entre"><h3>Registro</h3><button class="btn sec mini" data-a="contrLimpar">Limpar</button></div><ul class="lista">${ord.map((c, i) => { const ant = ord[i + 1]; return `<li><span><b>${hora(c.ini)}</b> · ${Math.round((c.fim - c.ini) / 1000)} s</span><small>${ant ? 'intervalo ' + crono(c.ini - ant.ini) : ''}</small></li>`; }).join('')}</ul></div>`;
  return h;
}
function vChutes() {
  const a = S.ativo.chutes;
  let h = `<div class="card"><p class="mute">Escolha um horário em que a ${esc(cfg.bebe)} costuma estar ativa (depois de comer, por exemplo), deite de lado e conte cada movimento. O normal é sentir 10 em menos de 2 horas.</p></div>`;
  if (a) {
    const passou = Date.now() - a.ini > 2 * H;
    h += `<div class="card" style="text-align:center"><button class="circulo" data-a="chute"><span style="font-size:3rem">${a.n}</span><small>de 10 · toque a cada mexida</small></button>
    <p class="mute">Contando há <span data-desde="${a.ini}"></span></p>${passou ? `<div class="card alerta"><b>Já passaram 2 horas e foram menos de 10 movimentos.</b><p>Ligue para a médica ou vá para a maternidade.</p></div>` : ''}
    <div class="grade"><button class="btn sec" data-a="chuteDesfaz">−1</button><button class="btn sec" data-a="chuteFim">Encerrar</button></div></div>`;
  } else h += `<button class="btn bloco" style="min-height:60px" data-a="chuteIni">${ic('footprints')} Começar a contar</button>`;
  h += historico(ultimos(S.chutes).slice(0, 15), c => `<span><b>${dataHora(c.ini)}</b> · ${c.n} movimentos em ${dur(c.fim - c.ini)}</span>`, 'chutes');
  return h;
}
function vMala() {
  let h = '';
  const cats = Object.assign({}, C.mala); for (const k in S.extraMala) cats[k] = (cats[k] || []).concat(S.extraMala[k]);
  for (const [cat, itens] of Object.entries(cats)) {
    const feitos = itens.filter(i => S.chk['mala:' + i]).length;
    h += `<details ${feitos < itens.length ? 'open' : ''}><summary>${esc(cat)} · ${feitos}/${itens.length}</summary>${itens.map(i => `<label class="check ${S.chk['mala:' + i] ? 'feito' : ''}"><input type="checkbox" data-chk="mala:${esc(i)}" ${S.chk['mala:' + i] ? 'checked' : ''}><span class="t">${esc(i)}</span></label>`).join('')}
    <div class="linha" style="margin-top:8px"><input placeholder="Adicionar item..." data-novo="${esc(cat)}"><button class="btn mini" data-a="malaAdd" data-cat="${esc(cat)}">+</button></div></details>`;
  }
  return h;
}
const PREF = ['Bruno comigo o tempo todo', 'Contato pele a pele logo que nascer', 'Amamentar na primeira hora', 'Esperar o cordão parar de pulsar antes de cortar', 'Bruno cortar o cordão', 'Analgesia se eu pedir', 'Luz baixa e ambiente calmo', 'Música', 'Fotos e vídeo do nascimento', 'Liberdade para me movimentar e escolher a posição', 'Bebê em alojamento conjunto comigo'];
function vPlano() {
  const p = S.plano; const pf = p.pref || [];
  return `<div class="card"><p class="mute">Leve para a maternidade e mostre para a equipe. Mostra o que vocês preferem, mas a equipe pode mudar se for preciso pela segurança de vocês duas.</p>
  <label>Maternidade</label><input data-plano="maternidade" value="${esc(p.maternidade)}"><label>Médica</label><input data-plano="medica" value="${esc(p.medica)}">
  <label>Acompanhante</label><input data-plano="acomp" value="${esc(p.acomp ?? cfg.pai)}"></div>
  <div class="card"><h3>Preferências</h3>${PREF.map(t => `<label class="check"><input type="checkbox" data-pref="${esc(t)}" ${pf.includes(t) ? 'checked' : ''}><span class="t">${esc(t)}</span></label>`).join('')}
  <label>Observações</label><textarea data-plano="obs">${esc(p.obs)}</textarea></div>
  <button class="btn bloco" data-a="planoCompartilhar">${ic('share-2')} Compartilhar / imprimir</button>`;
}
function vContatos() {
  const lista = [{ nome: cfg.pai, tel: cfg.telPai }].concat(cfg.contatos);
  return `<div class="card"><ul class="lista">${lista.map((c, i) => `<li><span><b>${esc(c.nome)}</b><br><small>${esc(c.tel) || 'sem número'}</small></span><span class="linha">${c.tel ? `<a class="btn mini" href="tel:${soDigitos(c.tel)}">${ic('phone')}</a>${soDigitos(c.tel).length > 8 ? `<a class="btn mini verde" href="https://wa.me/${telWa(c.tel)}">${ic('message-circle-heart')}</a>` : ''}` : ''}${i ? `<button class="btn sec mini" data-a="contatoEd" data-i="${i - 1}">${ic('pencil')}</button>` : ''}</span></li>`).join('')}</ul></div>
  <button class="btn sec bloco" data-a="contatoEd" data-i="-1">${ic('plus')} Novo contato</button>`;
}

/* ---------------- Telas: Mais ---------------- */
function vMais() {
  const sub = V.sub.mais;
  return abas('mais') +
    ({ docs: vDocs, consultas: vConsultas, lembretes: vLembretes, resumo: vResumo, ajustes: vAjustes }[sub] || vDocs)();
}
function vDocs() {
  return `<div class="card">${C.docs.map(([id, n, d]) => { const k = 'doc:' + id, f = S.chk[k]; return `<label class="check ${f ? 'feito' : ''}"><input type="checkbox" data-chk="${k}" ${f ? 'checked' : ''}><span><b class="t">${n}</b><br><small>${d}</small></span></label>`; }).join('')}</div>`;
}
function vLembretes() {
  const l = S.lemb.slice().sort((a, b) => a.quando - b.quando);
  return `<div class="card"><h3>Novo lembrete</h3><input id="lembTit" placeholder="Ex.: Consulta da pediatra"><label>Quando</label><input id="lembQ" type="datetime-local" value="${paraInput(Date.now() + H)}">
  <label>Observação (opcional)</label><input id="lembObs"><button class="btn bloco" style="margin-top:10px" data-a="lembAdd">Salvar lembrete</button></div>` +
  historico(l, x => `<span style="${x.quando < Date.now() ? 'opacity:.5' : ''}"><b>${esc(x.titulo)}</b><br><small>${dataHora(x.quando)}${x.obs ? ' · ' + esc(x.obs) : ''}</small></span>`, 'lemb');
}
function textoResumo() {
  const m = ult24(S.mam), f = ult24(S.fr, 't'), s = ult24(S.sono);
  const u = ultimos(S.cres, 't')[0];
  const doses = S.doses.filter(d => d.t > Date.now() - DIA).map(d => { const r = S.rem.find(x => x.id === d.remId); return r && r.quem === 'bebe' ? `${r.nome} às ${hora(d.t)}` : null; }).filter(Boolean);
  return `Resumo da ${cfg.bebe} — últimas 24h (${dataHora(Date.now())})
Idade: ${nascida() ? idadeBebe().txt : '-'}
Mamadas: ${m.length} (peito ${dur(m.reduce((a, x) => a + (x.segE || 0) + (x.segD || 0), 0))}${m.some(x => x.ml) ? ', mamadeira ' + m.reduce((a, x) => a + (+x.ml || 0), 0) + ' ml' : ''})
Fraldas: ${f.filter(x => x.xixi).length} xixi, ${f.filter(x => x.coco).length} cocô
Sono: ${dur(s.reduce((a, x) => a + x.fim - x.ini, 0))}
${cfg.pesoNasc ? 'Peso ao nascer: ' + cfg.pesoNasc + ' g\n' : ''}${u && u.g ? 'Último peso: ' + u.g + ' g em ' + data(u.t) + '\n' : ''}${doses.length ? 'Remédios: ' + doses.join(', ') + '\n' : ''}${ult24(S.temp, 't').length ? 'Temperatura: ' + ult24(S.temp, 't').map(x => String(x.c).replace('.', ',') + '°C às ' + hora(x.t)).join(', ') : ''}`.trim();
}
function vResumo() {
  return `<div class="card"><p class="mute">Bom para mostrar na consulta ou mandar para a pediatra.</p><pre style="white-space:pre-wrap;font-family:inherit;margin:0">${esc(textoResumo())}</pre></div>
  <button class="btn bloco" data-a="compartilhar" data-q="resumo">${ic('share-2')} Compartilhar</button>`;
}
function vAjustes() {
  return `<div class="card"><h3>Nomes e datas</h3>
  <div class="grade"><div><label>Mamãe</label><input data-cfg="mae" value="${esc(cfg.mae)}"></div><div><label>Bebê</label><input data-cfg="bebe" value="${esc(cfg.bebe)}"></div></div>
  <label>Data provável do parto (DPP)</label><input type="date" data-cfg="dpp" value="${esc(cfg.dpp)}">
  <label>Nome do papai</label><input data-cfg="pai" value="${esc(cfg.pai)}">
  ${nascida() ? `<label>Nascimento</label><input type="datetime-local" data-cfg="nasc" value="${esc(cfg.nasc)}"><div class="grade"><div><label>Peso ao nascer (g)</label><input type="number" data-cfg="pesoNasc" value="${esc(cfg.pesoNasc)}"></div><div><label>Comprimento (cm)</label><input type="number" data-cfg="compNasc" value="${esc(cfg.compNasc)}"></div></div>` : ''}</div>
  <div class="card"><h3>Notificações</h3><p class="mute" id="notifStatus">Verificando...</p>
  <div class="grade"><button class="btn sec" data-a="notifPedir">Permitir</button><button class="btn sec" data-a="notifTeste">Testar</button></div>
  <label class="check"><input type="checkbox" data-cfg="lembreteMamada" ${cfg.lembreteMamada ? 'checked' : ''}><span class="t">Avisar a hora da próxima mamada</span></label>
  <label>Intervalo entre mamadas (minutos, contando do início)</label><input type="number" data-cfg="intervaloMamada" value="${cfg.intervaloMamada}">
  <label>Meta de água (ml)</label><input type="number" data-cfg="metaAgua" value="${cfg.metaAgua}"></div>
  <div class="card"><h3>Alerta de contrações</h3><div class="grade3"><div><label>A cada (min)</label><input type="number" data-regra="freq" value="${cfg.regra.freq}"></div><div><label>Duração (s)</label><input type="number" data-regra="dur" value="${cfg.regra.dur}"></div><div><label>Por (min)</label><input type="number" data-regra="janela" value="${cfg.regra.janela}"></div></div></div>
  <div class="card"><h3>Foto de fundo</h3><p class="mute">Toque na imagem para escolher qualquer foto da galeria.</p>
  <label class="foto-prev" style="${fotoFundo() ? `background-image:url(${fotoFundo()});border-style:solid` : ''}">${fotoFundo() ? '' : ic('image') + ' Escolher foto'}<input type="file" accept="image/*" data-foto="1" hidden></label>
  ${fotoFundo() ? `<label>Clareza da foto (mais à direita = foto mais apagada, texto mais fácil de ler)</label><input type="range" min="0.15" max="0.9" step="0.05" value="${cfg.veu ?? 0.55}" data-in="veu"><button class="btn sec bloco" style="margin-top:10px" data-a="fotoTirar">Ficar sem foto de fundo</button>` : ''}${fotoPropria() || cfg.semFundo ? `<button class="btn sec bloco" style="margin-top:8px" data-a="fotoMaya">Usar a ilustração da ${esc(cfg.bebe)}</button>` : ''}</div>
  <div class="card"><h3>Aparência</h3><div class="chips">${[['auto', 'Automático'], ['claro', 'Claro'], ['noite', 'Noturno']].map(([k, n]) => `<button class="chip ${cfg.tema === k ? 'on' : ''}" data-a="tema" data-t="${k}">${n}</button>`).join('')}</div><p class="mute">No automático, fica escuro das 19h às 6h para não ofuscar nas mamadas da madrugada.</p></div>
  <div class="card"><h3>Backup</h3><p class="mute">Os dados ficam só neste celular. Faça um backup de vez em quando (manda pro WhatsApp do ${esc(cfg.pai)}, por exemplo).</p>
  <div class="grade"><button class="btn sec" data-a="compartilhar" data-q="backup">${ic('share-2')} Exportar</button><button class="btn sec" data-a="importar">${ic('plus')} Importar</button></div>
  ${nascida() ? '<button class="btn sec bloco" style="margin-top:10px" data-a="desfazNasc">Voltar para o modo gestação</button>' : ''}
  <button class="btn perigo bloco" style="margin-top:10px" data-a="zerar">Apagar todos os dados</button></div>
  <div class="card"><div class="linha entre"><span><h3>Versão ${VERSAO || 'de teste'}</h3><small>${PRONTA ? 'Versão ' + PRONTA.versao + ' pronta para instalar' : 'O app se atualiza sozinho quando tem internet'}</small>${ERRO_ATUALIZ ? `<br><small style="color:var(--alerta)">${esc(ERRO_ATUALIZ)}</small>` : ''}</span><button class="btn sec mini" data-a="${PRONTA ? 'aplicarAtualiz' : 'buscarAtualiz'}">${PRONTA ? 'Atualizar' : 'Procurar'}</button></div></div>
  <p class="mute" style="text-align:center;padding:10px" data-a="cantinho">Feito com amor pelo ${esc(cfg.pai)} 💛</p>`;
}

/* ---------------- Ações ---------------- */
const A = {
  ir: el => ir(el.dataset.tab, el.dataset.sub),
  sub: el => { const L = SUBS[el.dataset.tab]().map(x => x[0]); ANIM = L.indexOf(el.dataset.sub) > L.indexOf(V.sub[el.dataset.tab]) ? 'da-direita' : 'da-esquerda'; V.sub[el.dataset.tab] = el.dataset.sub; render(); },
  ajustes: () => ir('mais', 'ajustes'),
  apagar: el => { if (!confirm('Apagar este registro?')) return; S[el.dataset.col] = S[el.dataset.col].filter(x => x.id !== el.dataset.id); salvar(); render(); },
  // Mamadas
  mIni: el => { S.ativo.mamada = { ini: Date.now(), lado: el.dataset.l, ladoIni: el.dataset.l, desde: Date.now(), segE: 0, segD: 0 }; vibrar(); salvar(); render(); },
  mLado: el => { const a = S.ativo.mamada; const l = el.dataset.l; if (a.lado === l) return; acumula(a); a.lado = l; a.desde = Date.now(); vibrar(); salvar(); render(); },
  mPausa: () => { const a = S.ativo.mamada; if (a.desde) { acumula(a); a.desde = null; } else a.desde = Date.now(); salvar(); render(); },
  mFim: () => { const a = S.ativo.mamada; acumula(a); S.mam.push({ id: uid(), tipo: 'peito', ini: a.ini, fim: Date.now(), segE: a.segE, segD: a.segD, ladoIni: a.ladoIni, ladoFim: a.lado }); delete S.ativo.mamada; salvar(); render(); toast(cfg.lembreteMamada ? `Salvo! Aviso às ${hora(a.ini + cfg.intervaloMamada * MIN)} 🍼` : 'Mamada salva 🍼'); },
  mCancelar: () => { if (confirm('Cancelar esta mamada sem salvar?')) { delete S.ativo.mamada; salvar(); render(); } },
  mManual: el => {
    const mam = el.dataset.t === 'mamadeira';
    modal(`<h2>${mam ? 'Mamadeira' : 'Anotar mamada'}</h2><label>Começou</label><input id="fIni" type="datetime-local" value="${paraInput(Date.now() - 20 * MIN)}">
    ${mam ? `<label>Quantidade (ml)</label><input id="fMl" type="number" inputmode="numeric" placeholder="60">` : `<div class="grade"><div><label>Esquerdo (min)</label><input id="fE" type="number" inputmode="numeric" value="10"></div><div><label>Direito (min)</label><input id="fD" type="number" inputmode="numeric" value="10"></div></div><label>Terminou no lado</label><select id="fLado"><option value="D">Direito</option><option value="E">Esquerdo</option></select>`}
    <button class="btn bloco" style="margin-top:14px" data-a="mManualSalvar" data-t="${el.dataset.t}">Salvar</button>`);
  },
  mManualSalvar: el => {
    const ini = deInput($('#fIni').value);
    if (el.dataset.t === 'mamadeira') S.mam.push({ id: uid(), tipo: 'mamadeira', ini, fim: ini + 15 * MIN, ml: +$('#fMl').value || 0 });
    else { const e = (+$('#fE').value || 0) * MIN, d = (+$('#fD').value || 0) * MIN; S.mam.push({ id: uid(), tipo: 'peito', ini, fim: ini + e + d, segE: e, segD: d, ladoFim: $('#fLado').value }); }
    salvar(); fecharModal(); render(); toast('Mamada anotada 🍼');
  },
  // Fraldas / sono
  fralda: el => { const r = { id: uid(), t: Date.now(), xixi: el.dataset.x === '1', coco: el.dataset.c === '1' }; S.fr.push(r); vibrar(); salvar(); render(); toast((r.xixi ? '💧' : '') + (r.coco ? '💩' : '') + ' anotado'); },
  sono: () => { if (S.ativo.sono) { S.sono.push({ id: uid(), ini: S.ativo.sono, fim: Date.now() }); toast(`Dormiu ${dur(Date.now() - S.ativo.sono)} ☀️`); delete S.ativo.sono; } else { S.ativo.sono = Date.now(); toast('Bons sonhos, ' + cfg.bebe + ' 😴'); } vibrar(); salvar(); render(); },
  // Som
  som: el => tocar(el.dataset.t), somParar: () => { pararSom(); render(); },
  somTimer: el => { const m = +el.dataset.m; clearTimeout(Som.t); Som.fimEm = 0; if (m) { Som.fimEm = Date.now() + m * MIN; Som.t = setTimeout(() => { pararSom(); if (V.tab === 'maya') render(); }, m * MIN); } render(); },
  // Crescimento
  cresNovo: () => modal(`<h2>📏 Peso e medidas</h2><label>Data</label><input id="cD" type="date" value="${paraInput(Date.now()).slice(0, 10)}"><label>Peso (gramas)</label><input id="cG" type="number" inputmode="numeric" placeholder="3250"><div class="grade"><div><label>Comprimento (cm)</label><input id="cCm" type="number" inputmode="decimal"></div><div><label>Perímetro cefálico (cm)</label><input id="cPc" type="number" inputmode="decimal"></div></div><button class="btn bloco" style="margin-top:14px" data-a="cresSalvar">Salvar</button>`),
  cresSalvar: () => { S.cres.push({ id: uid(), t: dataLocal($('#cD').value) || Date.now(), g: +$('#cG').value || 0, cm: $('#cCm').value, pc: $('#cPc').value }); salvar(); fecharModal(); render(); },
  // Marcos
  marcoSug: el => { $('#marcoTxt').value = el.dataset.t; $$('[data-a=marcoSug]').forEach(c => c.classList.toggle('on', c === el)); },
  marcoAdd: () => { const t = $('#marcoTxt').value.trim(); if (!t) return toast('Escreva qual foi o momento'); S.marcos.push({ id: uid(), t: dataLocal($('#marcoData').value) || Date.now(), texto: t, nota: $('#marcoNota').value.trim(), midias: RASCUNHO }); RASCUNHO = []; salvar(); render(); toast('Momento guardado 💛'); },
  marcoVer: el => abrirMarco(el.dataset.id),
  marcoApagar: async el => { if (!confirm('Apagar este momento e as fotos dele?')) return; const m = S.marcos.find(x => x.id === el.dataset.id); for (const x of (m.midias || [])) { try { await MDB.del(x.k); } catch {} } S.marcos = S.marcos.filter(x => x.id !== m.id); salvar(); fecharModal(); render(); },
  midiaSalvar: el => salvarMidia(el.dataset.k, el.dataset.tipo),
  filme: el => { fecharModal(); abrirFilme(el.dataset.id, +(el.dataset.i || 0)); },
  // Mãe
  agua: el => { S.agua.push({ id: uid(), t: Date.now(), ml: +el.dataset.ml }); vibrar(); salvar(); render(); },
  humor: el => { S.humor = S.humor.filter(x => !mesmoDia(x.t, Date.now())); S.humor.push({ id: uid(), t: Date.now(), n: +el.dataset.n }); salvar(); render(); },
  remNovo: () => formRem({}), remEditar: el => formRem(S.rem.find(r => r.id === el.dataset.id)),
  remModo: el => { $('#rmH').hidden = el.value === 'horarios'; $('#rmHs').hidden = el.value !== 'horarios'; },
  remSalvar: el => {
    const id = el.dataset.id; const r = id ? S.rem.find(x => x.id === id) : { id: uid() };
    Object.assign(r, { nome: $('#rmNome').value.trim() || 'Remédio', quem: $('#rmQuem').value, dose: $('#rmDose').value.trim(), modo: $('#rmModo').value, h: +$('#rmHv').value || 8, horarios: $('#rmHsv').value.split(/[,\s]+/).map(s => s.trim()).filter(s => /^\d{1,2}:\d{2}$/.test(s)).map(s => s.padStart(5, '0')), ativo: $('#rmAtivo').checked });
    if (!id) S.rem.push(r); salvar(); fecharModal(); render();
  },
  remApagar: el => { if (!confirm('Apagar este remédio?')) return; S.rem = S.rem.filter(r => r.id !== el.dataset.id); S.doses = S.doses.filter(d => d.remId !== el.dataset.id); salvar(); fecharModal(); render(); },
  dose: el => { const r = S.rem.find(x => x.id === el.dataset.id); S.doses.push({ id: uid(), remId: r.id, t: Date.now() }); vibrar(); salvar(); render(); toast(r.modo === 'horarios' ? 'Dose marcada ✅' : `Dose marcada ✅ Próxima às ${hora(Date.now() + (+r.h || 8) * H)}`); },
  wa: el => abrirWa(el.dataset.m), waLivre: () => { const t = $('#waTxt').value.trim(); if (t) abrirWa(t); },
  // Parto
  contr: () => {
    if (S.ativo.contr) { S.contr.push({ id: uid(), ini: S.ativo.contr, fim: Date.now() }); delete S.ativo.contr; const st = statsContr(); if (st.ok && (!S.ativo.alertou || Date.now() - S.ativo.alertou > H)) { S.ativo.alertou = Date.now(); N.agora('🚨 Contrações regulares', 'Hora de ligar para a maternidade e avisar o ' + cfg.pai + '.', 'parto', 'contr'); vibrar([300, 150, 300]); } }
    else S.ativo.contr = Date.now();
    vibrar(); salvar(); render();
  },
  contrLimpar: () => { if (confirm('Apagar o registro de contrações?')) { S.contr = []; delete S.ativo.contr; delete S.ativo.alertou; salvar(); render(); } },
  chuteIni: () => { S.ativo.chutes = { ini: Date.now(), n: 0 }; salvar(); render(); },
  chute: () => { const a = S.ativo.chutes; a.n++; vibrar(40); if (a.n >= 10) { S.chutes.push({ id: uid(), ini: a.ini, fim: Date.now(), n: a.n }); delete S.ativo.chutes; toast(`10 movimentos em ${dur(Date.now() - a.ini)} 💛`, 4000); } salvar(); render(); },
  chuteDesfaz: () => { const a = S.ativo.chutes; if (a.n > 0) a.n--; salvar(); render(); },
  chuteFim: () => { const a = S.ativo.chutes; if (a.n) S.chutes.push({ id: uid(), ini: a.ini, fim: Date.now(), n: a.n }); delete S.ativo.chutes; salvar(); render(); },
  malaAdd: el => { const cat = el.dataset.cat; const inp = $$('[data-novo]').find(i => i.dataset.novo === cat); const v = inp.value.trim(); if (!v) return; (S.extraMala[cat] = S.extraMala[cat] || []).push(v); salvar(); render(); },
  planoCompartilhar: () => { const p = S.plano; compartilhar(`PLANO DE PARTO — ${cfg.mae}\nBebê: ${cfg.bebe}\nMaternidade: ${p.maternidade || '-'}\nMédica: ${p.medica || '-'}\nAcompanhante: ${p.acomp ?? cfg.pai}\n\nPreferências:\n${(p.pref || []).map(x => '• ' + x).join('\n') || '-'}\n${p.obs ? '\nObservações:\n' + p.obs : ''}`); },
  contatoEd: el => { const i = +el.dataset.i; const c = cfg.contatos[i] || { nome: '', tel: '' };
    modal(`<h2>${i < 0 ? 'Novo contato' : 'Editar contato'}</h2><label>Nome</label><input id="ctN" value="${esc(c.nome)}"><label>Telefone</label><input id="ctT" type="tel" value="${esc(c.tel)}"><button class="btn bloco" style="margin-top:14px" data-a="contatoSalvar" data-i="${i}">Salvar</button>${i >= 0 ? `<button class="btn perigo bloco" style="margin-top:8px" data-a="contatoApagar" data-i="${i}">Apagar</button>` : ''}`); },
  contatoSalvar: el => { const i = +el.dataset.i; const c = { nome: $('#ctN').value.trim() || 'Contato', tel: $('#ctT').value.trim() }; if (i < 0) cfg.contatos.push(c); else cfg.contatos[i] = c; salvar(); fecharModal(); render(); },
  contatoApagar: el => { cfg.contatos.splice(+el.dataset.i, 1); salvar(); fecharModal(); render(); },
  // Mais
  lembAdd: () => { const t = $('#lembTit').value.trim(); if (!t) return toast('Escreva o lembrete'); S.lemb.push({ id: uid(), titulo: t, quando: deInput($('#lembQ').value), obs: $('#lembObs').value.trim() }); salvar(); render(); toast('Lembrete salvo ⏰'); },
  compartilhar: el => compartilhar(el.dataset.q === 'backup' ? JSON.stringify(S) : textoResumo(), el.dataset.q === 'backup'),
  importar: () => modal(`<h2>${ic('plus')} Importar backup</h2><p class="mute">Cole aqui o texto do backup. Isso substitui os dados atuais.</p><textarea id="impTxt" style="min-height:200px"></textarea><button class="btn bloco" style="margin-top:12px" data-a="importarOk">Importar</button>`),
  importarOk: () => { try { const d = JSON.parse($('#impTxt').value); if (!d.cfg) throw 0; localStorage.setItem(LS, JSON.stringify(d)); location.reload(); } catch { toast('Backup inválido'); } },
  zerar: () => { if (confirm('Apagar TUDO? Isso não tem volta.') && confirm('Tem certeza mesmo?')) { localStorage.removeItem(LS); location.reload(); } },
  buscarAtualiz: () => procurarAtualizacao(true),
  aplicarAtualiz: () => { if (PRONTA && UPD) { toast('Atualizando...'); localStorage.setItem(LS, JSON.stringify(S)); UPD.set({ id: PRONTA.id }); } },
  outroRecado: () => { const r = recadosTodos(); if (r.length < 2) return; let i; do { i = Math.floor(Math.random() * r.length); } while (i === RECADO_I); RECADO_I = i; vibrar(15); render(); },
  cantinho: () => {
    A.cantinho.n = (Date.now() - (A.cantinho.t || 0) < 1500 ? (A.cantinho.n || 0) : 0) + 1; A.cantinho.t = Date.now();
    if (A.cantinho.n < 5) return;
    A.cantinho.n = 0;
    modal(`<h2>Cantinho do ${esc(cfg.pai)} 🤫</h2><p class="mute">Só você sabe que isso existe. Os recados escritos aqui entram junto com os ${C.recados.length} recados que já vêm no app.</p>
    <label>Seus recados (um por linha)</label><textarea data-cfg="recadosBruno" style="min-height:200px" placeholder="Escreva um recado por linha">${esc((cfg.recadosBruno || []).join('\n'))}</textarea>
    <label class="check"><input type="checkbox" data-cfg="recadoDiario" ${cfg.recadoDiario ? 'checked' : ''}><span class="t">Mandar um recado como notificação todo dia às 10h</span></label>
    <button class="btn bloco" style="margin-top:12px" data-a="fecharCantinho">Pronto</button>`);
  },
  fecharCantinho: () => { fecharModal(); toast('Recados salvos 💛'); sortearRecado(); render(); },
  vacReg: el => {
    const { g, d } = achaDose(el.dataset.d); const r = S.vac[d[0]];
    const ultLocal = Object.values(S.vac).sort((a, b) => b.t - a.t).map(x => x.local).find(Boolean) || '';
    modal(`<div class="rotulo">${g[2]}</div><h2 style="margin-top:4px">${d[1]}</h2><p class="mute" style="margin-top:-6px">${d[2]} · previne ${d[3].toLowerCase()}</p>
      <label>Data em que tomou</label><input id="vD" type="date" value="${paraInput(r ? r.t : Date.now()).slice(0, 10)}">
      <div class="grade"><div><label>Lote (opcional)</label><input id="vL" value="${esc(r && r.lote)}"></div><div><label>Onde (opcional)</label><input id="vP" value="${esc(r ? r.local : ultLocal)}" placeholder="UBS..."></div></div>
      <button class="btn bloco" style="margin-top:14px" data-a="vacSalvar" data-d="${d[0]}">${ic('check')} ${r ? 'Salvar' : 'Registrar como aplicada'}</button>
      ${r ? `<button class="btn sec bloco" style="margin-top:8px" data-a="vacTirar" data-d="${d[0]}">Desmarcar</button>` : ''}`);
  },
  vacSalvar: el => { S.vac[el.dataset.d] = { t: dataLocal($('#vD').value) || Date.now(), lote: $('#vL').value.trim(), local: $('#vP').value.trim() }; salvar(); fecharModal(); render(); vibrar(40); toast('Vacina registrada 💉💛'); },
  vacTirar: el => { delete S.vac[el.dataset.d]; salvar(); fecharModal(); render(); },
  vacTodas: el => { const g = C.vacinas.find(x => x[0] === el.dataset.g); const ultLocal = Object.values(S.vac).sort((a, b) => b.t - a.t).map(x => x.local).find(Boolean) || ''; g[3].forEach(d => { if (!S.vac[d[0]]) S.vac[d[0]] = { t: Date.now(), lote: '', local: ultLocal }; }); salvar(); render(); vibrar(40); toast('Vacinas registradas 💉💛'); },
  tempAdd: () => { const c = parseFloat(String($('#tempV').value).replace(',', '.')); if (!(c > 30 && c < 45)) return toast('Digite a temperatura, ex.: 36,8'); S.temp.push({ id: uid(), t: Date.now(), c: Math.round(c * 10) / 10, nota: $('#tempN').value.trim() }); salvar(); render(); const [cor] = classTemp(c); if (cor === 'alerta') vibrar([200, 100, 200]); },
  consNova: () => formConsulta({ quem: nascida() ? 'bebe' : 'mae', titulo: nascida() ? 'Pediatra' : 'Obstetra' }),
  consEd: el => formConsulta(S.consultas.find(c => c.id === el.dataset.id)),
  consSalvar: el => { const id = el.dataset.id; const c = id ? S.consultas.find(x => x.id === id) : { id: uid() }; Object.assign(c, { quem: $('#cQ').value, titulo: $('#cT').value.trim() || 'Consulta', quando: deInput($('#cW').value), local: $('#cL').value.trim(), notas: $('#cN').value.trim() }); if (!id) S.consultas.push(c); salvar(); fecharModal(); render(); toast(id ? 'Salvo' : 'Consulta marcada 🩺'); },
  consApagar: el => { if (!confirm('Apagar esta consulta?')) return; S.consultas = S.consultas.filter(c => c.id !== el.dataset.id); salvar(); fecharModal(); render(); },
  pergAdd: el => { const inp = $$('[data-novaperg]').find(i => i.dataset.novaperg === el.dataset.q); const t = inp.value.trim(); if (!t) return; S.perguntas.push({ id: uid(), quem: el.dataset.q, texto: t, feita: false }); salvar(); render(); },
  pergApagar: el => { S.perguntas = S.perguntas.filter(p => p.id !== el.dataset.id); salvar(); render(); },
  luz: () => { $('#luz').hidden = false; },
  fotoTirar: () => { if (fotoPropria()) localStorage.removeItem('maira:fundo'); else cfg.semFundo = true; salvar(); render(); },
  fotoMaya: () => { localStorage.removeItem('maira:fundo'); cfg.semFundo = false; salvar(); render(); },
  tema: el => { cfg.tema = el.dataset.t; salvar(); render(); },
  notifPedir: async () => { const ok = await N.pedir(); toast(ok ? 'Notificações ativadas 🔔' : 'Permissão negada: libere nas configurações do Android'); render(); },
  notifTeste: async () => { await N.pedir(); await N.agora('Oi, ' + cfg.mae + '! 💛', 'As notificações estão funcionando.', 'inicio'); toast('Enviada!'); },
  // Nascimento
  nasceu: () => modal(`<h2>🎉 A ${esc(cfg.bebe)} nasceu!</h2><label>Data e hora</label><input id="nH" type="datetime-local" value="${paraInput(Date.now())}">
    <div class="grade"><div><label>Peso (g)</label><input id="nP" type="number" inputmode="numeric" placeholder="3200"></div><div><label>Comprimento (cm)</label><input id="nC" type="number" inputmode="decimal" placeholder="49"></div></div>
    <label>Parto</label><select id="nT"><option value="normal">Normal</option><option value="cesarea">Cesárea</option></select>
    <button class="btn bloco" style="margin-top:14px" data-a="nasceuOk">Salvar 💛</button>`),
  nasceuOk: () => {
    cfg.nasc = $('#nH').value || paraInput(Date.now()); cfg.pesoNasc = $('#nP').value; cfg.compNasc = $('#nC').value; cfg.tipoParto = $('#nT').value;
    if (cfg.pesoNasc) S.cres.push({ id: uid(), t: +new Date(cfg.nasc), g: +cfg.pesoNasc, cm: cfg.compNasc });
    delete S.ativo.contr; delete S.ativo.chutes; V.sub.maya = 'mamadas'; salvar(); fecharModal(); N.pedir(); ir('inicio'); toast(`Bem-vinda ao mundo, ${cfg.bebe}! 💛`, 5000);
  },
  desfazNasc: () => { if (confirm('Voltar para o modo gestação?')) { cfg.nasc = ''; salvar(); render(); } },
  // Boas-vindas
  inicioOk: async () => { cfg.dpp = $('#bvDpp').value; cfg.iniciado = true; salvar(); fecharModal(); render(); await N.pedir(); agendarDepois(); },
};
function carregarFoto(f) {
  const url = URL.createObjectURL(f); const im = new Image();
  im.onload = () => {
    const max = 1280, k = Math.min(1, max / Math.max(im.width, im.height));
    const c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
    c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
    try { localStorage.setItem('maira:fundo', c.toDataURL('image/jpeg', 0.82)); cfg.semFundo = false; salvar(); toast('Foto de fundo aplicada ✨'); } catch { toast('Foto muito grande, tente outra'); }
    render();
  };
  im.onerror = () => toast('Não consegui abrir essa foto');
  im.src = url;
}
function acumula(a) { if (a.desde) { a['seg' + a.lado] += Date.now() - a.desde; a.desde = Date.now(); } }
function abrirWa(msg) { const t = telWa(cfg.telPai); if (!t) return ir('mais', 'ajustes'); location.href = `https://wa.me/${t}?text=${encodeURIComponent(msg)}`; }
async function compartilhar(texto, arquivo) {
  const SH = plugin('Share');
  try { if (SH) return await SH.share({ title: arquivo ? 'Backup' : cfg.bebe, text: texto }); } catch {}
  try { if (navigator.share) return await navigator.share({ text: texto }); } catch {}
  try { await navigator.clipboard.writeText(texto); return toast('Copiado! Cole no WhatsApp 📋'); } catch {}
  modal(`<h2>Copie o texto</h2><textarea style="min-height:240px">${esc(texto)}</textarea>`);
}
function formRem(r) {
  const hs = r.modo === 'horarios';
  modal(`<h2>💊 ${r.id ? 'Editar' : 'Novo'} remédio</h2>
  <label>Nome</label><input id="rmNome" value="${esc(r.nome)}" placeholder="Ex.: Vitamina D, Sulfato ferroso">
  <div class="grade"><div><label>Para</label><select id="rmQuem"><option value="mae">${esc(cfg.mae)}</option><option value="bebe" ${r.quem === 'bebe' ? 'selected' : ''}>${esc(cfg.bebe)}</option></select></div>
  <div><label>Dose</label><input id="rmDose" value="${esc(r.dose)}" placeholder="2 gotas"></div></div>
  <label>Como lembrar</label><select id="rmModo" data-ch="remModo"><option value="intervalo">A cada X horas (depois de marcar a dose)</option><option value="horarios" ${hs ? 'selected' : ''}>Em horários fixos todo dia</option></select>
  <div id="rmH" ${hs ? 'hidden' : ''}><label>A cada quantas horas</label><input id="rmHv" type="number" value="${r.h || 8}"></div>
  <div id="rmHs" ${hs ? '' : 'hidden'}><label>Horários (separados por vírgula)</label><input id="rmHsv" value="${esc((r.horarios || ['08:00']).join(', '))}" placeholder="08:00, 20:00"></div>
  <label class="check" style="border:0"><input type="checkbox" id="rmAtivo" ${r.ativo !== false ? 'checked' : ''}><span class="t">Lembretes ligados</span></label>
  <button class="btn bloco" data-a="remSalvar" data-id="${r.id || ''}">Salvar</button>
  ${r.id ? `<button class="btn perigo bloco" style="margin-top:8px" data-a="remApagar" data-id="${r.id}">Apagar</button>` : ''}`);
}

/* Delegação de eventos */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return;
  const f = A[el.dataset.a]; if (f) { e.preventDefault(); f(el); }
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.chk) { S.chk[el.dataset.chk] = el.checked ? Date.now() : false; salvar(); render(); }
  else if (el.dataset.perg) { const p = S.perguntas.find(x => x.id === el.dataset.perg); p.feita = el.checked; salvar(); render(); }
  else if (el.dataset.pref) { const p = S.plano.pref = S.plano.pref || []; const t = el.dataset.pref; if (el.checked) p.push(t); else p.splice(p.indexOf(t), 1); salvar(); }
  else if (el.dataset.cfg) {
    const k = el.dataset.cfg;
    if (el.type === 'checkbox') cfg[k] = el.checked;
    else if (k === 'recadosBruno') cfg[k] = el.value.split('\n').map(s => s.trim()).filter(Boolean);
    else if (el.type === 'number' && ['intervaloMamada', 'metaAgua'].includes(k)) cfg[k] = +el.value || cfg[k];
    else cfg[k] = el.value;
    salvar(); if (k !== 'recadosBruno') render();
  }
  else if (el.dataset.regra) { cfg.regra[el.dataset.regra] = +el.value || cfg.regra[el.dataset.regra]; salvar(); }
  else if (el.dataset.ch) A[el.dataset.ch](el);
  else if (el.dataset.foto && el.files[0]) carregarFoto(el.files[0]);
  else if (el.dataset.midia && el.files.length) {
    const alvo = el.dataset.midia; const files = [...el.files]; el.value = ''; toast('Guardando ' + files.length + (files.length === 1 ? ' arquivo...' : ' arquivos...'), 8000);
    processarArquivos(files).then(novos => {
      if (alvo === 'novo') { const txt = $('#marcoTxt') && $('#marcoTxt').value, nota = $('#marcoNota') && $('#marcoNota').value; RASCUNHO = RASCUNHO.concat(novos); render(); if ($('#marcoTxt')) { $('#marcoTxt').value = txt || ''; $('#marcoNota').value = nota || ''; } }
      else { const m = S.marcos.find(x => x.id === alvo); m.midias = (m.midias || []).concat(novos); salvar(); render(); abrirMarco(alvo); }
      toast('Pronto 💛');
    });
  }
});
document.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.plano) { S.plano[el.dataset.plano] = el.value; localStorage.setItem(LS, JSON.stringify(S)); }
  if (el.dataset.in === 'veu') { cfg.veu = +el.value; document.documentElement.style.setProperty('--veu', cfg.veu); localStorage.setItem(LS, JSON.stringify(S)); }
  if (el.dataset.in === 'vol') { S.vol = +el.value; if (Som.gain) Som.gain.gain.value = S.vol; localStorage.setItem(LS, JSON.stringify(S)); }
});

/* Deslizar para os lados troca de aba */
function deslizar(d) {
  const lista = SUBS[V.tab] ? SUBS[V.tab]().map(x => x[0]) : [];
  const i = lista.indexOf(V.sub[V.tab]);
  if (lista.length && i + d >= 0 && i + d < lista.length) V.sub[V.tab] = lista[i + d];
  else {
    const t = TABS.indexOf(V.tab) + d; if (t < 0 || t >= TABS.length) return;
    V.tab = TABS[t]; const nl = SUBS[V.tab] ? SUBS[V.tab]().map(x => x[0]) : [];
    if (nl.length) V.sub[V.tab] = d > 0 ? nl[0] : nl[nl.length - 1];
  }
  ANIM = d > 0 ? 'da-direita' : 'da-esquerda'; vibrar(8); render(); window.scrollTo(0, 0);
  try { localStorage.setItem('maira:dicaSwipe', '1'); } catch {}
}
(() => {
  let sx = 0, sy = 0, st = 0, ok = false;
  const vw = $('#view');
  vw.addEventListener('touchstart', e => { const t = e.touches[0]; ok = e.touches.length === 1 && !e.target.closest('.abas,.chips,.strip,input,textarea,select,[data-noswipe]'); sx = t.clientX; sy = t.clientY; st = Date.now(); }, { passive: true });
  vw.addEventListener('touchend', e => {
    if (!ok) return; const t = e.changedTouches[0]; const dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.7 || Date.now() - st > 800) return;
    deslizar(dx < 0 ? 1 : -1);
  }, { passive: true });
})();

/* Enter nos campos de adicionar */
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return; const el = e.target;
  if (el.matches('[data-novaperg],[data-novo],#waTxt,#marcoTxt,#tempV')) { e.preventDefault(); const b = el.parentElement.querySelector('button[data-a]') || (el.id === 'tempV' && $('[data-a=tempAdd]')); if (b) b.click(); }
});

/* Relógio da tela */
function tick() {
  const now = Date.now();
  $$('[data-desde]').forEach(el => el.textContent = crono(now - +el.dataset.desde + (+el.dataset.base || 0)));
  $$('[data-rel]').forEach(el => el.textContent = rel(+el.dataset.rel));
}
setInterval(tick, 1000);
setInterval(() => { if ($('#modal').hidden && !document.activeElement.matches('input,textarea,select')) render(); }, 60e3);
let escondidoEm = 0;
document.addEventListener('visibilitychange', () => { if (document.hidden) escondidoEm = Date.now(); if (!document.hidden) { if (escondidoEm && Date.now() - escondidoEm > 3 * MIN) sortearRecado(); render(); agendarDepois(); procurarAtualizacao(); } });

/* Luz noturna */
$('#btnTema').addEventListener('click', () => { cfg.tema = document.documentElement.classList.contains('noite') ? 'claro' : 'noite'; salvar(); render(); toast(cfg.tema === 'noite' ? 'Tema escuro' : 'Tema claro'); });
$$('#nav button').forEach(b => b.insertAdjacentHTML('afterbegin', `<i>${ic(b.dataset.ic)}</i>`));
(() => { const im = new Image(); im.onload = () => { ILUS = im.src; render(); }; im.src = 'img/maya.jpg'; })();
$('#luz').addEventListener('click', () => { $('#luz').hidden = true; });

/* Botão voltar do Android */
const APP = plugin('App');
if (APP) APP.addListener('backButton', () => {
  if ($('#filme')) return fecharFilme();
  if (!$('#luz').hidden) return $('#luz').hidden = true;
  if (!$('#modal').hidden) return fecharModal();
  if (V.tab !== 'inicio') return ir('inicio');
  APP.minimizeApp();
});

/* Status das notificações nos ajustes */
const obs = new MutationObserver(async () => { const el = $('#notifStatus'); if (el && el.dataset.ok !== '1') { el.dataset.ok = '1'; const s = await N.status(); el.textContent = s === 'granted' ? '✅ Ativadas' + (NATIVO ? '' : ' (navegador: só avisa com o app aberto)') : '⚠️ Não ativadas: toque em Permitir'; } });
obs.observe($('#view'), { childList: true });

/* Início */
N.iniciar().then(agendarDepois);
if (!NATIVO && 'serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
render();
setTimeout(() => procurarAtualizacao(), 3000);
try { if (cfg.iniciado && !localStorage.getItem('maira:dicaSwipe')) { localStorage.setItem('maira:dicaSwipe', '1'); setTimeout(() => toast('Dica: deslize o dedo para os lados para trocar de aba 👉', 5000), 5500); } } catch {}
try { const vv = +localStorage.getItem('maira:versaoVista') || 0; if (VERSAO && vv && VERSAO > vv) setTimeout(() => toast(`App atualizado para a versão ${VERSAO} ✨`, 4000), 800); if (VERSAO) localStorage.setItem('maira:versaoVista', VERSAO); } catch {}
function boasVindas() {
  modal(`${ILUS ? `<img class="bv-ilus" src="${ILUS}" alt="">` : ''}<h2 style="font-size:1.6rem;margin-bottom:6px">Oi, ${esc(cfg.mae)}! 💛</h2>
  <p>O ${esc(cfg.pai)} fez esse app só pra você e pra ${esc(cfg.bebe)}: contrações, mala da maternidade, mamadas, fraldas, remédios, vacinas, momentos e muito mais.</p>
  <label>Quando a ${esc(cfg.bebe)} deve chegar? (data provável do parto)</label><input id="bvDpp" type="date" value="${esc(cfg.dpp)}">
  <p class="mute" style="font-size:.9rem">Depois de tocar em Começar, permita as notificações para receber os lembretes.</p>
  <button class="btn bloco" style="margin-top:8px" data-a="inicioOk">Começar</button>`, true);
}
if (!cfg.iniciado) { boasVindas(); const im = new Image(); im.onload = () => { ILUS = im.src; if (!cfg.iniciado && !$('#modal').hidden) { const v = $('#bvDpp').value; boasVindas(); $('#bvDpp').value = v; } }; im.src = 'img/maya.jpg'; }
})();
