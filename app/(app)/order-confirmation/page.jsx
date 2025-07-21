"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const OrderConfirmationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(null);
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    const order = searchParams.get("order");
    if (order) {
      setOrderNumber(order);
    } else {
      // Redirect to home if no order parameter
      router.push("/");
    }
  }, [searchParams, router]);

  // Countdown timer effect
  useEffect(() => {
    if (orderNumber && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Redirect to orders page when countdown reaches 0
      router.push("/orders");
    }
  }, [countdown, orderNumber, router]);

  if (!orderNumber) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-babas-neue">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>

          {/* Order Details */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-xl sm:text-2xl font-light text-gray-900 mb-4">
              Order Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium text-gray-900">{orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium text-gray-900">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-medium text-gray-900">
                  {new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl p-6 sm:p-8 mb-8">
            <h3 className="text-lg sm:text-xl font-medium text-blue-900 mb-4">
              What happens next?
            </h3>
            <div className="space-y-3 text-sm sm:text-base text-blue-800">
              <div className="flex items-start">
                <span className="font-medium mr-2">1.</span>
                <span>You'll receive an order confirmation email shortly</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium mr-2">2.</span>
                <span>
                  We'll send you tracking information once your order ships
                </span>
              </div>
              <div className="flex items-start">
                <span className="font-medium mr-2">3.</span>
                <span>
                  Your order will be delivered within 5-7 business days
                </span>
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="bg-yellow-50 rounded-xl p-4 sm:p-6 mb-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-yellow-900 mb-2">
                Automatic Redirect
              </h3>
              <p className="text-yellow-800 mb-4">
                You will be automatically redirected to your order history in:
              </p>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-200 rounded-full mb-4">
                <span className="text-2xl font-bold text-yellow-900">
                  {countdown}
                </span>
              </div>
              <p className="text-sm text-yellow-700">
                Click below to go there now, or wait for automatic redirect
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] font-medium"
            >
              View Order History
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Need Help?
            </h4>
            <p className="text-gray-600 mb-4">
              If you have any questions about your order, please don't hesitate
              to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a
                href="mailto:support@nomada.com"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Email: support@nomada.com
              </a>
              <a
                href="tel:+1-555-0123"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Phone: +1 (555) 0123
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
