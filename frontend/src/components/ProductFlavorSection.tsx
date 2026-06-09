"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import ProductBottleScroll from "./ProductBottleScroll";
import ProductVideoScroll from "./ProductVideoScroll";
import ProductDetails from "./ProductDetails";
import BuyNow from "./BuyNow";

interface ProductFlavorSectionProps {
  product: Product;
  nextProduct?: Product;
  isLast?: boolean;
}

export default function ProductFlavorSection({
  product,
  nextProduct,
  isLast = false,
}: ProductFlavorSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id={product.id}
      className="relative overflow-clip"
      style={{ background: product.gradient }}
    >
      {/* Smooth Background specifically for Frio Orange */}
      {product.id === "frio-orange" && (
        <>
          <div className="pointer-events-none absolute -left-[10%] top-0 h-[500px] w-[500px] rounded-full bg-orange-400/20 blur-[80px] mix-blend-overlay duration-1000 transform-gpu" />
          <div className="pointer-events-none absolute -right-[10%] bottom-0 h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-[80px] mix-blend-overlay duration-1000 transform-gpu" />
          <div className="pointer-events-none absolute left-[30%] top-[40%] h-[400px] w-[400px] rounded-full bg-yellow-400/15 blur-[80px] mix-blend-overlay transform-gpu" />
        </>
      )}

      {/* Smooth Background specifically for Bailley Water */}
      {product.id === "bailley-water" && (
        <>
          <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-white/20 blur-[80px] mix-blend-overlay transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] rounded-full bg-white/10 blur-[80px] mix-blend-overlay transition-transform duration-1000 group-hover:scale-110 delay-100" />
          <div className="pointer-events-none absolute left-[30%] top-[40%] h-[400px] w-[400px] rounded-full bg-blue-300/15 blur-[80px] mix-blend-overlay transform-gpu" />
        </>
      )}

      {product.videoType === "mp4" ? (
        <ProductVideoScroll
          product={product}
          containerRef={scrollContainerRef}
        />
      ) : (
        <ProductBottleScroll
          product={product}
          containerRef={scrollContainerRef}
        />
      )}

      <ProductDetails product={product} />
      <BuyNow product={product} />

      {isLast && (
        <div className="h-16" aria-hidden />
      )}

      {!isLast && nextProduct && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="px-6 pb-20 pt-12 md:px-12"
        >
          <a
            href={`#${nextProduct.id}`}
            className="group relative mx-auto block w-full max-w-4xl"
          >
            <div
              className="relative overflow-hidden rounded-[2.5rem] border border-white/30 px-8 py-16 shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)] md:py-20 md:px-20"
              style={{
                background: `linear-gradient(135deg, ${nextProduct.themeColor}cc, ${nextProduct.themeColor}88)`,
              }}
            >
              {/* Animated sweep overlay */}
              <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[150%]" />
              
              {/* Internal glow and shadow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent mix-blend-overlay" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              
              <div className="relative z-10 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]">
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/90 drop-shadow-sm">
                  Up next
                </p>
                <p className="mt-4 text-fluid-h2 font-black text-white drop-shadow-lg font-serif">
                  {nextProduct.name}
                </p>
                <p className="mt-4 text-fluid-h3 font-light text-white/90 drop-shadow-md">
                  {nextProduct.subName}
                </p>
                <span className="mt-10 inline-flex items-center min-h-[44px] justify-center gap-4 rounded-full bg-white px-8 py-3 text-sm font-bold text-gray-900 shadow-xl transition-all duration-500 hover:bg-gray-50 group-hover:shadow-2xl">
                  Continue scrolling
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3">
                    →
                  </span>
                </span>
              </div>
            </div>
          </a>
        </motion.div>
      )}
    </section>
  );
}
