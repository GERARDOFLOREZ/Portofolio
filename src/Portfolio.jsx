import { useEffect, useMemo, useRef, useState } from 'react'
import { defaultContent } from './content.js'
import { loadContent } from './supabase.js'
import { STATUS, STATUS_ORDER, safeUrl, waUrl } from './util.js'

export function Bi({ fr, en, as: Tag = 'span', className = '' }) {
  return (
    <>
      <Tag className={(className + ' fr').trim()}>{fr}</Tag>
      <Tag className={(className + ' en').trim()}>{en}</Tag>
    </>
  )
}

function Ext({ l, className }) {
  const url = safeUrl(l.url)
  if (!url || !l.label) return null
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      {l.label}
    </a>
  )
}

/* ---------- Hero : offre et demande, l'équilibre suit le pointeur ---------- */
function Hero({ s }) {
  const ref = useRef(null)
  const [box, setBox] = useState({ w: 1200, h: 640 })
  const [m, setM] = useState({ s: 0, t: 0 })
  const target = useRef({ s: 0, t: 0 })
  const raf = useRef(0)

  useEffect(() => {
    const el = ref.current
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    return () => { ro.disconnect(); cancelAnimationFrame(raf.current) }
  }, [])

  const run = () => {
    cancelAnimationFrame(raf.current)
    const step = () => {
      let again = false
      setM((cur) => {
        const ns = cur.s + (target.current.s - cur.s) * 0.12
        const nt = cur.t + (target.current.t - cur.t) * 0.12
        again = Math.abs(target.current.s - ns) > 0.0008 || Math.abs(target.current.t - nt) > 0.0008
        return { s: ns, t: nt }
      })
      if (again) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
  }
  const pick = (e) => {
    const b = ref.current.getBoundingClientRect()
    const nx = Math.min(1, Math.max(0, (e.clientX - b.left) / b.width))
    const ny = Math.min(1, Math.max(0, (e.clientY - b.top) / b.height))
    target.current = { s: (nx - 0.5) * 0.4, t: (0.5 - ny) * 0.3 }
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) run()
    else setM(target.current)
  }

  // repère : x = quantité, y = prix (valeurs entre 0 et 1)
  const x0 = 56, y0 = box.h - 64, x1 = box.w - 28, y1 = 30
  const X = (q) => x0 + q * (x1 - x0)
  const Y = (p) => y0 - p * (y0 - y1)
  const D = (q) => 0.95 - 0.8 * q + m.s
  const S = (q) => 0.1 + 0.8 * q + m.t
  const qe = (0.85 + m.s - m.t) / 1.6
  const pe = S(qe)
  const words = s.name.trim().split(/\s+/)

  return (
    <header className="hero" ref={ref} onPointerMove={pick} onPointerDown={pick}>
      <svg className="eq" width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true">
        <defs>
          <clipPath id="plot"><rect x={x0} y={y1} width={x1 - x0} height={y0 - y1} /></clipPath>
        </defs>
        <path d={`M${x0} ${y1 - 8}V${y0}H${x1 + 8}`} className="axis" fill="none" />
        <text x={x0 + 10} y={y1 + 6} className="axl"><tspan className="fr">Prix</tspan><tspan className="en">Price</tspan></text>
        <text x={x1} y={y0 + 30} textAnchor="end" className="axl"><tspan className="fr">Quantité</tspan><tspan className="en">Quantity</tspan></text>
        <g clipPath="url(#plot)">
          <line x1={X(0)} y1={Y(D(0))} x2={X(1)} y2={Y(D(1))} className="curve dem" />
          <line x1={X(0)} y1={Y(S(0))} x2={X(1)} y2={Y(S(1))} className="curve sup" />
        </g>
        <line x1={X(qe)} y1={Y(pe)} x2={X(qe)} y2={y0} className="guide" />
        <line x1={x0} y1={Y(pe)} x2={X(qe)} y2={Y(pe)} className="guide" />
        <text x={X(qe)} y={y0 + 18} textAnchor="middle" className="tick">Q*</text>
        <text x={x0 - 8} y={Y(pe) + 4} textAnchor="end" className="tick">P*</text>
        <circle cx={X(qe)} cy={Y(pe)} r="9" className="eqdot" />
        <text x={X(1) - 6} y={Y(D(1)) - 8} textAnchor="end" className="lbl dem"><tspan className="fr">Demande</tspan><tspan className="en">Demand</tspan></text>
        <text x={X(1) - 6} y={Y(S(1)) - 10} textAnchor="end" className="lbl sup"><tspan className="fr">Offre</tspan><tspan className="en">Supply</tspan></text>
      </svg>

      <div className="hero-in">
        <div className="hero-txt">
          {(s.availFr || s.availEn) && (
            <p className="avail"><span className="dot" aria-hidden="true" /><Bi fr={s.availFr} en={s.availEn} /></p>
          )}
          <h1 className="name">
            {words.map((w, i) => (
              <span key={i}><span className="mask"><span className="word" style={{ animationDelay: i * 90 + 'ms' }}>{w}</span></span>{' '}</span>
            ))}
          </h1>
          <Bi fr={s.leadFr} en={s.leadEn} as="p" className="lead" />
          <div className="cta">
            {s.cvUrl && (
              <a className="btn primary" href={s.cvUrl} download>
                <Bi fr="Télécharger mon CV" en="Download my CV" />
              </a>
            )}
            <a className="btn" href="#projets"><Bi fr="Voir mes projets" en="See my projects" /></a>
            <a className="btn" href="#contact"><Bi fr="Me contacter" en="Contact me" /></a>
          </div>
          <div className="cta">
            {(s.links || []).map((l, i) => <Ext key={i} l={l} className="btn small" />)}
          </div>
          <Bi fr={s.langFr} en={s.langEn} as="p" className="langs" />
        </div>
        {s.photoMain && (
          <figure className="portrait">
            <img src={s.photoMain} alt={'Portrait de ' + s.name} width="900" height="1125" />
          </figure>
        )}
      </div>
      <p className="hint" aria-hidden="true"><Bi fr="Bougez le pointeur : l'offre, la demande et l'équilibre se déplacent." en="Move the pointer: supply, demand and the equilibrium shift." /></p>
    </header>
  )
}

