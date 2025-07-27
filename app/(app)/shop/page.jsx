"use client";
import React, { useState, useEffect } from "react";
import { useNotification } from "@/hooks/useNotification";
import { NotificationModal } from "@/components/ui/notifications";
import { ProductFilters, ProductCard } from "@/components/product";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: "all",
    sortBy: "name",
    searchTerm: "",
  });
  const [categories, setCategories] = useState([]);
  const { notification, showNotification, hideNotification, showError } =
    useNotification();

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, "Products");
        const querySnapshot = await getDocs(productsRef);

        const productsList = [];
        const categoriesSet = new Set();

        querySnapshot.forEach((doc) => {
          const productData = { id: doc.id, ...doc.data() };
          productsList.push(productData);
          if (productData.category) {
            categoriesSet.add(productData.category);
          }
        });
        console.log("productsList", productsList);
        setProducts(productsList);
        setCategories(Array.from(categoriesSet));
        setFilteredProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
        showError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showError]);

  // Apply filters whenever filters change
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      filtered = filtered.filter((product) => {
        const price = product.price || 0;
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min;
        }
      });
    }

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });

    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      priceRange: "all",
      sortBy: "name",
      searchTerm: "",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-babas-neue">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <h1 className="text-xl font-light text-gray-900">
                Loading Products...
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-babas-neue">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4">
            Shop Collection
          </h1>
          <p className="text-gray-600 text-lg">
            Discover our curated selection of luxury handbags
          </p>
        </div>

        {/* Main Content - Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <ProductFilters
            filters={filters}
            categories={categories}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            resultCount={filteredProducts.length}
          />

          {/* Products Section */}
          <div className="flex-1 min-w-0">
            {/* Desktop Results Header */}
            <div className="hidden lg:flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-light text-gray-900">
                Products ({filteredProducts.length})
              </h2>
              <div className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 cursor-pointer bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="detailed"
                    showDescription={true}
                    showBadges={true}
                    showStock={true}
                    showTags={true}
                    showReviews={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        duration={notification.duration}
        onClose={hideNotification}
      />
    </div>
  );
};

export default ShopPage;
