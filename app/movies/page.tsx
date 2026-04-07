import { getMovies } from '@/lib/supabase/movies'
import MoviesUI from '@/components/MoviesUI'

export default async function MoviesPage() {
  const movies = await getMovies()

  return <MoviesUI movies={movies} />
}


