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
      <div className="absolute top-8 left-8 z-50">
        <Link 
          href="/movies"
          className="text-white hover:text-[#FF0000] transition-colors flex items-center gap-2 group"
          style={{ fontFamily: 'HelveticaBold', fontSize: '0.8rem', letterSpacing: '0.1em' }}
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span> BACK
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