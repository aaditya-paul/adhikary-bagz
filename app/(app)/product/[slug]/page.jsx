"use client";
import React, { useState, use, useContext, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getProductBySlug,
  getProductById,
  getRelatedProducts,
} from "@/data/products";
import { notFound } from "next/navigation";
import { addToCart } from "@/lib/utils/storeData";
import { UserContext } from "@/context/UserContext";
import { useNotification } from "@/hooks/useNotification";
import NotificationModal from "@/components/NotificationModal";

const ProductPage = ({ params }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("One Size");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [product, setProduct] = useState(null);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isRelatedProductsLoading, setIsRelatedProductsLoading] =
    useState(false);

  const { user, isLoggedin, cartProducts, setCartProducts } =
    useContext(UserContext);
  const {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
  } = useNotification();

  const resolvedParams = use(params);
  //changing here

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // First try to get product by slug
        let result = await getProductBySlug(resolvedParams.slug);

        if (!result.success) {
          showError(result.error || "Product not found");
        } else {
          setProduct(result.item);
        }
      } catch (error) {
        showError("Error loading product");
        console.error("Product fetch error:", error);
      } finally {
        setIsProductLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.slug, showError]);

  // Fetch related products when product changes
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product) {
        setIsRelatedProductsLoading(true);
        try {
          const related = await getRelatedProducts(
            product.id,
            product.category
          );
          setRelatedProducts(related || []);
        } catch (error) {
          console.error("Related products fetch error:", error);
          setRelatedProducts([]);
        } finally {
          setIsRelatedProductsLoading(false);
        }
      }
    };

    fetchRelatedProducts();
  }, [product]);

  const sizes = ["One Size"]; // You can expand this based on product type

  const handleAddToCart = async () => {
    if (!isLoggedin || !user) {
      showWarning("Please sign in to add items to cart");
      return;
    }

    setIsAddingToCart(true);

    try {
      const result = await addToCart(
        product.id,
        product.slug,
        quantity,
        selectedSize,
        user
      );

      if (result.success) {
        showSuccess(result.message);
        if (result.updationType === "newProduct") {
          setCartProducts((prev) => [...prev, result.cartItem]);
        } else {
          setCartProducts(result.cartItem);
        }
      } else {
        showError(result.error || "Failed to add item to cart");
      }
    } catch (error) {
      showError("An error occurred while adding to cart");
      console.error("Cart error:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    // Buy now functionality
    console.log(`Buy now: ${quantity} ${product.name}`);
  };

  if (isProductLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-3xl font-light text-gray-900">Loading...</h1>
      </div>
    );
  }

  // if (!product) {
  //   notFound();
  // }

  return (
    <div className="font-babas-neue min-h-screen bg-white">
      {/* Breadcrumb */}
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
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
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

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-light text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Size
              </label>
              <div className="flex space-x-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-200 rounded-md flex items-center justify-center hover:border-gray-400"
                >
                  -
                </button>
                <span className="w-16 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-200 rounded-md flex items-center justify-center hover:border-gray-400"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.inStock ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-gray-600">
                {product.inStock
                  ? `In Stock (${product.stockCount} available)`
                  : "Out of Stock"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400"
              >
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full border border-gray-900 text-gray-900 py-3 px-6 rounded-md hover:bg-gray-900 hover:text-white transition-colors duration-300 disabled:border-gray-400 disabled:text-gray-400"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
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

        {/* Related Products */}
        {(relatedProducts.length > 0 || isRelatedProductsLoading) && (
          <div className="mt-16">
            <h3 className="text-3xl font-light text-gray-900 mb-8 text-center">
              You May Also Like
            </h3>
            {isRelatedProductsLoading ? (
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
        )}
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

export default ProductPage;
