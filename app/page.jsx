import {
  Categories,
  FeaturedProducts,
  PopularProducts,
} from "@/components/product";
import {
  HeroSection,
  BrandShowcase,
  LuxuryStatement,
  BrandVision,
} from "@/components/brand";
import { Navbar, Footer } from "@/components/layout";

export default function Home() {
  return (
    <>
      <Navbar>
        <HeroSection />
        <BrandShowcase />
        <LuxuryStatement />
        <FeaturedProducts />
        <PopularProducts />
        <Categories />
        <BrandVision />
      </Navbar>
      <Footer />
    </>
  );
}
