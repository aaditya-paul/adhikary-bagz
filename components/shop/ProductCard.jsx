"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const ProductCard = ({ product }) => {
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <Link href={`/product/${product.slug || product.id}`}>
        <div className="aspect-square relative overflow-hidden">
            <Image
                src={product.images?.[0] || "/assests/bags/bag_black.png"}
                alt={product.name || "Product"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          <Image
            src={product.images?.[0]}
            alt={product.name || "Product"}
            fill
            className="transition-transform duration-300 w-full h-full scale-200 opacity-30 blur-3xl"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {hasDiscount && (
              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                -{discountPercentage}%
              </div>
            )}
            {!product.inStock && (
              <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Out of Stock
              </div>
            )}
            {product.featured && (
              <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Featured
              </div>
            )}
          </div>

          {/* Quick View Overlay */}
          {/* <div className="absolute inset-0 bg-transparent    bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              <span className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium">
                View Details
              </span>
            </div>
          </div> */}
        </div>

        <div className="p-6">
          {/* Product Name */}
          <h3 className="text-lg font-light text-gray-900 mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price and Rating Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-medium text-gray-900">
                ${product.price?.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {product.rating && (
              <div className="flex items-center">
                <div className="flex text-yellow-400 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-500">
                  ({product.reviewCount || 0})
                </span>
              </div>
            )}
          </div>

          {/* Stock Status */}
          {product.stockCount !== undefined && (
            <div className="mb-3">
              {product.stockCount > 0 ? (
                <span className="text-xs text-green-600">
                  {product.stockCount} in stock
                </span>
              ) : (
                <span className="text-xs text-red-600">Out of stock</span>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {product.tags?.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors"
              >
                {tag}
              </span>
            ))}
            {product.tags?.length > 3 && (
              <span className="px-2 py-1 text-gray-500 text-xs">
                +{product.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
