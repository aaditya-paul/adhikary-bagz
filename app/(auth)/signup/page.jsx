"use client";
import React, { useContext, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { useNotification } from "@/hooks/useNotification";
import useFormValidation from "@/hooks/useFormValidation";
import { validateSignUpForm } from "@/lib/utils/validation";
import { SignUpWithEmail, signUpAndSignInWithGoogle } from "@/lib/utils/authentication";
import { createNewUserData } from "@/lib/utils/storeData";
import {
  InputField,
  PasswordField,
  SocialLoginButtons,
  FormHeader,
  FormFooter,
  Divider,
} from "@/components/auth";
import { NotificationModal } from "@/components/ui/notifications";

// Constants
const INITIAL_FORM_DATA = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
  subscribeNewsletter: true,
};

const ERROR_MESSAGES = {
  "auth/email-already-in-use": "This email is already registered. Please use a different email or try signing in.",
  "auth/weak-password": "Password is too weak. Please choose a stronger password.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/network-request-failed": "Network error. Please check your connection and try again.",
  default: "An error occurred during sign up. Please try again.",
};

const SignUpPage = () => {
  const router = useRouter();
  const { setIsLoggedin, setUser } = useContext(UserContext);
  const { notification, hideNotification, showSuccess, showError } = useNotification();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { formData, errors, handleChange, validateForm } = useFormValidation(
    INITIAL_FORM_DATA,
    validateSignUpForm
  );

  // Helper function to get error message
  const getErrorMessage = useCallback((error) => {
    return ERROR_MESSAGES[error.code] || error.message || ERROR_MESSAGES.default;
  }, []);

  // Helper function to create user data
  const createUserData = useCallback((user, additionalData = {}) => ({
    firstName: additionalData.firstName || user.displayName?.split(" ")[0] || "",
    lastName: additionalData.lastName || user.displayName?.split(" ").slice(1).join(" ") || "",
    email: user.email,
    subscribeNewsletter: additionalData.subscribeNewsletter ?? true,
  }), []);

  // Handle email signup
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError("Please fix the form errors before submitting.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await SignUpWithEmail(
        `${formData.firstName} ${formData.lastName}`,
        formData.email,
        formData.password
      );
      
      if (result.message) {
        showSuccess(result.message, 5000);
      }
      
      await createNewUserData(result.user.uid, createUserData(result.user, formData));
      
      setTimeout(() => router.replace("/"), 5000);
    } catch (error) {
      showError(getErrorMessage(error), 7000);
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, showError, showSuccess, router, getErrorMessage, createUserData]);

  // Handle Google signup
  const handleGoogleSignUp = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const result = await signUpAndSignInWithGoogle();
      
      if (result.user) {
        setIsLoggedin(true);
        setUser(result.user);
        
        await createNewUserData(result.user.uid, createUserData(result.user));
        
        showSuccess(result.message, 3000);
        setTimeout(() => router.replace("/"), 3000);
      } else {
        showError(result.message || "Google sign up failed. Please try again.");
      }
    } catch (error) {
      showError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoggedin, setUser, showSuccess, showError, router, createUserData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 font-babas-neue">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-light text-gray-900 tracking-wider">
              NÓMADA
            </h1>
            <p className="text-sm text-gray-600 mt-1">Luxury Handbags</p>
          </Link>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <FormHeader title="Create Account" subtitle="Join the NÓMADA family" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                placeholder="First name"
              />
              <InputField
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                placeholder="Last name"
              />
            </div>

            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
            />

            <div className="space-y-1">
              <PasswordField
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Create a password"
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
              <p className="text-xs text-gray-500">
                Must be 8+ characters with uppercase, lowercase, and number
              </p>
            </div>

            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
            />

            {/* Terms and Newsletter */}
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{" "}
                  <Link href="/terms" className="text-gray-900 hover:text-gray-700 underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-gray-900 hover:text-gray-700 underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="subscribeNewsletter"
                  name="subscribeNewsletter"
                  checked={formData.subscribeNewsletter}
                  onChange={handleChange}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                />
                <label htmlFor="subscribeNewsletter" className="ml-2 block text-sm text-gray-700">
                  Subscribe to our newsletter for exclusive offers
                </label>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.agreeToTerms}
              className={`w-full py-3 px-6 rounded-lg transition-all duration-300 transform font-medium ${
                !formData.agreeToTerms
                  ? "cursor-not-allowed bg-gray-200 text-gray-500"
                  : "bg-gray-900 hover:bg-gray-800 text-white cursor-pointer hover:scale-[1.02]"
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            <Divider />
            <SocialLoginButtons onGoogle={handleGoogleSignUp} onFacebook={() => {}} isLoading={isLoading} />
            <FormFooter type="signup" />
          </form>
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

export default SignUpPage;
