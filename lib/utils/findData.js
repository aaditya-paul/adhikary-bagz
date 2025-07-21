import {
  getDoc,
  getDocs,
  doc,
  query,
  collection,
  where,
  addDoc,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// Find cart items by product ID
export const findCartItems = async (elementId) => {
  try {
    if (!elementId) {
      console.warn("No element ID provided");
      return null;
    }

    // Try numeric ID first
    let q = query(collection(db, "Products"), where("id", "==", elementId));
    let querySnapshot = await getDocs(q);

    // If not found and elementId is a string that can be converted to number, try numeric version
    if (
      querySnapshot.empty &&
      typeof elementId === "string" &&
      !isNaN(elementId)
    ) {
      const numericId = parseInt(elementId);
      q = query(collection(db, "Products"), where("id", "==", numericId));
      querySnapshot = await getDocs(q);
    }

    // If still not found and elementId is a number, try string version
    if (querySnapshot.empty && typeof elementId === "number") {
      const stringId = elementId.toString();
      q = query(collection(db, "Products"), where("id", "==", stringId));
      querySnapshot = await getDocs(q);
    }

    if (querySnapshot.empty) {
      console.warn(`No product found with id: ${elementId}`);
      return null;
    }

    // Return the first matching document
    const doc = querySnapshot.docs[0];
    const productData = { firebaseId: doc.id, ...doc.data() };
    console.log(`Found product for cart:`, productData);

    return productData;
  } catch (error) {
    console.error("Error finding cart items:", error);
    return null;
  }
};

// Find product by slug
export const findProductBySlug = async (slug) => {
  try {
    const q = query(collection(db, "Products"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn(`No product found with slug: ${slug}`);
      return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("Error finding product by slug:", error);
    return null;
  }
};

// Get all products
export const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Products"));
    const products = [];

    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return products;
  } catch (error) {
    console.error("Error getting all products:", error);
    return [];
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, "Products"),
      where("category", "==", category)
    );
    const querySnapshot = await getDocs(q);
    const products = [];

    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return products;
  } catch (error) {
    console.error("Error getting products by category:", error);
    return [];
  }
};

// Get trending products
export const getTrendingProducts = async () => {
  try {
    const q = query(collection(db, "Products"), where("trending", "!=", null));
    const querySnapshot = await getDocs(q);
    const products = [];

    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    // Sort by trending number
    return products.sort((a, b) => {
      const aNum = parseInt(a.trending.replace("#", ""));
      const bNum = parseInt(b.trending.replace("#", ""));
      return aNum - bNum;
    });
  } catch (error) {
    console.error("Error getting trending products:", error);
    return [];
  }
};
