"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import AnimatedTitle from "./AnimatedTitle";

export default function HeroIntro() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={heroRef} className="relative w-screen bg-black">
      <section
        id="hero-frame"
        className="relative z-10 flex min-h-screen scroll-mt-20 flex-col items-center justify-center overflow-hidden px-4 sm:px-6 pt-20 pb-12 text-center"
      >

      {/* Abstract background elements for extra glassmorphic depth */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-pink-300/30 blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-fuchsia-300/30 blur-[100px]" />

      <div className="relative z-10">


        <AnimatedTitle 
          title="Parlee Agro"
          containerClass="mt-6"
          gapClass="gap-6 md:gap-12 lg:gap-16"
          textClass="bg-gradient-to-br from-pink-600 via-rose-500 to-fuchsia-700 bg-clip-text text-transparent font-serif"
        />

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-fluid-p font-light text-gray-300 flex flex-wrap justify-center gap-x-[0.25em]"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
          }}
        >
          {"Smooth sips. Bold flavors. Premium lassi, flavoured milk, refreshing juices, and sparkling beverages from the house of Parlee Agro.".split(" ").map((word, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px)", 
                  transition: { duration: 1.0, ease: [0.2, 0.65, 0.3, 0.9] } 
                }
              }}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
        </motion.p>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 1, ease: "easeOut" }}
          className="mt-12 flex flex-col items-center gap-6"
        >
          <a
            href="#lassi"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-pink-500/20 px-10 py-4 font-medium text-pink-50 shadow-xl ring-1 ring-pink-500/50 backdrop-blur-xl transition-all hover:bg-pink-500/40 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:ring-pink-400"
          >
            <span className="relative z-10 tracking-wide text-sm uppercase">Start the journey</span>
            {/* Glossy sheen effect on hover */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
          </a>
          
          <motion.span 
            animate={{ y: [0, 8, 0] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="mt-6 text-gray-400/80 text-xl"
          >
            ↓
          </motion.span>
        </motion.div>
      </div>
    </section>
    </div>
  );
}
