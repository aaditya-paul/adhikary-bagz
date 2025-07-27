"use client";
import React, { useEffect, useState } from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  size = "md", // "sm", "md", "lg", "xl"
  className = "",
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      // Start animation after render
      setTimeout(() => setIsAnimating(true), 10);
    } else if (shouldRender) {
      // Start closing animation
      setIsClosing(true);
      setIsAnimating(false);
      // Allow body scroll when modal is closed
      document.body.style.overflow = "unset";
      // Wait for animation to complete before unmounting
      setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300);
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "max-w-md";
      case "md":
        return "max-w-lg";
      case "lg":
        return "max-w-2xl";
      case "xl":
        return "max-w-4xl";
      default:
        return "max-w-lg";
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${getSizeClasses()} transform ${
          isClosing
            ? "animate-popout"
            : isAnimating
            ? "opacity-100 translate-y-0 scale-100 animate-popup"
            : "opacity-0 translate-y-8 scale-90"
        } ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 pb-4">
            {title && (
              <h2 className="text-2xl font-light text-gray-900 font-babas-neue">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`px-6 ${title || showCloseButton ? "pb-6" : "py-6"}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default", // "default", "danger", "warning"
  isLoading = false,
}) => {
  const getButtonStyles = () => {
    switch (type) {
      case "danger":
        return {
          confirm: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          cancel: "bg-gray-200 hover:bg-gray-300 text-gray-900",
        };
      case "warning":
        return {
          confirm: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
          cancel: "bg-gray-200 hover:bg-gray-300 text-gray-900",
        };
      default:
        return {
          confirm: "bg-gray-900 hover:bg-gray-800 focus:ring-gray-500",
          cancel: "bg-gray-200 hover:bg-gray-300 text-gray-900",
        };
    }
  };

  const styles = getButtonStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        {/* Message */}
        <p className="text-gray-600 leading-relaxed">{message}</p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 cursor-pointer rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${styles.cancel}`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 cursor-pointer text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${styles.confirm}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Loading...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Alert Modal Component
const AlertModal = ({
  isOpen,
  onClose,
  title = "Alert",
  message,
  buttonText = "OK",
  type = "info", // "info", "success", "warning", "error"
}) => {
  const getIconAndColors = () => {
    switch (type) {
      case "success":
        return {
          icon: (
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
              <svg
                className="w-6 h-6 text-green-600"
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
          ),
          button: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
        };
      case "warning":
        return {
          icon: (
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          ),
          button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
        };
      case "error":
        return {
          icon: (
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          ),
          button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        };
      default:
        return {
          icon: (
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
              <svg
                className="w-6 h-6 text-blue-600"
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
            </div>
          ),
          button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        };
    }
  };

  const { icon, button } = getIconAndColors();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center space-y-6">
        {/* Icon */}
        {icon}

        {/* Message */}
        <p className="text-gray-600 leading-relaxed">{message}</p>

        {/* Action Button */}
        <button
          onClick={onClose}
          className={`w-full px-4 py-2 cursor-pointer text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${button}`}
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  );
};

export default Modal;
export { ConfirmationModal, AlertModal };
