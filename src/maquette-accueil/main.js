document.documentElement.classList.add('js');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Menu mobile
const nav = document.querySelector('.nav');
const burger = document.querySelector('.nav__burger');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', open);
});

// Onglets accessibles (dossier de cas, anneau des témoignages) : clic + flèches
document.querySelectorAll('[role="tablist"]').forEach(list => {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const select = tab => tabs.forEach(t => {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    if (on && t.dataset.big) {
      document.querySelector('[data-orbit-big]').textContent = t.dataset.big;
      document.querySelector('[data-orbit-small]').textContent = t.dataset.small;
    }
  });
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', e => {
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      const next = tabs[(i + step + tabs.length) % tabs.length];
      select(next);
      next.focus();
    });
  });
});

// Carrières : fourchettes de salaire placées sur une échelle commune (k€)
const chart = document.querySelector('[data-chart]');
const min = +chart.dataset.min, max = +chart.dataset.max;
const pct = v => ((v - min) / (max - min)) * 100;
const axis = chart.querySelector('.chart__axis');
for (let v = 40; v <= 100; v += 20) {
  const tick = document.createElement('span');
  tick.textContent = `${v} k€`;
  tick.style.left = `${pct(v)}%`;
  axis.append(tick);
}
chart.querySelectorAll('.job').forEach((job, row) => {
  const bar = job.querySelector('.job__bar');
  [['start', job.dataset.start], ['five', job.dataset.five]].forEach(([kind, range], k) => {
    const [lo, hi] = range.split(' ').map(Number);
    const el = document.createElement('span');
    el.className = `range range--${kind}`;
    el.style.left = `${pct(lo)}%`;
    el.style.width = `${pct(hi) - pct(lo)}%`;
    el.style.setProperty('--d', `${row * 0.08 + k * 0.25}s`);
    el.innerHTML = `<span class="range__label">${lo}-${hi} k€</span>`;
    bar.append(el);
  });
});

// Apparitions à l'entrée dans l'écran (IntersectionObserver), avec failsafe à 6 s
const revealables = [...document.querySelectorAll('[data-reveal], [data-chart]')];
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}), { threshold: 0.2 });
revealables.forEach(el => io.observe(el));
setTimeout(() => revealables.forEach(el => el.classList.add('is-in')), 6000);

// Manifeste : chaque mot s'allume quand la ligne de lecture le dépasse
const manifesto = document.querySelector('[data-light]');
manifesto.innerHTML = manifesto.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
const words = [...manifesto.querySelectorAll('.w')];

// Trajectoire : la ligne se remplit, les étapes s'allument quand le satellite les atteint
const path = document.querySelector('[data-path]');
const stops = [...path.querySelectorAll('[data-stop]')];
const rail = path.querySelector('.path__rail');

// Le satellite voyageur : le point du logo. Il part du soleil du hero et se pose sur le soleil final.
// Son trajet est une suite d'étapes { x, y, k, s } en coordonnées de page : il est au point x,y quand la ligne
// de lecture (milieu de l'écran) vaut k ; s = son échelle. Entre deux étapes il glisse en ligne droite.
// Il ne change de colonne que dans le vide en bas d'une section, pour ne jamais passer sur du texte.
const traveler = document.querySelector('[data-traveler]');
const $ = s => document.querySelector(s);
const box = el => { const r = el.getBoundingClientRect(); return { left: r.left + scrollX, right: r.right + scrollX, top: r.top + scrollY, bottom: r.bottom + scrollY, w: r.width, h: r.height, cx: r.left + scrollX + r.width / 2, cy: r.top + scrollY + r.height / 2 }; };
const padBand = el => { const sec = el.closest('section'); const b = box(sec); const pb = parseFloat(getComputedStyle(sec).paddingBottom); return [b.bottom - pb * 0.55, b.bottom - 12]; }; // seconde moitié du vide : marge pour l'amorti du rendu
const tracks = {}; // portions où il visite quelque chose : partenaires, immersions, axe des salaires

