import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "../globals.css";

export const metadata = {
  title: "Adhikary Bagz - Authentication",
  description: "Sign in or sign up to Adhikary Bagz luxury handbags",
};

export default function AuthLayout({ children }) {
  return (
    <section>
      {/* Auth pages have no navbar or footer for clean authentication experience */}
      {children}
    </section>
  );
}
