/* Rolagem automática das prévias de site.
   Qualquer elemento com [data-autoscroll="px/s"] rola sozinho, devagar, até o fim;
   segura um pouco, volta suave pro topo e recomeça. Se a pessoa rolar (roda, dedo,
   teclado), o automático pausa e continua depois de alguns segundos de onde parou.
   [data-key]: quando muda (troca de aba), volta pro topo.
   [data-sync-lead="g"] / [data-sync-follow="g"]: seguidores acompanham a proporção do líder. */
(function () {
  const S = new WeakMap();
  const USER_PAUSE = 2600, HOLD_END = 1800, BACK_MS = 1600, HOLD_TOP = 1400;
  const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function sync(el) {
    const g = el.dataset.syncLead;
    if (!g) return;
    const max = el.scrollHeight - el.clientHeight;
    const r = max > 0 ? el.scrollTop / max : 0;
    document.querySelectorAll(`[data-sync-follow="${g}"]`).forEach(f => {
      f.scrollTop = r * (f.scrollHeight - f.clientHeight);
    });
  }

  function state(el, now) {
    let s = S.get(el);
    if (s) return s;
    s = { pos: el.scrollTop, expected: el.scrollTop, phase: 'wait', until: now + 1200, userUntil: 0, key: el.dataset.key };
    const user = () => { s.userUntil = performance.now() + USER_PAUSE; s.phase = 'run'; };
    ['wheel', 'touchstart', 'keydown'].forEach(ev => el.addEventListener(ev, user, { passive: true }));
    el.addEventListener('scroll', () => {
      if (Math.abs(el.scrollTop - s.expected) > 2) { user(); s.pos = el.scrollTop; s.expected = el.scrollTop; }
      sync(el);
    }, { passive: true });
    S.set(el, s);
    return s;
  }

  let last = performance.now();
  function tick(now) {
    const dt = Math.min(64, now - last);
    last = now;
    document.querySelectorAll('[data-autoscroll]').forEach(el => {
      const s = state(el, now);
      if (el.dataset.key !== s.key) {
        s.key = el.dataset.key; s.pos = 0; s.expected = 0; el.scrollTop = 0;
        s.phase = 'wait'; s.until = now + HOLD_TOP; sync(el);
      }
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight || now < s.userUntil) return;
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 1) return;
      const speed = +el.dataset.autoscroll || 60;
      if (s.phase === 'wait') { if (now > s.until) s.phase = 'run'; return; }
      if (s.phase === 'hold') { if (now > s.until) { s.phase = 'back'; s.t0 = now; s.from = s.pos; } return; }
      if (s.phase === 'run') {
        s.pos = Math.min(max, s.pos + (speed * dt) / 1000);
        if (s.pos >= max) { s.phase = 'hold'; s.until = now + HOLD_END; }
      } else if (s.phase === 'back') {
        const t = Math.min(1, (now - s.t0) / BACK_MS);
        s.pos = s.from * (1 - ease(t));
        if (t >= 1) { s.pos = 0; s.phase = 'wait'; s.until = now + HOLD_TOP; }
      }
      el.scrollTop = s.pos;
      s.expected = el.scrollTop;
      sync(el);
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
