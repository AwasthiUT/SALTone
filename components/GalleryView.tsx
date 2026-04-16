"use client"

import Image from 'next/image'
import Link from 'next/link'

type Props = {
  Title: string
  images: string[]
  Credits?: string
}

export default function GalleryView({ Title, images, Credits }: Props) {
  return (
    <main className="min-h-screen overflow-y-auto bg-black text-white p-8 relative">
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50">
        <Link
          href="/movies"
          className="group flex items-center gap-3 px-5 py-2.5 bg-black/50 hover:bg-[#FF0000]/20 rounded-full backdrop-blur-md border border-white/10 hover:border-[#FF0000]/50 transition-all duration-300 text-white hover:text-[#FF0000] uppercase text-[10px] sm:text-xs tracking-[0.2em] w-fit"
          style={{ fontFamily: 'HelveticaBold' }}
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300 inline-block">←</span>
          {/* <span>Back to Cinema</span> */}
        </Link>
      </div>
      <Link href="/movies">
        <h1
          className="text-3xl mb-6 text-center animate-fade-in-up text-[#FF0000] fade-in-up"
          style={{ fontFamily: 'CormorantGaramondNormal' }}
        >
          {Title}
        </h1>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in-up">
        {images.map((img, idx) => (
          <Image
            key={idx}
            src={img}
            alt={`Gallery image ${idx}`}
            width={800}
            height={600}
            className="rounded-md object-contain w-full h-auto animate-fade-in-up fade-in-up"
            style={{ animationDelay: `${idx * 150}ms` }}
            priority={idx === 0}
          />
        ))}
      </div>

      {/* {Credits && (
        <footer className="mt-12 mb-10 text-center animate-fade-in-up">
          <p
            className="text-base sm:text-xl text-[#FF0000] tracking-wide"
            style={{ fontFamily: 'CormorantGaramondNormal' }}
          >
            {Credits}
          </p>
        </footer>
      )} */}
      {Credits && (
        <footer className="mt-12 mb-10 text-center animate-fade-in-up">
          <p
            className="text-base sm:text-xl text-[#FF0000] tracking-wide"
            style={{ fontFamily: 'CormorantGaramondNormal' }}
          >
            {Array.isArray(Credits)
              ? Credits.join(' · ')
              : Credits.split(',').map(n => n.trim()).join(' · ')
            }
          </p>
        </footer>
      )}
    </main>
  )
}