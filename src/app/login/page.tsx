'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '../../store/useStore';
import { Mail, Lock, User, Sparkles, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  
  const { login, sessionToken, syncWishlist } = useStore();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect
  useEffect(() => {
    if (sessionToken) {
      router.push(redirectPath);
    }
  }, [sessionToken, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeTab === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Invalid email or password.');
        }

        // Save in state
        login(data.user, data.token);
        
        // Sync wishlist immediately
        setTimeout(() => {
          syncWishlist();
        }, 100);

        router.push(redirectPath);
      } else {
        // Register
        if (!name) throw new Error('Name is required.');
        
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Registration failed.');
        }

        // Auto-login after successful registration
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();
        
        if (loginData.success) {
          login(loginData.user, loginData.token);
          setTimeout(() => {
            syncWishlist();
          }, 100);
          router.push(redirectPath);
        } else {
          setActiveTab('login');
          setError('Account created! Please log in.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 bg-gradient-to-b from-[#fafafa] via-[#fafafa] to-purple-50/20 dark:from-[#05060b] dark:via-[#090b11] dark:to-[#040508] transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-slate-800/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
        
        {/* Glow decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="relative space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 py-1 px-3 bg-purple-500/10 border border-purple-500/25 rounded-full text-purple-650 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shopora Accounts</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeTab === 'login' 
                ? 'Sign in to access your wishlist, cart, and orders.' 
                : 'Get started and access premium shopping benefits.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/5 dark:border-white/5">
            <button
              onClick={() => { setActiveTab('login'); setError(null); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition duration-300 ${
                activeTab === 'login'
                  ? 'bg-white dark:bg-[#121320] text-purple-650 dark:text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('register'); setError(null); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition duration-300 ${
                activeTab === 'register'
                  ? 'bg-white dark:bg-[#121320] text-purple-650 dark:text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-500 text-xs leading-relaxed animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-gray-500 transition duration-300"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-gray-500 transition duration-300"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                {activeTab === 'login' && (
                  <a href="#" className="text-[10px] text-purple-650 dark:text-purple-400 hover:underline">
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-11 pr-11 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-slate-900 dark:text-slate-100 placeholder-slate-405 dark:placeholder-gray-500 transition duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-450 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-2xl bg-purple-650 dark:bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 dark:hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-650/20 dark:shadow-purple-600/30 active:scale-[0.98] transition-all duration-350 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span>{activeTab === 'login' ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Switch tab text link */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setActiveTab(activeTab === 'login' ? 'register' : 'login');
                setError(null);
              }}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-purple-650 dark:hover:text-purple-400 hover:underline transition"
            >
              {activeTab === 'login' 
                ? "Don't have an account? Sign Up" 
                : 'Already have an account? Sign In'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-[#fafafa] to-purple-50/20 dark:from-[#05060b] dark:to-[#040508]">
        <Loader2 className="w-10 h-10 animate-spin text-purple-655" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
