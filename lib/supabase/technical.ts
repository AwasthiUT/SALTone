import { createClient } from '@/utils/supabase/client'

export type TechnicalMetadataItem = {
  title?: string | null
  subtitle?: string | null
  description?: string | null
  is_active?: boolean | null
  technologies?: string[] | null
  role?: string | null
  company?: string | null
  start?: string | number | null
  end?: string | number | null
  tech?: string[] | null
  status?: string | null
  link?: string | null
}

export type TechnicalMetadata = {
  items?: TechnicalMetadataItem[]
  blocks?: TechnicalMetadataItem[]
}

export type TechnicalSection = {
  id?: string | number
  section_key: string
  section_type: string
  title: string | null
  subtitle: string | null
  description: string | null
  metadata: TechnicalMetadata | null
  position: number | null
}

function normalizeMetadata(metadata: unknown): TechnicalMetadata | null {
  if (!metadata) return null

  if (typeof metadata === 'string') {
    try {
      return JSON.parse(metadata) as TechnicalMetadata
    } catch {
      return null
    }
  }

  return metadata as TechnicalMetadata
}

export async function getTechnicalSections(): Promise<TechnicalSection[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('technical')
    .select('*')
    .eq('is_active', true)
    .order('position', { ascending: true })

  if (error) {
    console.error('Failed to fetch technical sections:', error)
    throw new Error(error.message)
  }

  const normalizedData = (data ?? []).map((section) => ({
    ...section,
    metadata: normalizeMetadata(section.metadata),
  }))

  // console.log('Technical Data:', normalizedData)

  return normalizedData
}
