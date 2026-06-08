"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

interface RazorpayCheckoutProps {
  amount: number;
  orderId: string; // The internal DB order ID
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

export default function RazorpayCheckout({ amount, orderId, onSuccess, onError }: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      setScriptLoaded(true);
    }
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      onError("Razorpay SDK failed to load. Are you online?");
      return;
    }

    setLoading(true);

    try {
      // 1. Create Order on Backend
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, orderId, currency: "INR" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      const { orderId: razorpayOrderId, paymentDbId } = data;

      // 2. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key here
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "Smooth Website",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          // 3. Verify Payment
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentDbId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              onSuccess(response.razorpay_payment_id);
            } else {
              onError(verifyData.error || "Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            onError("Payment verification error");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        onError(response.error.description || "Payment failed");
      });
      paymentObject.open();
    } catch (err: any) {
      console.error("Checkout Error:", err);
      onError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-black text-white font-semibold py-4 rounded-xl shadow-lg hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
        ) : null}
        {loading ? "Processing..." : `Pay ₹${amount.toFixed(2)}`}
      </button>
    </>
  );
}
