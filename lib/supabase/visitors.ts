import { createClient } from '@/utils/supabase/server'

export type Visitor = {
  id: string
  browser_id: string
  ip_address: string
  user_name: string | null
  memory_json: any
  archived: any // Contains { facts: string[], behaviors: string[] }
  behavior_profile: any
  last_seen: string
}

/**
 * Resolves a visitor by Browser ID (High Priority) or IP Address (Fallback)
 */
export async function getVisitor(browserId: string | null, ip: string | null): Promise<Visitor | null> {
  const supabase = await createClient()

  // 1. Try Browser ID first (most specific identity)
  if (browserId) {
    const { data } = await supabase
      .from('visitors')
      .select('*')
      .eq('browser_id', browserId)
      .single()
    
    if (data) return data as Visitor
  }

  // 2. Try IP Address fallback (same person, different browser)
  if (ip) {
    const { data } = await supabase
      .from('visitors')
      .select('*')
      .eq('ip_address', ip)
      .order('last_seen', { ascending: false })
      .limit(1)
      .maybeSingle()
    
    if (data) return data as Visitor
  }

  return null
}

/**
 * Creates or updates a visitor record
 */
export async function upsertVisitor(visitor: Partial<Visitor>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('visitors')
    .upsert({
      ...visitor,
      last_seen: new Date().toISOString()
    }, {
      onConflict: 'browser_id'
    })
    .select()
    .single()

  if (error) console.error("Upsert Visitor Error:", error)
  return { data, error }
}

/**
 * Updates specifically the user's name — applies to ALL rows with the same IP
 * so the name stays consistent if the same person switches browsers.
 */
export async function updateVisitorName(browserId: string, name: string) {
  const supabase = await createClient()

  // Get the IP for this browser so we can update all their rows
  const { data: row } = await supabase
    .from('visitors')
    .select('ip_address')
    .eq('browser_id', browserId)
    .single()

  const ip = row?.ip_address

  // Update the specific browser row
  await supabase
    .from('visitors')
    .update({ user_name: name, last_seen: new Date().toISOString() })
    .eq('browser_id', browserId)

  // Also sync the name across all other rows with the same IP
  if (ip) {
    await supabase
      .from('visitors')
      .update({ user_name: name })
      .eq('ip_address', ip)
      .neq('browser_id', browserId) // don't double-update the one we already did
  }
}

/**
 * Adds a new fact to the user's memory_json.
 * Scoped to the active browser session — dedup is case-insensitive.
 */
export async function addVisitorFact(browserId: string, fact: string) {
  const supabase = await createClient()
  
  const { data } = await supabase.from('visitors').select('memory_json').eq('browser_id', browserId).single()
  
  const currentMemory = data?.memory_json || {}
  const facts = currentMemory.facts || []
  
  const factLower = fact.toLowerCase().trim()
  const isDuplicate = facts.some((f: string) => f.toLowerCase().trim() === factLower)
  
  if (!isDuplicate) {
    facts.push(fact)
  
    const { error } = await supabase
      .from('visitors')
      .update({ 
        memory_json: { ...currentMemory, facts },
        last_seen: new Date().toISOString() 
      })
      .eq('browser_id', browserId)

    if (error) console.error("Add Visitor Fact Error:", error)
  }
}

/**
 * Adds a new behavior trait to the user's behavior_profile.
 * Scoped to the active browser session.
 */
export async function addVisitorBehavior(browserId: string, behavior: string) {
  const supabase = await createClient()
  
  const { data } = await supabase.from('visitors').select('behavior_profile').eq('browser_id', browserId).single()
  
  const behaviors = data?.behavior_profile || []
  
  if (!behaviors.includes(behavior)) {
    behaviors.push(behavior)
  }
  
  const { error } = await supabase
    .from('visitors')
    .update({ 
      behavior_profile: behaviors,
      last_seen: new Date().toISOString() 
    })
    .eq('browser_id', browserId)

  if (error) console.error("Add Visitor Behavior Error:", error)
}

/**
 * Removes a specific fact across ALL rows matching the same IP.
 * 
 * Why IP-wide: if the same person has 3 browser rows and asks to forget
 * something in Browser A, it must also be removed from B and C.
 * Otherwise the IP fallback will re-surface the data on the next visit.
 */
