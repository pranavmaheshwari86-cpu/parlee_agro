"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroIntro from "@/components/HeroIntro";
import ProductFlavorSection from "@/components/ProductFlavorSection";
import { products } from "@/data/products";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="overflow-clip">
        <HeroIntro />

        {products.map((product, index) => (
          <ProductFlavorSection
            key={product.id}
            product={product}
            nextProduct={products[index + 1]}
            isLast={index === products.length - 1}
          />
        ))}
      </main>

      <Footer />
    </>
  );
}
