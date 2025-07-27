"use client";
import React, { useContext } from "react";
import Link from "next/link";
import InputField from "@/components/auth/InputField";
import PasswordField from "@/components/auth/PasswordField";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import FormHeader from "@/components/auth/FormHeader";
import FormFooter from "@/components/auth/FormFooter";
import Divider from "@/components/auth/Divider";
import {
  SignInWithEmail,
  signUpAndSignInWithGoogle,
} from "@/lib/utils/authentication";
import useFormValidation from "@/hooks/useFormValidation";
import { validateSignInForm } from "@/lib/utils/validation";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { useNotification } from "@/hooks/useNotification";
import NotificationModal from "@/components/NotificationModal";

const SignInPage = () => {
  const router = useRouter();
  const { setIsLoggedin, setUser } = useContext(UserContext);
  const {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
  } = useNotification();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    validateForm,
  } = useFormValidation(
    {
      email: "",
      password: "",
      rememberMe: false,
    },
    validateSignInForm
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await SignInWithEmail(formData.email, formData.password);
      if (result.user && !result.emailVerified) {
        showWarning(result.message, 8000);
        setIsLoading(false);
        return;
      }
      if (result.user && result.emailVerified) {
        setIsLoggedin(true);
        setUser(result.user);
        showSuccess(result.message, 3000);
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        showError(result.message || "Sign in failed. Please try again.");
      }
    } catch (error) {
      showError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      const result = await signUpAndSignInWithGoogle();
      console.log("Google sign in result:", result);

      if (result.user) {
        console.log("Google sign in successful:", result.user);
        setIsLoggedin(true);
        setUser(result.user);
        showSuccess(result.message, 3000);

        // Redirect to home page after showing success notification
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        showError(result.message || "Google sign in failed. Please try again.");
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      showError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium"
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

export default SignInPage;
