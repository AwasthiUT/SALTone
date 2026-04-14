import { createClient } from '@/utils/supabase/server'

export async function getMovies() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('Movies')
    .select()

  // console.log('========== FETCH ==========')
  // console.log('RAW DATA:', JSON.stringify(data, null, 2))
  // console.log('ERROR:', error)
  // console.log('====================================')

  if (error) throw new Error(error.message)

  // ✅ NORMALIZE DATA (VERY IMPORTANT)
  const normalized = data.map((item) => ({
    id: item.id,
    title: item.Title,
    thumbnail: item.Thumbnail,
    priority: item.Priority,
    date: item.Date,
    link: item.link,
    credits: item.Credits,
    is_active: item.is_active,
    gallery:
      typeof item.gallery === 'string'
        ? JSON.parse(item.gallery)
        : item.gallery,
  }))

  // ✅ SORT BY PRIORITY (1 → High, 2 → Mid, 3 → Low)
  normalized.sort((a, b) => a.priority - b.priority)

  // console.log('========== NORMALIZED ==========')
  // console.log(JSON.stringify(normalized, null, 2))

  return normalized
}