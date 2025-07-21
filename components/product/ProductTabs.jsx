"use client";
import React from "react";

const ProductTabs = ({ product }) => {
  return (
    <div className="mt-16">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button className="py-2 px-1 border-b-2 border-gray-900 text-gray-900 font-medium">
            Description
          </button>
          <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
            Specifications
          </button>
          <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
            Reviews
          </button>
        </nav>
      </div>

      <div className="py-8">
        <div className="max-w-3xl">
          <h3 className="text-2xl font-light text-gray-900 mb-4">
            Product Description
          </h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            {product.longDescription}
          </p>

          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Features
          </h4>
          <ul className="space-y-2">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;
