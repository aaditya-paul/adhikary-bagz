"use client";
import { CheckUserLoggedIn } from "@/lib/utils/authentication";
import { findCartItems } from "@/lib/utils/findData";
import React, {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export const UserContext = createContext(null);
export const useUserContext = () => useContext(UserContext);

const UserContextProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartProducts, setCartProducts] = useState([]);
  const [isCartProductsLoading, setIsCartProductsLoading] = useState(true);

  useEffect(() => {
    CheckUserLoggedIn()
      .then((result) => {
        setIsLoggedin(result.isLoggedin);
        setUser(result.user);
      })
      .catch((error) => {
        console.error("Error checking user login status:", error);
        setIsLoggedin(false);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const loadCartProducts = async () => {
      if (user != null) {
        setIsCartProductsLoading(true);
        const cart = user.cart || [];
        
        if (cart.length === 0) {
          console.log("User has empty cart");
          setCartProducts([]);
          setIsCartProductsLoading(false);
          return;
        }

        let loadedProducts = [];

        try {
          // Process all cart items sequentially
          for (const element of cart) {
            console.log("Processing cart item:", element);
            const product = await findCartItems(element.id);
            
            if (product) {
              loadedProducts.push({
                ...product,
                quantity: element.quantity,
                selectedSize: element.selectedSize,
                updatedAt: element.updatedAt,
                addedAt: element.addedAt,
              });
            } else {
              console.warn(`Product not found for ID: ${element.id}`);
              loadedProducts.push({ 
                id: element.id, 
                name: "Unknown Product",
                quantity: element.quantity || 1,
                selectedSize: element.selectedSize || "One Size",
                price: 0,
              });
            }
          }

          setCartProducts(loadedProducts);
          console.log("Loaded cart products:", loadedProducts);
        } catch (error) {
          console.error("Error loading cart products:", error);
          setCartProducts([]);
        } finally {
          setIsCartProductsLoading(false);
        }
      } else {
        // User is not logged in
        console.log("User not logged in, clearing cart");
        setCartProducts([]);
        setIsCartProductsLoading(false);
      }
    };

    loadCartProducts();
  }, [user]);

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
        isCartProductsLoading,
        setIsCartProductsLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
