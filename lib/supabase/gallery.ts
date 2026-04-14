import { createClient } from '@/utils/supabase/server'

export async function getGallery(movieId: number) {
  const supabase = await createClient()

  const { data: movie, error: movieError } = await supabase
    .from('Movies')
    .select('Title, Credits')
    .eq('id', movieId)
    .single()

  console.log('movie:', movie, 'movieError:', movieError)

  const { data: images, error: galleryError } = await supabase
    .from('gallery')
    .select('image_url')
    .eq('movie_id', movieId)
    // .order('order')

  // console.log('images:', images, 'galleryError:', galleryError)

  if (movieError || galleryError) throw new Error('Failed to fetch gallery')

  return {
    title: movie.Title,
    credits: movie.Credits,
    images: images.map(i => i.image_url)
  }
}