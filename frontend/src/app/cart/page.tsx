"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import Navbar from "@/components/Navbar";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getSubtotal } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const subtotal = getSubtotal();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0a0808] text-white flex flex-col items-center justify-center pt-32 pb-20 px-4 md:px-8 font-sans">
      <Navbar />

      <div className="w-full max-w-[1200px] bg-[#141011] rounded-[40px] border border-white/5 p-4 sm:p-8 md:p-14 shadow-2xl relative overflow-hidden">
        
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-[#c4a371] opacity-[0.03] blur-[120px] pointer-events-none"></div>

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-14 gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#C4A371] font-bold tracking-tighter">Your Cart</h1>
            <p className="text-[#888A95] text-lg mt-2 font-medium tracking-wide">Indulge in your favorites</p>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6 bg-[#1c1718] border border-white/5 rounded-3xl px-4 sm:px-6 py-4 shadow-[0_12px_24px_rgba(0,0,0,0.4)]">
            <svg className="w-8 h-8 text-[#C4A371]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-white text-xl font-bold">{itemCount}</span>
                <span className="bg-[#A31D33] text-white text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md">Items</span>
              </div>
              <span className="text-[#A31D33] font-black text-2xl tracking-wide leading-none mt-1">
                ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center w-full">
            <svg className="w-24 h-24 text-[#C4A371]/20 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-4xl text-[#C4A371] font-serif mb-4 tracking-tighter">Your cart is empty</h2>
            <p className="text-[#888A95] mb-12">Looks like you haven&apos;t added any indulgence yet.</p>
            
            <div className="w-full max-w-4xl text-left border-t border-white/5 pt-12">
              <h3 className="text-2xl font-serif text-white mb-6 tracking-tighter">Trending Right Now</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* Mock Trending Items */}
                <div className="bg-[#1c1718] border border-white/5 rounded-2xl p-4 flex flex-col gap-4 shadow-lg group hover:border-white/10 transition-colors">
                  <div className="w-full aspect-[4/5] bg-[#33292c] rounded-xl relative overflow-hidden border border-white/5">
                     <Image src="/Thumbnail/Smoodh_Chocolate_Hazelnut.jpeg" alt="Hazelnut Chocolate" fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                     <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none transform -skew-x-12"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-serif text-lg tracking-tight">Hazelnut Chocolate</h4>
                    <p className="text-[#A31D33] font-bold mt-1">₹30.00</p>
                  </div>
                  <Link href="/products/chocolate-hazelnut" className="w-full py-2 bg-[#141011] border border-[#A31D33]/30 text-[#e1bec5] text-sm text-center rounded-lg font-bold tracking-wider uppercase hover:bg-[#A31D33] hover:text-white transition-colors active:scale-[0.98]">
                    Shop Now
                  </Link>
                </div>
                
                <div className="bg-[#1c1718] border border-white/5 rounded-2xl p-4 flex flex-col gap-4 shadow-lg group hover:border-white/10 transition-colors">
                  <div className="w-full aspect-[4/5] bg-[#33292c] rounded-xl relative overflow-hidden border border-white/5">
                     <Image src="/Thumbnail/Bailey_Soda.png" alt="Bailley Soda" fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                     <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none transform -skew-x-12"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-serif text-lg tracking-tight">Bailley Soda</h4>
                    <p className="text-[#A31D33] font-bold mt-1">₹15.00</p>
                  </div>
                  <Link href="/products/bailley-soda" className="w-full py-2 bg-[#141011] border border-[#A31D33]/30 text-[#e1bec5] text-sm text-center rounded-lg font-bold tracking-wider uppercase hover:bg-[#A31D33] hover:text-white transition-colors active:scale-[0.98]">
                    Shop Now
                  </Link>
                </div>

                <div className="bg-[#1c1718] border border-white/5 rounded-2xl p-4 flex flex-col gap-4 shadow-lg group hover:border-white/10 transition-colors hidden md:flex">
                  <div className="w-full aspect-[4/5] bg-[#33292c] rounded-xl relative overflow-hidden border border-white/5">
                     <Image src="/Thumbnail/Frio_Lime.png" alt="Lemon Frio" fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                     <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none transform -skew-x-12"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-serif text-lg tracking-tight">Lemon Frio</h4>
                    <p className="text-[#A31D33] font-bold mt-1">₹20.00</p>
                  </div>
                  <Link href="/products/frio-lime" className="w-full py-2 bg-[#141011] border border-[#A31D33]/30 text-[#e1bec5] text-sm text-center rounded-lg font-bold tracking-wider uppercase hover:bg-[#A31D33] hover:text-white transition-colors active:scale-[0.98]">
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* ── Item List ── */}
            <div className="flex flex-col gap-6">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#1c1718] border border-white/5 rounded-[32px] p-4 sm:p-6 flex flex-col sm:flex-row gap-6 sm:gap-8 relative shadow-[0_8px_32px_rgba(0,0,0,0.3)] group"
                  >
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-[#141011] text-white/40 hover:bg-white/10 hover:text-white transition-colors z-10 shadow-inner"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    {/* Image */}
                    <div className="w-full sm:w-[180px] aspect-[4/5] rounded-3xl bg-[#33292c] flex-shrink-0 relative overflow-hidden border border-white/5 shadow-inner">
                      {item.image && (
                        <>
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-700" 
                            unoptimized 
                          />
                          {/* Sheen Effect */}
                          <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none transform -skew-x-12"></div>
                        </>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col flex-grow py-0 sm:py-3 pr-0 sm:pr-8">
                      <h2 className="text-3xl font-serif text-white mb-4 tracking-tighter">{item.name}</h2>
                      <div className="inline-block border border-red-500/20 bg-[#3a1a23] text-[#A31D33] text-xs uppercase font-bold tracking-[0.15em] px-4 py-1.5 rounded-full mb-auto self-start shadow-sm">
                        {item.subName || "VELVETY INDULGENCE"}
                      </div>
                      
                      <div className="flex flex-wrap sm:flex-nowrap justify-between items-end mt-6 sm:mt-8 gap-4">
                        <div className="flex flex-col">
                          <div className="text-[32px] sm:text-[44px] font-black text-[#A31D33] tracking-tighter leading-none mb-1.5">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </div>
                          <div className="text-[#888A95] text-sm font-bold uppercase tracking-wider">
                            ₹{item.price.toLocaleString("en-IN")} / PIECE
                          </div>
                        </div>
                        
                        <div className="flex items-center bg-[#141011] rounded-2xl border border-white/5 p-1.5 shadow-inner">
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-12 h-12 flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 transition-colors rounded-xl hover:bg-white/5"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-10 text-center text-white font-bold text-2xl">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── Bottom Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
              
              {/* Promo Code */}
              <div className="bg-[#1c1718] border border-white/5 rounded-[32px] p-6 sm:p-8 shadow-lg h-fit">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 rounded-full border border-[#C4A371]/30 bg-[#C4A371]/10 flex items-center justify-center shadow-inner">
                    <svg className="w-6 h-6 text-[#C4A371]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white text-lg font-bold tracking-wide">Promo Code</div>
                    <div className="text-[#888A95] text-sm mt-1">Enter code to get discount</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    className="flex-grow bg-[#141011] border border-white/5 rounded-2xl px-6 py-4 text-base text-white placeholder-white/20 focus:outline-none focus:border-[#A31D33]/50 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)] transition-all" 
                  />
                  <button className="bg-[#141011] hover:bg-[#261f21] border border-white/5 text-[#A31D33] px-10 py-4 rounded-2xl text-base font-bold tracking-wide transition-all active:scale-95 shadow-sm">
                    Apply
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-[#1c1718] border border-white/5 rounded-[32px] p-6 sm:p-8 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-white/70 text-lg font-medium tracking-wide">Subtotal</span>
                    <span className="text-white text-xl font-bold tracking-wide">₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t border-white/5 pt-6 mb-4 flex justify-between items-end">
                    <div>
                      <div className="text-white font-bold text-2xl tracking-wide mb-1">Total</div>
                      <div className="text-white/40 text-xs uppercase tracking-[0.15em] font-bold">Inclusive of all taxes</div>
                    </div>
                    <div className="text-[32px] sm:text-[44px] font-black text-[#A31D33] tracking-tighter leading-none">
                      ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => router.push("/checkout")}
                  className="w-full mt-10 bg-gradient-to-r from-[#A31D33] to-[#5c0a18] text-white py-5 rounded-2xl font-bold text-lg uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_12px_24px_rgba(217,92,115,0.25)]"
                >
                  PROCEED TO CHECKOUT 
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* ── Bottom Badges ── */}
      <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 mt-16 w-full max-w-[1000px]">
        <div className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-full border border-[#C4A371]/20 flex items-center justify-center bg-black/20 group-hover:border-[#C4A371]/50 transition-colors shadow-inner">
            <svg className="w-6 h-6 text-[#C4A371]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[#C4A371] text-sm font-bold tracking-wide">Secure Checkout</span>
            <span className="text-[#888A95] text-[11px] mt-1 tracking-wider uppercase">100% protected</span>
          </div>
        </div>

        <div className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-full border border-[#C4A371]/20 flex items-center justify-center bg-black/20 group-hover:border-[#C4A371]/50 transition-colors shadow-inner">
            <svg className="w-6 h-6 text-[#C4A371]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[#C4A371] text-sm font-bold tracking-wide">Premium Quality</span>
            <span className="text-[#888A95] text-[11px] mt-1 tracking-wider uppercase">Finest indulgence</span>
          </div>
        </div>

        <div className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-full border border-[#C4A371]/20 flex items-center justify-center bg-black/20 group-hover:border-[#C4A371]/50 transition-colors shadow-inner">
            <svg className="w-6 h-6 text-[#C4A371]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[#C4A371] text-sm font-bold tracking-wide">Fast Delivery</span>
            <span className="text-[#888A95] text-[11px] mt-1 tracking-wider uppercase">At your doorstep</span>
          </div>
        </div>
      </div>

    </div>
  );
}
