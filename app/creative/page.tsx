import { getCreativeSections } from '@/lib/supabase/creative'
import CreativeWorldClient from '@/components/landing/CreativeWorldClient'

export const dynamic = 'force-dynamic'

export default async function CreativeWorldPage() {
  const sections = await getCreativeSections()

  return <CreativeWorldClient sections={sections} />
}
