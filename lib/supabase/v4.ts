/**
 * Supabase V4 Data Access Layer
 * 
 * Fetches dynamic content for the V4 'Split World' landing page from the 'main_v4' table.
 * Data includes headlines, descriptions, CTA text, and metadata-driven tags.
 */
import { createClient } from '@/utils/supabase/client'

export async function getMainV4Data() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('main_v4')
    .select('*')
    .eq('is_active', true)

  // console.log("V4 Data:", data);

  if (error) {
    console.error('Failed to fetch V4 data:', error)
    return null
  }

  return data
}
