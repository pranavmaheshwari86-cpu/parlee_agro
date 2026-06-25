"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const isDark = product.isDark ?? false;
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-white/80" : "text-gray-600";
  const cardBg = isDark
    ? "bg-[#1A1A1A] border border-white/10 shadow-2xl"
    : "bg-white border border-black/5 shadow-2xl";

  const statBg = isDark ? "bg-[#222]" : "bg-gray-50";
  const featureBg = isDark ? "bg-[#222] border border-white/10" : "bg-white border border-black/5 shadow-sm";

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id={`${product.id}-details`} ref={containerRef} className="relative px-4 sm:px-6 py-8 sm:py-12 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1920px] w-full 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          <div
            className="product-image-mask relative aspect-[9/16] md:aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl"
          >
            <Image
              src={product.detailImage || `${product.folderPath}/120.webp`}
              alt={product.detailsSection.imageAlt}
              fill
              className="object-cover opacity-95 transition-opacity hover:opacity-100"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={85}
            />
          </div>

          <div>
            <AnimatedTitle
              title={product.detailsSection.title}
              containerClass="justify-start !px-0"
              textClass={`text-fluid-h2 tracking-tight font-serif ${textPrimary}`}
            />
            <p className={`mt-6 text-fluid-p font-light leading-relaxed ${textMuted}`}>
              {product.detailsSection.description}
            </p>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {product.stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl p-4 sm:p-6 text-center transition-transform hover:scale-105 flex flex-col justify-center ${statBg} ${
                    i === 2 ? "col-span-2 md:col-span-1" : ""
                  }`}
                >
                  <p
                    className="text-xl sm:text-3xl font-black md:text-4xl whitespace-normal break-words leading-tight tracking-tight"
                    style={{ color: product.themeColor }}
                  >
                    {stat.val}
                  </p>
                  <p className={`mt-1 sm:mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest sm:tracking-[0.2em] ${textMuted}`}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <ul className="mt-8 flex flex-wrap gap-3">
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide ${featureBg} ${textPrimary}`}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={`mt-16 md:mt-24 rounded-[2.5rem] p-6 sm:p-10 md:p-16 ${cardBg}`}
        >
          <AnimatedTitle
            title={product.freshnessSection.title}
            containerClass="justify-start !px-0"
            textClass={`text-fluid-h3 font-serif ${textPrimary}`}
          />
          <p className={`mt-6 max-w-4xl text-fluid-p font-light leading-relaxed ${textMuted}`}>
            {product.freshnessSection.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
