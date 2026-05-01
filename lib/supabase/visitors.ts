import { createClient } from '@/utils/supabase/server'

// ============================================================
// TYPES
// ============================================================

/** Passive intelligence — device, location, visit count, referrer */
export type Visitor = {
  id: string
  browser_id: string
  ip_address: string
  visit_count: number
  first_seen: string
  last_seen: string
  locations: Array<{ location: string; city: string | null; country: string | null; first_seen: string }>
  device_info: { device: string; os: string; browser: string; ua_raw?: string } | null
  referrers: string[]
  last_session_snapshot: any
}

/** Active intelligence — what the visitor revealed through chat */
export type VisitorProfile = {
  id: string
  browser_id: string
  user_name: string | null
  memory_json: { facts: string[] }
  behavior_profile: string[]
  archived: { facts: string[]; behaviors: string[]; name?: string; last_wiped?: string }
  created_at: string
  updated_at: string
}

// ============================================================
// HELPERS (pure, no DB)
// ============================================================

function parseUserAgent(ua: string): { device: string; os: string; browser: string } {
  const device = /mobile|android|iphone|ipad|ipod/i.test(ua) ? 'Mobile' : 'Desktop'
  let os = 'Unknown'
  if (/iphone|ipad|ipod/i.test(ua))  os = 'iOS'
  else if (/android/i.test(ua))       os = 'Android'
  else if (/windows nt/i.test(ua))    os = 'Windows'
  else if (/mac os x/i.test(ua))      os = 'macOS'
  else if (/linux/i.test(ua))         os = 'Linux'
  let browser = 'Unknown'
  if (/edg\//i.test(ua))                      browser = 'Edge'
  else if (/opr\/|opera\//i.test(ua))         browser = 'Opera'
  else if (/samsungbrowser/i.test(ua))         browser = 'Samsung Browser'
  else if (/chrome\/(?!.*opr)/i.test(ua))     browser = 'Chrome'
  else if (/safari\/(?!.*chrome)/i.test(ua))  browser = 'Safari'
  else if (/firefox\//i.test(ua))             browser = 'Firefox'
  return { device, os, browser }
}

function normalizeReferrer(referer: string | null | undefined): string {
  if (!referer) return 'Direct'
  const url = referer.toLowerCase()
  if (url.includes('instagram'))                            return 'Instagram'
  if (url.includes('linkedin'))                             return 'LinkedIn'
  if (url.includes('twitter') || url.includes('t.co') || url.includes('x.com')) return 'Twitter/X'
  if (url.includes('whatsapp') || url.includes('wa.me'))   return 'WhatsApp'
  if (url.includes('facebook') || url.includes('fb.'))     return 'Facebook'
  if (url.includes('youtube') || url.includes('youtu.be')) return 'YouTube'
  if (url.includes('reddit'))                               return 'Reddit'
  if (url.includes('github'))                               return 'GitHub'
  if (url.includes('google'))                               return 'Google Search'
  try { return new URL(referer).hostname.replace('www.', '') } catch { return 'Unknown' }
}

// ============================================================
// VISITORS TABLE — passive data, written on every page load
// ============================================================

/**
 * Resolves a visitor by Browser ID (priority) or IP (fallback).
 */
export async function getVisitor(browserId: string | null, ip: string | null): Promise<Visitor | null> {
  const supabase = await createClient()
  if (browserId) {
    const { data } = await supabase.from('visitors').select('*').eq('browser_id', browserId).single()
    if (data) return data as Visitor
  }
  if (ip) {
    const { data } = await supabase.from('visitors').select('*').eq('ip_address', ip)
      .order('last_seen', { ascending: false }).limit(1).maybeSingle()
    if (data) return data as Visitor
  }
  return null
}

/**
 * Creates or updates a visitors row.
 * Implements "Highest Watermark" visit_count sync across same IP.
 * Only handles passive data — no chatbot fields.
 */
export async function upsertVisitor(visitor: { browser_id: string; ip_address: string }) {
  const supabase = await createClient()

  let finalVisitCount = 1
  let isNewSession = true

  const { data: ipRows } = await supabase
    .from('visitors').select('browser_id, visit_count, last_seen').eq('ip_address', visitor.ip_address)

  if (ipRows && ipRows.length > 0) {
    const maxCount = Math.max(...ipRows.map(r => r.visit_count || 1))
    const myRow = ipRows.find(r => r.browser_id === visitor.browser_id)
    if (myRow?.last_seen) {
      const hoursSince = (Date.now() - new Date(myRow.last_seen).getTime()) / (1000 * 60 * 60)
      if (hoursSince < 1) isNewSession = false
    }
    finalVisitCount = isNewSession ? maxCount + 1 : maxCount
  }

  const { data, error } = await supabase
    .from('visitors')
    .upsert({ ...visitor, visit_count: finalVisitCount, last_seen: new Date().toISOString() }, { onConflict: 'browser_id' })
    .select().single()

  if (error) { console.error('upsertVisitor error:', error); return { data, error } }

  // Sync visit_count to all other browsers on same IP
  await supabase.from('visitors').update({ visit_count: finalVisitCount })
    .eq('ip_address', visitor.ip_address).neq('browser_id', visitor.browser_id)

  return { data, error }
}

/**
 * Enriches a visitors row with location, device, referrer, and session snapshot.
 * All writes are append-only (locations, referrers) or overwrite per-browser (device).
 */
export async function updateVisitorEnrichment(
  browserId: string,
  ip: string,
  data: {
    city?: string | null
    country?: string | null
    region?: string | null
    userAgent?: string | null
    externalReferrer?: string | null
    sessionSnapshot?: any | null
  }
) {
  const supabase = await createClient()

  const { data: row, error } = await supabase
    .from('visitors').select('locations, device_info, referrers').eq('browser_id', browserId).single()
  if (error || !row) return

  const updates: Record<string, any> = {}

  // --- LOCATION ---
  let { city, country, region } = data
  if (!city && !country && ip && ip !== '127.0.0.1') {
    try {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=city,country,regionName`, { signal: AbortSignal.timeout(2000) })
      if (geoRes.ok) { const geo = await geoRes.json(); city = geo.city; country = geo.country; region = geo.regionName }
    } catch { /* silent */ }
  }
  if (city || country) {
    const locationStr = [city, region, country].filter(Boolean).join(', ')
    const locations: any[] = row.locations || []
    if (!locations.some((l: any) => l.location === locationStr)) {
      locations.push({ location: locationStr, city: city || null, country: country || null, first_seen: new Date().toISOString() })
      updates.locations = locations
    }
  }

  // --- DEVICE ---
  if (data.userAgent) {
    updates.device_info = { ...parseUserAgent(data.userAgent), ua_raw: data.userAgent.slice(0, 300) }
  }

  // --- REFERRER ---
  const source = normalizeReferrer(data.externalReferrer)
  const referrers: string[] = row.referrers || []
  if (!referrers.includes(source)) { referrers.push(source); updates.referrers = referrers }

  // --- SESSION SNAPSHOT ---
  if (data.sessionSnapshot) updates.last_session_snapshot = data.sessionSnapshot

  if (Object.keys(updates).length > 0) {
    const { error: e } = await supabase.from('visitors').update(updates).eq('browser_id', browserId)
    if (e) console.error('updateVisitorEnrichment error:', e)
  }
}

// ============================================================
// VISITOR_PROFILES TABLE — chatbot memory, written through chat
// ============================================================

/**
 * Resolves a visitor_profile by Browser ID (priority) or IP (fallback).
 * IP fallback prefers profiles that have a known name.
 */
export async function getVisitorProfile(browserId: string | null, ip: string | null): Promise<VisitorProfile | null> {
  const supabase = await createClient()

  if (browserId) {
    const { data } = await supabase.from('visitor_profiles').select('*').eq('browser_id', browserId).single()
    if (data) return data as VisitorProfile
  }

  if (ip) {
    const { data: visitorRows } = await supabase.from('visitors').select('browser_id').eq('ip_address', ip)
    if (visitorRows && visitorRows.length > 0) {
      const ids = visitorRows.map(r => r.browser_id).filter(Boolean)
      // Prefer profile with a name
      const { data: named } = await supabase.from('visitor_profiles').select('*')
        .in('browser_id', ids).not('user_name', 'is', null).order('updated_at', { ascending: false }).limit(1).maybeSingle()
      if (named) return named as VisitorProfile
      // Fallback: any profile
      const { data: any } = await supabase.from('visitor_profiles').select('*')
        .in('browser_id', ids).order('updated_at', { ascending: false }).limit(1).maybeSingle()
      if (any) return any as VisitorProfile
    }
  }
  return null
}

/**
 * Ensures a visitor_profiles row exists for this browser_id.
 * Creates if missing, leaves existing data untouched.
 */
export async function upsertVisitorProfile(browserId: string): Promise<VisitorProfile | null> {
  const supabase = await createClient()

  // Try insert — ignore if already exists
  await supabase.from('visitor_profiles').insert({ browser_id: browserId }).select().single()

  // Always fetch the current row (whether just created or existing)
  const { data } = await supabase.from('visitor_profiles').select('*').eq('browser_id', browserId).single()
  return (data as VisitorProfile) || null
}

/**
 * Updates visitor name across ALL profiles sharing the same IP.
 */
export async function updateVisitorName(browserId: string, name: string) {
  const supabase = await createClient()

  const { data: row } = await supabase.from('visitors').select('ip_address').eq('browser_id', browserId).single()
  const ip = row?.ip_address

  await supabase.from('visitor_profiles').update({ user_name: name }).eq('browser_id', browserId)

  if (ip) {
    const { data: ipRows } = await supabase.from('visitors').select('browser_id').eq('ip_address', ip).neq('browser_id', browserId)
    if (ipRows && ipRows.length > 0) {
      await supabase.from('visitor_profiles').update({ user_name: name }).in('browser_id', ipRows.map(r => r.browser_id))
    }
  }
}

/**
 * Adds a fact to visitor_profiles.memory_json — deduplicated, case-insensitive.
 */
export async function addVisitorFact(browserId: string, fact: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('visitor_profiles').select('memory_json').eq('browser_id', browserId).single()
  const currentMemory = data?.memory_json || {}
  const facts: string[] = currentMemory.facts || []
  if (!facts.some((f: string) => f.toLowerCase().trim() === fact.toLowerCase().trim())) {
    facts.push(fact)
    const { error } = await supabase.from('visitor_profiles').update({ memory_json: { ...currentMemory, facts } }).eq('browser_id', browserId)
    if (error) console.error('addVisitorFact error:', error)
  }
}

/**
 * Adds a behavior tag to visitor_profiles.behavior_profile — deduplicated.
 */
export async function addVisitorBehavior(browserId: string, behavior: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('visitor_profiles').select('behavior_profile').eq('browser_id', browserId).single()
  const behaviors: string[] = data?.behavior_profile || []
  if (!behaviors.includes(behavior)) {
    behaviors.push(behavior)
    const { error } = await supabase.from('visitor_profiles').update({ behavior_profile: behaviors }).eq('browser_id', browserId)
    if (error) console.error('addVisitorBehavior error:', error)
  }
}

/**
 * Removes a fact from ALL profiles sharing the same IP.
 * Archives the removed fact into visitor_profiles.archived.
 */
export async function removeVisitorFact(browserId: string, factToRemove: string) {
  const supabase = await createClient()
  const { data: callerRow } = await supabase.from('visitors').select('ip_address').eq('browser_id', browserId).single()
  const ip = callerRow?.ip_address
  if (!ip) return

  const { data: visitorRows } = await supabase.from('visitors').select('browser_id').eq('ip_address', ip)
  if (!visitorRows?.length) return
  const ids = visitorRows.map(r => r.browser_id)

  const { data: profiles } = await supabase.from('visitor_profiles').select('browser_id, memory_json, archived').in('browser_id', ids)
  if (!profiles?.length) return

  for (const profile of profiles) {
    const mem = profile.memory_json || {}
    let facts: string[] = mem.facts || []
    let archived = profile.archived || { facts: [], behaviors: [] }
    if (!archived.facts) archived.facts = []
    if (!archived.behaviors) archived.behaviors = []

    const toRemove = facts.filter((f: string) => f.toLowerCase().includes(factToRemove.toLowerCase()) || factToRemove.toLowerCase().includes(f.toLowerCase()))
    if (toRemove.length > 0) {
      facts = facts.filter((f: string) => !toRemove.includes(f))
      archived.facts = [...archived.facts, ...toRemove]
      await supabase.from('visitor_profiles').update({ memory_json: { ...mem, facts }, archived }).eq('browser_id', profile.browser_id)
    }
  }
}

/**
 * Removes a behavior from ALL profiles sharing the same IP.
 * Archives the removed behavior into visitor_profiles.archived.
 */
export async function removeVisitorBehavior(browserId: string, behaviorToRemove: string) {
  const supabase = await createClient()
  const { data: callerRow } = await supabase.from('visitors').select('ip_address').eq('browser_id', browserId).single()
  const ip = callerRow?.ip_address
  if (!ip) return

  const { data: visitorRows } = await supabase.from('visitors').select('browser_id').eq('ip_address', ip)
  if (!visitorRows?.length) return
  const ids = visitorRows.map(r => r.browser_id)

  const { data: profiles } = await supabase.from('visitor_profiles').select('browser_id, behavior_profile, archived').in('browser_id', ids)
  if (!profiles?.length) return

  for (const profile of profiles) {
    let behaviors: string[] = profile.behavior_profile || []
    let archived = profile.archived || { facts: [], behaviors: [] }
    if (!archived.facts) archived.facts = []
    if (!archived.behaviors) archived.behaviors = []

    const toRemove = behaviors.filter((b: string) => b.toLowerCase().includes(behaviorToRemove.toLowerCase()) || behaviorToRemove.toLowerCase().includes(b.toLowerCase()))
    if (toRemove.length > 0) {
      behaviors = behaviors.filter((b: string) => !toRemove.includes(b))
      archived.behaviors = [...archived.behaviors, ...toRemove]
      await supabase.from('visitor_profiles').update({ behavior_profile: behaviors, archived }).eq('browser_id', profile.browser_id)
    }
  }
}

/**
 * Archives all active chat data, then clears it — across ALL profiles for the same IP.
 * Data is never truly deleted: it moves to visitor_profiles.archived.
 */
export async function forgetVisitorCompletely(browserId: string) {
  const supabase = await createClient()
  const { data: callerRow } = await supabase.from('visitors').select('ip_address').eq('browser_id', browserId).single()
  const ip = callerRow?.ip_address
  if (!ip) return

  const { data: visitorRows } = await supabase.from('visitors').select('browser_id').eq('ip_address', ip)
  if (!visitorRows?.length) return
  const ids = visitorRows.map(r => r.browser_id)

  const { data: profiles, error } = await supabase.from('visitor_profiles').select('*').in('browser_id', ids)
  if (error || !profiles?.length) return

  for (const profile of profiles) {
    let archived = profile.archived || { facts: [], behaviors: [] }
    if (Array.isArray(archived)) archived = { facts: archived, behaviors: [] }
    if (!archived.facts) archived.facts = []
    if (!archived.behaviors) archived.behaviors = []

    const activeFacts: string[] = profile.memory_json?.facts || []
    const activeBehaviors: string[] = profile.behavior_profile || []
    const activeName: string | null = profile.user_name || null

    for (const fact of activeFacts) { if (!archived.facts.includes(fact)) archived.facts.push(fact) }
    for (const beh of activeBehaviors) { if (!archived.behaviors.includes(beh)) archived.behaviors.push(beh) }
    if (activeName && !archived.name) archived.name = activeName
    archived.last_wiped = new Date().toISOString()

    await supabase.from('visitor_profiles').update({
      user_name: null, memory_json: { facts: [] }, behavior_profile: [], archived
    }).eq('browser_id', profile.browser_id)
  }
  console.log(`Archived + wiped all profile data for IP ${ip}`)
}
