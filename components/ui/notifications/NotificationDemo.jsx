"use client";
import React from "react";
import { useNotification } from "@/hooks/useNotification";
import NotificationModal from "./NotificationModal";

const NotificationDemo = () => {
  const {
    notification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  } = useNotification();

  const handleSuccess = () => {
    showSuccess("User signed in successfully! Welcome to NÓMADA.");
  };

  const handleError = () => {
    showError(
      "Error creating account. Please check your information and try again."
    );
  };

  const handleWarning = () => {
    showWarning("Please verify your email before accessing premium features.");
  };

  const handleInfo = () => {
    showInfo(
      "Your order has been processed and will be shipped within 2-3 business days."
    );
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-babas-neue mb-6">Notification Demo</h2>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleSuccess}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Show Success
        </button>

        <button
          onClick={handleError}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Show Error
        </button>

        <button
          onClick={handleWarning}
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Show Warning
        </button>

        <button
          onClick={handleInfo}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Show Info
        </button>
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

export default NotificationDemo;
