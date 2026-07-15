'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ShoppingCart, Heart, User, LayoutDashboard } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Header() {
  const pathname = usePathname();
  const { cart } = useStore();
  
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="glass-header sticky top-0 z-50 py-3.5 px-6 sm:px-12 flex items-center justify-between border-b border-slate-900/60 shadow-lg shadow-black/5">
      <div className="flex items-center space-x-8">
        <Link href="/" className="flex items-center space-x-2 group">
          <Sparkles className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition duration-300" />
          <span className="text-xl font-extrabold font-display tracking-tight text-white group-hover:text-blue-400 transition">
            SHOPORA
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-xs uppercase tracking-widest font-bold">
          <Link 
            href="/products" 
            className={`transition duration-300 ${pathname === '/products' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
          >
            Catalogue
          </Link>
          <Link 
            href="/products?category=electronics" 
            className={`transition duration-300 ${pathname.includes('electronics') ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
          >
            Electronics
          </Link>
          <Link 
            href="/products?category=footwear" 
            className={`transition duration-300 ${pathname.includes('footwear') ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
          >
            Footwear
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-3.5">
        <Link 
          href="/admin" 
          className="hidden sm:flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition py-1.5 px-3 bg-amber-500/5 border border-amber-500/20 rounded-xl"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Admin</span>
        </Link>

        <Link 
          href="/cart" 
          className="relative p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-350 hover:text-white hover:border-slate-700 transition flex items-center space-x-2 text-xs font-bold"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Cart</span>
          {cartItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-black text-white ring-2 ring-slate-950 animate-bounce">
              {cartItemsCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
