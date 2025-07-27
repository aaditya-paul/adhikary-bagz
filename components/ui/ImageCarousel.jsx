"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const ImageCarousel = ({ images, autoSlideInterval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("right");

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideDirection("right");
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [images.length, autoSlideInterval]);

  const goToPrevious = () => {
    setSlideDirection("left");
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setSlideDirection("right");
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index) => {
    setSlideDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return <div>No images to display</div>;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg group">
      {/* Main Image Container */}
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
              style={{ width: "100%" }}
            >
              <Link href={image.link || "#"}>
                <Image
                  src={image.src}
                  alt={image.alt || `Slide ${index + 1}`}
                  width={1920}
                  height={1080}
                  className="w-full h-auto object-cover"
                  priority={index === 0}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={goToPrevious}
        className="absolute h-full left-0 top-1/2 transform -translate-y-1/2 p-4 bg-transparent hover:bg-white/20 hover:backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Previous image"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={goToNext}
        className="absolute h-full right-0 top-1/2 transform -translate-y-1/2 p-4 bg-transparent hover:bg-white/20 hover:backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Next image"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="transition-all duration-500 ease-in-out"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`bg-white rounded-full transition-all duration-500 ease-in-out ${
                index === currentIndex
                  ? "w-8 h-1 bg-white"
                  : "w-2 h-2 bg-white/60 hover:bg-white/80"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
