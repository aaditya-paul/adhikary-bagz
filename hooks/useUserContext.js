"use client";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

/**
 * Custom hook to use the User Context with better error handling
 * @returns {Object} - User context values
 */
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }

  return context;
};

/**
 * Custom hook specifically for authentication state
 * @returns {Object} - Authentication related values
 */
export const useAuthState = () => {
  const { isLoggedin, user, isLoading, setIsLoggedin, setUser } = useUser();

  return {
    isLoggedin,
    user,
    isLoading,
    setIsLoggedin,
    setUser,
    isAuthenticated: isLoggedin && user,
  };
};

/**
 * Custom hook specifically for cart state
 * @returns {Object} - Cart related values
 */
export const useCartState = () => {
  const {
    cartProducts,
    setCartProducts,
    cartProductsDetails,
    setCartProductsDetails,
    isCartProductsDetailsLoading,
    setIsCartProductsDetailsLoading,
  } = useUser();

  return {
    cartProducts,
    setCartProducts,
    cartProductsDetails,
    setCartProductsDetails,
    isCartProductsDetailsLoading,
    setIsCartProductsDetailsLoading,
    hasItems: cartProductsDetails.length > 0,
    itemCount: cartProductsDetails.length,
  };
};