function Bullets({ fr, en }) {
  const lines = (t) => String(t || '').split('\n').map((x) => x.trim()).filter(Boolean)
  if (!lines(fr).length && !lines(en).length) return null
  return (
    <>
      <ul className="bul fr">{lines(fr).map((x, i) => <li key={i}>{x}</li>)}</ul>
      <ul className="bul en">{lines(en).map((x, i) => <li key={i}>{x}</li>)}</ul>
    </>
  )
}

/* ---------- Projets : tableau filtrable, triable, lignes dépliables ---------- */
function Projects({ s }) {
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('mine')
  const [open, setOpen] = useState(0)

  const all = useMemo(() => (s.projects || []).map((p, i) => ({ ...p, i })), [s.projects])
  const counts = useMemo(() => {
    const c = {}
    all.forEach((p) => { c[p.status] = (c[p.status] || 0) + 1 })
    return c
  }, [all])
  const items = useMemo(() => {
    let a = filter === 'all' ? all.slice() : all.filter((p) => p.status === filter)
    if (sort === 'az') a.sort((x, y) => (x.titleFr || '').localeCompare(y.titleFr || '', 'fr'))
    if (sort === 'status') a.sort((x, y) => STATUS_ORDER.indexOf(x.status) - STATUS_ORDER.indexOf(y.status))
    return a
  }, [all, filter, sort])

  return (
    <section id="projets" className="sec-page">
      <h2><Bi fr="Projets" en="Projects" /></h2>
      <div className="toolbar">
        <div className="chips" role="group" aria-label="Filtrer / Filter">
          <button type="button" className="chip" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
            <Bi fr="Tous" en="All" /> <b>{all.length}</b>
          </button>
          {STATUS_ORDER.filter((k) => counts[k]).map((k) => (
            <button key={k} type="button" className="chip" aria-pressed={filter === k} onClick={() => setFilter(k)}>
              <Bi fr={STATUS[k][0]} en={STATUS[k][1]} /> <b>{counts[k]}</b>
            </button>
          ))}
        </div>
        <div className="chips" role="group" aria-label="Trier / Sort">
          <button type="button" className="chip plain" aria-pressed={sort === 'mine'} onClick={() => setSort('mine')}><Bi fr="Mon ordre" en="My order" /></button>
          <button type="button" className="chip plain" aria-pressed={sort === 'az'} onClick={() => setSort('az')}>A–Z</button>
          <button type="button" className="chip plain" aria-pressed={sort === 'status'} onClick={() => setSort('status')}><Bi fr="Statut" en="Status" /></button>
        </div>
      </div>

      <ul className="table">
        {items.map((p) => {
          const st = STATUS[p.status] || STATUS.concept
          const links = (p.links || []).filter((l) => l.label && safeUrl(l.url))
          const isOpen = open === p.i
          return (
            <li key={p.i} className={'row' + (isOpen ? ' open' : '')}>
              <button type="button" className="rowhead" aria-expanded={isOpen} aria-controls={'p' + p.i} onClick={() => setOpen(isOpen ? -1 : p.i)}>
                <span className="rtitle"><Bi fr={p.titleFr} en={p.titleEn} /></span>
                <span className={'pill ' + st[2]}><Bi fr={st[0]} en={st[1]} /></span>
                <span className="rstack">{[p.year, p.stack].filter(Boolean).join(' · ')}</span>
                <span className="chev" aria-hidden="true" />
              </button>
              <div className="rowbody" id={'p' + p.i} role="region">
                <div className="rowinner">
                  <div className="rowtxt">
                    {p.image && <img className="shot" src={p.image} alt={'Capture de ' + p.titleFr} loading="lazy" />}
                    <Bi fr={p.descFr} en={p.descEn} as="p" />
                    <Bullets fr={p.bulletsFr} en={p.bulletsEn} />
                    {(p.resultFr || p.resultEn) && (
                      <p className="result"><b><Bi fr="Résultat" en="Result" /></b> <Bi fr={p.resultFr} en={p.resultEn} /></p>
                    )}
                    {links.length > 0 && (
                      <div className="plinks">{links.map((l, j) => <Ext key={j} l={l} className="btn small" />)}</div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      {items.length === 0 && <p className="note"><Bi fr="Aucun projet dans cette catégorie." en="No project in this category." /></p>}
    </section>
  )
}

/* ---------- À propos ---------- */
function About({ s }) {
  const paras = (t) => String(t || '').split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean)
  return (
    <section id="apropos" className="sec-page">
      <h2><Bi fr="À propos" en="About" /></h2>
      <div className="about">
        {s.photoAbout && (
          <figure className="aboutphoto">
            <img src={s.photoAbout} alt={'Photo de ' + s.name} width="900" height="1125" loading="lazy" />
          </figure>
        )}
        <div className="abouttxt">
          <div className="fr">{paras(s.aboutFr).map((x, i) => <p key={i}>{x}</p>)}</div>
          <div className="en">{paras(s.aboutEn).map((x, i) => <p key={i}>{x}</p>)}</div>
          {(s.interests || []).length > 0 && (
            <div className="interests">
              <h3><Bi fr={s.interestsTitleFr || 'Domaines visés'} en={s.interestsTitleEn || 'Fields of interest'} /></h3>
              <ul>
                {s.interests.map((x, i) => <li key={i}><Bi fr={x.fr} en={x.en} /></li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------- Compétences ---------- */
const GROUPS = [
  ['finance', 'Finance et comptabilité', 'Finance and accounting'],
  ['data', 'Analyse et économie', 'Analysis and economics'],
  ['tools', 'Outils', 'Tools'],
  ['soft', 'Savoir-être', 'Soft skills'],
]

function Skills({ s }) {
  const list = s.skills || []
  return (
    <section id="competences" className="sec-page">
      <h2><Bi fr="Compétences" en="Skills" /></h2>
      <div className="skillgroups">
        {GROUPS.map(([g, fr, en]) => {
          const items = list.map((k, i) => ({ ...k, i })).filter((k) => (k.group || 'tools') === g)
          if (!items.length) return null
          return (
            <div className="sgroup" key={g}>
              <h3><Bi fr={fr} en={en} /></h3>
              <ul className="skillchips">
                {items.map((k) => (
                  <li key={k.i} className="skill">
                    {k.name}{(k.fr || k.en) && <small> · <Bi fr={k.fr} en={k.en} /></small>}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
      <Bi fr={s.skillNoteFr} en={s.skillNoteEn} as="p" className="note" />
    </section>
  )
}

/* ---------- Parcours : une vraie chronologie ---------- */
function Path({ s }) {
  return (
    <section id="parcours" className="sec-page">
      <h2><Bi fr="Parcours" en="Education" /></h2>
      <ol className="timeline">
        {(s.edu || []).map((e, i) => (
          <li key={i}>
            <span className="when">{e.detail}</span>
            <span className="what"><Bi fr={e.fr} en={e.en} /></span>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ---------- Contact ---------- */
function Contact({ s }) {
  const [copied, setCopied] = useState(false)
  const wa = waUrl(s.phone)
  async function copy() {
    try {
      await navigator.clipboard.writeText(s.email)
    } catch {
      const el = document.getElementById('mail')
      const r = document.createRange()
      r.selectNodeContents(el)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(r)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <section id="contact" className="sec-page contact">
      <Bi fr={s.contactFr} en={s.contactEn} as="h2" className="big" />
      <div className="contact-row">
        {s.email && (
          <div className="mailbox">
            <span id="mail" className="val">{s.email}</span>
            <button type="button" className="btn small" onClick={copy}>
              {copied ? <Bi fr="Copié" en="Copied" /> : <Bi fr="Copier" en="Copy" />}
            </button>
          </div>
        )}
        {s.phone && (
          <div className="mailbox">
            <span className="val">{s.phone}</span>
            {wa && (
              <a className="btn small primary" href={wa} target="_blank" rel="noopener noreferrer">
                <Bi fr="Écrire sur WhatsApp" en="Message on WhatsApp" />
              </a>
            )}
          </div>
        )}
      </div>
      <div className="plinks" style={{ marginTop: 18 }}>
        {s.cvUrl && <a className="btn small" href={s.cvUrl} download><Bi fr="Télécharger mon CV" en="Download my CV" /></a>}
        {(s.links || []).map((l, i) => <Ext key={i} l={l} className="btn small" />)}
      </div>
      <span className="sr" aria-live="polite">{copied ? 'Email copié / copied' : ''}</span>
    </section>
  )
}

/* ---------- Page ---------- */
const NAV = [
  ['projets', 'Projets', 'Projects'],
  ['apropos', 'À propos', 'About'],
  ['competences', 'Compétences', 'Skills'],
  ['parcours', 'Parcours', 'Education'],
  ['contact', 'Contact', 'Contact'],
]

export default function Portfolio() {
  const [s, setS] = useState(defaultContent)
  const [active, setActive] = useState('')
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('lang')
      if (saved === 'fr' || saved === 'en') return saved
    } catch {}
    return (navigator.language || 'fr').slice(0, 2) === 'en' ? 'en' : 'fr'
  })
  const [dark, setDark] = useState(() => {
    try {
      const t = localStorage.getItem('theme')
      if (t) return t === 'dark'
    } catch {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const bar = useRef(null)

  useEffect(() => { loadContent().then((c) => c && setS({ ...defaultContent, ...c })) }, [])
  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem('lang', lang) } catch {}
  }, [lang])
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch {}
  }, [dark])

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const p = h.scrollHeight - h.clientHeight
      if (bar.current) bar.current.style.transform = `scaleX(${p > 0 ? h.scrollTop / p : 0})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    NAV.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el) })
    return () => io.disconnect()
  }, [s])

  return (
    <>
      <div className="progress" ref={bar} aria-hidden="true" />
      <nav className="nav" aria-label="Navigation">
        <a className="brand" href="#top" aria-label="Haut de page"><img src="/logo.svg" alt="" width="36" height="36" /></a>
        <div className="links">
          {NAV.map(([id, fr, en]) => (
            <a key={id} href={'#' + id} aria-current={active === id ? 'true' : undefined}><Bi fr={fr} en={en} /></a>
          ))}
        </div>
        <div className="tools">
          <div className="lang" role="group" aria-label="Langue / Language">
            <button type="button" aria-pressed={lang === 'fr'} onClick={() => setLang('fr')}>FR</button>
            <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
          </div>
          <button type="button" className="theme" onClick={() => setDark(!dark)} aria-label={dark ? 'Thème clair / Light theme' : 'Thème sombre / Dark theme'}>
            {dark ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
            )}
          </button>
        </div>
      </nav>

      <main id="top">
        <Hero s={s} />
        <div className="page">
          <Projects s={s} />
          <About s={s} />
          <Skills s={s} />
          <Path s={s} />
          <Contact s={s} />
        </div>
      </main>
      <footer className="foot">
        <span>© 2026 {s.name}</span>
        <span>{s.location} · <a className="footlink" href="/admin">Admin</a></span>
      </footer>
    </>
  )
}
