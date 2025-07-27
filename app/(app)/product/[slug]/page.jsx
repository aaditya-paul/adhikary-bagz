"use client";
import React, { useState, use, useContext, useEffect } from "react";
import {
  getProductBySlug,
  getProductById,
  getRelatedProducts,
} from "@/data/products";
import { notFound } from "next/navigation";
import { addToCart } from "@/lib/utils/storeData";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/useNotification";
import { NotificationModal } from "@/components/ui/notifications";
import {
  ProductBreadcrumb,
  ProductImageGallery,
  ProductInfo,
  ProductActions,
  ProductTabs,
  RelatedProducts,
} from "@/components/product";

const ProductPage = ({ params }) => {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("One Size");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [product, setProduct] = useState(null);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isRelatedProductsLoading, setIsRelatedProductsLoading] =
    useState(false);

  const { user, isLoggedin, cartProducts, setCartProducts, refreshCart } =
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
      // showWarning("Please sign in to add items to cart");
      router.push("/signin");
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
        // Refresh cart data from Firestore to ensure UI is in sync
        // await refreshCart();
        if (result.updationType === "quantity") {
          setCartProducts(result.cart);
          showSuccess("Product quantity updated in cart");
        } else {
          setCartProducts((prev) => [...prev, result.cartItem]);
          // Optionally refresh cart products details if needed
          showSuccess("Product added to cart");
        }
        showSuccess(result.message);
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
      <ProductBreadcrumb product={product} />

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <ProductImageGallery
            product={product}
            selectedImageIndex={selectedImageIndex}
            setSelectedImageIndex={setSelectedImageIndex}
          />

          {/* Product Info */}
          <div className="space-y-6">
            <ProductInfo product={product} />

            <ProductActions
              product={product}
              sizes={sizes}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              quantity={quantity}
              setQuantity={setQuantity}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              isAddingToCart={isAddingToCart}
            />
          </div>
        </div>

        {/* Product Details Tabs */}
        <ProductTabs product={product} />

        {/* Related Products */}
        <RelatedProducts
          relatedProducts={relatedProducts}
          isRelatedProductsLoading={isRelatedProductsLoading}
        />
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
