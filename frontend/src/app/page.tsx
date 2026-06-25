"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroIntro from "@/components/HeroIntro";
import ProductSkeleton from "@/components/ProductSkeleton";
import { products } from "@/data/products";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLenis } from "lenis/react";

const ProductFlavorSection = dynamic(() => import('@/components/ProductFlavorSection'), {
  ssr: false,
  loading: () => <ProductSkeleton />
});

function LazySection({ children, gradient, forceVisible }: { children: React.ReactNode; gradient?: string; forceVisible?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(forceVisible || false);
  
  useEffect(() => {
    if (forceVisible) {
      setIsVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [forceVisible]);

  return (
    <div ref={ref}>
      {isVisible ? children : <ProductSkeleton gradient={gradient} />}
    </div>
  );
}

export default function Home() {
  const lenis = useLenis();
  const [hashTarget, setHashTarget] = useState<string | null>(null);

  // Detect URL hash on mount AND on hash changes (e.g. clicking nav links while on homepage)
  useEffect(() => {
    const readHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setHashTarget(hash);
      }
    };

    // Read on mount
    readHash();

    // Listen for hash changes (triggered by nav link clicks while already on homepage)
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, []);

  // Once all sections are rendered (forced by hashTarget), scroll to the element
  const scrollToHash = useCallback(() => {
    if (!hashTarget) return;

    const attemptScroll = (retries: number) => {
      const el = document.getElementById(hashTarget);
      if (el) {
        // Small delay to let Lenis initialize and layout settle
        setTimeout(() => {
          if (lenis) {
            lenis.scrollTo(el);
          } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          // Clear hash target after scrolling so lazy loading resumes for future sections
          setHashTarget(null);
        }, 100);
      } else if (retries > 0) {
        // Element might not be in DOM yet, retry
        requestAnimationFrame(() => attemptScroll(retries - 1));
      }
    };

    // Wait a frame for React to render the forced-visible sections
    requestAnimationFrame(() => attemptScroll(20));
  }, [hashTarget, lenis]);

  useEffect(() => {
    scrollToHash();
  }, [scrollToHash]);

  return (
    <>
      <Navbar />

      <main className="overflow-clip">
        <HeroIntro />

        {products.map((product, index) => {
          const isFirstTwo = index < 2;
          const nextProduct = products[index + 1];
          const isLast = index === products.length - 1;

          const targetIndex = hashTarget ? products.findIndex(p => p.id === hashTarget) : -1;
          const forceVisible = targetIndex !== -1 && index <= targetIndex;

          if (isFirstTwo) {
            return (
              <ProductFlavorSection
                key={product.id}
                product={product}
                nextProduct={nextProduct}
                isLast={isLast}
                index={index}
              />
            );
          }

          return (
            <LazySection key={product.id} gradient={product.gradient} forceVisible={forceVisible}>
              <ProductFlavorSection
                product={product}
                nextProduct={nextProduct}
                isLast={isLast}
                index={index}
              />
            </LazySection>
          );
        })}
      </main>

      <Footer />
    </>
  );
}
