"use client";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { signOutUser, updateUserProfile } from "@/lib/utils/authentication";
import { useNotification } from "@/hooks/useNotification";
import { NotificationModal } from "@/components/ui/notifications";
import Link from "next/link";

// Constants
const INITIAL_FORM_DATA = {
  displayName: "",
  email: "",
  phoneNumber: "",
};

const ProfilePage = () => {
  const { user, isLoggedin, isLoading, setUser, setIsLoggedin } =
    useContext(UserContext);
  const router = useRouter();
  const { notification, hideNotification, showSuccess, showError } =
    useNotification();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSaving, setIsSaving] = useState(false);

  // Redirect to signin if not logged in
  useEffect(() => {
    if (!isLoading && !isLoggedin) {
      router.push("/signin");
    }
  }, [isLoggedin, isLoading, router]);

  // Initialize form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSaveProfile = useCallback(async () => {
    setIsSaving(true);
    try {
      const result = await updateUserProfile(user.uid, formData);

      if (result.success) {
        setUser(result.user);
        setIsEditing(false);
        showSuccess("Profile updated successfully");
      } else {
        showError(result.error || "Failed to update profile");
      }
    } catch (error) {
      showError("An error occurred while updating profile");
      console.error("Profile update error:", error);
    } finally {
      setIsSaving(false);
    }
  }, [user, formData, setUser, setIsEditing, showSuccess, showError]);

  const handleSignOut = useCallback(async () => {
    try {
      const result = await signOutUser();
      if (result.success) {
        setUser(null);
        setIsLoggedin(false);
        showSuccess("Signed out successfully");
        setTimeout(() => {
          router.push("/");
        }, 5000);
      } else {
        showError(result.error || "Failed to sign out");
      }
    } catch (error) {
      showError("An error occurred while signing out");
      console.error("Sign out error:", error);
    }
  }, [setUser, setIsLoggedin, showSuccess, showError, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="font-babas-neue min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render profile content if not logged in (will redirect)
  if (!isLoggedin || !user) {
    return null;
  }

  return (
    <div className="font-babas-neue min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                My Profile
              </h1>
              <p className="text-gray-600">
                Manage your account settings and preferences
              </p>
            </div>
            <div className="flex space-x-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-4 py-2 cursor-pointer bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-6">
                Personal Information
              </h2>

              <div className="space-y-6">
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="Enter your display name"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {user.displayName ||
                        `${user.firstName} ${user.lastName}` ||
                        "Not set"}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-900 py-2">{user.email}</p>
                    {user.emailVerified ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Unverified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed from this page
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {user.phoneNumber || "Not set"}
                    </p>
                  )}
                </div>

                {/* Account Created */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <p className="text-gray-900 py-2">
                    {user.metadata?.creationTime
                      ? new Date(
                          user.metadata.creationTime
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* Account Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Account Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cart Items</span>
                  <span className="font-medium">{user.cart?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-medium">
                    {user.orders?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/cart"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  href="/orders"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Order History
                </Link>
                <Link
                  href="/"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-red-200">
              <h3 className="text-lg font-medium text-red-900 mb-4">
                Account Actions
              </h3>
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 cursor-pointer bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
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

export default ProfilePage;
