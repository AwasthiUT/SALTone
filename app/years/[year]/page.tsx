import { getYearData } from '@/lib/supabase/years'
import YearUI3 from '@/components/YearUI3'

export default async function YearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params
  const data = await getYearData(Number(year))
  return <YearUI3 yearData={data.year} events={data.events} />
}