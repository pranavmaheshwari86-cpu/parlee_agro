"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import PaymentProvider from "./PaymentProvider";
export default function CartDrawer() {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const [isCheckout, setIsCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("ONLINE");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    zipCode: "",
  });

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
        if (paymentMethod === "COD") {
          setOrderComplete(true);
          clearCart();
        } else {
          setCreatedOrderId(data.order ? data.order.id : data.id);
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
      setIsCheckout(false);
      setOrderComplete(false);
      setCreatedOrderId(null);
    }, 300); // Reset state after animation finishes
  };

  const subtotal = getSubtotal();

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-[101] flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">
                {orderComplete ? "Order Complete" : isCheckout ? "Checkout" : "Your Cart"}
              </h2>
              <button
                onClick={handleClose}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {orderComplete ? (
                <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Thank you!</h3>
                  <p className="text-gray-500">Your order has been placed successfully.</p>
                  <button
                    onClick={handleClose}
                    className="mt-6 w-full rounded-full bg-gray-900 py-3 font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <svg className="mb-4 h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
                  <p className="mt-1 text-sm text-gray-500">Looks like you haven&apos;t added anything yet.</p>
                  <button
                    onClick={handleClose}
                    className="mt-6 rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : isCheckout ? (
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      required
                      type="text"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      required
                      type="email"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Shipping Address</label>
                    <textarea
                      required
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                    <input
                      required
                      type="text"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      disabled={!!createdOrderId}
                    />
                  </div>
                  <div>
                    <label className="mb-2 mt-2 block text-sm font-medium text-gray-700">Payment Method</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="ONLINE"
                          checked={paymentMethod === "ONLINE"}
                          onChange={() => setPaymentMethod("ONLINE")}
                          disabled={!!createdOrderId}
                          className="h-4 w-4 text-pink-500 focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-700">Online Payment</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={paymentMethod === "COD"}
                          onChange={() => setPaymentMethod("COD")}
                          disabled={!!createdOrderId}
                          className="h-4 w-4 text-pink-500 focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-700">Cash on Delivery</span>
                      </label>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      <div 
                        className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-xl overflow-hidden"
                        style={{ backgroundColor: `${item.themeColor}20` }}
                      >
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-contain p-2" sizes="96px" />
                        ) : (
                          <div 
                            className="h-12 w-12 rounded-full"
                            style={{ backgroundColor: item.themeColor }}
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                            <button 
                              onClick={() => removeFromCart(item.productId)}
                              disabled={isCheckout || !!createdOrderId}
                              className="text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-sm text-gray-500">{item.subName}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900">₹{item.price}</p>
                          <div className={`flex items-center rounded-lg border border-gray-200 ${(isCheckout || !!createdOrderId) ? 'opacity-50 pointer-events-none' : ''}`}>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={isCheckout || !!createdOrderId}
                              className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              disabled={isCheckout || !!createdOrderId}
                              className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!orderComplete && items.length > 0 && (
              <div className="border-t bg-gray-50 px-6 py-4">
                <div className="mb-4 flex items-center justify-between text-lg font-bold text-gray-900">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {isCheckout ? (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCheckout(false);
                        setCreatedOrderId(null);
                      }}
                      className="w-1/3 rounded-full border border-gray-300 bg-white py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                      disabled={!!createdOrderId}
                    >
                      Back
                    </button>
                    {!createdOrderId ? (
                      <button
                        type="submit"
                        form="checkout-form"
                        disabled={isLoading}
                        className="flex-1 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600 py-3 font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                      >
                        {isLoading ? "Processing..." : paymentMethod === "COD" ? "Place Order" : "Continue to Payment"}
                      </button>
                    ) : (
                      <div className="flex-1">
                        <PaymentProvider
                          method="RAZORPAY"
                          amount={subtotal}
                          orderId={createdOrderId}
                          onSuccess={(paymentId) => {
                            setOrderComplete(true);
                            clearCart();
                          }}
                          onError={(err) => {
                            alert(err);
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCheckout(true)}
                    className="w-full rounded-full bg-gray-900 py-3 font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Proceed to Checkout
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
