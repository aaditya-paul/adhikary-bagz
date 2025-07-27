"use client";
import React, { useState, useEffect } from "react";

const NotificationModal = ({
  isVisible,
  message,
  type = "success", // "success", "error", "warning", "info"
  duration = 5000,
  onClose,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // Start slide in animation
      setTimeout(() => setIsAnimating(true), 10);

      // Start progress bar animation
      setProgress(100);
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (duration / 50);
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 50);

      // Auto close after duration
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    // Wait for slide out animation to complete
    setTimeout(() => {
      setShouldRender(false);
      onClose && onClose();
    }, 300);
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-500",
          text: "text-white",
          icon: "✓",
          progressBar: "bg-green-300",
        };
      case "error":
        return {
          bg: "bg-red-500",
          text: "text-white",
          icon: "✕",
          progressBar: "bg-red-300",
        };
      case "warning":
        return {
          bg: "bg-yellow-500",
          text: "text-white",
          icon: "⚠",
          progressBar: "bg-yellow-300",
        };
      case "info":
        return {
          bg: "bg-blue-500",
          text: "text-white",
          icon: "ℹ",
          progressBar: "bg-blue-300",
        };
      default:
        return {
          bg: "bg-gray-500",
          text: "text-white",
          icon: "ℹ",
          progressBar: "bg-gray-300",
        };
    }
  };

  if (!shouldRender) return null;

  const styles = getTypeStyles();

  return (
    <div
      className={`fixed top-20 right-4 z-50 transform transition-all duration-300 ease-in-out ${
        isAnimating ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div
        className={`${styles.bg} ${styles.text} rounded-lg shadow-xl p-4 min-w-[320px] max-w-[400px] font-babas-neue`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center hover:bg-black/20 rounded-full transition-colors"
        >
          ✕
        </button>

        {/* Content */}
        <div className="flex items-start space-x-3 pr-6">
          {/* Icon */}
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-lg font-bold">
            {styles.icon}
          </div>

          {/* Message */}
          <div className="flex-1">
            <p className="text-sm leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1 bg-black/20 rounded-full overflow-hidden">
          <div
            className={`h-full ${styles.progressBar} transition-all duration-75 ease-linear rounded-full`}
            style={{
              width: `${progress}%`,
              transition: progress === 100 ? "none" : undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
