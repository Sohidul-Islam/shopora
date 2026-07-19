'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Heart, User, Search, LayoutDashboard } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Header() {
  const pathname = usePathname();
  const { cart, wishlist } = useStore();
  
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistItemsCount = wishlist?.length || 0;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-150 py-4 px-6 sm:px-12 flex items-center justify-between text-black">
      {/* Brand Logo */}
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-black tracking-tight text-black hover:opacity-85 transition">
          shopora
        </Link>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-8 relative">
        <div className="absolute left-3.5 text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-100 text-sm text-gray-800 pl-10 pr-4 py-2.5 rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-black transition"
        />
      </div>

      {/* Navigation Links */}
      <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-500">
        <Link 
          href="/" 
          className={`transition duration-300 hover:text-black ${pathname === '/' ? 'text-black font-semibold' : ''}`}
        >
          Home
        </Link>
        <Link 
          href="/about" 
          className={`transition duration-300 hover:text-black ${pathname === '/about' ? 'text-black font-semibold' : ''}`}
        >
          About
        </Link>
        <Link 
          href="/contact" 
          className={`transition duration-300 hover:text-black ${pathname === '/contact' ? 'text-black font-semibold' : ''}`}
        >
          Contact Us
        </Link>
        <Link 
          href="/blog" 
          className={`transition duration-300 hover:text-black ${pathname === '/blog' ? 'text-black font-semibold' : ''}`}
        >
          Blog
        </Link>
      </nav>

      {/* Action Icons */}
      <div className="flex items-center space-x-6">
        <Link href="/admin" className="text-gray-600 hover:text-black transition" title="Admin Dashboard">
          <LayoutDashboard className="w-5 h-5" />
        </Link>

        <Link href="/wishlist" className="relative text-gray-600 hover:text-black transition" title="Wishlist">
          <Heart className="w-5 h-5" />
          {wishlistItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold text-white">
              {wishlistItemsCount}
            </span>
          )}
        </Link>

        <Link href="/cart" className="relative text-gray-600 hover:text-black transition" title="Cart">
          <ShoppingCart className="w-5 h-5" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold text-white">
              {cartItemsCount}
            </span>
          )}
        </Link>

        <Link href="/profile" className="text-gray-600 hover:text-black transition" title="Profile">
          <User className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}
