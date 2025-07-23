import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

/**
 * Fetch all products from Firestore
 * @returns {Promise<Array>} Array of products
 */
export const fetchAllProducts = async () => {
  try {
    const productsRef = collection(db, "Products");
    const querySnapshot = await getDocs(productsRef);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

/**
 * Fetch products with filters and pagination
 * @param {Object} filters - Filter options
 * @param {number} limitCount - Number of products to fetch
 * @param {DocumentSnapshot} lastDoc - Last document for pagination
 * @returns {Promise<Object>} Object containing products and lastDoc
 */
export const fetchFilteredProducts = async (filters = {}, limitCount = 20, lastDoc = null) => {
  try {
    const productsRef = collection(db, "Products");
    let q = query(productsRef);

    // Apply filters
    if (filters.category && filters.category !== "all") {
      q = query(q, where("category", "==", filters.category));
    }

    if (filters.priceMin !== undefined) {
      q = query(q, where("price", ">=", filters.priceMin));
    }

    if (filters.priceMax !== undefined) {
      q = query(q, where("price", "<=", filters.priceMax));
    }

    if (filters.inStock) {
      q = query(q, where("inStock", "==", true));
    }

    if (filters.featured) {
      q = query(q, where("featured", "==", true));
    }

    // Apply sorting
    let sortField = "name";
    let sortDirection = "asc";

    switch (filters.sortBy) {
      case "price-low":
        sortField = "price";
        sortDirection = "asc";
        break;
      case "price-high":
        sortField = "price";
        sortDirection = "desc";
        break;
      case "rating":
        sortField = "rating";
        sortDirection = "desc";
        break;
      case "newest":
        sortField = "createdAt";
        sortDirection = "desc";
        break;
      default:
        sortField = "name";
        sortDirection = "asc";
    }

    q = query(q, orderBy(sortField, sortDirection));

    // Apply pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    q = query(q, limit(limitCount));

    const querySnapshot = await getDocs(q);
    const products = [];
    let newLastDoc = null;

    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
      newLastDoc = doc;
    });

    return {
      products,
      lastDoc: newLastDoc,
      hasMore: products.length === limitCount,
    };
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    throw new Error("Failed to fetch filtered products");
  }
};

/**
 * Fetch product by ID or slug
 * @param {string} identifier - Product ID or slug
 * @returns {Promise<Object|null>} Product object or null
 */
export const fetchProductById = async (identifier) => {
  try {
    const productsRef = collection(db, "Products");
    
    // Try to find by slug first
    let q = query(productsRef, where("slug", "==", identifier));
    let querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // If not found by slug, try by ID
      q = query(productsRef, where("id", "==", identifier));
      querySnapshot = await getDocs(q);
    }
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
};

/**
 * Fetch products by category
 * @param {string} category - Category name
 * @param {number} limitCount - Number of products to fetch
 * @returns {Promise<Array>} Array of products
 */
export const fetchProductsByCategory = async (category, limitCount = 10) => {
  try {
    const productsRef = collection(db, "Products");
    const q = query(
      productsRef,
      where("category", "==", category),
      where("inStock", "==", true),
      orderBy("rating", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw new Error("Failed to fetch products by category");
  }
};

/**
 * Get unique categories from products
 * @returns {Promise<Array>} Array of category names
 */
export const fetchCategories = async () => {
  try {
    const products = await fetchAllProducts();
    const categories = [...new Set(products.map(product => product.category).filter(Boolean))];
    return categories.sort();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

/**
 * Search products by text
 * @param {string} searchTerm - Search term
 * @param {number} limitCount - Number of products to fetch
 * @returns {Promise<Array>} Array of products
 */
export const searchProducts = async (searchTerm, limitCount = 20) => {
  try {
    // Since Firestore doesn't support full-text search, we'll fetch all products
    // and filter them client-side. For production, consider using Algolia or similar.
    const products = await fetchAllProducts();
    
    const searchLower = searchTerm.toLowerCase();
    const filtered = products.filter(product =>
      product.name?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
    
    return filtered.slice(0, limitCount);
  } catch (error) {
    console.error("Error searching products:", error);
    throw new Error("Failed to search products");
  }
};
