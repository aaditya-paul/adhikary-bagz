"use client";
import React from "react";
import Image from "next/image";

const CartItem = ({ item, updateQuantity, removeItem }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0 p-6">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={item.images[0]}
              alt={item.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h3 className="text-xl font-light text-gray-900 mb-1">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {/* <span>Color: {item.color}</span> */}
            <span>Size: {item.selectedSize}</span>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            -
          </button>
          <span className="w-12 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>

        {/* Price */}
        <div className="text-right">
          <p className="text-xl font-light text-gray-900">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeItem(item.id)}
          className="ml-4 text-red-500 hover:text-red-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
