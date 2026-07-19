'use client';

import { useStore } from '../store/useStore';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize HTML tag class on client mount
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/20 text-slate-800 dark:text-slate-200 transition-colors duration-300 focus:outline-none"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0, scale: theme === 'dark' ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 m-auto w-5 h-5 flex items-center justify-center pointer-events-none"
      >
        <Sun className="w-5 h-5 text-amber-500 fill-amber-500" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : -180, scale: theme === 'dark' ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="w-5 h-5 flex items-center justify-center"
      >
        <Moon className="w-5 h-5 text-indigo-400 fill-indigo-400" />
      </motion.div>
    </button>
  );
}
