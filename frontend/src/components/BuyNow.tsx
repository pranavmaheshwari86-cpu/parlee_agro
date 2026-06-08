"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";

interface BuyNowProps {
  product: Product;
}

export default function BuyNow({ product }: BuyNowProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const addToCart = useCartStore((state) => state.addToCart);
  const isDark = product.isDark ?? false;
  const { buyNowSection: buy } = product;

  const hasPackages = product.packages && product.packages.length > 0;
  const currentPackage = hasPackages ? product.packages![selectedPackageIndex] : null;
  const displayPrice = currentPackage ? currentPackage.price : buy.price;
  const displayUnit = currentPackage ? currentPackage.unit : buy.unit;
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-white/80" : "text-gray-600";
  const cardBg = isDark
    ? "bg-[#1A1A1A] border border-white/10 shadow-2xl"
    : "bg-white border border-black/5 shadow-2xl";

  return (
    <section id={`buy-${product.id}`} className="px-6 py-12 pb-24 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] ${cardBg}`}
      >
        <div className="grid md:grid-cols-5">
          <div className="p-8 md:col-span-3 md:p-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500 drop-shadow-sm">
              Checkout
            </p>
            <h2 className={`mt-3 text-fluid-h2 font-black font-serif tracking-tight ${textPrimary}`}>
              {product.name}
            </h2>
            <p className={`mt-2 text-lg font-light ${textMuted}`}>{product.subName}</p>

            {hasPackages && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.packages!.map((pkg, idx) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackageIndex(idx)}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all border ${
                      selectedPackageIndex === idx
                        ? "text-white shadow-md"
                        : `border-gray-200 ${textPrimary} hover:bg-gray-50`
                    }`}
                    style={
                      selectedPackageIndex === idx
                        ? { backgroundColor: product.themeColor, borderColor: product.themeColor }
                        : {}
                    }
                  >
                    {pkg.label}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 flex items-baseline gap-3">
              <span
                className={`text-fluid-h1 font-black tracking-tighter ${textPrimary}`}
              >
                {displayPrice}
              </span>
              <span className={`text-lg font-bold ${textMuted}`}>{displayUnit}</span>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <span className={`text-sm font-bold uppercase tracking-wider ${textMuted}`}>Quantity</span>
              <div className={`flex items-center overflow-hidden rounded-full border ${isDark ? 'border-white/10 bg-[#222]' : 'border-gray-200 bg-gray-50'}`}>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className={`flex min-h-[48px] min-w-[48px] items-center justify-center text-xl transition-colors hover:bg-black/5 ${textPrimary}`}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span 
                  className={`min-w-[3rem] text-center font-bold tabular-nums ${textPrimary}`}
                  aria-live="polite"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className={`flex min-h-[48px] min-w-[48px] items-center justify-center text-xl transition-colors hover:bg-black/5 ${textPrimary}`}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={() => {
                addToCart({
                  productId: currentPackage ? currentPackage.id : product.id,
                  name: product.name,
                  subName: currentPackage ? `${product.subName} • ${currentPackage.label}` : product.subName,
                  price: parseInt(displayPrice.replace(/[^0-9]/g, ''), 10),
                  quantity: quantity,
                  themeColor: product.themeColor,
                  image: product.detailImage || `${product.folderPath}/120.webp`,
                });
              }}
              className="group relative mt-12 w-full overflow-hidden rounded-full py-5 text-xl font-bold text-white shadow-xl transition-all hover:shadow-2xl hover:-translate-y-0.5"
              style={{
                backgroundColor: product.themeColor,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 drop-shadow-sm">Add to Cart — {displayPrice}</span>
              <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
            </motion.button>
          </div>

          <div className={`p-8 md:col-span-2 md:p-14 ${isDark ? "bg-[#222]" : "bg-gray-50"} border-l ${isDark ? "border-white/5" : "border-black/5"}`}>
            <h3 className={`text-xl font-black font-serif ${textPrimary}`}>What you get</h3>
            <ul className="mt-8 space-y-5">
              {buy.processingParams.map((param, index) => (
                <motion.li 
                  key={param} 
                  className={`flex items-start gap-3 text-base font-medium ${textMuted}`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                    style={{ backgroundColor: product.themeColor }}
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {param}
                </motion.li>
              ))}
            </ul>

            <div className={`mt-12 space-y-6 rounded-2xl p-6 ${isDark ? "bg-white/5" : "bg-white"} border ${isDark ? "border-white/5" : "border-black/5"} text-sm leading-relaxed ${textMuted} shadow-sm`}>
              <p>
                <strong className={`block mb-1.5 font-bold ${textPrimary}`}>Delivery</strong>
                {buy.deliveryPromise}
              </p>
              <p>
                <strong className={`block mb-1.5 font-bold ${textPrimary}`}>Returns</strong>
                {buy.returnPolicy}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
