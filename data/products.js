// Products data for the Adhikary Bagz website

import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

// Carousel images for hero section
export const carouselImages = [
  {
    id: 1,
    src: "/assests/CarousalBag1.png",
    alt: "Karl Lagerfeld Paris - Premium Black Leather Collection",
    title: "Parisian Elegance",
    subtitle: "Timeless sophistication meets modern luxury",
    link: "/product/karl-lagerfeld-paris",
    featured: true,
  },
  {
    id: 2,
    src: "/assests/CarousalBag1.png",
    alt: "Vivienne Westwood London - Punk Luxury Collection",
    title: "Rebellious Luxury",
    subtitle: "British punk heritage with sophisticated craftsmanship",
    link: "/product/vivienne-westwood-london",
    featured: true,
  },
  {
    id: 3,
    src: "/assests/CarousalBag1.png",
    alt: "Issey Miyake Tokyo - Minimalist Design Collection",
    title: "Japanese Minimalism",
    subtitle: "Clean lines and functional beauty",
    link: "/product/issey-miyake-tokyo",
     
  },
  {
    id: 4,
    src: "/assests/CarousalBag1.png",
    alt: "Maison Margiela Milano - Avant-garde Collection",
    title: "Italian Innovation",
    subtitle: "Deconstructed luxury that challenges convention",
    link: "/product/maison-margiela-milano",
    featured: true,
  },
  {
    id: 5,
    src: "/assests/CarousalBag1.png",
    alt: "Adhikary Bagz Premium Collection - Luxury Handbags",
    title: "Discover Adhikary Bagz",
    subtitle: "Where luxury meets wanderlust",
    link: "/shop",
    featured: true,
  },
];

