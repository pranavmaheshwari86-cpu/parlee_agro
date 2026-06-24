"use client";

import React, { ReactNode } from "react";
import RazorpayCheckout from "./RazorpayCheckout";

type PaymentMethod = "RAZORPAY" | "STRIPE" | "PAYPAL";

export interface PaymentProviderProps {
  method?: PaymentMethod;
  amount: number;
  orderId: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
  autoStart?: boolean;
}

export default function PaymentProvider({
  method = "RAZORPAY",
  amount,
  orderId,
  onSuccess,
  onError,
  autoStart = false,
}: PaymentProviderProps) {
  // We can easily swap out payment providers here in the future
  switch (method) {
    case "RAZORPAY":
      return (
        <RazorpayCheckout
          amount={amount}
          orderId={orderId}
          onSuccess={onSuccess}
          onError={onError}
          autoStart={autoStart}
        />
      );
    case "STRIPE":
      return <div className="p-4 bg-gray-100 rounded text-center">Stripe Integration Coming Soon</div>;
    case "PAYPAL":
      return <div className="p-4 bg-gray-100 rounded text-center">PayPal Integration Coming Soon</div>;
    default:
      return <div className="p-4 bg-red-100 text-red-600 rounded text-center">Invalid Payment Method</div>;
  }
}
