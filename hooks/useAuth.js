"use client";
import { useState, useEffect } from "react";
import { CheckUserLoggedIn } from "@/lib/utils/authentication";

export const useAuth = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const result = await CheckUserLoggedIn();
        setIsLoggedin(result.isLoggedin);
        setUser(result.user);
      } catch (error) {
        console.error("Error checking user login status:", error);
        setIsLoggedin(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return {
    isLoggedin,
    setIsLoggedin,
    user,
    setUser,
    isLoading,
    setIsLoading,
  };
};
