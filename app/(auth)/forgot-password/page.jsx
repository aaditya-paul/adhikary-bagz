"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/utils/authentication";
import { useNotification } from "@/hooks/useNotification";
import { NotificationModal } from "@/components/ui/notifications";

// Constants
const INITIAL_FORM_DATA = {
  email: "",
};

const ERROR_MESSAGES = {
  "auth/user-not-found":
    "No account found with this email address. Please check your email or sign up.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/too-many-requests":
    "Too many password reset attempts. Please try again later.",
  "auth/network-request-failed":
    "Network error. Please check your connection and try again.",
  default: "Failed to send reset email. Please try again.",
};

const ForgotPasswordPage = () => {
  const { notification, hideNotification, showSuccess, showError } =
    useNotification();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Helper function to get error message
  const getErrorMessage = useCallback((error) => {
    return (
      ERROR_MESSAGES[error.code] || error.message || ERROR_MESSAGES.default
    );
  }, []);

  // Handle input change
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.email]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        showError("Please enter a valid email address.");
        return;
      }

      setIsLoading(true);

      try {
        const result = await resetPassword(formData.email);

        if (result.success) {
          setIsEmailSent(true);
          showSuccess(result.message, 5000);
        } else {
          showError(result.message || ERROR_MESSAGES.default);
        }
      } catch (error) {
        showError(getErrorMessage(error), 7000);
      } finally {
        setIsLoading(false);
      }
    },
    [formData.email, validateForm, showError, showSuccess, getErrorMessage]
  );

  // Handle trying different email
  const handleTryDifferentEmail = useCallback(() => {
    setIsEmailSent(false);
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
  }, []);

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 font-babas-neue">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-light text-gray-900 tracking-wider">
                NÓMADA
              </h1>
            </Link>
          </div>

          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
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

            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Check Your Email
            </h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to{" "}
              <span className="font-medium text-gray-900">
                {formData.email}
              </span>
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Didn't receive the email? Check your spam folder or wait a few
              minutes before trying again.
            </p>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleTryDifferentEmail}
                className="w-full cursor-pointer bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium"
              >
                Try Different Email
              </button>
              <Link
                href="/signin"
                className="block w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] font-medium text-center"
              >
                Back to Sign In
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>© 2025 NÓMADA. All rights reserved.</p>
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 font-babas-neue">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-light text-gray-900 tracking-wider">
              NÓMADA
            </h1>
          </Link>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light text-gray-900 mb-2">
              Reset Your Password
            </h2>
            <p className="text-gray-600">
              Enter your email address and we'll send you a link to reset your
              password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending Reset Link...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>

            {/* Back to Sign In */}
            <div className="text-center">
              <Link
                href="/signin"
                className="text-sm text-gray-900 hover:text-gray-700 transition-colors font-medium"
              >
                ← Back to Sign In
              </Link>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Need help?</p>
                <p>
                  If you're having trouble resetting your password, please
                  contact our support team at{" "}
                  <a href="mailto:support@nomada.com" className="underline">
                    support@nomada.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 NÓMADA. All rights reserved.</p>
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

export default ForgotPasswordPage;
