"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import PaymentProvider from "./PaymentProvider";

export default function CartDrawer() {
  const { items, isCartOpen, checkoutStep, closeCart, removeFromCart, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<"cart" | "checkout" | "payment" | "success" | "address">(checkoutStep === "address" ? "checkout" : checkoutStep as any);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("ONLINE");
  const [isMounted, setIsMounted] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<typeof items>([]);

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    alternateMobile: "",
    email: "",
    country: "India",
    state: "",
    city: "",
    address: "",
    landmark: "",
    zipCode: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      setStep(checkoutStep === "address" ? "checkout" : checkoutStep as any);
    }
  }, [isCartOpen, checkoutStep]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          paymentMethod,
          items,
          subtotal: getSubtotal(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Capture items for the order summary receipt
        setPurchasedItems([...items]);
        
        if (paymentMethod === "COD") {
          setOrderComplete(true);
          setDirection(1);
          setStep("success");
          clearCart();
        } else {
          setCreatedOrderId(data.order ? data.order.id : data.id);
          setDirection(1);
          setStep("payment");
        }
      } else {
        alert("Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    closeCart();
    setTimeout(() => {
      setStep("cart");
      setOrderComplete(false);
      setCreatedOrderId(null);
      setIsLoading(false);
    }, 300); // Reset state after animation finishes
  };

  const handleProceedToCheckout = () => {
    setDirection(1);
    setStep("checkout");
  };

  const handleBackToCart = () => {
    setDirection(-1);
    setStep("cart");
  };

  const handleBackToCheckout = () => {
    setDirection(-1);
    setStep("checkout");
    setCreatedOrderId(null);
  };

  const subtotal = getSubtotal();
  const shippingCharges = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const grandTotal = subtotal + shippingCharges + tax;
  const freeShippingThreshold = 500;
  const amountToFreeShipping = freeShippingThreshold - subtotal;
  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  if (!isMounted) return null;

  // Slide Animation Variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 32 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 32 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  const steps = ["Cart", "Details", "Payment", "Success"];
  const currentStepIndex = step === "cart" ? 0 : step === "checkout" ? 1 : step === "payment" ? 2 : 3;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop with premium blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-[101] flex w-full max-w-md flex-col bg-white border-l border-neutral-100 shadow-[-10px_0_30px_rgba(0,0,0,0.06)]"
          >
            {/* Header section with stepper */}
            <div className="border-b border-neutral-100 px-6 pt-5 pb-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-black tracking-tight text-gray-900">
                  {step === "cart" && "Your Cart"}
                  {step === "checkout" && "Checkout details"}
                  {step === "payment" && "Secure Payment"}
                  {step === "success" && "Order Placed!"}
                </h2>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="rounded-full p-2 text-gray-400 hover:bg-neutral-50 hover:text-gray-700 transition-colors"
                  aria-label="Close cart"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Stepper bar */}
              <div className="flex items-center gap-1.5 mt-3 text-[10px] uppercase font-bold tracking-wider">
                {steps.map((s, idx) => (
                  <div key={s} className="flex items-center gap-1.5">
                    <span
                      className={
                        idx === currentStepIndex
                          ? "text-pink-500 font-bold"
                          : idx < currentStepIndex
                          ? "text-neutral-700 font-medium"
                          : "text-neutral-300"
                      }
                    >
                      {s}
                    </span>
                    {idx < steps.length - 1 && <span className="text-neutral-200">/</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Scrollable Step panels */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-5">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full flex flex-col min-h-full"
                >
                  {/* STEP 1: CART */}
                  {step === "cart" && (
                    items.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", damping: 15, stiffness: 100 }}
                          className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-neutral-50 shadow-inner"
                        >
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="text-pink-400 opacity-60"
                          >
                            <svg className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </motion.div>
                          <motion.span
                            animate={{ scale: [1, 1.2, 1], y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.2 }}
                            className="absolute top-3 right-3 text-lg"
                          >
                            ✨
                          </motion.span>
                          <motion.span
                            animate={{ scale: [1, 1.2, 1], y: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 0.5 }}
                            className="absolute bottom-3 left-3 text-sm"
                          >
                            🌸
                          </motion.span>
                        </motion.div>
                        <h3 className="font-serif text-xl font-bold text-gray-900">Your Cart is Empty</h3>
                        <p className="mt-2 text-sm text-gray-500 max-w-xs">
                          Looks like you haven&apos;t added any delicious beverages yet. Let&apos;s find something refreshing!
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleClose}
                          className="mt-8 rounded-full bg-gray-900 px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-black transition-colors"
                        >
                          Start Shopping
                        </motion.button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Free Shipping Banner */}
                        <div className="rounded-xl bg-pink-50/50 p-3.5 border border-pink-100/30">
                          <div className="flex justify-between items-center text-xs mb-1.5">
                            <span className="font-semibold text-pink-700">
                              {amountToFreeShipping > 0
                                ? `Add ₹${amountToFreeShipping.toFixed(0)} more for FREE shipping!`
                                : "🎉 Congrats! You've unlocked FREE shipping!"}
                            </span>
                            <span className="font-bold text-pink-700">{freeShippingProgress.toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-neutral-200/60 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-pink-400 to-pink-600 origin-left"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: freeShippingProgress / 100 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          </div>
                        </div>

                        {/* List items */}
                        <div className="space-y-4">
                          {items.map((item) => (
                            <motion.div
                              key={item.productId}
                              layout
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -12, scale: 0.95 }}
                              whileHover={{ y: -2 }}
                              className="group relative flex gap-4 rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                              <div
                                  className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-xl overflow-hidden"
                                  style={{ backgroundColor: `${item.themeColor}15` }}
                                >
                                  {item.image ? (
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                                      sizes="80px"
                                      unoptimized={true}
                                    />
                                  ) : (
                                    <div
                                      className="h-10 w-10 rounded-full shadow-inner animate-pulse"
                                      style={{ backgroundColor: item.themeColor }}
                                    />
                                  )}
                                  <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                                    style={{ background: `radial-gradient(circle, ${item.themeColor}40 0%, transparent 70%)` }}
                                  />
                                </div>

                                <div className="flex flex-1 flex-col justify-between">
                                  <div>
                                    <div className="flex justify-between items-start gap-2">
                                      <h4 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-pink-600 transition-colors">
                                        {item.name}
                                      </h4>
                                      <button
                                        onClick={() => removeFromCart(item.productId)}
                                        className="text-gray-300 hover:text-red-500 active:scale-90 transition-all p-0.5 rounded"
                                        title="Remove item"
                                      >
                                        <svg className="h-5 w-5 transition-transform duration-200 group-hover:rotate-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{item.subName}</p>
                                  </div>

                                  <div className="flex items-center justify-between mt-2">
                                    <p className="font-bold text-sm text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                                    
                                    <div className="flex items-center rounded-lg border border-neutral-100 bg-neutral-50/50 p-0.5">
                                      <button
                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-white hover:text-gray-900 active:scale-90 transition-all font-semibold"
                                      >
                                        −
                                      </button>
                                      <span className="w-7 text-center text-xs font-bold text-gray-800 tabular-nums">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-white hover:text-gray-900 active:scale-90 transition-all font-semibold"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )
                    )}

                    {/* STEP 2: CHECKOUT DETAILS */}
                    {step === "checkout" && (
                      <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
                        {/* Group 1: Contact Details */}
                        <div className="space-y-4">
                          <h3 className="font-serif text-[15px] font-bold text-gray-900 border-b border-neutral-100 pb-1">
                            1. Contact Information
                          </h3>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Full name</label>
                              <input
                                required
                                type="text"
                                placeholder="John Doe"
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/10 placeholder:text-neutral-300"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Mobile number</label>
                              <input
                                required
                                type="tel"
                                placeholder="e.g. 9876543210"
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/10 placeholder:text-neutral-300"
                                value={formData.mobileNumber}
                                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Email address</label>
                              <input
                                required
                                type="email"
                                placeholder="you@domain.com"
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/10 placeholder:text-neutral-300"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Alternate mobile (optional)</label>
                              <input
                                type="tel"
                                placeholder="Alternative phone"
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/10 placeholder:text-neutral-300"
                                value={formData.alternateMobile}
                                onChange={(e) => setFormData({ ...formData, alternateMobile: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Group 2: Shipping details */}
                        <div className="space-y-4">
                          <h3 className="font-serif text-[15px] font-bold text-gray-900 border-b border-neutral-100 pb-1">
                            2. Delivery Address
                          </h3>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Complete address</label>
                              <textarea
                                required
                                rows={2}
                                placeholder="Flat/House number, building, street address"
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/10 placeholder:text-neutral-300 resize-none"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Landmark (optional)</label>
                              <input
                                type="text"
                                placeholder="e.g. near city park"
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/10 placeholder:text-neutral-300"
                                value={formData.landmark}
                                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">ZIP / Postal code</label>
                              <input
                                required
                                type="text"
                                placeholder="6 digits ZIP"
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/10 placeholder:text-neutral-300"
                                value={formData.zipCode}
                                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">City</label>
                              <input
                                required
                                type="text"
                                placeholder="City name"
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/10 placeholder:text-neutral-300"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">State</label>
                              <input
                                required
                                type="text"
                                placeholder="State/Province"
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/10 placeholder:text-neutral-300"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Country</label>
                              <input
                                required
                                type="text"
                                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm transition-all focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/10"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Group 3: Payment Selection Cards */}
                        <div className="space-y-4">
                          <h3 className="font-serif text-[15px] font-bold text-gray-900 border-b border-neutral-100 pb-1">
                            3. Payment Method
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div
                              onClick={() => setPaymentMethod("ONLINE")}
                              className={`cursor-pointer rounded-xl border p-4 transition-all flex flex-col justify-between h-28 relative overflow-hidden select-none ${
                                paymentMethod === "ONLINE"
                                  ? "border-pink-500 bg-pink-50/20 text-pink-700"
                                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                {paymentMethod === "ONLINE" && (
                                  <motion.div layoutId="paymentCheck" className="h-4 w-4 bg-pink-500 rounded-full flex items-center justify-center text-white">
                                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </motion.div>
                                )}
                              </div>
                              <div>
                                <span className="font-bold text-xs uppercase tracking-wider block">Pay Online</span>
                                <span className="text-[9px] text-neutral-400 mt-0.5 block">UPI / Cards / NetBanking</span>
                              </div>
                            </div>

                            <div
                              onClick={() => setPaymentMethod("COD")}
                              className={`cursor-pointer rounded-xl border p-4 transition-all flex flex-col justify-between h-28 relative overflow-hidden select-none ${
                                paymentMethod === "COD"
                                  ? "border-pink-500 bg-pink-50/20 text-pink-700"
                                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {paymentMethod === "COD" && (
                                  <motion.div layoutId="paymentCheck" className="h-4 w-4 bg-pink-500 rounded-full flex items-center justify-center text-white">
                                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </motion.div>
                                )}
                              </div>
                              <div>
                                <span className="font-bold text-xs uppercase tracking-wider block">COD</span>
                                <span className="text-[9px] text-neutral-400 mt-0.5 block">Cash on Delivery</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* STEP 3: SECURE PAYMENT GATEWAY WAITING */}
                    {step === "payment" && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto space-y-6">
                        <div className="relative">
                          <div className="h-16 w-16 rounded-full border-4 border-neutral-100 border-t-pink-500 animate-spin" />
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg">🔒</span>
                        </div>
                        <div>
                          <h3 className="font-serif text-lg font-bold text-gray-900">Awaiting Payment Completion</h3>
                          <p className="mt-2 text-xs text-gray-500 max-w-xs mx-auto">
                            We have successfully generated your order request. Please complete the transaction using the Razorpay gateway popup to place your order.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: ORDER SUCCESS CELEBRATION */}
                    {step === "success" && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-4">
                        {/* Confetti Animation */}
                        <div className="relative mb-6">
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/10"
                          >
                            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                          {[...Array(6)].map((_, i) => {
                            const angle = (i * 360) / 6;
                            const radius = 36;
                            const x = Math.cos((angle * Math.PI) / 180) * radius;
                            const y = Math.sin((angle * Math.PI) / 180) * radius;
                            return (
                              <motion.div
                                key={i}
                                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                                animate={{ x, y, scale: [0, 1, 0], opacity: [1, 1, 0] }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                                className="absolute left-[35px] top-[35px] h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: i % 2 === 0 ? '#10B981' : '#F59E0B' }}
                              />
                            );
                          })}
                        </div>

                        <h3 className="font-serif text-2xl font-black text-gray-900">Order Confirmed!</h3>
                        <p className="mt-2 text-xs text-gray-500 max-w-xs mx-auto">
                          Thank you for your purchase! A confirmation email and shipment status updates will be sent to <span className="font-semibold text-gray-800">{formData.email}</span>.
                        </p>

                        {/* Summary invoice receipt details */}
                        <div className="w-full max-w-sm rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 text-left my-6 space-y-3">
                          <div className="flex justify-between items-center text-xs pb-2 border-b border-neutral-100">
                            <span className="text-gray-400 font-semibold uppercase tracking-wider">Deliver To</span>
                            <span className="font-bold text-gray-800">{formData.name}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs pb-2 border-b border-neutral-100">
                            <span className="text-gray-400 font-semibold uppercase tracking-wider">Payment option</span>
                            <span className="font-bold text-gray-800">{paymentMethod === "COD" ? "Cash on Delivery" : "Paid Online"}</span>
                          </div>
                          <div className="text-xs space-y-1.5 pt-1">
                            <span className="text-gray-400 font-semibold uppercase tracking-wider block mb-1">Purchased Items</span>
                            {purchasedItems.map((it) => (
                              <div key={it.productId} className="flex justify-between text-gray-600">
                                <span>
                                  {it.name} <span className="text-gray-400">x {it.quantity}</span>
                                </span>
                                <span className="font-semibold text-gray-800">
                                  ₹{(it.price * it.quantity).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleClose}
                          className="w-full rounded-full bg-gray-900 py-3.5 font-bold text-white shadow-md hover:bg-black transition-colors"
                        >
                          Continue Shopping
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer Summary / Checkout Buttons */}
              {step !== "success" && items.length > 0 && (
                <div className="border-t border-neutral-100 bg-neutral-50/50 px-6 py-5 backdrop-blur-md">
                  {/* Grand Total Invoice calculation */}
                  <div className="space-y-2 text-xs text-gray-600 mb-5">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-800">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Charges</span>
                      <span className="font-semibold text-gray-800">
                        {shippingCharges === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${shippingCharges}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (18% GST)</span>
                      <span className="font-semibold text-gray-800">₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-dashed border-neutral-200 my-3 pt-3 flex justify-between text-sm font-bold text-gray-900">
                      <span>Grand Total</span>
                      <span className="text-pink-600 text-base">₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Step specific primary action buttons */}
                  {step === "cart" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleProceedToCheckout}
                      className="w-full rounded-full bg-gray-900 py-3.5 font-bold text-white shadow-md hover:bg-black transition-all flex items-center justify-center gap-2 group"
                    >
                      Proceed to Checkout
                      <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  )}

                  {step === "checkout" && (
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleBackToCart}
                        className="w-1/3 rounded-full border border-neutral-200 bg-white py-3.5 font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        form="checkout-form"
                        disabled={isLoading}
                        className="flex-1 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600 py-3.5 font-bold text-white shadow-md shadow-pink-500/10 hover:shadow-lg hover:shadow-pink-500/20 disabled:opacity-75 flex items-center justify-center gap-2"
                      >
                        {isLoading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
                        {isLoading ? "Processing..." : paymentMethod === "COD" ? "Place Order" : "Continue to Payment"}
                      </motion.button>
                    </div>
                  )}

                  {step === "payment" && (
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleBackToCheckout}
                        disabled={isLoading}
                        className="w-1/3 rounded-full border border-neutral-200 bg-white py-3.5 font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                      >
                        Back
                      </motion.button>
                      <div className="flex-1">
                        <PaymentProvider
                          method="RAZORPAY"
                          amount={grandTotal}
                          orderId={createdOrderId || ""}
                          autoStart={true}
                          onSuccess={(paymentId) => {
                            setOrderComplete(true);
                            setDirection(1);
                            setStep("success");
                            clearCart();
                          }}
                          onError={(err) => {
                            alert(err);
                            setCreatedOrderId(null);
                            setStep("checkout");
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
