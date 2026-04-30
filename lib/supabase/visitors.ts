import { createClient } from '@/utils/supabase/server'

export type Visitor = {
  id: string
  browser_id: string
  ip_address: string
  user_name: string | null
  memory_json: any
  archived: any // Contains { facts: string[], behaviors: string[] }
  behavior_profile: any // The new column for psychological profiling
  last_seen: string
}

/**
 * Resolves a visitor by Browser ID (High Priority) or IP Address (Fallback)
 */
export async function getVisitor(browserId: string | null, ip: string | null): Promise<Visitor | null> {
  const supabase = await createClient()

  // 1. Try Browser ID first
  if (browserId) {
    const { data } = await supabase
      .from('visitors')
      .select('*')
      .eq('browser_id', browserId)
      .single()
    
    if (data) return data as Visitor
  }

  // 2. Try IP Address fallback
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
 * Updates specifically the user's name
 */
export async function updateVisitorName(browserId: string, name: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('visitors')
    .update({ user_name: name, last_seen: new Date().toISOString() })
    .eq('browser_id', browserId)
  
  if (error) console.error("Update Visitor Name Error:", error)
}

/**
 * Adds a new fact to the user's memory_json
 */
export async function addVisitorFact(browserId: string, fact: string) {
  const supabase = await createClient()
  
  // Get current memory
  const { data } = await supabase.from('visitors').select('memory_json').eq('browser_id', browserId).single()
  
  const currentMemory = data?.memory_json || {}
  const facts = currentMemory.facts || []
  
  if (!facts.includes(fact)) {
    facts.push(fact)
  }
  
  const { error } = await supabase
    .from('visitors')
    .update({ 
      memory_json: { ...currentMemory, facts },
      last_seen: new Date().toISOString() 
    })
    .eq('browser_id', browserId)

  if (error) console.error("Add Visitor Fact Error:", error)
}

/**
 * Adds a new behavior trait to the user's behavior_profile
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
 * Moves a fact from active memory to archived object
 */
export async function removeVisitorFact(browserId: string, factToRemove: string) {
  const supabase = await createClient()
  
  const { data } = await supabase.from('visitors').select('memory_json, archived').eq('browser_id', browserId).single()
  
  const currentMemory = data?.memory_json || {}
  let facts = currentMemory.facts || []
  
  let archived = data?.archived || { facts: [], behaviors: [] }
  if (Array.isArray(archived)) archived = { facts: archived, behaviors: [] }
  if (!archived.facts) archived.facts = []
  if (!archived.behaviors) archived.behaviors = []
  
  // Find facts that match what the user wants to remove
  const factsToRemove = facts.filter((f: string) => 
    f.toLowerCase().includes(factToRemove.toLowerCase()) || 
    factToRemove.toLowerCase().includes(f.toLowerCase())
  )
  
  // Only update if we found something to remove
  if (factsToRemove.length > 0) {
    // Filter out the matching facts from active memory
    facts = facts.filter((f: string) => !factsToRemove.includes(f))
    
    // Add them to the secret archive
    archived.facts = [...archived.facts, ...factsToRemove]
    
    const { error } = await supabase
      .from('visitors')
      .update({ 
        memory_json: { ...currentMemory, facts },
        archived: archived,
        last_seen: new Date().toISOString() 
      })
      .eq('browser_id', browserId)

    if (error) console.error("Archive Visitor Fact Error:", error)
  }
}

/**
 * Removes a behavior trait from the user's behavior_profile and adds it to archived object
 */
export async function removeVisitorBehavior(browserId: string, behaviorToRemove: string) {
  const supabase = await createClient()
  
  const { data } = await supabase.from('visitors').select('behavior_profile, archived').eq('browser_id', browserId).single()
  
  let behaviors = data?.behavior_profile || []
  
  let archived = data?.archived || { facts: [], behaviors: [] }
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
        archived: archived,
        last_seen: new Date().toISOString() 
      })
      .eq('browser_id', browserId)

    if (error) console.error("Archive Visitor Behavior Error:", error)
  }
}