function route() {
  const narrow = innerWidth <= 860;
  const stacked = innerWidth <= 1100; // salaires sur une colonne : pas de parcours de l'axe
  const vh = innerHeight;
  const pts = [];
  const add = (x, y, k = y, s = 1) => { const prev = pts[pts.length - 1]; pts.push({ x, y, k: prev ? Math.max(k, prev.k + 1) : k, s }); };
  const last = () => pts[pts.length - 1];
  const gutter = el => Math.max(traveler.offsetWidth / 2 + 1, box(el).left - 32);
  const cross = (el, toX) => { const [a, b] = padBand(el); add(last().x, a); add(toX, b, b + 40); };

  // 1. Demi-tour sous le soleil du hero, de son bord gauche (comme dans le logo) à son bord droit
  const sun = box($('.hero__sun'));
  const R = sun.w / 2;
  const k0 = vh * 0.5;
  for (let i = 0; i <= 24; i++) {
    const a = Math.PI - (Math.PI * i) / 24;
    add(sun.cx + Math.cos(a) * R, sun.cy + Math.sin(a) * R, k0 + i * 14);
  }

  // 2. Le long du bord haut de la grille des partenaires, de droite à gauche
  const grid = box($('.partners__grid'));
  add(grid.right, grid.top);
  tracks.partners = { k0: last().k, k1: last().k + 300 };
  add(grid.left, grid.top, last().k + 300);

  // 3. La marge du manifeste, puis la ligne de la trajectoire
  const man = $('.manifesto__text');
  add(gutter(man), box(man).top + 14);
  add(gutter(man), box(man).bottom - 14);
  const rail = box($('.path__rail'));
  cross(man, rail.cx);
  add(rail.cx, rail.top);
  add(rail.cx, rail.bottom);

  // 4. Les cas réels : il se loge dans la pastille de l'onglet ouvert le temps de la lecture
  const idx = $('.dossier__index');
  const cg = gutter(idx);
  cross($('.path'), cg);
  const tab = box($('.dossier__index [aria-selected="true"]'));
  const bx = tab.left + 25.6, by = tab.top + 28.8;
  add(cg, by);
  add(bx, by, by + 50, 0.5);
  add(bx, by, by + 330, 0.5);
  add(cg, by, by + 380);

  // 5. Le filet des immersions de l'année, de gauche à droite
  const imm = box($('.immersions'));
  if (narrow) {
    add(cg, imm.top);
  } else {
    add(cg, imm.top);
    add(imm.left, imm.top, imm.top + 30);
    tracks.immersions = { k0: last().k, k1: last().k + 320 };
    add(imm.right, imm.top, last().k + 320);
    add(imm.right + 32, imm.top, last().k + 30);
  }
  const og = gutter($('.orbit-section__head'));
  cross($('.immersions'), og);

  // 6. L'anneau des étudiants : il le rejoint et en fait le demi-tour par le haut, parmi les portraits
  const ring = box($('.orbit__ring'));
  const rr = ring.w / 2;
  add(og, ring.cy);
  add(ring.cx - rr, ring.cy, ring.cy + 30);
  const ka = last().k;
  const turns = narrow ? 2 : 1; // sur mobile la citation est sous l'anneau : il en fait le tour complet
  for (let i = 1; i <= 24 * turns; i++) {
    const a = Math.PI + (Math.PI * i) / 24;
    add(ring.cx + Math.cos(a) * rr, ring.cy + Math.sin(a) * rr, ka + i * 16);
  }
  if (narrow) add(og, ring.cy, last().k + 40); // il ressort par la marge avant la citation

  // 7. L'axe des salaires, de 40 k€ à 100 k€ (sur ordinateur)
  const lg = gutter($('#life-title'));
  if (!stacked) {
    const axis = box($('.chart__axis'));
    const x40 = axis.left + axis.w * pct(40) / 100, x100 = axis.left + axis.w * pct(100) / 100;
    cross($('.orbit-wrap'), x40);
    add(x40, axis.bottom);
    tracks.axis = { k0: last().k, k1: last().k + 320 };
    add(x100, axis.bottom, last().k + 320);
    add(box($('.careers')).right + 8, axis.bottom, last().k + 40);
    cross($('.chart'), lg);
  } else {
    cross($('.orbit-wrap'), lg);
  }

  // 8. La vie étudiante, puis il se pose au bord gauche du soleil final
  add(lg, box($('#life-title')).top + 14);
  const fs = box($('.final__sun'));
  cross($('.life__strip'), narrow ? fs.cx : lg);
  add(fs.left, fs.cy);
  return pts;
}

