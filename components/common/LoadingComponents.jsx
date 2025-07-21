"use client";
import React from "react";

/**
 * Higher-order component to handle loading states
 * @param {Component} WrappedComponent - The component to wrap
 * @param {string} loadingMessage - Custom loading message
 * @returns {Component} - Component with loading state handling
 */
export const withLoading = (WrappedComponent, loadingMessage = "Loading...") => {
  return function LoadingWrapper(props) {
    const { isLoading, ...restProps } = props;

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <h1 className="text-xl font-light text-gray-900">{loadingMessage}</h1>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...restProps} />;
  };
};

/**
 * Simple loading component
 * @param {string} message - Loading message to display
 * @param {string} size - Size of the spinner (sm, md, lg)
 */
export const LoadingSpinner = ({ 
  message = "Loading...", 
  size = "md",
  className = ""
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-gray-900 mx-auto mb-4 ${sizeClasses[size]}`}></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};
