import { createClient } from '@/utils/supabase/client'

export async function getActiveBackgrounds() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('Backgrounds')
    .select('*')
    .eq('is_active', true)

  console.log("data", data)

  if (error) {
    console.error("Failed to fetch from Backgrounds:", error)
    throw new Error(error.message)
  }

  // Normalize data and handle any backend inconsistencies gracefully
  const normalized = data.map((item) => ({
    id: item.id,
    video_url: item.video_url,
    mode: item.mode,
    is_active: item.is_active,
    weight: item.weight,
    brightness: item.brightness,
    blur_level: item.blur_level,
    device_type: item.device_type,
  }))

  // console.log("normalized", normalized)
  return normalized
}
