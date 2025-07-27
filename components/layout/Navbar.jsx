"use client";
import Link from "next/link";
import React, { useContext, useState } from "react";
import Logo from "./Logo";
import { icons } from "@/constant";
import Icon from "../ui/icon";
import { UserContext } from "@/context/UserContext";

const Navbar = ({ children }) => {
  const { isLoggedin } = useContext(UserContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  console.log("isLoggedin:", isLoggedin);

  const pages = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="font-babas-neue fixed top-0 left-0 right-0 bg-white shadow-sm z-[100] hidden lg:grid lg:grid-cols-3 items-center px-20">
        <ul className="flex justify-start items-center gap-4 p-4 text-xl">
          {pages.map((route, index) => (
            <li key={index}>
              <Link
                href={route.href}
                className="hover:text-gray-600 transition-colors"
              >
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex justify-center">
          <Link href="/">
            <Logo className="text-3xl cursor-pointer hover:text-gray-600 transition-colors" />
          </Link>
        </div>
        <ul className="flex justify-end items-center gap-2 p-4 text-xl">
          <li>
            <button className="cursor-pointer p-2 flex justify-center items-center hover:bg-gray-100 rounded-full transition-colors">
              <Icon source={icons.search} />
            </button>
          </li>
          {isLoggedin ? (
            <>
              <li>
                <Link
                  className="cursor-pointer flex justify-center items-center p-2 hover:bg-gray-100 rounded-full transition-colors"
                  href="/cart"
                >
                  <Icon source={icons.cart} />
                </Link>
              </li>
              <li>
                <Link
                  className="cursor-pointer p-2 flex justify-center items-center hover:bg-gray-100 rounded-full transition-colors"
                  href="/profile"
                >
                  <Icon source={icons.user} />
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  className="cursor-pointer px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  href="/signin"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  className="cursor-pointer px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  href="/signup"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Mobile Navbar */}
      <nav className="font-babas-neue fixed top-0 left-0 right-0 bg-white shadow-sm z-[100] lg:hidden">
        <div className="flex justify-between items-center px-4 py-3">
          {/* Brand Logo */}
          <Link href="/" onClick={closeMobileMenu}>
            <Logo className="text-2xl cursor-pointer hover:text-gray-600 transition-colors" />
          </Link>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-1" : ""
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-gray-600 mt-1 transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-gray-600 mt-1 transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={closeMobileMenu}
          ></div>
        )}

        {/* Mobile Menu Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-8">
              <Link href="/" onClick={closeMobileMenu}>
                <Logo className="text-2xl cursor-pointer" />
              </Link>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <div className="w-6 h-6 flex justify-center items-center">
                  <span className="block w-5 h-0.5 bg-gray-600 rotate-45 absolute"></span>
                  <span className="block w-5 h-0.5 bg-gray-600 -rotate-45 absolute"></span>
                </div>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="space-y-6 mb-8">
              {pages.map((route, index) => (
                <Link
                  key={index}
                  href={route.href}
                  onClick={closeMobileMenu}
                  className="block text-xl font-medium text-gray-900 hover:text-gray-600 transition-colors py-2"
                >
                  {route.name}
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 border-t pt-6">
              {/* Search Button */}
              <button
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg font-medium text-gray-900">
                  Search
                </span>
                <Icon source={icons.search} />
              </button>

              {isLoggedin ? (
                <>
                  {/* Cart Button */}
                  <Link
                    href="/cart"
                    onClick={closeMobileMenu}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-900">
                      Cart
                    </span>
                    <Icon source={icons.cart} />
                  </Link>

                  {/* Profile Button */}
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <Logo className="text-lg mr-3" />
                      <span className="text-lg font-medium text-gray-900">
                        Profile
                      </span>
                    </div>
                    <Icon source={icons.user} />
                  </Link>
                </>
              ) : (
                <>
                  {/* Sign In Button */}
                  <Link
                    href="/signin"
                    onClick={closeMobileMenu}
                    className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-900">
                      Sign In
                    </span>
                  </Link>

                  {/* Sign Up Button */}
                  <Link
                    href="/signup"
                    onClick={closeMobileMenu}
                    className="w-full flex items-center justify-center p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-lg font-medium">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="mt-16">{children}</main>
    </>
  );
};

export default Navbar;
