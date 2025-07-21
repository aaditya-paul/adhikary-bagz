"use client";
import React, {
  useState,
  useContext,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { useNotification } from "@/hooks/useNotification";
import NotificationModal from "@/components/NotificationModal";
import EmptyCart from "@/components/cart/EmptyCart";
import CartHeader from "@/components/cart/CartHeader";
import CartItemsList from "@/components/cart/CartItemsList";
import OrderSummary from "@/components/cart/OrderSummary";
import { updateCartQuantity, clearCart } from "@/lib/utils/storeData";

const Cart = () => {
  const router = useRouter();
  const {
    isLoggedin,
    user,
    cartProducts,
    setCartProducts,
    isCartProductsLoading,
    setIsCartProductsLoading,
    setCartProductsDetails,
    cartProductsDetails,
  } = useContext(UserContext);
  const {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
  } = useNotification();

  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [isClearingCart, setIsClearingCart] = useState(false);

  // Debounce timer ref to prevent database choking
  const updateTimerRef = useRef(null);
  const pendingUpdatesRef = useRef(new Map());

  // Debounced function to update cart quantities in database
  const debouncedUpdateDatabase = useCallback(async () => {
    if (!isLoggedin || !user || pendingUpdatesRef.current.size === 0) {
      return;
    }

    setIsUpdatingQuantity(true);

    try {
      // Get all pending updates
      const updates = Array.from(pendingUpdatesRef.current.entries());

      // Clear pending updates
      pendingUpdatesRef.current.clear();

      // Batch update all quantities
      for (const [productId, quantity] of updates) {
        const userId = user?.uid || user?.id;
        if (!userId) {
          console.error("No valid user ID found in user object:", user);
          showError("User authentication error. Please sign in again.");
          continue;
        }

        const result = await updateCartQuantity(userId, productId, quantity);
        if (!result.success) {
          console.error(`Failed to update product ${productId}:`, result.error);
          showError(`Failed to update cart: ${result.error}`);
        }
      }

      console.log(
        `Successfully updated ${updates.length} cart items in database`
      );
      showSuccess("Cart synchronized");
    } catch (error) {
      console.error("Error updating cart quantities in database:", error);
      showError("Failed to sync cart changes. Please try again.");
    } finally {
      setIsUpdatingQuantity(false);
    }
  }, [isLoggedin, user, showError, showSuccess]);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
        // Trigger final update if there are pending changes
        if (pendingUpdatesRef.current.size > 0) {
          debouncedUpdateDatabase();
        }
      }
    };
  }, [debouncedUpdateDatabase]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    // Update UI immediately for better user experience
    setCartProducts(
      cartProducts.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    showSuccess("Quantity updated successfully");

    // Add to pending updates for database sync
    if (isLoggedin && user) {
      pendingUpdatesRef.current.set(id, newQuantity);

      // Clear existing timer
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }

      // Set new timer - wait 1 second after last update before syncing to database
      updateTimerRef.current = setTimeout(() => {
        debouncedUpdateDatabase();
      }, 1000);
    }
  };

  const removeItem = (id) => {
    setCartProducts(cartProducts.filter((item) => item.id !== id));
    setCartProductsDetails(
      cartProductsDetails.filter((item) => item.id !== id)
    );

    showSuccess("Item removed from cart");
  };

  // Handle clearing the entire cart
  const handleClearCart = async () => {
    if (!user?.uid) {
      showError("Please sign in to clear your cart.");
      return;
    }

    // Show confirmation dialog
    const isConfirmed = confirm(
      "Are you sure you want to clear your entire cart? This action cannot be undone."
    );

    if (!isConfirmed) {
      return;
    }

    setIsClearingCart(true);

    try {
      const result = await clearCart(user);

      // Update the local cart state
      setCartProducts([]);

      if (!result.success) {
        showError(`Failed to clear cart: ${result.error}`);
      } else {
        showSuccess("Cart cleared successfully!");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      showError("Failed to clear cart. Please try again.");
    } finally {
      setIsClearingCart(false);
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "nomada10") {
      setIsPromoApplied(true);
      showSuccess("Promo code applied! 10% discount added.");
    } else {
      showError("Invalid promo code. Please try again.");
    }
  };

  const subtotal = cartProductsDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 200 ? 0 : 15.99;
  const discount = isPromoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const handleCheckout = () => {
    if (!isLoggedin) {
      showWarning("Please sign in to proceed with checkout");
      return;
    }
    showSuccess("Redirecting to checkout...");
    setTimeout(() => {
      router.push("/checkout");
    }, 1000);
  };

  if (isCartProductsLoading) {
    //TODO later a sekeleton will be added
    return <div className="text-center text-gray-600">Loading cart...</div>;
  }

  if (cartProducts.length === 0) {
    return (
      <EmptyCart
        notification={notification}
        hideNotification={hideNotification}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-babas-neue">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <CartHeader
          cartItemsCount={cartProductsDetails.length}
          onClearCart={handleClearCart}
          isClearingCart={isClearingCart}
        />

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <CartItemsList
            CartProductsDetails={cartProductsDetails}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            isUpdatingQuantity={isUpdatingQuantity}
          />

          {/* Order Summary */}
          <OrderSummary
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            isPromoApplied={isPromoApplied}
            applyPromoCode={applyPromoCode}
            subtotal={subtotal}
            shipping={shipping}
            discount={discount}
            total={total}
            handleCheckout={handleCheckout}
          />
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

export default Cart;
