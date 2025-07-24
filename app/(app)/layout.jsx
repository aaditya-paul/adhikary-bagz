import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "../globals.css";
import ClientLayout from "@/components/ClientLayout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "NÓMADA",
  description: "Sign in or sign up to NÓMADA luxury handbags",
};

export default function AuthLayout({ children }) {
  return <Navbar>{children}</Navbar>;
}
