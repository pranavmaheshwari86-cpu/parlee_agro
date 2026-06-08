"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { useLenis } from "lenis/react";
const SMOODH_ITEMS = [
  { href: "#lassi", label: "Lassi" },
  { href: "#chocolate", label: "Chocolate" },
  { href: "#chocolate-hazelnut", label: "Hazelnut" },
  { href: "#coffee-frappe", label: "Coffee Frappe" },
  { href: "#kesar-badam", label: "Kesar Badam" },
  { href: "#toffee-caramel", label: "Toffee Caramel" },
];

const FIZZ_ITEMS = [
  { href: "#appy-fizz", label: "Appy Fizz" },
  { href: "#b-fizz", label: "B Fizz" },
];

const FRIO_ITEMS = [
  { href: "#frio-cola", label: "Frio Cola" },
  { href: "#frio-lime", label: "Frio Lime" },
  { href: "#frio-orange", label: "Frio Orange" },
];

const BOMBAY99_ITEMS = [
  { href: "#bombay99-club-soda", label: "Club Soda" },
  { href: "#bombay99-ginger-ale", label: "Ginger Ale" },
  { href: "#bombay99-tonic-water", label: "Tonic Water" },
];

const BAILLEY_ITEMS = [
  { href: "#bailley-soda", label: "Soda Water" },
  { href: "#bailley-water", label: "Water" },
];

function NavDropdown({ label, items, scrolled }: { label: string, items: {label: string, href: string}[], scrolled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center gap-1 rounded-full min-h-[44px] px-3 text-xl font-medium text-gray-100 hover:bg-white/10 hover:text-white transition-colors"
      >
        {label}
        <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      <AnimatePresence>
        {isOpen && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 mt-1 w-48 rounded-2xl bg-white/90 backdrop-blur-xl shadow-xl ring-1 ring-black/5 overflow-hidden py-2"
          >
            {items.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-xl text-gray-700 transition-colors hover:bg-pink-50 hover:text-pink-600"
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavLink({ href, label, scrolled }: { href: string, label: string, scrolled: boolean }) {
  return (
    <a
      href={href}
      className="flex items-center rounded-full min-h-[44px] px-3 text-xl font-medium text-gray-100 hover:bg-white/10 hover:text-white transition-colors"
    >
      {label}
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const cartItems = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);
  
  const cartItemCount = isMounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

  useEffect(() => {
    setIsMounted(true);
    setScrolled(window.scrollY > 24);
  }, []);

  useLenis(({ scroll }) => {
    setScrolled(scroll > 24);
  });

  const scrollToFirstBuy = () => {
    document
      .getElementById(`buy-${products[0].id}`)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/20 backdrop-blur-xl shadow-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <a href="#home" className="flex shrink-0 flex-col items-center group">
          <div className="flex items-baseline gap-1.5 text-2xl md:text-3xl font-black italic tracking-tight transition-transform group-hover:scale-105">
            <span className="text-[#e21b22]">Parlee</span>
            <span className="text-[#39b54a] flex items-center">
              A
              <span className="relative inline-flex items-center justify-center -ml-0.5 mr-0.5">
                g
              </span>
              ro
            </span>
          </div>
          <svg className="w-full h-2.5 md:h-3 text-[#39b54a] mt-0.5 fill-current" viewBox="0 0 120 12" preserveAspectRatio="none">
            <path d="M0,10 C30,-2 80,-2 120,4 C80,14 30,14 0,10 Z" />
          </svg>
          <div className="text-[#39b54a] text-[8px] md:text-[10px] font-semibold tracking-[0.3em] uppercase mt-1 ml-1 opacity-90">
            refreshing india
          </div>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          <NavDropdown label="Smoodh" items={SMOODH_ITEMS} scrolled={scrolled} />
          <NavDropdown label="Fizz" items={FIZZ_ITEMS} scrolled={scrolled} />
          <NavDropdown label="Frio" items={FRIO_ITEMS} scrolled={scrolled} />
          <NavDropdown label="Bombay 99" items={BOMBAY99_ITEMS} scrolled={scrolled} />
          <NavDropdown label="Bailley" items={BAILLEY_ITEMS} scrolled={scrolled} />
          
          <div className="mx-2 h-5 w-px bg-gray-400/30" />

          <NavLink href="#frooti" label="Frooti" scrolled={scrolled} />
          <NavLink href="#dhishoom" label="Dhishoom" scrolled={scrolled} />
        </div>

        <div className="flex items-center gap-3">
          <button
            className="md:hidden relative flex items-center justify-center p-2.5 rounded-full text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>


        
        <button
          onClick={openCart}
          className="relative flex items-center justify-center p-2.5 rounded-full text-white hover:bg-white/10 transition-colors"
          aria-label="Open Cart"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cartItemCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg md:hidden z-40 max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <div className="flex flex-col p-4 gap-2">
              <div className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-2">Smoodh</div>
              {SMOODH_ITEMS.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-4 rounded-xl text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                  {item.label}
                </a>
              ))}
              
              <div className="font-semibold text-gray-900 text-sm uppercase tracking-wider mt-4 mb-2">Fizz</div>
              {FIZZ_ITEMS.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-4 rounded-xl text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                  {item.label}
                </a>
              ))}

              <div className="h-px w-full bg-gray-200 my-2" />
              <a href="#frooti" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-4 rounded-xl font-medium text-gray-900 hover:bg-pink-50 transition-colors">Frooti</a>
              <a href="#dhishoom" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-4 rounded-xl font-medium text-gray-900 hover:bg-pink-50 transition-colors">Dhishoom</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
