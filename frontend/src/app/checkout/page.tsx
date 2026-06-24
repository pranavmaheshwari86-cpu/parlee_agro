"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import RazorpayCheckout from "@/components/RazorpayCheckout";

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const subtotal = getSubtotal();
  const shippingCharges = subtotal > 500 || subtotal === 0 ? 0 : 50;
  const tax = subtotal * 0.18;
  const grandTotal = subtotal + shippingCharges + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOrder = async () => {
    if (!formData.name || !formData.mobileNumber || !formData.address) {
      throw new Error("Please fill in all required fields (Name, Mobile, Address)");
    }

    const orderItems = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    if (orderItems.length === 0) {
      throw new Error("Your cart is empty");
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        items: orderItems,
        paymentMethod: "ONLINE",
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to create order");
    }

    return data.order.id;
  };

  return (
    <div className="bg-[#141011] text-[#e0e2f0] font-sans min-h-screen flex flex-col antialiased">
      {/* TopAppBar */}
      <header className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-2xl fixed top-0 w-full z-50 border-b border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-between px-4 md:px-10 h-16">
        <Link href="/cart" className="text-[#e29ba7] hover:opacity-80 transition-opacity active:scale-95 transition-transform duration-200 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="font-serif text-2xl font-bold text-[#e0e2f0] tracking-tighter">Checkout</h1>
        <div className="w-6">{/* Spacer for centering */}</div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-32 px-4 md:px-10 max-w-4xl mx-auto w-full flex flex-col gap-8">
        {/* Progress Indicator */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-[#e1bec5] uppercase tracking-widest px-2">
          <Link href="/cart" className="hover:text-white transition-colors cursor-pointer hover:underline underline-offset-4">Cart</Link>
          <span className="opacity-50">/</span>
          <span className="text-[#A31D33] font-bold">Details</span>
          <span className="opacity-50">/</span>
          <span className="opacity-70">Payment</span>
          <span className="opacity-50">/</span>
          <span className="opacity-70">Success</span>
        </div>

        {/* Contact Information Card */}
        <section className="bg-[#1c1f29] rounded-xl p-4 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-t border-white/5 flex flex-col gap-6 relative overflow-hidden">
          <h2 className="font-serif text-2xl text-[#e0e2f0] tracking-tighter border-b border-white/5 pb-4">1. Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs text-[#e1bec5] uppercase tracking-wider font-semibold">Full Name *</label>
              <input 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-[#141011] border border-white/5 rounded-lg px-4 py-3 text-[#e0e2f0] shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:outline-none focus:ring-1 focus:ring-[#A31D33] focus:border-[#A31D33] transition-all placeholder:text-[#e1bec5]/50" 
                placeholder="John Doe" 
                type="text"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#e1bec5] uppercase tracking-wider font-semibold">Mobile Number *</label>
              <input 
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="bg-[#141011] border border-white/5 rounded-lg px-4 py-3 text-[#e0e2f0] shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:outline-none focus:ring-1 focus:ring-[#A31D33] transition-all placeholder:text-[#e1bec5]/50" 
                placeholder="e.g. 9876543210" 
                type="tel"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#e1bec5] uppercase tracking-wider font-semibold">Email Address</label>
              <input 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-[#141011] border border-white/5 rounded-lg px-4 py-3 text-[#e0e2f0] shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:outline-none focus:ring-1 focus:ring-[#A31D33] transition-all placeholder:text-[#e1bec5]/50" 
                placeholder="you@domain.com" 
                type="email"
              />
            </div>
          </div>
        </section>

        {/* Delivery Address Card */}
        <section className="bg-[#1c1f29] rounded-xl p-4 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-t border-white/5 flex flex-col gap-6 relative overflow-hidden">
          <h2 className="font-serif text-2xl text-[#e0e2f0] tracking-tighter border-b border-white/5 pb-4">2. Delivery Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs text-[#e1bec5] uppercase tracking-wider font-semibold">Complete Address *</label>
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="bg-[#141011] border border-white/5 rounded-lg px-4 py-3 text-[#e0e2f0] shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:outline-none focus:ring-1 focus:ring-[#A31D33] transition-all placeholder:text-[#e1bec5]/50 resize-none" 
                placeholder="Flat/House number, building, street address" 
                rows={3}
                required
              ></textarea>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#e1bec5] uppercase tracking-wider font-semibold">City</label>
              <input 
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="bg-[#141011] border border-white/5 rounded-lg px-4 py-3 text-[#e0e2f0] shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:outline-none focus:ring-1 focus:ring-[#A31D33] transition-all placeholder:text-[#e1bec5]/50" 
                placeholder="City name" 
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#e1bec5] uppercase tracking-wider font-semibold">Zip / Postal Code</label>
              <input 
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="bg-[#141011] border border-white/5 rounded-lg px-4 py-3 text-[#e0e2f0] shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:outline-none focus:ring-1 focus:ring-[#A31D33] transition-all placeholder:text-[#e1bec5]/50" 
                placeholder="6 digits ZIP" 
                type="text"
              />
            </div>
          </div>
        </section>

        {/* Order Summary Card */}
        <section className="bg-[#1c1f29] rounded-xl p-4 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-t border-white/5 flex flex-col gap-4 relative overflow-hidden">
          <div className="flex justify-between items-center text-[#e1bec5]">
            <span className="text-base">Subtotal</span>
            <span className="text-base text-[#e0e2f0]">₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center text-[#e1bec5]">
            <span className="text-base">Shipping Charges</span>
            <span className="text-base text-[#e0e2f0]">₹{shippingCharges.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center text-[#e1bec5] pb-4 border-b border-white/5 border-dashed">
            <span className="text-base">Tax (18% GST)</span>
            <span className="text-base text-[#e0e2f0]">₹{tax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-serif text-2xl font-bold text-[#e0e2f0] tracking-tighter">Grand Total</span>
            <span className="font-serif text-2xl font-bold text-[#A31D33] tracking-tighter">
              ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </section>
      </main>

      {/* BottomNavBar (Action Bar) */}
      <nav className="bg-[#1c1f29] fixed bottom-0 w-full z-50 rounded-t-xl border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] flex flex-col gap-3 px-4 md:px-10 py-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col">
            <span className="text-xs text-[#e1bec5] uppercase tracking-wider font-semibold">Total</span>
            <span className="font-serif text-2xl text-[#e0e2f0] font-bold tracking-tighter">
              ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <RazorpayCheckout
            amount={grandTotal}
            onCreateOrder={handleCreateOrder}
            onSuccess={() => {
              clearCart();
              alert("Payment Successful! Your order has been placed.");
              router.push("/");
            }}
            onError={(err) => alert(`Payment Failed: ${err}`)}
            className="bg-[#e29ba7] text-[#65002e] font-bold rounded-lg px-4 sm:px-6 py-3 text-sm sm:text-base flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-[0.98] shadow-[0_4px_16px_rgba(255,74,141,0.3)] border-t border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Complete Purchase
          </RazorpayCheckout>
        </div>
        
        {/* Trust Signals */}
        <div className="flex items-center justify-center gap-4 text-[#e1bec5]/40 mb-1">
          <svg className="h-4 w-auto" viewBox="0 0 38 24" fill="currentColor">
            <path d="M12.95 21.03h3.58l2.25-14.1h-3.58l-2.25 14.1zM28.3 7.15c-1-.44-2.28-.77-3.8-.77-4.05 0-6.9 2.05-6.94 5-.04 2.18 2.04 3.4 3.6 4.1 1.6.72 2.13 1.18 2.13 1.83-.02 1-1.25 1.45-2.4 1.45-1.58 0-2.44-.24-3.74-.78l-.52-.25-.54 3.2c.92.4 2.6.76 4.38.78 4.3 0 7.1-2.02 7.14-5.14.02-1.72-1.02-3.03-3.46-4.14-1.44-.7-2.3-1.15-2.3-1.84 0-.64.76-1.3 2.3-1.3 1.3 0 2.22.25 2.97.55l.36.16.53-3.15zM29.67 21.03h3.42l3.24-14.1h-2.92c-.65 0-1.15.18-1.43.83l-4.1 9.9-2.35-10.73h-3.66l3.6 14.1h3.76zM7.17 7.15H2.57c-.63 0-1.15.2-1.42.84l-5.38 13.04h3.66l.73-1.92h4.5l.42 1.92h3.2l-1.1-14.1z" />
          </svg>
          <svg className="h-4 w-auto" viewBox="0 0 38 24" fill="currentColor">
            <path d="M23.95 12c0-3.32 1.54-6.28 3.96-8.24A12.06 12.06 0 0 0 19.38 2C13.86 2 9.4 6.48 9.4 12s4.46 10 9.98 10c3.2 0 6.06-1.48 7.96-3.8A10.43 10.43 0 0 1 23.95 12zM33.4 3.76A12.06 12.06 0 0 0 24.87 2c-5.52 0-9.98 4.48-9.98 10s4.46 10 9.98 10c3.2 0 6.06-1.48 7.96-3.8A10.43 10.43 0 0 0 33.4 3.76z" />
          </svg>
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure
          </div>
        </div>
      </nav>
    </div>
  );
}
