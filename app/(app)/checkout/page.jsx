"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { useNotification } from "@/hooks/useNotification";
import NotificationModal from "@/components/NotificationModal";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import BillingForm from "@/components/checkout/BillingForm";
import ShippingForm from "@/components/checkout/ShippingForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import ProgressSteps from "@/components/checkout/ProgressSteps";

const CheckoutPage = () => {
  const router = useRouter();
  const {
    isLoggedin,
    user,
    cartProducts,
    cartProductsDetails,
    isCartProductsLoading,
    setCartProducts,
    setCartProductsDetails,
  } = useContext(UserContext);

  const {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
  } = useNotification();

  // Checkout state
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Form states
  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    saveCard: false,
  });

  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!isLoggedin) {
      showWarning("Please sign in to continue with checkout");
      router.push("/signin");
      return;
    }

    if (!isCartProductsLoading && cartProducts.length === 0) {
      showWarning("Your cart is empty");
      router.push("/cart");
      return;
    }
  }, [isLoggedin, cartProducts, isCartProductsLoading, router, showWarning]);

  // Initialize user data
  useEffect(() => {
    if (user) {
      setShippingData((prev) => ({
        ...prev,
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ")[1] || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
      }));
    }
  }, [user]);

  // Calculate totals
  const subtotal = cartProductsDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 200 ? 0 : 15.99;
  const tax = subtotal * 0.08; // 8% tax
  const discount = isPromoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping + tax - discount;

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "nomada10") {
      setIsPromoApplied(true);
      showSuccess("Promo code applied! 10% discount added.");
    } else {
      showError("Invalid promo code. Please try again.");
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1: // Shipping
        const requiredShipping = [
          "firstName",
          "lastName",
          "email",
          "address",
          "city",
          "state",
          "zipCode",
        ];
        return requiredShipping.every((field) => shippingData[field]?.trim());

      case 2: // Billing
        if (sameAsShipping) return true;
        const requiredBilling = [
          "firstName",
          "lastName",
          "address",
          "city",
          "state",
          "zipCode",
        ];
        return requiredBilling.every((field) => billingData[field]?.trim());

      case 3: // Payment
        const requiredPayment = ["cardNumber", "expiryDate", "cvv", "cardName"];
        return requiredPayment.every((field) => paymentData[field]?.trim());

      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      showError("Please fill in all required fields");
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(3)) {
      showError("Please complete all payment information");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Clear cart after successful order
      setCartProducts([]);
      setCartProductsDetails([]);

      showSuccess("Order placed successfully!");

      // Redirect to order confirmation
      setTimeout(() => {
        router.push("/order-confirmation?order=ORDER-" + Date.now());
      }, 2000);
    } catch (error) {
      console.error("Order processing error:", error);
      showError("Failed to process order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isCartProductsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 font-babas-neue">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <CheckoutHeader />

        {/* Progress Steps */}
        <ProgressSteps currentStep={currentStep} />

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8 mt-8">
          {/* Forms Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <ShippingForm
                data={shippingData}
                setData={setShippingData}
                onNext={nextStep}
              />
            )}

            {/* Step 2: Billing Information */}
            {currentStep === 2 && (
              <BillingForm
                data={billingData}
                setData={setBillingData}
                sameAsShipping={sameAsShipping}
                setSameAsShipping={setSameAsShipping}
                shippingData={shippingData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}

            {/* Step 3: Payment Information */}
            {currentStep === 3 && (
              <PaymentForm
                data={paymentData}
                setData={setPaymentData}
                onPrev={prevStep}
                onPlaceOrder={handlePlaceOrder}
                isProcessing={isProcessing}
              />
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={cartProductsDetails}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              discount={discount}
              total={total}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              isPromoApplied={isPromoApplied}
              applyPromoCode={applyPromoCode}
            />
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

export default CheckoutPage;
