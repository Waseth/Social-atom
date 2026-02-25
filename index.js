/* =============================================
   SOCIAL ATOM — index.js
   Emmanuel Waseth
   6 nodes: GitHub(n0), LinkedIn(n1), Instagram(n2),
            TikTok(n3), Email(n4), Portfolio(n5)
============================================= */

/* ── ORBIT ENGINE ───────────────────────────── */
(function () {
  const CX = 300, CY = 300;
  const RX = 255, RY = 82;

  // 3 ellipse tilt angles (React-logo style: 0°, 60°, 120°)
  const TILTS = [0, Math.PI / 3, (2 * Math.PI) / 3];

  // 6 nodes — 2 per ellipse, spaced 180° apart
  // offset staggers starting position on each ellipse
  const NODE_DEF = [
    { id: 'n0', e: 0, offset: 0              },   // GitHub     — ellipse 0
    { id: 'n1', e: 0, offset: Math.PI        },   // LinkedIn   — ellipse 0, opposite side
    { id: 'n2', e: 1, offset: Math.PI / 6   },   // Instagram  — ellipse 1
    { id: 'n3', e: 1, offset: Math.PI / 6 + Math.PI },  // TikTok — ellipse 1, opposite
    { id: 'n4', e: 2, offset: Math.PI / 3   },   // Email      — ellipse 2
    { id: 'n5', e: 2, offset: Math.PI / 3 + Math.PI },  // Portfolio — ellipse 2, opposite
  ];

  // Each ellipse rotates at a slightly different speed (rad/s)
  const SPEEDS = [0.42, 0.36, 0.48];

  const wrap = document.getElementById('atomWrap');
  if (!wrap) return;

  const nodes = NODE_DEF.map(d => ({
    ...d,
    el: document.getElementById(d.id),
    angle: d.offset,
    paused: false,
  }));

  
  nodes.forEach(n => {
    if (!n.el) return;
    n.el.addEventListener('mouseenter', () => { n.paused = true; });
    n.el.addEventListener('mouseleave', () => { n.paused = false; });
  });


  function ellipsePoint(theta, tilt) {
    const lx = RX * Math.cos(theta);
    const ly = RY * Math.sin(theta);
    const c = Math.cos(tilt), s = Math.sin(tilt);
    return {
      x: CX + lx * c - ly * s,
      y: CY + lx * s + ly * c,
    };
  }


  function depthScale(y) {
    const t = (y - (CY - RX)) / (2 * RX);
    return 0.68 + t * 0.32;
  }

  let lastTs = null;

  function tick(ts) {
    if (!lastTs) lastTs = ts;
    const dt = Math.min((ts - lastTs) / 1000, 0.05);
    lastTs = ts;


    const wPx   = wrap.offsetWidth;
    const scale = wPx / 600;

    nodes.forEach(n => {
      if (!n.el) return;

      if (!n.paused) {
        n.angle += SPEEDS[n.e] * dt;
      }

      const pos = ellipsePoint(n.angle, TILTS[n.e]);
      const ds  = depthScale(pos.y);

      n.el.style.left    = (pos.x * scale) + 'px';
      n.el.style.top     = (pos.y * scale) + 'px';
      n.el.style.zIndex  = Math.round(pos.y);
      n.el.style.opacity = (0.5 + ((ds - 0.68) / 0.32) * 0.5).toFixed(3);

      n.el.style.transform = n.paused
        ? 'translate(-50%, -50%) scale(1.22)'
        : `translate(-50%, -50%) scale(${ds.toFixed(3)})`;
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();


(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (!cur || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  function tick() {
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';

    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    requestAnimationFrame(tick);
  }
  tick();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.transform = 'translate(-50%,-50%) scale(2.2)';
      ring.style.opacity   = '.6';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.opacity   = '.3';
    });
  });
})();