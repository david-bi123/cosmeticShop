'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/50 text-foreground backdrop-blur transition hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10"
    >
      <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </motion.span>
    </button>
  );
}
