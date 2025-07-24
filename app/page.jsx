import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import PopularProducts from "@/components/PopularProducts";
import HeroSection from "@/components/HeroSection";
import BrandShowcase from "@/components/BrandShowcase";
import LuxuryStatement from "@/components/LuxuryStatement";
import BrandProgress from "@/components/BrandProgress";
import BrandVision from "@/components/BrandVision";
// import AdminPanel from "@/components/AdminPanel";
import Image from "next/image";
import ClientLayout from "@/components/ClientLayout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    // <ClientLayout>
    <>
      <Navbar>
        <HeroSection />
        <BrandShowcase />
        <LuxuryStatement />
        <FeaturedProducts />
        <PopularProducts />
        {/* <BrandProgress /> */}
        <Categories />
        <BrandVision />
      </Navbar>
      <Footer />
    </>
    // </ClientLayout>
  );
}
