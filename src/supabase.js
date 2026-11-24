import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && key ? createClient(url, key) : null

export async function loadContent() {
  if (!supabase) return null
  const { data, error } = await supabase.from('portfolio').select('content').eq('id', 1).maybeSingle()
  if (error || !data) return null
  return data.content
}

export async function saveContent(content) {
  const { error } = await supabase
    .from('portfolio')
    .upsert({ id: 1, content, updated_at: new Date().toISOString() })
  if (error) throw error
}

export const BUCKET = 'site-files'

// Envoie un fichier dans le stockage Supabase et renvoie son adresse publique.
export async function uploadFile(file, folder) {
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '')
  const path = `${folder}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || undefined,
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}
