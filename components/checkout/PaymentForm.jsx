"use client";
import { UserContext } from "@/context/UserContext";
import React, { useContext, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Check if Stripe publishable key is configured
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.error(
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured. Please add it to your .env.local file."
  );
}

const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

// Stripe Element styling - trying to match site font
const elementOptions = {
  style: {
    base: {
      fontSize: "16px",
      fontFamily: "'Bebas Neue', system-ui, -apple-system, sans-serif",
      fontWeight: "400",
      color: "#374151",
      lineHeight: "1.4",
      letterSpacing: "0.5px",
      textTransform: "uppercase",
      "::placeholder": {
        color: "#6B7280",
        fontWeight: "300",
        textTransform: "none",
      },
      ":focus": {
        color: "#111827",
      },
    },
    invalid: {
      color: "#EF4444",
      iconColor: "#EF4444",
      ":focus": {
        color: "#EF4444",
      },
    },
    complete: {
      color: "#10B981",
      iconColor: "#10B981",
    },
  },
};

const PaymentFormContent = ({
  data,
  setData,
  onPrev,
  onPlaceOrder,
  isProcessing,
}) => {
  const { user } = useContext(UserContext);
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });

  // Calculate if all card fields are complete
  const isCardComplete = Object.values(cardComplete).every(Boolean);

  useEffect(() => {
    if (user?.cardDetails) {
      setData((prev) => ({
        ...prev,
        cardName: user.cardDetails.cardName || "",
        saveCard: false, // Don't auto-check, let user decide
      }));
    }
  }, [user?.cardDetails, setData]);

  // Reset submitting state if processing fails
  useEffect(() => {
    if (!isProcessing && isSubmitting) {
      const timer = setTimeout(() => {
        setIsSubmitting(false);
      }, 1000); // Small delay to prevent flickering

      return () => clearTimeout(timer);
    }
  }, [isProcessing, isSubmitting]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleCardChange = (elementType) => (event) => {
    setCardComplete((prev) => ({
      ...prev,
      [elementType]: event.complete,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Immediately disable the button to prevent double submission
    if (isSubmitting || isProcessing) {
      return;
    }

    setIsSubmitting(true);

    if (!stripe || !elements) {
      setIsSubmitting(false);
      return;
    }

    try {
      const cardNumberElement = elements.getElement(CardNumberElement);

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
        billing_details: {
          name: data.cardName,
        },
      });

      if (error) {
        console.error("Error creating payment method:", error);
        setIsSubmitting(false);
        return;
      }

      // Add payment method to data and proceed with order
      setData((prev) => ({
        ...prev,
        paymentMethod: paymentMethod.id,
        stripePaymentMethod: paymentMethod,
      }));

      // Call the parent's place order function
      await onPlaceOrder(paymentMethod);
    } catch (error) {
      console.error("Payment submission error:", error);
      setIsSubmitting(false);
    }
    // Note: Don't set isSubmitting to false here in success case
    // as the parent component will handle the loading state
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
      {/* Custom CSS for Stripe Elements */}
      <style jsx>{`
        .StripeElement {
          height: 20px;
          padding: 0;
        }
        .StripeElement--focus {
          box-shadow: none;
        }
        .StripeElement--webkit-autofill {
          background: white !important;
        }
      `}</style>

      <h2 className="text-xl sm:text-2xl font-light text-gray-900 mb-6">
        Payment Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name *
          </label>
          <input
            type="text"
            name="cardName"
            value={data.cardName}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 text-sm sm:text-base font-babas-neue bg-white"
            placeholder="Name as it appears on card"
            style={{
              fontFamily: "'Bebas Neue', system-ui, sans-serif",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
            required
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number *
          </label>
          <div className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent transition-all duration-300 bg-white">
            <CardNumberElement
              options={elementOptions}
              onChange={handleCardChange("cardNumber")}
            />
          </div>
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date *
            </label>
            <div className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent transition-all duration-300 bg-white">
              <CardExpiryElement
                options={elementOptions}
                onChange={handleCardChange("cardExpiry")}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVC *
            </label>
            <div className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent transition-all duration-300 bg-white">
              <CardCvcElement
                options={elementOptions}
                onChange={handleCardChange("cardCvc")}
              />
            </div>
          </div>
        </div>

        {/* Save Card Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="saveCard"
            checked={data.saveCard}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm sm:text-base text-gray-700">
            Save this card for future purchases
          </label>
        </div>

        {/* Security Notice */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="text-sm text-gray-600">
              Your payment information is encrypted and secure with Stripe
            </p>
          </div>
        </div>

        {/* Accepted Cards */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            Accepted Cards
          </p>
          <div className="flex space-x-2">
            {/* Visa */}
            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">VISA</span>
            </div>
            {/* Mastercard */}
            <div className="w-12 h-8 bg-red-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">MC</span>
            </div>
            {/* American Express */}
            <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">AMEX</span>
            </div>
            {/* Discover */}
            <div className="w-12 h-8 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">DISC</span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
          <button
            type="button"
            onClick={onPrev}
            disabled={isProcessing || isSubmitting}
            className={`${
              isProcessing || isSubmitting
                ? "cursor-not-allowed"
                : "cursor-pointer"
            } w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Back to Billing
          </button>
          <button
            type="submit"
            disabled={
              isProcessing ||
              isSubmitting ||
              !stripe ||
              !isCardComplete ||
              !data.cardName
            }
            className={`${
              isProcessing || isSubmitting
                ? "cursor-not-allowed"
                : "cursor-pointer"
            } w-full sm:flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] font-medium text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {isProcessing || isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isSubmitting
                  ? "Validating Payment..."
                  : "Processing Payment..."}
              </div>
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Main PaymentForm component wrapped with Stripe Elements
const PaymentForm = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  );
};

export default PaymentForm;
