"use client";
import React, { useState, useEffect } from "react";

const ProductFilters = ({
  filters,
  categories,
  onFilterChange,
  onClearFilters,
  resultCount,
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleToggleFilters = () => {
    if (isFiltersOpen) {
      // Start slide up animation
      setIsClosing(true);
      setIsAnimating(true);
      // Hide after animation completes
      setTimeout(() => {
        setIsFiltersOpen(false);
        setIsAnimating(false);
        setIsClosing(false);
      }, 400); // Match slideUp animation duration
    } else {
      // Show and start slide down animation immediately
      setIsClosing(false);
      setIsFiltersOpen(true);
      setIsAnimating(true);
      // Reset animating state after animation
      setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Match slideDown animation duration
    }
  };

  return (
    <>
      {/* Mobile Filter Toggle Button - Sticky */}
      <div className="lg:hidden sticky top-16 z-50 bg-white border-b border-gray-200 p-4 mb-6">
        <button
          onClick={handleToggleFilters}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
              />
            </svg>
            Filters & Sort
          </span>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">
              {resultCount} products
            </span>
            <svg
              className={`w-4 h-4 text-gray-600 transition-transform ${
                isFiltersOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>
      </div>

      {/* Filters Container */}
      <div
        className={`lg:block ${
          isFiltersOpen || isAnimating ? "block" : "hidden"
        } lg:w-80 lg:flex-shrink-0`}
      >
        <div
          className={`lg:sticky lg:top-24 bg-white rounded-xl shadow-sm border border-gray-200 
                        lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overflow-x-hidden custom-scrollbar
                        sticky top-[7.5rem] z-50 max-h-[calc(100vh-9rem)] overflow-y-auto overflow-x-hidden
                        ${isAnimating && !isClosing ? "animate-slide-down" : ""}
                        ${isAnimating && isClosing ? "animate-slide-up" : ""}`}
        >
          {/* Desktop Title - Fixed at top */}
          <div className="hidden lg:block sticky top-0 bg-white z-10 p-6 pb-4 border-b border-gray-200 rounded-t-xl">
            <h2 className="text-xl font-light text-gray-900">
              Filter Products
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {resultCount} product{resultCount !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 lg:pt-0">
            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 my-3">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) => onFilterChange("searchTerm", e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Category
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={filters.category === "all"}
                    onChange={(e) => onFilterChange("category", e.target.value)}
                    className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    All Categories
                  </span>
                </label>
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={filters.category === category}
                      onChange={(e) =>
                        onFilterChange("category", e.target.value)
                      }
                      className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                    />
                    <span className="ml-3 text-sm text-gray-700 capitalize">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Price Range
              </label>
              <div className="space-y-2">
                {[
                  { value: "all", label: "All Prices" },
                  { value: "0-100", label: "$0 - $100" },
                  { value: "100-200", label: "$100 - $200" },
                  { value: "200-300", label: "$200 - $300" },
                  { value: "300-500", label: "$300 - $500" },
                  { value: "500", label: "$500+" },
                ].map((range) => (
                  <label key={range.value} className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.value}
                      checked={filters.priceRange === range.value}
                      onChange={(e) =>
                        onFilterChange("priceRange", e.target.value)
                      }
                      className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange("sortBy", e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none bg-white"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Active Filters */}
            {(filters.category !== "all" ||
              filters.priceRange !== "all" ||
              filters.searchTerm) && (
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Active Filters
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filters.category !== "all" && (
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {filters.category}
                      <button
                        onClick={() => onFilterChange("category", "all")}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.priceRange !== "all" && (
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      ${filters.priceRange.replace("-", " - ")}
                      <button
                        onClick={() => onFilterChange("priceRange", "all")}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.searchTerm && (
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      "{filters.searchTerm}"
                      <button
                        onClick={() => onFilterChange("searchTerm", "")}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Clear All Filters */}
            {(filters.category !== "all" ||
              filters.priceRange !== "all" ||
              filters.searchTerm) && (
              <button
                onClick={onClearFilters}
                className="w-full px-4 py-3 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFilters;
