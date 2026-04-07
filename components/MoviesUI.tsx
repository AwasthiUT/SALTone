'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa'

type Movie = {
  id: number
  title: string
  thumbnail: string
  priority: number
  link: string
  gallery: string[]
  credits: string[]
}
type Props = {
  movies: Movie[]
}

export default function MoviesUI({ movies }: Props) {
  const router = useRouter()

  return (
    <main className="relative h-screen w-full overflow-y-auto bg-black">

      {/* HEADER */}
      <div className="absolute top-[5vh] left-1/2 transform -translate-x-1/2 z-10 px-6">
        <p className="text-3xl text-[#FF0000]">
          Directed by <span>Utkarsh Awasthi</span>
        </p>
      </div>

      {/* GRID */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 py-12 mt-20">

        {movies?.map((video) => (
          <div key={video.id} className="relative group flex flex-col items-center w-full max-w-sm">

            <a href={video.link} target="_blank" rel="noopener noreferrer" className="relative w-full overflow-hidden shadow-lg">

              <div className="relative w-full h-64 group">
                {video.thumbnail && (
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>

              {/* PLAY ICON */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg className="w-16 h-16 text-white opacity-80">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>

            </a>

            {/* TITLE */}
            <p className="mt-2 text-lg text-center text-[#FF0000]">
              {video.title}
            </p>

            {/* BUTTON */}
            {/* <button
              onClick={() =>
                router.push(
                  `/gallery?title=${encodeURIComponent(video.title)}&images=${encodeURIComponent(JSON.stringify(video.gallery))}&credits=${encodeURIComponent(video.credits.join(', '))}`
                )
              }
              className="px-4 py-2 text-sm text-white hover:bg-[#FF0000] hover:text-black transition"
            >
              View Gallery
            </button> */}
            <Link href={`/gallery/${video.id}`}>
              <button className="px-4 py-2 text-sm text-white hover:bg-[#FF0000] hover:text-black transition">
                View Gallery
              </button>
            </Link>

          </div>
        ))}

      </div>

      {/* FOOTER */}
      <footer className="bg-black text-white text-center py-6 mt-12">
        <p className="text-xl text-[#FF0000]">
          All films written, directed and edited by Utkarsh Awasthi.
        </p>

        <div className="mt-6 flex justify-center space-x-6 text-[#FF0000]">
          <a href="https://www.instagram.com/ut_awasthi/" target="_blank"><FaInstagram size={28} /></a>
          <a href="https://www.youtube.com/@Yousaidut" target="_blank"><FaYoutube size={28} /></a>
          <a href="https://www.linkedin.com/in/utkarsh-awasthi-b35917231/" target="_blank"><FaLinkedin size={28} /></a>
        </div>
      </footer>

    </main>
  )
}