import React from "react";
import Link from "next/link";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="font-babas-neue bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Logo className="text-3xl text-white mb-6" />
            <p className="text-gray-400 leading-relaxed mb-6">
              Crafting timeless companions for the modern nomad's journey. 
              Where luxury meets wanderlust.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/category/handbags" className="text-gray-400 hover:text-white transition-colors duration-300">Handbags</Link></li>
              <li><Link href="/category/backpacks" className="text-gray-400 hover:text-white transition-colors duration-300">Backpacks</Link></li>
              <li><Link href="/category/crossbody" className="text-gray-400 hover:text-white transition-colors duration-300">Crossbody</Link></li>
              <li><Link href="/category/totes" className="text-gray-400 hover:text-white transition-colors duration-300">Totes</Link></li>
              <li><Link href="/category/clutches" className="text-gray-400 hover:text-white transition-colors duration-300">Clutches</Link></li>
              <li><Link href="/category/travel" className="text-gray-400 hover:text-white transition-colors duration-300">Travel</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</Link></li>
              <li><Link href="/heritage" className="text-gray-400 hover:text-white transition-colors duration-300">Heritage</Link></li>
              <li><Link href="/sustainability" className="text-gray-400 hover:text-white transition-colors duration-300">Sustainability</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors duration-300">Careers</Link></li>
              <li><Link href="/press" className="text-gray-400 hover:text-white transition-colors duration-300">Press</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>

          {/* Support & Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/customer-service" className="text-gray-400 hover:text-white transition-colors duration-300">Customer Service</Link></li>
              <li><Link href="/size-guide" className="text-gray-400 hover:text-white transition-colors duration-300">Size Guide</Link></li>
              <li><Link href="/care-instructions" className="text-gray-400 hover:text-white transition-colors duration-300">Care Instructions</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-white transition-colors duration-300">Shipping & Returns</Link></li>
              <li><Link href="/warranty" className="text-gray-400 hover:text-white transition-colors duration-300">Warranty</Link></li>
              <li><Link href="/store-locator" className="text-gray-400 hover:text-white transition-colors duration-300">Store Locator</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Stay Connected</h3>
              <p className="text-gray-400">Subscribe to receive exclusive offers and updates</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
              />
              <button className="px-6 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition-colors duration-300 font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-400">
            <div className="mb-4 md:mb-0">
              <p>&copy; {currentYear} NÓMADA. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap gap-6">
              <Link href="/privacy-policy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors duration-300">Terms of Service</Link>
              <Link href="/cookie-policy" className="hover:text-white transition-colors duration-300">Cookie Policy</Link>
              <Link href="/accessibility" className="hover:text-white transition-colors duration-300">Accessibility</Link>
              <Link href="/legal" className="hover:text-white transition-colors duration-300">Legal</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
