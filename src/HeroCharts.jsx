/* Trois scènes d'accueil, toutes pilotées par le pointeur (nx, ny entre 0 et 1) :
   économie (offre / demande), comptabilité (Actif = Passif + Capitaux propres), finance (intérêts composés). */
const T = ({ fr, en, ...p }) => (
  <text {...p}><tspan className="fr">{fr}</tspan><tspan className="en">{en}</tspan></text>
)
const num = (v, d = 1, lang = 'fr') => {
  const s = v.toFixed(d)
  return lang === 'fr' ? s.replace('.', ',') : s
}

export function EcoChart({ box, nx, ny }) {
  const s = (nx - 0.5) * 0.4, t = (0.5 - ny) * 0.3
  const x0 = 56, y0 = box.h - 64, x1 = box.w - 28, y1 = 30
  const X = (q) => x0 + q * (x1 - x0)
  const Y = (p) => y0 - p * (y0 - y1)
  const D = (q) => 0.95 - 0.8 * q + s
  const S = (q) => 0.1 + 0.8 * q + t
  const qe = (0.85 + s - t) / 1.6
  const pe = S(qe)
  const ql = box.w > 900 ? Math.min(0.9, Math.max(0.15, (box.w - 540 - x0) / (x1 - x0))) : 0.86
  return (
    <>
      <defs><clipPath id="plot"><rect x={x0} y={y1} width={x1 - x0} height={y0 - y1} /></clipPath></defs>
      <path d={`M${x0} ${y1 - 8}V${y0}H${x1 + 8}`} className="axis" fill="none" />
      <T x={x0 + 10} y={y1 + 6} className="axl" fr="Prix" en="Price" />
      <T x={x1} y={y0 + 30} textAnchor="end" className="axl" fr="Quantité" en="Quantity" />
      <g clipPath="url(#plot)">
        <line x1={X(0)} y1={Y(D(0))} x2={X(1)} y2={Y(D(1))} className="curve dem" />
        <line x1={X(0)} y1={Y(S(0))} x2={X(1)} y2={Y(S(1))} className="curve sup" />
      </g>
      <line x1={X(qe)} y1={Y(pe)} x2={X(qe)} y2={y0} className="guide" />
      <line x1={x0} y1={Y(pe)} x2={X(qe)} y2={Y(pe)} className="guide" />
      <text x={X(qe)} y={y0 + 18} textAnchor="middle" className="tick">Q*</text>
      <text x={x0 - 8} y={Y(pe) + 4} textAnchor="end" className="tick">P*</text>
      <circle cx={X(qe)} cy={Y(pe)} r="9" className="eqdot" />
      <T x={X(ql)} y={Y(D(ql)) + 26} textAnchor="middle" className="lbl dem" fr="Demande" en="Demand" />
      <T x={X(ql)} y={Y(S(ql)) - 14} textAnchor="middle" className="lbl sup" fr="Offre" en="Supply" />
    </>
  )
}

