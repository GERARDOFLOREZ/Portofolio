import { useEffect, useState } from 'react'
import { defaultContent } from './content.js'
import { loadContent } from './supabase.js'
import { STATUS, safeUrl, waUrl } from './util.js'

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

export default function Portfolio() {
  const [s, setS] = useState(defaultContent)
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('lang')
      if (saved === 'fr' || saved === 'en') return saved
      return (navigator.language || 'fr').slice(0, 2) === 'en' ? 'en' : 'fr'
    } catch {
      return 'fr'
    }
  })

  useEffect(() => {
    loadContent().then((c) => c && setS(c))
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('lang', lang)
    } catch {}
  }, [lang])

  const parts = s.name.trim().split(/\s+/)
  const last = parts.length > 2 ? parts[parts.length - 1] : ''
  const first = last ? parts.slice(0, -1).join(' ') + ' ' : s.name
  const wa = waUrl(s.phone)

  return (
    <div className="wrap" style={{ paddingInline: 20, paddingBlock: '28px 64px' }}>
      <div className="top">
        <span className="mono">{s.location}</span>
        <div className="lang" role="group" aria-label="Langue / Language">
          <button type="button" aria-pressed={lang === 'fr'} onClick={() => setLang('fr')}>FR</button>
          <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
        </div>
      </div>

      <header className="hero">
        <h1>{first}{last && <em>{last}</em>}</h1>
        <Bi fr={s.leadFr} en={s.leadEn} as="p" className="lead" />
        <Bi fr={s.langFr} en={s.langEn} as="p" className="facts" />
        <div className="cta">
          <a className="btn primary" href="#projets"><Bi fr="Voir mes projets" en="See my projects" /></a>
          <a className="btn" href="#contact"><Bi fr="Me contacter" en="Contact me" /></a>
          {(s.links || []).map((l, i) => <Ext key={i} l={l} className="btn" />)}
        </div>
      </header>

      <section id="projets">
        <h2><Bi fr="Projets" en="Projects" /></h2>
        <div className="projects">
          {(s.projects || []).map((p, i) => {
            const st = STATUS[p.status] || STATUS.concept
            const links = (p.links || []).filter((l) => l.label && safeUrl(l.url))
            return (
              <article className="proj" key={i}>
                <div className="meta">
                  <span className={'tag ' + st[2]}><Bi fr={st[0]} en={st[1]} /></span>
                  {p.stack && <span className="stack">{p.stack}</span>}
                </div>
                <div>
                  <h3><Bi fr={p.titleFr} en={p.titleEn} /></h3>
                  <Bi fr={p.descFr} en={p.descEn} as="p" />
                  {links.length > 0 && (
                    <div className="plinks">{links.map((l, j) => <Ext key={j} l={l} />)}</div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section>
        <h2><Bi fr="Compétences" en="Skills" /></h2>
        <div className="cols">
          <div>
            <ul className="skills">
              {(s.skills || []).map((k, i) => (
                <li key={i}><span className="n">{k.name}</span><span className="d"><Bi fr={k.fr} en={k.en} /></span></li>
              ))}
            </ul>
          </div>
          <div><Bi fr={s.skillNoteFr} en={s.skillNoteEn} as="p" className="note" /></div>
        </div>
      </section>

      <section>
        <h2><Bi fr="Formation" en="Education" /></h2>
        <ul className="edu">
          {(s.edu || []).map((e, i) => (
            <li key={i}><b><Bi fr={e.fr} en={e.en} /></b><span className="d">{e.detail}</span></li>
          ))}
        </ul>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <div className="contact">
          <Bi fr={s.contactFr} en={s.contactEn} as="p" />
          {s.email && <div className="row"><span className="k">Email</span><span className="val">{s.email}</span></div>}
          {s.phone && (
            <div className="row">
              <span className="k">WhatsApp</span><span className="val">{s.phone}</span>
              {wa && <a href={wa} target="_blank" rel="noopener noreferrer"><Bi fr="Ouvrir WhatsApp" en="Open WhatsApp" /></a>}
            </div>
          )}
        </div>
      </section>

      <footer>© 2026 {s.name} · <a className="footlink" href="/admin">Admin</a></footer>
    </div>
  )
}
