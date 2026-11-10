/* LANE ZERO — interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- race clock (hundredths, like a track timer) ---- */
  const clock = $('#clock');
  const t0 = performance.now();
  const tickClock = () => {
    const t = (performance.now() - t0) / 1000;
    const m = String(Math.floor(t / 60) % 60).padStart(2, '0');
    const s = (t % 60).toFixed(2).padStart(5, '0');
    clock.textContent = `${m}:${s}`;
    requestAnimationFrame(tickClock);
  };
  if (clock) requestAnimationFrame(tickClock);

  /* ---- ticker: duplicate list for a seamless loop ---- */
  const tl = $('.ticker__list');
  if (tl) tl.innerHTML += tl.innerHTML;

  /* ---- lanes overlay ---- */
  const lanes = $('#lanes'), open = $('#lanesOpen'), close = $('#lanesClose');
  const setLanes = (on) => {
    lanes.hidden = !on; open.setAttribute('aria-expanded', on);
    document.body.style.overflow = on ? 'hidden' : '';
    if (on) close.focus();
  };
  open.addEventListener('click', () => setLanes(true));
  close.addEventListener('click', () => setLanes(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lanes.hidden) setLanes(false); });
  $$('a', lanes).forEach(a => a.addEventListener('click', () => setLanes(false)));

  /* ---- cover carousel ---- */
  const slides = $$('.slide'), bars = $$('.cover__bars button'), count = $('#coverCount');
  const DUR = 7000; let cur = 0, timer;
  const go = (i) => {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === cur));
    bars.forEach((b, k) => {
      b.setAttribute('aria-selected', k === cur);
      const sp = b.querySelector('span'); sp.style.animation = 'none'; sp.offsetHeight; sp.style.animation = '';
    });
    count.textContent = `${String(cur + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    clearTimeout(timer);
    if (!reduce) timer = setTimeout(() => go(cur + 1), DUR);
  };
  document.documentElement.style.setProperty('--dur', DUR + 'ms');
  bars.forEach(b => b.addEventListener('click', () => go(+b.dataset.go)));
  go(0);

  /* ---- latest filter ---- */
  const chips = $$('.chip'), cards = $$('.latest .card');
  const filter = (f) => {
    chips.forEach(c => c.classList.toggle('is-on', c.dataset.f === f));
    cards.forEach(c => c.classList.toggle('is-out', f !== 'all' && c.dataset.cat !== f && !(f === 'races' && c.dataset.cat === 'lab')));
  };
  chips.forEach(c => c.addEventListener('click', () => filter(c.dataset.f)));
  $$('[data-filter]').forEach(a => a.addEventListener('click', () => filter(a.dataset.filter)));

  /* ---- race desk ---- */
  const DESK = {
    60:  { img: 'desk-60.jpg', wr: 'WR 6.34 · Albuquerque 2018', title: 'What the 60m reveals that the 100m hides', lede: 'No top-speed phase to hide in. Indoors, the race is all start and acceleration.',
           list: [['The Lab', 'Why the 60m world record still belongs to a 100m man'], ['Races', 'Six laps of a 200m track, sixty metres of straight'], ['Culture', 'Spikes, boards and the sound of an indoor arena']] },
    100: { img: 'desk-100.jpg', wr: 'WR 9.58 · Berlin 2009', title: 'Building the first 30 metres of a 100m race', lede: 'Block clearance, shin angle and the slow rise of the torso.',
           list: [['The Lab', 'How to read a reaction time'], ['Races', 'Why sprinters lean at the line'], ['Athletes', 'Ten seconds, ten years: a 100m career in splits']] },
    200: { img: 'desk-200.jpg', wr: 'WR 19.19 · Berlin 2009', title: 'The bend: running a curve at ten metres a second', lede: 'Lean in, stay tight to the line, and come off the turn with speed to spare.',
           list: [['The Lab', 'Inside lane or outside lane — which is faster?'], ['Races', 'Tebogo’s 19.46 and the art of the second hundred'], ['Athletes', 'Why the best 200m runners never look like they are trying']] },
    400: { img: 'desk-400.jpg', wr: 'WR 43.03 · Rio 2016', title: 'One lap, three races: dividing the 400m', lede: 'Attack, float, survive. How the fastest one-lap runners spend their energy.',
           list: [['The Lab', 'Where the 400m is actually lost'], ['Races', 'Running 43 seconds from lane eight'], ['Athletes', 'From the 100m to the one-lap race']] },
    hr:  { img: 'desk-hr.jpg', wr: '4×100 WR 36.84 · London 2012', title: 'Twenty metres to pass a baton', lede: 'The exchange zone is where relays are won, and where they fall apart.',
           list: [['The Lab', 'The blind hand-off, explained'], ['Races', 'Ten hurdles, 110 metres, three steps between'], ['Culture', 'Why every relay team has a superstition']] },
  };
  const dBtns = $$('.dist button');
  const setDesk = (d) => {
    const x = DESK[d]; if (!x) return;
    dBtns.forEach(b => { const on = b.dataset.d === String(d); b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); });
    $('#deskImg').src = 'assets/img/' + x.img;
    $('#deskImg').alt = x.title;
    $('#deskWR').textContent = x.wr;
    $('#deskKicker').innerHTML = `<span class="tag tag--red">${d === 'hr' ? 'Hurdles & relays' : d + 'M'} · Lead</span>`;
    $('#deskTitle').textContent = x.title;
    $('#deskLede').textContent = x.lede;
    $('#deskList').innerHTML = x.list.map(([c, t]) => `<li><a href="#"><span class="mono">${c}</span><b>${t}</b><i>→</i></a></li>`).join('');
    const copy = $('.desk__copy'); copy.classList.remove('fade'); copy.offsetHeight; copy.classList.add('fade');
  };
  dBtns.forEach(b => b.addEventListener('click', () => setDesk(b.dataset.d)));
  $$('[data-dist]').forEach(a => a.addEventListener('click', () => setDesk(a.dataset.dist)));

  /* ---- the lab: phase figure ---- */
  // [head, neck, hip, frontKnee, frontAnkle, backKnee, backAnkle, frontElbow, frontHand, backElbow, backHand]
  const POSES = [
    { a: '−15°', d: '0 m',     p: [[264,176],[245,186],[186,168],[212,214],[178,262],[150,224],[110,258],[249,228],[251,268],[241,228],[243,268]] },
    { a: '45°',  d: '0–10 m',  p: [[232,124],[216,140],[170,186],[224,190],[206,234],[134,226],[96,262],[246,166],[260,140],[186,152],[166,178]] },
    { a: '85°',  d: '30–80 m', p: [[214,66],[210,86],[200,166],[246,170],[232,216],[190,216],[168,262],[236,116],[242,86],[184,120],[168,146]] },
    { a: '68°',  d: '95–100 m',p: [[264,90],[246,106],[190,170],[236,216],[252,266],[160,206],[120,226],[214,136],[190,152],[258,146],[242,172]] },
  ];
  const fig = $('#figure');
  const pts = (...xs) => xs.map(p => p.join(',')).join(' ');
  const pose = (i) => {
    const [h, n, hp, fk, fa, bk, ba, fe, fh, be, bh] = POSES[i].p;
    $('#head', fig).setAttribute('cx', h[0]); $('#head', fig).setAttribute('cy', h[1]);
    $('#body', fig).setAttribute('points', pts(n, hp));
    $('#limbFront', fig).setAttribute('points', pts(hp, fk, fa, [fa[0] + 14, fa[1] + 2]));
    $('#limbBack', fig).setAttribute('points', pts(hp, bk, ba, [ba[0] + 14, ba[1] + 2]));
    $('#armFront', fig).setAttribute('points', pts(n, fe, fh));
    $('#armBack', fig).setAttribute('points', pts(n, be, bh));
    const ang = Math.atan2(hp[1] - n[1], n[0] - hp[0]);
    const r = 44, ex = hp[0] + r * Math.cos(ang), ey = hp[1] - r * Math.sin(ang);
    $('#angleRef', fig).setAttribute('x1', hp[0]); $('#angleRef', fig).setAttribute('y1', hp[1]);
    $('#angleRef', fig).setAttribute('x2', hp[0] + 70); $('#angleRef', fig).setAttribute('y2', hp[1]);
    $('#angleArc', fig).setAttribute('d', `M${hp[0] + r},${hp[1]} A${r},${r} 0 0 ${ang > 0 ? 0 : 1} ${ex},${ey}`);
    const t = $('#angleTxt', fig); t.setAttribute('x', hp[0] + 52); t.setAttribute('y', hp[1] - 10); t.textContent = POSES[i].a;
    $('#readAngle').textContent = POSES[i].a; $('#readDist').textContent = POSES[i].d;
    $$('.phases button').forEach((b, k) => { b.classList.toggle('is-on', k === i); b.setAttribute('aria-selected', k === i); });
  };
  $$('.phases button').forEach(b => b.addEventListener('click', () => pose(+b.dataset.p)));
  pose(0);

  /* ---- 10m splits (Berlin 2009, 9.58) ---- */
  const SPL = [1.89, 0.99, 0.90, 0.86, 0.83, 0.82, 0.81, 0.82, 0.83, 0.83];
  const sb = $('#splits');
  const min = Math.min(...SPL);
  sb.innerHTML = SPL.map((s, i) => {
    const speed = 10 / s, h = Math.round((speed / (10 / min)) * 100);
    return `<div class="bar${s === min ? ' is-peak' : ''}" data-h="${h}" title="${(speed * 3.6).toFixed(1)} km/h"><span class="bar__val">${s.toFixed(2)}</span><div class="bar__fill"></div><span class="bar__lbl">${i * 10}–${i * 10 + 10}</span></div>`;
  }).join('');
  const fillBars = () => $$('.bar', sb).forEach((b, i) => setTimeout(() => { b.querySelector('.bar__fill').style.height = `calc(${b.dataset.h}% - 50px)`; }, i * 80));

  /* ---- newsletter ---- */
  const form = $('.split__form'), msg = $('.split__msg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = $('#email').value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    msg.className = 'split__msg mono ' + (ok ? 'ok' : 'err');
    msg.textContent = ok ? 'You’re in. First split lands Monday 07:00.' : 'False start — check that email address.';
    if (ok) form.reset();
  });

  /* ---- reveal on scroll ---- */
  const targets = $$('.sec-head, .card, .dist, .desk, .grid-wall__head, .face, .lab__intro, .lab__viz, .splits, .split');
  targets.forEach((el, i) => { el.classList.add('reveal'); if (el.classList.contains('face')) el.style.transitionDelay = (i % 8) * 70 + 'ms'; });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    if (e.target.classList.contains('splits')) fillBars();
    io.unobserve(e.target);
  }), { threshold: .15 });
  targets.forEach(el => io.observe(el));
})();
