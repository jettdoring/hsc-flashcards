/* Physics Module 5: Advanced Mechanics
   Built-in cards from your booklet. Card ids must never change once studied (progress is stored by id). */
(() => {
const DOTS = {
  '5.1.1': 'Analyse the motion of projectiles by resolving the motion into horizontal and vertical components, making the following assumptions: a constant vertical acceleration due to gravity, zero air resistance',
  '5.1.2': 'Apply the modelling of projectile motion to quantitatively derive the relationships between the following variables: initial velocity, launch angle, maximum height, time of flight, final velocity, launch height, horizontal range of the projectile',
  '5.1.3': 'Conduct a practical investigation to collect primary data in order to validate the relationships derived above',
  '5.1.4': 'Solve problems, create models and make quantitative predictions by applying the equations of motion relationships for uniformly accelerated and constant rectilinear motion',
  '5.2.1': 'Conduct investigations to explain and evaluate, for objects executing uniform circular motion, the relationships that exist between: centripetal force, mass, speed, radius',
  '5.2.2': 'Analyse the forces acting on an object executing uniform circular motion in a variety of situations, for example: cars moving around horizontal circular bends, a mass on a string, objects on banked tracks',
  '5.2.3': 'Solve problems, model and make quantitative predictions about objects executing uniform circular motion in a variety of situations, using the following relationships: a = v²/r, v = 2πr/T, F = mv²/r, ω = Δθ/t',
  '5.2.4': 'Investigate the relationship between the total energy and work done on an object executing uniform circular motion',
  '5.2.5': 'Investigate the relationship between the rotation of mechanical systems and the applied torque: τ = r⊥F = rF sinθ',
  '5.3.1': 'Apply qualitatively and quantitatively Newton’s Law of Universal Gravitation to: determine the force of gravity between two objects F = GMm/r², investigate the factors that affect the gravitational field strength g = GM/r², predict the gravitational field strength at any point in a gravitational field, including at the surface of a planet',
  '5.3.2': 'Investigate the orbital motion of planets and artificial satellites when applying the relationships between the following quantities: gravitational force, centripetal force, centripetal acceleration, mass, orbital radius, orbital velocity, orbital period',
  '5.3.3': 'Predict quantitatively the orbital properties of planets and satellites in a variety of situations, including near the Earth and geostationary orbits, and relate these to their uses',
  '5.3.4': 'Investigate the relationship of Kepler’s Laws of Planetary Motion to the forces acting on, and the total energy of, planets in circular and non-circular orbits using: v = 2πr/T, r³/T² = GM/4π²',
  '5.3.5': 'Derive quantitatively and apply the concepts of gravitational force and gravitational potential energy in radial gravitational fields to a variety of situations, including but not limited to: the concept of escape velocity v = √(2GM/r), total potential energy of a planet or satellite in its orbit U = −GMm/r, total energy of a planet or satellite in its orbit U + K = −GMm/2r, energy changes that occur when satellites move between orbits, Kepler’s Laws of Planetary Motion'
};

const FOCUS = [
  { id: 'fa1', name: 'Inquiry Question 5.1: Projectile Motion', iq: 'How can models that are used to explain projectile motion be used to analyse and make predictions?' },
  { id: 'fa2', name: 'Inquiry Question 5.2: Circular Motion', iq: 'Why do objects move in circles?' },
  { id: 'fa3', name: 'Inquiry Question 5.3: Motion in Gravitational Fields', iq: 'How does the force of gravity determine the motion of planets and satellites?' }
];

/* ---------- Notation helpers (used inside card text) ---------- */
/* Square root with a bar over its contents, e.g. SQ('rg tanθ') */
const SQ = s => `<span style="white-space:nowrap">√<span style="display:inline-block;border-top:1.5px solid currentColor;padding:1px 3px 0;margin-left:1px">${s}</span></span>`;
const VEC = s => `<b>${s}</b>`;
/* Equation lines that wrap on narrow phones. The app’s E() never wraps, so long working scrolls sideways.
   This version keeps each piece of maths together but allows a line break after “=”, “:”, “,”, “+”, “−” or “×” (not before a power of ten),
   before “→”, before a word of prose, and at wide gaps (two or more spaces). */
const E = s => {
  let out = '', cur = '', depth = 0, i = 0;
  const flush = () => { if (cur) out += `<span style="white-space:nowrap">${cur}</span>`; cur = ''; };
  while (i < s.length) {
    const ch = s[i];
    if (ch === '<') { const j = s.indexOf('>', i), tag = s.slice(i, j + 1); if (tag[1] === '/') depth--; else if (!tag.endsWith('/>')) depth++; cur += tag; i = j + 1; continue; }
    if (ch === ' ' && depth === 0) {
      let k = i; while (s[k] === ' ') k++;
      const rest = s.slice(k), prev = cur.slice(-1);
      if (k - i >= 2) { flush(); out += ' '; i = k; continue; }
      if ('=≈:,+−'.includes(prev) || (prev === '×' && !rest.startsWith('10^')) || rest[0] === '→' || /^(?:[A-Za-z]{4,}|at|or|so|to|of|on|by|and|the|for)(?![A-Za-z])/.test(rest)) { flush(); out += ' '; i = k; continue; }
    }
    cur += ch; i++;
  }
  flush();
  return `<div class="eq" style="white-space:normal">${out}</div>`;
};
/* Subscript inside SVG text: sb('v', 'y', ' = 0') */
const sb = (base, sub, rest = '') => `${base}<tspan dy="3" style="font-size:72%">${sub}</tspan><tspan dy="-3">${rest}</tspan>`;

/* ---------- Shared SVG pieces ---------- */
const svgOpen = (w, h, label, title) => `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img" aria-label="${label}"><title>${title}</title>`;
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" class="${o.c || 'lbl'}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.st ? ` style="${o.st}"` : ''}>${s}</text>`;
/* One arrowhead marker per colour (marker fill can’t follow the line colour in every browser) */
const mkr = (id, col) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style="fill:${col}"/></marker>`;
const defs = (p, list) => `<defs>${list.map(([k, c]) => mkr(p + k, c)).join('')}</defs>`;
const AR = (x1, y1, x2, y2, col, id, o = {}) => `<line x1="${(+x1).toFixed(1)}" y1="${(+y1).toFixed(1)}" x2="${(+x2).toFixed(1)}" y2="${(+y2).toFixed(1)}" style="stroke:${col};stroke-width:${o.w || 2}${o.dash ? ';stroke-dasharray:' + o.dash : ''}" marker-end="url(#${id})"/>`;
const LN = (x1, y1, x2, y2, st) => `<line x1="${(+x1).toFixed(1)}" y1="${(+y1).toFixed(1)}" x2="${(+x2).toFixed(1)}" y2="${(+y2).toFixed(1)}" style="${st}"/>`;
const ACC = 'var(--accent)', INK = 'var(--ink)', INK2 = 'var(--ink-2)', INK3 = 'var(--ink-3)';
const rad = d => d * Math.PI / 180;
const wrap = (s, cap) => `<div class="viz">${s}</svg>${cap ? `<p class="viz-cap">${cap}</p>` : ''}</div>`;

/* Velocity components along a projectile’s path */
function trajectory() {
  const X0 = 40, X1 = 340, XP = 190, YG = 180, H = 130, half = (X1 - X0) / 2;
  const Y = x => YG - H * (1 - Math.pow((x - XP) / half, 2));
  const slope = x => 2 * H * (x - XP) / (half * half); /* screen dy/dx */
  let s = svgOpen(420, 272, 'Parabolic path of a projectile with velocity vectors at five points. The horizontal component is the same length everywhere. The vertical component is large and upwards at launch, shrinks to zero at the peak, then grows downwards. The resultant velocity is always along the tangent to the path.', 'Velocity components of a projectile');
  s += defs('p5tj', [['a', ACC], ['i', INK2]]);
  s += LN(20, YG, 400, YG, 'stroke:var(--ink-3);stroke-width:1.2');
  let d = ''; for (let x = X0; x <= X1; x += 4) d += (x === X0 ? 'M' : ' L') + x + ' ' + Y(x).toFixed(1);
  s += `<path d="${d}" style="fill:none;stroke:var(--ink-3);stroke-width:1.5;stroke-dasharray:5 4"/>`;
  const HX = 44;
  [X0, 115, XP, 265, X1].forEach(x => {
    const y = Y(x), vy = -slope(x) * HX; /* positive = up */
    s += `<circle class="mk" cx="${x}" cy="${y.toFixed(1)}" r="3.5"/>`;
    if (Math.abs(vy) > 1) {
      s += AR(x, y, x + HX, y, INK2, 'p5tji', { w: 1.6 }) + AR(x, y, x, y - vy, INK2, 'p5tji', { w: 1.6 });
      s += LN(x + HX, y, x + HX, y - vy, 'stroke:var(--ink-3);stroke-width:1;stroke-dasharray:3 3') + LN(x, y - vy, x + HX, y - vy, 'stroke:var(--ink-3);stroke-width:1;stroke-dasharray:3 3');
      s += AR(x, y, x + HX, y - vy, ACC, 'p5tja', { w: 2.4 });
    } else s += AR(x, y, x + HX, y, ACC, 'p5tja', { w: 2.4 });
  });
  s += T(XP, Y(XP) - 12, 'peak: ' + sb('v', 'y', ' = 0, v = ') + sb('v', 'x'), { a: 'middle' });
  s += T(X0 - 6, YG + 18, 'launch', { c: 'tk' }) + T(X1 + 10, YG - 8, 'lands', { c: 'tk' });
  s += `<rect x="24" y="244" width="12" height="3" style="fill:var(--accent)"/>` + T(42, 249, 'velocity (tangent to path)', { c: 'tk' });
  s += `<rect x="24" y="258" width="12" height="3" style="fill:var(--ink-2)"/>` + T(42, 263, 'horizontal and vertical components', { c: 'tk' });
  return wrap(s, 'v<sub>x</sub> never changes (no horizontal force). v<sub>y</sub> falls by 9.8 m s⁻¹ every second because the only force is the weight, acting down.');
}

/* Displacement, velocity and acceleration graphs for a ball thrown straight up */
function vtGraphs() {
  let s = svgOpen(420, 168, 'Three graphs against time for a ball thrown straight up, upwards positive. Displacement: an upside-down parabola starting and ending at zero. Velocity: a straight line falling from +u through zero at the peak to −u. Acceleration: a horizontal line at −9.8 m s⁻².', 'Motion graphs for a vertical throw');
  const panels = [['Displacement s', 's'], ['Velocity v', 'v'], ['Acceleration a', 'a']];
  panels.forEach(([name, k], i) => {
    const x0 = 22 + i * 136, w = 108, top = 22, h = 108, mid = top + h / 2;
    const base = k === 's' ? top + h - 6 : mid;
    s += T(x0 + w / 2, 14, name, { a: 'middle', c: 'axl' });
    s += LN(x0, top, x0, top + h, 'stroke:var(--ink-2);stroke-width:1.2') + LN(x0, base, x0 + w, base, 'stroke:var(--ink-2);stroke-width:1.2');
    s += T(x0 + w, base + 13, 't', { a: 'end', c: 'tk' });
    if (k === 's') { let d = ''; for (let j = 0; j <= 40; j++) { const t = j / 40; d += (j ? ' L' : 'M') + (x0 + t * (w - 8)).toFixed(1) + ' ' + (base - 4 * t * (1 - t) * (h - 18)).toFixed(1); } s += `<path class="curve" d="${d}"/>` + T(x0 + (w - 8) / 2, top + 6, 'peak', { a: 'middle', c: 'tk' }); }
    if (k === 'v') { s += `<path class="curve" d="M${x0} ${mid - 42} L${x0 + w - 8} ${mid + 42}"/>` + T(x0 + 4, mid - 44, '+u', { c: 'tk' }) + T(x0 + w - 8, mid + 56, '−u', { a: 'end', c: 'tk' }) + `<circle class="mk" cx="${x0 + (w - 8) / 2}" cy="${mid}" r="3"/>` + T(x0 + (w - 8) / 2 + 4, mid - 6, 'v = 0', { c: 'tk' }); }
    if (k === 'a') { s += `<path class="curve" d="M${x0} ${mid + 34} L${x0 + w - 8} ${mid + 34}"/>` + T(x0 + 4, mid + 28, '−9.8 m s⁻²', { c: 'tk' }); }
  });
  s += T(210, 160, 'Upwards taken as positive; graphs run from release until the ball returns to the hand.', { a: 'middle', c: 'tk' });
  return wrap(s, 'Gradient of s–t = velocity. Gradient of v–t = acceleration (−9.8 m s⁻² the whole time, even at the peak).');
}

/* Same launch speed, different angles: complementary angles give equal range */
function rangeAngle() {
  const X0 = 30, YG = 172, K = 330; /* K pixels = range at 45° */
  let s = svgOpen(420, 210, 'Trajectories at the same launch speed for angles of 15, 30, 45, 60 and 75 degrees. 45 degrees goes furthest. 30 and 60 degrees land at the same point, as do 15 and 75 degrees; the steeper launch goes higher and stays in the air longer.', 'Range against launch angle');
  s += LN(16, YG, 404, YG, 'stroke:var(--ink-3);stroke-width:1.2');
  const sty = { 15: 'stroke:var(--ink-3);stroke-width:1.5', 75: 'stroke:var(--ink-3);stroke-width:1.5;stroke-dasharray:5 3', 30: 'stroke:var(--ink-2);stroke-width:1.7', 60: 'stroke:var(--ink-2);stroke-width:1.7;stroke-dasharray:5 3', 45: 'stroke:var(--accent);stroke-width:2.6' };
  [15, 30, 45, 60, 75].forEach(a => {
    const th = rad(a), R = Math.sin(2 * th); let d = '';
    for (let j = 0; j <= 60; j++) { const x = R * j / 60, y = x * Math.tan(th) - x * x / (2 * Math.cos(th) ** 2); d += (j ? ' L' : 'M') + (X0 + x * K).toFixed(1) + ' ' + (YG - y * K).toFixed(1); }
    s += `<path d="${d}" style="fill:none;${sty[a]}"/>`;
    const hx = X0 + R / 2 * K, hy = YG - (Math.sin(th) ** 2 / 2) * K;
    s += T(hx, hy - 5, a + '°', { a: 'middle', c: 'tk' });
  });
  [[0.5, '15° & 75°'], [Math.sin(rad(60)), '30° & 60°'], [1, '45°: maximum']].forEach(([R, t], i) => { const x = X0 + R * K; s += `<circle class="mk" cx="${x.toFixed(1)}" cy="${YG}" r="3.5"/>` + T(i === 2 ? x + 6 : x, YG + (i === 2 ? 32 : 16), t, { a: i === 2 ? 'end' : 'middle', c: 'tk' }); });
  return wrap(s, 'Range R = u² sin2θ / g, so it is greatest when sin2θ = 1 (θ = 45°). Angles adding to 90° have equal sin2θ, so equal range.');
}

/* Launch from the top of a cliff, launch point taken as the origin */
function cliff() {
  const OX = 70, OY = 70, K = 0.7; /* px per m */
  const ux = 42.4, uy = 24.5;
  let s = svgOpen(420, 250, 'A projectile launched upwards at an angle from the top of a 200 m cliff. The launch point is the origin. The path rises 30.6 m to a peak, then falls past the cliff top to the ground, where the vertical displacement is −200 m.', 'Projectile launched from a cliff');
  s += defs('p5cl', [['a', ACC], ['i', INK2]]);
  const GY = OY + 200 * K;
  s += `<path d="M10 ${OY} H${OX} V${GY} H10 Z" style="fill:var(--surface-2);stroke:var(--ink-3)"/>`;
  s += LN(OX, GY, 410, GY, 'stroke:var(--ink-3);stroke-width:1.2');
  let d = ''; const tEnd = 9.36;
  for (let j = 0; j <= 80; j++) { const t = tEnd * j / 80, x = ux * t, y = uy * t - 4.9 * t * t; d += (j ? ' L' : 'M') + (OX + x * K * 0.82).toFixed(1) + ' ' + (OY - y * K).toFixed(1); }
  s += `<path class="curve" d="${d}"/>`;
  s += `<circle class="mk" cx="${OX}" cy="${OY}" r="3.5"/>` + T(OX - 4, OY - 8, 'origin (0, 0)', { a: 'end', c: 'tk' });
  s += AR(OX, OY, OX + 40, OY - 23, ACC, 'p5cla') + T(14, 24, 'launch: u = 49.0 m s⁻¹ at 30° above horizontal', { c: 'tk' });
  const px = OX + ux * 2.5 * K * 0.82, py = OY - 30.6 * K;
  s += `<circle class="mk" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="3"/>` + T(px + 10, py - 8, 'peak: ' + sb('v', 'y', ' = 0, +30.6 m'), { c: 'tk' });
  s += LN(OX, OY, 300, OY, 'stroke:var(--ink-3);stroke-dasharray:3 3');
  s += AR(372, OY, 372, GY, INK2, 'p5cli', { w: 1.4 }) + T(366, OY + 70, sb('s', 'y', ' = −200 m'), { a: 'end', c: 'axl' });
  s += T(OX + 10, GY + 18, 'range 397 m in 9.36 s', { c: 'tk' });
  return wrap(s, 'Technique 2: up is positive, so the ground is at s<sub>y</sub> = −200 m. Solve −200 = 24.5t − 4.9t² and keep the positive root.');
}

/* Centripetal force and the change in velocity */
function centripetal() {
  const CX = 120, CY = 118, R = 82;
  let s = svgOpen(420, 236, 'An object moving anticlockwise in a circle. At three points the velocity arrow is tangent to the circle and the centripetal force arrow points to the centre. On the right, the vector subtraction v2 minus v1 gives a change in velocity that points towards the centre.', 'Velocity and centripetal force in circular motion');
  s += defs('p5cp', [['a', ACC], ['i', INK2]]);
  s += `<circle cx="${CX}" cy="${CY}" r="${R}" style="fill:none;stroke:var(--ink-3);stroke-width:1.4;stroke-dasharray:4 3"/><circle cx="${CX}" cy="${CY}" r="2.5" style="fill:var(--ink-3)"/>`;
  [90, 210, 330].forEach(a => {
    const t = rad(a), x = CX + R * Math.cos(t), y = CY - R * Math.sin(t);
    const vx = -Math.sin(t), vy = -Math.cos(t); /* anticlockwise tangent, screen coords */
    s += `<circle class="mk" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5"/>`;
    s += AR(x, y, x + vx * 50, y + vy * 50, INK2, 'p5cpi');
    s += AR(x, y, x + (CX - x) * 0.5, y + (CY - y) * 0.5, ACC, 'p5cpa', { w: 2.4 });
  });
  s += T(CX - 52, CY - R - 8, 'v (tangent)', { a: 'end', c: 'tk' }) + T(CX + 6, CY - R / 2 + 4, sb('F', 'c', ', ') + sb('a', 'c'), { c: 'axl', st: 'fill:var(--accent)' });
  /* Δv construction */
  const ox = 268, oy = 70, L = 78, a2 = rad(-35);
  const v2x = ox + L * Math.cos(a2), v2y = oy - L * Math.sin(a2);
  s += T(330, 28, 'Δv = v₂ − v₁ = v₂ + (−v₁)', { a: 'middle', c: 'axl' });
  s += AR(ox, oy, v2x, v2y, INK2, 'p5cpi') + T((ox + v2x) / 2 + 6, (oy + v2y) / 2 - 6, 'v₂', { c: 'tk' });
  s += AR(v2x, v2y, v2x - L, v2y, INK2, 'p5cpi', { dash: '5 3' }) + T(v2x - L / 2, v2y + 16, '−v₁', { a: 'middle', c: 'tk' });
  s += AR(ox, oy, v2x - L, v2y, ACC, 'p5cpa', { w: 2.4 }) + T(ox - 22, (oy + v2y) / 2 + 4, 'Δv', { a: 'end', c: 'axl', st: 'fill:var(--accent)' });
  s += T(330, 150, 'Δv points towards the centre,', { a: 'middle', c: 'tk' }) + T(330, 165, 'so the acceleration (and net', { a: 'middle', c: 'tk' }) + T(330, 180, 'force) point to the centre too.', { a: 'middle', c: 'tk' });
  return wrap(s, 'Constant speed but changing direction means the velocity changes, so the object is accelerating. a = v²/r and F = mv²/r, both towards the centre.');
}

/* Conical pendulum free-body diagram */
function conical() {
  const PX = 150, PY = 22, BX = 236, BY = 166, CX = PX;
  let s = svgOpen(420, 236, 'A conical pendulum: a string of length L from a fixed point makes angle θ with the vertical, and the bob moves in a horizontal circle of radius r. Forces on the bob: tension along the string and weight straight down. The tension’s vertical component T cosθ balances mg; its horizontal component T sinθ points to the centre of the circle and is the centripetal force.', 'Conical pendulum forces');
  s += defs('p5cn', [['a', ACC], ['i', INK2], ['k', INK]]);
  s += `<rect x="${PX - 40}" y="${PY - 8}" width="80" height="8" style="fill:var(--surface-2);stroke:var(--ink-3)"/>`;
  s += `<ellipse cx="${CX}" cy="${BY}" rx="${BX - CX}" ry="20" style="fill:none;stroke:var(--ink-3);stroke-dasharray:4 3"/>`;
  s += LN(PX, PY, CX, BY, 'stroke:var(--ink-3);stroke-dasharray:3 3') + LN(PX, PY, BX, BY, 'stroke:var(--ink-2);stroke-width:1.4');
  s += LN(CX, BY, BX, BY, 'stroke:var(--ink-3)') + T(CX + 18, BY + 14, 'r', { a: 'middle', c: 'axl' });
  s += T(PX + (BX - PX) * 0.3 + 8, PY + (BY - PY) * 0.3 - 2, 'L', { c: 'axl' });
  s += `<path d="M${PX} ${PY + 34} A34 34 0 0 0 ${(PX + 34 * Math.sin(Math.atan2(BX - PX, BY - PY))).toFixed(1)} ${(PY + 34 * Math.cos(Math.atan2(BX - PX, BY - PY))).toFixed(1)}" style="fill:none;stroke:var(--ink-2)"/>` + T(PX + 6, PY + 52, 'θ', { c: 'axl' });
  const ux = (PX - BX), uy = (PY - BY), m = Math.hypot(ux, uy), TL = 92;
  const tx = BX + ux / m * TL, ty = BY + uy / m * TL;
  s += AR(BX, BY, tx, ty, INK, 'p5cnk', { w: 2.2 }) + T(tx - 8, ty + 4, 'T', { a: 'end', c: 'axl' });
  s += AR(BX, BY, tx, BY, INK2, 'p5cni', { dash: '5 3' }) + T(tx - 2, BY + 16, 'T sinθ', { c: 'tk' });
  s += AR(BX, BY, BX, ty, INK2, 'p5cni', { dash: '5 3' }) + T(BX + 6, ty + 14, 'T cosθ', { c: 'tk' });
  s += AR(BX, BY, BX, BY + 56, INK, 'p5cnk', { w: 2.2 }) + T(BX + 6, BY + 52, 'mg', { c: 'axl' });
  s += `<circle cx="${BX}" cy="${BY}" r="7" style="fill:var(--ink-2)"/>`;
  s += T(300, 60, 'Vertical: T cosθ = mg', { c: 'tk' }) + T(300, 76, 'Horizontal: T sinθ = mv²/r', { c: 'tk' }) + T(300, 92, 'Divide: tanθ = v²/(rg)', { c: 'tk', st: 'fill:var(--accent)' }) + T(300, 108, 'Geometry: r = L sinθ', { c: 'tk' });
  return wrap(s, 'Only two forces act: tension and weight. Don’t draw a separate “centripetal force” — it is the net (horizontal) force, T sinθ.');
}

/* Car on a frictionless banked curve */
function banked() {
  const th = rad(22), A = [40, 200], len = 300;
  const B = [A[0] + len * Math.cos(th), A[1] - len * Math.sin(th)];
  let s = svgOpen(420, 232, 'Cross-section of a frictionless banked curve at angle θ. The only forces on the car are the weight straight down and the normal reaction R perpendicular to the road. R cosθ (vertical) balances mg. R sinθ (horizontal, towards the centre of the curve on the low side) is the centripetal force. The radius of the circle is horizontal, not along the slope.', 'Forces on a car on a banked curve');
  s += defs('p5bk', [['a', ACC], ['i', INK2], ['k', INK]]);
  s += `<path d="M${A[0]} ${A[1]} L${B[0].toFixed(1)} ${B[1].toFixed(1)} L${B[0].toFixed(1)} ${A[1]} Z" style="fill:var(--surface-2);stroke:var(--ink-3)"/>`;
  s += `<path d="M${A[0] + 46} ${A[1]} A46 46 0 0 0 ${(A[0] + 46 * Math.cos(th)).toFixed(1)} ${(A[1] - 46 * Math.sin(th)).toFixed(1)}" style="fill:none;stroke:var(--ink-2)"/>` + T(A[0] + 52, A[1] - 6, 'θ', { c: 'axl' });
  /* car */
  const f = 0.6, cx0 = A[0] + f * len * Math.cos(th), cy0 = A[1] - f * len * Math.sin(th);
  const nx = -Math.sin(th), ny = -Math.cos(th); /* outward normal (screen) */
  const C = [cx0 + nx * 14, cy0 + ny * 14];
  s += `<rect x="${(C[0] - 26).toFixed(1)}" y="${(C[1] - 12).toFixed(1)}" width="52" height="24" rx="5" transform="rotate(${(-22).toFixed(0)} ${C[0].toFixed(1)} ${C[1].toFixed(1)})" style="fill:var(--surface);stroke:var(--ink-2);stroke-width:1.4"/>`;
  const RL = 80, rx = C[0] + nx * RL, ry = C[1] + ny * RL;
  s += AR(C[0], C[1], rx, ry, INK, 'p5bkk', { w: 2.2 }) + T(rx + 8, ry + 2, 'R', { c: 'axl' });
  s += AR(C[0], C[1], C[0], ry, INK2, 'p5bki', { dash: '5 3' }) + T(C[0] + 6, ry + 4, 'R cosθ', { c: 'tk' });
  s += AR(C[0], C[1], rx, C[1], ACC, 'p5bka', { w: 2.2, dash: '5 3' }) + T(rx - 4, C[1] + 16, 'R sinθ = ' + sb('F', 'c'), { a: 'end', c: 'tk', st: 'fill:var(--accent)' });
  s += AR(C[0], C[1], C[0], C[1] + 70, INK, 'p5bkk', { w: 2.2 }) + T(C[0] + 6, C[1] + 66, 'mg', { c: 'axl' });
  s += `<circle cx="${C[0].toFixed(1)}" cy="${C[1].toFixed(1)}" r="3" style="fill:var(--ink)"/>`;
  s += T(14, 22, '← to centre of curve', { c: 'tk' }) + T(14, 36, '(radius is horizontal)', { c: 'tk' });
  return wrap(s, 'Vertical: R cosθ = mg. Horizontal: R sinθ = mv²/r. Dividing gives tanθ = v²/(rg), so v = √(rg tanθ), independent of mass.');
}

/* Roller coaster: top of hill, bottom of dip, top of loop */
function coaster() {
  let s = svgOpen(420, 214, 'Three free-body diagrams. Top of a hill: the centre is below, R is smaller than mg, R = mg − mv²/r. Bottom of a dip: the centre is above, R is larger than mg, R = mg + mv²/r. Upside down at the top of a loop: both R and mg point down to the centre, R = mv²/r − mg.', 'Forces on a roller coaster rider');
  s += defs('p5rc', [['a', ACC], ['k', INK]]);
  const panel = (x0, kind) => {
    const cx = x0 + 66; let o = '';
    if (kind === 'hill') {
      o += `<path d="M${x0 + 6} 96 A80 80 0 0 1 ${x0 + 126} 96" style="fill:none;stroke:var(--ink-3);stroke-width:2"/>`;
      const y = 72; o += `<rect x="${cx - 13}" y="${y - 16}" width="26" height="14" rx="3" style="fill:var(--surface);stroke:var(--ink-2)"/>`;
      o += AR(cx - 8, y - 9, cx - 8, y - 36, INK, 'p5rck', { w: 2 }) + T(cx - 12, y - 30, 'R', { a: 'end', c: 'axl' });
      o += AR(cx + 8, y - 9, cx + 8, y + 50, INK, 'p5rck', { w: 2 }) + T(cx + 12, y + 44, 'mg', { c: 'axl' });
      o += T(cx, 140, 'Top of a hill', { a: 'middle', c: 'axl' }) + T(cx, 156, 'centre below', { a: 'middle', c: 'tk' }) + T(cx, 176, 'R = mg − mv²/r', { a: 'middle', c: 'tk', st: 'fill:var(--accent)' }) + T(cx, 192, 'feel lighter', { a: 'middle', c: 'tk' });
    }
    if (kind === 'dip') {
      o += `<path d="M${x0 + 6} 70 A80 80 0 0 0 ${x0 + 126} 70" style="fill:none;stroke:var(--ink-3);stroke-width:2"/>`;
      const y = 97; o += `<rect x="${cx - 13}" y="${y - 16}" width="26" height="14" rx="3" style="fill:var(--surface);stroke:var(--ink-2)"/>`;
      o += AR(cx - 8, y - 9, cx - 8, y - 78, INK, 'p5rck', { w: 2 }) + T(cx - 12, y - 66, 'R', { a: 'end', c: 'axl' });
      o += AR(cx + 8, y - 9, cx + 8, y + 22, INK, 'p5rck', { w: 2 }) + T(cx + 12, y + 18, 'mg', { c: 'axl' });
      o += T(cx, 140, 'Bottom of a dip', { a: 'middle', c: 'axl' }) + T(cx, 156, 'centre above', { a: 'middle', c: 'tk' }) + T(cx, 176, 'R = mg + mv²/r', { a: 'middle', c: 'tk', st: 'fill:var(--accent)' }) + T(cx, 192, 'feel heavier', { a: 'middle', c: 'tk' });
    }
    if (kind === 'loop') {
      o += `<circle cx="${cx}" cy="72" r="52" style="fill:none;stroke:var(--ink-3);stroke-width:2"/>`;
      const y = 26; o += `<rect x="${cx - 13}" y="${y - 2}" width="26" height="14" rx="3" style="fill:var(--surface);stroke:var(--ink-2)"/>`;
      o += AR(cx - 8, y + 5, cx - 8, y + 36, INK, 'p5rck', { w: 2 }) + T(cx - 12, y + 34, 'R', { a: 'end', c: 'axl' });
      o += AR(cx + 8, y + 5, cx + 8, y + 50, INK, 'p5rck', { w: 2 }) + T(cx + 12, y + 46, 'mg', { c: 'axl' });
      o += T(cx, 140, 'Top of a loop', { a: 'middle', c: 'axl' }) + T(cx, 156, 'upside down, centre below', { a: 'middle', c: 'tk' }) + T(cx, 176, 'R = mv²/r − mg', { a: 'middle', c: 'tk', st: 'fill:var(--accent)' }) + T(cx, 192, 'R ≥ 0 needs v ≥ √(gr)', { a: 'middle', c: 'tk' });
    }
    return o;
  };
  s += panel(6, 'hill') + panel(144, 'dip') + panel(282, 'loop');
  return wrap(s, 'In every case the net force (R and mg added as vectors) points to the centre and equals mv²/r. R is the “apparent weight” the rider feels.');
}

/* 2019 HSC Q26: linear model τ = kθ against τ = rF sinθ */
function torqueModel() {
  const L0 = 46, Tp = 14, W = 340, H = 170, X = a => L0 + a / 90 * W, Y = t => Tp + (1 - t / 160) * H;
  let s = svgOpen(420, 230, 'Torque against angle for a 400 N force at 0.25 m. The student’s linear model τ = 1.7θ is a straight line. The physical model τ = rF sinθ = 100 sinθ curves and levels off at 100 N m at 90 degrees. The two agree closely up to about 25 degrees, then the linear model predicts too much torque.', 'Linear and sine models for torque');
  [0, 40, 80, 120, 160].forEach(t => { s += `<line class="gl" x1="${L0}" x2="${L0 + W}" y1="${Y(t)}" y2="${Y(t)}"/>` + T(L0 - 5, Y(t) + 3.5, t, { a: 'end', c: 'tk' }); });
  [0, 15, 30, 45, 60, 75, 90].forEach(a => { s += `<line class="gl" x1="${X(a)}" x2="${X(a)}" y1="${Tp}" y2="${Tp + H}"/>` + T(X(a), Tp + H + 14, a, { a: 'middle', c: 'tk' }); });
  s += `<rect x="${X(0)}" y="${Tp}" width="${X(25) - X(0)}" height="${H}" style="fill:var(--accent-soft);opacity:.55"/>` + T(X(12.5), Tp + 14, 'data range', { a: 'middle', c: 'tk' });
  s += `<line class="ax" x1="${L0}" x2="${L0}" y1="${Tp}" y2="${Tp + H}"/><line class="ax" x1="${L0}" x2="${L0 + W}" y1="${Tp + H}" y2="${Tp + H}"/>`;
  s += `<path d="M${X(0)} ${Y(0)} L${X(90)} ${Y(153)}" style="fill:none;stroke:var(--ink-2);stroke-width:2;stroke-dasharray:6 4"/>`;
  let d = ''; for (let a = 0; a <= 90; a += 2) d += (a ? ' L' : 'M') + X(a).toFixed(1) + ' ' + Y(100 * Math.sin(rad(a))).toFixed(1);
  s += `<path class="curve" d="${d}"/>`;
  s += T(X(70), Y(132), 'τ = kθ (k = 1.7)', { a: 'end', c: 'tk' }) + T(X(88), Y(110), 'τ = rF sinθ', { a: 'end', c: 'tk', st: 'fill:var(--accent)' });
  s += T(L0 + W / 2, 226, 'Angle θ (degrees)', { a: 'middle', c: 'axl' }) + `<text class="axl" transform="translate(13 ${Tp + H / 2}) rotate(-90)" text-anchor="middle">Torque (N m)</text>`;
  return wrap(s, 'For small angles sinθ is almost proportional to θ, so the line fits the data. At 60° the line predicts 102 N m but rF sinθ gives 86.6 N m; it can never exceed rF = 100 N m.');
}

/* Three classes of lever */
function levers() {
  let s = svgOpen(420, 176, 'Three classes of lever. Class 1: fulcrum between the effort and the load, like a seesaw or pliers. Class 2: load between the fulcrum and the effort, like a wheelbarrow or nutcracker. Class 3: effort between the fulcrum and the load, like the human forearm.', 'Classes of lever');
  s += defs('p5lv', [['a', ACC], ['k', INK]]);
  const draw = (x0, order, title, ex) => {
    const y = 80, w = 116; let o = LN(x0, y, x0 + w, y, 'stroke:var(--ink-2);stroke-width:4;stroke-linecap:round');
    const pos = { 0: x0 + 6, 1: x0 + w / 2, 2: x0 + w - 6 };
    order.forEach((k, i) => {
      const x = pos[i];
      if (k === 'F') o += `<path d="M${x} ${y + 3} l-10 18 h20 z" style="fill:var(--ink-3)"/>` + T(x, y + 36, 'fulcrum', { a: 'middle', c: 'tk' });
      if (k === 'L') o += `<rect x="${x - 10}" y="${y - 22}" width="20" height="18" style="fill:var(--surface-2);stroke:var(--ink-2)"/>` + AR(x, y - 4, x, y + 26, INK, 'p5lvk', { w: 1.8 }) + T(x, y - 28, 'load', { a: 'middle', c: 'tk' });
      if (k === 'E') { const up = order.indexOf('F') !== 1; o += up ? AR(x, y + 34, x, y + 4, ACC, 'p5lva', { w: 2.2 }) + T(x, y - 8, 'effort', { a: 'middle', c: 'tk', st: 'fill:var(--accent)' }) : AR(x, y - 34, x, y - 4, ACC, 'p5lva', { w: 2.2 }) + T(x, y - 40, 'effort', { a: 'middle', c: 'tk', st: 'fill:var(--accent)' }); }
    });
    o += T(x0 + w / 2, 22, title, { a: 'middle', c: 'axl' }) + T(x0 + w / 2, 150, ex, { a: 'middle', c: 'tk' });
    return o;
  };
  s += draw(14, ['E', 'F', 'L'], 'Class 1', 'seesaw, pliers') + draw(152, ['F', 'L', 'E'], 'Class 2', 'wheelbarrow, nutcracker') + draw(290, ['F', 'E', 'L'], 'Class 3', 'human forearm');
  return wrap(s, 'Remember the middle item: Class 1 fulcrum, Class 2 load, Class 3 effort (“F-L-E, 1-2-3”).');
}

/* Radial gravitational field and orbital radius */
function field() {
  const CX = 120, CY = 116, R = 52;
  let s = svgOpen(420, 232, 'A planet of radius R with gravitational field lines pointing radially inwards; the lines spread out with distance so the field weakens. A satellite at altitude h has orbital radius r = R + h measured from the planet’s centre.', 'Radial gravitational field');
  s += defs('p5fd', [['i', INK2], ['a', ACC]]);
  s += `<circle cx="${CX}" cy="${CY}" r="${R}" style="fill:var(--surface-2);stroke:var(--ink-2);stroke-width:1.5"/>`;
  for (let k = 1; k < 12; k++) { const t = k * Math.PI / 6; s += AR(CX + 108 * Math.cos(t), CY + 108 * Math.sin(t), CX + (R + 6) * Math.cos(t), CY + (R + 6) * Math.sin(t), INK2, 'p5fdi', { w: 1.3 }); }
  s += T(CX, CY - 12, 'M', { a: 'middle', c: 'axl' });
  const SX = 330, SY = CY;
  s += `<rect x="${SX - 7}" y="${SY - 7}" width="14" height="14" style="fill:var(--accent)"/>` + T(SX, SY - 14, 'satellite, m', { a: 'middle', c: 'tk' });
  s += LN(CX, CY + 0, CX + R, CY, 'stroke:var(--ink);stroke-width:1.4') + T(CX + R / 2, CY + 16, 'R', { a: 'middle', c: 'axl' });
  s += LN(CX + R, CY, SX - 8, SY, 'stroke:var(--accent);stroke-width:1.4;stroke-dasharray:5 3') + T((CX + R + SX) / 2, CY + 16, 'h (altitude)', { a: 'middle', c: 'tk' });
  s += LN(CX, CY + 40, SX, CY + 40, 'stroke:var(--ink-3)') + LN(CX, CY + 34, CX, CY + 46, 'stroke:var(--ink-3)') + LN(SX, CY + 34, SX, CY + 46, 'stroke:var(--ink-3)');
  s += T(270, CY + 56, 'r = R + h', { a: 'middle', c: 'axl', st: 'fill:var(--accent)' });
  return wrap(s, 'Field lines point towards the centre (gravity only attracts). Closer lines = stronger field. Always use the centre-to-centre distance r in F = GMm/r² and g = GM/r².');
}

/* U, K and E against orbital radius */
function energyCurve() {
  const L0 = 46, Tp = 14, W = 340, H = 186, X = r => L0 + (r - 1) / 5 * W, Y = e => Tp + (0.6 - e) / 1.7 * H;
  let s = svgOpen(420, 238, 'Energy of a satellite against orbital radius in units of the planet radius. Gravitational potential energy U = −GMm/r is negative and rises towards zero at large r. Kinetic energy K = GMm/2r is positive and falls towards zero. Total energy E = −GMm/2r is negative, half of U, and also rises towards zero.', 'Orbital energy against radius');
  [-1, -0.5, 0, 0.5].forEach(e => { s += `<line class="gl" x1="${L0}" x2="${L0 + W}" y1="${Y(e)}" y2="${Y(e)}"/>` + T(L0 - 5, Y(e) + 3.5, String(e).replace('-', '−'), { a: 'end', c: 'tk' }); });
  [1, 2, 3, 4, 5, 6].forEach(r => { s += T(X(r), Y(-1.1) + 16, r === 1 ? 'R' : r + 'R', { a: 'middle', c: 'tk' }); });
  s += `<line class="ax" x1="${L0}" x2="${L0}" y1="${Tp}" y2="${Y(-1.1)}"/><line x1="${L0}" x2="${L0 + W}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--ink-2);stroke-width:1.4"/>`;
  const curve = (f, st) => { let d = ''; for (let i = 0; i <= 100; i++) { const r = 1 + 5 * i / 100; d += (i ? ' L' : 'M') + X(r).toFixed(1) + ' ' + Y(f(r)).toFixed(1); } return `<path d="${d}" style="fill:none;${st}"/>`; };
  s += curve(r => -1 / r, 'stroke:var(--accent);stroke-width:2.6') + curve(r => 1 / (2 * r), 'stroke:var(--ink-2);stroke-width:2') + curve(r => -1 / (2 * r), 'stroke:var(--ink-2);stroke-width:2;stroke-dasharray:6 4');
  [['U = −GMm/r', 'stroke:var(--accent);stroke-width:2.6'], ['K = GMm/2r', 'stroke:var(--ink-2);stroke-width:2'], ['E = U + K = −GMm/2r', 'stroke:var(--ink-2);stroke-width:2;stroke-dasharray:6 4']].forEach(([t, st], i) => { const y = Y(0.52) + i * 15; s += LN(X(3.2), y, X(3.6), y, st) + T(X(3.7), y + 4, t, { c: 'tk' }); });
  s += T(L0 + W / 2, 234, 'Orbital radius r', { a: 'middle', c: 'axl' }) + `<text class="axl" transform="translate(13 ${Tp + H / 2}) rotate(-90)" text-anchor="middle">Energy (units of GMm/R)</text>`;
  return wrap(s, 'U = 0 at infinity, so U and E are always negative. Moving to a higher orbit: U and E increase (become less negative) but K decreases. Work must be done on the satellite to raise it.');
}

/* Kepler’s second law: equal areas in equal times */
function kepler() {
  const a = 130, e = 0.6, b = a * Math.sqrt(1 - e * e), CX = 205, CY = 118, FX = CX + a * e;
  const pos = M => { let E = M; for (let i = 0; i < 30; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); return [CX + a * Math.cos(E), CY - b * Math.sin(E)]; };
  let s = svgOpen(420, 250, 'An exaggerated elliptical orbit with the Sun at one focus. Two shaded sectors swept out in equal times have equal areas: the one near the Sun (perihelion) is short and wide because the planet moves fast; the one far from the Sun (aphelion) is long and thin because the planet moves slowly.', 'Kepler’s law of equal areas');
  s += `<ellipse cx="${CX}" cy="${CY}" rx="${a}" ry="${b.toFixed(1)}" style="fill:none;stroke:var(--ink-2);stroke-width:1.5"/>`;
  const sector = (M0, dM, st) => { let d = `M${FX.toFixed(1)} ${CY}`; for (let i = 0; i <= 24; i++) { const p = pos(M0 + dM * i / 24); d += ` L${p[0].toFixed(1)} ${p[1].toFixed(1)}`; } return `<path d="${d} Z" style="${st}"/>`; };
  const dM = 0.55;
  s += sector(-dM / 2, dM, 'fill:var(--accent-soft);stroke:var(--accent);stroke-width:1.2');
  s += sector(Math.PI - dM / 2, dM, 'fill:var(--accent-soft);stroke:var(--accent);stroke-width:1.2');
  s += `<circle cx="${FX.toFixed(1)}" cy="${CY}" r="9" style="fill:#F2B705;stroke:var(--ink-3)"/>` + T(FX - 14, CY + 34, 'Sun (at a focus)', { a: 'end', c: 'tk' });
  s += `<circle cx="${(CX - a * e).toFixed(1)}" cy="${CY}" r="2.5" style="fill:var(--ink-3)"/>` + T(CX - a * e, CY + 34, 'empty focus', { a: 'middle', c: 'tk' });
  s += T(CX + a + 6, CY - 4, 'perihelion:', { c: 'tk' }) + T(CX + a + 6, CY + 10, 'fastest', { c: 'tk' });
  s += T(CX - a - 6, CY - 4, 'aphelion:', { a: 'end', c: 'tk' }) + T(CX - a - 6, CY + 10, 'slowest', { a: 'end', c: 'tk' });
  s += T(CX, 244, 'Equal shaded areas are swept out in equal times', { a: 'middle', c: 'axl' });
  return wrap(s, 'Eccentricity exaggerated (0.6) so the effect is visible; planetary orbits are close to circles (the Moon’s eccentricity is 0.0549).');
}

/* ---------- Tables ---------- */
const geoLeo = () => tbl(['Feature', 'Geostationary (GEO)', 'Low Earth orbit (LEO)'], [
  ['Position', 'Fixed above one point on the equator', 'Moves across the sky; can pass over any point'],
  ['Period', '1 sidereal day: 23 h 56 min 4 s (86 164 s)', 'About 1.5–2 hours, many orbits a day'],
  ['Altitude', 'About 35 900 km', '250–1000 km (below the Van Allen belts)'],
  ['View', 'About one-third of Earth’s surface', 'Whole surface over several orbits'],
  ['Advantages', 'Easy to track (dish stays pointed); no atmospheric drag', 'Short signal delay; cheaper launch; detailed images'],
  ['Disadvantages', 'Signal delay; expensive launch; poor polar coverage; more cosmic-ray damage', 'Hard to track; atmospheric drag causes orbital decay'],
  ['Uses', 'Communications (e.g. Foxtel), weather monitoring', 'Remote sensing, mapping, crop and desert studies, ISS, Hubble, spy satellites (polar)']
], 'From the comparison table in your booklet.');

const satTable = () => tbl(['Satellite', 'Altitude', 'Orbital radius', 'Period', 'Speed'], [
  ['LEO (lower limit)', '250 km', '6.621 × 10⁶ m', '1.49 h (89.2 min)', '7.77 × 10³ m s⁻¹'],
  ['ISS', '408 km', '6.779 × 10⁶ m', '92.4 min', '7.68 × 10³ m s⁻¹'],
  ['LEO (upper limit)', '1000 km', '7.371 × 10⁶ m', '1.75 h', '7.37 × 10³ m s⁻¹'],
  ['Geostationary', '3.58 × 10⁴ km', '4.22 × 10⁷ m', '86 164 s', '3.08 × 10³ m s⁻¹']
], 'Using M = 6.0 × 10²⁴ kg and R = 6.371 × 10⁶ m from the data sheet.');

const planetTable = () => tbl(['Body', 'Mass (kg)', 'Radius (m)', 'g (N kg⁻¹)', 'Weight of 60.0 kg (N)'], [
  ['Mercury', '3.58 × 10²³', '2.439 × 10⁶', '4.01', '241'],
  ['Venus', '4.90 × 10²⁴', '6.052 × 10⁶', '8.92', '535'],
  ['Earth', '5.97 × 10²⁴', '6.371 × 10⁶', '9.81', '589'],
  ['Moon', '7.35 × 10²²', '1.738 × 10⁶', '1.62', '97.4'],
  ['Mars', '6.42 × 10²³', '3.398 × 10⁶', '3.71', '223'],
  ['Pluto', '1.27 × 10²²', '1.160 × 10⁶', '0.63', '37.8']
], 'g = GM/r² with r = diameter ÷ 2 from the booklet’s practical table.');

const formulaTable = () => tbl(['Relationship', 'On data sheet?', 'Notes'], [
  ['v = u + at, s = ut + ½at², v² = u² + 2as', 'Yes', 'Use separately for horizontal and vertical'],
  ['a<sub>c</sub> = v²/r, F<sub>c</sub> = mv²/r, v = 2πr/T, ω = Δθ/t', 'Yes', 'Circular motion'],
  ['τ = r⊥F = rF sinθ', 'Yes', 'Torque'],
  ['F = GMm/r², U = −GMm/r, r³/T² = GM/4π²', 'Yes', 'Gravitation'],
  ['g = GM/r²', 'No (from F = mg)', 'Field strength at distance r'],
  ['v = √(rg tanθ)', 'No – derive', 'Frictionless banked curve'],
  ['v = rω, a<sub>c</sub> = ω²r', 'No', 'From v = 2πr/T'],
  ['v = √(GM/r), K = GMm/2r, E = −GMm/2r', 'No – derive', 'Set F<sub>c</sub> = gravitational force'],
  ['v<sub>esc</sub> = √(2GM/r)', 'No – derive', 'From K + U = 0']
], 'The derived ones are popular “show that” questions.');

const keplerTable = () => tbl(['Planet', 'Orbit radius (au)', 'Period'], [
  ['Mercury', '0.30 (booklet) or 0.39 (true)', '59 days (booklet) – actually 88 days'],
  ['Venus', '0.72', '0.615 years (225 days)'],
  ['Saturn', '9.50', '29.46 years'],
  ['Pluto', '39.3', '248 years']
], 'Using k = r³/T² = 39.3³/248² = 0.987 au³ yr⁻² from Pluto’s row.');

const VIZ = {
  p5traj: trajectory, p5graphs: vtGraphs, p5range: rangeAngle, p5cliff: cliff, p5circle: centripetal, p5conical: conical,
  p5banked: banked, p5coaster: coaster, p5tqmodel: torqueModel, p5levers: levers, p5field: field, p5energy: energyCurve,
  p5kepler: kepler, p5geoleo: geoLeo, p5sats: satTable, p5planets: planetTable, p5formulas: formulaTable, p5kepltbl: keplerTable
};

const DECKS = [];

/* ================= 5.1 PROJECTILE MOTION ================= */
DECKS.push({ id: 'phys-m5-pm', fa: 'fa1', title: 'Modelling projectiles', dps: ['5.1.1', '5.1.2', '5.1.4'], cards: [
  { id: 'p5pm01', dp: '5.1.1', t: 'def', q: 'What does NESA mean by a <b>model</b>, and what is a “mathematical model” in Physics questions?',
    a: P('A model is a representation that describes, simplifies, clarifies or explains the workings, structure or relationships within an object, system or idea.') + P('Any equation that lets you work out information about a system is a <b>mathematical model</b> of it. If a question asks about a mathematical model, it means an equation.') },
  { id: 'p5pm02', dp: '5.1.1', t: 'def', q: 'Define a <b>field</b> (NESA) and describe a gravitational field.',
    a: P('A field is a region in which a body experiences a force due to the effects of another body (its mass, charge or magnetic properties).') + P('A gravitational field exists around every mass and exerts an <b>attractive</b> force on other masses. Fields have direction, so they are vectors.') },
  { id: 'p5pm03', dp: '5.1.1', t: 'con', q: 'Distinguish between <b>mass</b> and <b>weight</b>.',
    a: L(['<b>Mass</b>: the amount of matter in an object. Scalar, measured in kg.', '<b>Weight</b>: the force on an object due to a gravitational field. Vector, measured in N, directed towards the centre of the large mass causing the field (say “towards the centre of the Earth”, not just “down”).']) + E('F_{g} = mg  (W = mg)') },
  { id: 'p5pm04', dp: '5.1.1', t: 'con', q: 'Why is it “better physics” to call g = 9.8 N kg^{-1} the <b>gravitational field strength</b> rather than the acceleration due to gravity (9.8 m s^{-2})?',
    a: P('The units are equivalent (1 N = 1 kg m s^{-2}), so neither is wrong. But field strength describes the field itself: how many newtons of force act on each kilogram placed in it. An object only accelerates at 9.8 m s^{-2} if gravity is the only force acting.') },
  { id: 'p5pm05', dp: '5.1.1', t: 'rec', q: 'At sea level g varies from 9.782 N kg^{-1} at the equator to 9.832 N kg^{-1} at the poles. Give three reasons g varies around the Earth.',
    a: L(['The crust varies in <b>thickness and density</b> (plate boundaries, dense mineral deposits), causing local variations.', 'The Earth is <b>flatter at the poles</b>, so the poles are closer to the centre and g is larger there.', 'The Earth’s <b>spin</b> (a “centrifuge” effect) reduces the measured g, most at the equator.']) },
  { id: 'p5pm06', dp: '5.1.1', t: 'def', q: 'Define <b>projectile</b>, <b>trajectory</b> and <b>range</b>.',
    a: L(['<b>Projectile</b>: an object that is projected (thrown, dropped or launched) into the air but not propelled like a rocket. Once it leaves the launcher, the only force we consider is the gravitational force.', '<b>Trajectory</b>: the path of a projectile; a parabola when gravity is the only force.', '<b>Range</b>: the horizontal displacement from the launch point.']) },
  { id: 'p5pm07', dp: '5.1.1', t: 'def', q: 'Define <b>terminal velocity</b> and list the factors that affect its size.',
    a: P('The constant velocity a falling object reaches when the drag force equals its weight in magnitude (opposite direction), so the net force is zero.') + L(['Cross-sectional area perpendicular to the motion (larger area, more drag).', 'Density of the air (denser air near the ground, more drag).', 'The <b>square</b> of the speed: at 10 m s^{-1} drag is four times that at 5 m s^{-1}.', 'Shape, surface smoothness and the turbulence they cause.']) },
  { id: 'p5pm08', dp: '5.1.1', t: 'eq', q: 'An object falls straight down with a drag force acting on it. Write the expression for its acceleration (down positive).',
    a: E('F_{net} = mg − F_{drag} = ma') + E('a = ' + F('mg − F_{drag}', 'm')) + N('Only use this if you are given a drag force. Otherwise the syllabus model ignores air resistance, so a = g.') },
  { id: 'p5pm09', dp: '5.1.1', t: 'con', q: 'What two assumptions does the syllabus projectile model make, and how does air resistance change a real trajectory?',
    a: L(['A <b>constant vertical acceleration</b> due to gravity (9.8 m s^{-2} down near the Earth’s surface).', '<b>Zero air resistance</b>.']) + P('Real air resistance <b>reduces both the maximum height and the range</b>. Its exact effect depends on the speed, shape, size and spin of the projectile, so ignore it unless you are given a value for the drag.') },
  { id: 'p5pm10', dp: '5.1.1', t: 'con', q: 'Explain why, with no air resistance, a 2 kg mass and a 20 kg mass fall with the same acceleration.',
    a: P('The only force is the weight, so F_{net} = mg = ma. The mass cancels, leaving a = g.') + P('For example, the 2 kg mass has 19.6 N on it: a = 19.6 ÷ 2 = 9.8 m s^{-2}. A larger mass has a proportionally larger weight, so the acceleration is the same.') },
  { id: 'p5pm11', dp: '5.1.1', t: 'con', q: 'Describe the horizontal and vertical components of a projectile’s motion and how they are combined.',
    a: L(['<b>Horizontal</b>: constant velocity (no horizontal force when air resistance is ignored), so s_{x} = u_{x}t.', '<b>Vertical</b>: uniform acceleration of 9.8 m s^{-2} towards the centre of the Earth.', 'The two components are <b>independent</b>; the <b>time of flight</b> is the link between them.', 'Add the components as vectors at right angles to get the actual velocity, which is always a tangent to the path.']), v: 'p5traj' },
  { id: 'p5pm12', dp: '5.1.1', t: 'con', q: 'Describe Galileo’s experiment with a moving ship and what it showed about projectile motion.',
    a: P('Galileo dropped a cannon ball from the mast of a moving ship. It landed at the base of the mast rather than being “left behind”, as followers of Aristotle expected.') + P('This showed the horizontal and vertical motions are independent: the ball kept the ship’s horizontal velocity (no horizontal acceleration) while accelerating downwards at about 9.8 m s^{-2}.') },
  { id: 'p5pm13', dp: '5.1.2', t: 'con', q: 'What is the velocity and the acceleration of a projectile at the very top of its path?',
    a: P('The <b>vertical</b> velocity is zero, but the projectile still has its full horizontal velocity, u cosθ, so its velocity is <b>not</b> zero. It is horizontal.') + P('The acceleration is still 9.8 m s^{-2} downwards, as it is for the whole flight.'), v: 'p5traj' },
  { id: 'p5pm14', dp: '5.1.4', t: 'con', q: 'Why must you never mix horizontal and vertical quantities in one equation of motion, and how can you avoid it?',
    a: P('The components are independent: horizontal motion has a = 0 and vertical motion has a = g. Putting, say, a horizontal velocity into a vertical equation gives nonsense.') + P('Use <b>subscripts</b> in your data list (u_{x}, u_{y}, s_{x}, s_{y}, a_{y} = −9.8 m s^{-2}) and keep one list for each direction.') },
  { id: 'p5pm15', dp: '5.1.1', t: 'con', q: 'Describe the displacement–time, velocity–time and acceleration–time graphs for a ball thrown straight up that returns to the hand (up positive).',
    a: L(['<b>s–t</b>: an upside-down parabola from zero, up to the peak and back to zero. Its gradient (tangent) is the velocity. Negative s would mean below the release point.', '<b>v–t</b>: a straight line from +u, through zero at the peak, to −u. Its gradient is the acceleration.', '<b>a–t</b>: a horizontal line at −9.8 m s^{-2} for the whole flight, because the only force is the weight, acting down.']), v: 'p5graphs' },
  { id: 'p5pm16', dp: '5.1.4', t: 'eq', q: 'List the equations of uniformly accelerated motion and state when they can be used.',
    a: E('v = u + at') + E('s = ut + ½at^2') + E('v^2 = u^2 + 2as') + E('a = ' + F('v − u', 't') + '   v_{av} = ' + F('u + v', '2')) + P('Only when the acceleration is constant (or zero) and the motion is in one dimension. The average-velocity formula can’t be used when a question has a constant-velocity part and an accelerated part.') },
  { id: 'p5pm17', dp: '5.1.4', t: 'rec', q: 'What does the <b>GUESS</b> technique for calculations stand for?',
    a: OL(['<b>Given</b>: highlight the data and write a data list with symbols (unknown with “?”).', '<b>Units</b>: convert everything to SI units.', '<b>Equation</b>: write the equation you will use.', '<b>Substitute</b>: show the values going in.', '<b>Solution</b>: write the calculator value (one extra figure with “…”), then round to the right significant figures with units, and a direction for vectors.']) },
  { id: 'p5pm18', dp: '5.1.4', t: 'rec', q: 'What are the significant figure and rounding rules your booklet expects in calculations?',
    a: L(['Multiplying or dividing: the answer has as many significant figures as the <b>least precise measured</b> value. Constants such as g = 9.8 m s^{-2} don’t limit it.', 'Adding or subtracting: round to the fewest decimal places in the data.', 'Store <b>unrounded</b> answers and use them in later parts.', 'Write the calculator answer with one extra figure and “…”, then the rounded answer with units.']) },
  { id: 'p5pm19', dp: '5.1.4', t: 'con', q: 'What must every vector answer include, and what should you state before solving a projectile question?',
    a: P('<b>MUD</b>: magnitude, units and direction. If a question asks only for the <b>magnitude</b> of a vector, you can leave out the direction but must still give units.') + P('State your sign convention first, e.g. “let up be positive”, so the marker can follow your negative values.') }
]});

DECKS.push({ id: 'phys-m5-ua', fa: 'fa1', title: 'Vertical motion (Worksheet 1)', dps: ['5.1.4'], cards: [
  { id: 'p5ua01', dp: '5.1.4', t: 'calc', q: 'An object is dropped from a height of 90.0 m. Ignoring air resistance, find its velocity on impact and the time it takes to reach the ground.',
    a: E('v^2 = u^2 + 2as = 0 + 2 × 9.8 × 90.0 → v = 42.0 m s^{-1} downwards') + E('t = ' + F('v − u', 'a') + ' = ' + F('42.0', '9.8') + ' = 4.29 s') },
  { id: 'p5ua02', dp: '5.1.4', t: 'calc', q: 'A stone dropped down a well takes 3.5 s to reach the water. How deep is the well?',
    a: E('s = ut + ½at^2 = 0 + ½ × 9.8 × 3.5^2 = 60 m') },
  { id: 'p5ua03', dp: '5.1.4', t: 'calc', q: 'A ball is launched straight up from ground level at 20.5 m s^{-1}. Find its maximum height and the time until it returns to the hand.',
    a: P('Up positive, a = −9.8 m s^{-2}, v = 0 at the top.') + E('0 = 20.5^2 + 2(−9.8)s → s = 21.4 m above the launch point') + E('t_{up} = ' + F('20.5', '9.8') + ' = 2.09 s, so t_{total} = 2 × 2.09 = 4.18 s') },
  { id: 'p5ua04', dp: '5.1.4', t: 'calc', q: 'A stone is thrown up at 18 m s^{-1} from the edge of a 25 m cliff. It misses the edge on the way down and lands at the bottom. Find its time in the air and its speed just before hitting the ground.',
    a: P('Up positive, so the ground is at s = −25 m.') + E('−25 = 18t − 4.9t^2 → 4.9t^2 − 18t − 25 = 0') + E('t = ' + F('18 + ' + SQ('18^2 + 4 × 4.9 × 25'), '9.8') + ' = 4.75 s') + E('v^2 = 18^2 + 2(−9.8)(−25) = 814 → v = 28.5 m s^{-1} downwards') + N('Your booklet rounds these to 4.7 s and 29 m s^{-1}.') },
  { id: 'p5ua05', dp: '5.1.4', t: 'calc', q: 'A hammer is thrown down from scaffolding 18.0 m high at 14.0 m s^{-1}. Find its impact velocity and its time in the air.',
    a: P('Down positive.') + E('v^2 = 14.0^2 + 2 × 9.8 × 18.0 = 548.8 → v = 23.4 m s^{-1} downwards') + E('t = ' + F('23.4 − 14.0', '9.8') + ' = 0.962 s') },
  { id: 'p5ua06', dp: '5.1.4', t: 'calc', q: 'A mortar fires a shell straight up at 14.7 m s^{-1} from point O on a 49.0 m building. It falls back to O. Show its speed is 14.7 m s^{-1} when it returns to O and find the time taken.',
    a: P('At O the displacement is zero: v^2 = u^2 + 2a(0), so v^2 = u^2 and the speed is 14.7 m s^{-1} (now downwards).') + E('−14.7 = 14.7 − 9.8t → t = 3.00 s') },
  { id: 'p5ua07', dp: '5.1.4', t: 'calc', q: 'The same shell (14.7 m s^{-1} up from the top of a 49.0 m building) misses the building and falls to the ground. Find the total time of flight in one step, and the impact velocity.',
    a: E('−49.0 = 14.7t − 4.9t^2 → t^2 − 3t − 10 = 0 → (t − 5)(t + 2) = 0') + P('t = 5.00 s (reject −2 s).') + E('v = 14.7 − 9.8 × 5.00 = −34.3 → 34.3 m s^{-1} downwards') },
  { id: 'p5ua08', dp: '5.1.4', t: 'calc', q: 'A projectile is fired straight up at 7.0 × 10^{1} m s^{-1}. Find its velocity and height after 4.0 s and after 8.0 s.',
    a: P('Up positive, a = −9.8 m s^{-2}.') + L(['t = 4.0 s: v = 70 − 39.2 = 30.8 m s^{-1} <b>up</b>; s = 70(4.0) − 4.9(4.0)^2 = 202 m', 't = 8.0 s: v = 70 − 78.4 = −8.4 → 8.4 m s^{-1} <b>down</b>; s = 560 − 313.6 = 246 m']) + N('Booklet: 31 m s^{-1} up at 2.0 × 10^2 m, and 8.4 m s^{-1} down at 250 m (2 significant figures).') },
  { id: 'p5ua09', dp: '5.1.4', t: 'calc', q: 'For the projectile fired up at 7.0 × 10^{1} m s^{-1}, find the maximum height and the time until it hits the ground again.',
    a: E('0 = 70^2 − 2 × 9.8 × s → s = 250 m') + E('t = ' + F('2u', 'g') + ' = ' + F('2 × 70', '9.8') + ' = 14.3 s ≈ 14 s') },
  { id: 'p5ua10', dp: '5.1.4', t: 'calc', q: 'A rocket’s power is cut 0.750 km above the pad while moving up at 29.0 m s^{-1}. Find its maximum height, the time to reach it, and the time from cut-off to crashing.',
    a: E('extra height = ' + F('29.0^2', '2 × 9.8') + ' = 42.9 m → maximum = 793 m') + E('t = ' + F('29.0', '9.8') + ' = 2.96 s') + E('−750 = 29.0t − 4.9t^2 → t = 15.7 s') },
  { id: 'p5ua11', dp: '5.1.4', t: 'con', q: 'Give three ways to find the time of flight of an object thrown up from a cliff that lands below its launch point.',
    a: OL(['Split it: time to the peak (v = 0), extra height gained, then time to fall from the peak to the ground; add the times.', 'Find the impact velocity first with v^2 = u^2 + 2as, then use v = u + at.', 'Use s = ut + ½at^2 in one step with s = −h (up positive) and solve the quadratic, keeping the positive root.']) },
  { id: 'p5ua12', dp: '5.1.2', t: 'con', q: 'Why does an object thrown straight up return to its launch point with the same speed it was launched with (no air resistance)?',
    a: P('Back at the launch point the displacement is zero, so v^2 = u^2 + 2a(0) gives v^2 = u^2. The speed is the same; only the direction is reversed. The motion is symmetrical: equal times up and down.') }
]});

DECKS.push({ id: 'phys-m5-hz', fa: 'fa1', title: 'Horizontally launched projectiles', dps: ['5.1.2', '5.1.3', '5.1.4'], cards: [
  { id: 'p5hz01', dp: '5.1.2', t: 'con', q: 'List the key facts for a projectile launched <b>horizontally</b> from a raised point.',
    a: L(['The launch velocity <b>is</b> the horizontal component, and it stays constant.', 'The initial vertical velocity is zero (u_{y} = 0): the surface’s reaction force stops acting as it leaves the edge.', 'So the time of flight depends only on the height (or the height can be found from the time).', 'Velocity at any instant: find v_{y} from vertical data only, then add it to v_{x} at right angles (Pythagoras), and give the angle to the horizontal.']) },
  { id: 'p5hz02', dp: '5.1.2', t: 'con', q: 'A ball rolls off a table horizontally. If its launch speed is increased, what happens to its time of flight, range and impact velocity?',
    a: L(['<b>Time of flight: unchanged.</b> It takes exactly as long as an object simply dropped from that height (u_{y} = 0 either way).', 'Range: increases (s_{x} = u_{x}t).', 'Impact velocity: larger, and at a smaller angle below the horizontal.']) },
  { id: 'p5hz03', dp: '5.1.4', t: 'calc', q: 'A lifeboat is dropped from a plane flying horizontally at 140 m s^{-1} at a height of 1102.5 m. Give its initial horizontal and vertical velocities and find the time it takes to fall.',
    a: E('u_{x} = 140 m s^{-1},  u_{y} = 0') + E('1102.5 = ½ × 9.8 × t^2 → t = 15.0 s') },
  { id: 'p5hz04', dp: '5.1.4', t: 'calc', q: 'For the lifeboat (140 m s^{-1} horizontally from 1102.5 m, t = 15.0 s), find its range and its velocity just before impact.',
    a: E('range = 140 × 15.0 = 2.10 × 10^3 m') + E('v_{x} = 140 m s^{-1},  v_{y} = 9.8 × 15.0 = 147 m s^{-1} down') + E('v = ' + SQ('140^2 + 147^2') + ' = 203 m s^{-1}') + E('θ = tan^{-1}(147 ÷ 140) = 46.4° below the horizontal') },
  { id: 'p5hz05', dp: '5.1.4', t: 'calc', q: 'For the lifeboat (140 m s^{-1} horizontally from 1102.5 m), find its velocity 3 s after release and its height 5 s after release.',
    a: E('v_{y} = 9.8 × 3 = 29.4 m s^{-1} → v = ' + SQ('140^2 + 29.4^2') + ' = 143 m s^{-1} at 11.9° below the horizontal') + E('fallen ½ × 9.8 × 5^2 = 122.5 m → height = 1102.5 − 122.5 = 980 m') },
  { id: 'p5hz06', dp: '5.1.4', t: 'calc', q: 'A ball is thrown horizontally at 15.0 m s^{-1} from the top of a 45.0 m building. How long does it take to land, and how far from the base?',
    a: E('45.0 = ½ × 9.8 × t^2 → t = 3.03 s') + E('s_{x} = 15.0 × 3.03 = 45.5 m') },
  { id: 'p5hz07', dp: '5.1.4', t: 'calc', q: 'A stone is launched horizontally at 30.0 m s^{-1} from a 40.0 m cliff. Find the time to reach the bottom and the horizontal distance to the landing point.',
    a: E('40.0 = ½ × 9.8 × t^2 → t = 2.86 s') + E('s_{x} = 30.0 × 2.857 = 85.7 m') },
  { id: 'p5hz08', dp: '5.1.4', t: 'calc', q: 'The stone (30.0 m s^{-1} horizontally from a 40.0 m cliff) passes a climber 25.0 m above the ground. When? And how high is it after 2.0 s?',
    a: P('It has fallen 15.0 m when it passes the climber:') + E('15.0 = ½ × 9.8 × t^2 → t = 1.75 s') + E('after 2.0 s: fallen ½ × 9.8 × 2.0^2 = 19.6 m → height = 20.4 m') },
  { id: 'p5hz09', dp: '5.1.4', t: 'calc', q: 'In a film stunt a car drives horizontally off a 30.0 m cliff at 15.0 m s^{-1}. Find the time to reach the ground, the horizontal distance and the angle of impact.',
    a: E('30.0 = ½ × 9.8 × t^2 → t = 2.47 s') + E('s_{x} = 15.0 × 2.474 = 37.1 m') + E('v_{y}^2 = 2 × 9.8 × 30.0 → v_{y} = 24.2 m s^{-1}') + E('θ = tan^{-1}(24.2 ÷ 15.0) = 58.3° below the horizontal') },
  { id: 'p5hz10', dp: '5.1.4', t: 'calc', q: 'A shooter aims a rifle horizontally at a target 300.0 m away. The bullet leaves at 2500.0 m s^{-1}. How far below the centre does it hit?',
    a: E('t = ' + F('300.0', '2500.0') + ' = 0.1200 s') + E('s_{y} = ½ × 9.8 × 0.1200^2 = 0.0706 m = 7.06 cm below the centre') },
  { id: 'p5hz11', dp: '5.1.4', t: 'calc', q: 'A bullet fired horizontally at a target 250.0 m away hits 15.05 cm below the centre. What was its launch speed?',
    a: E('0.1505 = ½ × 9.8 × t^2 → t = 0.1753 s') + E('u = ' + F('250.0', '0.1753') + ' = 1.43 × 10^3 m s^{-1}') },
  { id: 'p5hz12', dp: '5.1.3', t: 'prac', q: 'Outline an investigation into how launch height affects the range of a horizontally launched projectile with constant speed. How would you analyse the data?',
    a: L(['<b>Independent</b>: launch height h. <b>Dependent</b>: range. <b>Controlled</b>: launch speed (release the ball from the same mark on a ramp), same ball, launch exactly horizontal.', 'Measure h from the floor to the launch point; mark landing spots with carbon paper and measure from the point directly below the edge (plumb line).', 'Use at least five heights and repeat each 3 or more times, averaging (reliability).']) + P('Analysis: t = ' + SQ('2h/g') + ', so R = u' + SQ('2h/g') + ' and R ∝ ' + SQ('h') + '. Plot R against ' + SQ('h') + ' (or R^2 against h): a straight line through the origin validates the model.') },
  { id: 'p5hz13', dp: '5.1.1', t: 'exam', q: 'One ball is dropped and an identical ball is fired horizontally from the same height at the same instant. Which reaches the ground first? Explain.',
    a: P('They land at the same time. Vertical and horizontal motions are independent: both balls have u_{y} = 0 and the same vertical acceleration, so they fall the same height in the same time. The fired ball simply travels further horizontally while it falls.') },
  { id: 'p5hz14', dp: '5.1.4', t: 'calc', q: 'A lolly rolls off a 75.0 cm high table at 35.0 cm s^{-1} and hits a sleeping cat whose head is 10.0 cm above the floor. Find the horizontal distance to the cat and the lolly’s velocity when it hits.',
    a: E('falls 0.650 m: t = ' + SQ('2 × 0.650 ÷ 9.8') + ' = 0.364 s') + E('s_{x} = 0.350 × 0.364 = 0.127 m') + E('v_{y} = 9.8 × 0.364 = 3.57 m s^{-1} → v = 3.59 m s^{-1} at 84.4° to the floor') + N('Your booklet’s answer of 0.137 m is an arithmetic slip; 0.350 × 0.3642 = 0.127 m.') }
]});

DECKS.push({ id: 'phys-m5-ag', fa: 'fa1', title: 'Launched at an angle', dps: ['5.1.2', '5.1.4'], cards: [
  { id: 'p5ag01', dp: '5.1.2', t: 'eq', q: 'How do you resolve a launch velocity u at angle θ above the horizontal? Do it for 75.0 m s^{-1} at 50.0°.',
    a: E('u_{x} = u cosθ    u_{y} = u sinθ') + E('u_{x} = 75.0 cos50.0° = 48.2 m s^{-1}    u_{y} = 75.0 sin50.0° = 57.5 m s^{-1}') + N('Keep the unrounded values (48.209…, 57.453…) for later steps.') },
  { id: 'p5ag02', dp: '5.1.2', t: 'calc', q: 'A projectile is launched at 50.0 m s^{-1} at 80.0° to the horizontal. Find the horizontal and vertical components.',
    a: E('u_{x} = 50.0 cos80.0° = 8.68 m s^{-1}') + E('u_{y} = 50.0 sin80.0° = 49.2 m s^{-1}') },
  { id: 'p5ag03', dp: '5.1.2', t: 'calc', q: 'Find the missing values (Worksheet 3 table): (1) 50.0 m s^{-1} at 60.0°; (2) 60.0 m s^{-1} at 85.0°; (3) ? m s^{-1} at 75.0° with horizontal component 20.0; (4) components 30.0 (horizontal) and 80.0 (vertical); (5) 70.0 m s^{-1} with vertical component 70.0.',
    a: tbl(['', 'Speed (m s⁻¹)', 'Angle', 'u<sub>x</sub>', 'u<sub>y</sub>'], [['1', '50.0', '60.0°', '<b>25.0</b>', '<b>43.3</b>'], ['2', '60.0', '85.0°', '<b>5.23</b>', '<b>59.8</b>'], ['3', '<b>77.3</b>', '75.0°', '20.0', '<b>74.6</b>'], ['4', '<b>85.4</b>', '<b>69.4°</b>', '30.0', '80.0'], ['5', '70.0', '<b>90.0°</b>', '<b>0</b>', '70.0']]) + N('Row 5: all of the speed is vertical, so it is fired straight up.') },
  { id: 'p5ag04', dp: '5.1.2', t: 'con', q: 'List the key features of a projectile launched from the ground that lands at the same height.',
    a: L(['At the peak v_{y} = 0, so the speed there equals u_{x}.', 'The path is symmetrical: t_{total} = 2 × t_{peak}.', 'It lands with the same speed as it was launched, at the same angle but below the horizontal.', 'The time of flight links the horizontal and vertical motion.']) },
  { id: 'p5ag05', dp: '5.1.2', t: 'eq', q: 'Derive the time of flight for a projectile launched at u, angle θ, that lands at its launch height.',
    a: P('Vertically (up positive): v_{y} = u sinθ − gt, and v_{y} = 0 at the peak.') + E('t_{peak} = ' + F('u sinθ', 'g') + '  →  t_{flight} = ' + F('2u sinθ', 'g')) },
  { id: 'p5ag06', dp: '5.1.2', t: 'eq', q: 'Derive the maximum height H of a projectile launched at speed u and angle θ.',
    a: P('Vertically: v_{y}^2 = u_{y}^2 + 2as with v_{y} = 0 at the top and a = −g:') + E('0 = u^2 sin^2θ − 2gH  →  H = ' + F('u^2 sin^2θ', '2g')) },
  { id: 'p5ag07', dp: '5.1.2', t: 'eq', q: 'Derive the range R of a projectile launched at u and θ on level ground.',
    a: E('R = u_{x} × t_{flight} = u cosθ × ' + F('2u sinθ', 'g')) + E('R = ' + F('u^2 sin2θ', 'g') + '   (since 2 sinθ cosθ = sin2θ)'), v: 'p5range' },
  { id: 'p5ag08', dp: '5.1.2', t: 'con', q: 'For a fixed launch speed on level ground, which angle gives the maximum range, and why do 30° and 60° give the same range?',
    a: P('R = u^2 sin2θ ÷ g is largest when sin2θ = 1, i.e. <b>θ = 45°</b>.') + P('Complementary angles (adding to 90°) give equal sin2θ: sin60° = sin120°. So 30° and 60° land at the same point; the 60° launch goes higher and stays in the air longer.'), v: 'p5range' },
  { id: 'p5ag09', dp: '5.1.4', t: 'calc', q: 'A projectile is fired at 20.0 m s^{-1} at 30° to the horizontal. Find u_{x}, u_{y}, the time to the peak, the total time, the maximum height and the range.',
    a: E('u_{x} = 17.3 m s^{-1},  u_{y} = 10.0 m s^{-1}') + E('t_{peak} = 10.0 ÷ 9.8 = 1.02 s,  t_{total} = 2.04 s') + E('H = ' + F('10.0^2', '2 × 9.8') + ' = 5.10 m') + E('R = 17.32 × 2.041 = 35.3 m') },
  { id: 'p5ag10', dp: '5.1.2', t: 'calc', q: 'A shooter fires an air gun at 35 m s^{-1} at 30° from level ground. Find u_{x} and u_{y}, the velocity at the peak, the speed when v_{y} = 12.3 m s^{-1}, and the landing velocity.',
    a: E('u_{x} = 35 cos30° = 30.3 m s^{-1},  u_{y} = 35 sin30° = 17.5 m s^{-1}') + L(['Peak: 30.3 m s^{-1} horizontally.', 'When v_{y} = 12.3 m s^{-1} (going up <i>or</i> down): v = ' + SQ('30.3^2 + 12.3^2') + ' = 32.7 m s^{-1}.', 'Landing: 35 m s^{-1} at 30° below the horizontal (symmetry).']) },
  { id: 'p5ag11', dp: '5.1.4', t: 'calc', q: 'A cricket ball is thrown from ground level at 30.0 m s^{-1} at 30° to the ground. Find the components, the greatest height, the time of flight and the range.',
    a: E('u_{x} = 26.0 m s^{-1},  u_{y} = 15.0 m s^{-1}') + E('H = ' + F('15.0^2', '2 × 9.8') + ' = 11.5 m') + E('t = 2 × ' + F('15.0', '9.8') + ' = 3.06 s') + E('R = 25.98 × 3.061 = 79.5 m') },
  { id: 'p5ag12', dp: '5.1.4', t: 'calc', q: 'A stone is thrown with horizontal velocity 12.0 m s^{-1} and vertical velocity 7.0 m s^{-1}. How long is it in the air, and how far does it travel horizontally?',
    a: E('t = ' + F('2 × 7.0', '9.8') + ' = 1.43 s ≈ 1.4 s') + E('s_{x} = 12.0 × 1.429 = 17.1 m') },
  { id: 'p5ag13', dp: '5.1.4', t: 'calc', q: 'A ball is kicked at 40.0 m s^{-1} at 60° above the horizontal. When is it 25.0 m above the ground?',
    a: E('u_{y} = 40.0 sin60° = 34.64 m s^{-1}') + E('25.0 = 34.64t − 4.9t^2 → 4.9t^2 − 34.64t + 25.0 = 0') + E('t = ' + F('34.64 ± ' + SQ('34.64^2 − 490'), '9.8') + ' = 0.816 s or 6.25 s') + P('Going up at 0.816 s and coming down at 6.25 s.') + N('Your booklet gives 0.820 s, but the quadratic gives 0.816 s.') },
  { id: 'p5ag14', dp: '5.1.4', t: 'calc', q: 'The ball kicked at 40.0 m s^{-1} at 60° (at 25.0 m height after 0.816 s and 6.25 s): when and where does it land, and where can a 25.0 m barrier be placed so the ball passes over it?',
    a: E('t = ' + F('2 × 34.64', '9.8') + ' = 7.07 s,  R = 20.0 × 7.07 = 141 m') + E('barrier between 20.0 × 0.816 = 16.3 m and 20.0 × 6.25 = 125 m') + N('Booklet: 16.4 m to 125.0 m, from its rounded time of 0.820 s.') },
  { id: 'p5ag15', dp: '5.1.4', t: 'calc', q: 'A baseball reaches a maximum height of 20.0 m and lands 90.0 m away. With what velocity was it hit?',
    a: E('0 = u_{y}^2 − 2 × 9.8 × 20.0 → u_{y} = 19.8 m s^{-1}') + E('t = 2 × ' + F('19.8', '9.8') + ' = 4.04 s → u_{x} = ' + F('90.0', '4.04') + ' = 22.3 m s^{-1}') + E('u = ' + SQ('19.8^2 + 22.3^2') + ' = 29.8 m s^{-1} at tan^{-1}(19.8 ÷ 22.3) = 41.6° above the horizontal') },
  { id: 'p5ag16', dp: '5.1.4', t: 'calc', q: 'A golf ball is hit at 30.0 m s^{-1} at 60° to the horizontal. Will it clear a building 30.0 m high and 45.0 m away? By how much?',
    a: E('u_{x} = 15.0 m s^{-1}, so it reaches the building at t = 45.0 ÷ 15.0 = 3.00 s') + E('s_{y} = 25.98 × 3.00 − 4.9 × 3.00^2 = 33.8 m') + P('Yes: it clears the building by about <b>3.8 m</b>.') + N('Your booklet gets 3.9 m because it rounds u_{y} to 26.0 before multiplying.') },
  { id: 'p5ag17', dp: '5.1.4', t: 'calc', q: 'A golf ball is hit at 25 m s^{-1} at 35° on level ground. Find the components, time to the peak, maximum height and range. What factors affect a golf ball’s range?',
    a: E('u_{x} = 20.5 m s^{-1},  u_{y} = 14.3 m s^{-1}') + E('t_{peak} = 1.46 s,  H = 10.5 m,  R = 20.48 × 2.926 = 59.9 m') + P('Factors: launch speed (how hard it is hit), launch angle, air resistance; in real life also spin and the dimple pattern.') },
  { id: 'p5ag18', dp: '5.1.4', t: 'calc', q: 'A bullet is fired at 280 m s^{-1} at 25.0° elevation from ground level. Find its maximum height, time of flight and range.',
    a: E('u_{y} = 118.3 m s^{-1},  u_{x} = 253.8 m s^{-1}') + E('H = ' + F('118.3^2', '2 × 9.8') + ' = 714 m') + E('t = ' + F('2 × 118.3', '9.8') + ' = 24.1 s') + E('R = 253.8 × 24.15 = 6.13 × 10^3 m') }
]});

DECKS.push({ id: 'phys-m5-ht', fa: 'fa1', title: 'Launched from a height', dps: ['5.1.2', '5.1.3', '5.1.4'], cards: [
  { id: 'p5ht01', dp: '5.1.2', t: 'con', q: 'Describe <b>Technique 1</b> for a projectile launched at an angle from a height (e.g. a cliff).',
    a: OL(['Resolve u into u_{x} and u_{y}.', 'Use v_{y} = 0 at the peak to find the time to the peak.', 'Find the extra height above the launch point, and so the peak height above the ground.', 'Treat the rest as a <b>horizontal launch</b> from the peak (u_{y} = 0) and find the fall time.', 'Add the two times for the time of flight; then find the range and impact velocity.']) },
  { id: 'p5ht02', dp: '5.1.2', t: 'con', q: 'Describe <b>Technique 2</b> for a projectile launched from a height. When does it work?',
    a: L(['Make the launch point the origin and up positive, so the ground is at s_{y} = −h.', 'Use s_{y} = u_{y}t − ½gt^2 with the positive u_{y}.', 'Rearrange into a quadratic and solve; reject the negative time.']) + P('It gives the time of flight and range directly (it doesn’t give the maximum height).'), v: 'p5cliff' },
  { id: 'p5ht03', dp: '5.1.4', t: 'calc', q: 'A projectile is fired at 49.0 m s^{-1} at 30.0° above the horizontal from a 2.00 × 10^2 m cliff. Find u_{x}, u_{y}, the time to maximum height, the maximum height above the launch point and above the ground.',
    a: E('u_{x} = 42.4 m s^{-1},  u_{y} = 24.5 m s^{-1}') + E('t_{peak} = 24.5 ÷ 9.8 = 2.50 s') + E('Δh = ' + F('24.5^2', '2 × 9.8') + ' = 30.6 m above the launch point') + E('height above the ground = 200 + 30.6 = 231 m') },
  { id: 'p5ht04', dp: '5.1.4', t: 'calc', q: 'For the projectile fired at 49.0 m s^{-1} at 30.0° from a 200 m cliff (peak 230.6 m above the ground after 2.50 s), find the time of flight and the range.',
    a: E('fall from the peak: 230.6 = ½ × 9.8 × t^2 → t = 6.86 s') + E('t_{flight} = 2.50 + 6.86 = 9.36 s') + E('R = 42.44 × 9.36 = 397 m') + N('Check with Technique 2: −200 = 24.5t − 4.9t^2 gives t = 9.36 s.'), v: 'p5cliff' },
  { id: 'p5ht05', dp: '5.1.4', t: 'calc', q: 'A skier leaves a 35° ramp at 15.0 m s^{-1}. The end of the ramp is 2.0 m above level ground. How high does she go, and how far from the base of the ramp does she land?',
    a: E('u_{x} = 12.29 m s^{-1},  u_{y} = 8.60 m s^{-1}') + E('extra height = ' + F('8.60^2', '2 × 9.8') + ' = 3.78 m → maximum 5.8 m above the ground') + E('−2.0 = 8.60t − 4.9t^2 → t = 1.96 s') + E('R = 12.29 × 1.96 = 24.1 m') },
  { id: 'p5ht06', dp: '5.1.4', t: 'calc', q: 'A boy throws a ball at 12.0 m s^{-1} at 25.0° above the horizontal from the top of a 75.0 m cliff. How long does it take to reach the ground, and how far from the base does it land?',
    a: E('u_{x} = 10.88 m s^{-1},  u_{y} = 5.07 m s^{-1}') + E('−75.0 = 5.07t − 4.9t^2 → t = 4.46 s') + E('R = 10.88 × 4.46 = 48.5 m') },
  { id: 'p5ht07', dp: '5.1.4', t: 'calc', q: 'An arrow is fired at 15.0 m s^{-1} at 30° <b>below</b> the horizontal from the top of a 10.0 m tree. How long does it take to reach the ground, and how far away does it land?',
    a: P('Down positive: u_{y} = 15.0 sin30° = 7.50 m s^{-1}, u_{x} = 13.0 m s^{-1}.') + E('10.0 = 7.50t + 4.9t^2 → t = 0.855 s') + E('R = 12.99 × 0.855 = 11.1 m') },
  { id: 'p5ht08', dp: '5.1.4', t: 'calc', q: 'A water skier leaves a 15° ramp whose end is 1.5 m above the water. At what speed must he leave it to land 10.0 m beyond the end?',
    a: P('Horizontally: t = 10.0 ÷ (v cos15°). Vertically (up positive):') + E('−1.5 = v sin15° t − 4.9t^2 = 10.0 tan15° − ' + F('4.9 × 10.0^2', 'v^2 cos^2 15°')) + E(F('490', 'v^2 cos^2 15°') + ' = 2.68 + 1.5 = 4.18 → v = 11.2 m s^{-1}') },
  { id: 'p5ht09', dp: '5.1.4', t: 'exam', q: 'HSC Q27 (4 marks): A toy bird is launched at 60° to the horizontal from a point 45 m from the base of a cliff. Find the launch speed so it strikes the base of a building on top of the cliff, 34 m above the launch height.',
    a: E('horizontally: 45 = u cos60° t → t = ' + F('90', 'u')) + E('vertically: 34 = u sin60° t − 4.9t^2 = 45 tan60° − ' + F('4.9 × 8100', 'u^2')) + E(F('39 690', 'u^2') + ' = 77.9 − 34 = 43.9 → u = 30 m s^{-1}') + N('u = 30.05 m s^{-1}; the flight takes about 3.0 s.') },
  { id: 'p5ht10', dp: '5.1.4', t: 'calc', q: 'Two boys on a bridge 32.0 m above a river throw stones at the same instant: one straight up at 10.0 m s^{-1}, one straight down at 10.0 m s^{-1}. Find the time difference between the stones hitting the water.',
    a: E('up: −32.0 = 10.0t − 4.9t^2 → t = 3.77 s') + E('down: 32.0 = 10.0t + 4.9t^2 → t = 1.73 s') + P('Difference = <b>2.04 s</b>. This is 2u/g: the upward stone returns to the bridge after 2.04 s moving down at 10.0 m s^{-1}, then repeats the other stone’s motion.') },
  { id: 'p5ht11', dp: '5.1.4', t: 'calc', q: 'A bullet is fired at 280 m s^{-1} at 25.0° elevation from the top of a 75.0 m building. Find its maximum height (above the ground), time of flight and range.',
    a: E('u_{y} = 118.3 m s^{-1},  u_{x} = 253.8 m s^{-1}') + E('H = 75.0 + 714 = 789 m') + E('−75.0 = 118.3t − 4.9t^2 → t = 24.8 s') + E('R = 253.8 × 24.77 = 6.29 × 10^3 m') },
  { id: 'p5ht12', dp: '5.1.4', t: 'calc', q: 'A fighter diving at 20.0° below the horizontal releases a bomb at 4.00 × 10^2 m s^{-1} when 1.34 km above the ground. Find the bomb’s range and its angle when it hits.',
    a: P('Down positive: u_{x} = 375.9 m s^{-1}, u_{y} = 136.8 m s^{-1}.') + E('1340 = 136.8t + 4.9t^2 → t = 7.68 s') + E('R = 375.9 × 7.68 = 2.89 × 10^3 m') + E('v_{y} = 136.8 + 9.8 × 7.68 = 212 m s^{-1} → θ = tan^{-1}(212 ÷ 375.9) = 29.4° below the horizontal') },
  { id: 'p5ht13', dp: '5.1.4', t: 'calc', q: 'A balloonist rising at 10.5 m s^{-1} drops his camera when 200 m above the ground. Find the camera’s maximum height and its time in the air.',
    a: P('The camera starts with the balloon’s velocity: 10.5 m s^{-1} <b>upwards</b>.') + E('extra height = ' + F('10.5^2', '2 × 9.8') + ' = 5.6 m → maximum 205.6 m') + E('−200 = 10.5t − 4.9t^2 → t = 7.55 s') },
  { id: 'p5ht14', dp: '5.1.4', t: 'calc', q: 'A boy throws a ball from a 3.0 m high balcony at 15 m s^{-1} at 60° to the horizontal. Find the time to the highest point, the time from there to the ground, and the horizontal distance.',
    a: E('u_{y} = 13.0 m s^{-1} → t_{peak} = 1.33 s; peak = 3.0 + 8.61 = 11.6 m') + E('fall: 11.6 = ½ × 9.8 × t^2 → t = 1.54 s') + E('R = 7.5 × (1.33 + 1.54) = 21.5 m ≈ 21 m') },
  { id: 'p5ht15', dp: '5.1.4', t: 'calc', q: 'A high jumper leaves the ground at 70° to the horizontal and just clears a bar at 1.55 m, landing on a mat 1.00 m above the ground. Find the vertical velocity needed and how far the mat is from the bar.',
    a: E('u_{y} = ' + SQ('2 × 9.8 × 1.55') + ' = 5.51 m s^{-1}') + E('u_{x} = ' + F('5.51', 'tan70°') + ' = 2.01 m s^{-1}') + E('fall 0.55 m from the bar: t = ' + SQ('2 × 0.55 ÷ 9.8') + ' = 0.335 s → s_{x} = 0.67 m') + N('Booklet: 0.68 m. The jumper is modelled as a point that starts at ground level.') },
  { id: 'p5ht16', dp: '5.1.3', t: 'prac', q: 'Outline how to use a projectile launcher to verify that range is greatest at 45° and that complementary angles give equal ranges.',
    a: L(['Keep the launch speed constant (same spring setting), the same projectile, and launch and land at the same height on a level floor (validity).', 'Vary the angle from 15° to 75° in 15° steps; mark landings with carbon paper and measure the range.', 'Repeat each angle at least 3 times and average (reliability).']) + P('Plot range against angle: the peak should be at 45°, with 30°/60° and 15°/75° giving equal ranges. Or plot R against sin2θ: a straight line with gradient u^2/g.') + N('Differences come from air resistance and from the launcher sitting above the floor.') },
  { id: 'p5ht17', dp: '5.1.2', t: 'exam', q: 'Explain why a projectile’s time of flight depends only on the vertical component of its motion.',
    a: P('The vertical and horizontal motions are independent. The time in the air is set by how long the projectile takes to rise and fall, which depends only on u_{y}, g and the launch height. The horizontal velocity is constant and doesn’t affect when it lands; it only decides how far it travels in that time.') }
]});

/* ================= 5.2 CIRCULAR MOTION ================= */
DECKS.push({ id: 'phys-m5-cm', fa: 'fa2', title: 'Centripetal force', dps: ['5.2.1', '5.2.2', '5.2.3'], cards: [
  { id: 'p5cm01', dp: '5.2.3', t: 'def', q: 'What is <b>uniform circular motion</b>, and why is an object in uniform circular motion accelerating?',
    a: P('Motion in a circle at constant speed.') + P('Its direction changes continuously, so its <b>velocity</b> (a vector) changes, so it is accelerating. By Newton’s second law there must be a net (unbalanced) force acting on it, directed towards the centre.'), v: 'p5circle' },
  { id: 'p5cm02', dp: '5.2.2', t: 'def', q: 'What is a <b>centripetal force</b>?',
    a: P('The net (resultant) force on an object in circular motion, directed towards the centre of the circle (“centre-seeking”).') + P('It is not an extra force of its own. It must be supplied by real forces such as tension, friction, gravity, a magnetic force or a component of the normal force.') },
  { id: 'p5cm03', dp: '5.2.2', t: 'con', q: 'Explain why <b>centrifugal force</b> does not exist.',
    a: P('If an outward force equal to the centripetal force acted, the net force would be zero and, by the law of inertia, the object would move in a straight line, not a circle.') + P('The “thrown outwards” feeling is your own inertia: your body tends to keep going in a straight line, and the seat or door has to push you inwards.') },
  { id: 'p5cm04', dp: '5.2.2', t: 'rec', q: 'Give five examples of real forces that provide centripetal force.',
    a: L(['<b>Tension</b>: a hammer throw or a ball whirled on a string.', '<b>Gravity</b>: planets and satellites in orbit.', '<b>Friction</b>: a car turning on a flat road.', '<b>Magnetic force</b> (F = qvB sinθ): a charged particle in a magnetic field.', '<b>Normal force</b> (or a component of it): banked tracks and roller coasters.']) },
  { id: 'p5cm05', dp: '5.2.3', t: 'eq', q: 'Write the relationships for centripetal acceleration, centripetal force, orbital speed and period/frequency.',
    a: E('a_{c} = ' + F('v^2', 'r') + '    F_{c} = ' + F('mv^2', 'r')) + E('v = ' + F('2πr', 'T') + '    f = ' + F('1', 'T')) + P('a_{c} and F_{c} always point towards the centre. v is the tangential speed (m s^{-1}), r the radius (m), T the period (time for one revolution, in seconds) and f the frequency (revolutions per second, Hz).') },
  { id: 'p5cm06', dp: '5.2.3', t: 'con', q: 'Using vectors, show that the acceleration of an object in uniform circular motion points to the centre.',
    a: P('Change in velocity: Δv = v_{2} − v_{1} = v_{2} + (−v_{1}). Add the vectors head to tail (reverse v_{1}).') + P('Δv points towards the centre of the circle. Since a = Δv/Δt, the acceleration (and the net force) also point to the centre.'), v: 'p5circle' },
  { id: 'p5cm07', dp: '5.2.3', t: 'con', q: 'What is the direction of an object’s velocity in circular motion, and what happens if the string whirling it breaks?',
    a: P('The instantaneous velocity is along the <b>tangent</b> to the circle at that point.') + P('If the string breaks, there is no longer a centripetal force, so the object continues in a straight line along the tangent (inertia). It does not fly radially outwards.') },
  { id: 'p5cm08', dp: '5.2.2', t: 'con', q: 'When drawing a free-body diagram of an object in circular motion, should you include an arrow for the centripetal force?',
    a: P('<b>No.</b> Draw only the real forces acting on the object (weight, tension, normal force, friction…), from the centre of the object as a point mass. The centripetal force is the resultant of these forces, not another force.') },
  { id: 'p5cm09', dp: '5.2.1', t: 'con', q: 'Explain how the centripetal force needed depends on mass, speed and radius.',
    a: L(['<b>Mass</b>: F ∝ m (double the mass, double the force).', '<b>Speed</b>: F ∝ v^2 (double the speed, four times the force).', '<b>Radius</b>: at constant speed, F ∝ 1/r (a tighter turn needs more force).']) + N('Careful: at constant period (same ω) F = mω^2r, so F ∝ r. For example, the outer riders on a merry-go-round need more force.') },
  { id: 'p5cm10', dp: '5.2.1', t: 'prac', q: 'Outline the rubber stopper practical used to investigate the relationships between centripetal force, mass, speed and radius.',
    a: L(['A stopper is whirled in a horizontal circle on a string passing through a tube; masses hang from the bottom of the string. The hanging weight provides the tension, which is the centripetal force.', 'Mark the radius on the string; keep the marker just below the tube so r stays constant.', 'Time 10 or more revolutions to find T (reduces reaction-time error), then v = 2πr/T and ω = 2π/T.', 'Vary the radius (fixed force) or the hanging mass (force) and repeat each trial.']) + P('Analysis: F = mv^2/r, so F against v^2 is a straight line with gradient m/r. Sources of error: the string isn’t exactly horizontal, friction at the tube, timing.') },
  { id: 'p5cm11', dp: '5.2.2', t: 'con', q: 'Why does a charged particle entering a uniform magnetic field at right angles move in a circle?',
    a: P('The magnetic force F = qvB sinθ is always perpendicular to the velocity. It changes the direction of motion but not the speed, and as the velocity turns, the force turns with it. A constant-sized force always perpendicular to the velocity is a centripetal force, so the path is a circle.') + P('When the particle leaves the field, the force stops and it travels in a straight line (inertia).') },
  { id: 'p5cm12', dp: '5.2.3', t: 'calc', q: 'A 2.50 tonne truck goes around a flat curve of radius 155 m at 12.0 m s^{-1}. Find the sideways friction and the centripetal acceleration.',
    a: E('F = ' + F('mv^2', 'r') + ' = ' + F('2.50 × 10^3 × 12.0^2', '155') + ' = 2.32 × 10^3 N towards the centre') + E('a = ' + F('12.0^2', '155') + ' = 0.929 m s^{-2}') },
  { id: 'p5cm13', dp: '5.2.3', t: 'calc', q: 'A 1.50 kg rock on a 1.20 m thread moves in a horizontal circle at exactly three rotations per second. Find its speed, centripetal acceleration and the centripetal force.',
    a: E('v = 2πr f = 2π × 1.20 × 3 = 22.6 m s^{-1}') + E('a = ' + F('22.6^2', '1.20') + ' = 426 m s^{-2}') + E('F = 1.50 × 426 = 640 N') },
  { id: 'p5cm14', dp: '5.2.3', t: 'calc', q: 'A 650 g toy car makes a complete circle of radius 0.90 m every 4.25 s. Find its speed, acceleration and the centripetal force.',
    a: E('v = ' + F('2π × 0.90', '4.25') + ' = 1.33 m s^{-1}') + E('a = ' + F('1.33^2', '0.90') + ' = 1.97 m s^{-2}') + E('F = 0.650 × 1.97 = 1.28 N') },
  { id: 'p5cm15', dp: '5.2.3', t: 'calc', q: 'A toy engine’s crankshaft (radius 2 cm) turns at 360 revolutions per minute. What is the speed of its tip?',
    a: E('f = 360 ÷ 60 = 6.0 Hz') + E('v = 2πr f = 2π × 0.02 × 6.0 = 0.75 m s^{-1}') },
  { id: 'p5cm16', dp: '5.2.3', t: 'calc', q: 'A 15.0 g mass on a 1.5 m string rotates at 4.0 rotations per second. Find its speed, centripetal acceleration and the tension in the string.',
    a: E('v = 2π × 1.5 × 4.0 = 37.7 m s^{-1}') + E('a = ' + F('37.7^2', '1.5') + ' = 947 m s^{-2}') + E('T = 0.0150 × 947 = 14.2 N') },
  { id: 'p5cm17', dp: '5.2.2', t: 'calc', q: 'A 910 kg car drives around a flat circular track of radius 1.0 km at 26 m s^{-1}. Find its rate in rotations per hour and its centripetal acceleration. How does it stay on the track?',
    a: E('one lap = 2π × 1000 ÷ 26 = 242 s → 3600 ÷ 242 = 14.9 rotations per hour') + E('a = ' + F('26^2', '1000') + ' = 0.676 m s^{-2}') + P('Sideways <b>friction</b> between the tyres and the road provides the centripetal force (910 × 0.676 = 615 N).') },
  { id: 'p5cm18', dp: '5.2.3', t: 'calc', q: 'A 1.3 kg mass on a 0.75 m string does five rotations each second. Find the period, speed, angular velocity in degrees per second, centripetal acceleration and tension.',
    a: E('T = 1 ÷ 5 = 0.20 s') + E('v = ' + F('2π × 0.75', '0.20') + ' = 23.6 m s^{-1}') + E('5 × 360° = 1800° per second') + E('a = ' + F('23.6^2', '0.75') + ' = 740 m s^{-2},  tension = 1.3 × 740 = 962 N') },
  { id: 'p5cm19', dp: '5.2.3', t: 'calc', q: 'A 1.25 kg ball on a 2.00 m string does 120 revolutions in one minute. Find its frequency, period, speed, acceleration and the tension.',
    a: E('f = 120 ÷ 60 = 2.00 Hz,  T = 0.500 s') + E('v = ' + F('2π × 2.00', '0.500') + ' = 25.1 m s^{-1}') + E('a = ' + F('25.1^2', '2.00') + ' = 316 m s^{-2},  tension = 1.25 × 316 = 395 N') },
  { id: 'p5cm20', dp: '5.2.3', t: 'exam', q: 'Two 50.0 kg students on 10.0 kg bikes ride at 20.0 m s^{-1} straight at a wall 30 m away. X brakes with 600.0 N and keeps going straight. Y uses a 750.0 N sideways force to turn in a circle. Does either hit the wall?',
    a: P('Each student plus bike has m = 60.0 kg.') + P('<b>X</b>: a = 600.0 ÷ 60.0 = 10.0 m s^{-2}; stopping distance = v^2 ÷ 2a = 400 ÷ 20.0 = 20.0 m. X stops safely, 10 m short.') + P('<b>Y</b>: r = mv^2 ÷ F = 60.0 × 400 ÷ 750.0 = 32.0 m. Turning away needs him to travel 32 m towards the wall, so <b>Y hits the wall</b>.') },
  { id: 'p5cm21', dp: '5.2.3', t: 'calc', q: 'A string breaks when more than 15.0 kg is hung from it. A 2.0 m length of it whirls a 0.50 kg mass horizontally faster and faster. Find the breaking force, the maximum speed, and the period and frequency at breaking speed.',
    a: E('F = 15.0 × 9.8 = 147 N') + E('v = ' + SQ('Fr ÷ m') + ' = ' + SQ('147 × 2.0 ÷ 0.50') + ' = 24.2 m s^{-1}') + E('T = ' + F('2π × 2.0', '24.2') + ' = 0.518 s,  f = 1.93 Hz') }
]});

DECKS.push({ id: 'phys-m5-cp', fa: 'fa2', title: 'Mass on a string: conical pendulum', dps: ['5.2.2', '5.2.3'], cards: [
  { id: 'p5cp01', dp: '5.2.2', t: 'con', q: 'What forces act on the bob of a conical pendulum, and what modelling assumptions are made?',
    a: P('Only two forces: the <b>tension</b> along the string and the <b>weight</b> mg straight down. Their resultant is horizontal, towards the centre of the circle: the centripetal force.') + P('Assumptions: no air resistance, a light inextensible string, and the bob is a point mass.'), v: 'p5conical' },
  { id: 'p5cp02', dp: '5.2.3', t: 'eq', q: 'Derive the relationship between the angle θ of a conical pendulum (from the vertical), its speed and radius.',
    a: P('<b>Vertical</b>: the bob stays at the same height, so the net vertical force is zero:') + E('T cosθ = mg') + P('<b>Horizontal</b>: the horizontal component of tension is the centripetal force:') + E('T sinθ = ' + F('mv^2', 'r')) + P('Divide the second by the first:') + E('tanθ = ' + F('v^2', 'rg') + '   and   r = L sinθ'), v: 'p5conical' },
  { id: 'p5cp03', dp: '5.2.2', t: 'con', q: 'You whirl a mass on a string. Describe the tension forces using Newton’s third law. What direction do you give for the tension in a circular motion answer?',
    a: P('A string can only pull. It pulls the mass towards the centre, and it pulls your hand outwards; your hand pulls the string inwards. These are action–reaction pairs acting between two different objects (F_{AB} = −F_{BA}).') + P('For the force on the mass, give the direction as <b>towards the centre of the circle</b>.') },
  { id: 'p5cp04', dp: '5.2.2', t: 'con', q: 'Why can the string of a conical pendulum never be exactly horizontal, and how does the tension compare with the bob’s weight?',
    a: P('The vertical component T cosθ must balance mg. If the string were horizontal, cosθ = 0, so no tension could hold the bob up.') + P('Since T cosθ = mg and cosθ < 1, the tension is always <b>greater than the weight</b> (mg < T).') },
  { id: 'p5cp05', dp: '5.2.3', t: 'calc', q: 'A 75 g ball on a 50 cm string moves as a conical pendulum in a horizontal circle of radius 40 cm. Find θ, the tension, the speed and the number of revolutions in 10 s.',
    a: E('sinθ = 0.40 ÷ 0.50 → θ = 53.1°') + E('T = ' + F('mg', 'cosθ') + ' = ' + F('0.075 × 9.8', '0.600') + ' = 1.2 N') + E('v = ' + SQ('rg tanθ') + ' = ' + SQ('0.40 × 9.8 × 1.333') + ' = 2.29 m s^{-1}') + E('revolutions = ' + F('2.29 × 10', '2π × 0.40') + ' = 9.1') },
  { id: 'p5cp06', dp: '5.2.3', t: 'calc', q: 'A 470 g ball on a 1.0 m string moves in a horizontal circle of radius 14 cm. What is its speed?',
    a: E('sinθ = 0.14 ÷ 1.0 → θ = 8.05°') + E('v = ' + SQ('0.14 × 9.8 × tan8.05°') + ' = 0.44 m s^{-1}') + N('The mass of the ball doesn’t matter.') },
  { id: 'p5cp07', dp: '5.2.3', t: 'calc', q: 'A 0.25 kg bob on a 0.75 m cord moves in a horizontal circle of radius 0.25 m. Find the angle with the vertical, the tension, the speed and the acceleration.',
    a: E('sinθ = 0.25 ÷ 0.75 → θ = 19.5°') + E('T = ' + F('0.25 × 9.8', 'cos19.5°') + ' = 2.6 N') + E('v = ' + SQ('0.25 × 9.8 × tan19.5°') + ' = 0.93 m s^{-1}') + E('a = ' + F('v^2', 'r') + ' = g tanθ = 3.5 m s^{-2} towards the centre') },
  { id: 'p5cp08', dp: '5.2.3', t: 'calc', q: 'The 0.25 kg bob on a 0.75 m cord can withstand a tension of 3 times its weight. Find the maximum angle with the vertical and the bob’s speed at that angle.',
    a: E('T cosθ = mg → cosθ = ' + F('mg', '3mg') + ' = ' + F('1', '3') + ' → θ = 70.5°') + E('r = 0.75 sin70.5° = 0.707 m') + E('v = ' + SQ('0.707 × 9.8 × tan70.5°') + ' = 4.4 m s^{-1}') },
  { id: 'p5cp09', dp: '5.2.3', t: 'calc', q: 'A 4.7 kg mass on a string revolves in a horizontal circle of radius 86 cm at 2.97 m s^{-1}. What angle does the string make with the vertical?',
    a: E('tanθ = ' + F('v^2', 'rg') + ' = ' + F('2.97^2', '0.86 × 9.8') + ' = 1.047 → θ = 46°') },
  { id: 'p5cp10', dp: '5.2.3', t: 'prac', q: 'How can a conical pendulum be used to find g graphically?',
    a: L(['Measure the string length L and the height h of the cone (pivot to the plane of the circle), or the radius r.', 'Time 10 revolutions for the period T; repeat and average; repeat for several radii or heights.']) + P('From tanθ = v^2/(rg), v = 2πr/T and r = L sinθ:') + E('T^2 = ' + F('4π^2 L cosθ', 'g') + ' = ' + F('4π^2', 'g') + ' h') + P('Plot T^2 against h: a straight line through the origin with gradient 4π^2/g, so g = 4π^2 ÷ gradient.') }
]});

DECKS.push({ id: 'phys-m5-bk', fa: 'fa2', title: 'Bends and banked tracks', dps: ['5.2.2', '5.2.3'], cards: [
  { id: 'p5bk01', dp: '5.2.2', t: 'con', q: 'What provides the centripetal force for a car on a flat, horizontal bend? What happens on black ice?',
    a: P('Sideways <b>friction</b> between the tyres and the road provides the centripetal force (the normal force balances the weight).') + P('On black ice there is almost no friction, so there is no centripetal force; the car continues in a straight line (inertia) and leaves the road along a tangent.') + N('Setting μmg = mv^2/r gives a maximum speed v = ' + SQ('μgr') + '.') },
  { id: 'p5bk02', dp: '5.2.2', t: 'con', q: 'A motorcyclist leans into a corner at angle θ from upright. Explain how this lets them take the corner faster (booklet extension).',
    a: P('Leaning means the road pushes back at an angle, so the reaction force has a component towards the centre. Perpendicular to the road R cosθ = mg, so R = mg/cosθ, and the component towards the centre is mg tanθ.') + E('F_{net} = μR + mg tanθ') + P('The greater the lean, the larger the net inward force, so the faster the corner can be taken safely.') },
  { id: 'p5bk03', dp: '5.2.2', t: 'con', q: 'Explain how an aeroplane turns in a horizontal circle by banking.',
    a: P('Lift acts perpendicular to the wings. In level flight it balances the weight. When the plane banks (one wing down), the lift tilts: its vertical component still balances the weight, and its horizontal component provides the centripetal force.') + E('L cosθ = mg,  L sinθ = ' + F('mv^2', 'r') + '  →  tanθ = ' + F('v^2', 'rg')) },
  { id: 'p5bk04', dp: '5.2.2', t: 'con', q: 'What forces act on a car on a <b>frictionless</b> banked curve, and what provides the centripetal force? Which way is the radius of the circle?',
    a: L(['Only two forces: the <b>weight</b> mg (towards the centre of the Earth) and the <b>normal reaction</b> R (perpendicular to the road surface).', 'R cosθ balances mg (the car stays at the same height).', 'The horizontal component R sinθ is the centripetal force.', 'The radius is a <b>horizontal</b> line to a point above the centre of the curve, not along the slope.']), v: 'p5banked' },
  { id: 'p5bk05', dp: '5.2.3', t: 'eq', q: 'Derive the speed at which a car can take a frictionless curve of radius r banked at angle θ. (Not on the data sheet.)',
    a: E('vertical: R cosθ = mg → R = ' + F('mg', 'cosθ')) + E('horizontal: R sinθ = ' + F('mv^2', 'r')) + E(F('mg', 'cosθ') + ' sinθ = ' + F('mv^2', 'r') + ' → g tanθ = ' + F('v^2', 'r')) + E('v = ' + SQ('rg tanθ')), v: 'p5banked' },
  { id: 'p5bk06', dp: '5.2.3', t: 'eq', q: 'Apart from v = √(rg tanθ), what other relationships come from a frictionless banked curve?',
    a: E('R = ' + F('mg', 'cosθ')) + E('F_{c} = R sinθ = mg tanθ = ' + F('mv^2', 'r')) + E('tanθ = ' + F('v^2', 'rg')) },
  { id: 'p5bk07', dp: '5.2.3', t: 'con', q: 'Does the safe speed for a frictionless banked curve depend on the mass of the vehicle?',
    a: P('No. Mass cancels in the derivation (v = ' + SQ('rg tanθ') + '), so a 600 kg car and a 750 kg car have the same safe speed. It depends only on the radius, the bank angle and g.') },
  { id: 'p5bk08', dp: '5.2.2', t: 'con', q: 'Extension: a car on a banked curve <b>with friction</b> goes faster than the design speed. Which way does friction act, and what is the net inward force?',
    a: P('Without friction the car would tend to go straight on and slide <b>up</b> the bank, so friction acts <b>down the slope</b>. Its horizontal component adds to the inward force:') + E('F_{net} = R sinθ + F_{f} cosθ,  with F_{f} = μR') + P('The car gets around safely if this available inward force is at least mv^2/r. So friction lets cars take the curve faster than the frictionless speed.') },
  { id: 'p5bk09', dp: '5.2.3', t: 'calc', q: 'A 600 kg car takes a frictionless curve of radius 240 m banked at 7°. Find the maximum safe speed. What would it be for a 750 kg car?',
    a: E('v = ' + SQ('240 × 9.8 × tan7°') + ' = 17.0 m s^{-1}') + P('The 750 kg car: also <b>17.0 m s^{-1}</b>. Mass doesn’t appear in v = ' + SQ('rg tanθ') + '.') },
  { id: 'p5bk10', dp: '5.2.3', t: 'calc', q: 'A 750 kg car travels at 20.0 m s^{-1} around a frictionless curve of radius 250.0 m. Find the minimum bank angle and the centripetal force.',
    a: E('tanθ = ' + F('20.0^2', '250.0 × 9.8') + ' = 0.163 → θ = 9.27°') + E('F_{c} = ' + F('750 × 20.0^2', '250.0') + ' = 1.20 × 10^3 N') + N('Booklet: 9.30°.') },
  { id: 'p5bk11', dp: '5.2.3', t: 'calc', q: 'A frictionless curve of radius 80 m is banked for 60 km h^{-1}. Find the bank angle, and the centripetal force on a 2 tonne truck taking it at 60 km h^{-1}.',
    a: E('v = 60 ÷ 3.6 = 16.7 m s^{-1}') + E('tanθ = ' + F('16.7^2', '80 × 9.8') + ' → θ = 19.5°') + E('F_{c} = ' + F('2000 × 16.7^2', '80') + ' = 6.9 × 10^3 N') },
  { id: 'p5bk12', dp: '5.2.3', t: 'calc', q: 'A car drives around a frictionless curve of radius 150 m banked at 10°. What is its maximum speed to stay at this radius?',
    a: E('v = ' + SQ('150 × 9.8 × tan10°') + ' = 16.1 m s^{-1}') },
  { id: 'p5bk13', dp: '5.2.3', t: 'calc', q: 'A plane flies in a horizontal circle at 500 km h^{-1} with its wings tilted 40° to the horizontal (lift perpendicular to the wings). Find the radius of the circle.',
    a: E('v = 500 ÷ 3.6 = 138.9 m s^{-1}') + E('r = ' + F('v^2', 'g tanθ') + ' = ' + F('138.9^2', '9.8 × tan40°') + ' = 2.35 × 10^3 m') },
  { id: 'p5bk14', dp: '5.2.3', t: 'calc', q: 'Racing cars take a 315 m radius curve banked at 30°. Find the maximum safe speed on this frictionless curve in m s^{-1} and km h^{-1}.',
    a: E('v = ' + SQ('315 × 9.8 × tan30°') + ' = 42.2 m s^{-1}') + E('42.2 × 3.6 = 152 km h^{-1}') },
  { id: 'p5bk15', dp: '5.2.3', t: 'calc', q: 'A frictionless curve is banked at 15° with radius 350 m. A car at its maximum safe speed has a centripetal force of 3939 N. Find the speed and the car’s mass.',
    a: E('v = ' + SQ('350 × 9.8 × tan15°') + ' = 30.3 m s^{-1}') + E('m = ' + F('F_{c} r', 'v^2') + ' = ' + F('3939 × 350', '30.3^2') + ' = 1.50 × 10^3 kg') },
  { id: 'p5bk16', dp: '5.2.3', t: 'calc', q: 'A roller coaster on the Moon (g = 1.67 m s^{-2}) takes a frictionless curve of radius 15.0 m at 30 m s^{-1}. Find the bank angle. What would it be on Earth?',
    a: E('Moon: tanθ = ' + F('30^2', '15.0 × 1.67') + ' = 35.9 → θ = 88.4°') + E('Earth: tanθ = ' + F('30^2', '15.0 × 9.8') + ' = 6.12 → θ = 80.7°') },
  { id: 'p5bk17', dp: '5.2.3', t: 'calc', q: 'A roller coaster takes a frictionless curve banked at 80° at 50 m s^{-1}. What is the radius of the bend?',
    a: E('r = ' + F('v^2', 'g tanθ') + ' = ' + F('50^2', '9.8 × tan80°') + ' = 45 m') },
  { id: 'p5bk18', dp: '5.2.3', t: 'calc', q: 'Two frictionless curves are banked at 56°: A has radius 75 m, B has radius 125 m. Find the ratio of their safe speeds, the bank angle B would need for A’s speed, and the angle A would need for B’s speed.',
    a: E('v ∝ ' + SQ('r') + ': v_{A} = 33.0 m s^{-1}, v_{B} = 42.6 m s^{-1} → v_{A} : v_{B} = 1 : 1.29') + E('B at v_{A}: tanθ = ' + F('33.0^2', '125 × 9.8') + ' → θ = 41.7°') + E('A at v_{B}: tanθ = ' + F('42.6^2', '75 × 9.8') + ' → θ = 68.0°') }
]});

DECKS.push({ id: 'phys-m5-av', fa: 'fa2', title: 'Radians, angular velocity and strobes', dps: ['5.2.1', '5.2.3'], cards: [
  { id: 'p5av01', dp: '5.2.3', t: 'def', q: 'Define the <b>radian</b>. How many radians are in a full circle, and how many degrees in one radian?',
    a: P('One radian is the angle subtended at the centre of a circle by an arc equal in length to the radius.') + P('A full circle is circumference ÷ radius = 2πr/r = <b>2π rad = 360°</b>, so 1 rad = 180°/π ≈ 57.3°.') },
  { id: 'p5av02', dp: '5.2.3', t: 'calc', q: 'Convert 75° to radians.',
    a: E(F('75', '360') + ' = ' + F('x', '2π') + '  →  x = ' + F('2π × 75', '360') + ' = 1.31 rad') },
  { id: 'p5av03', dp: '5.2.3', t: 'def', q: 'Define <b>angular velocity</b> and give its unit.',
    a: E('ω = ' + F('Δθ', 't')) + P('The rate of change of angular displacement, in radians per second (rad s^{-1}). This is the only equation in this section that is on your data sheet.') },
  { id: 'p5av04', dp: '5.2.3', t: 'eq', q: 'Derive ω = 2π/T = 2πf and v = rω.',
    a: P('One revolution is Δθ = 2π rad in one period T:') + E('ω = ' + F('2π', 'T') + ' = 2πf   (since f = ' + F('1', 'T') + ')') + P('Linear speed:') + E('v = ' + F('2πr', 'T') + ' = r × ' + F('2π', 'T') + ' = rω') },
  { id: 'p5av05', dp: '5.2.3', t: 'eq', q: 'Show that centripetal acceleration and force can be written in terms of ω.',
    a: E('a_{c} = ' + F('v^2', 'r') + ' = ' + F('(rω)^2', 'r') + ' = ω^2 r') + E('F_{c} = mω^2 r') + N('Not on the data sheet, but very useful when objects share the same rotation (same ω).') },
  { id: 'p5av06', dp: '5.2.3', t: 'con', q: 'Extension: how is the <b>direction</b> of angular velocity found?',
    a: P('With a right-hand rule: curl the fingers of your right hand in the direction of rotation; your thumb points along the axis in the direction of ω.') + P('For example, a merry-go-round turning clockwise when viewed from above has ω pointing <b>downwards</b>.') },
  { id: 'p5av07', dp: '5.2.3', t: 'con', q: 'Your booklet defines Δω/Δt as “angular (centripetal) acceleration”. What is the correct distinction?',
    a: L(['<b>Angular acceleration</b> = Δω/Δt (rad s^{-2}): how quickly the rate of rotation changes. It is <b>zero</b> in uniform circular motion.', '<b>Centripetal acceleration</b> = v^2/r = ω^2r (m s^{-2}): the acceleration towards the centre caused by the changing direction. It is <b>not</b> zero in uniform circular motion.']) + N('The two are different quantities; the booklet’s bracketed label mixes them up.') },
  { id: 'p5av08', dp: '5.2.1', t: 'con', q: 'How do you get times from a <b>stroboscopic</b> image? A puck on an air table is photographed at 10 Hz and appears 7 times. How long was it moving?',
    a: P('The light flashes at a set frequency f, so successive images are 1/f apart in time. Count the <b>gaps</b> between images, not the images.') + E('7 images = 6 intervals → t = 6 × 0.1 = 0.6 s') },
  { id: 'p5av09', dp: '5.2.3', t: 'calc', q: 'A merry-go-round spins clockwise (viewed from above); outside riders move at 8.5 m s^{-1} on a radius of 7.5 m. Find the period, frequency, angular velocity, acceleration and the force on a 60 kg rider.',
    a: E('T = ' + F('2π × 7.5', '8.5') + ' = 5.54 s,  f = 0.180 Hz') + E('ω = ' + F('8.5', '7.5') + ' = 1.13 rad s^{-1} (downwards by the right-hand rule)') + E('a = ' + F('8.5^2', '7.5') + ' = 9.63 m s^{-2},  F = 60 × 9.63 = 578 N towards the centre') },
  { id: 'p5av10', dp: '5.2.3', t: 'calc', q: 'Three 30.0 kg children P, Q and R sit 1.0 m, 2.0 m and 3.0 m from the centre of a merry-go-round turning four times each minute. Find the angular velocity, centripetal force and speed of each.',
    a: E('ω = ' + F('4 × 2π', '60') + ' = 0.419 rad s^{-1} for all three') + E('F = mω^2r: 5.26 N, 10.5 N, 15.8 N') + E('v = rω: 0.42, 0.84, 1.26 m s^{-1}') + N('Same ω, so F and v are proportional to r.') },
  { id: 'p5av11', dp: '5.2.3', t: 'calc', q: 'A disc rotates at 5.0 Hz. A 25 g coin sits 1.25 m from the centre. Find the period, angular velocity, centripetal force on the coin and its speed.',
    a: E('T = 1 ÷ 5.0 = 0.20 s,  ω = 2π × 5.0 = 31.4 rad s^{-1}') + E('F = mω^2r = 0.025 × 31.4^2 × 1.25 = 30.8 N') + E('v = rω = 1.25 × 31.4 = 39.3 m s^{-1}') },
  { id: 'p5av12', dp: '5.2.3', t: 'calc', q: 'In a figure-skating “death spiral”, Jenny (50.0 kg) has her centre of mass moving in a circle of radius 65.0 cm once every 1.80 s. What net force must George apply?',
    a: E('v = ' + F('2π × 0.650', '1.80') + ' = 2.27 m s^{-1}') + E('F = ' + F('50.0 × 2.27^2', '0.650') + ' = 396 N towards the centre') },
  { id: 'p5av13', dp: '5.2.3', t: 'calc', q: 'A washing machine barrel of radius 25 cm spins at 1800 revolutions per minute. Find the speed, angular velocity and acceleration of clothes on the wall.',
    a: E('f = 30 Hz → v = 2π × 0.25 × 30 = 47.1 m s^{-1}') + E('ω = ' + F('47.1', '0.25') + ' = 188 rad s^{-1}') + E('a = ' + F('47.1^2', '0.25') + ' = 8.88 × 10^3 m s^{-2}') },
  { id: 'p5av14', dp: '5.2.3', t: 'calc', q: 'A CD drive spins at 1200 revolutions per minute. The outer row of data is 5.6 cm from the centre. Find its speed, angular velocity and acceleration.',
    a: E('f = 20 Hz → v = 2π × 0.056 × 20 = 7.04 m s^{-1}') + E('ω = 2π × 20 = 126 rad s^{-1}') + E('a = ' + F('7.04^2', '0.056') + ' = 884 m s^{-2}') },
  { id: 'p5av15', dp: '5.2.3', t: 'calc', q: 'Find the angular speeds of a clock’s second, minute and hour hands, a 45 rpm record and a 4000 rpm CD drive.',
    a: L(['Second hand: 2π ÷ 60 = 0.105 rad s^{-1}', 'Minute hand: 2π ÷ 3600 = 1.75 × 10^{-3} rad s^{-1}', 'Hour hand: 2π ÷ 43 200 = 1.45 × 10^{-4} rad s^{-1}', '45 rpm: 45 × 2π ÷ 60 = 4.71 rad s^{-1}', '4000 rpm: 4000 × 2π ÷ 60 = 419 rad s^{-1}']) },
  { id: 'p5av16', dp: '5.2.3', t: 'calc', q: 'X (mass m, radius r) and Y (mass 9m, radius 3r) rotate about the same point with the same frequency. Find the ratio F_{X} : F_{Y} of their centripetal forces.',
    a: P('Same frequency means the same ω, so use F = mω^2r:') + E(F('F_{X}', 'F_{Y}') + ' = ' + F('m × r', '9m × 3r') + ' = ' + F('1', '27')) + P('F_{X} : F_{Y} = 1 : 27') },
  { id: 'p5av17', dp: '5.2.3', t: 'calc', q: 'A disc spins at 4.7 rad s^{-1}. Find the linear speed of objects placed 4.0 cm and 8.0 cm from its centre.',
    a: E('v = rω = 0.040 × 4.7 = 0.19 m s^{-1}') + E('v = 0.080 × 4.7 = 0.38 m s^{-1}') },
  { id: 'p5av18', dp: '5.2.3', t: 'calc', q: 'A 3.0 kg object moves in a horizontal circle of radius 2.5 m and is photographed with a 44 Hz strobe; one full revolution spans 22 flash intervals. Find T, f, ω, v, the acceleration and the centripetal force.',
    a: E('T = 22 × ' + F('1', '44') + ' = 0.50 s,  f = 2.0 Hz') + E('ω = 2π × 2.0 = 12.6 rad s^{-1},  v = rω = 31.4 m s^{-1}') + E('a = ' + F('31.4^2', '2.5') + ' = 395 m s^{-2},  F = 3.0 × 395 = 1.18 × 10^3 N') },
  { id: 'p5av19', dp: '5.2.3', t: 'calc', q: 'A string can hold 60.0 kg hung vertically. A 3.00 m length whirls a 4.00 kg ball in a horizontal circle faster and faster until it breaks. Find the breaking force, the maximum speed, the period and the frequency.',
    a: E('F = 60.0 × 9.8 = 588 N (this is the centripetal force just before it breaks)') + E('v = ' + SQ('588 × 3.00 ÷ 4.00') + ' = 21.0 m s^{-1}') + E('T = ' + F('2π × 3.00', '21.0') + ' = 0.898 s,  f = 1.11 Hz') }
]});

DECKS.push({ id: 'phys-m5-en', fa: 'fa2', title: 'Energy, work and vertical circles', dps: ['5.2.3', '5.2.4'], cards: [
  { id: 'p5en01', dp: '5.2.4', t: 'eq', q: 'State the formulas for kinetic energy, change in gravitational potential energy near the Earth’s surface, and mechanical energy. When is mechanical energy conserved?',
    a: E('K = ½mv^2    ΔU = mgΔh    E_{m} = U + K') + P('Mechanical energy is constant unless work is done by an external force (e.g. friction, air resistance): (E_{m})_{initial} = (E_{m})_{final}. Questions usually assume an ideal system where energy only changes between K and U.') },
  { id: 'p5en02', dp: '5.2.4', t: 'con', q: 'How much work does the centripetal force do on an object in uniform circular motion in a horizontal plane? Explain.',
    a: P('<b>None.</b> Work is only done by a force (or component) in the direction of the displacement: W = F_{∥}s. The centripetal force is perpendicular to the displacement at every instant, so W = 0.') + P('No energy is transferred, so the kinetic energy and speed stay constant. Like a waiter walking at constant height with a tray, a satellite needs no work done on it to keep orbiting (no air resistance in space).') },
  { id: 'p5en03', dp: '5.2.4', t: 'con', q: 'How does energy change for an object moving in a <b>vertical</b> circle (e.g. a roller coaster loop)?',
    a: P('Kinetic energy is converted to gravitational potential energy as it rises and back again as it falls, with total mechanical energy conserved (ignoring friction). It is fastest at the bottom and slowest at the top, so the centripetal force needed (mv^2/r) changes around the circle: the motion is not uniform.') },
  { id: 'p5en04', dp: '5.2.4', t: 'calc', q: 'A 60 kg skateboarder starts from rest at A, 4.0 m above the bottom B of a frictionless half-pipe. What is her speed at B?',
    a: E('ΔU lost = ΔK gained:  mg(h_{A} − h_{B}) = ½mv_{B}^2') + E('v_{B} = ' + SQ('2 × 9.8 × 4.0') + ' = 8.85 → 8.9 m s^{-1}') + N('Mass cancels.') },
  { id: 'p5en05', dp: '5.2.4', t: 'calc', q: 'The 60 kg skateboarder reaches the bottom of a half-pipe of radius 4.0 m at 8.9 m s^{-1}. Find the net force and the normal reaction force on her there.',
    a: E('F_{net} = ' + F('mv^2', 'r') + ' = ' + F('60 × 78.4', '4.0') + ' = 1176 N ≈ 1.2 × 10^3 N upwards') + P('Up positive: F_{net} = R − mg, so') + E('R = 1176 + 60 × 9.8 = 1764 N ≈ 1.8 × 10^3 N upwards') + P('R is larger than her weight, so she feels heavier at the bottom.') + N('Your booklet adds the rounded 1200 N and gets 1788 N; both round to 1800 N.') },
  { id: 'p5en06', dp: '5.2.4', t: 'con', q: 'What is “apparent weight”, and why can a person never truly be weightless?',
    a: P('Apparent weight is the <b>normal (contact) force</b> R that the seat or floor exerts on you; it is what you feel. Your actual weight mg doesn’t change during a ride.') + P('You are always in a gravitational field, so you always have weight. You feel “weightless” when there is no contact force: when you are falling at the same rate as your surroundings (the ISS, or a plane diving to simulate zero gravity).') },
  { id: 'p5en07', dp: '5.2.3', t: 'eq', q: 'Derive the normal force on a roller coaster rider at the <b>top of a hill</b> of radius r.',
    a: P('The centre is below the rider; take down as positive. Forces: weight mg down, normal force R up.') + E('F_{net} = mg − R = ' + F('mv^2', 'r') + '  →  R = mg − ' + F('mv^2', 'r')) + P('R is less than mg: the rider feels lighter. The seat can’t pull, so if R would go negative, restraints are needed.'), v: 'p5coaster' },
  { id: 'p5en08', dp: '5.2.3', t: 'eq', q: 'How fast can a roller coaster go over the top of a hill of radius r before the rider just loses contact with the seat?',
    a: E('R = mg − ' + F('mv^2', 'r') + ' = 0  →  v = ' + SQ('gr')) + P('This is independent of the rider’s mass; it depends only on the radius of the hill.') },
  { id: 'p5en09', dp: '5.2.3', t: 'eq', q: 'Derive the normal force on a rider at the <b>bottom of a dip</b> of radius r.',
    a: P('The centre is above; take up as positive.') + E('F_{net} = R − mg = ' + F('mv^2', 'r') + '  →  R = mg + ' + F('mv^2', 'r')) + P('R is more than mg: the rider is pressed into the seat and feels heavier (like a pilot pulling out of a dive).'), v: 'p5coaster' },
  { id: 'p5en10', dp: '5.2.3', t: 'eq', q: 'Derive the normal force on a rider upside down at the <b>top of a loop</b>. What happens if the speed is too low?',
    a: P('Both R and mg point down, towards the centre (down positive):') + E('R + mg = ' + F('mv^2', 'r') + '  →  R = ' + F('mv^2', 'r') + ' − mg') + P('If v^2 < gr, R would have to be negative, which is impossible: the rider would fall out (and the car off the track). Coasters have wheels on both sides of the track. Rides can be designed so R = 0 (feel weightless) or R = mg at the top.'), v: 'p5coaster' },
  { id: 'p5en11', dp: '5.2.3', t: 'rec', q: 'Why do high-speed roller coasters use <b>clothoid</b> (teardrop) loops rather than circles?',
    a: P('The radius at the bottom of a clothoid loop is much larger than at the top. Since the force needed is mv^2/r, a larger radius at the fast bottom keeps the g-forces bearable, while a small radius at the top lets the car stay on the track at a lower speed.') },
  { id: 'p5en12', dp: '5.2.3', t: 'eq', q: 'How is the “g-force” on a person calculated? What happens at 6–7 g?',
    a: E('g-force = ' + F('upwards acceleration + 9.8', '9.8')) + P('It is the ratio of apparent weight to actual weight. For example, an upward acceleration of 19.6 m s^{-2} gives 3 g.') + P('At 6 or 7 g, not enough blood reaches the brain and a pilot or passenger may pass out.') },
  { id: 'p5en13', dp: '5.2.4', t: 'exam', q: '2019 HSC Q30 (6 marks): A ball starts at rest at P and travels along a frictionless track to Q, where it leaves the track at 1.5 m s^{-1} at 50° below the horizontal. (a) Find the height difference between P and Q. (b) It takes 0.5 s to reach the floor. Find the height of Q above the floor.',
    a: P('(a) Energy conservation, mgh = ½mv^2:') + E('h = ' + F('v^2', '2g') + ' = ' + F('1.5^2', '2 × 9.8') + ' = 0.11 m') + P('(b) Down positive: u_{y} = 1.5 sin50° = 1.15 m s^{-1}.') + E('s = 1.15 × 0.5 + ½ × 9.8 × 0.5^2 = 1.8 m') },
  { id: 'p5en14', dp: '5.2.4', t: 'calc', q: 'A 50.0 g toy car is released from rest at D (75.0 cm). Taking A as 0 cm, B is 25.0 cm and C is 50.0 cm high. Find its speed at A, B and C (no friction).',
    a: E('v = ' + SQ('2gΔh')) + L(['A (drop 0.750 m): v = 3.83 m s^{-1}', 'B (drop 0.500 m): v = 3.13 m s^{-1}', 'C (drop 0.250 m): v = 2.21 m s^{-1}']) + N('The mass doesn’t matter: m cancels from ½mv^2 = mgΔh.') }
]});

DECKS.push({ id: 'phys-m5-tq', fa: 'fa2', title: 'Torque', dps: ['5.2.5'], cards: [
  { id: 'p5tq01', dp: '5.2.5', t: 'def', q: 'Define <b>torque</b> and give its formula and unit.',
    a: P('Torque (τ) is the turning effect of a force about a pivot. It depends on the size of the force, its direction and how far from the pivot it acts.') + E('τ = r_{⊥}F = rF sinθ') + P('r is the distance from the pivot to where the force acts, θ the angle between r and F. Unit: newton metre (N m).') },
  { id: 'p5tq02', dp: '5.2.5', t: 'con', q: 'A force pushes a door at an angle θ to the door. Why does only part of the force turn the door?',
    a: P('Only the component of the force perpendicular to the door, F_{⊥} = F sinθ, turns it about the hinge. The component along the door just pushes into the hinge.') + E('τ = r × F sinθ') + P('Equivalently, use the perpendicular distance r sinθ from the pivot to the line of the force; the torque is the same.') },
  { id: 'p5tq03', dp: '5.2.5', t: 'con', q: 'Torque is a vector. How is its direction described in HSC questions?',
    a: P('Its direction is perpendicular to the plane containing r and F, but in HSC-style questions describe it by the rotation it produces: <b>clockwise</b> or <b>anticlockwise</b>.') },
  { id: 'p5tq04', dp: '5.2.5', t: 'con', q: 'What is the condition for a lever (or any system) to be in rotational equilibrium?',
    a: P('The net torque is zero: the sum of the clockwise torques equals the sum of the anticlockwise torques about the pivot.') + E('Στ_{clockwise} = Στ_{anticlockwise}') + P('Equal forces at equal distances balance. Increasing the lever arm on one side increases that side’s torque, so the system rotates that way.') },
  { id: 'p5tq05', dp: '5.2.5', t: 'rec', q: 'Describe the three classes of lever and give examples.',
    a: L(['<b>Class 1</b>: fulcrum between the effort and the load (seesaw, pliers).', '<b>Class 2</b>: load between the fulcrum and the effort (wheelbarrow, nutcracker).', '<b>Class 3</b>: effort between the fulcrum and the load (human forearm).']), v: 'p5levers' },
  { id: 'p5tq06', dp: '5.2.5', t: 'calc', q: 'A 60 N force is applied to the end of a 12 cm wrench. What is the maximum torque it can produce?',
    a: E('τ = rF (at 90°) = 0.12 × 60 = 7.2 N m') },
  { id: 'p5tq07', dp: '5.2.5', t: 'calc', q: 'A torque of 30 N m is needed to close a door 1.5 m wide. What is the minimum force needed?',
    a: P('Minimum force: apply it at the edge (r = 1.5 m), perpendicular to the door.') + E('F = ' + F('τ', 'r') + ' = ' + F('30', '1.5') + ' = 20 N') },
  { id: 'p5tq08', dp: '5.2.5', t: 'calc', q: 'A 90.0 g mass is 75 cm from the pivot of a balance. What mass must be placed 45 cm from the pivot on the other side for equilibrium?',
    a: E('m × 45 = 90.0 × 75 → m = 150 g (0.15 kg)') + N('g cancels from both sides, so you can work with masses and any consistent distance unit.') },
  { id: 'p5tq09', dp: '5.2.5', t: 'calc', q: 'Alex (120 kg) and Sam (40 kg) sit on a 3.5 m seesaw pivoted at its centre. Sam sits at one end. Where must Alex sit to balance it?',
    a: E('120 × d = 40 × 1.75 → d = 0.58 m from the centre, on the other side') },
  { id: 'p5tq10', dp: '5.2.5', t: 'calc', q: 'A 125 cm mobile is supported at the 50.0 cm mark. A 25.0 g mass hangs at 25.0 cm and an identical one at 125.0 cm. Where should a third 25.0 g mass go so the mobile stays horizontal?',
    a: P('About the support: left mass 25 cm to the left; right mass 75 cm to the right.') + E('25.0 × 25 + 25.0 × x = 25.0 × 75 → x = 50 cm to the left of the support') + P('So at the <b>0 cm mark</b>: the very left end of the mobile.') },
  { id: 'p5tq11', dp: '5.2.5', t: 'calc', q: 'Determine the magnitude of the net torque on this system and the direction it rotates. Pivot at the left end; 181 N straight down at 3.11 m; 142 N at 30° to the beam at 5.92 m.', vf: 'img:p5_tq7',
    a: L(['181 N acting straight down at 3.11 m: τ = 3.11 × 181 = 562.9 N m <b>clockwise</b>.', '142 N at 30° to the beam at 5.92 m: τ = 5.92 × 142 × sin30° = 420.3 N m <b>anticlockwise</b>.']) + E('τ_{net} = 562.9 − 420.3 = 143 N m clockwise') },
  { id: 'p5tq12', dp: '5.2.5', t: 'calc', q: 'Determine the magnitude of the net torque on this system and the direction it rotates. Pivot at the centre; 45 N at 20° to the beam, 2.3 m to the right; 181 N at 38° to the beam, 1.7 m to the left.', vf: 'img:p5_tq8',
    a: L(['45 N at 20° to the beam, 2.3 m from the pivot: τ = 2.3 × 45 × sin20° = 35.4 N m', '181 N at 38° to the beam, 1.7 m from the pivot: τ = 1.7 × 181 × sin38° = 189.4 N m']) + P('Both turn the beam the same way:') + E('τ_{net} = 35.4 + 189.4 = 224 N m anticlockwise') },
  { id: 'p5tq13', dp: '5.2.5', t: 'calc', q: 'This system is in equilibrium. Determine the unknown applied force F_{app}, which acts perpendicular to the beam 45 cm right of the pivot. On the left: 67 N at 63° to the beam, 70 cm from the pivot; 25 N at 33°, 40 cm from the pivot.', vf: 'img:p5_tq9',
    a: L(['67 N at 63°, 70 cm from the pivot: τ = 0.70 × 67 × sin63° = 41.8 N m', '25 N at 33°, 40 cm from the pivot: τ = 0.40 × 25 × sin33° = 5.45 N m']) + P('Both are <b>clockwise</b>, totalling 47.2 N m, so F_{app} must supply 47.2 N m anticlockwise:') + E('F_{app} = ' + F('47.2', '0.45') + ' = 105 N') },
  { id: 'p5tq14', dp: '5.2.5', t: 'exam', q: '2019 HSC Q26(a) (3 marks): A 400 N force was applied at 0.25 m on a spanner at angles of 0–25°. The data formed a straight line, and the student proposed τ = kθ with k = 1.7 N m per degree. Justify the validity of the model using the graph.',
    a: P('The data points lie on (or very close to) a straight line passing through the origin, so the torque is directly proportional to the angle over the range tested.') + P('The gradient of the line is about 1.7 N m per degree (e.g. about 42.5 N m at 25°), matching k. So τ = kθ is a valid model for angles from 0 to 25°.'), v: 'p5tqmodel' },
  { id: 'p5tq15', dp: '5.2.5', t: 'exam', q: '2019 HSC Q26(b) (3 marks): What happens to the accuracy of the τ = kθ model as the angle increases beyond 25°? Justify with reference to a different model.',
    a: P('Its accuracy decreases. The correct model is τ = rF sinθ = 0.25 × 400 × sinθ = 100 sinθ N m.') + P('For small angles sinθ is almost proportional to θ, so the two agree. At larger angles sinθ grows more slowly: at 60°, kθ predicts 102 N m but rF sinθ gives 86.6 N m. The torque can never exceed rF = 100 N m (at 90°), while the linear model predicts 153 N m. So kθ increasingly overestimates.'), v: 'p5tqmodel' },
  { id: 'p5tq16', dp: '5.2.5', t: 'con', q: 'Why are door handles placed far from the hinges, and how should you push to open a door with the least force?',
    a: P('τ = rF sinθ. A larger distance r from the pivot gives more torque for the same force, so less force is needed. Pushing perpendicular to the door (θ = 90°, sinθ = 1) makes all of the force produce torque.') }
]});

/* ================= 5.3 MOTION IN GRAVITATIONAL FIELDS ================= */
DECKS.push({ id: 'phys-m5-ng', fa: 'fa3', title: 'Universal gravitation and field strength', dps: ['5.3.1'], cards: [
  { id: 'p5ng01', dp: '5.3.1', t: 'eq', q: 'State Newton’s Law of Universal Gravitation in words and as an equation.',
    a: P('The force of attraction between any two bodies in the universe is proportional to the product of their masses and inversely proportional to the square of the distance between their centres.') + E('F = ' + F('GMm', 'r^2') + ',   G = 6.67 × 10^{-11} N m^2 kg^{-2}') + P('Newton (Principia, 1687) treated the masses as point masses, so r is measured centre to centre.') },
  { id: 'p5ng02', dp: '5.3.1', t: 'con', q: 'Who first measured G, and what does its size tell us about gravity?',
    a: P('Henry Cavendish measured G experimentally (Newton didn’t know its value). G is tiny (6.67 × 10^{-11}), which shows gravitation is a very weak force: a large mass is needed to produce a noticeable gravitational effect.') },
  { id: 'p5ng03', dp: '5.3.1', t: 'con', q: 'The Earth pulls on a satellite. How does the force the satellite exerts on the Earth compare, and why don’t we notice it?',
    a: P('By Newton’s third law the forces are <b>equal in magnitude and opposite in direction</b>. The Earth’s mass is so large that the acceleration this force gives it (a = F/m) is negligible, so we only notice the effect on the smaller mass.') },
  { id: 'p5ng04', dp: '5.3.1', t: 'def', q: 'Define gravitational field strength and derive g = GM/r^2.',
    a: P('The gravitational force per unit mass on a small test mass placed in the field, in N kg^{-1} (equivalent to m s^{-2}).') + E('g = ' + F('F', 'm') + ' = ' + F('GMm/r^2', 'm') + ' = ' + F('GM', 'r^2')) + N('g = GM/r^2 is not on the data sheet.') },
  { id: 'p5ng05', dp: '5.3.1', t: 'con', q: 'What factors affect the gravitational field strength of a planet, and how?',
    a: L(['g ∝ M: directly proportional to the mass of the central body.', 'g ∝ 1/r^2: inversely proportional to the square of the distance from its centre (double r, quarter g).']) + P('Near the Earth’s surface the change with height is small, so the field is treated as uniform (9.8 N kg^{-1}).'), v: 'p5field' },
  { id: 'p5ng06', dp: '5.3.1', t: 'con', q: 'How is a planet’s gravitational field represented with field lines?',
    a: L(['Arrows point <b>towards the centre</b> of the planet (gravity only attracts).', 'Spacing shows strength: close lines = strong field, widely spaced = weak field. The lines spread out with distance.', 'Close to the surface the lines are drawn parallel and perpendicular to the surface (uniform field).']), v: 'p5field' },
  { id: 'p5ng07', dp: '5.3.1', t: 'con', q: 'A question gives a satellite’s <b>altitude</b>. What distance do you use in F = GMm/r^2 and g = GM/r^2?',
    a: E('orbital radius r = radius of the planet + altitude') + P('Always use the centre-to-centre distance. For Earth, R = 6.371 × 10^6 m (data sheet). Convert km to m.'), v: 'p5field' },
  { id: 'p5ng08', dp: '5.3.1', t: 'calc', q: 'Using M = 6.0 × 10^{24} kg and R = 6371 km, find the gravitational force on a 1.00 kg mass on the Earth’s surface and 400.0 km above it.',
    a: E('surface: F = ' + F('6.67 × 10^{-11} × 6.0 × 10^{24} × 1.00', '(6.371 × 10^6)^2') + ' = 9.86 N') + E('400 km: F = ' + F('6.67 × 10^{-11} × 6.0 × 10^{24} × 1.00', '(6.771 × 10^6)^2') + ' = 8.73 N') + P('So near the surface 1 kg feels about 9.8 N (a = 9.8 m s^{-2}), and the force decreases with altitude.') },
  { id: 'p5ng09', dp: '5.3.1', t: 'calc', q: 'Calculate g at the Earth’s surface from data-sheet values. Why isn’t it exactly 9.8 N kg^{-1}? Recalculate with M = 5.97219 × 10^{24} kg.',
    a: E('g = ' + F('6.67 × 10^{-11} × 6.0 × 10^{24}', '(6.371 × 10^6)^2') + ' = 9.86 N kg^{-1}') + P('The data-sheet mass is rounded to 2 significant figures, and the real Earth isn’t a uniform sphere (its spin, flattening and crust also change the measured value).') + E('with 5.97219 × 10^{24} kg: g = 9.81 N kg^{-1}') },
  { id: 'p5ng10', dp: '5.3.1', t: 'calc', q: 'What is the gravitational field strength at the International Space Station, about 400 km above the Earth?',
    a: E('g = ' + F('6.67 × 10^{-11} × 6.0 × 10^{24}', '(6.371 × 10^6 + 4.00 × 10^5)^2') + ' = 8.73 N kg^{-1}') + P('About 89% of the surface value, so astronauts are not “weightless” because gravity is absent.') },
  { id: 'p5ng11', dp: '5.3.1', t: 'calc', q: 'Find the gravitational force between two 60.0 kg people whose centres are 5.00 m apart.',
    a: E('F = ' + F('6.67 × 10^{-11} × 60.0 × 60.0', '5.00^2') + ' = 9.60 × 10^{-9} N') + P('Tiny: gravity is only noticeable when at least one mass is huge.') },
  { id: 'p5ng12', dp: '5.3.1', t: 'calc', q: 'The Moon has mass 7.35 × 10^{22} kg and diameter 3467 km; Pluto has mass 1.27 × 10^{22} kg and diameter 2320 km. Compare their surface gravitational field strengths as a ratio.',
    a: E('g_{Moon} = ' + F('6.67 × 10^{-11} × 7.35 × 10^{22}', '(1.7335 × 10^6)^2') + ' = 1.63 N kg^{-1}') + E('g_{Pluto} = ' + F('6.67 × 10^{-11} × 1.27 × 10^{22}', '(1.160 × 10^6)^2') + ' = 0.630 N kg^{-1}') + P('g_{Moon} : g_{Pluto} = 2.59 : 1') + N('Remember to halve the diameter. With the Moon’s usual diameter (3476 km) g = 1.62 N kg^{-1}.') },
  { id: 'p5ng13', dp: '5.3.1', t: 'calc', q: 'Ganymede has mass 1.50 × 10^{23} kg and diameter about 5270 km. Find its surface field strength, compare it with Earth’s, and find the weight of a 10.0 kg mass there.',
    a: E('g = ' + F('6.67 × 10^{-11} × 1.50 × 10^{23}', '(2.635 × 10^6)^2') + ' = 1.44 N kg^{-1}') + P('About 15% of Earth’s (roughly one-seventh).') + E('W = mg = 10.0 × 1.44 = 14.4 N') },
  { id: 'p5ng14', dp: '5.3.1', t: 'calc', q: 'Two moons have masses M and 2M and radii R and 2R. Compare their surface gravitational field strengths.',
    a: E('g_{1} = ' + F('GM', 'R^2') + '    g_{2} = ' + F('G(2M)', '(2R)^2') + ' = ' + F('GM', '2R^2')) + P('g_{1} : g_{2} = 2 : 1. The bigger moon has half the field strength.') },
  { id: 'p5ng15', dp: '5.3.1', t: 'calc', q: 'Predict the effect on the gravitational force between two objects of (a) doubling their distance apart, (b) doubling both masses, (c) halving one mass and halving the distance.',
    a: L(['(a) F ∝ 1/r^2: force becomes <b>¼</b>.', '(b) F ∝ Mm: force becomes <b>4×</b>.', '(c) ½ ÷ (½)^2 = 2: force is <b>doubled</b>.']) },
  { id: 'p5ng16', dp: '5.3.1', t: 'calc', q: 'Masses of 10.0 kg and 20.0 kg hang with their centres 2.00 m apart. Compare the gravitational force between them on the Moon (g = 1.6 N kg^{-1}) and on Earth (g = 9.8 N kg^{-1}).',
    a: E('F = ' + F('6.67 × 10^{-11} × 10.0 × 20.0', '2.00^2') + ' = 3.34 × 10^{-9} N') + P('The same in both places (<b>1 : 1</b>). The attraction between the two masses depends only on their masses and separation, not on the local g (which affects their weights).') },
  { id: 'p5ng17', dp: '5.3.1', t: 'eq', q: 'How can you compare the field strengths of two planets using a ratio?',
    a: E(F('g_{Earth}', 'g_{planet}') + ' = ' + F('M_{Earth}', 'M_{planet}') + ' × ' + F('r_{planet}^2', 'r_{Earth}^2')) + P('G cancels. Use when given relative masses and radii.') },
  { id: 'p5ng18', dp: '5.3.1', t: 'prac', q: 'Using g = GM/r^2, compare the surface field strength on Mars and Mercury, Earth and the Moon, and Pluto and the Moon (booklet practical).',
    a: L(['<b>Mars vs Mercury</b>: similar (3.71 vs 4.01 N kg^{-1}). Mercury’s is slightly larger even though Mars is nearly twice as massive, because Mercury is much smaller (g ∝ 1/r^2).', '<b>Earth vs Moon</b>: 9.81 : 1.62, about 6 : 1.', '<b>Pluto vs Moon</b>: Pluto’s (0.63) is about 0.39 of the Moon’s.']), v: 'p5planets' }
]});

DECKS.push({ id: 'phys-m5-sa', fa: 'fa3', title: 'Satellites and orbits', dps: ['5.3.2', '5.3.3'], cards: [
  { id: 'p5sa01', dp: '5.3.2', t: 'def', q: 'What is a satellite? Give examples of natural and artificial satellites.',
    a: P('Any object orbiting the Earth, the Sun or another massive body.') + L(['<b>Natural</b>: the Moon, planets, comets.', '<b>Artificial</b>: communication, scientific research, weather forecasting and intelligence (spy) satellites.']) + P('All follow the same physics principles and mathematical models.') },
  { id: 'p5sa02', dp: '5.3.3', t: 'con', q: 'What are the Van Allen belts, and how do they affect where satellites are placed?',
    a: P('Belts of energetic charged particles held around the Earth by its magnetic field, from about 1000 km to 60 000 km altitude. The particles come mostly from the solar wind and cosmic rays; the outer belt is mainly electrons, the inner belt protons and electrons.') + P('The radiation endangers electronics and people, which restricts satellites between about 1000 and 36 000 km; satellites spending time there need shielding.') },
  { id: 'p5sa03', dp: '5.3.3', t: 'def', q: 'What is a <b>low Earth orbit</b>? Why these limits, and what orbits there?',
    a: P('Altitudes of about <b>250–1000 km</b>.') + L(['Below about 250 km, atmospheric friction is significant.', 'Above about 1000 km are the Van Allen radiation belts.', 'The ISS orbits at about 250–400 km, the Hubble telescope at about 600 km; spy satellites also use this region (usually in polar orbits).']) },
  { id: 'p5sa04', dp: '5.3.3', t: 'def', q: 'Describe a <b>geostationary</b> orbit and its uses.',
    a: L(['Directly above the <b>equator</b>, moving in the same direction as the Earth rotates.', 'Period of one sidereal day: 23 h 56 min 4 s = 86 164 s (the time for Earth to rotate once on its axis).', 'Altitude about 35 900 km.', 'It stays above the same point on Earth, so dishes don’t need to track it.']) + P('Uses: communications (e.g. Foxtel) and weather satellites.') },
  { id: 'p5sa05', dp: '5.3.3', t: 'def', q: 'How do <b>geosynchronous</b> and <b>polar</b> orbits differ from geostationary orbits?',
    a: L(['<b>Geosynchronous</b>: the same 23 h 56 min 4 s period but not over the equator, so the satellite traces a figure-of-eight across the sky. Dishes can usually still track it, or receivers amplify the varying signal.', '<b>Polar</b>: passes over (or near) the poles while the Earth rotates beneath it, so it covers the whole surface at least once a day: used by spy and mapping satellites.']) },
  { id: 'p5sa06', dp: '5.3.3', t: 'rec', q: 'Compare geostationary and low Earth orbit satellites: position, period, altitude, view, advantages, disadvantages and uses.',
    a: P('See the table.'), v: 'p5geoleo' },
  { id: 'p5sa07', dp: '5.3.2', t: 'eq', q: 'Derive the orbital velocity of a satellite in a circular orbit of radius r around a mass M. (Not on the data sheet.)',
    a: P('The gravitational force provides the centripetal force:') + E(F('mv^2', 'r') + ' = ' + F('GMm', 'r^2') + '  →  v = ' + SQ(F('GM', 'r'))) + P('The satellite’s mass cancels, so the speed doesn’t depend on it. The greater the orbital radius, the slower the satellite.') },
  { id: 'p5sa08', dp: '5.3.2', t: 'eq', q: 'Give three expressions for the centripetal acceleration of a satellite in a circular orbit.',
    a: E('a_{c} = ' + F('v^2', 'r') + ' = ' + F('GM', 'r^2') + ' = ' + F('4π^2 r', 'T^2')) + P('The middle one shows a_{c} equals the gravitational field strength g at the orbit. The last uses v = 2πr/T.') },
  { id: 'p5sa09', dp: '5.3.2', t: 'con', q: 'Astronauts on the ISS feel weightless, yet g there is about 8.7 N kg^{-1}. Explain.',
    a: P('Gravity still acts on them; it provides the centripetal force for the orbit. The astronauts and the station are both in free fall, accelerating towards the Earth at the same rate, so the floor exerts no normal force on them. With no contact force, their apparent weight is zero.') },
  { id: 'p5sa10', dp: '5.3.2', t: 'con', q: 'Use Newton’s cannon idea to explain why an orbiting satellite doesn’t fall to Earth.',
    a: P('A satellite <b>is</b> falling towards the Earth, but it also moves sideways very fast. Newton imagined a cannon on a high mountain: faster launches land further away until, at the right speed, the curved Earth falls away beneath the projectile as fast as it falls, so it goes all the way round in orbit. Even faster gives a more elongated orbit, and fast enough escapes.') },
  { id: 'p5sa11', dp: '5.3.3', t: 'con', q: 'What happens to a satellite’s orbit if a force acts (a) in its direction of motion (b) against its motion? Why launch near the equator?',
    a: L(['(a) It gains energy and moves out to a <b>larger orbital radius</b>, where it ends up moving more slowly.', '(b) It loses energy (e.g. atmospheric drag in LEO) and drops to a lower orbit (orbital decay), where it moves faster.', 'Near the equator the Earth’s surface moves fastest eastwards (about 465 m s^{-1}), so launching east there gives a free boost and saves fuel.']) },
  { id: 'p5sa12', dp: '5.3.3', t: 'calc', q: 'Calculate the altitude and orbital speed of a geostationary satellite (T = 86 164 s, M = 6.0 × 10^{24} kg).',
    a: E('r^3 = ' + F('GMT^2', '4π^2') + ' = ' + F('6.67 × 10^{-11} × 6.0 × 10^{24} × 86 164^2', '4π^2') + ' → r = 4.22 × 10^7 m') + E('altitude = 4.22 × 10^7 − 6.371 × 10^6 = 3.58 × 10^7 m (about 35 800 km)') + E('v = ' + F('2πr', 'T') + ' = 3.08 × 10^3 m s^{-1}') },
  { id: 'p5sa13', dp: '5.3.3', t: 'calc', q: 'The ISS orbits at an average altitude of 408 km. Find its period in minutes.',
    a: E('r = 6.371 × 10^6 + 4.08 × 10^5 = 6.779 × 10^6 m') + E('T = 2π' + SQ(F('r^3', 'GM')) + ' = 5.54 × 10^3 s = 92.4 min') + P('Its speed is about 7.68 × 10^3 m s^{-1}, so it orbits about 15 times a day.') },
  { id: 'p5sa14', dp: '5.3.3', t: 'calc', q: 'Find the period and speed of satellites at 250 km and 1000 km altitude, and the altitude and speed of a geostationary satellite (data sheet values).',
    a: L(['250 km: T = 1.49 h, v = 7.77 × 10^3 m s^{-1}', '1000 km: T = 1.75 h, v = 7.37 × 10^3 m s^{-1}', 'Geostationary: altitude 3.58 × 10^4 km, v = 3.08 × 10^3 m s^{-1}']), v: 'p5sats' },
  { id: 'p5sa15', dp: '5.3.2', t: 'exam', q: 'Apollo 11 (b) (2 marks): The Ascent Module docked with the Command Module in lunar orbit, increasing the spacecraft’s mass at the same altitude. Justify the statement that docking made no difference to its orbital speed.',
    a: P('Equating the gravitational force and the centripetal force, GMm/r^2 = mv^2/r, so v = ' + SQ('GM/r') + '. The spacecraft’s mass m cancels: orbital speed depends only on the Moon’s mass and the orbital radius. The radius was unchanged, so the speed was unchanged.') },
  { id: 'p5sa16', dp: '5.3.2', t: 'con', q: 'Give two reasons a satellite in a higher orbit has a longer period.',
    a: L(['It has a <b>longer path</b> to travel (circumference 2πr).', 'It moves more <b>slowly</b> (v = ' + SQ('GM/r') + ').']) + P('Together, T ∝ r^{3/2} (Kepler’s third law).') }
]});

DECKS.push({ id: 'phys-m5-kp', fa: 'fa3', title: 'Kepler’s laws', dps: ['5.3.4', '5.3.3'], cards: [
  { id: 'p5kp01', dp: '5.3.4', t: 'rec', q: 'Outline the shift from the geocentric to the heliocentric model of the solar system.',
    a: L(['<b>Geocentric</b> (Ptolemy): the Earth at the centre, with everything else orbiting it.', '<b>Heliocentric</b> (Copernicus, mid-1500s): the Sun at the centre with planets in circular orbits. It became preferred because it made astronomical calculations easier.', 'Galileo strongly supported the Copernican model.']) },
  { id: 'p5kp02', dp: '5.3.4', t: 'rec', q: 'What was Tycho Brahe’s contribution to Kepler’s laws?',
    a: P('Brahe, a Danish astronomer, spent over twenty years compiling very precise measurements of planetary positions. Kepler worked as his assistant (1600–1601) and used this data. Circular orbits didn’t fit Brahe’s data, which led Kepler to ellipses.') },
  { id: 'p5kp03', dp: '5.3.4', t: 'def', q: 'State Kepler’s <b>first law</b> (1604) and explain eccentricity.',
    a: P('<b>Law of ellipses</b>: each planet moves in an ellipse, with the Sun off-centre at one focus.') + P('Eccentricity measures how stretched the ellipse is: e = (distance from the centre to a focus) ÷ (semi-major axis a). A circle has e = 0. Most planets have small eccentricities; comets and some asteroids are very eccentric. The Moon’s orbit has e = 0.0549.') },
  { id: 'p5kp04', dp: '5.3.4', t: 'def', q: 'State Kepler’s <b>second law</b> (1609) and what it means for a planet’s speed.',
    a: P('<b>Law of equal areas</b>: the line joining the Sun to a planet sweeps out equal areas in equal times.') + P('So a planet moves <b>fastest</b> when closest to the Sun (perihelion) and <b>slowest</b> when furthest (aphelion).'), v: 'p5kepler' },
  { id: 'p5kp05', dp: '5.3.4', t: 'con', q: 'Use energy (and forces) to explain why a planet speeds up as it approaches the Sun in an elliptical orbit.',
    a: P('Its total energy E = K + U is constant. Moving closer, U = −GMm/r becomes more negative, so K must increase: it speeds up. Moving away, it converts K back into U and slows down.') + P('In force terms: on the way in, the gravitational force has a component along the velocity (speeding it up); on the way out the component is against the velocity (slowing it down).') },
  { id: 'p5kp06', dp: '5.3.4', t: 'def', q: 'State Kepler’s <b>third law</b> (1619).',
    a: P('<b>Law of periods</b>: for all planets, the cube of the average orbital radius is proportional to the square of the orbital period.') + E(F('r^3', 'T^2') + ' = k (the same constant for all planets around the Sun)') + P('Kepler also showed it held for the moons of Jupiter.') },
  { id: 'p5kp07', dp: '5.3.4', t: 'eq', q: 'Derive Kepler’s third law, r^3/T^2 = GM/4π^2, from Newton’s law of gravitation.',
    a: E('v = ' + F('2πr', 'T') + ' and v = ' + SQ(F('GM', 'r'))) + E(F('4π^2 r^2', 'T^2') + ' = ' + F('GM', 'r') + '  →  ' + F('r^3', 'T^2') + ' = ' + F('GM', '4π^2')) + P('The constant k depends only on the <b>central</b> mass M, so it is different for objects orbiting the Earth, the Sun or Jupiter.') },
  { id: 'p5kp08', dp: '5.3.4', t: 'con', q: 'When can you use Kepler’s third law without converting to SI units?',
    a: P('When comparing two objects orbiting the <b>same</b> central mass:') + E(F('r_{1}^3', 'T_{1}^2') + ' = ' + F('r_{2}^3', 'T_{2}^2')) + P('Any conversion factors cancel, so astronomical units and years (or km and days) are fine. This is the only time you can skip SI units.') },
  { id: 'p5kp09', dp: '5.3.4', t: 'con', q: 'What does a graph of r^3 against T^2 for the planets look like, and what is its gradient?',
    a: P('A straight line through the origin (often drawn on log scales because the values span a huge range). The gradient is r^3/T^2 = k = GM/4π^2, so it can be used to find the Sun’s mass.') },
  { id: 'p5kp10', dp: '5.3.4', t: 'calc', q: 'The Moon’s distance from the Earth is given as 406 676 km (surface to surface), its radius 1733.5 km and the Earth’s radius 6371 km. Find the orbital radius and the Moon’s orbital period.',
    a: E('r = 406 676 + 1733.5 + 6371 = 414 780.5 km = 4.148 × 10^8 m') + E('T = 2π' + SQ(F('r^3', 'GM')) + ' = 2.65 × 10^6 s = 30.7 days') + N('The real period is 27.3 days: 406 676 km is close to the Moon’s greatest (apogee) distance, not its average (about 384 400 km).') },
  { id: 'p5kp11', dp: '5.3.4', t: 'calc', q: 'The Sun has mass 1.99 × 10^{30} kg and diameter 1 392 530 km; the Earth’s diameter is 12 742 km and the surface-to-surface distance is 1.50 × 10^8 km. Find Earth’s orbital period.',
    a: E('r = 1.50 × 10^{11} + 6.96 × 10^8 + 6.37 × 10^6 = 1.507 × 10^{11} m') + E('T = 2π' + SQ(F('r^3', 'GM')) + ' = 3.19 × 10^7 s = 369 days') + P('Close to the actual 365 days.') },
  { id: 'p5kp12', dp: '5.3.4', t: 'calc', q: 'Earth’s orbital radius is 1 au and its period 1 year. Mars orbits at 1.5 au. Find Mars’ period.',
    a: E(F('1^3', '1^2') + ' = ' + F('1.5^3', 'T^2') + '  →  T = ' + SQ('1.5^3') + ' = 1.84 years') },
  { id: 'p5kp13', dp: '5.3.4', t: 'calc', q: 'Pluto orbits at 39.3 au with a period of 248 years. Use Kepler’s third law to find: Venus’ period (0.72 au), Saturn’s radius (29.46 years) and Mercury’s radius (period given as 59 days).',
    a: E('k = ' + F('39.3^3', '248^2') + ' = 0.987 au^3 yr^{-2}') + L(['Venus: T = ' + SQ('0.72^3 ÷ 0.987') + ' = 0.615 years (225 days)', 'Saturn: r = (0.987 × 29.46^2)^{1/3} = 9.50 au', 'Mercury: r = (0.987 × (59/365.25)^2)^{1/3} = 0.30 au']) + N('59 days is Mercury’s rotation period. Its orbital period is 88 days, which gives the true 0.39 au.'), v: 'p5kepltbl' },
  { id: 'p5kp14', dp: '5.3.4', t: 'exam', q: 'Apollo 11 (a) (4 marks): The Command Module (9.98 × 10^3 kg) orbited the Moon with a period of 119 minutes at a radius of 1.85 × 10^6 m from the Moon’s centre. Find (i) the mass of the Moon (ii) the orbital speed.',
    a: E('M = ' + F('4π^2 r^3', 'GT^2') + ' = ' + F('4π^2 × (1.85 × 10^6)^3', '6.67 × 10^{-11} × (7140)^2') + ' = 7.35 × 10^{22} kg') + E('v = ' + F('2πr', 'T') + ' = ' + F('2π × 1.85 × 10^6', '7140') + ' = 1.63 × 10^3 m s^{-1}') + N('The spacecraft’s mass isn’t needed.') },
  { id: 'p5kp15', dp: '5.3.4', t: 'exam', q: 'HSC 2020 Q31(a) (3 marks): Account for the changes in velocity of a comet as it completes one elliptical orbit of the Sun.',
    a: L(['The only force is the Sun’s gravitational attraction, towards the Sun, so the velocity’s <b>direction</b> changes continuously (always along the tangent to the orbit).', 'Moving towards the Sun, the force has a component along the velocity, so the comet <b>speeds up</b> (U converts to K); it is fastest at perihelion.', 'Moving away, the component opposes the velocity, so it <b>slows down</b> (K converts to U); it is slowest at aphelion.', 'This matches Kepler’s second law: equal areas in equal times.']) },
  { id: 'p5kp16', dp: '5.3.4', t: 'exam', q: 'HSC 2020 Q31(b) (3 marks): Two stars A and B, each of mass m and separated by a distance x, interact gravitationally so that A moves at constant speed. Derive an expression for the speed of B.',
    a: P('With equal masses, both stars orbit their common centre of mass, the midpoint, so each has orbital radius x/2. Gravity provides the centripetal force:') + E(F('Gm^2', 'x^2') + ' = ' + F('mv^2', 'x/2') + '  →  v^2 = ' + F('Gm', '2x')) + E('v = ' + SQ(F('Gm', '2x'))) + P('B moves at the same speed as A.') }
]});

DECKS.push({ id: 'phys-m5-oe', fa: 'fa3', title: 'Orbital energy and escape velocity', dps: ['5.3.5', '5.3.4'], cards: [
  { id: 'p5oe01', dp: '5.3.5', t: 'eq', q: 'Write the gravitational potential energy of a mass m at distance r from a mass M, and define it.',
    a: E('U = −' + F('GMm', 'r')) + P('U at a point is the work done to move the mass from infinity (the zero level) to that point (r measured centre to centre). This equation is on the data sheet.') },
  { id: 'p5oe02', dp: '5.3.5', t: 'con', q: 'Why is gravitational potential energy negative?',
    a: P('U is defined as zero at infinity, where there is no gravitational field. A mass released anywhere closer falls towards the planet, i.e. to lower U, so every point at a finite distance has U less than zero. It is most negative at the planet’s surface and rises towards zero as r increases.') + P('Equivalently, work must be done on the mass to lift it out to infinity (to U = 0), so it must start below zero.'), v: 'p5energy' },
  { id: 'p5oe03', dp: '5.3.5', t: 'con', q: 'When can you use ΔU = mgΔh, and when must you use U = −GMm/r?',
    a: L(['ΔU = mgΔh: only close to the Earth’s surface, where g is roughly constant, taking the ground (or another reference) as zero.', 'U = −GMm/r: anywhere in a radial field, where g changes with distance (inverse square), taking infinity as zero.']) },
  { id: 'p5oe04', dp: '5.3.5', t: 'con', q: 'How are work and changes in gravitational potential energy linked?',
    a: P('When work is done on an object, energy is converted from one form to another. Lifting a mass against the field (further from the planet) requires work, which increases its U by exactly the work done. Moving it back towards the planet decreases U. Always link a change in energy to work being done.') },
  { id: 'p5oe05', dp: '5.3.5', t: 'eq', q: 'Derive the kinetic energy of a satellite in a circular orbit. (Not on the data sheet.)',
    a: E('v^2 = ' + F('GM', 'r') + '  (from ' + F('mv^2', 'r') + ' = ' + F('GMm', 'r^2') + ')') + E('K = ½mv^2 = ' + F('GMm', '2r')) },
  { id: 'p5oe06', dp: '5.3.5', t: 'eq', q: 'Derive the total energy of a satellite in a circular orbit, and state how U, K and E are related.',
    a: E('E = U + K = −' + F('GMm', 'r') + ' + ' + F('GMm', '2r') + ' = −' + F('GMm', '2r')) + L(['U = 2E', 'E = −K', '2K + U = 0 (K = −½U)']) + P('E is negative and depends only on the masses and the orbital radius.') },
  { id: 'p5oe07', dp: '5.3.5', t: 'con', q: 'A satellite moves from a lower to a higher circular orbit. How do its U, K and E change, and what must happen?',
    a: L(['U increases (less negative).', 'K <b>decreases</b>: it moves more slowly in the higher orbit.', 'E = −GMm/2r increases (less negative).']) + P('Since total energy increases, work must be done on the satellite (a rocket burn). Dropping to a lower orbit does the reverse: E decreases (e.g. drag), but the satellite speeds up.'), v: 'p5energy' },
  { id: 'p5oe08', dp: '5.3.5', t: 'con', q: 'Does a satellite’s mass affect its orbital energy? Does it affect its orbital speed?',
    a: P('<b>Energy: yes.</b> U, K and E are all proportional to m.') + P('<b>Speed: no.</b> v = ' + SQ('GM/r') + '; m cancels. So in a question linking two points of the same orbit, m cancels out.') },
  { id: 'p5oe09', dp: '5.3.5', t: 'def', q: 'Define <b>escape velocity</b>.',
    a: P('The minimum launch speed an unpowered projectile needs to escape a planet’s gravitational field completely, i.e. to reach an infinite distance (where U = 0) with no kinetic energy left (ignoring air resistance).') },
  { id: 'p5oe10', dp: '5.3.5', t: 'eq', q: 'Derive the escape velocity from the surface of a planet of mass M and radius r. (Not on the data sheet.)',
    a: P('It just escapes if its total energy is zero (K = |U|):') + E('K + U = 0 → ½mv^2 − ' + F('GMm', 'r') + ' = 0') + E('v_{esc} = ' + SQ(F('2GM', 'r'))) + P('It depends only on the planet’s mass and radius, not on the mass of the projectile.') },
  { id: 'p5oe11', dp: '5.3.5', t: 'calc', q: 'Calculate the escape velocity from the Earth (M = 6.0 × 10^{24} kg, r = 6.371 × 10^6 m).',
    a: E('v_{esc} = ' + SQ(F('2 × 6.67 × 10^{-11} × 6.0 × 10^{24}', '6.371 × 10^6')) + ' = 1.12 × 10^4 m s^{-1}') + P('About 11 209 m s^{-1} = 40 351 km h^{-1}, roughly Mach 33.') },
  { id: 'p5oe12', dp: '5.3.5', t: 'con', q: 'Jules Verne imagined firing a spacecraft to the Moon from a cannon. Why wouldn’t this work in practice?',
    a: L(['At escape speed, friction with the atmosphere would heat the spacecraft and burn it up almost immediately.', 'Occupants couldn’t survive the enormous g-forces of such a launch.']) + P('Without an atmosphere or occupants, firing at escape velocity would work in theory.') },
  { id: 'p5oe13', dp: '5.3.5', t: 'calc', q: 'Find the escape velocity of Mercury (mass 3.60 × 10^{23} kg, radius 2439 km).',
    a: E('v_{esc} = ' + SQ(F('2 × 6.67 × 10^{-11} × 3.60 × 10^{23}', '2.439 × 10^6')) + ' = 4.44 × 10^3 m s^{-1}') + P('About 16 000 km h^{-1}.') },
  { id: 'p5oe14', dp: '5.3.5', t: 'calc', q: 'Find the escape velocity of Venus (mass 4.87 × 10^{24} kg, radius 6052 km).',
    a: E('v_{esc} = ' + SQ(F('2 × 6.67 × 10^{-11} × 4.87 × 10^{24}', '6.052 × 10^6')) + ' = 1.04 × 10^4 m s^{-1}') },
  { id: 'p5oe15', dp: '5.3.5', t: 'calc', q: 'Find the gravitational potential energy of (a) Callisto (1.08 × 10^{23} kg) orbiting Jupiter (1.90 × 10^{27} kg) at 1.88 × 10^9 m (b) Jupiter orbiting the Sun (1.99 × 10^{30} kg) at 7.78 × 10^{11} m.',
    a: E('U = −' + F('GMm', 'r')) + P('(a) GMm = 6.67 × 10^{-11} × 1.90 × 10^{27} × 1.08 × 10^{23} = 1.369 × 10^{40}') + E('U = −' + F('1.369 × 10^{40}', '1.88 × 10^9') + ' = −7.28 × 10^{30} J') + P('(b) GMm = 6.67 × 10^{-11} × 1.99 × 10^{30} × 1.90 × 10^{27} = 2.522 × 10^{47}') + E('U = −' + F('2.522 × 10^{47}', '7.78 × 10^{11}') + ' = −3.24 × 10^{35} J') + N('The booklet’s −7.4 × 10^{30} J for Callisto doesn’t match its own data; −7.28 × 10^{30} J does.') },
  { id: 'p5oe16', dp: '5.3.5', t: 'calc', q: 'If the Earth’s mass were four times its real value (same radius), how would its escape velocity change? Justify algebraically.',
    a: E('v_{esc} = ' + SQ(F('2GM', 'r')) + ' ∝ ' + SQ('M')) + E(F('v_{new}', 'v_{old}') + ' = ' + SQ('4') + ' = 2') + P('The escape velocity would <b>double</b>.') },
  { id: 'p5oe17', dp: '5.3.5', t: 'calc', q: 'A satellite in an elliptical orbit has altitude 246 km at perigee (speed 29 300 km h^{-1}) and 1749 km at apogee. Relate its total energy at the two points, say whether its mass matters, and find its speed at apogee.',
    a: E('½mv_{p}^2 − ' + F('GMm', 'r_{p}') + ' = ½mv_{a}^2 − ' + F('GMm', 'r_{a}')) + P('Total energy is conserved. The total energy is proportional to m, but m cancels in this equation, so the speed doesn’t depend on it.') + E('v_{p} = 8139 m s^{-1}, r_{p} = 6.617 × 10^6 m, r_{a} = 8.120 × 10^6 m → v_{a} = 6.62 × 10^3 m s^{-1} = 2.38 × 10^4 km h^{-1}') },
  { id: 'p5oe18', dp: '5.3.5', t: 'calc', q: 'A 100 kg satellite orbits the planet Listeria every 4.0 hours, where the field strength is 8 N kg^{-1}. Find the orbital radius, Listeria’s mass, and the satellite’s kinetic and potential energy.',
    a: E('g = a_{c} = ' + F('4π^2 r', 'T^2') + ' → r = ' + F('8 × 14 400^2', '4π^2') + ' = 4.20 × 10^7 m') + E('M = ' + F('gr^2', 'G') + ' = 2.12 × 10^{26} kg') + E('K = ' + F('GMm', '2r') + ' = 1.68 × 10^{10} J,  U = −' + F('GMm', 'r') + ' = −3.36 × 10^{10} J') },
  { id: 'p5oe19', dp: '5.3.5', t: 'exam', q: '2024 MHS trial Q30 (7 marks): (a) Find the orbital speed of a satellite 400 km above Mars (radius 3390 km, mass 6.42 × 10^{23} kg). (b) Raising its orbit to 800 km needs 2.7 × 10^8 J. Find the satellite’s mass.',
    a: E('(a) v = ' + SQ(F('6.67 × 10^{-11} × 6.42 × 10^{23}', '3.79 × 10^6')) + ' = 3.36 × 10^3 m s^{-1}') + E('(b) ΔE = ' + F('GMm', '2') + '(' + F('1', 'r_{1}') + ' − ' + F('1', 'r_{2}') + ') with r_{1} = 3.79 × 10^6 m, r_{2} = 4.19 × 10^6 m') + E('m = ' + F('2.7 × 10^8', '5.39 × 10^5') + ' = 5.0 × 10^2 kg') },
  { id: 'p5oe20', dp: '5.3.5', t: 'exam', q: 'Long response (5 marks): g-force = (upward acceleration + 9.8)/9.8. Assuming constant engine thrust, explain how the g-forces on an astronaut change from before launch until the engines run out of fuel.',
    a: L(['Before launch the rocket is stationary: upward acceleration is 0, so the astronaut feels 1 g.', 'At lift-off the thrust exceeds the weight, so the upward acceleration a = (thrust − mg)/m is positive and the g-force rises above 1.', 'Fuel is burned and expelled, so the rocket’s mass decreases. With constant thrust, the net force per kilogram rises, so the acceleration and g-force increase.', 'As altitude increases, g decreases (g = GM/r^2), so the weight force falls, increasing the net force and acceleration further.', 'The g-force is greatest just before the fuel runs out. When the engines stop, the astronaut is in free fall and feels weightless.']) },
  { id: 'p5oe21', dp: '5.3.5', t: 'con', q: 'Why is no work needed to keep a satellite in a circular orbit, yet work is needed to change its orbit?',
    a: P('In a circular orbit the gravitational force is always perpendicular to the velocity, so it does no work: K and U stay constant. To change orbit, a thrust with a component along the velocity must act, doing work that changes the satellite’s total energy (E = −GMm/2r).') },
  { id: 'p5oe22', dp: '5.3.5', t: 'rec', q: 'Which Module 5 relationships are on the data sheet, and which must you be able to derive?',
    a: P('See the table. The derived ones are popular “show that” questions.'), v: 'p5formulas' }
]});

try { Object.assign(IMG_ALT, {
  p5_tq7: 'A beam pivoted at its left end: a 181 N force acts straight down 3.11 m from the pivot, and a 142 N force acts at 30° to the beam, 5.92 m from the pivot',
  p5_tq8: 'A beam pivoted at its centre: a 45 N force at 20° to the beam 2.3 m to one side, and a 181 N force at 38° to the beam 1.7 m to the other side',
  p5_tq9: 'A beam in equilibrium: a 67 N force at 63° to the beam 70 cm from the pivot, a 25 N force at 33° 40 cm from the pivot, and an unknown force applied perpendicular to the beam 45 cm from the pivot on the other side'
}); } catch (e) {}

HSC.addModule({ id: 'phys-m5', focus: FOCUS, dotPoints: DOTS, decks: DECKS, viz: VIZ,
  images: {"p5_tq7": "data:image/webp;base64,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", "p5_tq8": "data:image/webp;base64,UklGRtoSAABXRUJQVlA4IM4SAACwcwCdASr4AvcAPm02mEkkIyKhIdL48IANiWlu+DWbx0Smeik0ItloV5U/wfbZ/ivyY8//GN5/9k/j9vf2n/zX70/jv8B+3n9395O9H4+agv4p/Kf7b+X/9z+FKAFzzoG/Jf6V/vf7p7Cv2Pmp9kfYC/nXCw0APF70MPYnsJ/r//w+yaHXDTbhpae7DTbhpae7DTbhpae7DTbhpae7DTbhpae7DTbhpae7DTbhpae7DTbhpae7DTbhpae7DTbhpaaSSFQDlrOJkLT3YabcNLT3YabcNLT3YabcNLT3YaZSxif63ArMOWnuw024aWnuw024aWnuw024aWnuRtxhVeTRfU0eprTirDR1Jyd0NNuGlp7sNNuGlp7sNNtpkO+zTM7k+QNy1rowauAOcnuByd0NNuGlp7sNNuGlp7sNNuGlp7rlxp6bDggm/EO6yI4ARCurDR1Jyd0NNuGlp7sNNuGabNVZJKAux7wrjXVP/QbRX1qQa3BoxuC+VDP2uph2ku7DTaJz06Gm3DS092Gm0xCkn37aSmId9b1lCqywtUb1yM6yeHbxywxpyXmexk0ipmUwrAwEOc7oDg0Bn7w7fgjCAUJDV7pwECO2aPyxegI022wDrqldK/6pajEebH5NjLji4cG8QdUPntq+HdbTUy7+64Tyw5zuigeC6tfZ/iE1On/b9U3iEtICKbFtUxu+vhiRQy90TsuJWnpbxEdvBl+Lx7GPgnZTbPEmAtwR+IWKNHhihm3KN9hfOsiJ86qvTTDKPDKM7Yr6ELvQdlJOBQORTbWEvXL4RtYsdbUNuCxcbh/GId6udnA74qNDgseqK1pLHjsI2C3k8orhFUfkt0+OkoDdK2n8Fk5GbZ8zCSaWDr1rNuc53SSOSMdr8YkGrmrggHyuaBxdu63H2e+8OLmd2RGomPiW2INvvMscJxPTqjqqNinvvFUY5AF2sLP9sTdG5IjlEmzmNQbSQyI7oXdNUYZ2g6QVFjorRCrylZcB6KB/uF9P1ODfuw0226tigsdFK9pO3DOUZpfu1g55UD5WNgPb6I+l6CZpxDOYUA5O7HOtw0tPdhptw0tPdhpttUB97W/2ZCRTAu7VkCpulMeAGw024aWnuw024aWnuw024aWnuw0Ho5uhKfNv4GNRPWVNIrqw0dScndDTbhpae7DTbhpae7CigNAcS4RmcOJyd0NNuGlp7sNNuGlp7sNNuGlqB99ahptw0tPdhptw0tPdhptw0ssAAP7/2TQAAACu6sj3EE1ugeVGGYM154IgUEqGuWmo5WxPXVA3wr2VizIN9XhUSMQ8HHNysNaO7mIgV4XYzsBx78ZGYBeo4JnRntWUlo9Z3oum6ZJSvy0ln4eyJMSYeie8DZouCWA+Dp3v53JgB33S/FpX9Dk6bEePStwobRcLijHw+YR+WLzcf/VS/UVy99tpK3IUH047rS96Nma/YBnFVZjkwGDxB+lHW0CTX6kOu2q3fNhxoBU9hFbJ7dEiqFNK8ghTLy590DcvV9MQPUl8xBuht8TYA8UwoQiiY/pCpqZsmG+7XYtJOEIOuNbw9Vb1q+nHnN6g24k3/umKJ1KNjQS73d/TWTO9RPay3GmgWLS+pjFmRyWx15zFP/LwN3nXuEEWUunm9e6stWxrd3VqRxo9QqbHMtDafo+7SBcCXlGbWB1VdERDuLb7ZtKWIJNpqsy9nPsOZICNwmeid+4M8NVoBzuNIRug07nTSOHzQMA5wWm7Ftz+pzuCD/1e7v/Mq8E02cKvW0mXNUnurBpmfF1jfU9ug7z7e9Fbg9CY9pT9AAFl1sX3l1EOwIUSuQxXLefJdHjJNBzGrMc+8XtYs2tPmpdxv7TRIYenb1Ai7H7eOjTJP5T2mkHofE3V8KObV4D/YxHi5+MLhSdJQPua5rTn04B6mX3DEsc7kSX2kZVsnnkcbi9gPwVRd3byxH9aJa+zORrdfqESFxMezezoGmAUOvJ5MwbGKb0KvTQH1sllrHe/6I3fuoNPiBVdSSpll/0S7AvSi7JPr+CMtzDGvjT1pht4A6FDbmi+oB3APJeK0VPJlUqSnBaFjxkKkx49oDjD3wz/4TeeMxNRXx7CUlehh2OoBTQikIenVhiTAX6wZuT9YqXmqnu+inlGBTuZPtPRWRBIg6RDf2n4B32NrTgDIHLjszMXpcmWzEnIifDvvPzAJWjkcHMAlFckUsEn/HwCwUNkBAm56DQVx/FpvOM0EJTTNbf8CQvb1Ch6DQ1VSPyo2h/0zd532twOcQqilItZgUKFx+qfHyMN8g6bBN6Xfjq9MNBDcbo2k/IT3j2oxgAxMVY+vtovsvKOwYUVU29Xx4Z59V5qqUxUZ/vyLTX+t15w19I0tVMaPXMiaVNg45QUGtpAXdLpYeUKl4jYGN7kmAOfiJYKn53IOf7L6OYcqJsDiJZ4Y4NnAqK77xcS9NUCMdY07rHS1dWFLg8izG2sibh+/VK6v5GpQ49pv7+ea7A3Kecp/pt3jJnZYLXd8ru5IayLjfhLAwRDBQ4cSGwRpme5SNLWaafVvPL9Dx/XzFmMTtw9qrvKY+Yib2ET16D6AHz/R+83vfNL82MUSiXhZHVUNulZRk/f0CTG0v0gf0eUURtFgen2xrA/zNOBWhAkL6+1bC4vvPzOseyIkL38XOsDvJagJ1nv/kdr01sGi8ROJos1FVjl/l9Pm5tsS99XjGXLzzVvjYDepLbMo8e8Ke5HeUxMwr4C+p+u17bOL4o79RcrPY4Y6K53FEv6CHrGDh1yMf/59NRvtUVjl+oe/9rp+EKlMw8LY14/xKQK+TXJ2qI4qJhC5K6HSEK7o7NGPGzpflnBg/54u5GN7zYncSSuFqdgeyQcYo8M3IIfCOOJHz5VSJMFkoewE0DGmvWMEW4Bfjaalq6EzoxWUmF/VAD2HQs2tLM5T43LTTT/HdhWXxZNwuMQOyMe2/0Mzio8DlHM9i4RMGtPbOP7+by/phfaWfcn9k7/1jp87Zk+d0SiUSNbR8lI3Pt7Ak8RQiagjJhnARAihhpS6Pq7TmiKKwyAOIANiO3u/ocxwdiFFfk2EzkxzUzt7ReOaiPOi7ZYsJHJSOp3NLF/AH+lVR80QNEYrgnOfdYAhW65nwBWVmt9L15rUwZ5YlneW8hHBex8GJVDAPOHZgk0EgEtDXIyQUVnbjaeO2jA4LiciuMGkMZ+KQecsEGexcZlag1AhLMUYKKlu4VCuN/zt/DmdK10opm6o5P/dfkYGmIOIYxsPb4tY31iQUFXDpwmmeoJtzLc+b1kdNiU4MFC/QjdCzovsueWizqVYyDaUwQKg8JSaYZbZoNHM1rlmvAJIdUZLmVs77DQh222CsyRZzCgCt0GlZXxXWfP50i3DfJkYjBZt4jNbChrtXxQfhbC3JI6MtyuMIEau0yFk8Z31pdIeZfvDq8FRS4e6/mu9quykV19GgBJDLH8mXcr8RkC1IEo2cgOL+EOh+jkXmDXz/a8NVChvaZFlJNeqcaNvWAvgNSa4hCVB3jYACH5S4tQ+hzC697hw9XDflU5jo6NS8W+2sAxu0lxw/TAOYORno70XWb8cZILRde8wlJnMDCx4WuAc0q/BsVzyNvk0Tvs0m7YnOFAN5ZaPwKO57ka5ytbVdqh+klRwEWcEvASjezjWCjr25NuEVPYKLd+Il5s/xMImxiPiuqfDVdHGgbspcsHZdFdaLMivhrgrX25ARHgpdKPpFv5CMbzZxpWVdlBoFfLAKcyNduAZBWduLGm9ZDeA6c1rPvKz4nddNbyy05jozjTdE1dIbnR+JDcJOnH+8yoSEFuFI+NPBIDLHJGccamrP06cszWe1uCDC/11W2EGYkgsJ8KxvEVOlhJLjgn94pZW/YOzHAdc1wqzmhNBkdWIAAxJrRizVfJ6bzPr6r2xy/FS3z9w2wl76KNK3FvperLU09dG59lXwVHuGb5uH0cbeMUbBazQ0HJ7O/fxC53R2/DvWOWaqHtE0F7Ljbk6jCQGHD653McZQIzg+L1ca7dO2hwWRObVV5aF9UyQ40fM22bNYDGP8PZiMLbaAxrMKqqtL/pVx8OKmMlbBmGMoVejAwr3PnhbQxdPzZSvnRXsNucvnsUlE1aM1r8RF2olV1vbKpJiVUD8ClcPEhMyY+ldLMjPq6TQJmyR3yclZsX/h/g3cLATysKt+gXr4+/1fvGhLBoS/I9ZBOa99napoCe9wmXdOIAgXacVj/EDs3AHFBhrt/3bAD0PsRa3YMJ0qgpBdVxH/uzsmtEmphyvmw6oSTkfy+zAZ9mBiEryzIPhs+Yaw28pVzVxZ5nGt7JvqrIEKh0Q9EmSTKOlvmkVdAJK39KfEk8lo7z1maabUojIOo/HDi54O5WFYKgrmkbjQhqQf0g7qWgrHoxTfzcK/k1d8Meq7kIE5AYri5VY5lKeY6G3jWMht/1D5GDUwiR83iDXieZKk3J6yW2nUlbzhVGeBJdG18k9YUMVLCKIzuE/OQ4vxeunS0iB0lZdGaVCCLKNEyCj0QjtCUq+qgj+ykxqLX5I6OadDVicsWRSCGGz3wT04HA2fBcgLbIOCh9QJ3Wx6tEL9grmvP3CAc/zRjb9zp5hz2Xm32uaKe/NhnvQvKjynORulmD/vVoF23JGjbkOWULoO+xfihM0E7GyDnK0SgCAo90Pw2v6bpC+39dcVTCUfn/c4W8mncmIqmWU//sYChoJb3FOu+aimVo1cZ4wHsZ3HK8Hhts4Iy7dr3P5RYPt9vQKjbtxZ+whNblm70xXPsT9aig/G2oIntTq6Uqm6GGWWkpP7xp59KPjkDw+gW13Ofrj4ow2Lh79/9KpIuA6jXtPlQoBT2dcQI/ZAK8/uF1xXPDF0y/QibXgftVJI6kr6TOqNRxCNZs/RCYNeKyy+18PtenyW4NAjpk4oqqu/BDYhURt8dIp18Vmx7FuH9f0NCeX97qVEKgPcF4JjR8BKc5TcoQCiO/2e4jRo2VzqxSQFEhJJLAnXc/HsXi83XwZSddLd+Ec9IIfSKWHKgliiyxc+6gvGhXWLyXVXPbEVj1ejYV2I+9w6Myt1SZQNWTUZV/rgk3kRVBX9yWeUsFfFJ4ei+PP51zGL+VyICHPQda8qno7HJ0Z8NALcOHUh+KJcphariGQ3vDjmvkIcwV25vPOD9SinxmEZ/EpAjOZdvuqLAquvFtUUIZEfzu3fnp5WlcGSUP+bAdue/zUr2z6eJnyT8RuqW+abBR20Rm9nLl2sPqXwsLegomrcu8RyDWMV6HkqcuTvNb/Yfispf4OFwQ77o0JJ5BhJmtNH8dpF82pT+TQjr4jH3sjrpJP3fEbznba3altOlg2T9qSfeT/e8iA3hOwC/QDJbsOYuzbjl7jVYQ7yfEu6R9hTpz5U+ltpkJGrc5JPhKgOUPkLv0tVs4P5rbd4ATecfxYTMsJchtCsJ5w63VSjNIf115L+3N01mj2LpBYInuMXnK2k2InS0PEmCB+XNq2rOhQx+WOYFvCt5/YeV5CczlsxUn9UhCHXkStLMRrCftJWMawrt5qwbwUygGVJkF7opnzqhoYsA7BXGYFVXS6FcnQHGdkcnR9TYVWzYa7BNLIGAAAAEp2Y123/OBGWe34sgAFA7T70oGT9oYb8Rm+Kcx93c/5CNzWwJUsjk8WfXbciAYrP+8gXZv/t1cnoQVM3loSO7CKwOavr1g19sOPrRtBeo9An66hVNiP/T+2F+0iDwfBQqLzrRxrP/Qp2rijqzTMsgw0+tQFOimxrsuUbz3DCOelRVUptyYVu3k4+6h3D+wdx+qOCJ5w6PNCfYVQkgAVAgjLsTBdflmbCmnGlj0A9/gbQbqE+VpCS5veOVQsNCp+Rkr/pWYBynlACeqkLWZ6U25zkKSucnMFveKJMkMUC+exfj2xHanufmSkFpRW4W2/rjOXyWHDCDxi353QBXiGsynoZXPYI6lMFzZokPYuYmmIiFqxMYrREP925UmqQAUVdQRMr8RR7gTwbVHdIJtOW4JqxY0HR2a9wwNbbnTmQzH1U1fUXeTAJjnczKMTUbMhYMNFuPc7tNj8vcl11Xxqme2/QEf0Ddau2gLlErDouVYdLf6sgLIKrY0a1nHZWc/RL8WYIxzBNXzctPHZi509GECJgX9CqUiazG/kSixfqeFpx02AepBPd47l+OGDVGBmcc0lkPdXWVCgEazIJy4EeRoIOx+3UsTJDAABOTd1KLUxYT/8Za0MQE07ybAV8HthLZOZAz1E+LBeHs6eZTZ8QugC7BFtNl9pH80XUeGPBRfJKLrKf91FDyPsXQ+W49ihm5o9DlnoEcHoK5zfVdTxHyQxd9iPcm8MS8y1c2mU5EAAEmqXvuJ7mbRd14/cxUvyUW5GN+918llkx3njRmkPvMgw+ql4n+4jba79dFQqgPxPYdwywAAAAAAAA==", "p5_tq9": "data:image/webp;base64,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"},
  imageCaption: 'From your Module 5 booklet' });
})();
