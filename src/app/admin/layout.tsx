'use client';

import { useStore } from '../../store/useStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShieldAlert, ArrowLeft, Key } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, sessionToken } = useStore();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!sessionToken || !user) {
      setAuthorized(false);
    } else {
      const roleName = typeof user.role === 'object' ? (user.role as any)?.name : user.role;
      if (roleName !== 'Admin' && roleName !== 'Manager') {
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
    }
  }, [user, sessionToken]);

  if (authorized === null) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-[#fafafa] to-purple-50/20 dark:from-[#05060b] dark:to-[#040508]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gradient-to-b from-[#fafafa] via-[#fafafa] to-purple-50/20 dark:from-[#05060b] dark:via-[#090b11] dark:to-[#040508]">
        <div className="max-w-md w-full bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-slate-800/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl transition-colors duration-300">
          <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center animate-pulse">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Access Restricted
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              You do not have the required permissions to view the administration panel. Admin or Manager role is required.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-black/10 dark:border-white/10 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back Home</span>
            </Link>
            <Link
              href="/login?redirect=/admin"
              className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-purple-650 dark:bg-purple-600 text-sm font-semibold text-white hover:bg-purple-700 dark:hover:bg-purple-500 transition duration-300 shadow-lg shadow-purple-650/25 dark:shadow-purple-600/30"
            >
              <Key className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
