/* Shubhan Punde · portfolio · © 2026 Shubhan Punde. All rights reserved. Build sp2532-1bb845a51c97 */
(() => {
  'use strict';
  const doc = document.documentElement;
  doc.classList.add('js');
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- intro ---------- */
  const start = () => requestAnimationFrame(() => doc.classList.add('loaded'));
  if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 900))]).then(start);
  else start();

  /* ---------- typewriter in the hero terminal ---------- */
  const term = $('.term');
  if (term) {
    const lines = $$('[data-type]', term);
    const full = lines.map(l => l.textContent);
    if (!RM) {
      lines.forEach(l => (l.textContent = ''));
      let li = 0, ci = 0;
      const tick = () => {
        if (li >= lines.length) { lines[lines.length - 1].classList.add('type-caret'); return; }
        const el = lines[li];
        lines.forEach(x => x.classList.remove('type-caret'));
        el.classList.add('type-caret');
        el.textContent = full[li].slice(0, ++ci);
        if (ci >= full[li].length) { li++; ci = 0; setTimeout(tick, li === 1 ? 380 : 260); }
        else setTimeout(tick, li === 0 ? 34 : 16);
      };
      setTimeout(tick, 1500);
    }
  }

  /* ---------- reveal, bars, count-up ---------- */
  const fmt = (n, dec, comma) => {
    let s = n.toFixed(dec);
    if (comma) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return s;
  };
  const countUp = el => {
    const txt = el.textContent;
    const m = txt.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/s);
    if (!m || /[A-Za-z]$/.test(m[1])) return;
    if (/\d/.test(m[3]) && !/^\/\d+$/.test(m[3].replace(/\s/g, ''))) return;   // ranges like 5–6 stay as they are
    const raw = m[2], comma = raw.includes(','), v = parseFloat(raw.replace(/,/g, ''));
    if (!isFinite(v) || v === 0) return;
    const dec = (raw.split('.')[1] || '').length;
    const dur = 1400, t0 = performance.now();
    const step = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = m[1] + fmt(v * e, dec, comma) + m[3];
      if (p < 1) requestAnimationFrame(step); else el.textContent = txt;
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; el.classList.add('in'); io.unobserve(el);
    if (!RM) $$('[data-count]', el).concat(el.matches('[data-count]') ? [el] : []).forEach(countUp);
  }), { rootMargin: '0px 0px -8% 0px', threshold: .12 });
  $$('.rv, .bar, [data-count]').forEach(el => io.observe(el));
  $$('[data-stagger]').forEach(p => [...p.children].forEach((c, i) => c.style.setProperty('--i', i)));

  /* ---------- spotlight cards ---------- */
  document.addEventListener('pointermove', e => {
    const c = e.target.closest && e.target.closest('.spot');
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ---------- nav: progress, shrink, active section ---------- */
  const prog = $('.progress'), nav = $('.nav');
  const onScroll = () => {
    const h = doc.scrollHeight - innerHeight;
    if (prog) prog.style.setProperty('--p', h > 0 ? (scrollY / h).toFixed(4) : 0);
    if (nav) nav.classList.toggle('scrolled', scrollY > 40);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const links = $$('.nav-links a');
  if (links.length) {
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const so = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { links.forEach(a => a.classList.remove('active')); const a = map.get(e.target.id); if (a) a.classList.add('active'); }
    }), { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) so.observe(s); });
  }

  /* ---------- project filters ---------- */
  const fbtn = $$('.filters button');
  fbtn.forEach(b => b.addEventListener('click', () => {
    const f = b.dataset.filter;
    const apply = () => {
      fbtn.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      $$('[data-tags]').forEach(c => { c.hidden = !(f === 'all' || c.dataset.tags.split(' ').includes(f)); });
    };
    if (document.startViewTransition && !RM) document.startViewTransition(apply); else apply();
  }));

  /* ---------- lightbox ---------- */
  const lb = $('dialog.lb');
  if (lb) {
    $$('.shot img').forEach(img => img.addEventListener('click', () => {
      $('img', lb).src = img.currentSrc || img.src; $('img', lb).alt = img.alt;
      $('p', lb).textContent = img.closest('figure')?.querySelector('figcaption')?.textContent || '';
      lb.showModal();
    }));
    lb.addEventListener('click', () => lb.close());
  }

  /* ---------- pipeline flow dots ---------- */
  if (!RM) $$('.pipe-w').forEach(p => {
    const d = document.createElement('i'); d.className = 'flowdot'; d.setAttribute('aria-hidden', 'true'); p.appendChild(d);
    d.animate([{ left: '0%', opacity: 0 }, { opacity: 1, offset: .08 }, { opacity: 1, offset: .92 }, { left: '100%', opacity: 0 }], { duration: 4200, iterations: Infinity, easing: 'linear' });
  });

  /* ---------- threat map ---------- */
  const cv = $('#threatmap');
  if (cv) threatMap(cv);

  function threatMap(canvas) {
    const W = window.__WORLD; if (!W) return;
    const ctx = canvas.getContext('2d');
    const bits = Uint8Array.from(atob(W.b64), c => c.charCodeAt(0));
    const land = [];
    for (let r = 0; r < W.rows; r++) for (let c = 0; c < W.cols; c++) {
      const i = r * W.cols + c;
      if (bits[i >> 3] >> (7 - (i & 7)) & 1) land.push([-180 + c * W.step + W.step / 2, W.lat1 - r * W.step]);
    }
    const C = {
      pune: [73.86, 18.52, 'Pune'], mumbai: [72.88, 19.08, 'Mumbai'], blr: [77.59, 12.97, 'Bengaluru'], delhi: [77.21, 28.61, 'Delhi'],
      doha: [51.53, 25.29, 'Doha'], kuwait: [47.98, 29.37, 'Kuwait City'], vegas: [-115.14, 36.17, 'Las Vegas'], london: [-0.13, 51.51, 'London'],
      ams: [4.9, 52.37, 'Amsterdam'], fra: [8.68, 50.11, 'Frankfurt'], moscow: [37.62, 55.76, 'Moscow'], kyiv: [30.52, 50.45, 'Kyiv'],
      sao: [-46.63, -23.55, 'São Paulo'], lagos: [3.38, 6.52, 'Lagos'], beijing: [116.4, 39.9, 'Beijing'], hk: [114.17, 22.32, 'Hong Kong'],
      sg: [103.82, 1.35, 'Singapore'], jakarta: [106.85, -6.21, 'Jakarta'], seoul: [126.98, 37.57, 'Seoul'], tokyo: [139.69, 35.69, 'Tokyo'],
      ashburn: [-77.49, 39.04, 'Ashburn'], la: [-118.24, 34.05, 'Los Angeles'], nyc: [-74.0, 40.71, 'New York'], toronto: [-79.38, 43.65, 'Toronto'],
      joburg: [28.05, -26.2, 'Johannesburg'], sydney: [151.21, -33.87, 'Sydney'], tehran: [51.39, 35.69, 'Tehran'], dubai: [55.27, 25.2, 'Dubai'],
      bucharest: [26.1, 44.43, 'Bucharest'], hanoi: [105.85, 21.03, 'Hanoi'], mexico: [-99.13, 19.43, 'Mexico City'], cairo: [31.24, 30.04, 'Cairo']
    };
    const TARGETS = ['pune', 'pune', 'pune', 'mumbai', 'blr', 'delhi', 'doha', 'kuwait', 'vegas', 'london', 'nyc'];
    const SOURCES = Object.keys(C).filter(k => !['pune', 'mumbai', 'blr', 'delhi'].includes(k));
    const TYPES = [
      { n: 'credential stuffing', c: '#ff562d', o: 'blocked' },
      { n: 'phishing URL', c: '#5ee6eb', o: 'scam 0.98' },
      { n: 'MFA fatigue', c: '#ffa63d', o: 'step-up' },
      { n: 'impossible travel', c: '#a78bfa', o: 'flagged' },
      { n: 'card-testing burst', c: '#ffb4a2', o: 'held' },
      { n: 'port scan', c: '#7fb3ff', o: 'dropped' },
      { n: 'bulk download', c: '#ff4a1c', o: 'revoked' }
    ];
    let w = 0, h = 0, dpr = 1, base = null, proj, arcs = [], rings = [], last = 0, acc = 0, running = true, blocked = 1204, mx = 0, my = 0, tx = 0, ty = 0;
    const counter = $('[data-blocked]');
    const lastEvt = $('[data-last]');
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(2, devicePixelRatio || 1); w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      // equirectangular, cover the canvas, India slightly right of centre
      const lonSpan = 360, latTop = W.lat1, latBot = W.lat1 - W.rows * W.step;
      const sx = w / lonSpan * 1.12, sy = sx; const mapH = (latTop - latBot) * sy;
      const ox = w * 0.585 - 73.86 * sx, oy = h * 0.47 - (latTop - 18.5) * sy;
      proj = (lon, lat) => [ox + lon * sx, oy + (latTop - lat) * sy];
      base = document.createElement('canvas'); base.width = canvas.width; base.height = canvas.height;
      const b = base.getContext('2d'); b.scale(dpr, dpr);
      const rad = Math.max(1, sx * W.step * 0.28);
      for (const [lon, lat] of land) {
        const [x, y] = proj(lon, lat); if (x < -4 || x > w + 4 || y < -4 || y > h + 4) continue;
        const near = Math.hypot(lon - 73.9, lat - 18.5) < 9;
        b.fillStyle = near ? 'rgba(255,138,92,.6)' : 'rgba(94,230,235,.44)';
        b.beginPath(); b.arc(x, y, rad, 0, 6.283); b.fill();
      }
      // city markers
      for (const k of Object.keys(C)) {
        const [x, y] = proj(C[k][0], C[k][1]);
        b.fillStyle = 'rgba(241,242,244,.5)'; b.beginPath(); b.arc(x, y, 1.6, 0, 6.283); b.fill();
      }
    };
    const pick = a => a[(Math.random() * a.length) | 0];
    const spawn = () => {
      const t = pick(TARGETS); let s = pick(SOURCES); if (s === t) s = 'ams';
      const ty_ = pick(TYPES);
      const a = proj(C[s][0], C[s][1]), b = proj(C[t][0], C[t][1]);
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2 - d * 0.38;
      arcs.push({ a, b, cx, cy, c: ty_.c, t: 0, dur: 1300 + d * 2.2, life: 0 });
      rings.push({ x: a[0], y: a[1], c: ty_.c, t: 0, s: .6 });
      blocked += 1;
      if (counter) counter.textContent = blocked.toLocaleString('en-IN');
      if (lastEvt) lastEvt.textContent = `${ty_.n} · ${C[s][2]} → ${C[t][2]} · ${ty_.o}`;
    };
    const qb = (p0, p1, p2, t) => (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
    const draw = now => {
      if (!running) return;
      const dt = Math.min(64, now - (last || now)); last = now;
      acc += dt; if (acc > 520) { acc = 0; if (arcs.length < 16) spawn(); }
      tx += (mx - tx) * .05; ty += (my - ty) * .05;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, tx, ty);
      ctx.drawImage(base, 0, 0, w, h);
      ctx.lineCap = 'round';
      for (let i = arcs.length - 1; i >= 0; i--) {
        const A = arcs[i]; A.t += dt / A.dur;
        const head = Math.min(1, A.t), tail = Math.max(0, Math.min(1, A.t - .45));
        const fade = A.t > 1 ? Math.max(0, 1 - (A.t - 1) * 2.2) : 1;
        if (fade <= 0) { arcs.splice(i, 1); continue; }
        const N = 26; ctx.strokeStyle = A.c;
        for (let k = 0; k < N; k++) {
          const t0 = tail + (head - tail) * k / N, t1 = tail + (head - tail) * (k + 1) / N;
          ctx.globalAlpha = (k / N) * .9 * fade; ctx.lineWidth = .6 + 1.4 * k / N;
          ctx.beginPath();
          ctx.moveTo(qb(A.a[0], A.cx, A.b[0], t0), qb(A.a[1], A.cy, A.b[1], t0));
          ctx.lineTo(qb(A.a[0], A.cx, A.b[0], t1), qb(A.a[1], A.cy, A.b[1], t1)); ctx.stroke();
        }
        if (A.t < 1) {
          const hx = qb(A.a[0], A.cx, A.b[0], head), hy = qb(A.a[1], A.cy, A.b[1], head);
          ctx.globalAlpha = 1; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(hx, hy, 1.8, 0, 6.283); ctx.fill();
          ctx.globalAlpha = .35; ctx.fillStyle = A.c; ctx.beginPath(); ctx.arc(hx, hy, 5, 0, 6.283); ctx.fill();
        } else if (!A.hit) { A.hit = 1; rings.push({ x: A.b[0], y: A.b[1], c: A.c, t: 0, s: 1 }); }
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        const R = rings[i]; R.t += dt / 1100; if (R.t >= 1) { rings.splice(i, 1); continue; }
        ctx.globalAlpha = (1 - R.t) * .9; ctx.strokeStyle = R.c; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(R.x, R.y, 2 + R.t * 18 * R.s, 0, 6.283); ctx.stroke();
      }
      // defended hub
      const [px, py] = proj(C.pune[0], C.pune[1]); const pulse = (now % 2400) / 2400;
      ctx.globalAlpha = 1; ctx.fillStyle = '#ff562d'; ctx.beginPath(); ctx.arc(px, py, 3, 0, 6.283); ctx.fill();
      ctx.globalAlpha = (1 - pulse) * .8; ctx.strokeStyle = '#ff562d'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(px, py, 4 + pulse * 26, 0, 6.283); ctx.stroke();
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };
    resize();
    new ResizeObserver(() => resize()).observe(canvas);
    if (RM) {
      for (let i = 0; i < 9; i++) { spawn(); }
      arcs.forEach(a => (a.t = .85)); running = true; last = performance.now();
      draw(last); running = false; return;
    }
    addEventListener('pointermove', e => { mx = (e.clientX / innerWidth - .5) * -14; my = (e.clientY / innerHeight - .5) * -8; }, { passive: true });
    const vis = new IntersectionObserver(es => es.forEach(e => {
      const on = e.isIntersecting && !document.hidden;
      if (on && !running) { running = true; last = 0; requestAnimationFrame(draw); }
      if (!on) running = false;
    }));
    vis.observe(canvas);
    document.addEventListener('visibilitychange', () => { if (document.hidden) running = false; else if (!running) { running = true; last = 0; requestAnimationFrame(draw); } });
    for (let i = 0; i < 5; i++) setTimeout(spawn, 300 + i * 160);
    requestAnimationFrame(draw);
  }
})();
