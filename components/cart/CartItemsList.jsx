"use client";
import React from "react";
import Link from "next/link";
import CartItem from "./CartItem";

const CartItemsList = ({ CartProductsDetails, updateQuantity, removeItem }) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {CartProductsDetails.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
          />
        ))}
      </div>

      {/* Continue Shopping */}
      <div className="mt-6">
        <Link
          href="/products"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
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
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CartItemsList;
