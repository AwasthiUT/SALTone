import WorkContent from '@/components/landing/WorkContent'
import { getTechnicalSections } from '@/lib/supabase/technical'

const FONT_UI = '"Helvetica Neue", Helvetica, Arial, sans-serif'

export default async function WorkPage() {
  const data = await getTechnicalSections()
  console.log("Technical Page Data:", data)

  return (
    <main style={{
      minHeight: '100dvh',
      background: '#f9f9f7',
      fontFamily: FONT_UI,
      color: '#0d0d0d',
    }}>
      <WorkContent sections={data} />
    </main>
  )
}
