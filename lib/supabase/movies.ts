import { createClient } from '@/utils/supabase/server'

export async function getMovies() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('Movies')
    .select()
    .order('Priority')

  if (error) throw new Error(error.message)
  return data
}