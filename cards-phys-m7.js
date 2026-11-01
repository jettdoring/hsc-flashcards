/* Physics Module 7: The Nature of Light
   Built-in cards from your booklet. Card ids must never change once studied (progress is stored by id). */
(() => {
const DOTS = {
  '7.1.1': 'Investigate Maxwell’s contribution to the classical theory of electromagnetism, including: unification of electricity and magnetism, prediction of electromagnetic waves, prediction of velocity',
  '7.1.2': 'Describe the production and propagation of electromagnetic waves and relate these processes qualitatively to the predictions made by Maxwell’s electromagnetic theory',
  '7.1.3': 'Conduct investigations of historical and contemporary methods used to determine the speed of light and its current relationship to the measurement of time and distance',
  '7.1.4': 'Conduct an investigation to examine a variety of spectra produced by discharge tubes, reflected sunlight or incandescent filaments',
  '7.1.5': 'Investigate how spectroscopy can be used to provide information about: the identification of elements',
  '7.1.6': 'Investigate how the spectra of stars can provide information on: surface temperature, rotational and translational velocity, density, chemical composition',
  '7.2.1': 'Conduct investigations to analyse qualitatively the diffraction of light',
  '7.2.2': 'Conduct investigations to analyse quantitatively the interference of light using double slit apparatus and diffraction gratings d sinθ = mλ',
  '7.2.3': 'Analyse the experimental evidence that supported the models of light that were proposed by Newton and Huygens',
  '7.2.4': 'Conduct investigations quantitatively using the relationship of Malus’ Law I = I(max) cos²θ for plane polarisation of light, to evaluate the significance of polarisation in developing a model for light',
  '7.3.1': 'Analyse the experimental evidence gathered about black body radiation, including Wien’s Law related to Planck’s contribution to a changed model of light: λ(max) = b/T',
  '7.3.2': 'Investigate the evidence from photoelectric effect investigations that demonstrated inconsistency with the wave model for light',
  '7.3.3': 'Analyse the photoelectric effect K(max) = hf − φ as it occurs in metallic elements by applying the law of conservation of energy and the photon model of light',
  '7.4.1': 'Analyse and evaluate the evidence confirming or denying Einstein’s two postulates: the speed of light in a vacuum is an absolute constant; all inertial frames of reference are equivalent',
  '7.4.2': 'Investigate the evidence, from Einstein’s thought experiments and subsequent experimental validation, for time dilation t = t₀/√(1 − v²/c²) and length contraction l = l₀√(1 − v²/c²), and analyse quantitatively situations in which these are observed, for example: observations of cosmic-origin muons at the Earth’s surface, atomic clocks (Hafele–Keating experiment), evidence from particle accelerators, evidence from cosmological studies',
  '7.4.3': 'Describe the consequences and applications of relativistic momentum with reference to: p(v) = m₀v/√(1 − v²/c²); the limitation on the maximum velocity of a particle imposed by special relativity',
  '7.4.4': 'Use Einstein’s mass–energy equivalence relationship E = mc² to calculate the energy released by processes in which mass is converted to energy, for example: production of energy by the sun, particle–antiparticle interactions, e.g. positron–electron annihilation, combustion of conventional fuel'
};

const FOCUS = [
  { id: 'fa1', name: 'Inquiry Question 7.1: Electromagnetic Spectrum', iq: 'What is light?' },
  { id: 'fa2', name: 'Inquiry Question 7.2: Light: Wave Model', iq: 'What evidence supports the classical wave model of light and what predictions can be made using this model?' },
  { id: 'fa3', name: 'Inquiry Question 7.3: Light: Quantum Model', iq: 'What evidence supports the particle model of light and what are the implications of this evidence for the development of the quantum model of light?' },
  { id: 'fa4', name: 'Inquiry Question 7.4: Light and Special Relativity', iq: 'How does the behaviour of light affect concepts of time, space and matter?' }
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

/* Nuclide symbol with mass number over atomic number */
const NU = (A, Z, X) => `<span style="white-space:nowrap"><span style="display:inline-flex;flex-direction:column;align-items:flex-end;vertical-align:0.3em;font-size:.6em;line-height:1.08;margin:0 1px 0 2px"><span>${A}</span><span>${Z}</span></span>${X}</span>`;
const NB = '<span style="text-decoration:overline">ν</span>';


/* ---------- Module 7 visuals ---------- */
/* Axes and gridlines for a chart. xt / yt are [value, label] pairs. */
const axes = (X, Y, x0, x1, y0, y1, xt, yt) => {
  let s = '';
  yt.forEach(([v, l]) => { s += `<line class="gl" x1="${X(x0)}" x2="${X(x1)}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}"/>` + T(X(x0) - 5, Y(v) + 3.5, l, { a: 'end', c: 'tk' }); });
  xt.forEach(([v, l]) => { s += `<line class="gl" x1="${X(v).toFixed(1)}" x2="${X(v).toFixed(1)}" y1="${Y(y1)}" y2="${Y(y0)}"/>` + T(X(v), Y(y0) + 14, l, { a: 'middle', c: 'tk' }); });
  return s;
};
const axLines = (X, Y, x0, x1, y0, y1, yAx = y0) => `<line class="ax" x1="${X(x0)}" x2="${X(x0)}" y1="${Y(y0)}" y2="${Y(y1)}"/><line class="ax" x1="${X(x0)}" x2="${X(x1)}" y1="${Y(yAx).toFixed(1)}" y2="${Y(yAx).toFixed(1)}"/>`;
const yLab = (x, y, s) => `<text class="axl" transform="translate(${x} ${y}) rotate(-90)" text-anchor="middle">${s}</text>`;
const path = (pts, st) => `<path d="${pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')}" style="fill:none;${st}"/>`;

/* Visible-spectrum gradient (400–700 nm across the box) */
const RAINBOW = [[400, '#7b2fd0'], [440, '#3f4cff'], [480, '#0aa0ff'], [505, '#00c8a0'], [530, '#22c84a'], [570, '#d8e020'], [590, '#ffc400'], [610, '#ff8a00'], [640, '#ff3a10'], [700, '#c40012']];
const rainbowDef = id => `<linearGradient id="${id}" x1="0" x2="1" y1="0" y2="0">${RAINBOW.map(([w, c]) => `<stop offset="${((w - 400) / 300 * 100).toFixed(1)}%" stop-color="${c}"/>`).join('')}</linearGradient>`;
const wlCol = w => { for (let i = 1; i < RAINBOW.length; i++) if (w <= RAINBOW[i][0]) return RAINBOW[i - 1][1]; return RAINBOW[RAINBOW.length - 1][1]; };

/* Electromagnetic wave: E and B perpendicular, in phase */
function emWave() {
  const O = 40, AX = 112, LEN = 320;
  const pr = (t, y, z) => [O + LEN * t + 0.55 * z, AX - y + 0.32 * z];
  let s = svgOpen(420, 214, 'An electromagnetic wave travelling to the right. The electric field oscillates up and down in a vertical plane and the magnetic field oscillates in a horizontal plane, at right angles to the electric field. Both fields are in phase and both are at right angles to the direction of travel. One wavelength is marked between two neighbouring crests.', 'Electromagnetic wave');
  s += defs('p7em', [['a', ACC], ['i', INK2], ['k', INK]]);
  const E = [], B = [];
  for (let j = 0; j <= 160; j++) { const t = j / 160, ph = 2 * Math.PI * 2 * t; E.push(pr(t, 58 * Math.sin(ph), 0)); B.push(pr(t, 0, 58 * Math.sin(ph))); }
  for (let j = 1; j < 16; j++) { const t = j / 16, ph = 2 * Math.PI * 2 * t, a = Math.sin(ph); if (Math.abs(a) < 0.15) continue;
    const p0 = pr(t, 0, 0), pe = pr(t, 58 * a, 0), pb = pr(t, 0, 58 * a);
    s += LN(p0[0], p0[1], pe[0], pe[1], 'stroke:var(--accent);stroke-width:1;opacity:.55') + LN(p0[0], p0[1], pb[0], pb[1], 'stroke:var(--ink-2);stroke-width:1;opacity:.55'); }
  s += path(B, 'stroke:var(--ink-2);stroke-width:2.2') + path(E, 'stroke:var(--accent);stroke-width:2.4');
  s += AR(O - 10, AX, O + LEN + 30, AX, INK, 'p7emk', { w: 1.6 });
  s += T(412, AX - 8, 'travel', { a: 'end', c: 'tk' }) + T(412, AX + 16, 'at c', { a: 'end', c: 'tk' });
  const c1 = pr(1 / 8, 58, 0), c2 = pr(5 / 8, 58, 0);
  s += LN(c1[0], 30, c2[0], 30, 'stroke:var(--ink-3)') + LN(c1[0], 25, c1[0], 35, 'stroke:var(--ink-3)') + LN(c2[0], 25, c2[0], 35, 'stroke:var(--ink-3)') + T((c1[0] + c2[0]) / 2, 24, 'λ', { a: 'middle', c: 'axl' });
  s += T(c1[0] + 12, 52, 'E (electric field)', { st: 'fill:var(--accent);font-weight:600' });
  const b1 = pr(7 / 8, 0, -58); s += LN(b1[0] + 2, b1[1] - 3, b1[0] + 14, b1[1] - 16, 'stroke:var(--ink-2);stroke-width:1') + T(b1[0] + 16, b1[1] - 18, 'B (magnetic field)', { st: 'fill:var(--ink-2);font-weight:600' });
  s += T(20, 206, 'E ⟂ B ⟂ direction of travel; E and B oscillate in phase', { c: 'tk' });
  return wrap(s, 'Maxwell: a changing E field produces a changing B field at right angles to it, and vice versa, so the pair is self-propagating and needs no medium. Fields at right angles to the direction of travel make EM waves transverse.');
}

/* EM spectrum on a log wavelength scale with the visible band enlarged */
function spectrum() {
  const X0 = 30, X1 = 400, lg0 = 4, lg1 = -13, X = lg => X0 + (lg0 - lg) / (lg0 - lg1) * (X1 - X0);
  const bands = [['Radio', 4, 0], ['Microwave', 0, -3], ['IR', -3, -6.12], ['', -6.12, -6.4], ['UV', -6.4, -8], ['X-rays', -8, -11], ['Gamma', -11, -13]];
  let s = svgOpen(420, 226, 'The electromagnetic spectrum drawn on a scale of wavelength in metres, from long radio waves of about ten thousand metres on the left, through microwaves (one metre to one millimetre), infrared, the narrow visible band, ultraviolet and X-rays, to gamma rays shorter than about ten to the minus eleven metres on the right. Frequency and photon energy increase to the right. The visible band from about 750 nanometres (red) to 400 nanometres (violet) is enlarged below.', 'Electromagnetic spectrum');
  s += `<defs>${rainbowDef('p7vis')}<linearGradient id="p7visr" x1="1" x2="0" y1="0" y2="0">${RAINBOW.map(([w, c]) => `<stop offset="${((w - 400) / 300 * 100).toFixed(1)}%" stop-color="${c}"/>`).join('')}</linearGradient></defs>` + defs('p7sp', [['k', INK2]]);
  const Y0 = 28, H = 34;
  const names = ['Radio', 'Microwave', 'Infrared', '', 'UV', 'X-rays', 'Gamma'];
  bands.forEach(([n, a, b], i) => {
    const xa = X(a), xb = X(b);
    s += `<rect x="${xa.toFixed(1)}" y="${Y0}" width="${(xb - xa).toFixed(1)}" height="${H}" style="${i === 3 ? 'fill:url(#p7visr)' : `fill:var(--surface-2);stroke:var(--ink-3)`}"/>`;
    if (names[i]) s += T((xa + xb) / 2, Y0 + H / 2 + 4, names[i], { a: 'middle', c: 'tk', st: 'font-size:10.5px' });
  });
  [[3, '10³'], [0, '1'], [-3, '10⁻³'], [-6, '10⁻⁶'], [-9, '10⁻⁹'], [-12, '10⁻¹²']].forEach(([lg, l]) => { s += LN(X(lg), Y0 + H, X(lg), Y0 + H + 4, 'stroke:var(--ink-2)') + T(X(lg), Y0 + H + 16, l, { a: 'middle', c: 'tk' }); });
  s += T(X1, Y0 + H + 32, 'wavelength (m)', { a: 'end', c: 'axl' });
  s += AR(X0 + 150, 12, X1 - 10, 12, INK2, 'p7spk', { w: 1.4 }) + T(X0 + 144, 16, 'frequency and photon energy increase', { a: 'end', c: 'tk' });
  /* zoom of visible */
  const VX0 = 70, VX1 = 360, VY = 150;
  s += LN(X(-6.12), Y0 + H, VX0, VY, 'stroke:var(--ink-3);stroke-dasharray:3 3') + LN(X(-6.4), Y0 + H, VX1, VY, 'stroke:var(--ink-3);stroke-dasharray:3 3');
  s += `<rect x="${VX0}" y="${VY}" width="${VX1 - VX0}" height="26" style="fill:url(#p7visr)"/>`;
  [[750, '750 nm'], [600, '600'], [500, '500'], [400, '400 nm']].forEach(([w, l]) => { const x = VX0 + (750 - w) / 350 * (VX1 - VX0); s += LN(x, VY + 26, x, VY + 31, 'stroke:var(--ink-2)') + T(x, VY + 43, l, { a: 'middle', c: 'tk' }); });
  s += T(VX0 - 4, VY + 17, 'red', { a: 'end', c: 'tk' }) + T(VX1 + 4, VY + 17, 'violet', { c: 'tk' });
  s += T(210, 218, 'Visible light: about 400–750 nm', { a: 'middle', c: 'axl' });
  return wrap(s, 'All EM waves travel at c = 3.00 × 10⁸ m s⁻¹ in a vacuum, so c = fλ: a shorter wavelength means a higher frequency and (E = hf) more energy per photon.');
}

/* Double slit geometry: path difference d sinθ */
function doubleSlit() {
  const BX = 110, S1 = [BX, 92], S2 = [BX, 132], M = [BX, 112], SX = 392, P = [SX, 40], O = [SX, 112];
  let s = svgOpen(420, 222, 'Coherent light reaches two narrow slits a distance d apart. Rays travel from each slit to a point P on a distant screen. The ray from the lower slit is longer by a small extra length, d sin theta, shown near the slits. The angle theta is measured from the central line to the line joining the slits to P. P is a distance x from the centre of the screen, which is a distance L from the slits.', 'Double slit path difference');
  s += defs('p7ds', [['k', INK2], ['a', ACC]]);
  for (let i = 0; i < 4; i++) s += LN(20 + i * 18, 70, 20 + i * 18, 154, 'stroke:var(--ink-3);stroke-width:1.2');
  s += AR(20, 112, 82, 112, INK2, 'p7dsk', { w: 1.4 });
  s += `<rect x="${BX - 4}" y="40" width="8" height="${S1[1] - 3 - 40}" style="fill:var(--ink-2)"/><rect x="${BX - 4}" y="${S1[1] + 3}" width="8" height="${S2[1] - S1[1] - 6}" style="fill:var(--ink-2)"/><rect x="${BX - 4}" y="${S2[1] + 3}" width="8" height="${184 - S2[1] - 3}" style="fill:var(--ink-2)"/>`;
  s += LN(SX, 30, SX, 190, 'stroke:var(--ink-2);stroke-width:3');
  [40, 76, 112, 148, 184].forEach(y => { s += `<rect x="${SX + 3}" y="${y - 6}" width="8" height="12" rx="2" style="fill:var(--accent);opacity:${y === 112 ? 1 : 0.7}"/>`; });
  s += LN(S1[0], S1[1], P[0], P[1], 'stroke:var(--accent);stroke-width:1.6') + LN(S2[0], S2[1], P[0], P[1], 'stroke:var(--accent);stroke-width:1.6');
  s += LN(M[0], M[1], O[0], O[1], 'stroke:var(--ink-3);stroke-dasharray:4 4') + LN(M[0], M[1], P[0], P[1], 'stroke:var(--ink-3);stroke-dasharray:2 3');
  /* foot of perpendicular from S1 onto S2P */
  const dx = P[0] - S2[0], dy = P[1] - S2[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
  const tt = (S1[0] - S2[0]) * ux + (S1[1] - S2[1]) * uy, F = [S2[0] + ux * tt, S2[1] + uy * tt];
  s += LN(S1[0], S1[1], F[0], F[1], 'stroke:var(--ink-2);stroke-width:1;stroke-dasharray:2 2');
  s += LN(S2[0], S2[1], F[0], F[1], 'stroke:var(--accent);stroke-width:4.5;stroke-linecap:round');
  s += T(F[0] + 4, F[1] + 26, 'd sinθ', { st: 'fill:var(--accent);font-weight:600' });
  const th = Math.atan2(O[1] - P[1], O[0] - M[0]), R = 60;
  s += `<path d="M${M[0] + R} ${M[1]} A${R} ${R} 0 0 0 ${(M[0] + R * Math.cos(th)).toFixed(1)} ${(M[1] - R * Math.sin(th)).toFixed(1)}" style="fill:none;stroke:var(--ink-2)"/>` + T(M[0] + R + 4, M[1] - 7, 'θ', { c: 'axl' });
  s += T(BX - 12, 108, 'd', { a: 'end', c: 'axl' }) + LN(BX - 8, S1[1], BX - 8, S2[1], 'stroke:var(--ink-2)');
  s += T(P[0] - 6, P[1] - 4, 'P', { a: 'end', c: 'axl' });
  s += AR(SX - 12, 104, SX - 12, 46, INK2, 'p7dsk', { w: 1 }) + T(SX - 16, 80, 'x', { a: 'end', c: 'axl' });
  s += AR(BX + 10, 202, SX - 4, 202, INK2, 'p7dsk', { w: 1 }) + T((BX + SX) / 2, 216, 'L (much larger than d)', { a: 'middle', c: 'tk' });
  s += T(20, 64, 'coherent light', { c: 'tk' });
  return wrap(s, 'Bright fringe when the path difference is a whole number of wavelengths: d sinθ = mλ. Dark fringe when it is a half-number: d sinθ = (m + ½)λ. For small angles sinθ ≈ x/L, so the fringe spacing is Δx = λL/d. Not to scale.');
}

/* Malus’ law curve with the Worksheet 5 data */
function malusGraph() {
  const L0 = 50, Tp = 14, W = 340, H = 168, X = a => L0 + a / 90 * W, Y = i => Tp + (1 - i / 100) * H;
  const data = [[0, 99.5], [10, 97.0], [20, 88.4], [30, 72.0], [40, 61.0], [50, 38.0], [60, 27.0], [70, 11.0], [80, 3.0], [90, 0.05]];
  let s = svgOpen(420, 222, 'Intensity of light leaving the analyser against the angle between the polariser and analyser, from 0 to 90 degrees. The data points fall from 99.5 at 0 degrees to almost zero at 90 degrees and lie close to the curve I equals 99.5 cos squared theta.', 'Malus’ law: intensity against angle');
  s += axes(X, Y, 0, 90, 0, 100, [0, 15, 30, 45, 60, 75, 90].map(v => [v, v]), [0, 25, 50, 75, 100].map(v => [v, v]));
  s += axLines(X, Y, 0, 90, 0, 100);
  const pts = []; for (let a = 0; a <= 90; a += 1.5) pts.push([X(a), Y(99.5 * Math.cos(rad(a)) ** 2)]);
  s += `<path class="curve" d="${pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')}"/>`;
  data.forEach(([a, i]) => { s += `<circle class="mk" cx="${X(a).toFixed(1)}" cy="${Y(i).toFixed(1)}" r="3.5"/>`; });
  s += T(X(47), Y(80), sb('I = I', 'max', ' cos²θ'), { c: 'tk', st: 'fill:var(--accent)' });
  s += T(X(45), Tp + H + 30, 'Angle between polariser and analyser θ (°)', { a: 'middle', c: 'axl' }) + yLab(14, Tp + H / 2, 'Intensity (arb. units)');
  return wrap(s, 'Worksheet 5 data (dots) against Malus’ law with I<sub>max</sub> = 99.5 (curve). At 30° the law predicts 74.6 and at 40° 58.4, so the measured 72.0 and 61.0 are a little off, but the trend matches cos²θ.');
}

/* √I against cosθ: a straight line through the origin */
function malusLinear() {
  const L0 = 50, Tp = 14, W = 330, H = 168, X = c => L0 + c * W, Y = r => Tp + (1 - r / 10) * H;
  const data = [[0, 99.5], [10, 97.0], [20, 88.4], [30, 72.0], [40, 61.0], [50, 38.0], [60, 27.0], [70, 11.0], [80, 3.0], [90, 0.05]].map(([a, i]) => [Math.cos(rad(a)), Math.sqrt(i)]);
  let s = svgOpen(420, 222, 'The square root of intensity plotted against cos theta. The ten points lie close to a straight line through the origin with a gradient of about 9.9.', 'Square root of intensity against cos theta');
  s += axes(X, Y, 0, 1, 0, 10, [0, 0.2, 0.4, 0.6, 0.8, 1].map(v => [v, v]), [0, 2, 4, 6, 8, 10].map(v => [v, v]));
  s += axLines(X, Y, 0, 1, 0, 10);
  s += `<path class="curve" d="M${X(0)} ${Y(0.09).toFixed(1)} L${X(1)} ${Y(9.94).toFixed(1)}"/>`;
  data.forEach(([c, r]) => { s += `<circle class="mk" cx="${X(c).toFixed(1)}" cy="${Y(r).toFixed(1)}" r="3.5"/>`; });
  s += T(X(0.3), Y(6.6), sb('gradient ≈ 9.9 ≈ √I', 'max'), { c: 'tk', st: 'fill:var(--accent)' });
  s += T(L0 + W / 2, Tp + H + 30, 'cos θ', { a: 'middle', c: 'axl' }) + yLab(16, Tp + H / 2, '√I');
  return wrap(s, 'Malus’ law, I = I<sub>max</sub>cos²θ, means √I = √I<sub>max</sub> × cosθ, which has the form y = mx. A straight line through the origin is therefore evidence for the law.');
}

/* Black body curves and the ultraviolet catastrophe */
function blackBody() {
  const hP = 6.626e-34, cL = 3e8, kB = 1.381e-23;
  const Bf = (l, T) => 1 / Math.pow(l, 5) / (Math.exp(hP * cL / (l * kB * T)) - 1), RJ = (l, T) => kB * T / (hP * cL) / Math.pow(l, 4);
  const pk = Bf(2.898e-3 / 5000, 5000);
  const L0 = 46, Tp = 16, W = 344, H = 166, X = um => L0 + um / 2.5 * W, Y = v => Tp + (1 - v / 1.15) * H;
  let s = svgOpen(420, 224, 'Intensity against wavelength from 0 to 2.5 micrometres for black bodies at 3000, 4000 and 5000 kelvin. Each curve rises to a peak and then falls. Hotter curves are higher everywhere and peak at shorter wavelengths: about 0.58 micrometres at 5000 K, 0.72 at 4000 K and 0.97 at 3000 K. A dashed classical prediction for 5000 K follows the real curve at long wavelengths but rises without limit at short wavelengths: the ultraviolet catastrophe. The visible band is shaded.', 'Black body radiation curves');
  s += `<defs>${rainbowDef('p7bbv')}</defs>`;
  s += `<rect x="${X(0.4).toFixed(1)}" y="${Tp}" width="${(X(0.7) - X(0.4)).toFixed(1)}" height="${H}" style="fill:url(#p7bbv);opacity:.18"/>`;
  s += axes(X, Y, 0, 2.5, 0, 1.15, [0, 0.5, 1, 1.5, 2, 2.5].map(v => [v, v]), []);
  s += axLines(X, Y, 0, 2.5, 0, 1.15);
  const rj = []; for (let um = 0.62; um <= 2.5; um += 0.02) rj.push([X(um), Y(RJ(um * 1e-6, 5000) / pk)]);
  s += path(rj.filter(p => p[1] >= Tp - 2), 'stroke:var(--ink-3);stroke-width:2;stroke-dasharray:6 4');
  s += T(X(1.45), Y(0.98), 'classical prediction', { c: 'tk' }) + T(X(1.45), Y(0.98) + 13, '(5000 K)', { c: 'tk' });
  [[5000, ACC, 2.6], [4000, INK2, 2.1], [3000, INK3, 2.1]].forEach(([T0, col, w]) => {
    const pts = []; for (let um = 0.08; um <= 2.5; um += 0.01) pts.push([X(um), Y(Bf(um * 1e-6, T0) / pk)]);
    s += path(pts, `stroke:${col};stroke-width:${w}`);
    const lm = 2.898e-3 / T0 * 1e6, yp = Y(Bf(lm * 1e-6, T0) / pk);
    s += LN(X(lm), yp, X(lm), Y(0), `stroke:${col};stroke-width:1;stroke-dasharray:2 3`);
    s += T(X(lm) + 6, yp - 4, `${T0} K`, { c: 'tk', st: `fill:${col};font-weight:600` });
  });
  s += T(L0 + W / 2, Tp + H + 30, 'Wavelength (μm)', { a: 'middle', c: 'axl' }) + yLab(16, Tp + H / 2, 'Intensity');
  return wrap(s, 'Hotter means a higher peak at a shorter wavelength (λ<sub>max</sub> = b/T) and a larger area under the curve (more total energy). Classical wave theory predicts intensity rising without limit at short wavelengths; Planck’s quantised oscillators (E = nhf) give the real curve that falls to zero.');
}

/* K_max against frequency for two metals */
function photoLines() {
  const L0 = 52, Tp = 14, W = 330, H = 178, X = f => L0 + f / 15 * W, Y = k => Tp + (3.5 - k) / 7 * H;
  const h = 4.136; /* eV per 10^15 Hz */
  let s = svgOpen(420, 226, 'Maximum kinetic energy of photoelectrons in electron volts against frequency of light, for two metals A and B. Both lines are straight and parallel with gradient equal to Planck’s constant. Metal A crosses the frequency axis at its threshold frequency of about 4.8 times ten to the fourteen hertz; metal B, with a larger work function, crosses further right at about 7.3 times ten to the fourteen hertz. Extending each line back to zero frequency meets the energy axis at minus the work function: minus 2.0 eV for A and minus 3.0 eV for B.', 'Maximum kinetic energy against frequency');
  s += axes(X, Y, 0, 15, -3.5, 3.5, [0, 3, 6, 9, 12, 15].map(v => [v, v]), [-3, -2, -1, 0, 1, 2, 3].map(v => [v, v]));
  s += axLines(X, Y, 0, 15, -3.5, 3.5, 0);
  [[2.0, ACC, 'A'], [3.0, INK2, 'B']].forEach(([phi, col, n]) => {
    const f0 = phi / h * 10;
    s += LN(X(0), Y(-phi), X(f0), Y(0), `stroke:${col};stroke-width:1.6;stroke-dasharray:5 4`);
    const fe = Math.min(15, (3.4 + phi) / h * 10), ke = h * fe / 10 - phi;
    s += LN(X(f0), Y(0), X(fe), Y(ke), `stroke:${col};stroke-width:2.6`);
    s += `<circle cx="${X(f0).toFixed(1)}" cy="${Y(0)}" r="3.5" style="fill:${col}"/>` + T(X(f0) + 4, Y(0) + 15, sb('f', '0'), { c: 'tk', st: `fill:${col}` });
    s += T(X(0) + 6, Y(-phi) + 4, `−φ (${n})`, { c: 'tk', st: `fill:${col}` });
    s += n === 'A' ? T(X(10.6), Y(3.3), 'metal A', { a: 'middle', c: 'tk', st: `fill:${col};font-weight:600` }) : T(X(13.2), Y(1.2), 'metal B', { a: 'middle', c: 'tk', st: `fill:${col};font-weight:600` });
  });
  s += T(X(10.5), Y(-1.6), 'gradient = h', { a: 'middle', c: 'tk' }) + T(X(10.5), Y(-1.6) + 14, '(same for every metal)', { a: 'middle', c: 'tk' });
  s += T(L0 + W / 2, Tp + H + 30, 'Frequency f (× 10¹⁴ Hz)', { a: 'middle', c: 'axl' }) + yLab(14, Tp + H / 2, sb('K', 'max', ' (eV)'));
  return wrap(s, 'K<sub>max</sub> = hf − φ has the form y = mx + b: gradient h, vertical intercept −φ, horizontal intercept f<sub>0</sub> = φ/h. A metal with a larger work function needs a higher threshold frequency, so its line is shifted right but stays parallel.');
}

/* Photocurrent against voltage: intensity and frequency */
function photoIV() {
  let s = svgOpen(420, 214, 'Two graphs of photocurrent against the voltage between anode and cathode. Left: two light intensities at the same frequency. The brighter light gives a higher saturation current but both curves fall to zero at the same negative stopping voltage. Right: two frequencies at the same intensity. Both reach the same saturation current but the higher frequency needs a larger negative stopping voltage to bring the current to zero.', 'Photocurrent against voltage');
  const panel = (ox, title, curves) => {
    const W = 170, H = 130, Tp = 34, X = v => ox + (v + 3) / 7 * W, Y = i => Tp + (1 - i / 1.15) * H;
    let o = T(ox + W / 2, 16, title, { a: 'middle', c: 'axl' });
    o += LN(X(-3), Y(0), X(4), Y(0), 'stroke:var(--ink-2);stroke-width:1.4') + LN(X(0), Y(0), X(0), Tp, 'stroke:var(--ink-2);stroke-width:1.4');
    o += T(X(4), Y(0) + 14, 'V', { a: 'end', c: 'axl' }) + T(X(0) + 4, Tp + 8, 'I', { c: 'axl' });
    curves.forEach(([v0, imax, col, lab]) => {
      const pts = []; for (let v = -v0; v <= 4; v += 0.05) { const u = (v + v0); pts.push([X(v), Y(imax * (1 - Math.exp(-u * 1.6)))]); }
      o += path(pts, `stroke:${col};stroke-width:2.3`) + T(X(4) - 2, Y(imax) - 5, lab, { a: 'end', c: 'tk', st: `fill:${col}` });
      o += `<circle cx="${X(-v0).toFixed(1)}" cy="${Y(0)}" r="3" style="fill:${col}"/>`;
    });
    return o;
  };
  s += panel(22, 'Same f, different intensity', [[1.6, 1.0, ACC, 'bright'], [1.6, 0.55, INK2, 'dim']]);
  s += T(22 + (1.4 / 7) * 170, 34 + 130 + 30, '−V₀ (same)', { a: 'middle', c: 'tk' });
  s += panel(228, 'Same intensity, different f', [[2.4, 0.8, ACC, ''], [1.2, 0.8, INK2, '']]);
  s += T(228 + (0.6 / 7) * 170, 34 + 130 + 18, 'high f', { a: 'middle', c: 'tk', st: 'fill:var(--accent)' }) + T(228 + (1.8 / 7) * 170, 34 + 130 + 32, 'low f', { a: 'middle', c: 'tk' });
  s += T(313, 30, 'same saturation current', { a: 'middle', c: 'tk' });
  return wrap(s, 'Intensity (number of photons) sets the saturation current; frequency (energy per photon) sets K<sub>max</sub> and therefore the stopping voltage, K<sub>max</sub> = qV<sub>0</sub>. Wave theory predicted the opposite of the left-hand graph.');
}

/* Booklet secondary data: K_max against f */
function peData() {
  const L0 = 52, Tp = 14, W = 330, H = 176, X = f => L0 + f / 15 * W, Y = k => Tp + (8 - k) / 10.5 * H;
  const d = [[4, 0.961], [6, 1.602], [8, 2.90], [10, 4.10], [12, 5.70], [14, 7.02]];
  const m = 0.6255, b = -1.915;
  let s = svgOpen(420, 224, 'Maximum kinetic energy in units of ten to the minus nineteen joules against frequency in units of ten to the fourteen hertz for the six data points in the booklet. A line of best fit has a gradient of about 6.3 times ten to the minus thirty-four joule seconds. Extended, it crosses the frequency axis at about 3.1 times ten to the fourteen hertz and the energy axis at about minus 1.9 times ten to the minus nineteen joules.', 'Photoelectric secondary data');
  s += axes(X, Y, 0, 15, -2.5, 8, [0, 3, 6, 9, 12, 15].map(v => [v, v]), [-2, 0, 2, 4, 6, 8].map(v => [v, v]));
  s += axLines(X, Y, 0, 15, -2.5, 8, 0);
  s += LN(X(0), Y(b), X(3.06), Y(0), 'stroke:var(--accent);stroke-width:1.6;stroke-dasharray:5 4') + `<path class="curve" d="M${X(3.06).toFixed(1)} ${Y(0)} L${X(15)} ${Y(m * 15 + b).toFixed(1)}"/>`;
  d.forEach(([f, k]) => { s += `<circle class="mk" cx="${X(f)}" cy="${Y(k).toFixed(1)}" r="3.5"/>`; });
  s += T(X(3.06) + 4, Y(0) + 15, sb('f', '0', ' ≈ 3.1 × 10¹⁴ Hz'), { c: 'tk' });
  s += `<circle cx="${X(0)}" cy="${Y(b).toFixed(1)}" r="3.5" style="fill:var(--accent)"/>` + T(X(3.6), Y(-2.15), 'intercept −φ ≈ −1.9 × 10⁻¹⁹ J', { c: 'tk' });
  s += T(X(1.2), Y(6.6), 'gradient = h ≈ 6.3 × 10⁻³⁴ J s', { c: 'tk', st: 'fill:var(--accent)' });
  s += T(L0 + W / 2, Tp + H + 30, 'Frequency (× 10¹⁴ Hz)', { a: 'middle', c: 'axl' }) + yLab(14, Tp + H / 2, sb('K', 'max', ' (× 10⁻¹⁹ J)'));
  return wrap(s, 'K<sub>max</sub> = qV<sub>0</sub> for each stopping voltage, then fit a straight line. These values are read from a best-fit line through the booklet’s data; your hand-drawn line may differ a little.');
}

/* Worksheet 8 Q8: sodium graph */
function sodium() {
  const L0 = 46, Tp = 14, W = 330, H = 170, X = f => L0 + (f - 3) / 10 * W, Y = k => Tp + (4 - k) / 4 * H;
  const d = [[5.36, 0.40], [6.9, 0.99], [7.71, 1.29], [8.19, 1.63], [9.79, 2.40], [11.9, 3.24]];
  let s = svgOpen(420, 220, 'Kinetic energy of photoelectrons from sodium in electron volts against frequency in units of ten to the fourteen hertz. Six points lie on a straight line that crosses the frequency axis at about 4.6 times ten to the fourteen hertz and reaches about 3.6 electron volts at 12.7 times ten to the fourteen hertz.', 'Photoelectric data for sodium');
  s += axes(X, Y, 3, 13, 0, 4, [4, 6, 8, 10, 12].map(v => [v, v]), [0, 1, 2, 3, 4].map(v => [v, v]));
  s += axLines(X, Y, 3, 13, 0, 4);
  s += `<path class="curve" d="M${X(4.6).toFixed(1)} ${Y(0)} L${X(12.8).toFixed(1)} ${Y(0.446 * (12.8 - 4.59)).toFixed(1)}"/>`;
  d.forEach(([f, k]) => { s += `<circle class="mk" cx="${X(f).toFixed(1)}" cy="${Y(k).toFixed(1)}" r="4" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>`; });
  s += T(L0 + W / 2, Tp + H + 30, 'Frequency (× 10¹⁴ Hz)', { a: 'middle', c: 'axl' }) + yLab(14, Tp + H / 2, 'Kinetic energy (eV)');
  return wrap(s, 'Redrawn from Worksheet 8 Q8 (sodium photoemitter).');
}

/* Hydrogen energy levels with Balmer and Lyman transitions */
function hLevels() {
  const lv = [[1, -13.6, 196], [2, -3.40, 124], [3, -1.51, 82], [4, -0.85, 60], [5, -0.54, 46], [99, 0, 26]];
  let s = svgOpen(420, 214, 'Energy level diagram for hydrogen, not to scale. Levels: n equals 1 at minus 13.6 electron volts, n equals 2 at minus 3.40, n equals 3 at minus 1.51, n equals 4 at minus 0.85, n equals 5 at minus 0.54, and ionisation at 0. Downward arrows from n equals 3, 4 and 5 to n equals 2 are the visible Balmer lines at 656, 486 and 434 nanometres. A longer arrow from n equals 2 to n equals 1 gives 122 nanometres, in the ultraviolet.', 'Hydrogen energy levels');
  s += defs('p7hl', [['r', '#e0302a'], ['c', '#0aa0ff'], ['v', '#6a3fd8'], ['k', INK2]]);
  lv.forEach(([n, e, y]) => { s += LN(70, y, 366, y, n === 99 ? 'stroke:var(--ink-3);stroke-dasharray:4 3' : 'stroke:var(--ink-2);stroke-width:1.6') + T(64, y + 4, e === 0 ? '0' : '−' + Math.abs(e).toFixed(2), { a: 'end', c: 'tk' }) + T(372, y + 4, n === 99 ? 'ionised' : `n = ${n}`, { c: 'tk' }); });
  s += yLab(14, 110, 'Energy (eV)');
  [[3, 82, 'p7hlr', '656 nm', '#e0302a', 140], [4, 60, 'p7hlc', '486 nm', '#0aa0ff', 205], [5, 46, 'p7hlv', '434 nm', '#6a3fd8', 270]].forEach(([n, y, id, l, col, x]) => {
    s += AR(x, y + 2, x, 122, col, id, { w: 2.4 }) + T(x + 5, 108, l, { c: 'tk', st: `fill:${col};font-weight:600` });
  });
  s += AR(330, 126, 330, 194, INK2, 'p7hlk', { w: 2 }) + T(324, 164, '122 nm (UV)', { a: 'end', c: 'tk' });
  s += T(200, 150, 'Balmer series: visible', { a: 'middle', c: 'tk' }) + T(200, 164, 'Lyman: ultraviolet', { a: 'middle', c: 'tk' });
  return wrap(s, 'ΔE = E<sub>i</sub> − E<sub>f</sub> = hf = hc/λ. For example, 3 → 2: 1.89 eV = 3.03 × 10⁻¹⁹ J, so λ = hc/ΔE = 656 nm (red). Not to scale.');
}

/* Continuous, emission and absorption spectra of hydrogen */
const H_LINES = [410.2, 434.0, 486.1, 656.3];
function spectraTypes() {
  const X0 = 132, X1 = 400, X = w => X0 + (w - 400) / 300 * (X1 - X0);
  let s = svgOpen(420, 196, 'Three spectra from 400 to 700 nanometres. Continuous: an unbroken rainbow from violet to red, from a hot dense source. Emission: four bright coloured lines on a black background, at 410, 434, 486 and 656 nanometres, from hot low-pressure hydrogen. Absorption: a rainbow crossed by four dark lines at exactly the same wavelengths, from a continuous source shining through cool hydrogen.', 'Continuous, emission and absorption spectra');
  s += `<defs>${rainbowDef('p7spc')}</defs>`;
  const rows = [['Continuous', 'hot solid or dense gas', 0], ['Emission', 'hot low-pressure gas', 1], ['Absorption', 'light through cool gas', 2]];
  rows.forEach(([n, sub, k]) => {
    const y = 14 + k * 54;
    s += T(10, y + 16, n, { c: 'axl' }) + T(10, y + 30, sub, { c: 'tk', st: 'font-size:9px' });
    s += `<rect x="${X0}" y="${y}" width="${X1 - X0}" height="34" style="${k === 1 ? 'fill:#0b0b10;stroke:var(--ink-3)' : 'fill:url(#p7spc)'}"/>`;
    H_LINES.forEach(w => { s += `<rect x="${(X(w) - 1.6).toFixed(1)}" y="${y}" width="3.2" height="34" style="fill:${k === 1 ? wlCol(w) : k === 2 ? '#0b0b10' : 'none'}"/>`; });
  });
  [400, 500, 600, 700].forEach(w => { s += T(X(w), 190, w, { a: 'middle', c: 'tk' }); });
  return wrap(s, 'Hydrogen absorbs exactly the wavelengths it emits, because both come from the same energy-level gaps. Each element’s set of lines is a unique “fingerprint”. Wavelengths in nm.');
}

/* Doppler shift of absorption lines */
function doppler() {
  const X0 = 110, X1 = 400, X = w => X0 + (w - 400) / 300 * (X1 - X0);
  let s = svgOpen(420, 200, 'Absorption spectra of hydrogen. Top: a source at rest, with dark lines at the laboratory wavelengths. Middle: a source moving away; every line is shifted the same fraction towards longer, redder wavelengths (red shift). Bottom: a source moving closer; every line is shifted towards shorter, bluer wavelengths (blue shift). The shifts are exaggerated.', 'Doppler shift of spectral lines');
  s += `<defs>${rainbowDef('p7dpg')}</defs>` + defs('p7dp', [['k', INK2]]);
  const rows = [['At rest', 'laboratory', 1], ['Moving away', 'red shift', 1.03], ['Moving closer', 'blue shift', 0.975]];
  rows.forEach(([n, sub, f], k) => {
    const y = 14 + k * 56;
    s += T(10, y + 16, n, { c: 'axl' }) + T(10, y + 30, sub, { c: 'tk', st: `font-size:9.5px${k ? ';fill:var(--accent)' : ''}` });
    s += `<rect x="${X0}" y="${y}" width="${X1 - X0}" height="32" style="fill:url(#p7dpg)"/>`;
    H_LINES.forEach(w => { s += `<rect x="${(X(w * f) - 1.6).toFixed(1)}" y="${y}" width="3.2" height="32" style="fill:#0b0b10"/>`; if (k) s += LN(X(w), y - 3, X(w), y + 35, 'stroke:var(--ink-3);stroke-width:1;stroke-dasharray:2 2'); });
  });
  s += AR(X(560), 106, X(600), 106, INK2, 'p7dpk', { w: 1.4 }) + AR(X(600), 162, X(560), 162, INK2, 'p7dpk', { w: 1.4 });
  [400, 500, 600, 700].forEach(w => { s += T(X(w), 194, w, { a: 'middle', c: 'tk' }); });
  return wrap(s, 'Dashed lines mark the laboratory positions. The pattern of lines is kept, so the element can still be recognised; the fractional shift gives the radial velocity, Δλ/λ = v/c. Shifts exaggerated; wavelengths in nm.');
}

/* Worksheet 9 Q1: line spectra (redrawn) */
function ws9Spectra() {
  const X0 = 110, X1 = 400, X = p => X0 + p / 100 * (X1 - X0);
  const rows = [['Unknown', [3, 4.5, 9, 28.5, 50, 95.3]], ['Sample A', [28.5, 50, 67, 78.2]], ['Sample B', [3, 28.5, 50]], ['Sample C', [4.5, 9, 28.5, 94.5]], ['Sample D', [18.7, 21, 57, 78.2, 94.5]]];
  let s = svgOpen(420, 186, 'Five line spectra drawn as strips. The unknown sample has lines at about 3, 4.5, 9, 28.5, 50 and 95 percent of the way across. Sample A has lines at 28.5, 50, 67 and 78. Sample B has lines at 3, 28.5 and 50. Sample C has lines at 4.5, 9, 28.5 and 94.5. Sample D has lines at 19, 21, 57, 78 and 94.5.', 'Line spectra for Worksheet 9 Q1');
  rows.forEach(([n, ls], k) => {
    const y = 8 + k * 35;
    s += T(X0 - 8, y + 17, n, { a: 'end', c: k ? 'tk' : 'axl' });
    s += `<rect x="${X0}" y="${y}" width="${X1 - X0}" height="24" style="fill:var(--surface);stroke:var(--ink-2)"/>`;
    ls.forEach(p => { s += LN(X(p), y, X(p), y + 24, 'stroke:var(--ink);stroke-width:1.8'); });
  });
  return wrap(s, 'Redrawn from Worksheet 9 Q1.');
}

/* Light clock: rest frame and moving frame */
function lightClock() {
  let s = svgOpen(420, 210, 'Left: a light clock at rest. Light bounces straight up and down between two mirrors a distance L apart, taking time t zero equals 2L over c. Right: the same clock seen moving to the right at speed v. The light follows a longer zigzag path, the hypotenuse of a right triangle whose base is v times t over 2 and whose height is L. Since light travels at c for both observers, the outside observer measures a longer time t.', 'Light clock');
  s += defs('p7lc', [['a', ACC], ['k', INK2]]);
  const mir = (x, y, w = 44) => `<rect x="${x - w / 2}" y="${y - 3}" width="${w}" height="6" style="fill:var(--ink-2)"/>`;
  /* rest */
  s += T(80, 16, 'At rest (proper time)', { a: 'middle', c: 'axl' });
  s += mir(70, 40) + mir(70, 170);
  s += AR(64, 166, 64, 46, ACC, 'p7lca', { w: 2 }) + AR(76, 46, 76, 166, ACC, 'p7lca', { w: 2 });
  s += T(100, 110, 'L', { c: 'axl' }) + T(70, 196, sb('t', '0', ' = 2L/c'), { a: 'middle', c: 'tk' });
  /* moving */
  s += T(300, 16, 'Same clock moving at v', { a: 'middle', c: 'axl' });
  const xs = [200, 290, 380];
  xs.forEach((x, i) => { s += mir(x, 40) + mir(x, 170); if (i) s += LN(x, 40, x, 170, 'stroke:var(--ink-3);stroke-width:1;stroke-dasharray:2 3'); });
  s += AR(200, 168, 288, 44, ACC, 'p7lca', { w: 2 }) + AR(292, 44, 378, 166, ACC, 'p7lca', { w: 2 });
  s += AR(200, 186, 288, 186, INK2, 'p7lck', { w: 1 }) + T(244, 200, 'vt/2', { a: 'middle', c: 'tk' });
  s += T(230, 96, 'ct/2', { a: 'end', c: 'tk', st: 'fill:var(--accent)' }) + T(296, 110, 'L', { c: 'axl' });
  s += AR(320, 205 - 6, 360, 205 - 6, INK2, 'p7lck', { w: 1.4 }) + T(366, 202, 'v', { c: 'axl' });
  return wrap(s, 'Pythagoras: (ct/2)² = L² + (vt/2)² with L = ct<sub>0</sub>/2 gives t = t<sub>0</sub>/√(1 − v²/c²). The longer path at the same speed c means more time passes outside for each tick: moving clocks run slow. Light clocks are a thought-experiment model only.');
}

/* Lorentz factor against v/c */
function gammaGraph() {
  const L0 = 46, Tp = 12, W = 334, H = 170, X = b => L0 + b * W, Y = g => Tp + (1 - (g - 1) / 7) * H;
  let s = svgOpen(420, 222, 'The Lorentz factor gamma against speed as a fraction of the speed of light. Gamma stays close to 1 up to about 0.3 c, is 1.25 at 0.6 c, 1.67 at 0.8 c, 2.29 at 0.9 c and 7.09 at 0.99 c, rising without limit as v approaches c.', 'Lorentz factor against v/c');
  s += axes(X, Y, 0, 1, 1, 8, [0, 0.2, 0.4, 0.6, 0.8, 1].map(v => [v, v === 1 ? 'c' : v ? v + 'c' : '0']), [1, 2, 3, 4, 5, 6, 7, 8].map(v => [v, v]));
  s += axLines(X, Y, 0, 1, 1, 8);
  const pts = []; for (let b = 0; b <= 0.9905; b += 0.005) pts.push([X(b), Y(1 / Math.sqrt(1 - b * b))]);
  s += `<path class="curve" d="${pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')}"/>`;
  s += LN(X(1), Tp, X(1), Y(1), 'stroke:var(--ink-3);stroke-dasharray:4 4');
  [[0.6, 1.25], [0.8, 1.667], [0.9, 2.294], [0.99, 7.089]].forEach(([b, g]) => { s += `<circle cx="${X(b).toFixed(1)}" cy="${Y(g).toFixed(1)}" r="3.5" style="fill:var(--accent)"/>` + T(X(b) - 6, Y(g) - 6, `${g.toFixed(2)}`, { a: 'end', c: 'tk' }); });
  s += T(L0 + W / 2, Tp + H + 30, 'Speed v', { a: 'middle', c: 'axl' }) + yLab(14, Tp + H / 2, 'γ = 1/√(1 − v²/c²)');
  return wrap(s, 'Time dilation t = γt<sub>0</sub> and length contraction l = l<sub>0</sub>/γ. Below about 0.1c, γ < 1.005, which is why everyday life looks Newtonian.');
}

/* Relativistic vs Newtonian momentum */
function momentumGraph() {
  const L0 = 50, Tp = 12, W = 330, H = 170, X = b => L0 + b * W, Y = p => Tp + (1 - p / 6) * H;
  let s = svgOpen(420, 222, 'Momentum in units of rest mass times c against speed as a fraction of c. The Newtonian momentum m zero v is a straight line reaching 1 at the speed of light. The relativistic momentum matches it at low speeds but curves upward, reaching 1.33 at 0.8 c and rising without limit as v approaches c.', 'Relativistic and Newtonian momentum');
  s += axes(X, Y, 0, 1, 0, 6, [0, 0.2, 0.4, 0.6, 0.8, 1].map(v => [v, v === 1 ? 'c' : v ? v + 'c' : '0']), [0, 1, 2, 3, 4, 5, 6].map(v => [v, v]));
  s += axLines(X, Y, 0, 1, 0, 6);
  const pts = []; for (let b = 0; b <= 0.986; b += 0.004) pts.push([X(b), Y(b / Math.sqrt(1 - b * b))]);
  s += `<path class="curve" d="${pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')}"/>`;
  s += LN(X(0), Y(0), X(1), Y(1), 'stroke:var(--ink-2);stroke-width:2;stroke-dasharray:6 4');
  s += LN(X(1), Tp, X(1), Y(0), 'stroke:var(--ink-3);stroke-dasharray:4 4');
  s += T(X(0.66), Y(3.4), 'relativistic', { a: 'end', c: 'tk', st: 'fill:var(--accent);font-weight:600' }) + T(X(0.66), Y(3.4) + 14, sb('p = γm', '0', 'v'), { a: 'end', c: 'tk', st: 'fill:var(--accent)' });
  s += T(X(0.1), Y(1.25), sb('Newtonian p = m', '0', 'v (dashed)'), { c: 'tk' });
  s += T(L0 + W / 2, Tp + H + 30, 'Speed v', { a: 'middle', c: 'axl' }) + yLab(16, Tp + H / 2, sb('p / (m', '0', 'c)'));
  return wrap(s, 'The curves agree at low speed (the booklet says Newtonian momentum works up to about 0.2c). As v → c the relativistic momentum → ∞, so an unlimited impulse (FΔt) and unlimited energy would be needed: nothing with mass reaches c.');
}

/* Michelson–Morley interferometer */
function mmApparatus() {
  let s = svgOpen(420, 216, 'Michelson interferometer. Light from a source on the left hits a half-silvered mirror at 45 degrees in the centre. Half the light passes straight through to a mirror on the right and half is reflected up to a mirror at the top. Both beams return to the half-silvered mirror and recombine, travelling down to an observer who sees interference fringes. An arrow labelled expected aether wind points along one arm.', 'Michelson–Morley interferometer');
  s += defs('p7mm', [['a', ACC], ['k', INK2]]);
  const C = [200, 118];
  s += `<rect x="20" y="104" width="34" height="28" rx="4" style="fill:var(--surface-2);stroke:var(--ink-2)"/>` + T(37, 148, 'source', { a: 'middle', c: 'tk' });
  s += LN(C[0] - 16, C[1] + 16, C[0] + 16, C[1] - 16, 'stroke:var(--ink-2);stroke-width:4') + T(C[0] + 18, C[1] + 22, 'half-silvered', { c: 'tk' }) + T(C[0] + 18, C[1] + 34, 'mirror', { c: 'tk' });
  s += `<rect x="352" y="${C[1] - 22}" width="7" height="44" style="fill:var(--ink-2)"/>` + T(366, C[1] + 4, sb('M', '1'), { c: 'axl' });
  s += `<rect x="${C[0] - 22}" y="22" width="44" height="7" style="fill:var(--ink-2)"/>` + T(C[0] + 28, 30, sb('M', '2'), { c: 'axl' });
  s += AR(56, C[1], C[0] - 6, C[1], ACC, 'p7mma', { w: 2 });
  s += AR(C[0] + 6, C[1] - 4, 348, C[1] - 4, ACC, 'p7mma', { w: 1.8 }) + AR(348, C[1] + 4, C[0] + 8, C[1] + 4, ACC, 'p7mma', { w: 1.8, dash: '5 3' });
  s += AR(C[0] - 4, C[1] - 6, C[0] - 4, 32, ACC, 'p7mma', { w: 1.8 }) + AR(C[0] + 4, 32, C[0] + 4, C[1] - 8, ACC, 'p7mma', { w: 1.8, dash: '5 3' });
  s += AR(C[0], C[1] + 8, C[0], 186, ACC, 'p7mma', { w: 2 }) + T(C[0], 204, 'observer: interference fringes', { a: 'middle', c: 'tk' });
  s += AR(380, 186, 270, 186, INK2, 'p7mmk', { w: 1.6 }) + T(380, 176, 'expected “aether wind”', { a: 'end', c: 'tk' });
  s += T(276, C[1] - 12, 'arm 1', { a: 'middle', c: 'tk' }) + T(C[0] - 10, 70, 'arm 2', { a: 'end', c: 'tk' });
  return wrap(s, 'If the Earth moved through an aether, light along and across the “wind” would take different times, and rotating the apparatus (floated on mercury) should shift the fringes. No shift was ever seen: the null result.');
}

/* Simultaneity: light-operated doors on a train */
function trainDoors() {
  let s = svgOpen(420, 200, 'Top: in the train’s frame a light in the centre of the carriage sends light to both doors, which are equal distances away, so both doors open at the same time. Bottom: an observer on the platform sees the train move right while the light travels. The rear door moves towards the light and the front door moves away, so the light reaches the rear door first and the doors do not open simultaneously.', 'Relativity of simultaneity');
  s += defs('p7tr', [['a', ACC], ['k', INK2]]);
  const car = (x, y) => `<rect x="${x}" y="${y}" width="200" height="50" rx="6" style="fill:var(--surface-2);stroke:var(--ink-2)"/><rect x="${x + 2}" y="${y + 10}" width="8" height="38" style="fill:var(--ink-3)"/><rect x="${x + 190}" y="${y + 10}" width="8" height="38" style="fill:var(--ink-3)"/>`;
  s += T(10, 22, 'Train frame', { c: 'axl' }) + car(110, 12);
  s += `<circle cx="210" cy="24" r="5" style="fill:var(--accent)"/>` + AR(204, 38, 124, 38, ACC, 'p7tra', { w: 1.8 }) + AR(216, 38, 296, 38, ACC, 'p7tra', { w: 1.8 });
  s += T(210, 78, 'both doors open together', { a: 'middle', c: 'tk' });
  s += T(10, 112, 'Platform frame', { c: 'axl' }) + `<rect x="110" y="102" width="200" height="50" rx="6" style="fill:none;stroke:var(--ink-3);stroke-dasharray:4 3"/>` + car(150, 102);
  s += `<circle cx="210" cy="114" r="5" style="fill:var(--accent);opacity:.5"/>` + AR(204, 128, 164, 128, ACC, 'p7tra', { w: 1.8 }) + AR(216, 128, 330, 128, ACC, 'p7tra', { w: 1.8 });
  s += T(164, 168, 'rear door first', { a: 'middle', c: 'tk', st: 'fill:var(--accent)' }) + T(344, 168, 'front door later', { a: 'middle', c: 'tk' });
  s += AR(320, 186, 380, 186, INK2, 'p7trk', { w: 1.4 }) + T(316, 190, 'train moving', { a: 'end', c: 'tk' });
  return wrap(s, 'Light travels at c in both frames, but on the platform the rear door moves towards the light and the front door away from it. Both accounts are equally valid: simultaneity is relative.');
}

/* ---------- Tables ---------- */
const speedTable = () => tbl(['Who (year)', 'Method', 'Value (m s⁻¹)'], [
  ['Galileo (1638)', 'Two lanterns, uncovered in turn', '“extraordinarily rapid”'],
  ['Roemer (1675)', 'Delay in eclipses of Io across Earth’s orbit', '2.14 × 10⁸'],
  ['Bradley (1728)', 'Stellar aberration', '3.01 × 10⁸'],
  ['Fizeau (1849)', 'Rotating toothed wheel, 8 km path', '3.15 × 10⁸'],
  ['Foucault (1862)', 'Rotating mirror', '2.98 × 10⁸'],
  ['Cornu (1872–76)', 'Improved toothed wheel, electrical timing', '3.004 × 10⁸'],
  ['Michelson (1879, 1926)', 'Rotating mirror over 610 m, later 35 km', '≈ 2.998 × 10⁸'],
  ['Rosa &amp; Dorsey (1907)', 'Measured μ<sub>0</sub> and ε<sub>0</sub>, used c = 1/√(μ<sub>0</sub>ε<sub>0</sub>)', '2.99788 × 10⁸'],
  ['Essen (1946–50)', 'Microwave cavity resonator, c = fλ', '2.997925 × 10⁸'],
  ['Froome (1958)', '72 GHz microwave interferometer', '2.997925 × 10⁸'],
  ['Defined (1983)', 'c fixed; the metre is defined from it', '299 792 458 exactly']
], 'Values as given in the booklet (which notes they are indicative). The 1983 date is when the definition was adopted.');

const nhTable = () => tbl(['Property', 'Newton (particles)', 'Huygens (waves)'], [
  ['Straight-line travel', 'Yes: fast, light particles', 'Yes: wavefronts via wavelets'],
  ['Reflection', 'Yes: bouncing particles', 'Yes: wavelets'],
  ['Refraction', 'Yes, but predicts light is <b>faster</b> in water', 'Yes, predicts <b>slower</b> in water ✓'],
  ['Partial reflection', 'Weak: “theory of fits”', 'Yes'],
  ['Dispersion', 'Yes: violet particles lighter', 'Yes: different λ refract differently'],
  ['Diffraction', 'No', 'Yes'],
  ['Interference (Young)', 'No', 'Yes'],
  ['Polarisation', 'No', 'Yes (as a transverse wave)'],
  ['Travel through a vacuum', 'Yes', 'Needed a medium (the “aether”)']
], 'Later evidence (Young 1801, Arago’s spot 1818, Foucault 1850) supported the wave model.');

const classTable = () => tbl(['Class', 'Colour', 'Surface T (K)', 'Absorption lines'], [
  ['O', 'Blue', '<span style="white-space:nowrap">30 000–50 000</span>', 'Ionised He, weak H'],
  ['B', 'Blue-white', '<span style="white-space:nowrap">10 000–30 000</span>', 'Neutral He, weak H'],
  ['A', 'White', '<span style="white-space:nowrap">7000–10 000</span>', 'Strong H, ionised metals'],
  ['F', 'White-yellow', '<span style="white-space:nowrap">6000–7000</span>', 'Weak H, strong metals (Ca, Fe)'],
  ['G', 'Yellow', '<span style="white-space:nowrap">5000–6000</span>', 'Strong metals, ionised calcium'],
  ['K', 'Orange', '<span style="white-space:nowrap">4000–5000</span>', 'Strong metals, molecules (CH, CN)'],
  ['M', 'Red', '<span style="white-space:nowrap">3000–4000</span>', 'Strong molecules (TiO)']
], '“Oh Be A Fine Gorilla, Kiss Me”. In astronomy a “metal” is any element other than H and He.');

const fuelTable = () => tbl(['Fuel', 'Specific energy (J kg⁻¹)', 'Mass converted'], [
  ['Uranium fission', '8.1 × 10¹³', '0.1%'],
  ['Deuterium fusion', '5.8 × 10¹⁴', '0.6%'],
  ['LPG / petrol (combustion)', '4.6 × 10⁷', '5 × 10⁻⁸ %'],
  ['Diesel (combustion)', '4.8 × 10⁷', '5.3 × 10⁻⁸ %'],
  ['Fat (oxidation)', '3.7 × 10⁷', '4.1 × 10⁻⁸ %'],
  ['Coal (combustion)', '3.0 × 10⁷', '3.3 × 10⁻⁸ %'],
  ['Matter–antimatter', '9.0 × 10¹⁶', '100%']
], 'Percentage converted = specific energy ÷ c² × 100. The last row is added for comparison.');

const ws6Table = () => tbl(['', 'Energy (eV)', 'Energy (J)'], [
  ['a', '250', '<b>4.01 × 10⁻¹⁷</b>'],
  ['b', '3.2 × 10³', '<b>5.13 × 10⁻¹⁶</b>'],
  ['c', '8 × 10¹²', '<b>1.28 × 10⁻⁶</b>'],
  ['d', '<b>6.24 × 10¹⁸</b>', '1'],
  ['e', '<b>2.50 × 10⁵</b>', '4.0 × 10⁻¹⁴'],
  ['f', '<b>3.0 × 10¹¹</b>', '4.8 × 10⁻⁸']
], 'eV → J: multiply by 1.602 × 10⁻¹⁹. J → eV: divide by 1.602 × 10⁻¹⁹.');

const ws8Table = () => tbl(['Photon', 'E (eV)', 'E (J)', 'λ (nm)', 'K<sub>max</sub>'], [
  ['Red', '1.8', '2.88 × 10⁻¹⁹', '689', 'none (1.8 &lt; 2.0)'],
  ['Green', '2.3', '3.68 × 10⁻¹⁹', '539', '0.3 eV = 4.8 × 10⁻²⁰ J'],
  ['Blue', '3.1', '4.97 × 10⁻¹⁹', '400', '1.1 eV = 1.76 × 10⁻¹⁹ J']
], 'φ = 2.0 eV = 3.20 × 10⁻¹⁹ J. λ = hc/E and K<sub>max</sub> = E − φ.');

const hkTable = () => tbl(['Flights', 'Predicted (ns)', 'Measured (ns)'], [
  ['Eastward (with Earth’s rotation)', '−40 ± 23 (lose)', '−59 ± 10 (lose)'],
  ['Westward (against rotation)', '+275 ± 21 (gain)', '+273 ± 7 (gain)']
], 'Hafele–Keating, 1971, compared with clocks at the US Naval Observatory. Predictions combine the special relativity (speed) effect and the general relativity (gravity) effect.');

const VIZ = {
  p7emwave: emWave, p7spec: spectrum, p7dslit: doubleSlit, p7malus: malusGraph, p7malus2: malusLinear, p7bb: blackBody,
  p7kf: photoLines, p7iv: photoIV, p7pedata: peData, p7na: sodium, p7hlev: hLevels, p7spectra: spectraTypes, p7dopp: doppler,
  p7ws9: ws9Spectra, p7clock: lightClock, p7gamma: gammaGraph, p7mom: momentumGraph, p7mm: mmApparatus, p7train: trainDoors,
  p7speed: speedTable, p7nh: nhTable, p7class: classTable, p7fuel: fuelTable, p7ws6: ws6Table, p7ws8: ws8Table, p7hk: hkTable
};

const DECKS = [];


/* ================= 7.1 PART 1: MAXWELL AND EM WAVES ================= */
DECKS.push({ id: 'phys-m7-th', fa: 'fa1', title: 'Theories, laws and Maxwell', dps: ['7.1.1', '7.1.2'], cards: [
  { id: 'p7th01', dp: '7.1.1', t: 'def', q: 'What is a scientific <b>theory</b>?',
    a: P('A set of concepts, claims and/or laws that can be used to explain and predict a wide range of related observed phenomena.') + P('Theories are founded on clearly identified assumptions, are testable, produce reproducible results and have explanatory power. A theory is not a “guess”, and theories do not become laws.') },
  { id: 'p7th02', dp: '7.1.1', t: 'def', q: 'What is a scientific <b>law</b>, and how does it differ from a theory?',
    a: P('A law is a statement describing invariable relationships between phenomena in specified conditions, frequently expressed mathematically.') + L(['A law states <b>what</b> happens but has no explanatory power, e.g. the law of universal gravitation gives the force but not why it exists.', 'A theory attempts to explain <b>why</b>. It is incomplete and evolves to explain new observations.']) },
  { id: 'p7th03', dp: '7.1.1', t: 'con', q: 'How are theories validated in science?',
    a: L(['They give consistent explanations of observations.', 'They make predictions that are confirmed by consistent experimental results.']) + P('When new observations cannot be explained, the theory must be changed. Module 7 is full of examples: wave–particle duality, quantum theory and special relativity.') },
  { id: 'p7th04', dp: '7.1.1', t: 'def', q: 'Define a <b>field</b>.',
    a: P('A region in which a body experiences a force due to the effects of another body. The effect can come from the masses, charges or magnetic properties of the bodies.') },
  { id: 'p7th05', dp: '7.1.1', t: 'con', q: 'Who was James Clerk Maxwell, and what did he bring together?',
    a: P('A Scottish physicist (1831–1879). He combined the work of Oersted, Coulomb, Gauss, Ampère and Faraday, added his own insights, and produced a complete theory of electromagnetism: <b>Maxwell’s equations</b> (1860s).') + P('He also developed the kinetic theory of gases and worked on colour vision. His electromagnetism is ranked alongside Newton’s work on motion.') },
  { id: 'p7th06', dp: '7.1.1', t: 'con', q: 'State the four ideas in Maxwell’s equations in words.',
    a: OL(['Electric field lines start on positive charges and end on negative charges (Gauss’s law for electricity).', 'Magnetic field lines are continuous loops: there are no magnetic monopoles (Gauss’s law for magnetism).', 'A changing magnetic field produces an electric field (Faraday’s law, including Lenz’s law).', 'A current <b>or a changing electric field</b> produces a magnetic field (Ampère’s law with Maxwell’s addition).']) + N('You do not need the mathematical forms. Laws 3 and 4 together allow electromagnetic waves.') },
  { id: 'p7th07', dp: '7.1.1', t: 'con', q: 'What is meant by Maxwell’s <b>unification</b> of electricity and magnetism?',
    a: P('Maxwell showed that electric and magnetic forces are not separate: they are different manifestations of one <b>electromagnetic force</b>. By developing the electromagnetic wave theory of light, he also showed that light, electricity and magnetism are interrelated.') + P('This classical unification motivates modern attempts to unify the four fundamental forces.') },
  { id: 'p7th08', dp: '7.1.1', t: 'con', q: 'How did Maxwell predict electromagnetic waves, and what did he predict about them?',
    a: L(['An oscillating charge produces a changing electric field, which produces a changing magnetic field at right angles to it, which in turn produces a changing electric field, and so on.', 'These self-perpetuating fields would move away from the charge as a wave, with the same frequency as the oscillating charge.', 'So EM waves could have a <b>wide range of frequencies</b>; visible light would be only a small part of the range.', 'They would travel at the speed of light in a vacuum.']), v: 'p7emwave' },
  { id: 'p7th09', dp: '7.1.1', t: 'eq', q: 'Use Maxwell’s relationship to calculate the speed of EM waves in a vacuum.',
    a: E('c = ' + F('1', SQ('μ_{0}ε_{0}'))) + E('= ' + F('1', SQ('4π × 10^{-7} × 8.854 × 10^{-12}')) + ' = 2.998 × 10^{8} m s^{-1}') + P('μ<sub>0</sub> (permeability) is how easily a vacuum supports a magnetic field; ε<sub>0</sub> (permittivity) is how easily electric field lines pass through a vacuum.') + N('Not on the data sheet, but worth knowing for “extensive knowledge” answers.') },
  { id: 'p7th10', dp: '7.1.1', t: 'con', q: 'What did Maxwell conclude from his calculated speed of EM waves?',
    a: L(['It matched the measured speed of light, so <b>light is an electromagnetic wave</b>.', 'c depends only on the constants μ<sub>0</sub> and ε<sub>0</sub>, so the speed of light in a vacuum should always be the same constant value.', 'Other wavelengths outside the visible range should exist. They had not yet been detected, so this was a testable prediction.']) + P('Experimental confirmation (Hertz, 1887) came after Maxwell’s death.') },
  { id: 'p7th11', dp: '7.1.1', t: 'def', q: 'What is <b>classical physics</b>?',
    a: P('Physics as it was understood before the advent of quantum physics and relativity: the rules established before the end of the 19th century, relying on Newton’s mechanics and Maxwell’s electromagnetism.') + P('It still works for large-scale objects at speeds much less than c. Quantum theory treats light as a stream of photons, but keeps the wave ideas of frequency and wavelength.') },
  { id: 'p7th12', dp: '7.1.1', t: 'exam', q: 'Worksheet 1 Q1: Maxwell’s theory (1864) was described as “too different to warrant serious consideration”. What made scientists oppose it?',
    a: L(['It was highly mathematical and abstract, describing fields rather than mechanical models people could picture.', 'It made predictions (other EM waves) with no experimental evidence at the time.', 'It challenged established ideas held by respected scientists, who were invested in the existing models.']) + P('Scientists are rightly cautious: a new theory needs experimental support. Acceptance came after Hertz confirmed the predictions in 1887.') },
  { id: 'p7th13', dp: '7.1.1', t: 'exam', q: 'Worksheet 1 Q2: list Maxwell’s contributions to the classical theory of electromagnetism.',
    a: L(['Unified electricity and magnetism into one electromagnetic theory (Maxwell’s equations).', 'Added the idea that a changing electric field produces a magnetic field.', 'Predicted electromagnetic waves: oscillating, mutually perpendicular E and B fields that need no medium.', 'Predicted their speed, c = 1/√(μ<sub>0</sub>ε<sub>0</sub>), equal to the speed of light, so light is an EM wave.', 'Predicted a whole spectrum of EM waves beyond visible light.']) },
  { id: 'p7th14', dp: '7.1.2', t: 'exam', q: 'HSC 2019 Q25 (4 marks): the diagram models an electromagnetic wave as oscillating electric and magnetic fields. Relate this model to predictions made by Maxwell.', vf: 'p7emwave',
    a: L(['Maxwell predicted that an oscillating charge produces a changing electric field, which induces a changing magnetic field, which induces a changing electric field, so the wave is self-propagating. The model shows both fields oscillating together.', 'He predicted that the E and B fields are perpendicular to each other and to the direction of travel (a transverse wave), as drawn.', 'He predicted that the wave needs no medium and travels at c = 1/√(μ<sub>0</sub>ε<sub>0</sub>) = 3.00 × 10<sup>8</sup> m s<sup>−1</sup>, the speed of light, so light is an EM wave.']) }
] });

DECKS.push({ id: 'phys-m7-em', fa: 'fa1', title: 'Producing and propagating EM waves', dps: ['7.1.2'], cards: [
  { id: 'p7em01', dp: '7.1.2', t: 'con', q: 'Describe how an electromagnetic wave is produced and how it propagates.',
    a: L(['An <b>oscillating (accelerating) charge</b> is needed.', 'Its electric field varies in magnitude and direction as it oscillates.', 'The changing electric field produces a changing magnetic field at right angles to it, which produces a changing electric field, and so on.', 'These fields are self-perpetuating and radiate out through a vacuum at c = 3.00 × 10^{8} m s^{-1}.']), v: 'p7emwave' },
  { id: 'p7em02', dp: '7.1.2', t: 'con', q: 'List the properties that all electromagnetic waves share.',
    a: L(['They need no medium (unlike mechanical waves).', 'They travel at c in a vacuum and slow down a little in other media.', 'They consist of self-propagating electric and magnetic fields at right angles to each other and to the direction of travel.', 'They are transverse waves.', 'They obey c = fλ, and the energy of each photon is E = hf.']) },
  { id: 'p7em03', dp: '7.1.2', t: 'con', q: 'Worksheet 1 Q6: define transverse and longitudinal waves. EM waves have no oscillating particles, so how can they be transverse?',
    a: L(['<b>Transverse</b>: particles of the medium oscillate perpendicular to the direction the wave travels.', '<b>Longitudinal</b>: particles oscillate parallel to the direction of travel.']) + P('In an EM wave, the oscillating quantities are the electric and magnetic fields. They oscillate perpendicular to the direction in which the wave carries energy, so the wave is classified as transverse.') },
  { id: 'p7em04', dp: '7.1.2', t: 'con', q: 'What happens to an EM wave if the charge producing it oscillates faster?',
    a: P('The frequency of the wave increases. Since every EM wave travels at c in a vacuum,') + E('c = fλ') + P('so the wavelength decreases. A range of oscillation rates produces a range of waves: the electromagnetic spectrum.') },
  { id: 'p7em05', dp: '7.1.2', t: 'rec', q: 'List the EM spectrum from longest to shortest wavelength, and give the range of visible light.',
    a: OL(['Radio waves', 'Microwaves', 'Infrared', 'Visible light: about <b>400 nm (violet) to 750 nm (red)</b>, i.e. 4.00 × 10^{-7} to 7.50 × 10^{-7} m', 'Ultraviolet', 'X-rays', 'Gamma rays']) + P('Frequency and photon energy increase down the list; higher-frequency waves are more penetrating and damaging.'), v: 'p7spec' },
  { id: 'p7em06', dp: '7.1.2', t: 'con', q: 'Worksheet 1 Q4(a)–(b): does green or yellow light carry more energy? Is EM wave energy related to wavelength, frequency or amplitude?',
    a: L(['Green has a shorter wavelength, so a higher frequency, so each photon carries <b>more energy</b> than yellow.', 'Energy per photon is proportional to <b>frequency</b> (E = hf), so inversely proportional to wavelength.']) + P('Unlike mechanical waves, amplitude does not set the energy of each photon. The <b>intensity</b> of an EM wave depends on the number of photons in the beam.') },
  { id: 'p7em07', dp: '7.1.2', t: 'calc', q: 'Worksheet 1 Q4 c–g: identify EM waves with wavelengths of 1.0 m, 1.0 cm, 1.0 mm, 1.0 μm and 1.0 nm.', vf: 'p7spec',
    a: L(['1.0 m: radio wave (bordering microwave)', '1.0 cm: microwave', '1.0 mm: microwave (bordering infrared)', '1.0 μm: infrared (just beyond red at 0.75 μm)', '1.0 nm: X-ray']) + N('Band edges are not sharp, so answers at a boundary can go either way.') },
  { id: 'p7em08', dp: '7.1.2', t: 'con', q: 'Outline the discovery of the non-visible parts of the EM spectrum.',
    a: L(['1800 Herschel: a thermometer beyond the red end warmed up (infrared).', '1801 Ritter: beyond the violet end sped up chemical reactions (ultraviolet).', '1860s Maxwell: predicted a continuous spectrum of EM waves.', '1887 Hertz: produced and detected radio waves.', '1895 Röntgen: X-rays.', '1900 Villard: gamma rays.']) + P('Before 1800 only visible light was known.') },
  { id: 'p7em09', dp: '7.1.2', t: 'con', q: 'Describe Hertz’s 1887 experiment that produced and detected EM waves.',
    a: L(['A resonating AC circuit with an induction coil produced high voltages across a spark gap in the transmitter loop; the sparks showed the oscillating current that generated EM waves.', 'A separate receiver loop with its own small gap, across the room, also sparked: EM waves had travelled through the air and induced a current.', 'With no connection between the loops, the energy must have been carried by the waves.']) + P('These “Hertzian waves” are what we now call radio waves.') },
  { id: 'p7em10', dp: '7.1.2', t: 'con', q: 'How did Hertz show that his waves travelled at the speed of light, and why was this important?',
    a: P('He reflected the waves off a metal sheet to set up a standing wave and used the receiver to find points of maximum sparking. The spacing of these gave the wavelength, and he knew the frequency of his circuit, so') + E('v = fλ ≈ 3 × 10^{8} m s^{-1}') + P('He also showed the waves could be reflected, refracted and polarised like light. This confirmed Maxwell’s predictions, validating his theory. The SI unit of frequency is named after Hertz.') },
  { id: 'p7em11', dp: '7.1.2', t: 'con', q: 'What did Hertz discover by accident during his experiments?',
    a: P('The <b>photoelectric effect</b>: ultraviolet light shining on the spark gap made sparks jump more easily, because light falling on a metal surface can release electrons.') + P('Hertz had no explanation for it. Einstein explained it in 1905 using photons.') },
  { id: 'p7em12', dp: '7.1.2', t: 'con', q: 'Worksheet 2 Q4: how do EM waves influence charged particles? How does light travel through glass?',
    a: P('The oscillating electric field of a passing wave exerts a changing force on a charge, making it oscillate (parallel to E, at the wave’s frequency), like a duck bobbing on a water wave. The oscillating charge then emits EM waves of the same frequency.') + P('In a transparent material, light excites electron oscillations that re-emit the wave. This absorption and re-emission delays the light, so it travels more slowly than in a vacuum.') },
  { id: 'p7em13', dp: '7.1.2', t: 'eq', q: 'What is the refractive index of a material, and what does it tell you?',
    a: E('n_{x} = ' + F('c', 'v_{x}')) + P('It measures optical density: how much the material slows light. Light is slower in denser media, as Huygens (not Newton) predicted. Snell’s law, n<sub>1</sub>sinθ<sub>1</sub> = n<sub>2</sub>sinθ<sub>2</sub>, gives the change in direction.') },
  { id: 'p7em14', dp: '7.1.2', t: 'calc', q: 'Worksheet 2 Q1: a proton moves at 205 m s^{-1} perpendicular to a 0.0200 T magnetic field. Find (a) the force, (b) the radius of its path, (c) the frequency of the EM waves it emits.',
    a: E('a) F = qvB = 1.602 × 10^{-19} × 205 × 0.0200 = 6.57 × 10^{-19} N') + E('b) r = ' + F('mv', 'qB') + ' = ' + F('1.673 × 10^{-27} × 205', '1.602 × 10^{-19} × 0.0200') + ' = 1.07 × 10^{-4} m') + E('c) f = ' + F('v', '2πr') + ' = ' + F('qB', '2πm') + ' = 3.05 × 10^{5} Hz') + P('The proton accelerates centripetally, so it radiates at its orbital frequency (a radio wave).') },
  { id: 'p7em15', dp: '7.1.2', t: 'exam', q: 'Worksheet 2 Q3: why do electromagnetic waves always have both an electric and a magnetic field?',
    a: P('Each field creates the other. A changing electric field produces a changing magnetic field, and a changing magnetic field produces a changing electric field. Neither can propagate alone; together they sustain the wave without a medium.') },
  { id: 'p7em16', dp: '7.1.2', t: 'exam', q: 'Worksheet 2 Q5: use an example related to producing and propagating EM waves to explain how scientific theories are validated.',
    a: L(['A theory must explain observations and make testable predictions.', 'Maxwell’s theory (1860s) predicted EM waves of many frequencies travelling at c.', 'Hertz (1887) designed an experiment to test this: he produced and detected radio waves, measured their speed as c and showed they reflected, refracted and polarised like light.', 'The prediction was confirmed by experiment, so the theory was validated and accepted. Repeated, consistent results (e.g. later radio technology) strengthened it.']) },
  { id: 'p7em17', dp: '7.1.2', t: 'exam', q: 'Worksheet 1 Q5(b)–(c): why do we use microwaves rather than radio waves for satellites, and why is most astronomical data from visible, radio and microwave radiation?',
    a: L(['Lower-frequency radio waves are reflected by the ionosphere, while microwaves pass through it to reach satellites. Their shorter wavelength also allows narrow, directed beams and more data (bandwidth).', 'The atmosphere absorbs most UV, X-rays, gamma rays and much infrared. Only the visible and radio/microwave “windows” reach the ground, so other wavelengths need space telescopes.']) }
] });

DECKS.push({ id: 'phys-m7-sl', fa: 'fa1', title: 'Measuring the speed of light', dps: ['7.1.3'], cards: [
  { id: 'p7sl01', dp: '7.1.3', t: 'rec', q: 'What is the value of the speed of light in a vacuum today, and why is it exact?',
    a: E('c = 299 792 458 m s^{-1} (exactly)') + P('By international agreement the speed of light is now <b>defined</b>, and the metre is defined from it. Use 3.00 × 10<sup>8</sup> m s<sup>−1</sup> (data sheet) in calculations.') },
  { id: 'p7sl02', dp: '7.1.3', t: 'rec', q: 'Summarise the historical and contemporary measurements of the speed of light.',
    a: P('The booklet stresses these values are indicative, as sources differ.'), v: 'p7speed' },
  { id: 'p7sl03', dp: '7.1.3', t: 'con', q: 'Describe Galileo’s attempt (1638) to measure the speed of light and its result.',
    a: P('Two people with covered lanterns stood far apart. The first uncovered his lantern; the second uncovered his as soon as he saw it. The time lag was measured (probably with a water clock) over greater and greater distances.') + P('No delay could be detected: human reaction times were far longer than the light’s travel time. Galileo concluded light was “if not instantaneous, extraordinarily rapid”, at least ten times faster than sound.') },
  { id: 'p7sl04', dp: '7.1.3', t: 'calc', q: 'Worksheet 3 Q2: human reaction time is about 0.2 s. (a) How far does light travel in 0.2 s? (b) How far apart would Galileo’s lanterns need to be for reaction time to cause only a 50% error? (c) What does this imply?',
    a: E('a) d = ct = 299 792 458 × 0.2 = 6.0 × 10^{7} m = 6.0 × 10^{4} km') + P('b) For reaction time to be 50% of the measured time, the light’s round trip must also take 0.2 s, so the round trip is 6.0 × 10<sup>4</sup> km and the lanterns would be about <b>3.0 × 10<sup>4</sup> km apart</b> (more than twice Earth’s diameter).') + P('c) Human timing can never work; methods must remove reaction time and use very long distances or very precise timing.') },
  { id: 'p7sl05', dp: '7.1.3', t: 'con', q: 'Describe Roemer’s 1675 method using the moons of Jupiter.',
    a: P('Roemer timed the eclipses of Io behind Jupiter. They came progressively later as Earth moved away from Jupiter, and earlier as it approached. At the farthest point the eclipses were <b>22 minutes</b> later than at the closest.') + P('He realised the extra time was the time for light to cross the diameter of Earth’s orbit. Distance ÷ time gave a finite speed of light, about 2.14 × 10<sup>8</sup> m s<sup>−1</sup> with the booklet’s numbers. Huygens later combined this with better distances to get 2.01 × 10<sup>8</sup> m s<sup>−1</sup>.') },
  { id: 'p7sl06', dp: '7.1.3', t: 'calc', q: 'Worksheet 3 Q3 (4 marks): eclipses of Io are 22 minutes later when Earth is on the far side of its orbit. Use the radius of Earth’s orbit (1.5 × 10^{11} m) to estimate the speed of light.',
    a: P('The extra time is the time for light to travel across the diameter of Earth’s orbit:') + E('d = 2 × 1.5 × 10^{11} = 3.0 × 10^{11} m') + E('t = 22 × 60 = 1320 s') + E('c = ' + F('d', 't') + ' = ' + F('3.0 × 10^{11}', '1320') + ' = 2.3 × 10^{8} m s^{-1}') + N('The booklet’s worked notes use 1.41 × 10¹¹ m for the radius, which gives 2.14 × 10⁸ m s⁻¹. Either way it is low because the 22-minute delay was overestimated (it is really about 16.7 min).') },
  { id: 'p7sl07', dp: '7.1.3', t: 'con', q: 'How did Bradley measure the speed of light using stellar aberration?',
    a: P('As Earth orbits the Sun, the apparent positions of stars shift slightly, as rain seems to slant when you run through it. The aberration angle is approximately the ratio of Earth’s orbital speed to the speed of light.') + P('Knowing Earth’s orbital speed and the angle, Bradley calculated c ≈ 3.01 × 10<sup>8</sup> m s<sup>−1</sup>, only about 0.4% out. This independent confirmation ended opposition to a finite speed of light.') },
  { id: 'p7sl08', dp: '7.1.3', t: 'con', q: 'Describe Fizeau’s 1849 toothed-wheel experiment.',
    a: L(['Light passed through a gap between the teeth of a rapidly rotating cogwheel, travelled 8 km to a mirror and back.', 'At the right rotation speed, the returning light hit a tooth instead of a gap and was blocked.', 'From the rotation rate and the number of teeth, the time for the round trip was known, so c = distance/time.']) + P('Using one light source and a mirror removed reaction-time errors. His value, 3.15 × 10<sup>8</sup> m s<sup>−1</sup>, was less accurate than Bradley’s but more reliable and valid.') },
  { id: 'p7sl09', dp: '7.1.3', t: 'calc', q: 'Worksheet 3 Q4: Fizeau’s mirror is 8 km away and his cogwheel has 50 teeth and 50 gaps. What rotation rate first blocks the returning light completely?',
    a: E('t = ' + F('2 × 8000', '3.00 × 10^{8}') + ' = 5.33 × 10^{-5} s') + P('The light is blocked when, in this time, the wheel turns so that a tooth replaces the gap: 1 tooth + 1 gap = 1/50 of a turn, so half of that, <b>1/100 of a revolution</b>.') + E('rate = ' + F('1/100 rev', '5.33 × 10^{-5} s') + ' = 1.9 × 10^{2} rev s^{-1} (about 187 rev s^{-1})') + P('The light is blocked again at 3, 5, 7… times this rate.') },
  { id: 'p7sl10', dp: '7.1.3', t: 'con', q: 'How did Cornu (1872–76) improve the toothed-wheel method?',
    a: L(['He measured the wheel’s rotation rate electrically and recorded it on a chart compared with the observatory clock.', 'He used a telegraph key to mark the moments the light was blocked, instead of estimating the intensity minimum.', 'He used a much longer light path and averaged repeated runs with the wheel spun both ways.']) + P('Result: 3.004 × 10<sup>8</sup> m s<sup>−1</sup>, within 0.2% of the modern value.') + N('The booklet’s heading says 1848 for this section, but Cornu’s experiments were in 1872–76.') },
  { id: 'p7sl11', dp: '7.1.3', t: 'con', q: 'Describe Foucault’s rotating-mirror method and Michelson’s improvement of it.',
    a: P('<b>Foucault</b>: light reflected off a rotating mirror to a fixed mirror (about 18 m away) and back. While the light travelled, the mirror turned slightly, so the returning beam was deflected. The deflection angle and rotation rate gave the travel time: c ≈ 2.98 × 10<sup>8</sup> m s<sup>−1</sup> (1862), within 1%.') + P('<b>Michelson</b> increased the distance between mirrors (610 m, later about 35 km between mountains) and used better mirrors, getting about 2.998 × 10<sup>8</sup> m s<sup>−1</sup>.') },
  { id: 'p7sl12', dp: '7.1.3', t: 'con', q: 'How did Rosa and Dorsey (1907) find the speed of light without timing light at all?',
    a: P('They made accurate electrical measurements of μ<sub>0</sub> and ε<sub>0</sub>, then used Maxwell’s relationship:') + E('c = ' + F('1', SQ('μ_{0}ε_{0}')) + ' = 2.99788 × 10^{8} m s^{-1}') },
  { id: 'p7sl13', dp: '7.1.3', t: 'con', q: 'Describe Essen’s contemporary method (1946–50) for measuring the speed of light.',
    a: L(['Microwaves of an accurately known frequency were fed into a closed, hollow metal cylinder (cavity resonator) whose length was precisely measured.', 'At resonance a standing wave formed, with a whole number of half-wavelengths fitting the cavity. A receiver detected resonance.', 'From the length and number of half-wavelengths, λ was found, and c = fλ.']) + P('Result: 299 792.5 ± 1 km s<sup>−1</sup> (1950). Essen also helped build the first caesium atomic clock.') },
  { id: 'p7sl14', dp: '7.1.3', t: 'con', q: 'How did Froome (1958) measure the speed of light?',
    a: P('He used a 72 GHz microwave interferometer. The beam was split into two, sent along metal waveguides to detectors on a movable carriage, and moving the carriage changed the path difference, producing interference maxima and minima.') + P('This gave λ ≈ 0.4 cm, and c = fλ = 2.997 925 × 10<sup>8</sup> m s<sup>−1</sup>.') },
  { id: 'p7sl15', dp: '7.1.3', t: 'con', q: 'How has the definition of the metre changed, and how is it now linked to the speed of light?',
    a: L(['About 1799: one ten-millionth of the distance from the equator to the pole.', 'From 1889: the length of a platinum–iridium bar kept in France.', 'Now: the distance light travels in a vacuum in <b>1/299 792 458 of a second</b>.']) + P('Once c was measured more precisely than the metre could be, c was fixed as exactly 299 792 458 m s<sup>−1</sup>. Distance is now measured using time and c.') },
  { id: 'p7sl16', dp: '7.1.3', t: 'def', q: 'How is the second defined?',
    a: P('The duration of <b>9 192 631 770</b> periods of the radiation from the transition between two hyperfine levels of the ground state of a caesium-133 atom (at rest, 0 K).') + P('Atomic clocks keep this to about 1 second in 100 million years, so time is the most precisely measured quantity, and the metre is defined from it via c.') },
  { id: 'p7sl17', dp: '7.1.3', t: 'exam', q: 'Worksheet 3 Q1: what two factors made early measurements of the speed of light inaccurate?',
    a: OL(['Inaccurate timing of very short intervals (e.g. human reaction time, crude clocks).', 'Inaccurate distances (e.g. the size of Earth’s orbit, or paths too short to give a measurable delay).']) },
  { id: 'p7sl18', dp: '7.1.3', t: 'prac', q: 'Worksheet 3 Q5: how can a microwave oven be used to measure the speed of EM waves? Compare it with Essen’s technique.',
    a: L(['Remove the turntable and heat a flat layer of chocolate or cheese briefly.', 'A standing wave forms in the oven; melted spots appear at the antinodes, which are λ/2 apart.', 'Measure the spacing, double it to get λ, and use the frequency on the oven’s label (usually 2.45 GHz): c = fλ.']) + P('Like Essen, it uses standing microwaves in a metal cavity of known frequency, but Essen measured the cavity length and resonance far more precisely.') }
] });

/* ================= 7.1 PART 2: SPECTRA ================= */
DECKS.push({ id: 'phys-m7-sp', fa: 'fa1', title: 'Spectra and spectroscopy', dps: ['7.1.4', '7.1.5'], cards: [
  { id: 'p7sp01', dp: '7.1.5', t: 'def', q: 'What is <b>spectroscopy</b>?',
    a: P('The branch of science investigating the spectra produced when matter interacts with or emits electromagnetic radiation.') },
  { id: 'p7sp02', dp: '7.1.5', t: 'con', q: 'Why could Rutherford’s model of the atom not explain line spectra?',
    a: OL(['Orbiting electrons are accelerating, so by Maxwell’s theory they should radiate. Falling inwards, they would pass through a continuous range of orbital frequencies and emit a <b>continuous</b> spectrum, not sharp lines.', 'Nothing would stop the radiation: electrons would lose energy and quickly spiral into the nucleus, so atoms could not be stable.']) },
  { id: 'p7sp03', dp: '7.1.5', t: 'rec', q: 'State Bohr’s three postulates.',
    a: OL(['Electrons exist in stable, circular orbits and do not emit radiation while in them.', 'Electrons absorb or emit specific quanta of energy (E = hf) when they move from one stable energy level to another.', 'An electron’s angular momentum is quantised: mvr = nh/2π, where n is the principal shell number (n = 1 is innermost).']) },
  { id: 'p7sp04', dp: '7.1.5', t: 'eq', q: 'How does the Bohr model explain the wavelengths in an emission spectrum?',
    a: P('An excited electron drops to a lower level and emits a photon carrying exactly the energy difference:') + E('ΔE = E_{i} − E_{f} = hf = ' + F('hc', 'λ')) + P('Only certain levels are allowed, so only certain energy gaps, and therefore only certain wavelengths, occur.'), v: 'p7hlev' },
  { id: 'p7sp05', dp: '7.1.4', t: 'con', q: 'What does an <b>emission spectrum</b> look like, and how is it produced?',
    a: P('Bright lines at a few discrete wavelengths on a dark background.') + L(['Energy (electrical or heat) is supplied to a hot, <b>low-pressure gas</b>.', 'Electrons absorb it and jump from the ground state to higher energy levels.', 'Falling back, they release photons with energies equal to the gaps between levels (conservation of energy), ΔE = hc/λ.']) + P('The composition of the gas determines the possible transitions and the relative brightness of each line.'), v: 'p7spectra' },
  { id: 'p7sp06', dp: '7.1.4', t: 'con', q: 'What does an <b>absorption spectrum</b> look like, and how is it produced?',
    a: P('A continuous spectrum crossed by dark lines.') + L(['A continuous spectrum passes through a cool, non-luminous gas.', 'The gas absorbs only photons whose energies match transitions from lower to higher levels.', 'The excited electrons re-emit these photons in <b>all directions</b>, so less of those wavelengths continues in the original direction: dark lines.']) + P('The dark lines are at exactly the same wavelengths as that gas’s emission lines.'), v: 'p7spectra' },
  { id: 'p7sp07', dp: '7.1.4', t: 'con', q: 'What produces a <b>continuous spectrum</b>, and what are its properties?',
    a: P('A hot solid, liquid or high-pressure gas, e.g. an incandescent filament or the dense interior of a star. These approximate a <b>black body</b>.') + L(['A continuous range of wavelengths, with intensity varying smoothly.', 'The peak wavelength decreases as temperature increases (Wien’s law, λ<sub>max</sub> = b/T).']) },
  { id: 'p7sp08', dp: '7.1.4', t: 'exam', q: 'Describe the difference between the spectra of light from a gas discharge tube and from an incandescent lamp.',
    a: L(['<b>Discharge tube</b> (hot, low-pressure gas): an emission line spectrum: a few bright, discrete coloured lines on a dark background, unique to the gas, because electrons in isolated atoms drop between fixed energy levels.', '<b>Incandescent lamp</b> (hot solid filament): a continuous spectrum: all colours from red to violet with no gaps, because the closely packed atoms in a hot solid emit a continuous range of energies (black-body radiation).']) },
  { id: 'p7sp09', dp: '7.1.4', t: 'prac', q: 'Practical: how did you examine spectra from discharge tubes, an incandescent filament and reflected sunlight, and what did you see?',
    a: L(['Equipment: a hand-held spectroscope (diffraction grating), gas discharge tubes (e.g. hydrogen, helium, neon) with a high-voltage supply, an incandescent globe, and sunlight reflected off a white surface.', 'Discharge tubes: bright emission lines, a different pattern for each gas (hydrogen shows red, blue-green and violet lines).', 'Incandescent filament: a continuous spectrum.', 'Reflected sunlight: a continuous spectrum crossed by faint dark (Fraunhofer) absorption lines.']) + N('Safety: never look directly at the Sun; the discharge tube supply is high voltage, and tubes get hot.') },
  { id: 'p7sp10', dp: '7.1.5', t: 'con', q: 'Outline the main parts of an astronomical spectrograph.',
    a: OL(['A narrow <b>slit</b>, so that light from a single object enters.', 'A <b>collimator</b> (lenses or mirrors) that makes the rays parallel.', 'A <b>dispersive element</b>, a prism or diffraction grating, that spreads the light into its wavelengths.', 'A <b>detector</b>: photographic plate, viewing telescope or, now, a CCD. A photometer measures the intensity at each wavelength to give a spectrogram (intensity vs wavelength); the whole set-up is a spectrophotometer.']) },
  { id: 'p7sp11', dp: '7.1.5', t: 'con', q: 'Compare a prism and a diffraction grating as the dispersive element of a spectroscope.',
    a: L(['A <b>prism</b> splits light by refraction: blue travels more slowly in glass than red, so it is refracted more (“blue bends best”). Glass is opaque to UV.', 'A <b>diffraction grating</b> has thousands of narrow lines; it splits light by interference (d sinθ = mλ), and reflection gratings also work for UV.']) },
  { id: 'p7sp12', dp: '7.1.5', t: 'con', q: 'How is spectroscopy used to identify elements?',
    a: P('Each element has a unique set of energy levels, so a unique set of emission and absorption lines: a spectral “fingerprint”. The wavelengths in an unknown spectrum are compared with laboratory spectra of known elements; every element whose lines are all present is in the sample.') + P('Helium was discovered this way in the Sun’s spectrum before it was found on Earth.') },
  { id: 'p7sp13', dp: '7.1.5', t: 'exam', q: 'Worksheet 9 Q1: which of the elements A, B, C and D are in the unknown sample?', vf: 'p7ws9',
    a: P('<b>B and C.</b> Every line of B and every line of C appears in the unknown spectrum, and together they account for all of its lines.') + P('A and D each have lines that are missing from the unknown, so they are not present.') },
  { id: 'p7sp14', dp: '7.1.5', t: 'exam', q: 'Worksheet 9 Q2: (a) What is the difference between an emission and an absorption spectrum? (b) Why are the dark lines of each absorption spectrum in exactly the same places as the bright lines of its emission spectrum?',
    a: P('a) An emission spectrum is bright lines on a dark background, from a hot low-pressure gas. An absorption spectrum is dark lines on a continuous background, from continuous light passing through a cool gas.') + P('b) Both come from the same transitions between the same energy levels. An element absorbs photons of exactly the energies (ΔE = hc/λ) that it emits when electrons fall between those levels.') },
  { id: 'p7sp15', dp: '7.1.5', t: 'calc', q: 'Worksheet 9 Q4(a): hydrogen has lines at 434 nm, 486 nm and 656 nm. Use the energy levels (n = 1 −13.59, n = 2 −3.40, n = 3 −1.51, n = 4 −0.85, n = 5 −0.54 eV) to identify the transitions.', vf: 'p7hlev',
    a: P('Find each photon energy, E = hc/λ, then match to a gap:') + E('656 nm: E = ' + F('6.626 × 10^{-34} × 3.00 × 10^{8}', '656 × 10^{-9} × 1.602 × 10^{-19}') + ' = 1.89 eV') + L(['1.89 eV = −1.51 − (−3.40): <b>n = 3 → 2</b>', '486 nm: 2.55 eV = −0.85 − (−3.40): <b>n = 4 → 2</b>', '434 nm: 2.86 eV = −0.54 − (−3.40): <b>n = 5 → 2</b>']) + P('All three end on n = 2: the visible Balmer series.') },
  { id: 'p7sp16', dp: '7.1.5', t: 'exam', q: 'Worksheet 9 Q4(b): students expected a hydrogen line at 122 nm. Why might they expect it, and why could they not see it?',
    a: P('The n = 2 → 1 transition releases 13.59 − 3.40 = 10.19 eV, so') + E('λ = ' + F('hc', 'E') + ' = ' + F('1.988 × 10^{-25}', '10.19 × 1.602 × 10^{-19}') + ' = 1.22 × 10^{-7} m = 122 nm') + P('This line is real (Lyman series), but 122 nm is <b>ultraviolet</b>, outside the visible range (400–750 nm), so it cannot be seen by eye. (It is also absorbed by glass and air.)') },
  { id: 'p7sp17', dp: '7.1.5', t: 'calc', q: 'HSC 2020 Q21 (5 marks): (a) calculate the wavelength emitted when an electron moves from level 3 to 2 in a Bohr hydrogen atom; (b) describe electron behaviour in the Bohr model with reference to conservation of energy.',
    a: E('a) ' + F('1', 'λ') + ' = R' + '(' + F('1', '2^{2}') + ' − ' + F('1', '3^{2}') + ') = 1.097 × 10^{7} × 0.1389') + E('λ = 6.56 × 10^{-7} m (656 nm, red)') + P('b) Electrons occupy stable orbits with fixed energies and do not radiate there. To move up, an electron must absorb exactly the energy difference (a photon with hf = ΔE, or a collision). Moving down, it emits a photon with energy exactly equal to the difference, so total energy is conserved.') }
] });

DECKS.push({ id: 'phys-m7-st', fa: 'fa1', title: 'Information from stellar spectra', dps: ['7.1.6'], cards: [
  { id: 'p7st01', dp: '7.1.6', t: 'con', q: 'Why do stars produce absorption spectra?',
    a: P('The hot, dense interior of a star behaves approximately like a black body and emits a continuous spectrum. The cooler, less dense outer layers (the stellar atmosphere) absorb particular wavelengths and re-emit them in all directions, leaving dark lines at those wavelengths.') + E('ΔE = E_{f} − E_{i} = ' + F('hc', 'λ')) },
  { id: 'p7st02', dp: '7.1.6', t: 'con', q: 'How does a star’s spectrum reveal its chemical composition?',
    a: P('Each element (or ion, or molecule) absorbs at its own unique set of wavelengths. Comparing the star’s absorption lines (Fraunhofer lines in the Sun) with laboratory spectra of known elements shows which are present in the star’s outer layers.') + P('The relative darkness of lines indicates relative amounts. This is how we know stars are mostly hydrogen and helium.') },
  { id: 'p7st03', dp: '7.1.6', t: 'con', q: 'How do spectra give a star’s surface temperature?',
    a: OL(['<b>Peak wavelength</b>: measure λ<sub>max</sub> of the continuous spectrum with a spectrophotometer and use Wien’s law, T = b/λ<sub>max</sub>. Hotter stars peak at shorter wavelengths and look bluer.', '<b>Absorption lines</b>: higher temperatures break molecules into atoms and atoms into ions, so the lines present (molecules, neutral atoms, ions) indicate temperature. This is the basis of spectral classes O B A F G K M.']), v: 'p7class' },
  { id: 'p7st04', dp: '7.1.6', t: 'calc', q: 'A stellar spectrogram has its peak intensity at 4580 Å. Estimate the star’s surface temperature.',
    a: E('λ_{max} = 4580 Å = 4.58 × 10^{-7} m') + E('T = ' + F('b', 'λ_{max}') + ' = ' + F('2.898 × 10^{-3}', '4.58 × 10^{-7}') + ' = 6.3 × 10^{3} K') + P('The dips in the curve are absorption lines; ignore them when finding the peak. 1 Å = 10<sup>−10</sup> m.') },
  { id: 'p7st05', dp: '7.1.6', t: 'rec', q: 'List the stellar spectral classes in order with their colours and temperatures.',
    a: P('From hottest to coolest: <b>O B A F G K M</b> (“Oh Be A Fine Gorilla, Kiss Me”). Each class has 10 subclasses, e.g. B0–B9.'), v: 'p7class' },
  { id: 'p7st06', dp: '7.1.6', t: 'def', q: 'What is the <b>Doppler effect</b>?',
    a: P('The apparent change in the wavelength (and frequency) of a wave when there is relative motion between the source and the observer.') + P('An approaching ambulance sounds higher pitched (shorter wavelength, higher frequency); once it passes and recedes, it sounds lower.') },
  { id: 'p7st07', dp: '7.1.6', t: 'con', q: 'What are red shift and blue shift in a star’s spectrum?',
    a: L(['<b>Red shift</b>: the star is moving away, so every spectral line shifts to a longer wavelength (towards the red end).', '<b>Blue shift</b>: the star is moving closer, so every line shifts to a shorter wavelength.']) + P('The star itself does not look red or blue. The pattern of lines is unchanged, so the element can still be identified, and the size of the shift gives the speed.'), v: 'p7dopp' },
  { id: 'p7st08', dp: '7.1.6', t: 'eq', q: 'How do you use the Doppler formula f′ = f (v_{wave} ± v_{observer})/(v_{wave} ∓ v_{source})?',
    a: L(['Enter <b>speeds</b> (positive values) in m s<sup>−1</sup>; the ± signs handle direction.', 'Moving <b>towards</b> each other must give a <b>higher</b> f′: use + on top for an approaching observer, − on the bottom for an approaching source.', 'Moving <b>apart</b> must give a lower f′: − on top, + on the bottom.']) + N('This is not the form printed on the data sheet; think about whether f′ should go up or down.') },
  { id: 'p7st09', dp: '7.1.6', t: 'eq', q: 'What is the approximate relationship between the Doppler shift of a star’s spectral line and its speed?',
    a: E(F('Δλ', 'λ_{0}') + ' = ' + F('v', 'c')) + P('λ<sub>0</sub> is the wavelength at the source (laboratory value), Δλ the observed change and v the radial velocity. v is positive for receding objects (red shift) and negative for approaching ones.') + N('Valid for v much less than c.') },
  { id: 'p7st10', dp: '7.1.6', t: 'calc', q: 'Worksheet 9 Q6(a): the H-alpha line (656 nm) of Barnard’s star is blue-shifted by 0.24 nm. Estimate its radial speed to two significant figures.',
    a: E('v = c × ' + F('Δλ', 'λ_{0}') + ' = 3.00 × 10^{8} × ' + F('0.24', '656')) + E('v = 1.1 × 10^{5} m s^{-1} (110 km s^{-1}) towards Earth') },
  { id: 'p7st11', dp: '7.1.6', t: 'exam', q: 'Worksheet 9 Q6(b)–(c): explain the meaning and significance of “blue shift”. The star’s actual speed is 143 km s^{-1}, more than its radial speed. Explain the difference.',
    a: P('b) Blue shift is the decrease in observed wavelength of spectral lines because the source is approaching. Its significance: it tells us the star is moving towards Earth and allows the radial speed to be calculated.') + P('c) The Doppler shift only measures the <b>radial</b> component of velocity, along the line of sight. The star also has a <b>transverse</b> component, perpendicular to the line of sight, which causes no shift. Combined, they give the larger actual speed.') },
  { id: 'p7st12', dp: '7.1.6', t: 'con', q: 'How is a star’s translational velocity found?',
    a: L(['The <b>radial</b> component (towards or away from us) comes from the Doppler shift of its spectral lines.', 'The <b>transverse</b> component (across our line of sight) cannot be found from the spectrum; it is found by measuring changes in the star’s position relative to distant objects over long periods.']) },
  { id: 'p7st13', dp: '7.1.6', t: 'con', q: 'Worksheet 9 Q5: how do spectra give a star’s rotational velocity?',
    a: P('As a star rotates, one edge moves away from us and the other towards us. Light from the receding side is red-shifted and light from the approaching side blue-shifted, so each spectral line is a mix of shifted light and is <b>broadened</b>.') + P('The faster the rotation, the broader the lines, so measuring this Doppler broadening gives the rotational velocity.') + P('In a binary system, the lines of the two stars shift back and forth in opposite directions; tracking this gives the orbital period and speeds.') },
  { id: 'p7st14', dp: '7.1.6', t: 'con', q: 'How do spectra give information about the density of a star’s atmosphere?',
    a: P('In a denser atmosphere, the higher gas pressure causes more frequent collisions between atoms while they absorb and emit. These collisions slightly change the energy levels, so each line is <b>broadened</b> (pressure broadening).') + L(['Main-sequence (dwarf) star: dense outer layers, broad lines.', 'Giant or supergiant: very low-density outer layers, narrow lines.']) + P('So for the same spectral class, narrower lines indicate a larger, more luminous star.') },
  { id: 'p7st15', dp: '7.1.6', t: 'exam', q: 'Worksheet 9 Q7 (4 marks): a spectral line from a star is much broader than the same line from a laboratory. Outline two mechanisms that could cause this.',
    a: OL(['<b>Rotation</b>: light from the side of the star rotating away is red-shifted and light from the side rotating towards us is blue-shifted, so the line is spread over a range of wavelengths (Doppler broadening).', '<b>High density/pressure</b>: frequent collisions between atoms in a dense stellar atmosphere disturb the energy levels, broadening the line (pressure broadening).']) + N('High temperature also broadens lines, because faster random motion of atoms gives a range of Doppler shifts.') },
  { id: 'p7st16', dp: '7.1.6', t: 'exam', q: 'NESA 2016 (4 marks): describe how the spectrum of a star can be used to determine its chemical composition and surface temperature.',
    a: P('<b>Composition</b>: the star’s continuous spectrum passes through its cooler atmosphere, which absorbs photons with energies matching electron transitions. The resulting dark lines are compared with laboratory spectra of elements; matching patterns identify the elements present.') + P('<b>Temperature</b>: the wavelength of peak intensity of the continuous (black-body) spectrum is measured, and Wien’s law, T = b/λ<sub>max</sub>, gives the surface temperature. The lines present (e.g. ionised helium vs molecules) also indicate the spectral class and so the temperature.') },
  { id: 'p7st17', dp: '7.1.6', t: 'exam', q: 'HSC 2019 Q22 (3 marks): spectra can show chemical composition and surface temperature. Describe how spectra give information about OTHER features of stars.',
    a: L(['<b>Translational (radial) velocity</b>: a Doppler red or blue shift of all lines shows motion away from or towards Earth; Δλ/λ = v/c gives the speed.', '<b>Rotational velocity</b>: rotation broadens each line, because opposite edges are red- and blue-shifted.', '<b>Density</b>: a denser atmosphere causes more collisions, broadening the lines; narrow lines indicate a low-density giant star.']) }
] });


/* ================= 7.2 LIGHT: WAVE MODEL ================= */
DECKS.push({ id: 'phys-m7-nh', fa: 'fa2', title: 'Newton vs Huygens', dps: ['7.2.3'], cards: [
  { id: 'p7nh01', dp: '7.2.3', t: 'con', q: 'What was Newton’s <b>corpuscular</b> (particle) theory of light?',
    a: P('Light is a stream of tiny, fast particles (“corpuscles”) that travel in straight lines. Newton used it in his book <i>Opticks</i> (1704) to explain reflection, refraction and dispersion.') + P('Because Newton was so highly respected, his theory was widely accepted for over a century.') },
  { id: 'p7nh02', dp: '7.2.3', t: 'con', q: 'What was Huygens’ wave theory, and what is <b>Huygens’ principle</b>?',
    a: P('Christiaan Huygens (Dutch) proposed that light is a wave, like water waves.') + P('<b>Huygens’ principle</b>: every point on a wavefront acts as a source of circular wavelets that spread forward at the speed of the wave. The new wavefront is the line tangent to all the wavelets.') + P('He also argued that if light were particles, crossing beams would collide and scatter, which does not happen.') },
  { id: 'p7nh03', dp: '7.2.3', t: 'con', q: 'What criteria can be used to compare competing scientific models (following Thomas Kuhn)?',
    a: L(['<b>Accuracy</b>: do observations match the model’s predictions?', '<b>Simplicity</b>: is the model simple, or do some explanations become complicated (e.g. Newton’s explanation of diffraction)?', '<b>Explanatory power</b>: how much does the model explain, and are there contradictions?']) },
  { id: 'p7nh04', dp: '7.2.3', t: 'con', q: 'How did each model explain rectilinear propagation (light travelling in straight lines) and travel through space?',
    a: L(['<b>Newton</b>: very fast, very light particles travel in straight lines, barely affected by gravity, giving sharp shadows and beams. Particles also need no medium, so light can cross empty space.', '<b>Huygens</b>: wavelets from every point on a wavefront build a new wavefront, so the wave travels straight on. But waves were thought to need a medium, so an “aether” had to be invented.']) },
  { id: 'p7nh05', dp: '7.2.3', t: 'con', q: 'How did each model explain reflection?',
    a: L(['<b>Newton</b>: particles bounce off a surface like balls off a wall, obeying the law of reflection.', '<b>Huygens</b>: wavelets from points along the surface construct a reflected wavefront obeying the same law.']) + P('Both models explain reflection, so it cannot decide between them.') },
  { id: 'p7nh06', dp: '7.2.3', t: 'con', q: 'How did each model explain refraction, and what prediction distinguished them?',
    a: L(['<b>Newton</b>: particles are attracted towards the denser medium as they enter it, so they speed up and bend towards the normal. This predicts light is <b>faster in water</b> than in air.', '<b>Huygens</b>: the part of the wavefront that enters the denser medium first slows down, so the wavefront turns. This predicts light is <b>slower in water</b>.']) + P('Foucault (1850) showed light is slower in water, supporting Huygens.') },
  { id: 'p7nh07', dp: '7.2.3', t: 'con', q: 'How did each model explain partial reflection and refraction (e.g. at a glass surface)?',
    a: L(['<b>Newton</b>: his “theory of fits”: particles arrive in alternating fits of easy reflection and easy refraction. But how does a particle “know” which to do? Newton admitted this was insufficient: weak support for particles.', '<b>Huygens</b>: waves naturally partly reflect and partly transmit at a boundary: support for waves.']) },
  { id: 'p7nh08', dp: '7.2.3', t: 'con', q: 'How did each model explain dispersion by a prism?',
    a: L(['<b>Newton</b>: violet particles have less mass than red ones, so the same attraction to the glass bends them more.', '<b>Huygens</b>: different wavelengths travel at different speeds in glass, so they refract by different amounts (violet the most: “blue bends best”).']) + P('Both could explain dispersion.') },
  { id: 'p7nh09', dp: '7.2.3', t: 'con', q: 'How did diffraction and interference count as evidence between the models?',
    a: L(['<b>Newton</b> had no adequate explanation for diffraction. He tried collisions with the edges of slits, but this gave no testable predictions; particles should not bend around corners.', '<b>Huygens</b> predicted diffraction: blocked wavelets let the wavefront curve round edges. It is hard to see because light’s wavelength is so small.', 'Young’s double slit (1801) showed interference, with the brightest fringe directly behind the barrier between the slits. Particles cannot explain this; waves can.']) },
  { id: 'p7nh10', dp: '7.2.3', t: 'con', q: 'How did polarisation count as evidence between the models?',
    a: L(['<b>Particles</b> could only pass through a polariser if they fitted the gaps, so each particle should either pass or be blocked completely. The smoothly varying intensity seen through two polarisers (Malus’ law) was never explained: strong evidence against the particle model.', '<b>Transverse waves</b> oscillating in many directions can have just one direction (component) of oscillation transmitted, giving reduced intensity, I = I<sub>max</sub>cos²θ.']) },
  { id: 'p7nh11', dp: '7.2.3', t: 'con', q: 'What is <b>Poisson’s (Arago’s) spot</b> and why was it important?',
    a: P('In 1818 Fresnel entered his wave theory of diffraction in a French Academy competition. Poisson, a supporter of Newton, pointed out that it predicted an “absurd” result: a bright spot at the centre of the shadow of a small round obstacle.') + P('Arago did the experiment and found the spot. A surprising prediction confirmed by experiment was strong support for the wave model.') },
  { id: 'p7nh12', dp: '7.2.3', t: 'con', q: 'What did Foucault’s 1850 measurement of light in air and water show?',
    a: P('Using a rotating mirror with a tube of water in the light path, Foucault showed light travels <b>more slowly in water than in air</b> (just ahead of Fizeau, who found the same).') + P('Newton’s particle model predicted the opposite, so this was decisive evidence for the wave model, until the photoelectric effect raised new questions.') },
  { id: 'p7nh13', dp: '7.2.3', t: 'rec', q: 'Summarise how Newton’s and Huygens’ models explained the properties of light.',
    a: P('Both explained straight-line travel, reflection and dispersion. Only waves explained diffraction, interference, polarisation and the slower speed in water.'), v: 'p7nh' },
  { id: 'p7nh14', dp: '7.2.3', t: 'con', q: 'Why was Newton’s particle model accepted for so long despite the wave model?',
    a: L(['Newton’s great reputation and large following.', 'Diffraction of light is very hard to observe, because its wavelength is tiny compared with everyday gaps.', 'Particles explained travel through empty space, while waves seemed to need an undetected medium.', 'Decisive evidence (Young 1801, Arago 1818, Foucault 1850) came only long after both men had died.']) },
  { id: 'p7nh15', dp: '7.2.3', t: 'exam', q: 'Long response (8 marks): explain how theories in science are validated, using classical physics examples related to light.',
    a: L(['Theories are validated when their predictions are tested by experiment and give consistent, reproducible results; theories that fail are modified or replaced.', 'Newton’s particle and Huygens’ wave theories both explained reflection and refraction, so further tests were needed.', 'Young’s double slit showed interference, explained only by waves.', 'Fresnel’s wave theory predicted Poisson’s spot, confirmed by Arago.', 'Foucault showed light slows in water, as waves predicted and particles did not.', 'Polarisation and Malus’ law supported transverse waves.', 'Maxwell predicted EM waves at c; Hertz confirmed them, validating the EM wave model.', 'Later, the photoelectric effect could not be explained by waves, so the model had to change again: theories remain open to revision.']) }
] });

DECKS.push({ id: 'phys-m7-di', fa: 'fa2', title: 'Diffraction and interference', dps: ['7.2.1', '7.2.2'], cards: [
  { id: 'p7di01', dp: '7.2.1', t: 'def', q: 'What is <b>diffraction</b>?',
    a: P('The spreading of waves as they pass through a small opening or bend around a small obstacle.') },
  { id: 'p7di02', dp: '7.2.1', t: 'con', q: 'Use Huygens’ principle to explain diffraction.',
    a: P('Every point on a wavefront is a source of wavelets. Normally all the wavelets together build a straight new wavefront. A barrier blocks some of the point sources, so at the edges of the gap there are no neighbouring wavelets to cancel the sideways spread, and the wavefront curves outward.') + P('Wavelets from different points in the gap then interfere, giving bright and dark regions.') },
  { id: 'p7di03', dp: '7.2.1', t: 'con', q: 'When is diffraction significant, and why is it hard to see with light?',
    a: P('Diffraction is significant when the gap or obstacle is similar to or smaller than the wavelength. The larger λ/w, the more spreading; longer wavelengths diffract more.') + P('Visible light has λ ≈ 400–750 nm, so it needs extremely narrow slits, while ocean waves diffract easily around harbour walls.') + N('Explaining single-slit diffraction patterns is outside the HSC course.') },
  { id: 'p7di04', dp: '7.2.2', t: 'con', q: 'Describe Young’s double slit experiment (1801).',
    a: L(['Sunlight passed through a single pinhole to make it <b>coherent</b>, then through two narrow slits close together.', 'Each slit diffracted the light, and the two waves overlapped and interfered.', 'The screen showed many evenly spaced bright and dark bands (fringes), not just two bright lines.']) + P('Interference is a wave property, so this supported the wave model. Today a monochromatic laser is used, because white light gives blurred, coloured fringes.') },
  { id: 'p7di05', dp: '7.2.2', t: 'def', q: 'Define <b>coherent</b>, and state the conditions for constructive and destructive interference.',
    a: P('Coherent waves have the same frequency and a constant phase relationship (“doing the same thing at the same time”).') + P('By the principle of superposition, amplitudes add:') + L(['<b>Constructive</b>: waves meet in phase (crest with crest): path difference = mλ, i.e. 0, λ, 2λ…', '<b>Destructive</b>: waves meet exactly out of phase (crest with trough): path difference = (m + ½)λ, i.e. λ/2, 3λ/2…']) },
  { id: 'p7di06', dp: '7.2.2', t: 'eq', q: 'What is the equation for bright fringes from a double slit or diffraction grating? Define each symbol.',
    a: E('d sinθ = mλ') + L(['d = distance between the centres of the slits (m)', 'θ = angle from the central line to the bright fringe', 'λ = wavelength (m)', 'm = order: 0, ±1, ±2…']) + P('For dark fringes: d sinθ = (m + ½)λ (not on the data sheet).') + N('Convert nm and mm to metres.'), v: 'p7dslit' },
  { id: 'p7di07', dp: '7.2.2', t: 'eq', q: 'Worksheet 4 Q4: show that the fringe spacing is Δx = λL/d for small angles.',
    a: P('The m-th bright fringe is a distance x<sub>m</sub> from the centre of a screen a distance L away. For small θ, sinθ ≈ tanθ = x<sub>m</sub>/L, so') + E('d ' + F('x_{m}', 'L') + ' = mλ → x_{m} = ' + F('mλL', 'd')) + P('Neighbouring fringes (m and m + 1) are therefore separated by') + E('Δx = ' + F('λL', 'd')), v: 'p7dslit' },
  { id: 'p7di08', dp: '7.2.2', t: 'con', q: 'How do λ, d and L affect a double-slit pattern?',
    a: L(['Larger λ: fringes further apart (red more than blue).', 'Smaller slit separation d: fringes further apart (larger θ for each order).', 'Larger screen distance L: fringes further apart.']) + P('Brightness falls off on either side of the central fringe. For a grating, many slits give much sharper, brighter maxima at the same angles.') },
  { id: 'p7di09', dp: '7.2.2', t: 'calc', q: 'Light of wavelength 633 nm passes through two slits 0.0100 mm apart. What is the maximum order of bright fringe, and how many bright fringes could there be?',
    a: P('The largest possible angle is 90°, where sinθ = 1:') + E('m = ' + F('d sinθ', 'λ') + ' = ' + F('0.0100 × 10^{-3} × 1', '633 × 10^{-9}') + ' = 15.8') + P('So the highest order is <b>m = 15</b> (there is no part of a fringe). Counting orders −15 to +15 including the central fringe gives 2 × 15 + 1 = <b>31</b> bright fringes, the outermost very faint.') + N('The booklet says 29 here; 31 follows from its own value of m = 15.') },
  { id: 'p7di10', dp: '7.2.2', t: 'calc', q: 'Worksheet 4 Q1–Q2: find (a) the first-order angle for 450 nm light on slits 0.0500 mm apart, (b) the third-order angle for 580 nm light on slits 0.100 mm apart.',
    a: E('a) sinθ = ' + F('mλ', 'd') + ' = ' + F('1 × 450 × 10^{-9}', '5.00 × 10^{-5}') + ' = 0.00900 → θ = 0.516°') + E('b) sinθ = ' + F('3 × 580 × 10^{-9}', '1.00 × 10^{-4}') + ' = 0.0174 → θ = 0.997°') },
  { id: 'p7di11', dp: '7.2.2', t: 'calc', q: 'Worksheet 4 Q3: what is the slit separation for which 610 nm orange light has its first maximum at 30.0°?',
    a: E('d = ' + F('mλ', 'sinθ') + ' = ' + F('1 × 610 × 10^{-9}', 'sin30.0°') + ' = 1.22 × 10^{-6} m') },
  { id: 'p7di12', dp: '7.2.2', t: 'calc', q: 'Worksheet 4 Q5: with L = 2.2 m, lasers of 477, 488, 514, 530, 593 and 630 nm gave fringe spacings of 4.6, 4.7, 5.2, 5.3, 6.0 and 6.5 mm. Use a graph to find the slit spacing.',
    a: P('Convert to metres and plot fringe spacing Δx (y) against λ (x). Since Δx = (L/d)λ, the graph should be a straight line through the origin with gradient L/d.') + E('gradient ≈ ' + F('6.5 × 10^{-3}', '630 × 10^{-9}') + ' ≈ 1.0 × 10^{4}') + E('d = ' + F('L', 'gradient') + ' = ' + F('2.2', '1.0 × 10^{4}') + ' ≈ 2.2 × 10^{-4} m (0.22 mm)') + N('Start the λ axis at 0 so the points are not bunched. A best-fit line not forced through the origin is steeper (about 1.2 × 10⁴), giving d ≈ 1.8 × 10⁻⁴ m.') },
  { id: 'p7di13', dp: '7.2.2', t: 'exam', q: 'Worksheet 4 Q5(c): the experiment is repeated with the space between slits and screen filled with a transparent liquid of different refractive index. What changes would you expect?',
    a: P('Light slows in the liquid (v = c/n) while its frequency is unchanged, so its wavelength decreases: λ<sub>liquid</sub> = λ/n.') + P('Since Δx = λL/d, the fringes would be <b>closer together</b> by a factor of n (for n > 1). They might also be dimmer if the liquid absorbs some light.') },
  { id: 'p7di14', dp: '7.2.2', t: 'calc', q: 'Worksheet 4 Q6: in an interferometer, a movable mirror is shifted from constructive to destructive interference. (a) How does this measure λ? (b) Light of 4.6 × 10^{14} Hz needs a 0.15 μm shift. Find the speed of light.',
    a: P('a) Moving the mirror by s changes the path length of that beam by 2s (there and back). Going from constructive to the next destructive interference means the path difference changed by λ/2, so 2s = λ/2 and λ = 4s.') + E('b) λ = 4 × 0.15 × 10^{-6} = 6.0 × 10^{-7} m') + E('c = fλ = 4.6 × 10^{14} × 6.0 × 10^{-7} = 2.8 × 10^{8} m s^{-1}') },
  { id: 'p7di15', dp: '7.2.2', t: 'exam', q: 'A double-slit apparatus lets you vary the slit-to-screen distance y and the slit separation d. Explain two ways to keep the distance between two maxima constant when the wavelength is reduced.',
    a: P('Fringe spacing is Δx = λy/d. Reducing λ makes the fringes closer, so compensate by:') + OL(['<b>Increasing y</b>, moving the screen further away in proportion to the decrease in λ.', '<b>Decreasing d</b>, moving the slits closer together in proportion.']) },
  { id: 'p7di16', dp: '7.2.2', t: 'con', q: 'What is a diffraction grating, and how does its pattern compare with a double slit’s?',
    a: P('A plate with thousands of equally spaced parallel slits (lines). d is the spacing between lines: for N lines per metre, d = 1/N.') + P('The bright maxima occur at the same angles as for a double slit, d sinθ = mλ, but are much sharper and brighter, with very dark regions between. This makes wavelengths easy to measure, so gratings are used in spectroscopes.') },
  { id: 'p7di17', dp: '7.2.2', t: 'prac', q: 'Practical: how can you determine the wavelength of a laser using a diffraction grating or double slit?',
    a: L(['Shine the laser through the grating onto a screen; measure L (grating to screen) with a metre rule.', 'Measure the distance x from the central maximum to each order on both sides, and find θ (tanθ = x/L).', 'Repeat for several orders or screen distances, and plot d sinθ against m: the gradient is λ.', 'Compare with the stated wavelength (percentage difference).']) + P('Validity: keep the screen perpendicular and d known. Reliability: repeat and average. Accuracy: measuring across several fringes reduces percentage error. Safety: never look into the laser beam.') }
] });

DECKS.push({ id: 'phys-m7-po', fa: 'fa2', title: 'Polarisation and Malus’ law', dps: ['7.2.4'], cards: [
  { id: 'p7po01', dp: '7.2.4', t: 'def', q: 'What is <b>polarisation</b>, and how is the direction of polarisation of an EM wave defined?',
    a: P('Polarisation is the attribute that a wave’s oscillations have a definite direction relative to its direction of travel. Only transverse waves can be polarised.') + P('For an EM wave, the direction of polarisation is the direction of the <b>electric field</b>.') },
  { id: 'p7po02', dp: '7.2.4', t: 'con', q: 'What is unpolarised light, and how does a polarising filter work?',
    a: P('Unpolarised light (e.g. from the Sun) consists of many waves with all possible directions of polarisation.') + P('A Polaroid filter (invented by Edwin Land) contains long aligned molecules. It passes only the component of the electric field parallel to its <b>transmission axis</b>, like a vertical slit letting through only vertical waves on a rope.') },
  { id: 'p7po03', dp: '7.2.4', t: 'con', q: 'Unpolarised light passes through two polarising filters. What happens as the second filter is rotated?',
    a: L(['The first filter polarises the light and <b>halves</b> its intensity.', 'Axes parallel: all of the polarised light passes the second filter.', 'As the second filter rotates, only the component parallel to its axis passes, so the intensity falls.', 'Axes perpendicular (crossed): <b>no light</b> passes.']) },
  { id: 'p7po04', dp: '7.2.4', t: 'eq', q: 'State Malus’ law and explain where the cos² comes from.',
    a: E('I = I_{max}cos^{2}θ') + L(['I<sub>max</sub> = intensity of the polarised light reaching the filter', 'I = intensity transmitted', 'θ = angle between the light’s direction of polarisation and the filter’s transmission axis']) + P('The filter passes the component E cosθ of the electric field amplitude. Intensity is proportional to amplitude squared, so I ∝ E²cos²θ.') + N('If the light starts unpolarised, the first filter halves it before Malus’ law applies. On a calculator enter (cosθ)².'), v: 'p7malus' },
  { id: 'p7po05', dp: '7.2.4', t: 'calc', q: 'HSC 2019 Q10: light passes through two polarisers whose axes are 30° apart. What is I_{2}/I_{1} (after/before the second polariser), and which model of light does this demonstrate?',
    a: E(F('I_{2}', 'I_{1}') + ' = cos^{2}30° = 0.75') + P('Polarisation shows light is a <b>transverse wave</b>, so this demonstrates the <b>wave model</b>.') },
  { id: 'p7po06', dp: '7.2.4', t: 'exam', q: 'Worksheet 5 Q2(a): students measure the intensity leaving an analysing polariser at different angles to the first polariser. Identify the independent and dependent variables and one controlled variable.',
    a: L(['Independent: the angle θ between the analyser and polariser axes.', 'Dependent: the intensity I of the light leaving the analyser.', 'Controlled: the intensity of the unpolarised source (also its distance from the sensor, background light, the same sensor).']) },
  { id: 'p7po07', dp: '7.2.4', t: 'exam', q: 'Worksheet 5 Q2(b)–(c): the data are 0° 99.5, 10° 97.0, 20° 88.4, 30° 72.0, 40° 61.0, 50° 38.0, 60° 27.0, 70° 11.0, 80° 3.0, 90° 0.05. Plot √I against cosθ and explain how the trend line supports Malus’ law.',
    a: P('Calculate cosθ and √I for each angle (e.g. 30°: cosθ = 0.866, √I = 8.49) and plot.') + P('The points lie close to a <b>straight line through the origin</b>, gradient ≈ 9.9 ≈ √99.5. Malus’ law, I = I<sub>max</sub>cos²θ, gives √I = √I<sub>max</sub> cosθ (y = mx), so a straight line through the origin is exactly what the law predicts.'), v: 'p7malus2' },
  { id: 'p7po08', dp: '7.2.4', t: 'exam', q: 'Worksheet 5 Q3 (NESA sample): a phone has a light sensor (with a polariser fixed over it) and an angle sensor; a computer screen emits polarised light. Describe a procedure to investigate Malus’ law.',
    a: OL(['In a darkened room, place the phone flat on the screen showing a uniform white image, with the screen brightness fixed.', 'Rotate the phone until the light reading is a maximum; record this as I<sub>max</sub> and set this as θ = 0°.', 'Rotate the phone in 10° steps to 90° (or 180°), using the angle sensor, recording the intensity each time.', 'Repeat the whole set three times and average.', 'Plot I against cos²θ; a straight line through the origin with gradient I<sub>max</sub> confirms Malus’ law.']) },
  { id: 'p7po09', dp: '7.2.4', t: 'con', q: 'Evaluate the significance of polarisation in developing a model of light.',
    a: L(['Only <b>transverse</b> waves can be polarised, so polarisation showed light is a transverse wave, not a longitudinal one like sound.', 'Malus’ law (a smoothly varying intensity) follows naturally from the wave model: the filter passes a component E cosθ of the field.', 'The particle model could not explain why some, but not all, of the light passes; particles should pass or be blocked.', 'It fitted perfectly with Maxwell’s EM waves, whose E and B fields are perpendicular to the direction of travel.']) }
] });


/* ================= 7.3 LIGHT: QUANTUM MODEL ================= */
DECKS.push({ id: 'phys-m7-bb', fa: 'fa3', title: 'Black body radiation and Planck', dps: ['7.3.1'], cards: [
  { id: 'p7bb01', dp: '7.3.1', t: 'def', q: 'What is a <b>black body</b>?',
    a: P('An imaginary object that perfectly absorbs all radiation falling on it, at all wavelengths, and is also a perfect emitter.') + P('The radiation it emits depends only on its <b>temperature</b>, not on what it is made of. Stars and hot filaments are good approximations.') },
  { id: 'p7bb02', dp: '7.3.1', t: 'con', q: 'How can a black body be modelled in the laboratory?',
    a: P('A cavity (e.g. a furnace) with a very small hole. Radiation entering the hole bounces around inside until it is absorbed by the walls, so the hole absorbs everything, like a perfect black body.') + P('The walls absorb and re-emit until equilibrium is reached, so the radiation leaving the hole depends only on the cavity’s temperature. A spectrometer measures its intensity at each wavelength.') },
  { id: 'p7bb03', dp: '7.3.1', t: 'con', q: 'Describe the experimental black body radiation curves.',
    a: L(['Radiation is emitted over a continuous range of wavelengths.', 'Each curve rises to a <b>definite peak</b> and then falls towards zero at short wavelengths.', 'As temperature increases, the peak moves to <b>shorter</b> wavelengths (λ<sub>max</sub> = b/T) and the curve is higher at every wavelength.', 'The area under the curve (total energy emitted) increases rapidly with temperature.']) + P('A heated object glows red, then yellow, then blue-white as it gets hotter.'), v: 'p7bb' },
  { id: 'p7bb04', dp: '7.3.1', t: 'con', q: 'What was the <b>ultraviolet catastrophe</b>?',
    a: P('Classical wave theory (thermodynamics plus Maxwell) predicted that the intensity of black body radiation would keep increasing as the wavelength decreased, without limit, towards the ultraviolet.') + P('This would mean infinite energy emitted, violating conservation of energy, and it disagreed with experiment, where the curve has a peak and falls to zero. Classical physics could not explain the shape of the curve.'), v: 'p7bb' },
  { id: 'p7bb05', dp: '7.3.1', t: 'con', q: 'What was Planck’s hypothesis (1900), and how did it solve the black body problem?',
    a: L(['The atoms in the cavity walls behave like oscillators (tiny antennas) emitting and absorbing radiation.', 'Their energy is <b>quantised</b>: it can only change in whole-number multiples of a small packet, a <b>quantum</b>, E = hf (so 1, 2, 200 quanta, but not 1.5).', 'High-frequency quanta need a lot of energy, so they are rarely emitted. This cuts off the short-wavelength end and gives the observed peak.']) + P('His equation matched the experimental curves at all wavelengths.') },
  { id: 'p7bb06', dp: '7.3.1', t: 'eq', q: 'Give Planck’s equation for the energy of a quantum (photon) in terms of frequency and wavelength.',
    a: E('E = hf = ' + F('hc', 'λ')) + L(['h = Planck’s constant = 6.626 × 10^{-34} J s', 'f = frequency (Hz), λ = wavelength (m), c = 3.00 × 10^{8} m s^{-1}']) },
  { id: 'p7bb07', dp: '7.3.1', t: 'con', q: 'How did Planck regard his own idea, and why don’t we notice quantised energy in everyday life?',
    a: P('Planck thought quantisation was a mathematical trick (a “fudge”) that happened to fit the data, and expected a better classical explanation to appear. He did not suggest light itself was made of particles.') + P('h is tiny (6.626 × 10<sup>−34</sup> J s), so each quantum is far too small to notice on everyday scales; energy appears continuous.') },
  { id: 'p7bb08', dp: '7.3.1', t: 'con', q: 'Contrast the classical and quantum views of energy using an analogy.',
    a: L(['<b>Classical</b>: energy is continuous and can be emitted in any amount, like a smooth slide, or like adding water drop by drop to a balance.', '<b>Quantum</b>: energy is exchanged only in discrete packets (quanta), like the rungs of a ladder, or like adding whole bricks.']) + P('Classical physics works for large objects at speeds much less than c; quantum theory is needed at the atomic scale.') },
  { id: 'p7bb09', dp: '7.3.1', t: 'def', q: 'What is an <b>electron volt</b>? Convert between eV and joules.',
    a: P('The energy given to an electron when it is accelerated through a potential difference of 1 V:') + E('W = qV = 1.602 × 10^{-19} × 1 → 1 eV = 1.602 × 10^{-19} J') + L(['eV → J: multiply by 1.602 × 10^{-19}', 'J → eV: divide by 1.602 × 10^{-19}']) },
  { id: 'p7bb10', dp: '7.3.1', t: 'calc', q: 'Worksheet 6 Q4: complete the table: a) 250 eV, b) 3.2 × 10^{3} eV, c) 8 × 10^{12} eV, d) 1 J, e) 4.0 × 10^{-14} J, f) 4.8 × 10^{-8} J.',
    a: P('Missing values in bold:'), v: 'p7ws6' },
  { id: 'p7bb11', dp: '7.3.1', t: 'calc', q: 'Worksheet 6 Q5–Q6: (a) calculate the energy of a 600 nm photon; (b) a photon has 250 eV of energy. Find its wavelength.',
    a: E('a) E = ' + F('hc', 'λ') + ' = ' + F('6.626 × 10^{-34} × 3.00 × 10^{8}', '600 × 10^{-9}') + ' = 3.31 × 10^{-19} J (2.07 eV)') + E('b) λ = ' + F('hc', 'E') + ' = ' + F('6.626 × 10^{-34} × 3.00 × 10^{8}', '250 × 1.602 × 10^{-19}') + ' = 4.96 × 10^{-9} m') + P('About 5 nm: soft X-ray / extreme ultraviolet.') },
  { id: 'p7bb12', dp: '7.3.1', t: 'exam', q: 'Worksheet 6 Q7: identify the radiation in the EM spectrum that carries the most energy per photon. Justify.',
    a: P('<b>Gamma rays.</b> They have the highest frequency (shortest wavelength), and photon energy E = hf is proportional to frequency.') },
  { id: 'p7bb13', dp: '7.3.1', t: 'exam', q: 'Worksheet 6 Q1–Q3: what observations was Planck trying to explain, and how did his ideas differ from existing ideas about EM radiation?',
    a: P('He was explaining the shape of black body radiation curves, which classical theory could not: it predicted the ultraviolet catastrophe.') + L(['<b>Existing (classical)</b>: EM radiation is a continuous wave; energy can be emitted or absorbed in any amount, and depends on amplitude.', '<b>Planck</b>: oscillators emit and absorb energy only in discrete quanta, E = hf, so energy depends on frequency and is quantised.']) },
  { id: 'p7bb14', dp: '7.3.1', t: 'exam', q: 'HSC 2007 Q27(a) (3 marks): how does quantum theory satisfactorily explain black body radiation?',
    a: L(['Classical wave theory predicted intensity rising without limit at short wavelengths (the ultraviolet catastrophe), contrary to experiment.', 'Planck proposed that the oscillators in the black body can only have energies that are whole multiples of hf.', 'High-frequency (short-wavelength) quanta need large amounts of energy, so few are emitted; the intensity therefore peaks and falls to zero at short wavelengths, exactly matching the experimental curves at every temperature.']) },
  { id: 'p7bb15', dp: '7.3.1', t: 'exam', q: 'HSC 2006 Q24: use black body radiation as an example to explain how scientists test and validate models.',
    a: L(['A model is tested by comparing its predictions with experimental results.', 'Experiments with cavity radiators gave reliable intensity–wavelength curves with a peak.', 'The classical wave model predicted the ultraviolet catastrophe, which did not match, so the model was shown to be inadequate.', 'Planck’s quantum model predicted curves matching the data at all temperatures (and Wien’s law), so it was accepted.', 'Further evidence (the photoelectric effect, Einstein 1905) supported quantisation, and the model of light was revised.']) },
  { id: 'p7bb16', dp: '7.3.1', t: 'con', q: 'How did Kirchhoff’s observation in 1859 start the path to quantum physics?',
    a: P('Kirchhoff passed sunlight through a prism and placed a sodium flame in front of the spectrum: some colours, but only some, became darker. He could not explain why.') + P('Research into how hot objects emit and absorb radiation (black bodies) followed, and explaining it led to Planck’s quantum hypothesis.') }
] });

DECKS.push({ id: 'phys-m7-wn', fa: 'fa3', title: 'Wien’s law', dps: ['7.3.1'], cards: [
  { id: 'p7wn01', dp: '7.3.1', t: 'eq', q: 'State Wien’s displacement law and its equation.',
    a: P('The black body curve has the same shape at every temperature but is displaced (“slid across”); the peak wavelength is inversely proportional to absolute temperature.') + E('λ_{max} = ' + F('b', 'T')) + L(['λ<sub>max</sub> = peak wavelength (m)', 'T = absolute temperature (K)', 'b = Wien’s constant = 2.898 × 10^{-3} m K']) + N('Convert °C to K (add 273) and nm or μm to metres.'), v: 'p7bb' },
  { id: 'p7wn02', dp: '7.3.1', t: 'calc', q: 'Worksheet 7 Q1: the Sun’s surface is 5778 K. (a) Find its peak wavelength. (b) What colour is this? (c) What colour do we see the Sun as, and (d) why?',
    a: E('a) λ_{max} = ' + F('2.898 × 10^{-3}', '5778') + ' = 5.02 × 10^{-7} m = 502 nm') + P('b) Blue-green (cyan).') + P('c), d) The Sun looks white (yellowish from the ground). It emits strongly across the whole visible range, and our eyes see the mixture as white. The atmosphere scatters more blue light, so from the ground the direct sunlight looks slightly yellow.') },
  { id: 'p7wn03', dp: '7.3.1', t: 'calc', q: 'Worksheet 7 Q2: what is the peak wavelength from a wood fire at 1500 K?',
    a: E('λ_{max} = ' + F('2.898 × 10^{-3}', '1500') + ' = 1.93 × 10^{-6} m') + P('1.93 μm: infrared. A fire glows red because only the short-wavelength tail of its curve is visible.') },
  { id: 'p7wn04', dp: '7.3.1', t: 'calc', q: 'Worksheet 7 Q3: for a body temperature of 37 °C, find the peak wavelength and frequency. Where is this in the EM spectrum, and what device uses it?',
    a: E('T = 37 + 273 = 310 K') + E('λ_{max} = ' + F('2.898 × 10^{-3}', '310') + ' = 9.35 × 10^{-6} m') + E('f = ' + F('c', 'λ') + ' = ' + F('3.00 × 10^{8}', '9.35 × 10^{-6}') + ' = 3.21 × 10^{13} Hz') + P('Infrared. Thermal imaging cameras (and infrared thermometers) detect it.') },
  { id: 'p7wn05', dp: '7.3.1', t: 'calc', q: 'Worksheet 7 Q4: the cosmic background radiation from the Big Bang peaks at about 1.063 mm. What temperature does this give space?',
    a: E('T = ' + F('b', 'λ_{max}') + ' = ' + F('2.898 × 10^{-3}', '1.063 × 10^{-3}') + ' = 2.73 K') },
  { id: 'p7wn06', dp: '7.3.1', t: 'calc', q: 'Worksheet 7 Q5: a human’s black body radiation curve peaks at about 9.5 μm. Estimate the person’s temperature in °C.',
    a: E('T = ' + F('2.898 × 10^{-3}', '9.5 × 10^{-6}') + ' = 3.05 × 10^{2} K') + E('305 − 273 ≈ 32 °C') + P('About skin temperature. Read the peak as carefully as you can; your estimate depends on it.') },
  { id: 'p7wn07', dp: '7.3.1', t: 'calc', q: 'HSC 2019 Q34 (adapted): the Sun’s radiation curve peaks at about 500 nm. Determine its surface temperature.',
    a: E('T = ' + F('b', 'λ_{max}') + ' = ' + F('2.898 × 10^{-3}', '500 × 10^{-9}') + ' = 5.8 × 10^{3} K') },
  { id: 'p7wn08', dp: '7.3.1', t: 'exam', q: 'Worksheet 7 Q6 (3 marks): outline the contribution Planck made to a changed model of light.',
    a: L(['Classical wave theory could not explain the black body curves (the ultraviolet catastrophe).', 'Planck proposed that the energy of the emitting oscillators is quantised, in packets E = hf.', 'This matched the experimental curves and introduced the idea that EM energy comes in discrete quanta, which Einstein extended to light itself (photons), leading to the quantum model of light.']) },
  { id: 'p7wn09', dp: '7.3.1', t: 'exam', q: 'Worksheet 7 Q8 (NESA 2017, 4 marks): describe how a black body curve for 5000 K changes if the temperature significantly increases or decreases.',
    a: L(['<b>Increase</b>: the curve is higher at every wavelength; the peak moves to a shorter wavelength (λ<sub>max</sub> = b/T); the area under it (total energy) increases greatly.', '<b>Decrease</b>: the curve is lower everywhere; the peak moves to a longer wavelength; the area decreases.', 'The overall shape stays the same, and curves for different temperatures never cross.']), v: 'p7bb' },
  { id: 'p7wn10', dp: '7.3.1', t: 'exam', q: 'Worksheet 7 Q9: a cavity radiator is a near-perfect absorber. Explain why only waves of certain frequencies exist inside it.',
    a: P('Radiation reflecting back and forth between the walls forms <b>standing waves</b>. Only waves that fit the cavity with nodes at the walls (a whole number of half-wavelengths across it) persist; others interfere destructively and die out.') + P('Planck combined these allowed modes with quantised oscillator energies (E = nhf) to explain the spectrum.') },
  { id: 'p7wn11', dp: '7.3.1', t: 'exam', q: 'HSC 2020 Q26(b): curves X and Y show radiation predicted by two models for an object at 5000 K. X rises without limit at short wavelengths; Y has a peak. Identify an assumption of each model that determines the shape of its curve.',
    a: L(['<b>X (classical)</b>: energy is continuous: oscillators can emit any amount of energy at any frequency, so intensity keeps rising as wavelength decreases.', '<b>Y (Planck)</b>: energy is quantised, E = nhf, so high-frequency quanta are rarely emitted and intensity falls to zero at short wavelengths.']) },
  { id: 'p7wn12', dp: '7.3.1', t: 'exam', q: 'HSC 2020 Q26(c) (4 marks): on a 5000 K black body curve, sketch the curve for 4000 K and explain the differences.',
    a: L(['Draw the 4000 K curve <b>lower at every wavelength</b>, never crossing the 5000 K curve.', 'Its peak is at a <b>longer wavelength</b>: λ<sub>max</sub> = 2.898 × 10<sup>−3</sup>/4000 = 725 nm, compared with 580 nm at 5000 K.', 'Its area is smaller, as total power emitted depends strongly on temperature.']) + P('Explanation: at a lower temperature fewer oscillators have the energy to emit high-frequency quanta, so the emission is weaker and shifted to longer wavelengths.'), v: 'p7bb' }
] });

DECKS.push({ id: 'phys-m7-pe', fa: 'fa3', title: 'The photoelectric effect', dps: ['7.3.2'], cards: [
  { id: 'p7pe01', dp: '7.3.2', t: 'def', q: 'Define the <b>photoelectric effect</b> (NESA).',
    a: P('The process in which a photon ejects an electron from an atom so that all the energy of the photon is absorbed in separating the electron and imparting kinetic energy to it.') + P('In practice: EM radiation of high enough frequency shining on a metal surface makes it emit electrons (photoelectrons).') },
  { id: 'p7pe02', dp: '7.3.2', t: 'con', q: 'Describe the apparatus used to investigate the photoelectric effect.',
    a: L(['An evacuated glass tube (so emitted electrons are not obstructed) containing a metal <b>photocathode</b> (photoemitter) and an <b>anode</b> (collector).', 'Light of known frequency and intensity shines on the cathode.', 'A <b>variable DC supply</b> sets the voltage between them, and an ammeter measures the photocurrent.', 'Forward voltage (anode +) attracts photoelectrons, giving the maximum current. Reverse voltage (anode −) repels them; increasing it until the current is zero gives the <b>stopping voltage</b>.']) },
  { id: 'p7pe03', dp: '7.3.2', t: 'rec', q: 'List the experimental observations of the photoelectric effect.',
    a: OL(['Increasing light intensity increases the photocurrent…', '…but does not increase the energy of each electron.', 'The photocurrent reaches a maximum (saturation) as anode voltage increases.', 'A reverse voltage stops the current: the stopping voltage, which differs for each metal.', 'Below a <b>threshold frequency</b> no electrons are emitted, however intense the light.', 'There is a minimum energy needed to emit an electron (the work function), related to frequency by E = hf.', 'Emission is <b>instantaneous</b>, with no time delay, even for dim light above the threshold frequency.']) },
  { id: 'p7pe04', dp: '7.3.2', t: 'con', q: 'Describe the graphs of photocurrent against voltage for (a) different intensities, same frequency, and (b) different frequencies, same intensity.',
    a: L(['a) Brighter light gives a higher saturation current but the <b>same stopping voltage</b>: K<sub>max</sub> does not depend on intensity.', 'b) Same saturation current, but higher frequency needs a <b>larger stopping voltage</b>: K<sub>max</sub> increases with frequency.']), v: 'p7iv' },
  { id: 'p7pe05', dp: '7.3.2', t: 'con', q: 'Wave theory predicted that brighter light would eject electrons with more energy. Why, and what was observed?',
    a: P('In wave theory, energy is carried continuously and depends on intensity (amplitude), so a brighter beam should give each electron more energy.') + P('Observed: brighter light ejects <b>more</b> electrons but their maximum kinetic energy is <b>unchanged</b> (same stopping voltage). Only frequency changes K<sub>max</sub>.') },
  { id: 'p7pe06', dp: '7.3.2', t: 'con', q: 'Wave theory predicted that light of any frequency would eventually eject electrons. Why, and what was observed?',
    a: P('A wave delivers energy continuously, so even low-frequency light, if intense enough or left on long enough, should build up enough energy in an electron to free it.') + P('Observed: below a <b>threshold frequency</b> no electrons are emitted, however intense the light or however long it shines.') },
  { id: 'p7pe07', dp: '7.3.2', t: 'con', q: 'Wave theory predicted a time delay before emission in dim light. Why, and what was observed?',
    a: P('Spread-out wave energy falling on a tiny electron would take time to accumulate enough to free it, so dim light should show a measurable delay.') + P('Observed: emission is <b>instantaneous</b> for any intensity, provided the frequency is above the threshold.') },
  { id: 'p7pe08', dp: '7.3.2', t: 'con', q: 'How did the photoelectric effect come to be investigated, and why are terms like “cathode” used?',
    a: P('Hertz noticed UV light made sparks jump more easily (1887) but could not explain it. Scientists then studied the effect in discharge (cathode ray) tubes, where rays came from the negative electrode, the <b>cathode</b>; the positive one is the <b>anode</b>.') + P('Planck’s quanta were not widely accepted, even by Planck; the photoelectric effect became key evidence for them.') },
  { id: 'p7pe09', dp: '7.3.2', t: 'exam', q: 'Worksheet 8 Q1(a)–(c): UV light hits a photoemitter in an evacuated tube connected to an ammeter and variable DC supply. (a) What happens to surface electrons? (b) What is the purpose of the variable supply? (c) What can be measured with it?',
    a: P('a) Each electron that absorbs a UV photon gains its energy hf. If hf exceeds the work function, the electron is ejected from the surface with kinetic energy up to hf − φ.') + P('b) It sets the potential difference between the electrodes: a forward voltage attracts photoelectrons to the anode; a reverse voltage repels them.') + P('c) The <b>stopping voltage</b>: the reverse voltage at which the current just becomes zero, which gives K<sub>max</sub> = qV<sub>0</sub>.') },
  { id: 'p7pe10', dp: '7.3.2', t: 'exam', q: 'Worksheet 8 Q1 d–g: predict and justify what happens d) if the forward voltage is increased, e) if UV is replaced by blue light, f) if replaced by red light. g) What did scientists conclude?',
    a: P('d) The current increases as more photoelectrons reach the anode, then levels off at a saturation value once all emitted electrons are collected.') + P('e) Blue light has a lower frequency than UV. If it is still above the threshold frequency, the current continues but with lower-energy electrons; if below, it stops.') + P('f) Red light has an even lower frequency, likely below the threshold for this metal, so the current drops to <b>zero</b>, whatever its intensity.') + P('g) Light’s energy comes in packets whose energy depends on frequency: light behaves as particles (photons), E = hf.') },
  { id: 'p7pe11', dp: '7.3.2', t: 'con', q: 'Describe some uses of the photoelectric effect.',
    a: L(['<b>Photocell</b>: light on a photoemissive cathode produces a current proportional to intensity, used to switch another circuit.', '<b>Light meters</b>: the photocell current, shown on a micro-ammeter, measures the brightness of a subject to set camera exposure.', '<b>Burglar alarms and automatic doors</b>: a beam falls on a photocell; when someone blocks it, the current stops, an electromagnet releases a spring-loaded switch and the alarm sounds.']) + P('Most have now been replaced by semiconductor photodiodes and photoresistors.') },
  { id: 'p7pe12', dp: '7.3.2', t: 'exam', q: 'NESA 2019 sample Q26 (9 marks): explain how the analysis of quantitative observations contributed to the development of the concept that certain matter and energy are quantised.',
    a: L(['<b>Black body radiation</b>: measured intensity–wavelength curves had a peak; classical theory predicted the ultraviolet catastrophe. Planck fitted the data by quantising oscillator energy, E = nhf.', '<b>Photoelectric effect</b>: measured stopping voltages showed K<sub>max</sub> depends linearly on frequency, not intensity, with a threshold frequency. Einstein explained this with photons, K<sub>max</sub> = hf − φ; Millikan’s measurements of the gradient gave h, confirming it.', '<b>Line spectra</b>: precise measurements of discrete wavelengths (e.g. the Balmer series) showed atoms emit only certain energies. Bohr explained this with quantised energy levels and angular momentum.', 'Each case: precise quantitative data that classical theory could not fit led to a model in which energy (and electron states in matter) are quantised.']) }
] });

DECKS.push({ id: 'phys-m7-ei', fa: 'fa3', title: 'Einstein’s photon model', dps: ['7.3.3'], cards: [
  { id: 'p7ei01', dp: '7.3.3', t: 'con', q: 'What did Einstein propose about light in 1905?',
    a: P('He applied Planck’s quanta to light itself: light consists of <b>photons</b>, each carrying energy E = hf, and the intensity of light depends on the <b>number</b> of photons.') + P('A photon is a particle of light with zero rest mass that always moves at the speed of light in a vacuum and shows both wave and particle behaviour.') },
  { id: 'p7ei02', dp: '7.3.3', t: 'eq', q: 'State Einstein’s photoelectric equation and explain it using conservation of energy.',
    a: E('hf = φ + K_{max} → K_{max} = hf − φ') + P('Each photon’s energy hf is absorbed by one electron. Part is used to free the electron from the metal (the work function φ); the rest becomes kinetic energy.') + P('K<sub>max</sub> is for electrons at the very surface; electrons from deeper lose some energy on the way out and emerge with less.') },
  { id: 'p7ei03', dp: '7.3.3', t: 'def', q: 'Define the <b>work function</b> and <b>threshold frequency</b>, and relate them.',
    a: L(['<b>Work function</b> φ: the minimum energy needed to remove an electron from the surface of a particular metal.', '<b>Threshold frequency</b> f<sub>0</sub>: the minimum frequency of light that will eject photoelectrons from that metal.']) + E('φ = hf_{0}') + P('Metals that hold their electrons more tightly have a larger φ and higher f<sub>0</sub>.') },
  { id: 'p7ei04', dp: '7.3.3', t: 'con', q: 'Worksheet 8 Q6: account for each photoelectric observation using the photon model.',
    a: L(['<b>Brighter light → more current, same electron energy</b>: more photons per second eject more electrons, but each photon still has energy hf.', '<b>Saturation current</b>: all emitted electrons are collected; at very high intensity all surface atoms are being hit.', '<b>Stopping voltage depends on f and metal</b>: qV<sub>0</sub> = K<sub>max</sub> = hf − φ.', '<b>Threshold frequency</b>: below f<sub>0</sub> a single photon has less energy than φ, and one electron absorbs one photon, so no emission at any intensity.', '<b>No time delay</b>: an electron absorbs a whole photon’s energy at once.']) },
  { id: 'p7ei05', dp: '7.3.3', t: 'eq', q: 'How is the stopping voltage related to the maximum kinetic energy of photoelectrons?',
    a: P('The reverse field does work on the fastest electrons until they just stop before reaching the anode: W = ΔK = |0 − K<sub>max</sub>|.') + E('K_{max} = qV_{0}') + P('In electron volts, K<sub>max</sub> is numerically equal to the stopping voltage: V<sub>0</sub> = 2.5 V means K<sub>max</sub> = 2.5 eV = 4.0 × 10<sup>−19</sup> J.') },
  { id: 'p7ei06', dp: '7.3.3', t: 'con', q: 'Describe a graph of K_{max} against frequency, and what its features represent.',
    a: P('K<sub>max</sub> = hf − φ has the form y = mx + b, so the graph is a straight line:') + L(['<b>Gradient</b> = Planck’s constant h, the same for every metal.', '<b>Horizontal intercept</b> = threshold frequency f<sub>0</sub>.', '<b>Vertical intercept</b> (extrapolated with a dotted line) = −φ.', 'A metal with a larger work function gives a parallel line shifted to the right.']), v: 'p7kf' },
  { id: 'p7ei07', dp: '7.3.3', t: 'calc', q: 'Stopping voltages were 0.60, 1.00, 1.81, 2.56, 3.56 and 4.38 V for 4.0, 6.0, 8.0, 10, 12 and 14 × 10^{14} Hz. Find K_{max} for each, then use a graph to find f_{0}, φ and h.',
    a: E('K_{max} = qV_{0}: 0.60 V → 1.602 × 10^{-19} × 0.60 = 9.61 × 10^{-20} J') + P('Others: 1.60, 2.90, 4.10, 5.70, 7.02 × 10<sup>−19</sup> J. From the line of best fit:') + L(['threshold frequency f<sub>0</sub> ≈ 3.1 × 10<sup>14</sup> Hz (horizontal intercept)', 'work function φ ≈ 1.9 × 10<sup>−19</sup> J ≈ 1.2 eV (−vertical intercept)', 'h = gradient ≈ 6.3 × 10<sup>−34</sup> J s (accepted 6.63 × 10<sup>−34</sup>)']) + N('Values read from a hand-drawn line will vary slightly.'), v: 'p7pedata' },
  { id: 'p7ei08', dp: '7.3.3', t: 'exam', q: 'Worksheet 8 Q2–Q3: a graph shows K_{max} against f for metals X and Y as parallel lines, X crossing the f axis at a lower frequency. Which is correct: (A) X has greater resistivity; (B) X is more superconductive; (C) X is a better photoemitter; (D) X has a smaller work function? What does the gradient equal?', vf: 'p7kf',
    a: P('Q2: <b>D</b>. X has the lower threshold frequency, and φ = hf<sub>0</sub>, so X has the smaller work function.') + P('Q3: the gradient equals <b>Planck’s constant</b> (D).') },
  { id: 'p7ei09', dp: '7.3.3', t: 'exam', q: 'Worksheet 8 Q4: which is true of the energy of photoelectrons emitted when monochromatic light strikes a metal? (A) depends on intensity (B) depends on frequency (C) is independent of the metal (D) has a maximum value',
    a: P('<b>D</b>. For a given frequency, electrons leave with a range of energies up to a maximum, K<sub>max</sub> = hf − φ; electrons from below the surface have less.') + P('A is false, C is false (φ depends on the metal). B is true of K<sub>max</sub> in general, but the light here is monochromatic (one frequency), so D is the intended answer.') },
  { id: 'p7ei10', dp: '7.3.3', t: 'exam', q: 'Worksheet 8 Q5: (a) outline how Einstein’s ideas about light contradicted current theory; (b) how did Einstein give credibility to Planck’s quanta?',
    a: P('a) The accepted theory was that light is a continuous EM wave whose energy depends on intensity. Einstein proposed light consists of particles (photons) whose energy depends only on frequency, E = hf, contradicting the wave model’s predictions about intensity, threshold and time delay.') + P('b) Planck had quantised only the energy of oscillators in a black body, as a mathematical device. Einstein used the same E = hf to explain a completely different phenomenon, the photoelectric effect, with testable predictions (e.g. gradient = h) later confirmed by Millikan. Independent success made quanta physically real.') },
  { id: 'p7ei11', dp: '7.3.3', t: 'calc', q: 'Worksheet 8 Q7: photons of red (1.8 eV), green (2.3 eV) and blue (3.1 eV) light fall on potassium, work function 2.0 eV. Which photon gives the most energetic photoelectrons? Find φ in joules, each photon’s energy in joules and wavelength, and the kinetic energy of the photoelectrons.',
    a: P('Blue gives the most energetic electrons: K<sub>max</sub> = E − φ is largest for the largest E. Red (1.8 eV, less than 2.0 eV) ejects none.') + E('φ = 2.0 × 1.602 × 10^{-19} = 3.20 × 10^{-19} J') + E('e.g. blue: λ = ' + F('hc', 'E') + ' = ' + F('1.988 × 10^{-25}', '4.97 × 10^{-19}') + ' = 4.00 × 10^{-7} m'), v: 'p7ws8' },
  { id: 'p7ei12', dp: '7.3.3', t: 'calc', q: 'Worksheet 8 Q8(a)–(b): for the sodium photoemitter graph, find the threshold frequency and Planck’s constant.', vf: 'p7na',
    a: P('a) The line crosses the frequency axis at f<sub>0</sub> ≈ <b>4.6 × 10<sup>14</sup> Hz</b>.') + P('b) Gradient, using two points far apart on the line:') + E('h = ' + F('ΔK', 'Δf') + ' ≈ ' + F('(3.2 − 0) × 1.602 × 10^{-19}', '(11.8 − 4.6) × 10^{14}') + ' ≈ 7 × 10^{-34} J s') + N('This graph gives a value somewhat above the accepted 6.63 × 10⁻³⁴ J s; read your own points carefully.') },
  { id: 'p7ei13', dp: '7.3.3', t: 'calc', q: 'Worksheet 8 Q8(c)–(d): from the sodium graph, find the wavelength of light that ejects electrons with 3.0 eV of kinetic energy, and its colour.', vf: 'p7na',
    a: P('Read across from 3.0 eV to the line: f ≈ 11.3 × 10<sup>14</sup> Hz.') + E('λ = ' + F('c', 'f') + ' = ' + F('3.00 × 10^{8}', '1.13 × 10^{15}') + ' = 2.7 × 10^{-7} m') + P('About 265–270 nm: this is <b>ultraviolet</b>, so it has no visible colour.') },
  { id: 'p7ei14', dp: '7.3.3', t: 'con', q: 'What is <b>wave–particle duality</b> of light?',
    a: P('Light shows wave behaviour (diffraction, interference, polarisation) in some experiments and particle behaviour (the photoelectric effect, photons of energy hf) in others. Physicists accept that light has a dual nature; neither model alone explains everything.') + P('The photon model keeps wave ideas: a photon’s energy depends on its frequency.') }
] });


/* ================= 7.4 LIGHT AND SPECIAL RELATIVITY ================= */
DECKS.push({ id: 'phys-m7-fr', fa: 'fa4', title: 'Frames of reference', dps: ['7.4.1'], cards: [
  { id: 'p7fr01', dp: '7.4.1', t: 'def', q: 'Define a <b>frame of reference</b> and an <b>inertial frame of reference</b> (NESA).',
    a: L(['<b>Frame of reference</b>: a coordinate system that enables the position of a body to be specified.', '<b>Inertial frame</b>: a reference frame in which a body moves at constant velocity unless acted on by a net force, i.e. a frame that is stationary or moving at constant velocity (not accelerating).']) + P('A <b>non-inertial</b> frame is accelerating; you can feel it (reaction forces, “g forces”).') },
  { id: 'p7fr02', dp: '7.4.1', t: 'con', q: 'State the (Galilean) principle of relativity and its consequences.',
    a: L(['The laws of physics are the same in all inertial frames of reference.', 'All inertial frames are equally valid; there is no absolute (preferred) frame.']) + P('So no experiment done inside an inertial frame can show whether it is at rest or moving at constant velocity. Even comparing with another frame cannot show <b>which</b> one is “really” moving. The principle does not hold in non-inertial (accelerating) frames.') },
  { id: 'p7fr03', dp: '7.4.1', t: 'con', q: 'Why can’t you feel Earth moving around the Sun at about 30 km s^{-1}?',
    a: P('Motion at (approximately) constant velocity cannot be detected from inside the moving frame. Without an outside reference you cannot tell you are moving; everything around you shares the motion.') },
  { id: 'p7fr04', dp: '7.4.1', t: 'con', q: 'How does the principle of relativity differ from Einstein’s theory of special relativity?',
    a: P('The <b>principle of relativity</b> (Galileo, built into Newton’s first law) says the laws of physics are the same in all inertial frames.') + P('<b>Special relativity</b> (Einstein, 1905) keeps that principle as its second postulate but adds the first: the speed of light in a vacuum is the same for all observers. The consequences (time dilation, length contraction) come from combining them.') + N('Read questions carefully: they are not the same thing.') },
  { id: 'p7fr05', dp: '7.4.1', t: 'exam', q: 'Worksheet 10 Q1: classify each as an inertial or non-inertial frame: a) the Earth b) your school laboratory c) a plane in level, constant-speed flight d) a plane in a steep climb e) a bus turning a corner f) a roller coaster g) a spaceship in geostationary orbit.',
    a: L(['a), b) Approximately <b>inertial</b> for most purposes, though strictly non-inertial because Earth rotates and orbits (centripetal acceleration).', 'c) <b>Inertial</b>: constant velocity.', 'd) <b>Non-inertial</b> while it accelerates into the climb (inertial only once climbing at constant velocity).', 'e) <b>Non-inertial</b>: changing direction is acceleration.', 'f) <b>Non-inertial</b>: constantly changing speed and direction.', 'g) <b>Non-inertial</b>: circular orbit means centripetal acceleration.']) },
  { id: 'p7fr06', dp: '7.4.1', t: 'exam', q: 'Worksheet 10 Q4: an astronaut’s mascot hangs on a string from the ceiling. One day it hangs at an angle. (a) Account for this. (b) What type of frame is it in when hanging straight? (c) When at an angle?',
    a: P('a) The spacecraft is accelerating. The string must provide a net force to accelerate the mascot with the craft, so it tilts (the mascot “lags” behind, opposite to the acceleration).') + P('b) Hanging straight down: an <b>inertial</b> frame (constant velocity), as no horizontal net force is needed.') + P('c) At an angle: a <b>non-inertial</b> (accelerating) frame, so motion is detectable from inside.') }
] });

DECKS.push({ id: 'phys-m7-mm', fa: 'fa4', title: 'The aether and Michelson–Morley', dps: ['7.4.1'], cards: [
  { id: 'p7mm01', dp: '7.4.1', t: 'con', q: 'Why did Maxwell’s equations create a problem for the principle of relativity?',
    a: P('Maxwell’s theory gives light a single fixed speed, c = 1/√(μ<sub>0</sub>ε<sub>0</sub>), with no mention of the motion of the source or observer.') + P('In Newtonian physics, speeds are relative: an observer moving towards a light source should measure more than c. A fixed c seemed to single out a special frame in which light travels at c, contradicting the idea that no frame is preferred.') },
  { id: 'p7mm02', dp: '7.4.1', t: 'con', q: 'What was the <b>luminiferous aether</b>, and why was it proposed?',
    a: P('A hypothetical medium filling all space through which light waves were thought to travel, as sound needs air.') + L(['Thought to be transparent, weightless and fixed in space, with the Sun and planets moving through it.', 'Light would travel at c relative to the aether, making it an absolute frame of reference.', 'So light should seem faster or slower to an observer moving through the aether, like Earth.']) },
  { id: 'p7mm03', dp: '7.4.1', t: 'con', q: 'What was the aim of the Michelson–Morley experiment (1887), and how was it done?',
    a: P('Aim: to measure Earth’s velocity through the aether.') + L(['An interferometer: a half-silvered mirror split light into two beams travelling at right angles, which reflected off mirrors and recombined to form an interference pattern.', 'If one arm lay along the “aether wind”, light in the two arms should take different times.', 'The apparatus was mounted on a heavy stone floating on mercury, which reduced vibrations and let it be rotated smoothly.', 'Rotating it should swap the arms’ roles and <b>shift the interference fringes</b>.']), v: 'p7mm' },
  { id: 'p7mm04', dp: '7.4.1', t: 'con', q: 'What result did Michelson and Morley expect, and what did they find?',
    a: P('Expected: as with riding a bike with and against the wind, light travelling with, against and across the aether wind would take different times, so rotating the apparatus should shift the fringes. The apparatus was sensitive enough to detect this.') + P('Found: <b>no shift</b>: a null result. Repeats by many scientists, at different places and times, all gave the same null result.') },
  { id: 'p7mm05', dp: '7.4.1', t: 'con', q: 'Did the Michelson–Morley null result disprove the aether? How did scientists respond?',
    a: P('No. A null result cannot disprove something; it only fails to detect it. Scientists were heavily invested in the aether and explained the result away: the equipment was not sensitive enough, or the model needed adjusting.') + P('Lorentz and FitzGerald proposed that the interferometer arm moving through the aether physically <b>contracted</b> by exactly the amount needed to hide the effect: l = l<sub>0</sub>√(1 − v²/c²).') },
  { id: 'p7mm06', dp: '7.4.1', t: 'con', q: 'How did Einstein’s theory resolve the aether problem, and can the Michelson–Morley experiment be used as evidence for special relativity?',
    a: P('Einstein made the aether unnecessary: if the speed of light in a vacuum is the same in every inertial frame, there is no special frame and no fringe shift is expected. The aether was not disproved, but it was no longer needed. Scientists chose a theory whose predictions came true over one whose predictions never did.') + P('An experiment that gives <b>no observable result</b> cannot be “proof” of a theory. Use other experiments (muons, atomic clocks) as evidence for special relativity.') + N('The booklet says Michelson and Morley shared the 1907 Nobel Prize. In fact Michelson alone received it, for his precision optical instruments and measurements.') }
] });

DECKS.push({ id: 'phys-m7-ep', fa: 'fa4', title: 'Einstein’s postulates and simultaneity', dps: ['7.4.1', '7.4.2'], cards: [
  { id: 'p7ep01', dp: '7.4.1', t: 'rec', q: 'State Einstein’s two postulates of special relativity.',
    a: OL(['The speed of light <b>in a vacuum</b> is an absolute constant, the same for all observers regardless of their motion or the motion of the source.', 'All inertial frames of reference are equivalent: the laws of physics are the same in all of them.']) + N('Always say “in a vacuum”: light does slow down in other media.') },
  { id: 'p7ep02', dp: '7.4.1', t: 'def', q: 'What is a <b>postulate</b>, and why is Einstein’s theory called <b>special</b> relativity?',
    a: P('A postulate (axiom) is a statement taken to be true as a starting point for further reasoning.') + P('“Special” because it deals with the special case of inertial frames with no gravity. Einstein’s general relativity (1915) deals with acceleration and gravity.') },
  { id: 'p7ep03', dp: '7.4.2', t: 'con', q: 'Einstein wondered: “If I sit on a train travelling at the speed of light and hold up a mirror, will I see my reflection?” What were the possibilities and his conclusion?',
    a: L(['<b>No</b>: light from his face could never reach the mirror, so he would know he was moving without looking outside. This violates the principle of relativity.', '<b>Yes</b>: light moves at its normal speed relative to the train, but then a platform observer would see it travel at 2c (classical addition of velocities).']) + P('Insisting the principle of relativity never fails, he concluded: the aether is superfluous; he would see his reflection; and the speed of light is the same for all observers, so <b>it is time and space, not c, that change</b>.') },
  { id: 'p7ep04', dp: '7.4.2', t: 'con', q: 'Explain “It is not the speed of light that is changing, but time”.',
    a: E('c = ' + F('d', 't')) + P('In classical physics, distance and time are absolute and speeds are relative. In Einstein’s physics, c is the same for every observer, so observers in relative motion must measure different distances and times to keep d/t = c.') + P('Space and time are linked into four-dimensional spacetime: three dimensions of space plus time.') },
  { id: 'p7ep05', dp: '7.4.2', t: 'con', q: 'What long-held ideas did Einstein’s postulates overturn?',
    a: L(['The need for a luminiferous aether.', 'That time passes at the same rate for everyone.', 'That events simultaneous for one observer are simultaneous for all.', 'That lengths (and mass, as measured) are the same for all observers.']) + P('They also explained why Earth’s velocity through space could not be detected from Earth, and why the Michelson–Morley apparatus gave the same result in any orientation.') },
  { id: 'p7ep06', dp: '7.4.2', t: 'con', q: 'Why did Einstein use thought experiments, and are they evidence for special relativity?',
    a: P('Speeds close to c were impossible to achieve with the technology of 1905, so he reasoned through imagined situations (fast trains, mirrors, light clocks).') + P('Thought experiments help us <b>understand</b> the theory but cannot <b>validate</b> it. Validation needed real experiments (muons, atomic clocks, accelerators), which came decades later; until then many scientists resisted his ideas.') },
  { id: 'p7ep07', dp: '7.4.2', t: 'con', q: 'What is the <b>relativity of simultaneity</b>? Explain it with Einstein’s train-door thought experiment.',
    a: P('Events simultaneous in one frame of reference may not be simultaneous in another.') + L(['A light in the centre of a carriage operates the doors at each end.', 'Observer in the train: the light travels equal distances at c, so both doors open at the same time.', 'Observer on the platform: the train moves forward while the light travels. The rear door moves towards the light and the front door away, so the light (still at c) reaches the rear door first.']) + P('Both accounts are equally valid: there is no preferred frame.'), v: 'p7train' },
  { id: 'p7ep08', dp: '7.4.2', t: 'exam', q: 'Worksheet 11 Q1: the Enterprise is stationary. A Klingon ship approaches from the right and flashes past to the left at 0.5c. When the Klingon captain (in his central cockpit) is exactly opposite Captain Kirk, Kirk fires lasers from the extreme left and right edges of the Enterprise simultaneously, and sees both hit the Klingon vessel at the same time. According to the Klingon captain, which laser hits first? Explain.',
    a: P('The <b>left</b> laser (on the side the Klingon ship is heading towards) hits first.') + L(['In the Klingon frame, his ship is at rest and the Enterprise moves to the right at 0.5c. Both pulses still travel at c (postulate 1), and neither frame is preferred (postulate 2).', 'Events that are simultaneous in Kirk’s frame are not simultaneous in a frame moving relative to it. For the Klingon, the firing at the trailing (left) end of the moving Enterprise happens first, just as the rear door opens first in the train thought experiment.', 'So the Klingon captain sees the left beam hit before the right beam, and his account is just as valid as Kirk’s.']) },
  { id: 'p7ep09', dp: '7.4.2', t: 'exam', q: 'Worksheet 11 Q2: the Klingon ship loops round and flies past again, and this time the Klingon captain sees both laser beams hit his ship simultaneously. What would Captain Kirk say, and why do their accounts differ?',
    a: P('Kirk would say the beams did <b>not</b> hit at the same time. In his frame the Klingon ship is moving (to the left), and the hit at its trailing end (the right) happens first.') + P('Light travels at c in both frames, but the observers are in relative motion, so events simultaneous in one inertial frame are not simultaneous in the other. Neither frame is preferred, so both accounts are correct: simultaneity is relative.') }
] });

DECKS.push({ id: 'phys-m7-td', fa: 'fa4', title: 'Time dilation', dps: ['7.4.2'], cards: [
  { id: 'p7td01', dp: '7.4.2', t: 'con', q: 'Use a light clock to explain why moving clocks run slow.',
    a: L(['In the clock’s own frame, light bounces straight up and down between mirrors L apart: one tick takes t<sub>0</sub> = 2L/c.', 'An outside observer sees the clock moving at v, so the light travels a longer diagonal path.', 'Light travels at c for both observers (postulate 1), so the longer path must take longer: each tick lasts t > t<sub>0</sub>.']) + P('Pythagoras on the triangle gives t = t<sub>0</sub>/√(1 − v²/c²). Light clocks are a model, not real devices.'), v: 'p7clock' },
  { id: 'p7td02', dp: '7.4.2', t: 'eq', q: 'State the time dilation equation and define each symbol.',
    a: E('t = ' + F('t_{0}', SQ('1 − ' + F('v^{2}', 'c^{2}'))) + ' = γt_{0}') + L(['t<sub>0</sub> = <b>proper time</b>: measured by an observer at rest relative to the events (same place in their frame)', 't = time measured by an observer in another frame, moving at v relative to the events', 'γ = 1/√(1 − v²/c²), always ≥ 1']) + P('Because γ ≥ 1, t ≥ t<sub>0</sub>: time in a moving frame is observed to pass more slowly.'), v: 'p7gamma' },
  { id: 'p7td03', dp: '7.4.2', t: 'con', q: 'A train passes a platform. Whose clock runs slow?',
    a: P('Each observer sees the <b>other’s</b> clock running slow. To the platform observer, the train’s clocks are slow; to the train observer (who may consider themselves at rest), the platform’s clocks are slow.') + P('There is no preferred frame (postulate 2). In a calculation, t<sub>0</sub> is always the time in the frame where the events happen at the same place.') },
  { id: 'p7td04', dp: '7.4.2', t: 'exam', q: 'Worksheet 12 Q1: two spaceships travel at relativistic speeds. Spaceship Beta shines a light beam forward. What is the speed of the beam according to an observer on spaceship Alpha?',
    a: P('<b>c</b> (3.00 × 10<sup>8</sup> m s<sup>−1</sup>). By Einstein’s first postulate the speed of light in a vacuum is the same for all observers, regardless of the motion of the source or observer.') },
  { id: 'p7td05', dp: '7.4.2', t: 'calc', q: 'Worksheet 12 Q2 (HSC 2008): a spaceship moves away from Earth at 1.8 × 10^{8} m s^{-1}. Its clock ticks every 0.50 s, sending a radio pulse each tick. What is the interval between ticks as measured on Earth?',
    a: E('v/c = ' + F('1.8 × 10^{8}', '3.0 × 10^{8}') + ' = 0.60') + E('t = ' + F('0.50', SQ('1 − 0.60^{2}')) + ' = ' + F('0.50', '0.80') + ' = 0.63 s') + N('This is the dilated tick interval. (The pulses arrive even further apart because the ship is also moving away, but HSC answers use time dilation only.)') },
  { id: 'p7td06', dp: '7.4.2', t: 'calc', q: 'Worksheet 12 Q3 (HSC 2010): a particle travelling at 0.9999c has a lifetime of 1.0 × 10^{-6} s in the lab. What would its lifetime be if it were at rest in the lab?',
    a: P('The lifetime at rest is the proper time:') + E('t_{0} = t' + SQ('1 − ' + F('v^{2}', 'c^{2}')) + ' = 1.0 × 10^{-6} × ' + SQ('1 − 0.9999^{2}')) + E('t_{0} = 1.0 × 10^{-6} × 0.01414 = 1.4 × 10^{-8} s') },
  { id: 'p7td07', dp: '7.4.2', t: 'calc', q: 'Worksheet 12 Q4: muons live 2.2 μs in a lab, but cosmic-ray muons take 16 μs to reach the ground. Calculate their minimum speed.',
    a: E(SQ('1 − ' + F('v^{2}', 'c^{2}')) + ' = ' + F('t_{0}', 't') + ' = ' + F('2.2', '16') + ' = 0.1375') + E('v = c' + SQ('1 − 0.1375^{2}') + ' = 0.9905c = 2.97 × 10^{8} m s^{-1}') },
  { id: 'p7td08', dp: '7.4.2', t: 'calc', q: 'Worksheet 12 Q5: an astronaut travelling at 0.5c takes 10 hours (ship time) to reach her destination. How much time passes on Earth?',
    a: E('t = ' + F('10', SQ('1 − 0.5^{2}')) + ' = ' + F('10', '0.866') + ' = 11.5 h') },
  { id: 'p7td09', dp: '7.4.2', t: 'calc', q: 'Worksheet 12 Q6: astronauts travel at 0.9c to Alpha Centauri; Newtonian physics (Earth’s frame) gives 4.86 years. How long does the journey take for the astronauts?',
    a: P('The astronauts’ time is the proper time (they are present at both departure and arrival):') + E('t_{0} = t' + SQ('1 − 0.9^{2}') + ' = 4.86 × 0.436 = 2.12 years') },
  { id: 'p7td10', dp: '7.4.2', t: 'calc', q: 'Worksheet 12 Q7: a spaceship flies past a planet at 0.4c. The pilot and his girlfriend on the planet each wave for 5 s (own time). How long does each see the other waving?',
    a: E('t = ' + F('5', SQ('1 − 0.4^{2}')) + ' = ' + F('5', '0.917') + ' = 5.5 s') + P('<b>Both</b> see the other waving for 5.5 s: each sees the other’s clock running slow.') },
  { id: 'p7td11', dp: '7.4.2', t: 'calc', q: 'Worksheet 12 Q8: Alpha Centauri is 4.5 light years away. How long does a trip at 0.9c take as measured by mission control on Earth and by the pilot?',
    a: E('Earth: t = ' + F('d', 'v') + ' = ' + F('4.5 ly', '0.9c') + ' = 5.0 years') + E('Pilot: t_{0} = 5.0 × ' + SQ('1 − 0.9^{2}') + ' = 5.0 × 0.436 = 2.2 years') },
  { id: 'p7td12', dp: '7.4.2', t: 'calc', q: 'Worksheet 12 Q9: a spaceship travelling at 0.75c sends a microwave message to Earth. What is the speed of the transmission relative to Earth if the ship moves (i) away, (ii) towards Earth? What is its speed relative to the ship?',
    a: P('In every case the speed is <b>c = 3.00 × 10<sup>8</sup> m s<sup>−1</sup></b>. Microwaves are EM waves, and the speed of light in a vacuum is the same for all observers, regardless of the source’s motion.') },
  { id: 'p7td13', dp: '7.4.2', t: 'calc', q: 'Worksheet 12 Q10: a spaceship moves at 2.5 × 10^{7} m s^{-1}. Astronauts do an 8-hour watch. How long does mission control measure each watch?',
    a: E('v/c = ' + F('2.5 × 10^{7}', '3.00 × 10^{8}') + ' = 0.0833') + E('t = ' + F('8', SQ('1 − 0.0833^{2}')) + ' = 8.03 h') + P('About 1.7 minutes longer.') },
  { id: 'p7td14', dp: '7.4.2', t: 'calc', q: 'Worksheet 12 Q11: how fast must a spaceship travel so that each year on the ship corresponds to 3 years on Earth?',
    a: E('γ = ' + F('t', 't_{0}') + ' = 3 → ' + SQ('1 − ' + F('v^{2}', 'c^{2}')) + ' = ' + F('1', '3')) + E('v = c' + SQ('1 − ' + F('1', '9')) + ' = 0.943c = 2.83 × 10^{8} m s^{-1}') }
] });

DECKS.push({ id: 'phys-m7-lc', fa: 'fa4', title: 'Length contraction', dps: ['7.4.2'], cards: [
  { id: 'p7lc01', dp: '7.4.2', t: 'eq', q: 'State the length contraction equation and define each symbol.',
    a: E('l = l_{0}' + SQ('1 − ' + F('v^{2}', 'c^{2}')) + ' = ' + F('l_{0}', 'γ')) + L(['l<sub>0</sub> = <b>proper length</b>: measured in the object’s own rest frame', 'l = length measured by an observer moving at v relative to the object']) + P('l < l<sub>0</sub>: moving objects are measured to be shorter, but <b>only in the direction of motion</b>; perpendicular dimensions are unchanged.') },
  { id: 'p7lc02', dp: '7.4.2', t: 'con', q: 'How did Einstein’s view of length contraction differ from Lorentz and FitzGerald’s?',
    a: P('Lorentz and FitzGerald proposed that objects moving through the aether physically shrink, to explain the Michelson–Morley null result while keeping the aether.') + P('In special relativity there is no aether: contraction is a property of space and time measurements, and it is reciprocal. Each observer measures the other’s objects as shortened along the direction of relative motion.') },
  { id: 'p7lc03', dp: '7.4.2', t: 'calc', q: 'Worksheet 13 Q1–Q2: a 100 m spaceship flies past a 250 m platform at 0.8c. What lengths do (a) the pilot and (b) an observer on the platform measure for the ship and the platform?',
    a: E(SQ('1 − 0.8^{2}') + ' = 0.6') + L(['Ship, by the pilot: <b>100 m</b> (proper length).', 'Ship, by the platform observer: 100 × 0.6 = <b>60 m</b>.', 'Platform, by the pilot: 250 × 0.6 = <b>150 m</b>.', 'Platform, by the platform observer: <b>250 m</b> (proper length).']) },
  { id: 'p7lc04', dp: '7.4.2', t: 'calc', q: 'Worksheet 13 Q3: a 100 m Klingon vessel flies past Saturn (diameter 120 000 km) at 0.250c. Find (a) Saturn’s diameter as measured by the Klingons, (b) the vessel’s length as measured from Saturn.',
    a: E(SQ('1 − 0.250^{2}') + ' = 0.968') + E('a) 120 000 × 0.968 = 1.16 × 10^{5} km') + P('This is the diameter along the direction of motion; the diameter perpendicular to the motion is still 120 000 km.') + E('b) 100 × 0.968 = 96.8 m') },
  { id: 'p7lc05', dp: '7.4.2', t: 'calc', q: 'Worksheet 13 Q4–Q5: the 38 m Space Shuttle orbits at about 30 000 km h^{-1}. (a) What length does an astronomer on Earth measure? (b) The astronaut looks at a 250 km section of the Great Wall. What length does the astronaut measure?',
    a: E('v = ' + F('30 000', '3.6') + ' = 8.33 × 10^{3} m s^{-1}, v/c = 2.78 × 10^{-5}') + E('a) l = 38' + SQ('1 − (2.78 × 10^{-5})^{2}') + ' ≈ 38 m') + P('The contraction is only about 1.5 × 10<sup>−8</sup> m. b) Similarly the wall measures 250 km less about 0.1 mm, i.e. 250 km to any measurable precision. Relativistic effects are negligible at everyday speeds.') + N('If the astronaut measured exactly 250 km, the real length would be 250 km plus about 0.1 mm.') },
  { id: 'p7lc06', dp: '7.4.2', t: 'calc', q: 'Worksheet 13 Q6: a moving spaceship appears 75 m long; its rest length is 100 m. Calculate its speed.',
    a: E(SQ('1 − ' + F('v^{2}', 'c^{2}')) + ' = ' + F('l', 'l_{0}') + ' = ' + F('75', '100') + ' = 0.75') + E('v = c' + SQ('1 − 0.75^{2}') + ' = 0.661c = 1.98 × 10^{8} m s^{-1}') },
  { id: 'p7lc07', dp: '7.4.2', t: 'calc', q: 'Worksheet 13 Q7: what speed would cause a 15% length contraction to an external observer?',
    a: E('l = 0.85l_{0} → ' + SQ('1 − ' + F('v^{2}', 'c^{2}')) + ' = 0.85') + E('v = c' + SQ('1 − 0.85^{2}') + ' = 0.527c = 1.58 × 10^{8} m s^{-1}') },
  { id: 'p7lc08', dp: '7.4.2', t: 'calc', q: 'Worksheet 13 Q8: a 400 m rocket cruises past Earth at 0.95c. What length does a stationary observer on Earth measure?',
    a: E('l = 400' + SQ('1 − 0.95^{2}') + ' = 400 × 0.312 = 125 m') },
  { id: 'p7lc09', dp: '7.4.2', t: 'calc', q: 'Worksheet 13 Q9: astronomers measure a meteorite approaching at 0.35c to be 275 m long. What is its length at rest?',
    a: E('l_{0} = ' + F('l', SQ('1 − ' + F('v^{2}', 'c^{2}'))) + ' = ' + F('275', SQ('1 − 0.35^{2}')) + ' = ' + F('275', '0.937') + ' = 294 m') },
  { id: 'p7lc10', dp: '7.4.2', t: 'calc', q: 'Worksheet 13 Q10: a Klingon vessel moves at 0.40c past the Enterprise. Its captain measures his forward and rear laser cannons 150 m apart. What distance do the Enterprise crew measure?',
    a: E('l = 150' + SQ('1 − 0.40^{2}') + ' = 150 × 0.917 = 137 m') }
] });

DECKS.push({ id: 'phys-m7-ev', fa: 'fa4', title: 'Evidence for special relativity', dps: ['7.4.2'], cards: [
  { id: 'p7ev01', dp: '7.4.2', t: 'con', q: 'What is an atomic clock, and why were atomic clocks important for testing relativity?',
    a: P('A clock that counts the oscillations of radiation from a transition in caesium-133 atoms: 9 192 631 770 per second, with an error of about 1 s in 100 million years.') + P('They are precise enough to detect the tiny time differences (nanoseconds) predicted by relativity at the speeds of aircraft.') },
  { id: 'p7ev02', dp: '7.4.2', t: 'calc', q: 'Cosmic-ray muons form 12 000 m up and travel at about 0.994c. With a half-life of 2.2 μs (the booklet’s value), about half survive each 650 m. Classically, what fraction should reach the ground?',
    a: E('number of half-lives = ' + F('12 000', '650') + ' ≈ 18.3') + E('fraction = (½)^{18.3} ≈ 3 × 10^{-6}') + P('About 3 in every million. But large numbers of muons are detected at the surface.') + N('Strictly, 2.2 μs is the muon’s mean lifetime (its half-life is about 1.5 μs), but the booklet’s argument works the same way.') },
  { id: 'p7ev03', dp: '7.4.2', t: 'calc', q: 'How does time dilation explain the number of muons reaching the ground?',
    a: E('γ = ' + F('1', SQ('1 − 0.994^{2}')) + ' = 9.14') + E('dilated half-life = 9.14 × 2.2 μs = 20.1 μs') + E('distance per half-life = 0.994 × 3.00 × 10^{8} × 20.1 × 10^{-6} ≈ 6000 m') + P('12 000 m is only 2 half-lives, so (½)² = ¼ of the muons should arrive, as observed. Time in the muons’ frame runs slow as seen from Earth.') },
  { id: 'p7ev04', dp: '7.4.2', t: 'con', q: 'How does the muon’s own frame of reference explain the same muon observations?',
    a: P('In the muon’s frame its half-life is the normal 2.2 μs, but the atmosphere rushes past at 0.994c, so the 12 000 m is length-contracted:') + E('l = ' + F('12 000', '9.14') + ' ≈ 1310 m') + P('That is only about 2 half-lives of travel (2 × 650 m), so about ¼ survive: the same prediction. Both frames agree, strong evidence for special relativity.') },
  { id: 'p7ev05', dp: '7.4.2', t: 'con', q: 'Describe the Hafele–Keating experiment (1971) and its results.',
    a: L(['Four caesium atomic clocks were flown around the world on commercial jets, first eastward then westward, and compared with clocks at the US Naval Observatory.', 'Relativity predicted the eastward clocks would lose time and the westward clocks gain time (combining speed and gravity effects).', 'The measured differences matched the predictions within experimental uncertainty, supporting relativity.']) + N('The booklet swaps the directions: it was the eastward (west-to-east) clocks that lost about 59 ns and the westward clocks that gained about 273 ns.'), v: 'p7hk' },
  { id: 'p7ev06', dp: '7.4.2', t: 'con', q: 'How was the Hafele–Keating result criticised and then confirmed?',
    a: P('Questions were raised about its accuracy (the Nobel Committee did not recognise it as proof). It was repeated with better methods:') + L(['University of Maryland, 1975–76: clocks at 10 km altitude for 15-hour flights tracked by radar and laser pulses; the measured 47.1 ns agreed with predictions to about 1.6%.', 'National Physical Laboratory, 1996: London–Washington; 39 ± 2 ns measured vs 39.8 ns predicted.', 'NPL 2010, around the globe: 230 ± 20 ns measured vs about 246 ns predicted.']) + P('Reproducible results with improving precision mean relativistic time effects are considered conclusively verified.') },
  { id: 'p7ev07', dp: '7.4.2', t: 'con', q: 'How do particle accelerators provide evidence for special relativity?',
    a: L(['No matter how much energy is supplied, particles never reach c. LHC protons reach 0.999 999 991c, only about 3 m s<sup>−1</sup> slower than light, yet energy has no upper limit.', 'At this speed γ ≈ 7500, so a proton’s momentum is about 7500 times the Newtonian value (the booklet says “almost 8000”), and accelerator designs must use relativistic momentum.', 'Fast unstable particles live longer by exactly the predicted γ (time dilation), routinely confirmed.', 'In 2014, transition rates of atoms moving at c/3 matched time-dilation predictions to the highest precision yet.']) },
  { id: 'p7ev08', dp: '7.4.2', t: 'con', q: 'What evidence for special relativity comes from cosmological studies?',
    a: L(['Cosmic rays (mostly protons and alpha particles) travel at close to c; very little time passes for them on journeys that take millions of years in our frame.', 'The light curves of distant supernovae (exploding stars) take longer to rise and fade than nearby ones, by the time dilation predicted for their speed of recession.', 'The classical Doppler effect alone does not fully explain the measured shifts of fast-moving objects; the relativistic Doppler effect, including time dilation, does.']) },
  { id: 'p7ev09', dp: '7.4.4', t: 'con', q: 'How does the energy from nuclear reactions support special relativity?',
    a: P('In nuclear reactions the products have less mass than the reactants (a mass defect). The energy released is measured to equal Δmc², exactly as predicted by Einstein’s mass–energy equivalence, which is a consequence of special relativity.') }
] });

DECKS.push({ id: 'phys-m7-rm', fa: 'fa4', title: 'Relativistic momentum', dps: ['7.4.3'], cards: [
  { id: 'p7rm01', dp: '7.4.3', t: 'eq', q: 'State the relativistic momentum equation and compare it with Newtonian momentum.',
    a: E('p_{v} = ' + F('m_{0}v', SQ('1 − ' + F('v^{2}', 'c^{2}'))) + ' = γm_{0}v') + L(['m<sub>0</sub> = rest mass, measured in the object’s own frame (kg)', 'v = velocity relative to the observer (m s<sup>−1</sup>)']) + P('Newtonian momentum p = m<sub>0</sub>v works well up to about 20% of c (as the booklet puts it); at higher speeds it underestimates the momentum.'), v: 'p7mom' },
  { id: 'p7rm02', dp: '7.4.3', t: 'con', q: 'Why is it misleading to say an object’s mass increases at high speed?',
    a: P('Older textbooks spoke of “mass dilation”, but the mass of an object (its rest or invariant mass, m<sub>0</sub>) does not change. What increases faster than Newtonian physics predicts is its <b>momentum</b> (and energy), through the factor γ.') },
  { id: 'p7rm03', dp: '7.4.3', t: 'con', q: 'Explain how relativistic momentum limits the maximum speed of a particle.',
    a: L(['As v → c, the denominator √(1 − v²/c²) → 0, so p → ∞.', 'Since Δp = FΔt, an infinite impulse (infinite force or time) would be needed to accelerate a mass to c.', 'Equivalently, increasing energy requires doing work, and the work (energy) required approaches infinity.']) + P('So no object with mass can reach the speed of light; c is the universal speed limit. Confirmed in particle accelerators.'), v: 'p7mom' },
  { id: 'p7rm04', dp: '7.4.3', t: 'con', q: 'How does relativistic kinetic energy compare with classical kinetic energy?',
    a: P('At low speeds they agree (K = ½mv²). At high speeds the relativistic kinetic energy is much larger and approaches infinity as v → c, while the classical formula only becomes infinite if v becomes infinite.') + P('Extension: total energy E = γm<sub>0</sub>c² = K + m<sub>0</sub>c², where m<sub>0</sub>c² is the rest energy.') },
  { id: 'p7rm05', dp: '7.4.3', t: 'exam', q: 'Worksheet 14 Q1: justify using relativistic momentum rather than Newtonian momentum for an object moving at 0.8c.',
    a: E('γ = ' + F('1', SQ('1 − 0.8^{2}')) + ' = 1.67') + P('The relativistic momentum is 67% larger than the Newtonian value, far more than any measurement uncertainty, so Newtonian momentum would give seriously wrong answers. Newtonian momentum is only a good approximation for v much less than c (below about 0.2c).') },
  { id: 'p7rm06', dp: '7.4.3', t: 'calc', q: 'Worksheet 14 Q2: an electron is accelerated to 0.98c. Find (a) its relativistic momentum, (b) the ratio of relativistic to Newtonian momentum.',
    a: E('γ = ' + F('1', SQ('1 − 0.98^{2}')) + ' = 5.03') + E('a) p = γm_{0}v = 5.03 × 9.109 × 10^{-31} × 0.98 × 3.00 × 10^{8} = 1.35 × 10^{-21} kg m s^{-1}') + P('b) The ratio is γ = <b>5.03</b>.') },
  { id: 'p7rm07', dp: '7.4.3', t: 'calc', q: 'Worksheet 14 Q3: find the momentum of a helium nucleus (mass 6.68 × 10^{-27} kg) moving at 0.200c.',
    a: E('p = ' + F('6.68 × 10^{-27} × 0.200 × 3.00 × 10^{8}', SQ('1 − 0.200^{2}')) + ' = ' + F('4.01 × 10^{-19}', '0.980')) + E('p = 4.09 × 10^{-19} kg m s^{-1}') },
  { id: 'p7rm08', dp: '7.4.3', t: 'calc', q: 'Worksheet 14 Q4: what is the rest mass of a particle with momentum 3.04 × 10^{-21} kg m s^{-1} travelling at exactly 0.45c?',
    a: E('m_{0} = ' + F('p' + SQ('1 − v^{2}/c^{2}'), 'v') + ' = ' + F('3.04 × 10^{-21} × ' + SQ('1 − 0.45^{2}'), '0.45 × 3.00 × 10^{8}')) + E('m_{0} = ' + F('3.04 × 10^{-21} × 0.893', '1.35 × 10^{8}') + ' = 2.01 × 10^{-29} kg') },
  { id: 'p7rm09', dp: '7.4.3', t: 'calc', q: 'Worksheet 14 Q5(b) (HSC 2020 Q30): (i) calculate the wavelength of a proton at 0.1c; (ii) explain the relativistic effect on the wavelength of a proton at 0.95c.',
    a: E('i) λ = ' + F('h', 'mv') + ' = ' + F('6.626 × 10^{-34}', '1.673 × 10^{-27} × 0.1 × 3.00 × 10^{8}') + ' = 1.3 × 10^{-14} m') + P('ii) At 0.95c, γ = 3.20, so the momentum is 3.2 times the Newtonian value. Since λ = h/p, the de Broglie wavelength is about 3.2 times <b>shorter</b> than the Newtonian prediction (λ = h/(γm<sub>0</sub>v)).') },
  { id: 'p7rm10', dp: '7.4.3', t: 'exam', q: 'Worksheet 14 Q6–Q7: outline one piece of experimental evidence for relativistic momentum, and explain how the expression for relativistic momentum predicts the upper speed limit c for particles with mass.',
    a: P('Evidence: in particle accelerators, the magnetic fields needed to bend particles of known speed in a circle (r = p/qB) match relativistic momentum, not Newtonian; and however much energy is supplied, electrons and protons never exceed c (e.g. LHC protons at 0.999 999 991c).') + P('Prediction: p = m<sub>0</sub>v/√(1 − v²/c²) → ∞ as v → c, so an infinite force or energy would be needed to reach c. The speed can approach but never reach c.') },
  { id: 'p7rm11', dp: '7.4.3', t: 'calc', q: 'Worksheet 14 Q8 (HSC 2021 Q28, 5 marks): a spaceship travels to a star at constant speed. 15 years pass on Earth but 9.4 years for the astronaut. (a) What is the distance to the star measured from Earth? (b) Outline how special relativity limits the ship’s maximum speed.',
    a: E('a) ' + SQ('1 − ' + F('v^{2}', 'c^{2}')) + ' = ' + F('t_{0}', 't') + ' = ' + F('9.4', '15') + ' = 0.627 → v = 0.779c') + E('d = vt = 0.779 × 3.00 × 10^{8} × 15 × 3.16 × 10^{7} = 1.1 × 10^{17} m (11.7 ly)') + P('b) As v → c, the relativistic momentum (and energy) of the ship → ∞, so an infinite force or energy would be needed to reach c. The ship can approach but never reach the speed of light.') },
  { id: 'p7rm12', dp: '7.4.3', t: 'calc', q: 'Worksheet 14 Q9 (extension): find the velocity of a proton with momentum 4.48 × 10^{-19} kg m s^{-1}.',
    a: P('Rearrange p = m<sub>0</sub>v/√(1 − v²/c²) to make v the subject:') + E('v = ' + F('p', SQ('m_{0}^{2} + p^{2}/c^{2}'))) + E('m_{0}c = 1.673 × 10^{-27} × 3.00 × 10^{8} = 5.02 × 10^{-19}') + E('v/c = ' + F('4.48', SQ('5.02^{2} + 4.48^{2}')) + ' = 0.666 → v = 2.00 × 10^{8} m s^{-1}') + N('Newtonian p/m would give 2.68 × 10⁸ m s⁻¹, far too large.') }
] });

DECKS.push({ id: 'phys-m7-mc', fa: 'fa4', title: 'E = mc² and its applications', dps: ['7.4.4'], cards: [
  { id: 'p7mc01', dp: '7.4.4', t: 'eq', q: 'State Einstein’s mass–energy equivalence relationship and what it means.',
    a: E('E = mc^{2}') + P('Mass is a form of energy: the energy contained in a body is proportional to its mass, with c² as the constant of proportionality. When a reaction releases energy, mass is lost; when it stores energy, mass increases.') + P('1.00 kg of mass is equivalent to 9.00 × 10<sup>16</sup> J.') + N('SI units only: E in J, m in kg, c in m s⁻¹.') },
  { id: 'p7mc02', dp: '7.4.4', t: 'eq', q: 'How can you calculate the energy released from a mass defect given in atomic mass units?',
    a: L(['Convert u to kg (1 u = 1.661 × 10<sup>−27</sup> kg) and use E = mc² for joules, or', 'use 1 u ≡ 931.5 MeV (data sheet): E (MeV) = Δm (u) × 931.5']) },
  { id: 'p7mc03', dp: '7.4.4', t: 'con', q: 'Give examples of mass–energy equivalence.',
    a: L(['The Sun and stars fuse light nuclei, converting mass to energy.', 'Nuclear reactors: fission of large nuclei.', 'Combustion of fuels: a tiny mass loss as chemical bonds rearrange.', 'Particle accelerators: collision energy is converted into new particles (energy to mass).', 'A charged battery, a compressed spring or a hotter object has slightly more mass than when uncharged, relaxed or cold.']) + P('In 1905 there was no direct evidence; Einstein suggested radioactivity. Every measurement since has agreed with E = mc².') },
  { id: 'p7mc04', dp: '7.4.4', t: 'con', q: 'How do chemical, nuclear and matter–antimatter reactions compare in the fraction of mass converted to energy?',
    a: L(['Chemical (combustion): about 10<sup>−8</sup> % (e.g. petrol 5 × 10<sup>−8</sup> %).', 'Nuclear fission: about 0.1%; fusion: about 0.6–0.7%.', 'Matter–antimatter annihilation: <b>100%</b>.']) + P('So nuclear reactions release millions of times more energy per kilogram than chemical ones.'), v: 'p7fuel' },
  { id: 'p7mc05', dp: '7.4.4', t: 'calc', q: 'Coal releases about 3.4 × 10^{7} J kg^{-1} on combustion. What mass is converted to energy when 1 kg burns, as a percentage?',
    a: E('Δm = ' + F('E', 'c^{2}') + ' = ' + F('3.4 × 10^{7}', '(3.00 × 10^{8})^{2}') + ' = 3.8 × 10^{-10} kg') + E('% = ' + F('3.8 × 10^{-10}', '1') + ' × 100 = 3.8 × 10^{-8} %') + P('Far too small to measure, so the mass seems unchanged in chemical reactions.') },
  { id: 'p7mc06', dp: '7.4.4', t: 'con', q: 'How does the Sun produce energy? Give the summary equation for the proton–proton chain.',
    a: P('In the core, the temperature and pressure are high enough to fuse hydrogen nuclei (protons) into helium. The products have less mass than the reactants; the mass defect is released as energy (E = mc²), mainly as gamma photons and from positrons annihilating with electrons.') + E('4 ' + NU(1, 1, 'H') + ' → ' + NU(4, 2, 'He') + ' + 2 ' + NU(0, '+1', 'e') + ' + 2ν + 2γ  (26.73 MeV)') + P('The Sun loses about 4.29 × 10<sup>9</sup> kg of mass every second, yet has enough hydrogen for about twice its current age (4.5 billion years). Energy takes about 100 000 years to reach the surface.') },
  { id: 'p7mc07', dp: '7.4.4', t: 'con', q: 'What happens when a particle meets its antiparticle?',
    a: P('They annihilate: <b>all</b> of their mass is converted to energy, E = Δmc². Examples: electron–positron, proton–antiproton, neutron–antineutron. An antiparticle has exactly the same mass but opposite charge (or opposite baryon number).') + P('For particles almost at rest, two gamma photons are produced travelling in <b>opposite directions</b>, so momentum (zero) is conserved. The energy is shared equally, and each photon’s wavelength follows from E = hf = hc/λ.') },
  { id: 'p7mc08', dp: '7.4.4', t: 'con', q: 'How does positron emission tomography (PET) work?',
    a: L(['A radiotracer containing a positron emitter (commonly fluorine-18 in glucose, made with a cyclotron) is injected; it collects in cells using lots of energy, such as cancer cells and active brain areas.', 'Each positron travels about 1 mm, slows, and annihilates with an electron, producing <b>two gamma rays in opposite directions</b>.', 'A ring of gamma cameras detects pairs arriving at the same time (within nanoseconds); unpaired gamma rays are ignored.', 'The computer draws a line between each pair; many lines locate the source, building an image.']) },
  { id: 'p7mc09', dp: '7.4.4', t: 'rec', q: 'Write the general equations for beta-minus and beta-plus decay, with an example of each.',
    a: E('β⁻:  ' + NU('A', 'Z', 'X') + ' → ' + NU('A', 'Z+1', 'Y') + ' + ' + NU(0, '−1', 'e') + ' + ' + NB) + E('e.g. ' + NU(14, 6, 'C') + ' → ' + NU(14, 7, 'N') + ' + ' + NU(0, '−1', 'e') + ' + ' + NB) + E('β⁺:  ' + NU('A', 'Z', 'X') + ' → ' + NU('A', 'Z−1', 'Y') + ' + ' + NU(0, '+1', 'e') + ' + ν') + E('e.g. ' + NU(10, 6, 'C') + ' → ' + NU(10, 5, 'B') + ' + ' + NU(0, '+1', 'e') + ' + ν') + L(['Neutron-rich nuclei undergo β⁻ (a neutron becomes a proton) and emit an <b>antineutrino</b>.', 'Proton-rich nuclei undergo β⁺ (a proton becomes a neutron) and emit a positron and a <b>neutrino</b>.', 'Mass numbers and atomic numbers must balance; use an arrow, never “=”; write the electron or positron symbol, not β.']) },
  { id: 'p7mc10', dp: '7.4.4', t: 'exam', q: 'Worksheet 15 Q1–Q3: what is mass–energy equivalence? Give three natural examples. Compare chemical, nuclear and matter–antimatter reactions.',
    a: P('Mass and energy are equivalent: mass is a form of energy and can be converted to other forms (and vice versa), E = mc².') + L(['Natural examples: fusion in the Sun and stars; radioactive decay (e.g. alpha decay, where products have less mass); positron–electron annihilation (e.g. from cosmic rays or β⁺ decay); natural nuclear fission.', 'Percentage of mass converted: chemical about 10<sup>−8</sup> %, nuclear about 0.1–0.7%, matter–antimatter 100%.']) },
  { id: 'p7mc11', dp: '7.4.4', t: 'calc', q: 'Worksheet 15 Q4: the Sun is 1.5 × 10^{11} m from the top of Earth’s atmosphere, where its intensity is 1361 W m^{-2}. Find (a) the Sun’s total power output, (b) the mass converted to energy per second.',
    a: P('The Sun radiates equally in all directions, so the power passes through a sphere of radius r:') + E('a) P = I × 4πr^{2} = 1361 × 4π × (1.5 × 10^{11})^{2} = 3.85 × 10^{26} W') + E('b) Δm = ' + F('E', 'c^{2}') + ' = ' + F('3.85 × 10^{26}', '9.00 × 10^{16}') + ' = 4.3 × 10^{9} kg each second') },
  { id: 'p7mc12', dp: '7.4.4', t: 'calc', q: 'Worksheet 15 Q5: an electron and a positron (each 9.109 × 10^{-31} kg) annihilate at rest. Find (a) the energy produced, (b) the wavelength of each of the two equal-energy gamma rays.',
    a: E('a) E = 2mc^{2} = 2 × 9.109 × 10^{-31} × (3.00 × 10^{8})^{2} = 1.64 × 10^{-13} J (1.02 MeV)') + E('b) each photon: E = 8.20 × 10^{-14} J') + E('λ = ' + F('hc', 'E') + ' = ' + F('6.626 × 10^{-34} × 3.00 × 10^{8}', '8.20 × 10^{-14}') + ' = 2.42 × 10^{-12} m') },
  { id: 'p7mc13', dp: '7.4.4', t: 'calc', q: 'Worksheet 15 Q6: two deuterium atoms (3.3435 × 10^{-27} kg each) fuse to form helium (6.64424 × 10^{-27} kg). Find (a) the mass converted, (b) the energy released per fusion, (c) the percentage of mass lost.',
    a: E('a) Δm = 2 × 3.3435 × 10^{-27} − 6.64424 × 10^{-27} = 4.276 × 10^{-29} kg') + E('b) E = Δmc^{2} = 4.276 × 10^{-29} × 9.00 × 10^{16} = 3.85 × 10^{-12} J (24.0 MeV)') + E('c) ' + F('4.276 × 10^{-29}', '6.6870 × 10^{-27}') + ' × 100 = 0.64%') },
  { id: 'p7mc14', dp: '7.4.4', t: 'calc', q: 'Worksheet 15 Q7: petrol releases 46 MJ kg^{-1}. (a) What percentage of the mass is converted to energy? (b) Compare the energy per kilogram from combustion, fusion and annihilation.',
    a: E('a) Δm = ' + F('4.6 × 10^{7}', '9.00 × 10^{16}') + ' = 5.1 × 10^{-10} kg per kg = 5.1 × 10^{-8} %') + L(['b) Combustion: 4.6 × 10<sup>7</sup> J kg<sup>−1</sup>', 'Deuterium fusion (0.64%): 0.0064 × 9.00 × 10<sup>16</sup> = 5.8 × 10<sup>14</sup> J kg<sup>−1</sup>, about 10<sup>7</sup> times more', 'Annihilation (100%): 9.0 × 10<sup>16</sup> J kg<sup>−1</sup>, about 2 × 10<sup>9</sup> times more than combustion']) },
  { id: 'p7mc15', dp: '7.4.4', t: 'calc', q: 'Worksheet 15 Q8: one tonne of coal produces about 20 GJ by combustion in 1.6 tonnes of air. Calculate the mass change.',
    a: E('Δm = ' + F('E', 'c^{2}') + ' = ' + F('20 × 10^{9}', '9.00 × 10^{16}') + ' = 2.2 × 10^{-7} kg') + P('A loss of about 0.22 mg from 2.6 tonnes of reactants: about 10<sup>−11</sup> of the total, undetectable by weighing.') }
] });

HSC.addModule({ id: 'phys-m7', focus: FOCUS, dotPoints: DOTS, decks: DECKS, viz: VIZ });
})();