export const products = [
  // Featured Products
  {
    id: 1,
    slug: "karl-lagerfeld-paris",
    name: "Karl Lagerfeld Paris",
    price: 199,
    originalPrice: 249,
    images: [
      "/assests/bags/bag_black.png",
      "/assests/bags/bag_black.png", // You can add more angles later
    ],
    description:
      "A timeless black bag that embodies Parisian sophistication and modern elegance. Crafted with premium materials and attention to detail.",
    longDescription:
      "The Karl Lagerfeld Paris bag represents the pinnacle of contemporary luxury. Inspired by the legendary designer's vision, this piece combines classical elegance with modern functionality. Each bag is meticulously crafted using the finest materials, ensuring durability and style that transcends seasons.",
    features: [
      "Premium Italian leather construction",
      "Hand-stitched seams for durability",
      "Adjustable shoulder strap",
      "Interior organizing pockets",
      "Signature Adhikary Bagz hardware",
      "Dust bag included",
    ],
    specifications: {
      dimensions: '12" W x 8" H x 4" D',
      weight: "1.2 lbs",
      material: "Italian Leather",
      lining: "Suede",
      hardware: "Antique Brass",
      origin: "Italy",
    },
    category: "handbags",
    tags: ["luxury", "leather", "black", "classic"],
    inStock: true,
    stockCount: 15,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: 2,
    slug: "vivienne-westwood-london",
    name: "Vivienne Westwood London",
    price: 249,
    originalPrice: 299,
    images: ["/assests/bags/bag_brown.png", "/assests/bags/bag_brown.png"],
    description:
      "A distinctive brown bag that captures the essence of British punk luxury with rebellious sophistication.",
    longDescription:
      "The Vivienne Westwood London bag embodies punk luxury at its finest. This distinctive piece combines rebellious spirit with sophisticated craftsmanship, creating a bag that's both edgy and elegant.",
    features: [
      "Punk-inspired hardware details",
      "Rich cognac leather finish",
      "Convertible carrying options",
      "Studded accent details",
      "Signature chain elements",
      "Premium fabric lining",
    ],
    specifications: {
      dimensions: '13" W x 9" H x 5" D',
      weight: "1.4 lbs",
      material: "Cognac Leather",
      lining: "Canvas",
      hardware: "Antique Silver",
      origin: "United Kingdom",
    },
    category: "handbags",
    tags: ["luxury", "leather", "brown", "punk"],
    inStock: true,
    stockCount: 8,
    rating: 4.7,
    reviewCount: 89,
  },
  {
    id: 3,
    slug: "issey-miyake-tokyo",
    name: "Issey Miyake Tokyo",
    price: 229,
    originalPrice: 279,
    images: ["/assests/bags/bag_pitch.png", "/assests/bags/bag_pitch.png"],
    description:
      "A minimalist pitch bag that embodies Japanese design philosophy with clean lines and functional beauty.",
    longDescription:
      "The Issey Miyake Tokyo bag represents the essence of Japanese minimalism. With its clean lines and functional beauty, this piece demonstrates how simplicity can create the most profound impact.",
    features: [
      "Minimalist design philosophy",
      "Innovative pleating technique",
      "Lightweight construction",
      "Versatile styling options",
      "Hidden magnetic closures",
      "Water-resistant finish",
    ],
    specifications: {
      dimensions: '11" W x 10" H x 3" D',
      weight: "0.9 lbs",
      material: "Technical Fabric",
      lining: "Polyester",
      hardware: "Matte Black",
      origin: "Japan",
    },
    category: "handbags",
    tags: ["minimalist", "technical", "pitch", "japanese"],
    inStock: true,
    stockCount: 12,
    rating: 4.9,
    reviewCount: 156,
  },
  {
    id: 4,
    slug: "maison-margiela-milano",
    name: "Maison Margiela Milano",
    price: 259,
    originalPrice: 309,
    images: ["/assests/bags/bag_purple.png", "/assests/bags/bag_purple.png"],
    description:
      "An avant-garde purple bag that showcases Italian innovation with deconstructed luxury design.",
    longDescription:
      "The Maison Margiela Milano bag pushes the boundaries of traditional luxury. This avant-garde piece showcases Italian innovation through deconstructed design elements that challenge conventional aesthetics.",
    features: [
      "Deconstructed design elements",
      "Artisanal purple leather",
      "Innovative closure system",
      "Architectural silhouette",
      "Limited edition numbering",
      "Collector's documentation",
    ],
    specifications: {
      dimensions: '14" W x 8" H x 6" D',
      weight: "1.3 lbs",
      material: "Purple Leather",
      lining: "Leather",
      hardware: "Brushed Steel",
      origin: "Italy",
    },
    category: "handbags",
    tags: ["avant-garde", "leather", "purple", "italian"],
    inStock: true,
    stockCount: 5,
    rating: 4.6,
    reviewCount: 67,
  },
  // Popular Products
  {
    id: 5,
    slug: "bottega-veneta-roma",
    name: "Bottega Veneta Roma",
    price: 299,
    originalPrice: 359,
    images: ["/assests/bags/bag_black.png", "/assests/bags/bag_black.png"],
    description:
      "The #1 trending bag that combines Roman heritage with contemporary luxury craftsmanship.",
    longDescription:
      "Our most popular piece, the Bottega Veneta Roma bag represents the perfect fusion of Roman heritage and contemporary luxury. This trending masterpiece has captured the hearts of modern nomads worldwide.",
    features: [
      "Signature intrecciato weave",
      "Buttery soft leather",
      "Spacious interior compartments",
      "Detachable shoulder strap",
      "Gold-tone hardware",
      "Authenticity certificate",
    ],
    specifications: {
      dimensions: '15" W x 10" H x 5" D',
      weight: "1.5 lbs",
      material: "Woven Leather",
      lining: "Suede",
      hardware: "Gold Tone",
      origin: "Italy",
    },
    category: "handbags",
    tags: ["trending", "woven", "black", "luxury"],
    inStock: true,
    stockCount: 20,
    rating: 4.9,
    reviewCount: 203,
    trending: "#1",
  },
  {
    id: 6,
    slug: "hermes-saint-tropez",
    name: "Hermès Saint-Tropez",
    price: 399,
    originalPrice: 459,
    images: ["/assests/bags/bag_brown.png", "/assests/bags/bag_brown.png"],
    description:
      "The #2 trending bag inspired by the French Riviera lifestyle with timeless elegance.",
    longDescription:
      "The Hermès Saint-Tropez bag captures the essence of French Riviera luxury. This second most popular piece embodies the effortless elegance of coastal living with sophisticated craftsmanship.",
    features: [
      "French Riviera inspired design",
      "Exotic leather construction",
      "Hand-painted edge details",
      "Silk scarf tie accent",
      "Palladium hardware",
      "Heritage craftsmanship",
    ],
    specifications: {
      dimensions: '12" W x 9" H x 4" D',
      weight: "1.3 lbs",
      material: "Exotic Leather",
      lining: "Silk",
      hardware: "Palladium",
      origin: "France",
    },
    category: "handbags",
    tags: ["trending", "exotic", "brown", "french"],
    inStock: true,
    stockCount: 7,
    rating: 4.8,
    reviewCount: 178,
    trending: "#2",
  },
  {
    id: 7,
    slug: "chanel-marseille",
    name: "Chanel Marseille",
    price: 349,
    originalPrice: 399,
    images: ["/assests/bags/bag_pitch.png", "/assests/bags/bag_pitch.png"],
    description:
      "The #3 trending bag that brings Mediterranean charm with classic quilted elegance.",
    longDescription:
      "The Chanel Marseille bag brings Mediterranean charm to classic luxury. This third trending piece features the iconic quilted design with a fresh, coastal-inspired twist.",
    features: [
      "Iconic quilted pattern",
      "Chain shoulder strap",
      "CC turn-lock closure",
      "Mediterranean color palette",
      "Lambskin construction",
      "Timeless silhouette",
    ],
    specifications: {
      dimensions: '10" W x 6" H x 3" D',
      weight: "1.1 lbs",
      material: "Lambskin",
      lining: "Leather",
      hardware: "Silver Tone",
      origin: "France",
    },
    category: "handbags",
    tags: ["trending", "quilted", "pitch", "classic"],
    inStock: true,
    stockCount: 11,
    rating: 4.7,
    reviewCount: 145,
    trending: "#3",
  },
  {
    id: 8,
    slug: "prada-barcelona",
    name: "Prada Barcelona",
    price: 379,
    originalPrice: 429,
    images: ["/assests/bags/bag_purple.png", "/assests/bags/bag_purple.png"],
    description:
      "The #4 trending bag that showcases Barcelona's artistic spirit with modern luxury design.",
    longDescription:
      "The Prada Barcelona bag showcases the artistic spirit of Barcelona through modern luxury design. This fourth trending piece combines creative innovation with Italian craftsmanship.",
    features: [
      "Artistic Barcelona inspiration",
      "Saffiano leather finish",
      "Geometric design elements",
      "Convertible carrying options",
      "Signature Prada triangle",
      "Contemporary silhouette",
    ],
    specifications: {
      dimensions: '13" W x 8" H x 5" D',
      weight: "1.4 lbs",
      material: "Saffiano Leather",
      lining: "Nylon",
      hardware: "Black Nickel",
      origin: "Italy",
    },
    category: "handbags",
    tags: ["trending", "artistic", "purple", "geometric"],
    inStock: true,
    stockCount: 9,
    rating: 4.6,
    reviewCount: 98,
    trending: "#4",
  },
];

