"use client";
import React, { useState, useEffect } from "react";

const LoadingScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Prevent scrolling during loading
    document.body.style.overflow = "hidden";

    // Start transition after 3 seconds
    const timer = setTimeout(() => {
      setIsTransitioning(true);

      // Complete loading after transition
      setTimeout(() => {
        setIsLoading(false);
        // Restore scrolling
        document.body.style.overflow = "unset";
        onLoadingComplete();
      }, 1000); // 1 second for transition
    }, 1500);

    return () => {
      clearTimeout(timer);
      // Cleanup: restore scrolling if component unmounts
      document.body.style.overflow = "unset";
    };
  }, [onLoadingComplete]);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-all duration-1000 ${
        isTransitioning ? "bg-white/80 backdrop-blur-sm" : "bg-white"
      }`}
    >
      <h1
        className={`font-babas-neue text-black transition-all duration-1000 ease-in-out ${
          isTransitioning
            ? "text-3xl transform -translate-y-[46vh] translate-x-0"
            : "text-[140px] transform translate-y-0 translate-x-0"
        }`}
      >
        NÓMADA
      </h1>
    </div>
  );
};

export default LoadingScreen;
