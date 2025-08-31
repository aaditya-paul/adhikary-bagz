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

// Fetch user's order IDs from user document
export const getUserOrders = async (userId) => {
  try {
    if (!userId) {
      console.warn("No user ID provided");
      return { success: false, error: "User ID is required" };
    }

    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.warn(`User document not found for ID: ${userId}`);
      return { success: false, error: "User not found" };
    }

    const userData = userDoc.data();
    const orders = userData.orders || [];

    console.log("User orders found:", orders);
    return { success: true, orders };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return { success: false, error: error.message };
  }
};

// Fetch order details by order ID
export const getOrderDetails = async (orderId) => {
  try {
    if (!orderId) {
      console.warn("No order ID provided");
      return { success: false, error: "Order ID is required" };
    }

    const orderDocRef = doc(db, "Orders", orderId);
    const orderDoc = await getDoc(orderDocRef);

    if (!orderDoc.exists()) {
      console.warn(`Order document not found for ID: ${orderId}`);
      return { success: false, error: "Order not found" };
    }

    const orderData = orderDoc.data();
    console.log("Order details found:", orderData);
    return { success: true, order: { id: orderId, ...orderData } };
  } catch (error) {
    console.error("Error fetching order details:", error);
    return { success: false, error: error.message };
  }
};

// Fetch multiple order details by order IDs
export const getMultipleOrderDetails = async (orderIds) => {
  try {
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      console.warn("No order IDs provided or invalid format");
      return { success: true, orders: [] };
    }

    const orderPromises = orderIds.map((orderId) => getOrderDetails(orderId));
    const orderResults = await Promise.all(orderPromises);

    console.log("Order promises: ", orderResults);

    const orders = [];
    const errors = [];

    orderResults.forEach((result, index) => {
      if (result.success) {
        orders.push(result.order);
      } else {
        errors.push({ orderId: orderIds[index], error: result.error });
      }
    });

    console.log("Fetched orders:", orders);
    if (errors.length > 0) {
      console.warn("Some orders failed to fetch:", errors);
    }

    return { success: true, orders, errors };
  } catch (error) {
    console.error("Error fetching multiple order details:", error);
    return { success: false, error: error.message };
  }
};