// Helper function to get product by slug
export const getProductBySlug = async (slug) => {
  try {
    // Validate slug parameter
    if (!slug || typeof slug !== "string") {
      console.log(`Invalid slug parameter:`, slug);
      return { success: false, error: "Invalid slug parameter" };
    }

    const q = query(collection(db, "Products"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const productDoc = querySnapshot.docs[0];
      const productData = { id: productDoc.id, ...productDoc.data() };
      console.log(`Product found:`, productData);
      return { success: true, item: productData };
    }

    console.log(`Product with slug "${slug}" not found`);
    return { success: false, error: "Product not found" };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return { success: false, error: error.message };
  }
};

// Helper function to get product by ID
export const getProductById = async (id) => {
  try {
    // Validate and convert ID parameter
    if (!id) {
      console.log(`Invalid ID parameter:`, id);
      return { success: false, error: "Invalid ID parameter" };
    }

    // Try to convert to number, fallback to string comparison
    let numericId = parseInt(id);
    if (isNaN(numericId)) {
      // If not a number, try string comparison
      const q = query(collection(db, "Products"), where("id", "==", id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const productDoc = querySnapshot.docs[0];
        const productData = { id: productDoc.id, ...productDoc.data() };
        console.log(`Product found by string ID:`, productData);
        return { success: true, item: productData };
      }
    } else {
      // Try numeric comparison first
      const q = query(collection(db, "Products"), where("id", "==", numericId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const productDoc = querySnapshot.docs[0];
        const productData = { id: productDoc.id, ...productDoc.data() };
        console.log(`Product found by numeric ID:`, productData);
        return { success: true, item: productData };
      }
    }

    console.log(`Product with ID "${id}" not found`);
    return { success: false, error: "Product not found" };
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return { success: false, error: error.message };
  }
};

// Helper function to get related products - now fetches from Firebase
export const getRelatedProducts = async (
  currentProductId,
  category,
  limit = 4
) => {
  try {
    // Validate parameters
    if (!currentProductId || !category) {
      console.log(`Invalid parameters for getRelatedProducts:`, {
        currentProductId,
        category,
      });
      return [];
    }

    const q = query(
      collection(db, "Products"),
      where("category", "==", category)
    );
    const querySnapshot = await getDocs(q);
    let relatedProducts = [];

    querySnapshot.forEach((doc) => {
      const product = { id: doc.id, ...doc.data() };
      // Exclude the current product
      if (product.id !== currentProductId) {
        relatedProducts.push(product);
      }
    });

    // Limit the results
    const limitedProducts = relatedProducts.slice(0, limit);
    console.log(
      `Found ${limitedProducts.length} related products for category: ${category}`
    );
    return limitedProducts;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
};

// Helper function to get all products by category - now fetches from Firebase
export const getProductsByCategory = async (category) => {
  try {
    // Validate category parameter
    if (!category || typeof category !== "string") {
      console.log(`Invalid category parameter:`, category);
      return [];
    }

    const q = query(
      collection(db, "Products"),
      where("category", "==", category)
    );
    const querySnapshot = await getDocs(q);
    const products = [];

    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Found ${products.length} products in category: ${category}`);
    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

// Helper function to get trending products - now fetches from Firebase
export const getTrendingProducts = async () => {
  try {
    // Get all products first, then filter for trending ones
    const querySnapshot = await getDocs(collection(db, "Products"));
    const products = [];

    querySnapshot.forEach((doc) => {
      const productData = { id: doc.id, ...doc.data() };
      // Only include products that have a trending field
      if (
        productData.trending &&
        productData.trending !== null &&
        productData.trending !== undefined
      ) {
        products.push(productData);
      }
    });

    // Sort by trending rank
    products.sort((a, b) => {
      const rankA = parseInt(a.trending?.replace("#", "") || "999");
      const rankB = parseInt(b.trending?.replace("#", "") || "999");
      return rankA - rankB;
    });

    console.log(`Found ${products.length} trending products`);
    return products;
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return [];
  }
};

// Helper function to get all products - now fetches from Firebase
export const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Products"));
    const products = [];

    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Found ${products.length} total products`);
    return products;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};

// Helper function to get carousel images
export const getCarouselImages = async () => {
  try {
    // Return static carousel images (could be extended to fetch from Firebase later)
    console.log(`Loaded ${carouselImages.length} carousel images`);
    return carouselImages;
  } catch (error) {
    console.error("Error fetching carousel images:", error);
    return [];
  }
};

// Helper function to get featured carousel images
export const getFeaturedCarouselImages = async () => {
  try {
    const featured = carouselImages.filter((image) => image.featured);
    console.log(`Loaded ${featured.length} featured carousel images`);
    return featured;
  } catch (error) {
    console.error("Error fetching featured carousel images:", error);
    return [];
  }
};
