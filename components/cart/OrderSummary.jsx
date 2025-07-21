"use client";
import React from "react";
import PromoCodeSection from "./PromoCodeSection";
import PriceBreakdown from "./PriceBreakdown";

const OrderSummary = ({
  promoCode,
  setPromoCode,
  isPromoApplied,
  applyPromoCode,
  subtotal,
  shipping,
  discount,
  total,
  handleCheckout,
}) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-8">
        <h2 className="text-xl sm:text-2xl font-light text-gray-900 mb-4 sm:mb-6">
          Order Summary
        </h2>

        {/* Promo Code */}
        <PromoCodeSection
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          isPromoApplied={isPromoApplied}
          applyPromoCode={applyPromoCode}
        />

        {/* Price Breakdown */}
        <PriceBreakdown
          subtotal={subtotal}
          shipping={shipping}
          discount={discount}
          total={total}
        />

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] font-medium text-base sm:text-lg"
        >
          Proceed to Checkout
        </button>

        {/* Security Icons */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
          <div className="flex items-center justify-center space-x-4 text-gray-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            <span className="text-sm">Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
