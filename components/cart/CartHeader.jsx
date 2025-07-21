"use client";
import React from "react";

const CartHeader = ({ cartItemsCount, onClearCart, isClearingCart }) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900">
          Shopping Cart
        </h1>
        {cartItemsCount > 0 && (
          <button
            onClick={onClearCart}
            disabled={isClearingCart}
            className="self-start sm:self-auto px-3 sm:px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isClearingCart ? "Clearing..." : "Clear Cart"}
          </button>
        )}
      </div>
      <p className="text-gray-600 text-sm sm:text-base">
        {cartItemsCount} item{cartItemsCount !== 1 ? "s" : ""} in your cart
      </p>
    </div>
  );
};

export default CartHeader;
