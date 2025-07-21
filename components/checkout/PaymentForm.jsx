"use client";
import React from "react";

const PaymentForm = ({ data, setData, onPrev, onPlaceOrder, isProcessing }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      if (formattedValue.length <= 19) {
        // 16 digits + 3 spaces
        setData((prev) => ({ ...prev, [name]: formattedValue }));
      }
      return;
    }

    // Format expiry date
    if (name === "expiryDate") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2");
      if (formattedValue.length <= 5) {
        setData((prev) => ({ ...prev, [name]: formattedValue }));
      }
      return;
    }

    // Limit CVV to 4 digits
    if (name === "cvv") {
      const formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length <= 4) {
        setData((prev) => ({ ...prev, [name]: formattedValue }));
      }
      return;
    }

    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setData((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-light text-gray-900 mb-6">
        Payment Information
      </h2>

      <div className="space-y-4 sm:space-y-6">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number *
          </label>
          <input
            type="text"
            name="cardNumber"
            value={data.cardNumber}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>

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
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
            placeholder="Name as it appears on card"
            required
          />
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date *
            </label>
            <input
              type="text"
              name="expiryDate"
              value={data.expiryDate}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              placeholder="MM/YY"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV *
            </label>
            <input
              type="text"
              name="cvv"
              value={data.cvv}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              placeholder="123"
              required
            />
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
              Your payment information is encrypted and secure
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
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
        <button
          onClick={onPrev}
          disabled={isProcessing}
          className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back to Billing
        </button>
        <button
          onClick={onPlaceOrder}
          disabled={isProcessing}
          className="w-full sm:flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] font-medium text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Order...
            </div>
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
