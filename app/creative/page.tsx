import { getCreativeSections } from '@/lib/supabase/creative'
import CreativeWorldClient from '@/components/landing/CreativeWorldClient'

export const dynamic = 'force-dynamic'

export default async function CreativeWorldPage() {
  const sections = await getCreativeSections()

  const newsletter = sections.find(s => s.section_key === "newsletter");
  console.log("Newsletter section (Landing):", newsletter);

  const fields = newsletter?.metadata?.fields || [];
  console.log("Newsletter fields (Landing):", fields);

  return <CreativeWorldClient sections={sections} />
}
