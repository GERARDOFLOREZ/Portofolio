export const STATUS = {
  live: ['En ligne', 'Live', 'live'],
  done: ['Terminé', 'Done', 'live'],
  wip: ['En cours', 'In progress', 'wip'],
  concept: ['Maquette', 'Concept', ''],
  validation: ['Validation', 'Validation', ''],
}

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
