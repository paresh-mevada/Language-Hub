import { BookOpenCheck, ChevronLeft, Flame, LogOut, Sparkles, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../../context/authStore.js';
import { navigationItems } from './navigation.js';

function Sidebar({ collapsed, mobile = false, onClose, onToggle }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  const compact = collapsed && !mobile;

  return (
    <aside
      className={`relative flex h-full flex-col bg-slate-900/80 border-r border-slate-800/80 backdrop-blur-xl text-slate-100 transition-all duration-300 ${compact ? 'w-20' : 'w-64'
        }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-slate-800/80 px-4">
        <NavLink
          to="/dashboard"
          onClick={onClose}
          className="flex min-w-0 items-center gap-3 font-bold group"
        >
          <div className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <BookOpenCheck className="size-5" />
          </div>
          {!compact && (
            <div className="flex flex-col truncate">
              <span className="truncate text-base font-extrabold bg-gradient-to-r from-white via-slate-200 to-teal-200 bg-clip-text text-transparent">
                Language Hub
              </span>
              <span className="text-[10px] tracking-wider font-semibold uppercase text-teal-400">
                PRO LEARNING
              </span>
            </div>
          )}
        </NavLink>

        {mobile ? (
          <button
            type="button"
            onClick={onClose}
            className="ml-auto grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            className="ml-auto hidden size-8 place-items-center rounded-lg border border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition lg:grid"
            aria-label={compact ? 'Expand sidebar' : 'Collapse sidebar'}
            title={compact ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={`size-4 transition-transform duration-300 ${compact ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto p-3" aria-label="Main navigation">
        {navigationItems.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path} onClick={onClose} end={path === '/dashboard'}>
            {({ isActive }) => (
              <div
                title={compact ? label : undefined}
                className={`relative flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition-all duration-200 ${isActive
                  ? 'text-teal-950 font-bold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                  } ${compact ? 'justify-center px-0' : ''}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 shadow-md shadow-teal-500/25"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  <Icon className={`size-5 shrink-0 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  {!compact && <span>{label}</span>}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Streak / Pro Card (Only when expanded) */}
      {!compact && (
        <div className="mx-3 mb-3 rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 via-slate-900/80 to-slate-950 p-3.5 shadow-inner">
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-lg bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30">
              <Flame className="size-4 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                {user?.streakDays || 5} Day Streak!
              </p>
              <p className="text-[11px] text-slate-400">Keep it up today</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer / User & Logout */}
      <div className="border-t border-slate-800/80 p-3">
        <button
          type="button"
          onClick={handleLogout}
          title={compact ? 'Log out' : undefined}
          className={`flex h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm font-semibold text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400 ${compact ? 'justify-center px-0' : ''
            }`}
        >
          <LogOut className="size-5 shrink-0" />
          {!compact && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
