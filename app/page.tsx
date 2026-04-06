// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }


// import { createClient } from '@/utils/supabase/server'

// export default async function Page() {
//   const supabase = await createClient()

//   const { data: movies, error } = await supabase
//     .from('Movies')
//     .select()

//   console.log('movies:', movies)
//   console.log('error:', error)

//   return (
//     <pre>{JSON.stringify({ movies, error }, null, 2)}</pre>
//   )
// }

'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';


import {
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from 'react-icons/fa'; // or another icon library

import { Typewriter } from 'react-simple-typewriter';
import { useEffect, useState } from 'react';

export default function Home() {
  const [greeting, setGreeting] = useState('Hello')

  useEffect(() => {
    const hour = new Date().getHours()

    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning Human')
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon Human,')
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good Evening Human,')
    } else {
      setGreeting("Why you ain't sleeping bud?")
      // setGreeting('Good Afternoon Human,')


    }
  }, [])

  const longestText = "Why you ain't sleeping bud? Well, Anyways"

  return (
    <>
      {/* MAIN CONTAINER FOR DESKTOP VIEW */}
      <main className="relative h-screen w-full overflow-hidden hidden min-[768px]:block">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/my-photu/main.jpg"
            alt="background"
            className="object-cover w-full h-full"
          />
          {/* <div className="relative w-full h-full bg-black">
            <Image
              src="/images/my-photu/main.jpg"
              alt="background"
              fill
              className="object-cover"
              priority // optional: loads it eagerly for better LCP
            />
          </div> */}
        </div>

        {/* Content overlay */}
        <div className="absolute top-[10vh] left-[2vw] z-10 px-6">
          <div className="text-left max-w-3xl">
            {/* Invisible placeholder for alignment (optional) */}
            <div className="invisible h-0 overflow-hidden">
              <h1 className="text-4xl font-bold">{longestText}</h1>
            </div>

            {/* GREETING */}
            <h1
              className="text-4xl font-bold tracking-tight text-white"
              style={{ fontFamily: 'HelveticaBold' }}
            >
              <Typewriter
                words={[greeting]}
                loop={1}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </h1>

            {/* Subtext */}
            <p
              className="mt-2 text-2xl italic text-white leading-snug animate-fade-in-up"
              style={{ fontFamily: 'GlacialIndifferenceItalic' }}
            >
              you've just stepped into a thought that never finished forming.
            </p>
          </div>
        </div>

        {/* <a
          href="/me"
          className="group absolute bottom-[5vh] right-[1vw] z-20 transition-transform duration-300 hover:scale-105 translate-x-[30%] translate-y-[30%]"
        >
          <img
            src="/images/my-photu/okay.png"
            alt="Click Icon"
            className="w-[800px] h-auto object-contain grayscale hover:grayscale-0 animate-fade-in-up"
          />
        </a> */}

        <div className="relative h-screen w-full text-white">
          <Link
            href="/movies"
            className="group absolute bottom-[5vh] right-[1vw] z-20 translate-x-[30%] translate-y-[30%] transition-transform duration-300 hover:scale-105"
          >
            <motion.img
              src="/images/my-photu/okay.png"
              alt="Click Icon"
              className="w-[800px] h-auto object-contain grayscale hover:grayscale-0 animate-fade-in-up"
              whileTap={{ scale: 0.97 }}
            />
          </Link>
        </div>

        <footer className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20 flex space-x-6 text-white mb-8">
          <a href="https://www.instagram.com/ut_awasthi/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 hover:scale-105 transition-transform">
            <FaInstagram size={28} />
          </a>
          <a href="https://www.youtube.com/@Yousaidut" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 hover:scale-105 transition-transform">
            <FaYoutube size={28} />
          </a>
          <a href="https://www.linkedin.com/in/utkarsh-awasthi-b35917231/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:scale-105 transition-transform">
            <FaLinkedin size={28} />
          </a>
        </footer>

      </main>

      {/* MAIN CONTAINER FOR MOBILE VIEW */}
      <main className="relative h-screen w-full overflow-hidden block min-[768px]:hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/my-photu/main90.jpg"
            alt="background"
            className="object-cover w-full h-full"
          />
          {/* <div className="relative w-full h-full">
            <Image
              src="/images/my-photu/main90.jpg"
              alt="background"
              fill
              className="object-cover"
              priority // optional: loads it eagerly for better LCP
            />
          </div> */}
        </div>

        {/* Content overlay */}
        <div className="absolute top-[10vh] left-[2vw] z-10 px-6">
          <div className="text-left max-w-3xl">
            {/* Invisible placeholder for alignment (optional) */}
            <div className="invisible h-0 overflow-hidden">
              <h1 className="text-4xl font-bold">{longestText}</h1>
            </div>

            {/* GREETING */}
            <h1
              className="text-3xl font-bold tracking-tight text-white"
              style={{ fontFamily: 'HelveticaBold' }}
            >
              <Typewriter
                words={[greeting]}
                loop={1}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </h1>

            {/* Subtext */}
            <p
              className="mt-2 text-xl italic text-white leading-snug animate-fade-in-up"
              style={{ fontFamily: 'GlacialIndifferenceItalic' }}
            >
              you've just stepped into a thought that never finished forming.
            </p>
          </div>
        </div>

        <a
          href="/me"
          className="group absolute bottom-[10vh] right-[1vw] z-20 transition-transform duration-300 hover:scale-105 translate-x-[30%]"
        >
          <img
            src="/images/my-photu/okay.png"
            alt="Click Icon"
            className="w-[800px] h-auto object-contain grayscale hover:grayscale-0 animate-fade-in-up"
          />
        </a>

        <footer className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20 flex space-x-6 text-white mb-8">
          <a href="https://www.instagram.com/ut_awasthi/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 hover:scale-105 transition-transform">
            <FaInstagram size={28} />
          </a>
          <a href="https://www.youtube.com/@Yousaidut" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 hover:scale-105 transition-transform">
            <FaYoutube size={28} />
          </a>
          <a href="https://www.linkedin.com/in/utkarsh-awasthi-b35917231/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:scale-105 transition-transform">
            <FaLinkedin size={28} />
          </a>
        </footer>

      </main>
    </>
  )
}
