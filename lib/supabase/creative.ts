import { createClient } from '@/utils/supabase/client'

export type CreativeMetadata = {
  boxes?: CreativeMetadataItem[]
  images?: CreativeMetadataItem[]
  items?: CreativeMetadataItem[]
  blocks?: CreativeMetadataItem[]
  points?: CreativeMetadataItem[]
}

export type CreativeMetadataItem = {
  title?: string | null
  subtitle?: string | null
  description?: string | null
  link?: string | null
  href?: string | null
  url?: string | null
  src?: string | null
  image?: string | null
  label?: string | null
  text?: string | null
  value?: string | null
  is_active?: boolean | null
}

export type CreativeSection = {
  id?: string | number
  section_key: string
  section_type: string
  title: string | null
  subtitle: string | null
  description: string | null
  link: string | null
  cta_text: string | null
  cta_link: string | null
  background_url: string | null
  metadata: CreativeMetadata | null
  position: number | null
}

function normalizeMetadata(metadata: unknown): CreativeMetadata | null {
  if (!metadata) return null

  if (typeof metadata === 'string') {
    try {
      return JSON.parse(metadata) as CreativeMetadata
    } catch {
      return null
    }
  }

  return metadata as CreativeMetadata
}

export async function getCreativeSections(): Promise<CreativeSection[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('creative')
    .select('*')
    .eq('is_active', true)
    .order('position', { ascending: true })

  console.log('Creative Sections:', data)

  if (error) {
    console.error('Failed to fetch creative sections:', error)
    throw new Error(error.message)
  }

  return (data ?? []).map((section) => ({
    ...section,
    metadata: normalizeMetadata(section.metadata),
  }))
}
