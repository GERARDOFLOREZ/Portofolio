/* Arrière-plans décoratifs des sections : trader (À propos), comptabilité (Compétences), développement web (Contact).
   Tout est dessiné en SVG, sans image, et suit les thèmes clair / sombre. */
import { AcctChart } from './HeroCharts.jsx'

const T = ({ fr, en, ...p }) => (
  <text {...p}><tspan className="fr">{fr}</tspan><tspan className="en">{en}</tspan></text>
)
function rng(seed) {
  let a = seed
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const gauss = (r) => (r() + r() + r() + r() - 2) / 0.58

/* ---------- Marché des devises : bougies volatiles, indicateurs, outils de dessin ---------- */
function series(n) {
  const r = rng(23)
  const o = [], h = [], l = [], c = [], v = []
  let p = 0
  for (let i = 0; i < n; i++) {
    const open = p
    const drift = Math.sin(i / 8.5) * 0.35 + Math.sin(i / 3.1) * 0.15
    const close = open + drift + gauss(r) * 0.55
    const hi = Math.max(open, close) + Math.abs(gauss(r)) * 0.45
    const lo = Math.min(open, close) - Math.abs(gauss(r)) * 0.45
    o.push(open); c.push(close); h.push(hi); l.push(lo); v.push(0.25 + r() * 0.5 + Math.abs(close - open) * 0.5)
    p = close
  }
  let lowI = l.indexOf(Math.min(...l)), highI = h.indexOf(Math.max(...h))
  if (highI < lowI) { // on retourne la courbe : creux d'abord, sommet ensuite
    for (let i = 0; i < n; i++) {
      const oo = -o[i], cc = -c[i], hh = -l[i], ll = -h[i]
      o[i] = oo; c[i] = cc; h[i] = hh; l[i] = ll
    }
    lowI = l.indexOf(Math.min(...l)); highI = h.indexOf(Math.max(...h))
  }
  return { o, h, l, c, v, lowI, highI }
}
const sma = (a, k) => a.map((_, i) => (i < k - 1 ? null : a.slice(i - k + 1, i + 1).reduce((s, x) => s + x, 0) / k))
function rsi(c, k = 14) {
  return c.map((_, i) => {
    if (i < k) return null
    let g = 0, d = 0
    for (let j = i - k + 1; j <= i; j++) { const x = c[j] - c[j - 1]; if (x > 0) g += x; else d -= x }
    return d === 0 ? 100 : 100 - 100 / (1 + g / d)
  })
}

export function TraderBg({ box }) {
  const { w, h } = box
  const n = Math.max(28, Math.min(96, Math.round(w / 15)))
  const S = series(n)
  const top = h * 0.14, bot = h * 0.66
  const pmin = Math.min(...S.l), pmax = Math.max(...S.h)
  const Y = (p) => bot - ((p - pmin) / (pmax - pmin)) * (bot - top)
  const step = w / n
  const X = (i) => (i + 0.5) * step
  const bw = Math.max(3, step * 0.52)
  const price = (p) => (1.06 + ((p - pmin) / (pmax - pmin)) * 0.04).toFixed(4)
  const m1 = sma(S.c, 7), m2 = sma(S.c, 21)
  const line = (a) => a.map((v, i) => (v == null ? '' : `${i && a[i - 1] != null ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`)).join(' ')
  const R = rsi(S.c)
  const ry0 = h * 0.83, ry1 = h * 0.96
  const RY = (v) => ry1 - (v / 100) * (ry1 - ry0)
  const vy1 = h * 0.79, vmax = Math.max(...S.v)
  const supP = S.l[S.lowI], resP = S.h[S.highI]
  const fib = [0, 0.382, 0.5, 0.618, 1].map((f) => [f, resP - (resP - supP) * f])
  const x0 = X(S.highI)
  const last = n - 1
  const pct = (((resP - supP) / (pmax - pmin)) * 4).toFixed(2)
  return (
    <g className="trader">
      {[0.15, 0.3, 0.45, 0.6].map((f) => <line key={f} x1="0" x2={w} y1={top + (bot - top) * f} y2={top + (bot - top) * f} className="tgrid" />)}
      {Array.from({ length: Math.floor(w / 120) }, (_, i) => <line key={i} y1={top} y2={ry1} x1={(i + 1) * 120} x2={(i + 1) * 120} className="tgrid" />)}

      {/* zones (outil rectangle) */}
      <rect x={X(S.highI - 4)} y={Y(resP) - 4} width={w - X(S.highI - 4)} height={Math.max(18, (bot - top) * 0.07)} className="zone dn" />
      <rect x={X(Math.max(0, S.lowI - 3))} y={Y(supP) - Math.max(18, (bot - top) * 0.07) + 4} width={w - X(Math.max(0, S.lowI - 3))} height={Math.max(18, (bot - top) * 0.07)} className="zone up" />
      <T x={w - 14} y={Y(resP) + 16} textAnchor="end" className="tlbl dn" fr="ZONE D'OFFRE" en="SUPPLY ZONE" />
      <T x={w - 14} y={Y(supP) - 8} textAnchor="end" className="tlbl up" fr="ZONE DE DEMANDE" en="DEMAND ZONE" />

      {/* Fibonacci */}
      {fib.map(([f, p]) => (
        <g key={f}>
          <line x1={x0} x2={w} y1={Y(p)} y2={Y(p)} className="fibl" />
          <text x={x0 + 4} y={Y(p) - 3} className="tlbl mute">{f}</text>
        </g>
      ))}

      {/* volume */}
      {S.v.map((v, i) => <rect key={i} x={X(i) - bw / 2} width={bw} y={vy1 - (v / vmax) * h * 0.08} height={(v / vmax) * h * 0.08} className={'vol ' + (S.c[i] >= S.o[i] ? 'up' : 'dn')} />)}

      {/* bougies */}
      {S.o.map((o, i) => {
        const up = S.c[i] >= o
        const y1 = Y(Math.max(o, S.c[i])), y2 = Y(Math.min(o, S.c[i]))
        return (
          <g key={i} className={'cdl ' + (up ? 'up' : 'dn') + (i === last ? ' liv' : '')}>
            <line x1={X(i)} x2={X(i)} y1={Y(S.h[i])} y2={Y(S.l[i])} />
            <rect x={X(i) - bw / 2} y={y1} width={bw} height={Math.max(1.5, y2 - y1)} />
          </g>
        )
      })}

      {/* moyennes mobiles */}
      <path d={line(m1)} className="ma fast" fill="none" />
      <path d={line(m2)} className="ma slow" fill="none" />
      <text x="16" y={top - 30} className="tlbl mute">EUR/USD · H1 · MA 7 / MA 21</text>

      {/* supports / résistances */}
      <line x1="0" x2={w} y1={Y(resP)} y2={Y(resP)} className="sr dn" />
      <line x1="0" x2={w} y1={Y(supP)} y2={Y(supP)} className="sr up" />
      <g>
        <T x="16" y={Y(resP) - 6} className="tlbl dn" fr={`RÉSISTANCE ${price(resP)}`} en={`RESISTANCE ${price(resP)}`} />
        <text x="16" y={Y(supP) + 16} className="tlbl up">SUPPORT {price(supP)}</text>
      </g>

      {/* ordres BUY / SELL */}
      <g className="sig up">
        <path d={`M${X(S.lowI)} ${Y(S.l[S.lowI]) + 8} l-8 14 h16z`} />
        <rect x={X(S.lowI) - 24} y={Y(S.l[S.lowI]) + 24} width="48" height="19" rx="4" />
        <text x={X(S.lowI)} y={Y(S.l[S.lowI]) + 38} textAnchor="middle">BUY</text>
      </g>
      <g className="sig dn">
        <path d={`M${X(S.highI)} ${Y(S.h[S.highI]) - 8} l-8 -14 h16z`} />
        <rect x={X(S.highI) - 24} y={Y(S.h[S.highI]) - 43} width="48" height="19" rx="4" />
        <text x={X(S.highI)} y={Y(S.h[S.highI]) - 29} textAnchor="middle">SELL</text>
      </g>

      {/* règle (outil de mesure) */}
      <g className="ruler">
        <line x1={X(S.lowI)} y1={Y(supP)} x2={X(S.highI)} y2={Y(resP)} />
        <path d={`M${X(S.highI)} ${Y(resP)} l-10 3 m10 -3 l-3 10`} fill="none" />
        <rect x={(X(S.lowI) + X(S.highI)) / 2 - 62} y={(Y(supP) + Y(resP)) / 2 - 10} width="124" height="21" rx="4" />
        <T x={(X(S.lowI) + X(S.highI)) / 2} y={(Y(supP) + Y(resP)) / 2 + 5} textAnchor="middle" fr={`+${pct} % · ${S.highI - S.lowI} bougies`} en={`+${pct}% · ${S.highI - S.lowI} bars`} />
      </g>

      {/* prix courant */}
      <line x1={X(last)} x2={w} y1={Y(S.c[last])} y2={Y(S.c[last])} className="lastl" />
      <g className="ptag"><rect x={w - 66} y={Y(S.c[last]) - 10} width="62" height="20" rx="4" /><text x={w - 35} y={Y(S.c[last]) + 5} textAnchor="middle">{price(S.c[last])}</text></g>

      {/* RSI */}
      <rect x="0" y={ry0 - 6} width={w} height={ry1 - ry0 + 12} className="rsipanel" />
      <line x1="0" x2={w} y1={RY(70)} y2={RY(70)} className="fibl" />
      <line x1="0" x2={w} y1={RY(30)} y2={RY(30)} className="fibl" />
      <path d={R.map((v, i) => (v == null ? '' : `${i && R[i - 1] != null ? 'L' : 'M'}${X(i).toFixed(1)} ${RY(v).toFixed(1)}`)).join(' ')} className="rsil" fill="none" />
      <text x="16" y={ry0 - 10} className="tlbl mute">RSI 14</text>
      <text x={w - 14} y={RY(70) - 3} textAnchor="end" className="tlbl mute">70</text>
      <text x={w - 14} y={RY(30) - 3} textAnchor="end" className="tlbl mute">30</text>
    </g>
  )
}

/* ---------- Analyse des coûts : seuil de rentabilité ---------- */
export function CostChart({ box, nx, ny }) {
  const x0 = 56, y0 = box.h - 64, x1 = box.w - 28, y1 = 78
  const X = (q) => x0 + q * (x1 - x0)
  const Y = (v) => y0 - v * (y0 - y1)
  const pr = 0.62 + 0.3 * nx              // prix de vente : le pointeur à droite = on vend plus cher
  const F = 0.12 + 0.24 * ny              // coûts fixes : le pointeur vers le bas = plus de charges fixes
  const v = 0.32
  const q = Math.min(0.97, F / (pr - v))
  const R = (x) => pr * x, C = (x) => F + v * x
  return (
    <>
      <path d={`M${x0} ${y1 - 14}V${y0}H${x1 + 8}`} className="axis" fill="none" />
      <T x={x0 + 10} y={y1 - 14} className="axl" fr="Montants" en="Amounts" />
      <T x={x1} y={y0 + 30} textAnchor="end" className="axl" fr="Quantités vendues" en="Units sold" />
      <path d={`M${X(0)} ${Y(C(0))} L${X(q)} ${Y(C(q))} L${X(0)} ${Y(0)}Z`} className="loss" />
      <path d={`M${X(q)} ${Y(C(q))} L${X(1)} ${Y(C(1))} L${X(1)} ${Y(R(1))}Z`} className="profit" />
      <line x1={X(0)} x2={X(1)} y1={Y(F)} y2={Y(F)} className="guide" />
      <line x1={X(0)} y1={Y(C(0))} x2={X(1)} y2={Y(C(1))} className="curve sup" />
      <line x1={X(0)} y1={Y(R(0))} x2={X(1)} y2={Y(R(1))} className="curve dem" />
      <line x1={X(q)} y1={Y(R(q))} x2={X(q)} y2={y0} className="guide" />
      <circle cx={X(q)} cy={Y(R(q))} r="8" className="eqdot" />
      <T x={X(q)} y={y0 + 18} textAnchor="middle" className="tick" fr="Seuil de rentabilité" en="Break-even" />
      <T x={X(1) - 6} y={Y(R(1)) - 10} textAnchor="end" className="lbl dem" fr="Chiffre d'affaires" en="Revenue" />
      <T x={X(1) - 6} y={Y(C(1)) + 22} textAnchor="end" className="lbl sup" fr="Coût total" en="Total cost" />
      <T x={X(0) + 8} y={Y(F) - 8} className="tick" fr="Coûts fixes" en="Fixed costs" />
      <T x={X(q * 0.35)} y={Y(F * 0.45)} textAnchor="middle" className="zl dn" fr="PERTE" en="LOSS" />
      <T x={X(q + (1 - q) * 0.62)} y={Y(C(q + (1 - q) * 0.62) + (R(1) - C(1)) * 0.2)} textAnchor="middle" className="zl up" fr="BÉNÉFICE" en="PROFIT" />
    </>
  )
}

/* ---------- Compétences : un bilan et une analyse des coûts, côte à côte ---------- */
export function SkillsBg({ box, nx, ny }) {
  const wide = box.w >= 760
  const cw = wide ? box.w / 2 : box.w
  const ch = wide ? box.h : box.h / 2
  const b = { w: cw, h: ch }
  const title = (fr, en) => <T x={cw / 2} y="30" textAnchor="middle" className="ctitle" fr={fr} en={en} />
  return (
    <>
      <g>{title('BILAN COMPTABLE', 'BALANCE SHEET')}<AcctChart box={b} nx={nx} ny={ny} /></g>
      <g transform={wide ? `translate(${cw} 0)` : `translate(0 ${ch})`}>{title('ANALYSE DES COÛTS', 'COST ANALYSIS')}<CostChart box={b} nx={nx} ny={ny} /></g>
    </>
  )
}

/* ---------- Développement web : éditeur, navigateur, terminal ---------- */
export function DevBg({ box }) {
  const { w, h } = box
  const wide = w >= 820
  const k = Math.min(wide ? (w * 0.37) / 620 : (w * 0.96) / 620, (h - 40) / 400, 1.15)
  const tx = wide ? w - 620 * k - 28 : (w - 620 * k) / 2
  const ty = Math.max(10, (h - 400 * k) / 2 - 10)
  const code = [
    [['kw', 'import'], ['', ' { '], ['fn', 'useState'], ['', ' } '], ['kw', 'from'], ['str', " 'react'"]],
    [],
    [['kw', 'export default function '], ['fn', 'Portfolio'], ['', '() {']],
    [['', '  '], ['kw', 'const'], ['', ' [lang, setLang] = '], ['fn', 'useState'], ['', '('], ['str', "'fr'"], ['', ')']],
    [['', '  '], ['kw', 'return'], ['', ' (']],
    [['', '    '], ['tag', '<main>']],
    [['', '      '], ['tag', '<Hero />'], ['', ' '], ['tag', '<Projects />']],
    [['', '      '], ['tag', '<Contact'], ['', ' email='], ['str', '"gerard…"'], ['tag', ' />']],
    [['', '    '], ['tag', '</main>']],
    [['', '  )']],
    [['', '}']],
  ]
  return (
    <g className="dev" transform={`translate(${tx} ${ty}) scale(${k})`} opacity={wide ? 0.85 : 0.5}>
      <text x="560" y="62" className="glyph a">{'</>'}</text>
      <text x="468" y="34" className="glyph b">{'{ }'}</text>
      {/* éditeur */}
      <rect x="0" y="0" width="430" height="262" rx="12" className="win" />
      <circle cx="20" cy="18" r="5" className="dot r" /><circle cx="38" cy="18" r="5" className="dot y" /><circle cx="56" cy="18" r="5" className="dot g" />
      <text x="82" y="22" className="code mute">Portfolio.jsx</text>
      <line x1="0" x2="430" y1="36" y2="36" className="sep" />
      {code.map((ln, i) => (
        <g key={i}>
          <text x="14" y={62 + i * 18} className="code mute">{i + 1}</text>
          <text x="44" y={62 + i * 18} className="code" xmlSpace="preserve">
            {ln.map(([c, t], j) => <tspan key={j} className={c} style={{ whiteSpace: 'pre' }}>{t}</tspan>)}
          </text>
        </g>
      ))}
      <rect x="44" y="258" width="8" height="2" className="caret" />
      {/* navigateur */}
      <rect x="318" y="140" width="302" height="230" rx="12" className="win" />
      <circle cx="338" cy="158" r="4.5" className="dot r" /><circle cx="354" cy="158" r="4.5" className="dot y" /><circle cx="370" cy="158" r="4.5" className="dot g" />
      <rect x="388" y="149" width="214" height="19" rx="9.5" className="pill" />
      <text x="400" y="162" className="code mute" style={{ fontSize: 10.5 }}>gerard-lawson-noudo.vercel.app</text>
      <line x1="318" x2="620" y1="178" y2="178" className="sep" />
      <rect x="336" y="192" width="64" height="9" rx="4" className="sk" /><rect x="410" y="192" width="46" height="9" rx="4" className="sk" /><rect x="466" y="192" width="46" height="9" rx="4" className="sk" />
      <rect x="336" y="218" width="180" height="16" rx="5" className="sk acc" /><rect x="336" y="242" width="130" height="16" rx="5" className="sk acc" />
      <rect x="336" y="270" width="230" height="7" rx="3.5" className="sk" /><rect x="336" y="284" width="200" height="7" rx="3.5" className="sk" />
      <rect x="336" y="304" width="86" height="24" rx="12" className="sk acc" />
      <rect x="532" y="214" width="70" height="86" rx="10" className="sk" />
      {/* terminal */}
      <rect x="0" y="282" width="312" height="108" rx="12" className="term" />
      <text x="16" y="308" className="code tm">$ npm run build</text>
      <text x="16" y="328" className="code tm ok">✓ 79 modules transformed</text>
      <text x="16" y="348" className="code tm ok">✓ built in 1.4s</text>
      <text x="16" y="372" className="code tm">$ git push origin main</text>
      <rect x="170" y="362" width="8" height="12" className="caret" />
    </g>
  )
}
