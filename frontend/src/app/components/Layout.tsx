import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Map, PieChart, Settings, LogOut, Menu, X } from 'lucide-react';

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:bg-[#0f1115] overflow-hidden relative font-sans">
      {/* Background Orbs for 3D depth */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/30 dark:bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/30 dark:bg-purple-600/20 blur-[100px] pointer-events-none" />

      {/* Mobile Topbar */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-20 glass-panel-heavy z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Compass className="text-white w-5 h-5" />
          </div>
          <span className="text-gray-900 dark:text-white font-bold tracking-widest uppercase">Traveloop</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-900 dark:text-white p-2">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Floating Sidebar (Desktop) */}
      <motion.nav 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="hidden md:flex w-24 m-6 rounded-[2rem] glass-panel-heavy flex-col items-center py-8 z-20 relative"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-12 shadow-[0_0_30px_rgba(99,102,241,0.5)]">
          <Compass className="text-white w-7 h-7" />
        </div>

        <div className="flex-1 flex flex-col gap-6 w-full items-center">
          <NavItem to="/" icon={<Map className="w-6 h-6" />} />
        </div>

        <div className="flex flex-col gap-6 w-full items-center">
          <button className="p-4 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/10 transition-colors">
            <Settings className="w-6 h-6" />
          </button>
          <button className="p-4 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/10 transition-colors">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 z-40 bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-8"
          >
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Map className="w-8 h-8 text-indigo-500 dark:text-indigo-400" /> Dashboard
            </NavLink>
            <button className="text-2xl font-bold text-gray-600 dark:text-gray-400 flex items-center gap-3">
              <Settings className="w-8 h-8" /> Settings
            </button>
            <button className="text-2xl font-bold text-gray-600 dark:text-gray-400 flex items-center gap-3">
              <LogOut className="w-8 h-8" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 h-full pt-24 pb-6 px-6 md:pt-6 md:pr-6 md:pl-0 z-10 relative perspective-container">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, rotateX: 5 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full glass-panel rounded-[2rem] overflow-hidden relative shadow-2xl"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}

function NavItem({ to, icon }: { to: string, icon: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative p-4 rounded-2xl transition-all duration-300 group ${
          isActive
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div 
              layoutId="nav-indicator"
              className="absolute inset-0 bg-indigo-500/20 border border-indigo-500/50 rounded-2xl shadow-[inset_0_0_20px_rgba(99,102,241,0.2)]"
              initial={false}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <div className="relative z-10 group-hover:scale-110 transition-transform">
            {icon}
          </div>
        </>
      )}
    </NavLink>
  );
}