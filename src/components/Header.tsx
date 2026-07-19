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
    <header className="sticky top-0 z-50 bg-[#05060b]/75 backdrop-blur-md border-b border-white/5 py-4 px-6 sm:px-12 flex items-center justify-between text-slate-200">
      {/* Brand Logo */}
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-black tracking-tight text-white hover:text-purple-400 transition duration-300">
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
          placeholder="Search items, brands, categories..."
          className="w-full bg-white/5 text-sm text-slate-100 pl-10 pr-4 py-2.5 rounded-xl border border-white/10 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition duration-300"
        />
      </div>

      {/* Navigation Links */}
      <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-gray-400">
        <Link 
          href="/" 
          className={`transition duration-300 hover:text-white ${pathname === '/' ? 'text-white font-bold' : ''}`}
        >
          Home
        </Link>
        <Link 
          href="/about" 
          className={`transition duration-300 hover:text-white ${pathname === '/about' ? 'text-white font-bold' : ''}`}
        >
          About
        </Link>
        <Link 
          href="/contact" 
          className={`transition duration-300 hover:text-white ${pathname === '/contact' ? 'text-white font-bold' : ''}`}
        >
          Contact Us
        </Link>
        <Link 
          href="/blog" 
          className={`transition duration-300 hover:text-white ${pathname === '/blog' ? 'text-white font-bold' : ''}`}
        >
          Blog
        </Link>
      </nav>

      {/* Action Icons */}
      <div className="flex items-center space-x-6">
        <Link href="/admin" className="text-gray-400 hover:text-white transition duration-300" title="Admin Dashboard">
          <LayoutDashboard className="w-5 h-5" />
        </Link>

        <Link href="/wishlist" className="relative text-gray-400 hover:text-white transition duration-300" title="Wishlist">
          <Heart className="w-5 h-5" />
          {wishlistItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-purple-600 px-1 text-[9px] font-bold text-white shadow-lg shadow-purple-600/50">
              {wishlistItemsCount}
            </span>
          )}
        </Link>

        <Link href="/cart" className="relative text-gray-400 hover:text-white transition duration-300" title="Cart">
          <ShoppingCart className="w-5 h-5" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-purple-600 px-1 text-[9px] font-bold text-white shadow-lg shadow-purple-600/50">
              {cartItemsCount}
            </span>
          )}
        </Link>

        <Link href="/profile" className="text-gray-400 hover:text-white transition duration-300" title="Profile">
          <User className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}
