"use client";
import React from "react";
import ProductCard from "../product/ProductCard";

const RelatedProducts = ({ relatedProducts, isLoading }) => {
  if (!isLoading && relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h3 className="text-3xl font-light text-gray-900 mb-8 text-center">
        You May Also Like
      </h3>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard
              key={relatedProduct.id}
              product={relatedProduct}
              variant="simple"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
