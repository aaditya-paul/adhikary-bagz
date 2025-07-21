"use client";
import React, { createContext, useContext } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

export const UserContext = createContext(null);
export const useUserContext = () => useContext(UserContext);

const UserContextProvider = ({ children }) => {
  // Use custom authentication hook
  const {
    isLoggedin,
    setIsLoggedin,
    user,
    setUser,
    isLoading,
    setIsLoading,
  } = useAuth();

  // Use custom cart hook
  const {
    cartProducts,
    setCartProducts,
    cartProductsDetails,
    setCartProductsDetails,
    isCartProductsDetailsLoading,
    setIsCartProductsDetailsLoading,
  } = useCart(user);

  return (
    <UserContext.Provider
      value={{
        isLoggedin,
        setIsLoggedin,
        user,
        setUser,
        isLoading,
        setIsLoading,
        cartProducts,
        setCartProducts,
        cartProductsDetails,
        setCartProductsDetails,
        isCartProductsDetailsLoading,
        setIsCartProductsDetailsLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
