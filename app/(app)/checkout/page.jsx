"use client";
import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { useNotification } from "@/hooks/useNotification";
import { NotificationModal } from "@/components/ui/notifications";
import {
  CheckoutHeader,
  BillingForm,
  ShippingForm,
  PaymentForm,
  OrderSummary,
  ProgressSteps,
} from "@/components/checkout";
import {
  addDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

//stripe
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// Constants
const INITIAL_SHIPPING_DATA = {
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
};

const INITIAL_BILLING_DATA = {
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  zipCode: "",
  country: "United States",
};

const INITIAL_PAYMENT_DATA = {
  cardName: "",
  saveCard: false,
  paymentMethod: null,
  stripePaymentMethod: null,
};

const SHIPPING_COST = 10.99;
const TAX_RATE = 0.0875; // 8.75%

const CheckoutPage = () => {
  const router = useRouter();
  const {
    isLoggedin,
    user,
    cartProducts,
    cartProductsDetails,
    isCartProductsDetailsLoading: isCartProductsLoading,
    setCartProducts,
    setCartProductsDetails,
    refreshOrders,
  } = useContext(UserContext);

  const {
    notification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
  } = useNotification();

  // Checkout state
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Form states
  const [shippingData, setShippingData] = useState(INITIAL_SHIPPING_DATA);
  const [billingData, setBillingData] = useState(INITIAL_BILLING_DATA);
  const [paymentData, setPaymentData] = useState(INITIAL_PAYMENT_DATA);
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  // Redirect if not logged in or cart is empty (but not during processing)
  useEffect(() => {
    if (!isLoggedin) {
      showWarning("Please sign in to continue with checkout");
      router.push("/signin");
      return;
    }

    // Only redirect for empty cart if we're not currently processing an order
    if (!isCartProductsLoading && cartProducts.length === 0 && !isProcessing) {
      showWarning("Your cart is empty");
      router.push("/cart");
      return;
    }
  }, [
    isLoggedin,
    cartProducts,
    isCartProductsLoading,
    isProcessing,
    router,
    showWarning,
  ]);

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

  // Calculate totals with memoization
  const totals = useMemo(() => {
    const subtotal = cartProductsDetails.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 200 ? 0 : SHIPPING_COST;
    const tax = subtotal * TAX_RATE;
    const discount = isPromoApplied ? subtotal * 0.1 : 0;
    const total = subtotal + shipping + tax - discount;

    return { subtotal, shipping, tax, discount, total };
  }, [cartProductsDetails, isPromoApplied]);

  // Promo code handler
  const applyPromoCode = useCallback(() => {
    if (promoCode.toLowerCase() === "nomada10") {
      setIsPromoApplied(true);
      showSuccess("Promo code applied! 10% discount added.");
    } else {
      showError("Invalid promo code. Please try again.");
    }
  }, [promoCode, showSuccess, showError]);

  // Validation helper
  const validateStep = useCallback(
    (step) => {
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
          // For Stripe Elements, we only need to check if cardholder name is filled
          // The card completion is handled by the PaymentForm component itself
          const requiredPayment = ["cardName"];
          return requiredPayment.every((field) => paymentData[field]?.trim());

        default:
          return false;
      }
    },
    [shippingData, billingData, paymentData, sameAsShipping]
  );

  // Navigation handlers
  const nextStep = useCallback(() => {
    if (!validateStep(currentStep)) {
      showError("Please fill in all required fields");
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, validateStep, showError]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Order placement handler with Stripe integration
  const handlePlaceOrder = useCallback(
    async (stripePaymentMethod = null) => {
      // Use the payment method passed from PaymentForm if available
      const finalPaymentData = stripePaymentMethod
        ? {
            ...paymentData,
            stripePaymentMethod,
            paymentMethod: stripePaymentMethod.id,
          }
        : paymentData;

      // Basic validation - the detailed payment validation is handled by PaymentForm
      if (!finalPaymentData.cardName?.trim()) {
        showError("Please enter cardholder name");
        return;
      }

      setIsProcessing(true);

      try {
        // Create payment intent with Stripe
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totals.total,
            currency: "usd",
            metadata: {
              userId: user.uid,
              cartItems: JSON.stringify(
                cartProductsDetails.map((item) => ({
                  id: item.id,
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                }))
              ),
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent");
        }

        const { clientSecret, paymentIntentId } = await response.json();

        // Generate order ID and timestamps
        const id = Date.now().toString();
        const timeStamp = serverTimestamp();
        const regularTimeStamp = Date.now(); // For use in arrayUnion

        // Set the order document with the generated id for easier reference
        await setDoc(doc(db, "Orders", id), {
          id,
          userId: user.uid,
          cartItems: cartProductsDetails,
          totalPrice: totals.total,
          subtotal: totals.subtotal,
          shipping: totals.shipping,
          tax: totals.tax,
          discount: totals.discount,
          status: "processing",
          createdAt: timeStamp,
          shippingData,
          billingData,
          paymentData: {
            paymentMethod: finalPaymentData.paymentMethod || "stripe",
            paymentIntentId,
            last4: stripePaymentMethod?.card?.last4 || null,
            cardBrand: stripePaymentMethod?.card?.brand || null,
          },
        });

        // Update user document - add order to user's orders array
        await updateDoc(doc(db, "users", user.uid), {
          orders: arrayUnion({
            id,
            createdAt: regularTimeStamp, // Use regular timestamp here
            orderNumber: id,
            status: "processing",
            totalPrice: totals.total,
          }),
          cart: [],
          cardDetails: finalPaymentData.saveCard
            ? {
                cardName: finalPaymentData.cardName,
                // Don't save actual card details, Stripe handles this
                last4: stripePaymentMethod?.card?.last4 || null,
                brand: stripePaymentMethod?.card?.brand || null,
              }
            : null,
        }); // Show success message
        showSuccess("Order placed successfully!");

        // Refresh orders data for the orders page
        if (refreshOrders) {
          refreshOrders();
        }

        // Set navigation state and redirect
        setIsNavigating(true);
        router.push(`/order-confirmation?order=${id}`);

        // Clear cart after a small delay to allow navigation
        setTimeout(() => {
          setCartProducts([]);
          setCartProductsDetails([]);
        }, 100);
      } catch (error) {
        console.error("Order processing error:", error);
        showError("Failed to process order. Please try again.");
        setIsProcessing(false);
      }
      // Note: Don't set isProcessing to false here in success case to prevent UI flicker
    },
    [
      showError,
      user,
      cartProductsDetails,
      totals,
      shippingData,
      billingData,
      paymentData,
      showSuccess,
      refreshOrders,
      router,
      setCartProducts,
      setCartProductsDetails,
    ]
  );

  if (isCartProductsLoading || isNavigating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isNavigating ? "Processing order..." : "Loading checkout..."}
          </p>
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
              subtotal={totals.subtotal}
              shipping={totals.shipping}
              tax={totals.tax}
              discount={totals.discount}
              total={totals.total}
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
