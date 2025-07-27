"use client";
import Link from "next/link";
import React, { useContext } from "react";
import Logo from "./Logo";
import { icons } from "@/constant";
import Icon from "../ui/icon";
import { UserContext } from "@/context/UserContext";

const Navbar = ({ children }) => {
  const { isLoggedin } = useContext(UserContext);
  console.log("isLoggedin:", isLoggedin);
  const pages = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  return (
    <>
      <nav className="font-babas-neue fixed top-0 left-0 right-0 bg-white shadow-sm z-[100] grid grid-cols-3 items-center px-20">
        <ul className="flex justify-start items-center gap-4 p-4 text-xl">
          {pages.map((route, index) => (
            <li key={index}>
              <Link href={route.href}>{route.name}</Link>
            </li>
          ))}
        </ul>
        <div className="flex justify-center">
          <Logo className="text-3xl" />
        </div>
        <ul className="flex justify-end items-center gap-4 p-4 text-xl">
          <li>
            <button className="cursor-pointer p-0 flex justify-center items-center">
              <Icon source={icons.search} />
            </button>
          </li>
          {isLoggedin ? (
            <>
              <li>
                <Link
                  className="cursor-pointer flex justify-center items-center"
                  href="/cart"
                >
                  <Icon source={icons.cart} />
                </Link>
              </li>

              <li>
                <Link
                  className="cursor-pointer p-0 flex justify-center items-center"
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
                  className="cursor-pointer p-0 flex justify-center items-center"
                  href="/signin"
                >
                  <span>Signin</span>
                </Link>
              </li>
              <li>
                <Link
                  className="cursor-pointer p-0 flex justify-center items-center"
                  href="/signup"
                >
                  <span>Signup</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <main className="mt-16 ">{children}</main>
    </>
  );
};

export default Navbar;
