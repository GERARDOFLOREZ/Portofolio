export const STATUS = {
  live: ['En ligne', 'Live', 'good'],
  done: ['Terminé', 'Done', 'accent'],
  wip: ['En cours', 'In progress', 'mark'],
  concept: ['Maquette', 'Concept', 'muted'],
  validation: ['Validation', 'Validation', 'muted'],
}
export const STATUS_ORDER = ['live', 'done', 'wip', 'concept', 'validation']

export function safeUrl(u) {
  try {
    const x = new URL(String(u || '').trim())
    return x.protocol === 'https:' || x.protocol === 'http:' ? x.href : ''
  } catch {
    return ''
  }
}

export const waUrl = (phone) => {
  const d = String(phone || '').replace(/\D/g, '')
  return d ? 'https://wa.me/' + d : ''
}

export function colName(i) {
  let n = i, s = ''
  do {
    s = String.fromCharCode(65 + (n % 26)) + s
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
  return s
}
