// import { getMovies } from '@/lib/supabase/movies'

// export default async function MoviesPage() {
//   const movies = await getMovies()

//   return (
//     <main>
//       {movies.map((movie) => (
//         <div key={movie.id}>
//           <h2>{movie.Thumbnail}</h2>
//           {/* present however you want */}
//         </div>
//       ))}
//     </main>
//   )
// }

import { getMovies } from '@/lib/supabase/movies'
import MoviesUI from '@/components/MoviesUI'

export default async function MoviesPage() {
  const movies = await getMovies()

  return <MoviesUI movies={movies} />
}


