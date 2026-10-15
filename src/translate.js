/* Traduction automatique français → anglais (service gratuit MyMemory, sans clé).
   Le texte est coupé en morceaux de moins de 450 caractères, les sauts de ligne sont conservés. */
const MAX = 450

function chunks(par) {
  if (par.length <= MAX) return [par]
  const out = []
  let cur = ''
  for (const part of par.split(/(?<=[.!?;:])\s+/)) {
    if ((cur + ' ' + part).trim().length > MAX && cur) { out.push(cur); cur = part } else cur = (cur + ' ' + part).trim()
  }
  if (cur) out.push(cur)
  return out
}

async function one(q) {
  const r = await fetch('https://api.mymemory.translated.net/get?langpair=fr|en&q=' + encodeURIComponent(q))
  if (!r.ok) throw new Error('Service de traduction indisponible')
  const j = await r.json()
  const t = j && j.responseData && j.responseData.translatedText
  if (!t || j.responseStatus !== 200 || /MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(t)) {
    throw new Error('Limite quotidienne de traduction atteinte, réessayez demain ou traduisez à la main')
  }
  const d = document.createElement('textarea') // décode les entités HTML (&#39; etc.)
  d.innerHTML = t
  return d.value
}

export async function translateFr(text) {
  const src = String(text || '')
  if (!src.trim()) return ''
  const lines = src.split('\n')
  const out = []
  for (const line of lines) {
    if (!line.trim()) { out.push(line); continue }
    const parts = []
    for (const c of chunks(line)) parts.push(await one(c))
    out.push(parts.join(' '))
  }
  return out.join('\n')
}
