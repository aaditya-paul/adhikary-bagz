"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({
  product,
  variant = "simple",
  showTrending = false,
  showReviews = false,
  showDescription = false,
  showBadges = false,
  showStock = false,
  showTags = false,
  index = null,
}) => {
  // Calculate discount if applicable
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  // Dynamic styling based on variant
  const getCardClasses = () => {
    switch (variant) {
      case "detailed":
        return "bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group";
      case "simple":
      default:
        return "rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group";
    }
  };

  const getImageClasses = () => {
    switch (variant) {
      case "detailed":
        return "object-cover group-hover:scale-105 transition-transform duration-300";
      case "simple":
      default:
        return "object-contain group-hover:scale-105 transition-transform duration-300";
    }
  };

  const getPaddingClasses = () => {
    switch (variant) {
      case "detailed":
        return "p-6";
      case "simple":
      default:
        return "p-3";
    }
  };

  return (
    <div className={getCardClasses()}>
      <Link href={`/product/${product.slug || product.id}`}>
        <div className="aspect-square relative overflow-hidden">
          {/* Background blur effect (for simple variant) */}
          {variant === "simple" && (
            <Image
              src={product.images?.[0] || "/assests/bags/bag_black.png"}
              alt={product.name || "Product"}
              width={600}
              height={600}
              className="object-center relative -top-1/2 -left-1/2 opacity-20 blur-3xl hover:scale-105 transition-transform duration-300 min-w-[600px]"
            />
          )}

          {/* Background blur effect (for detailed variant) */}
          {variant === "detailed" && (
            <Image
              src={product.images?.[0] || "/assests/bags/bag_black.png"}
              alt={product.name || "Product"}
              fill
              className="transition-transform duration-300 w-full h-full scale-200 opacity-30 blur-3xl"
            />
          )}

          {/* Main product image */}
          <Image
            src={product.images?.[0] || "/assests/bags/bag_black.png"}
            alt={product.name || "Product"}
            fill
            className={getImageClasses()}
          />

          {/* Trending Badge (for popular products) */}
          {showTrending && product.trending && (
            <div className="absolute top-2 right-2 bg-red-500 text-white h-9 w-9 rounded-full text-lg z-10 flex items-center justify-center shadow-md">
              <span>{product.trending}</span>
            </div>
          )}

          {/* Badges (for detailed variant) */}
          {showBadges && (
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
          )}
        </div>

        <div className={getPaddingClasses()}>
          {/* Product Name */}
          <h3
            className={`mb-1 ${
              variant === "detailed"
                ? "text-lg font-light text-gray-900 mb-2 group-hover:text-gray-700 transition-colors line-clamp-2"
                : "text-xl"
            }`}
          >
            {product.name}
          </h3>

          {/* Product Description (detailed variant only) */}
          {showDescription && product.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Price Section */}
          <div
            className={`${
              variant === "detailed"
                ? "flex items-center justify-between mb-3"
                : ""
            }`}
          >
            <div
              className={`${
                variant === "detailed" ? "flex items-center space-x-2" : ""
              }`}
            >
              <span
                className={`${
                  variant === "detailed"
                    ? "text-xl font-medium text-gray-900"
                    : "text-base text-gray-600"
                }`}
              >
                $
                {product.price?.toFixed
                  ? product.price.toFixed(2)
                  : product.price}
              </span>
              {hasDiscount && variant === "detailed" && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Rating (detailed variant or when showReviews is true) */}
            {(showReviews || variant === "detailed") && product.rating && (
              <div
                className={`flex items-center ${
                  variant === "simple" ? "mt-2" : ""
                }`}
              >
                <div
                  className={`flex ${
                    variant === "detailed"
                      ? "text-yellow-400 text-sm"
                      : "text-yellow-500"
                  }`}
                >
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.floor(product.rating)
                          ? variant === "detailed"
                            ? "text-yellow-400"
                            : "text-yellow-500"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span
                  className={`ml-1 text-sm text-gray-500 ${
                    variant === "simple" ? "ml-2" : ""
                  }`}
                >
                  ({product.reviewCount || 0})
                </span>
              </div>
            )}
          </div>

          {/* Stock Status (detailed variant only) */}
          {showStock && product.stockCount !== undefined && (
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

          {/* Tags (detailed variant only) */}
          {showTags && product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="px-2 py-1 text-gray-500 text-xs">
                  +{product.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
