import { createClient } from '@/utils/supabase/server'

export async function getYearData(year: number) {
  const supabase = await createClient()

  const { data: yearData, error: yearError } = await supabase
    .from('Years')
    .select()
    .eq('year', year)
    .eq('is_active', true)
    .single()


  if (yearError) throw new Error(yearError.message)

  // console.log('========== FETCH ==========')
  // console.log('RAW DATA:', JSON.stringify(yearData, null, 2))
  // console.log('ERROR:', yearError)
  // console.log('====================================')


  const { data: events, error: eventsError } = await supabase
    .from('yearEvents')
    .select()
    .eq('year_id', yearData.id)
    .eq('is_active', true)
    .order('order')

  if (eventsError) throw new Error(eventsError.message)

  // console.log('========== FETCH ==========')
  // console.log('RAW DATA:', JSON.stringify(events, null, 2))
  // console.log('ERROR:', eventsError)
  // console.log('====================================')

  const formattedEvents = events.map(event => ({
    ...event,
    gallery: typeof event.gallery === 'string' ? JSON.parse(event.gallery) : event.gallery || []
  }))

  return { year: yearData, events: formattedEvents }
}