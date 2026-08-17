import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header.jsx';
import { getPageTitle } from './navigation.js';
import Sidebar from './Sidebar.jsx';

function AppLayout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsMobileSidebarOpen(false);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-teal-500/30 selection:text-teal-200">
      {/* Background Glow Accents */}
      <div className="bg-ambient-glow top-0 right-1/4 h-[500px] w-[500px] bg-teal-500/10" />
      <div className="bg-ambient-glow bottom-0 left-1/3 h-[600px] w-[600px] bg-indigo-600/10" />

      {/* Desktop Fixed Sidebar */}
      <div className="hidden h-full shrink-0 lg:block z-30">
        <Sidebar
          collapsed={isCollapsed}
          onToggle={() => setIsCollapsed((collapsed) => !collapsed)}
        />
      </div>

      {/* Mobile Overlay Sidebar Drawer */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute inset-0 w-full bg-slate-950/80 backdrop-blur-sm"
              aria-label="Close navigation"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative h-full w-72 shadow-2xl z-10"
            >
              <Sidebar mobile onClose={() => setIsMobileSidebarOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Right Column (Header + Scrollable Main Content) */}
      <div className="relative z-10 flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          title={getPageTitle(location.pathname)}
          onOpenSidebar={() => setIsMobileSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mx-auto max-w-7xl"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
