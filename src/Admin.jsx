import { useEffect, useState } from 'react'
import { defaultContent } from './content.js'
import { supabase, loadContent, saveContent } from './supabase.js'
import { STATUS, safeUrl } from './util.js'

const clone = (x) => JSON.parse(JSON.stringify(x))

function Field({ label, value, onChange, area, rows = 4, type = 'text' }) {
  return (
    <label className="fld">
      <span className="lbl">{label}</span>
      {area ? (
        <textarea className="in" rows={rows} value={value || ''} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="in" type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  )
}

function Danger({ label = 'Supprimer', onConfirm }) {
  const [armed, setArmed] = useState(false)
  return (
    <button type="button" className="btn small danger" onClick={() => (armed ? onConfirm() : setArmed(true))}>
      {armed ? 'Confirmer ?' : label}
    </button>
  )
}

function Moves({ arr, i, upd }) {
  return (
    <div className="btns">
      <button type="button" className="btn small" disabled={i === 0}
        onClick={() => upd((a) => { [a[i - 1], a[i]] = [a[i], a[i - 1]] })}>Monter</button>
      <button type="button" className="btn small" disabled={i === arr.length - 1}
        onClick={() => upd((a) => { [a[i + 1], a[i]] = [a[i], a[i + 1]] })}>Descendre</button>
      <Danger onConfirm={() => upd((a) => a.splice(i, 1))} />
    </div>
  )
}

function LinksEditor({ links, upd }) {
  return (
    <div className="fld">
      <span className="lbl">Liens (nom + adresse https://...)</span>
      {links.map((l, i) => (
        <div className="item" key={i}>
          <div className="g2">
            <Field label="Nom du lien" value={l.label} onChange={(v) => upd((a) => { a[i].label = v })} />
            <Field label="Adresse" type="url" value={l.url} onChange={(v) => upd((a) => { a[i].url = v })} />
          </div>
          <div className="btns"><Danger label="Retirer ce lien" onConfirm={() => upd((a) => a.splice(i, 1))} /></div>
        </div>
      ))}
      <div className="btns">
        <button type="button" className="btn small" onClick={() => upd((a) => a.push({ label: '', url: 'https://' }))}>Ajouter un lien</button>
      </div>
    </div>
  )
}

function clean(d) {
  const c = clone(d)
  const okLink = (l) => l.label && safeUrl(l.url)
  c.links = c.links.filter(okLink)
  c.projects.forEach((p) => { p.links = (p.links || []).filter(okLink) })
  c.projects = c.projects.filter((p) => p.titleFr || p.titleEn)
  c.skills = c.skills.filter((k) => k.name)
  c.interests = (c.interests || []).filter((x) => x.fr || x.en)
  c.edu = c.edu.filter((e) => e.fr || e.en)
  return c
}

function Editor() {
  const [d, setD] = useState(null)
  const [msg, setMsg] = useState({ t: 'Chargement…', err: false })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    loadContent().then((c) => {
      setD(clone({ ...defaultContent, ...(c || {}) }))
      setMsg({ t: 'Les changements sont publiés quand vous enregistrez.', err: false })
    })
  }, [])

  if (!d) return <div className="ed"><p>Chargement…</p></div>

  // upd(path-getter) helper: applique une mutation sur une copie
  const edit = (fn) => setD((cur) => { const c = clone(cur); fn(c); return c })
  const field = (key) => ({ value: d[key], onChange: (v) => edit((c) => { c[key] = v }) })

  async function save() {
    const c = clean(d)
    if (!c.name.trim()) return setMsg({ t: 'Le nom ne peut pas être vide.', err: true })
    setBusy(true)
    setMsg({ t: 'Enregistrement…', err: false })
    try {
      await saveContent(c)
      setD(clone(c))
      setMsg({ t: 'Enregistré. Le site public est à jour.', err: false })
    } catch (e) {
      setMsg({
        t: /row-level security|permission/i.test(e.message || '')
          ? 'Ce compte n’est pas autorisé à modifier. Ajoutez-le dans portfolio_admins (voir README).'
          : 'L’enregistrement a échoué : ' + (e.message || 'erreur inconnue'),
        err: true,
      })
    }
    setBusy(false)
  }

  return (
    <div className="ed">
      <div className="ed-in">
        <h2>Modifier le site</h2>

        <section className="sec">
          <h3>Profil</h3>
          <div className="g2"><Field label="Nom complet" {...field('name')} /><Field label="Lieu" {...field('location')} /></div>
          <Field label="Présentation (FR)" area {...field('leadFr')} />
          <Field label="Présentation (EN)" area {...field('leadEn')} />
          <div className="g2"><Field label="Langues (FR)" {...field('langFr')} /><Field label="Langues (EN)" {...field('langEn')} /></div>
          <div className="g2"><Field label="Disponibilité (FR)" {...field('availFr')} /><Field label="Disponibilité (EN)" {...field('availEn')} /></div>
          <div className="g2">
            <Field label="Photo d’accueil (chemin dans public/)" {...field('photoMain')} />
            <Field label="Photo « À propos »" {...field('photoAbout')} />
            <Field label="Fichier CV (chemin dans public/)" {...field('cvUrl')} />
          </div>
          <LinksEditor links={d.links} upd={(fn) => edit((c) => fn(c.links))} />
        </section>

        <section className="sec">
          <h3>À propos</h3>
          <Field label="Texte (FR) — séparez les paragraphes par une ligne vide" area rows={8} {...field('aboutFr')} />
          <Field label="Texte (EN)" area rows={8} {...field('aboutEn')} />
          <div className="g2"><Field label="Titre des domaines (FR)" {...field('interestsTitleFr')} /><Field label="Titre des domaines (EN)" {...field('interestsTitleEn')} /></div>
          {(d.interests || []).map((x, i) => (
            <div className="item" key={i}>
              <div className="g2">
                <Field label="Domaine (FR)" value={x.fr} onChange={(v) => edit((c) => { c.interests[i].fr = v })} />
                <Field label="Domaine (EN)" value={x.en} onChange={(v) => edit((c) => { c.interests[i].en = v })} />
              </div>
              <Moves arr={d.interests} i={i} upd={(fn) => edit((c) => fn(c.interests))} />
            </div>
          ))}
          <div className="btns">
            <button type="button" className="btn small" onClick={() => edit((c) => { c.interests = c.interests || []; c.interests.push({ fr: '', en: '' }) })}>Ajouter un domaine</button>
          </div>
        </section>

        <section className="sec">
          <h3>Projets</h3>
          {d.projects.map((p, i) => {
            const up = (fn) => edit((c) => fn(c.projects[i]))
            return (
              <div className="item" key={i}>
                <h3>{i + 1}. {p.titleFr || 'Nouveau projet'}</h3>
                <div className="g2">
                  <Field label="Titre (FR)" value={p.titleFr} onChange={(v) => up((x) => { x.titleFr = v })} />
                  <Field label="Titre (EN)" value={p.titleEn} onChange={(v) => up((x) => { x.titleEn = v })} />
                </div>
                <div className="g2">
                  <label className="fld">
                    <span className="lbl">Statut</span>
                    <select className="in" value={p.status} onChange={(e) => up((x) => { x.status = e.target.value })}>
                      {Object.keys(STATUS).map((k) => <option key={k} value={k}>{STATUS[k][0]}</option>)}
                    </select>
                  </label>
                  <Field label="Technologies" value={p.stack} onChange={(v) => up((x) => { x.stack = v })} />
                  <Field label="Année" value={p.year} onChange={(v) => up((x) => { x.year = v })} />
                  <Field label="Image (chemin dans public/projects/)" value={p.image} onChange={(v) => up((x) => { x.image = v })} />
                </div>
                <Field label="Description (FR)" area value={p.descFr} onChange={(v) => up((x) => { x.descFr = v })} />
                <Field label="Description (EN)" area value={p.descEn} onChange={(v) => up((x) => { x.descEn = v })} />
                <Field label="Ce que j'ai fait (FR) — une ligne par point" area rows={4} value={p.bulletsFr} onChange={(v) => up((x) => { x.bulletsFr = v })} />
                <Field label="Ce que j'ai fait (EN)" area rows={4} value={p.bulletsEn} onChange={(v) => up((x) => { x.bulletsEn = v })} />
                <Field label="Résultat (FR)" value={p.resultFr} onChange={(v) => up((x) => { x.resultFr = v })} />
                <Field label="Résultat (EN)" value={p.resultEn} onChange={(v) => up((x) => { x.resultEn = v })} />
                <LinksEditor links={p.links || []} upd={(fn) => up((x) => { x.links = x.links || []; fn(x.links) })} />
                <Moves arr={d.projects} i={i} upd={(fn) => edit((c) => fn(c.projects))} />
              </div>
            )
          })}
          <div className="btns">
            <button type="button" className="btn small" onClick={() => edit((c) => c.projects.push({ titleFr: '', titleEn: '', status: 'wip', stack: '', descFr: '', descEn: '', links: [], year: '', image: '', bulletsFr: '', bulletsEn: '', resultFr: '', resultEn: '' }))}>Ajouter un projet</button>
          </div>
        </section>

        <section className="sec">
          <h3>Compétences</h3>
          {d.skills.map((k, i) => (
            <div className="item" key={i}>
              <div className="g2">
                <label className="fld">
                  <span className="lbl">Catégorie</span>
                  <select className="in" value={k.group || 'tools'} onChange={(e) => edit((c) => { c.skills[i].group = e.target.value })}>
                    <option value="finance">Finance et comptabilité</option>
                    <option value="data">Analyse et économie</option>
                    <option value="tools">Outils</option>
                    <option value="soft">Savoir-être</option>
                  </select>
                </label>
                <Field label="Compétence" value={k.name} onChange={(v) => edit((c) => { c.skills[i].name = v })} />
                <Field label="Niveau (FR)" value={k.fr} onChange={(v) => edit((c) => { c.skills[i].fr = v })} />
                <Field label="Niveau (EN)" value={k.en} onChange={(v) => edit((c) => { c.skills[i].en = v })} />
              </div>
              <Moves arr={d.skills} i={i} upd={(fn) => edit((c) => fn(c.skills))} />
            </div>
          ))}
          <div className="btns">
            <button type="button" className="btn small" onClick={() => edit((c) => c.skills.push({ group: 'tools', name: '', fr: '', en: '' }))}>Ajouter une compétence</button>
          </div>
          <Field label="Note sous les compétences (FR)" area rows={2} {...field('skillNoteFr')} />
          <Field label="Note sous les compétences (EN)" area rows={2} {...field('skillNoteEn')} />
        </section>

        <section className="sec">
          <h3>Formation</h3>
          {d.edu.map((e, i) => (
            <div className="item" key={i}>
              <div className="g2">
                <Field label="Diplôme (FR)" value={e.fr} onChange={(v) => edit((c) => { c.edu[i].fr = v })} />
                <Field label="Diplôme (EN)" value={e.en} onChange={(v) => edit((c) => { c.edu[i].en = v })} />
              </div>
              <Field label="École et dates" value={e.detail} onChange={(v) => edit((c) => { c.edu[i].detail = v })} />
              <Moves arr={d.edu} i={i} upd={(fn) => edit((c) => fn(c.edu))} />
            </div>
          ))}
          <div className="btns">
            <button type="button" className="btn small" onClick={() => edit((c) => c.edu.push({ fr: '', en: '', detail: '' }))}>Ajouter une formation</button>
          </div>
        </section>

        <section className="sec">
          <h3>Contact</h3>
          <div className="g2"><Field label="Email" type="email" {...field('email')} /><Field label="Téléphone / WhatsApp" {...field('phone')} /></div>
          <Field label="Texte d’accueil (FR)" {...field('contactFr')} />
          <Field label="Texte d’accueil (EN)" {...field('contactEn')} />
        </section>
      </div>

      <div className="bar">
        <div className="in-bar">
          <span className={'msg' + (msg.err ? ' err' : '')}>{msg.t}</span>
          <a className="btn" href="/">Voir le site</a>
          <button type="button" className="btn primary" disabled={busy} onClick={save}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

export default function Admin() {
  const [session, setSession] = useState(undefined)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!supabase) return setSession(null)
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (!supabase)
    return (
      <div className="login">
        <h2>Admin</h2>
        <p className="note">Supabase n’est pas configuré. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (voir README), puis redéployez.</p>
      </div>
    )
  if (session === undefined) return null
  if (session) {
    return (
      <>
        <Editor />
        <div style={{ position: 'fixed', top: 12, right: 16 }}>
          <button type="button" className="btn small" onClick={() => supabase.auth.signOut()}>Se déconnecter</button>
        </div>
      </>
    )
  }
  async function login(e) {
    e.preventDefault()
    setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
    if (error) setErr('Email ou mot de passe incorrect.')
  }
  return (
    <form className="login" onSubmit={login}>
      <h2>Admin</h2>
      <Field label="Email" type="email" value={email} onChange={setEmail} />
      <Field label="Mot de passe" type="password" value={pw} onChange={setPw} />
      {err && <p className="note" style={{ color: 'var(--danger)' }}>{err}</p>}
      <button className="btn primary" type="submit">Se connecter</button>
    </form>
  )
}
