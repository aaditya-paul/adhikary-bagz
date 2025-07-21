"use client";
import { useState, useEffect } from "react";
import { processCartItems } from "@/lib/utils/cartUtils";

export const useCart = (user) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [cartProductsDetails, setCartProductsDetails] = useState([]);
  const [isCartProductsDetailsLoading, setIsCartProductsDetailsLoading] =
    useState(true);

  // Extract cart products from user data
  useEffect(() => {
    if (user?.cart) {
      setCartProducts(user.cart);
    } else {
      setCartProducts([]);
    }
  }, [user]);

  // Load cart product details
  useEffect(() => {
    const loadCartProductDetails = async () => {
      if (!user) {
        console.log("User not logged in, clearing cart");
        setCartProductsDetails([]);
        setIsCartProductsDetailsLoading(false);
        return;
      }

      setIsCartProductsDetailsLoading(true);

      if (!cartProducts || cartProducts.length === 0) {
        console.log("User has empty cart");
        setCartProductsDetails([]);
        setIsCartProductsDetailsLoading(false);
        return;
      }

      try {
        const loadedProducts = await processCartItems(cartProducts);
        setCartProductsDetails(loadedProducts);
      } catch (error) {
        console.error("Error loading cart product details:", error);
        setCartProductsDetails([]);
      } finally {
        setIsCartProductsDetailsLoading(false);
      }
    };

    loadCartProductDetails();
  }, [cartProducts, user]);

  return {
    cartProducts,
    setCartProducts,
    cartProductsDetails,
    setCartProductsDetails,
    isCartProductsDetailsLoading,
    setIsCartProductsDetailsLoading,
  };
};
