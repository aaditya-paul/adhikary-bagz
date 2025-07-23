"use client";
import React, { useState, useEffect } from "react";
import { getTrendingProducts } from "@/data/products";
import ProductCard from "./ProductCard";

const PopularProducts = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getTrendingProducts();
        setPopularProducts(products);
      } catch (error) {
        console.error("Error fetching popular products:", error);
        setPopularProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="font-babas-neue px-4 py-8">
        <h1 className="text-4xl text-center mb-8">Popular Products</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="font-babas-neue px-4 py-8">
      <h1 className="text-4xl text-center mb-8">Popular Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6 max-w-6xl mx-auto">
        {popularProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            variant="simple"
            showTrending={true}
            showReviews={true}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default PopularProducts;
