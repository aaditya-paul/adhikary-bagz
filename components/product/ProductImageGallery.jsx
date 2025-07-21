"use client";
import React from "react";
import Image from "next/image";

const ProductImageGallery = ({ 
  product, 
  selectedImageIndex, 
  setSelectedImageIndex 
}) => {
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden relative">
        <Image
          src={product.images[selectedImageIndex]}
          alt={product.name}
          width={600}
          height={600}
          className="w-full h-full object-cover"
        />
        {product.trending && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {product.trending}
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      <div className="flex space-x-2">
        {product.images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
              selectedImageIndex === index
                ? "border-gray-900"
                : "border-gray-200"
            }`}
          >
            <Image
              src={image}
              alt={`${product.name} ${index + 1}`}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