export function AcctChart({ box, nx, ny }) {
  const x0 = 56, y0 = box.h - 64, x1 = box.w - 28, y1 = 60
  const H = y0 - y1
  const wide = box.w > 900
  const total = 0.5 + 0.5 * nx            // taille du bilan (le pointeur à droite = l'entreprise grandit)
  const debt = 0.1 + 0.75 * ny            // part de dettes (le pointeur en bas = plus d'endettement)
  const th = total * H
  const fixed = 0.55, W = Math.max(70, Math.min(170, (x1 - x0) * (wide ? 0.14 : 0.2)))
  const cA = x0 + (x1 - x0) * (wide ? 0.58 : 0.26), cP = x0 + (x1 - x0) * (wide ? 0.82 : 0.7)
  const gap = 3
  const seg = (cx, from, h, cls, fr, en) => (
    <g key={cls}>
      <rect x={cx - W / 2} y={y0 - from - h} width={W} height={Math.max(0, h - gap)} rx="6" className={'seg ' + cls} />
      {h > 34 && <T x={cx} y={y0 - from - h / 2 + 5} textAnchor="middle" className={'seglbl ' + cls} fr={fr} en={en} />}
    </g>
  )
  const lev = debt / (1 - debt)
  return (
    <>
      <path d={`M${x0} ${y0}H${x1 + 8}`} className="axis" fill="none" />
      {seg(cA, 0, th * fixed, 'a1', 'Immobilisations', 'Fixed assets')}
      {seg(cA, th * fixed, th * (1 - fixed), 'a2', 'Trésorerie', 'Cash')}
      {seg(cP, 0, th * (1 - debt), 'p2', 'Capitaux propres', 'Equity')}
      {seg(cP, th * (1 - debt), th * debt, 'p1', 'Dettes', 'Liabilities')}
      <text x={(cA + cP) / 2} y={y0 - th / 2 + 14} textAnchor="middle" className="eqsign">=</text>
      <T x={cA} y={y0 + 24} textAnchor="middle" className="tick" fr="ACTIF" en="ASSETS" />
      <T x={cP} y={y0 + 24} textAnchor="middle" className="tick" fr="PASSIF" en="LIABILITIES + EQUITY" />
      <T x={x0 + 10} y={y1 - 14} className="axl" fr={`Dettes / Capitaux propres = ${num(lev, 2)}`} en={`Debt / Equity = ${num(lev, 2, 'en')}`} />
    </>
  )
}

export function FinChart({ box, nx, ny }) {
  const x0 = 56, y0 = box.h - 64, x1 = box.w - 28, y1 = 60
  const r = 0.01 + 0.11 * nx               // taux : 1 % à 12 %
  const yrs = Math.round(10 + 20 * ny)     // horizon : 10 à 30 ans
  const X = (t) => x0 + (t / yrs) * (x1 - x0)
  const vmax = Math.pow(1 + r, yrs)
  const Y = (v) => y0 - ((v - 1) / (vmax - 1 + 1e-9)) * (y0 - y1)
  const pts = Array.from({ length: 61 }, (_, i) => (i / 60) * yrs)
  const comp = pts.map((t) => `${X(t).toFixed(1)} ${Y(Math.pow(1 + r, t)).toFixed(1)}`)
  const simple = (t) => 1 + r * t
  const area = `M${X(0)} ${Y(1)} ` + comp.map((c) => 'L' + c).join(' ') + ` L${X(yrs)} ${Y(simple(yrs))} L${X(0)} ${Y(1)}Z`
  return (
    <>
      <defs><clipPath id="plotf"><rect x={x0} y={y1 - 10} width={x1 - x0 + 10} height={y0 - y1 + 10} /></clipPath></defs>
      <path d={`M${x0} ${y1 - 18}V${y0}H${x1 + 8}`} className="axis" fill="none" />
      <T x={x0 + 10} y={y1 - 8} className="axl" fr="Capital" en="Capital" />
      <T x={x1} y={y0 + 30} textAnchor="end" className="axl" fr="Temps (années)" en="Time (years)" />
      <g clipPath="url(#plotf)">
        <path d={area} className="gap" />
        <line x1={X(0)} y1={Y(1)} x2={X(yrs)} y2={Y(simple(yrs))} className="curve sup" strokeDasharray="2 9" />
        <path d={'M' + comp.join(' L')} className="curve dem" fill="none" />
      </g>
      <circle cx={X(yrs)} cy={Y(vmax)} r="9" className="eqdot" />
      <text x={X(yrs) - 16} y={Y(vmax) + 4} textAnchor="end" className="tick">×{num(vmax, 1)}</text>
      <T x={x1 - 20} y={y0 + 14} textAnchor="end" className="tick" fr={`${yrs} ans · taux ${num(r * 100, 1)} %`} en={`${yrs} yrs · rate ${num(r * 100, 1, 'en')}%`} />
      <T x={x0 + 24} y={y1 + 16} className="lbl dem" fr="Intérêts composés" en="Compound interest" />
      <T x={x0 + 24} y={y1 + 38} className="lbl sup" fr="Intérêts simples" en="Simple interest" />
      <circle cx={x0 + 12} cy={y1 + 11} r="4.5" className="swd" />
      <circle cx={x0 + 12} cy={y1 + 33} r="4.5" className="sws" />
    </>
  )
}
