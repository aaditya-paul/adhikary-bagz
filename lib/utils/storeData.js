"use server";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export const createNewUserData = async (userId, userData) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
      ...userData,
      cart: [],
      orders: [],
      cardDetails: null,
    });
    console.log("User data created successfully");
    return {
      ...userData,
      cart: [],
      orders: [],
      cardDetails: null,
    };
  } catch (error) {
    console.error("Error creating user data:", error);
    return null;
  }
};

// Add product to user's cart
export const addToCart = async (
  productId,
  productSlug,
  quantity,
  selectedSize,
  userId,
  userCart
) => {
  try {
    if (!userId) {
      return { success: false, error: "User must be logged in" };
    }

    if (!productId) {
      return { success: false, error: "Product ID is required" };
    }

    const userDocRef = doc(db, "users", userId);

    // Use cart data passed in to avoid serializing the full user object
    const cart = userCart || [];

    // Check if product already exists in cart with same size
    const existingCartItemIndex = cart.findIndex(
      (item) => item.id === productId && item.selectedSize === selectedSize
    );

    if (existingCartItemIndex > -1) {
      // Product exists with same size, update quantity
      const updatedCart = [...cart];
      updatedCart[existingCartItemIndex] = {
        ...updatedCart[existingCartItemIndex],
        quantity: updatedCart[existingCartItemIndex].quantity + (quantity || 1),
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(userDocRef, { cart: updatedCart });
      console.log("Product quantity updated in cart");
      return {
        success: true,
        updationType: "quantity",
        message: "Product quantity updated in cart",
        cart: updatedCart,
      };
    } else {
      // Product doesn't exist or different size, add new item
      const newCartItem = {
        id: productId,
        slug: productSlug,
        quantity: quantity || 1,
        selectedSize: selectedSize || null,
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(userDocRef, {
        cart: arrayUnion(newCartItem),
      });

      console.log("Product added to cart successfully");
      return {
        success: true,
        updationType: "newProduct",
        message: "Product added to cart successfully",
        cartItem: newCartItem,
      };
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: error.message };
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (productId, newQuantity, user) => {
  try {
    if (!user || !user.uid) {
      return { success: false, error: "User must be logged in" };
    }

    if (!productId) {
      return { success: false, error: "Product ID is required" };
    }

    if (newQuantity < 1) {
      return { success: false, error: "Quantity must be at least 1" };
    }

    const userDocRef = doc(db, "users", user.uid);

    // Use cart data from user context
    const cart = user.cart || [];

    const cartItemIndex = cart.findIndex((item) => item.id === productId);

    if (cartItemIndex === -1) {
      return { success: false, error: "Product not found in cart" };
    }

    const updatedCart = [...cart];
    updatedCart[cartItemIndex] = {
      ...updatedCart[cartItemIndex],
      quantity: newQuantity,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(userDocRef, { cart: updatedCart });

    console.log("Cart item quantity updated successfully");
    return {
      success: true,
      message: "Cart item quantity updated successfully",
      cart: updatedCart,
    };
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return { success: false, error: error.message };
  }
};

// Remove item from cart
export const removeFromCart = async (productId, user) => {
  try {
    if (!user || !user.uid) {
      return { success: false, error: "User must be logged in" };
    }

    if (!productId) {
      return { success: false, error: "Product ID is required" };
    }

    const userDocRef = doc(db, "users", user.uid);

    // Use cart data from user context
    const cart = user.cart || [];

    const updatedCart = cart.filter((item) => item.id !== productId);

    await updateDoc(userDocRef, { cart: updatedCart });

    console.log("Product removed from cart successfully");
    return {
      success: true,
      message: "Product removed from cart successfully",
      cart: updatedCart,
    };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, error: error.message };
  }
};

// Get user's cart
export const getUserCart = async (userId) => {
  try {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return { success: false, error: "User not found" };
    }

    const userData = userDoc.data();
    const cart = userData.cart || [];

    return {
      success: true,
      cart: cart,
      itemCount: cart.length,
      totalQuantity: cart.reduce((sum, item) => sum + item.quantity, 0),
    };
  } catch (error) {
    console.error("Error getting user cart:", error);
    return { success: false, error: error.message };
  }
};

// Update cart item quantity
export const updateCartQuantity = async (userId, productId, newQuantity) => {
  try {
    console.log(`updateCartQuantity called with:`, {
      userId,
      productId,
      newQuantity,
    });
    console.log(`userId type:`, typeof userId, `value:`, userId);

    if (!userId || userId === null || userId === undefined || userId === "") {
      console.error("Invalid userId received:", userId);
      return { success: false, error: "User ID is required" };
    }

    if (!productId) {
      return { success: false, error: "Product ID is required" };
    }

    if (newQuantity < 1) {
      return { success: false, error: "Quantity must be at least 1" };
    }

    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.log("User document not found for ID:", userId);
      return { success: false, error: "User document not found" };
    }

    const userData = userDoc.data();
    const cart = userData.cart || [];
    console.log("Current cart from database:", cart);

    // Find the cart item to update - try both numeric and string comparison
    let cartItemIndex = cart.findIndex((item) => item.id === productId);

    // If not found and productId is a number, try string comparison
    if (cartItemIndex === -1 && typeof productId === "number") {
      cartItemIndex = cart.findIndex(
        (item) => item.id === productId.toString()
      );
    }

    // If not found and productId is a string, try numeric comparison
    if (
      cartItemIndex === -1 &&
      typeof productId === "string" &&
      !isNaN(productId)
    ) {
      cartItemIndex = cart.findIndex((item) => item.id === parseInt(productId));
    }

    if (cartItemIndex === -1) {
      console.log(
        `Product not found in cart. Looking for ID: ${productId}, Cart items:`,
        cart.map((item) => ({ id: item.id, type: typeof item.id }))
      );
      return { success: false, error: "Product not found in cart" };
    }

    console.log(
      `Found cart item at index ${cartItemIndex}:`,
      cart[cartItemIndex]
    );

    // Update the quantity and timestamp
    cart[cartItemIndex] = {
      ...cart[cartItemIndex],
      quantity: newQuantity,
      updatedAt: new Date().toISOString(),
    };

    console.log(`Updated cart item:`, cart[cartItemIndex]);

    // Update the cart in Firestore
    await updateDoc(userDocRef, { cart });

    console.log(
      `Cart quantity updated for product ${productId}: ${newQuantity}`
    );
    return {
      success: true,
      message: "Cart quantity updated successfully",
      updatedItem: cart[cartItemIndex],
    };
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return { success: false, error: error.message };
  }
};

// Clear user's cart
export const clearCart = async (user) => {
  try {
    if (!user || !user.uid) {
      return { success: false, error: "User must be logged in" };
    }

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { cart: [] });

    console.log("Cart cleared successfully");
    return {
      success: true,
      message: "Cart cleared successfully",
    };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: error.message };
  }
};
