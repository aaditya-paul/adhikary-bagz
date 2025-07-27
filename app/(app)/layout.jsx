import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "../globals.css";
import { ClientLayout, Navbar, Footer } from "@/components/layout";

export const metadata = {
  title: "NÓMADA",
  description: "Sign in or sign up to NÓMADA luxury handbags",
};

export default function AuthLayout({ children }) {
  return <Navbar>{children}</Navbar>;
}
