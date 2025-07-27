"use client";
import React, { useState, useContext } from "react";
import Link from "next/link";
import InputField from "@/components/auth/InputField";
import PasswordField from "@/components/auth/PasswordField";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import FormHeader from "@/components/auth/FormHeader";
import FormFooter from "@/components/auth/FormFooter";
import Divider from "@/components/auth/Divider";
import {
  SignUpAndSignIn,
  signUpAndSignInWithEmail,
  SignUpWithEmail,
  signUpAndSignInWithGoogle,
} from "@/lib/utils/authentication";
import { useRouter } from "next/navigation";
import { createNewUserData } from "@/lib/utils/storeData";
import { useNotification } from "@/hooks/useNotification";
import NotificationModal from "@/components/NotificationModal";
import { UserContext } from "@/context/UserContext";

const SignUpPage = () => {
  const router = useRouter();
  const { setIsLoggedin, setUser } = useContext(UserContext);
  const {
    notification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
  } = useNotification();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: true,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError("Please fix the form errors before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sign up data:", formData);
      const result = await SignUpWithEmail(
        `${formData.firstName} ${formData.lastName}`,
        formData.email,
        formData.password
      );
      console.log("User signed up successfully: ", result);

      // Show success message from Firebase
      if (result.message) {
        showSuccess(result.message, 5000); // Show for 5 seconds
      }

      console.log("Creating user data...");
      await createNewUserData(result.user.uid, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        subscribeNewsletter: formData.subscribeNewsletter,
      });

      console.log("User data created successfully");

      // Redirect after a delay to allow user to see the success message
      setTimeout(() => {
        router.replace("/");
      }, 5000);
    } catch (error) {
      console.error("Sign up error:", error);

      // Handle specific Firebase errors
      let errorMessage = "An error occurred during sign up. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Please use a different email or try signing in.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "Password is too weak. Please choose a stronger password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError(errorMessage, 7000); // Show error for 7 seconds
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);

    try {
      const result = await signUpAndSignInWithGoogle();
      console.log("Google sign up result:", result);

      if (result.user) {
        console.log("Google sign up successful:", result.user);

        // Set user context
        setIsLoggedin(true);
        setUser(result.user);

        // Create user data in Firestore
        await createNewUserData(result.user.uid, {
          firstName: result.user.displayName?.split(" ")[0] || "",
          lastName:
            result.user.displayName?.split(" ").slice(1).join(" ") || "",
          email: result.user.email,
          subscribeNewsletter: true, // Default to true for Google users
        });

        showSuccess(result.message, 3000);

        // Redirect to home page after showing success notification
        setTimeout(() => {
          router.replace("/");
        }, 3000);
      } else {
        showError(result.message || "Google sign up failed. Please try again.");
      }
    } catch (error) {
      console.error("Google sign up error:", error);
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
            <p className="text-sm text-gray-600 mt-1">Luxury Handbags</p>
          </Link>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <FormHeader
            title="Create Account"
            subtitle="Join the NÓMADA family"
          />

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
            <p className="mt-1 text-xs text-gray-500">
              Must be 8+ characters with uppercase, lowercase, and number
            </p>

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
                <label
                  htmlFor="agreeToTerms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-gray-900 hover:text-gray-700 underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-gray-900 hover:text-gray-700 underline"
                  >
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
                <label
                  htmlFor="subscribeNewsletter"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Subscribe to our newsletter for exclusive offers
                </label>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.agreeToTerms}
              className={`${
                !formData.agreeToTerms
                  ? "cursor-not-allowed bg-gray-200 text-gray-500"
                  : "bg-gray-900 hover:bg-gray-800 text-white"
              } w-full py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            <Divider />
            <SocialLoginButtons
              onGoogle={handleGoogleSignUp}
              onFacebook={() => {}}
              isLoading={isLoading}
            />
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
