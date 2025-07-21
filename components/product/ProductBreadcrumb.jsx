"use client";
import React from "react";
import Link from "next/link";

const ProductBreadcrumb = ({ product }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <nav className="text-sm text-gray-600">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-gray-900">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product?.name}</span>
      </nav>
    </div>
  );
};

export default ProductBreadcrumb;
