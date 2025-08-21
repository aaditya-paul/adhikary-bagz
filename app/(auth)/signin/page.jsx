"use client";
import React, { useContext, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { useNotification } from "@/hooks/useNotification";
import useFormValidation from "@/hooks/useFormValidation";
import { validateSignInForm } from "@/lib/utils/validation";
import {
  fetchUser,
  SignInWithEmail,
  signUpAndSignInWithGoogle,
} from "@/lib/utils/authentication";
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
  email: "",
  password: "",
  rememberMe: false,
};

const ERROR_MESSAGES = {
  "auth/user-not-found":
    "No account found with this email address. Please check your email or sign up.",
  "auth/wrong-password":
    "Incorrect password. Please try again or reset your password.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-disabled":
    "This account has been disabled. Please contact support.",
  "auth/too-many-requests": "Too many failed attempts. Please try again later.",
  "auth/network-request-failed":
    "Network error. Please check your connection and try again.",
  default: "An error occurred during sign in. Please try again.",
};

const SignInPage = () => {
  const router = useRouter();
  const { setIsLoggedin, setUser } = useContext(UserContext);
  const {
    notification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
  } = useNotification();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { formData, errors, handleChange, validateForm } = useFormValidation(
    INITIAL_FORM_DATA,
    validateSignInForm
  );

  // Helper function to get error message
  const getErrorMessage = useCallback((error) => {
    return (
      ERROR_MESSAGES[error.code] || error.message || ERROR_MESSAGES.default
    );
  }, []);

  // Handle email signin
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        showError("Please fix the form errors before submitting.");
        return;
      }

      setIsLoading(true);

      try {
        const result = await SignInWithEmail(formData.email, formData.password);

        if (result.user && !result.emailVerified) {
          showWarning(result.message, 8000);
          return;
        }

        if (result.user && result.emailVerified) {
          setIsLoggedin(true);
          setUser(result.user);
          showSuccess(result.message, 3000);
          setTimeout(() => router.push("/"), 3000);
        } else {
          showError(result.message || "Sign in failed. Please try again.");
        }
      } catch (error) {
        showError(getErrorMessage(error), 7000);
      } finally {
        setIsLoading(false);
      }
    },
    [
      formData.email,
      formData.password,
      validateForm,
      showError,
      showWarning,
      showSuccess,
      setIsLoggedin,
      setUser,
      router,
      getErrorMessage,
    ]
  );

  // Handle Google signin
  const handleGoogleSignIn = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await signUpAndSignInWithGoogle();

      if (result.user) {
        setIsLoggedin(true);
        const user = await fetchUser(result.user.uid);
        setUser({ ...user, emailVerified: true });
        showSuccess(result.message, 3000);
        setTimeout(() => router.push("/"), 3000);
      } else {
        showError(result.message || "Google sign in failed. Please try again.");
      }
    } catch (error) {
      showError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoggedin, setUser, showSuccess, showError, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 font-babas-neue">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-light text-gray-900 tracking-wider">
              Adhikary Bagz
            </h1>
          </Link>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <FormHeader title="Welcome Back" subtitle="Sign in to your account" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
            />

            <PasswordField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-gray-900 hover:text-gray-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            <Divider />
            <SocialLoginButtons
              onGoogle={handleGoogleSignIn}
              onFacebook={() => {}}
              isLoading={isLoading}
            />
            <FormFooter type="signin" />
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 Adhikary Bagz. All rights reserved.</p>
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

export default SignInPage;
