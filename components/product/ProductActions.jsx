"use client";
import React from "react";

const ProductActions = ({
  product,
  sizes,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  handleAddToCart,
  handleBuyNow,
  isAddingToCart
}) => {
  return (
    <div className="space-y-6">
      {/* Size Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Size
        </label>
        <div className="flex space-x-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 border rounded-md ${
                selectedSize === size
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Quantity
        </label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 border border-gray-200 rounded-md flex items-center justify-center hover:border-gray-400"
          >
            -
          </button>
          <span className="w-16 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 border border-gray-200 rounded-md flex items-center justify-center hover:border-gray-400"
          >
            +
          </button>
        </div>
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <div
          className={`w-3 h-3 rounded-full ${
            product.inStock ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span className="text-sm text-gray-600">
          {product.inStock
            ? `In Stock (${product.stockCount} available)`
            : "Out of Stock"}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAddingToCart}
          className="w-full bg-gray-900 text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400"
        >
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!product.inStock}
          className="w-full border border-gray-900 text-gray-900 py-3 px-6 rounded-md hover:bg-gray-900 hover:text-white transition-colors duration-300 disabled:border-gray-400 disabled:text-gray-400"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductActions;
