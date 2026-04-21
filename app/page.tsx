import { createClient } from '@/utils/supabase/server'
import HomeV2 from './page_v2'
import HomeV3 from './page_v3'

/**
 * Landing Page Server Orchestrator
 * 
 * Dynamically queries the 'SCREEN_VERSIONS' table to determine which landing page
 * layout to display (e.g., 'v2' or 'v3') based on backend configuration.
 * 
 * Falls back to 'v3' (the newest Pro Mode redesign) if fetch fails.
 */
export default async function Page() {
  const supabase = await createClient()

  let version = 'v3' // Default to latest version if query fails

  try {
    const { data, error } = await supabase
      .from('SCREEN_VERSIONS')
      .select('version')
      .eq('screen_name', 'landing')
      // .eq('is_active', true)
      .single()

    if (!error && data?.version) {
      version = data.version
    } else if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows found (expected if table is empty)
      console.warn('Supabase query error when fetching screen version:', error.message)
    }
  } catch (err) {
    console.error('Failed to fetch landing version:', err)
  }

  // Render previous iteration
  if (version === 'v2') {
    return <HomeV2 />
  }

  // Render current iteration
  return <HomeV3 />
}
