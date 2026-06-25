"use client";

import { RefObject, Ref, useCallback, useEffect, useRef } from "react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import type { Product } from "@/data/products";
import ProductTextOverlays from "./ProductTextOverlays";
import { MP4VideoPlayer } from "./video";

const ANIMATION_DURATION_SECONDS = 4;

interface ProductVideoScrollProps {
  product: Product;
  containerRef: RefObject<HTMLDivElement | null>;
  index: number;
}

export default function ProductVideoScroll({
  product,
  containerRef,
  index,
}: ProductVideoScrollProps) {
  const progress = useMotionValue(0);
  const hasPlayedRef = useRef(false);
  
  // Static light overlay to ensure text readability without darkening over time

  const isDark = product.isDark ?? false;

  const playAnimation = useCallback(() => {
    progress.set(0);
    animate(progress, 1, {
      duration: product.animationDuration || ANIMATION_DURATION_SECONDS,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop"
    });
  }, [progress, product.animationDuration]);

  // Intersection Observer to trigger animation automatically
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if (!hasPlayedRef.current) {
            hasPlayedRef.current = true;
            playAnimation();
          }
        } else {
          hasPlayedRef.current = false;
        }
      },
      { threshold: 0.2 } 
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [containerRef, playAnimation]);

  return (
    <div
      ref={containerRef as Ref<HTMLDivElement>}
      className="min-h-[100dvh] w-full relative overflow-hidden cursor-pointer"
      onClick={() => {
        hasPlayedRef.current = true;
        playAnimation();
      }}
      style={{ perspective: "1500px" }}
    >
      <div className="absolute inset-0 z-0 bg-black">
        <div className="absolute inset-0 h-full w-full z-0 origin-center">
          <MP4VideoPlayer src={product.videoSrc || ""} poster={product.detailImage} className="w-full h-full object-cover" autoPlay={true} index={index} />
        </div>
        
        {/* Static dark overlay for text readability */}
        <div className="pointer-events-none absolute inset-0 bg-black/20 z-10" />
      </div>

      {/* TEXT OVERLAYS ON TOP */}
      <div className="relative z-20 w-full min-h-[100dvh] flex items-center justify-center pointer-events-none">
        <ProductTextOverlays
          product={product}
          progress={progress}
          isDark={isDark}
        />
      </div>
    </div>
  );
}
