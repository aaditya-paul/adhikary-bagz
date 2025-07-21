"use client";
import React from "react";
import Link from "next/link";

const CheckoutHeader = () => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900">
          Secure Checkout
        </h1>
        <Link
          href="/cart"
          className="self-start sm:self-auto inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Return to Cart
        </Link>
      </div>
      <p className="text-gray-600 text-sm sm:text-base">
        Complete your order securely
      </p>
    </div>
  );
};

export default CheckoutHeader;
