"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

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
            <Link
              key={relatedProduct.id}
              href={`/product/${relatedProduct.id}`}
            >
              <div className="group cursor-pointer">
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">
                  {relatedProduct.name}
                </h4>
                <p className="text-gray-600">${relatedProduct.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
