"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroIntro from "@/components/HeroIntro";
import ProductFlavorSection from "@/components/ProductFlavorSection";
import ProductSkeleton from "@/components/ProductSkeleton";
import { products } from "@/data/products";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";

const LazyProductSection = dynamic(() => import('@/components/ProductFlavorSection'), {
  ssr: false,
});

function LazySection({ children, gradient }: { children: React.ReactNode; gradient?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
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
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? children : <ProductSkeleton gradient={gradient} />}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="overflow-clip">
        <HeroIntro />

        {products.map((product, index) => {
          const isFirstTwo = index < 2;
          const nextProduct = products[index + 1];
          const isLast = index === products.length - 1;

          if (isFirstTwo) {
            return (
              <ProductFlavorSection
                key={product.id}
                product={product}
                nextProduct={nextProduct}
                isLast={isLast}
              />
            );
          }

          return (
            <LazySection key={product.id} gradient={product.gradient}>
              <LazyProductSection
                product={product}
                nextProduct={nextProduct}
                isLast={isLast}
              />
            </LazySection>
          );
        })}
      </main>

      <Footer />
    </>
  );
}
