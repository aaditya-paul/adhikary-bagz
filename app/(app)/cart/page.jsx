"use client";
import React, { useState, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useNotification } from "@/hooks/useNotification";
import NotificationModal from "@/components/NotificationModal";
import EmptyCart from "@/components/cart/EmptyCart";
import CartHeader from "@/components/cart/CartHeader";
import CartItemsList from "@/components/cart/CartItemsList";
import OrderSummary from "@/components/cart/OrderSummary";

const Cart = () => {
  const {
    isLoggedin,
    cartProducts,
    setCartProducts,
    isCartProductsLoading,
    setIsCartProductsLoading,
  } = useContext(UserContext);
  const {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
  } = useNotification();

  // Sample cart items - in a real app, this would come from context or API
  // const [cartItems, setCartItems] = useState([
  //   {
  //     id: 1,
  //     name: "Elegance Tote",
  //     price: 299.99,
  //     quantity: 1,
  //     image: "/api/placeholder/200/200",
  //     size: "Large",
  //     description: "Premium leather tote bag with gold hardware",
  //   },
  //   {
  //     id: 2,
  //     name: "Minimalist Crossbody",
  //     price: 189.99,
  //     quantity: 2,
  //     image: "/api/placeholder/200/200",
  //     size: "Medium",
  //     description: "Sleek crossbody bag for everyday elegance",
  //   },
  // ]);

  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartProducts(
      cartProducts.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    showSuccess("Quantity updated successfully");
  };

  const removeItem = (id) => {
    setCartProducts(cartProducts.filter((item) => item.id !== id));
    showSuccess("Item removed from cart");
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "nomada10") {
      setIsPromoApplied(true);
      showSuccess("Promo code applied! 10% discount added.");
    } else {
      showError("Invalid promo code. Please try again.");
    }
  };

  const subtotal = cartProducts.reduce(
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
    // Add checkout logic here
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <CartHeader cartItemsCount={cartProducts.length} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <CartItemsList
            cartProducts={cartProducts}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
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
