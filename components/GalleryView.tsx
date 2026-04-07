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
    <main className="min-h-screen overflow-y-auto bg-black text-white p-8">
      <Link href="/movies">
        <h1
          className="text-3xl mb-6 text-center animate-fade-in-up text-[#FF0000]"
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
            className="rounded-md object-contain w-full h-auto animate-fade-in-up"
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