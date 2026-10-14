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
