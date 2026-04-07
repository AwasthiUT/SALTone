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
