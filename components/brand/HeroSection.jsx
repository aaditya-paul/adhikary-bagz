"use client";
import React, { useState, useEffect } from "react";
import ImageCarousel from "./ImageCarousel";
import { getCarouselImages } from "@/data/products";

const HeroSection = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        setIsLoading(true);
        const carouselImages = await getCarouselImages();
        // Transform carousel images to match ImageCarousel component format
        const transformedImages = carouselImages.map((image) => ({
          src: image.src,
          alt: image.alt,
          link: image.link,
          title: image.title,
          subtitle: image.subtitle,
        }));
        setHeroImages(transformedImages);
      } catch (error) {
        console.error("Error fetching carousel images:", error);
        setHeroImages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarouselImages();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full h-96 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <ImageCarousel images={heroImages} autoSlideInterval={4000} />
    </section>
  );
};

export default HeroSection;