const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function targetAt(line) {
  const pts = route();
  if (line <= pts[0].k) return { ...pts[0] };
  const lastPt = pts[pts.length - 1];
  if (line >= lastPt.k) return { ...lastPt };
  const i = pts.findIndex((p, j) => j < pts.length - 1 && line >= p.k && line < pts[j + 1].k);
  const a = pts[i], b = pts[i + 1];
  const t = (line - a.k) / (b.k - a.k);
  const e = Math.abs(b.x - a.x) > 60 ? ease(t) : t; // les traversées accélèrent puis se posent, le reste est régulier
  return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, s: a.s + (b.s - a.s) * e };
}

// Rendu amorti : le point rejoint sa cible en douceur (le défilement, lui, reste natif)
let goal = null, cur = null, raf = 0;
const final = $('.final');
const partnerCells = [...document.querySelectorAll('.partners__grid li')];
const immCells = [...document.querySelectorAll('.immersions li')];
const lineNow = () => scrollY + innerHeight * 0.5;
const progress = (tr, line) => !tr ? -1 : Math.min(1, Math.max(0, (line - tr.k0) / (tr.k1 - tr.k0))) * (line >= tr.k0 ? 1 : -1);

function render() {
  raf = 0;
  if (!cur) cur = { ...goal };
  const f = 0.3;
  cur.x += (goal.x - cur.x) * f; cur.y += (goal.y - cur.y) * f; cur.s += (goal.s - cur.s) * f;
  const size = traveler.offsetWidth;
  traveler.style.transform = `translate(${cur.x - size / 2}px, ${cur.y - size / 2}px) scale(${cur.s})`;
  traveler.classList.toggle('is-light', cur.y > box(final).top);

  // la ligne de la trajectoire se remplit jusqu'à lui, les étapes s'allument à son passage
  const r = box(rail);
  const p = Math.min(1, Math.max(0, (cur.y - r.top) / r.h));
  path.style.setProperty('--p', `${(p * 100).toFixed(2)}%`);
  stops.forEach(s => s.classList.toggle('is-on', box(s).top + 8 <= cur.y + 1));

  // ce qu'il a déjà visité
  const line = lineNow();
  const pp = progress(tracks.partners, line);
  partnerCells.forEach(li => li.classList.toggle('is-visited', pp >= 1 || (pp >= 0 && box(li).cx >= cur.x - 4)));
  const pi = progress(tracks.immersions, line);
  immCells.forEach(li => li.classList.toggle('is-visited', pi >= 1 || (pi >= 0 && box(li).left <= cur.x + 4)));
  const pa = progress(tracks.axis, line);
  axis.querySelectorAll('span').forEach(t => t.classList.toggle('is-on', pa >= 1 || (pa >= 0 && box(t).cx <= cur.x + 4)));

  if (Math.abs(goal.x - cur.x) + Math.abs(goal.y - cur.y) + Math.abs(goal.s - cur.s) > 0.3) raf = requestAnimationFrame(render);
}
function moveTraveler() { goal = targetAt(lineNow()); if (!raf) raf = requestAnimationFrame(render); }

function onScroll() {
  const vh = innerHeight;
  const m = manifesto.getBoundingClientRect();
  const lit = Math.round(Math.min(1, Math.max(0, (vh * 0.85 - m.top) / (m.height + vh * 0.35))) * words.length);
  words.forEach((w, i) => w.classList.toggle('on', i < lit));
  moveTraveler();
}
if (reduced) {
  words.forEach(w => w.classList.add('on'));
  path.style.setProperty('--p', '100%');
  stops.forEach(s => s.classList.add('is-on'));
  partnerCells.forEach(li => li.classList.add('is-visited'));
  traveler.hidden = true;
} else {
  let ticking = false;
  const frame = () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); };
  addEventListener('scroll', frame, { passive: true });
  addEventListener('resize', frame);
  addEventListener('load', frame);
  document.querySelectorAll('.dossier__index [role="tab"]').forEach(t => t.addEventListener('click', () => setTimeout(moveTraveler)));
  onScroll();
}

// Compte à rebours de la Journée Portes Ouvertes
const target = new Date('2026-12-12T00:00:00+01:00');
function tick() {
  const ms = Math.max(0, target - Date.now());
  const values = { days: Math.floor(ms / 864e5), hours: Math.floor(ms / 36e5) % 24, minutes: Math.floor(ms / 6e4) % 60 };
  Object.entries(values).forEach(([unit, value]) => {
    document.querySelectorAll(`[data-countdown-${unit}]`).forEach(el => {
      el.textContent = unit === 'days' ? value : String(value).padStart(2, '0');
    });
  });
}
tick();
setInterval(tick, 30000);