export async function removeVisitorFact(browserId: string, factToRemove: string) {
  const supabase = await createClient()

  // Get the IP for this browser so we can update all their rows
  const { data: callerRow } = await supabase
    .from('visitors')
    .select('ip_address')
    .eq('browser_id', browserId)
    .single()

  const ip = callerRow?.ip_address
  if (!ip) return

  // Fetch ALL rows for this IP
  const { data: allRows } = await supabase
    .from('visitors')
    .select('browser_id, memory_json, archived')
    .eq('ip_address', ip)

  if (!allRows || allRows.length === 0) return

  // Apply the removal to every row
  for (const row of allRows) {
    const currentMemory = row.memory_json || {}
    let facts: string[] = currentMemory.facts || []

    let archived = row.archived || { facts: [], behaviors: [] }
    if (Array.isArray(archived)) archived = { facts: archived, behaviors: [] }
    if (!archived.facts) archived.facts = []
    if (!archived.behaviors) archived.behaviors = []

    const factsToRemove = facts.filter((f: string) =>
      f.toLowerCase().includes(factToRemove.toLowerCase()) ||
      factToRemove.toLowerCase().includes(f.toLowerCase())
    )

    if (factsToRemove.length > 0) {
      facts = facts.filter((f: string) => !factsToRemove.includes(f))
      archived.facts = [...archived.facts, ...factsToRemove]

      const { error } = await supabase
        .from('visitors')
        .update({
          memory_json: { ...currentMemory, facts },
          archived,
          last_seen: new Date().toISOString()
        })
        .eq('browser_id', row.browser_id)

      if (error) console.error(`Archive Visitor Fact Error (browser: ${row.browser_id}):`, error)
    }
  }
}

/**
 * Removes a specific behavior across ALL rows matching the same IP.
 * Same reasoning as removeVisitorFact — must be IP-wide to be effective.
 */
export async function removeVisitorBehavior(browserId: string, behaviorToRemove: string) {
  const supabase = await createClient()

  const { data: callerRow } = await supabase
    .from('visitors')
    .select('ip_address')
    .eq('browser_id', browserId)
    .single()

  const ip = callerRow?.ip_address
  if (!ip) return

  const { data: allRows } = await supabase
    .from('visitors')
    .select('browser_id, behavior_profile, archived')
    .eq('ip_address', ip)

  if (!allRows || allRows.length === 0) return

  for (const row of allRows) {
    let behaviors: string[] = row.behavior_profile || []

    let archived = row.archived || { facts: [], behaviors: [] }
    if (Array.isArray(archived)) archived = { facts: archived, behaviors: [] }
    if (!archived.facts) archived.facts = []
    if (!archived.behaviors) archived.behaviors = []

    const behaviorsToRemove = behaviors.filter((b: string) =>
      b.toLowerCase().includes(behaviorToRemove.toLowerCase()) ||
      behaviorToRemove.toLowerCase().includes(b.toLowerCase())
    )

    if (behaviorsToRemove.length > 0) {
      behaviors = behaviors.filter((b: string) => !behaviorsToRemove.includes(b))
      archived.behaviors = [...archived.behaviors, ...behaviorsToRemove]

      const { error } = await supabase
        .from('visitors')
        .update({
          behavior_profile: behaviors,
          archived,
          last_seen: new Date().toISOString()
        })
        .eq('browser_id', row.browser_id)

      if (error) console.error(`Archive Visitor Behavior Error (browser: ${row.browser_id}):`, error)
    }
  }
}

/**
 * Completely wipes all memory, name, and behavior for a visitor —
 * across ALL browser rows that share the same IP.
 * 
 * Use this when the visitor explicitly asks to be fully forgotten.
 * Archived data is preserved (for your reference) but active memory is cleared.
 */
export async function forgetVisitorCompletely(browserId: string) {
  const supabase = await createClient()

  const { data: callerRow } = await supabase
    .from('visitors')
    .select('ip_address')
    .eq('browser_id', browserId)
    .single()

  const ip = callerRow?.ip_address
  if (!ip) return

  const { error } = await supabase
    .from('visitors')
    .update({
      user_name: null,
      memory_json: { facts: [] },
      behavior_profile: [],
      last_seen: new Date().toISOString()
    })
    .eq('ip_address', ip) // Wipes ALL rows for this IP at once

  if (error) console.error("Forget Visitor Completely Error:", error)
  else console.log(`Wiped all data for IP ${ip} (all ${browserId}'s browser rows)`)
}
