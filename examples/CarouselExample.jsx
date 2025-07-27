// Example usage of ImageCarousel component
import { ImageCarousel } from "@/components/ui";

const ExamplePage = () => {
  // Example images data
  const carouselImages = [
    {
      src: "/images/bag1.jpg", // Replace with your actual image paths
      alt: "Premium Leather Bag",
      link: "/shop/leather-bag",
    },
    {
      src: "/images/bag2.jpg",
      alt: "Canvas Backpack",
      link: "/shop/canvas-backpack",
    },
    {
      src: "/images/bag3.jpg",
      alt: "Travel Duffel",
      link: "/shop/travel-duffel",
    },
    {
      src: "/images/bag4.jpg",
      alt: "Crossbody Bag",
      link: "/shop/crossbody-bag",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <ImageCarousel images={carouselImages} autoSlideInterval={4000} />
    </div>
  );
};

export default ExamplePage;
