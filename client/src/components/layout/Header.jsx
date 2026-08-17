import { Bell, ChevronDown, Flame, LogOut, Menu, Moon, Sun, UserRound, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../context/authStore.js';
import { getStoredSettings, saveStoredSettings } from '../../utils/settingsStore.js';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'LH';
}

function Header({ title, onOpenSidebar }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Theme state
  const [settings, setSettings] = useState(getStoredSettings());

  const toggleTheme = () => {
    const currentTheme = settings.theme === 'light' ? 'dark' : 'light';
    const updated = saveStoredSettings({ ...settings, theme: currentTheme });
    setSettings(updated);
  };

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 px-4 backdrop-blur-md sm:px-6 transition-colors">
      {/* Left: Mobile Menu Trigger + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="grid size-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white lg:hidden transition"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>

        <h1 className="truncate text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right: Quick Stats, Theme Toggle, Notifications & User Dropdown */}
      <div className="flex items-center gap-2.5">
        {/* Quick Stats Pills */}
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Flame className="size-3.5 fill-current" />
            <span>{user?.streakDays || 5} Days</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-300">
            <Zap className="size-3.5 fill-current" />
            <span>Level {user?.level || 'Intermediate'}</span>
          </div>
        </div>

        {/* Light / Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="grid size-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white transition"
          aria-label="Toggle display theme"
          title={`Switch to ${settings.theme === 'light' ? 'Dark' : 'Light'} mode`}
        >
          {settings.theme === 'light' ? (
            <Sun className="size-4 text-amber-500" />
          ) : (
            <Moon className="size-4 text-teal-300" />
          )}
        </button>

        {/* Notifications Button & Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative grid size-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white transition"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-teal-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl text-slate-900 dark:text-slate-100"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Notifications</h4>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">2 New</span>
                </div>
                <div className="space-y-2">
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-800/60 p-3 text-xs border border-slate-200/60 dark:border-slate-700/50">
                    <p className="font-bold text-slate-900 dark:text-slate-100">Daily Target Complete! 🔥</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">You reached your 15-minute practice goal today.</p>
                  </div>
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-800/60 p-3 text-xs border border-slate-200/60 dark:border-slate-700/50">
                    <p className="font-bold text-slate-900 dark:text-slate-100">New Lesson Added ✨</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">"Mastering Past Tenses in English" is now live.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-10 items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 p-1.5 pr-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
            aria-expanded={isMenuOpen}
          >
            <div className="grid size-7 place-items-center rounded-lg bg-gradient-to-tr from-teal-500 to-emerald-400 text-xs font-black text-slate-950 shadow-sm">
              {getInitials(user?.name)}
            </div>
            <span className="hidden max-w-32 truncate text-xs font-bold text-slate-900 dark:text-slate-200 sm:block">
              {user?.name || 'Student'}
            </span>
            <ChevronDown className={`hidden size-3.5 text-slate-500 dark:text-slate-400 sm:block transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 z-50 w-52 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl"
              >
                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800/80 mb-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
                >
                  <UserRound className="size-4 text-teal-600 dark:text-teal-400" />
                  <span>Profile & Settings</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
                >
                  <LogOut className="size-4" />
                  <span>Log out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default Header;
