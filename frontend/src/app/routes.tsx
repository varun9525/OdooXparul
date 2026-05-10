import { createBrowserRouter, Outlet, useNavigate, useLocation, Navigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Home, Map, Users, Settings, LogOut, Search, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TripCreate from "./pages/TripCreate";
import TripsListing from "./pages/TripsListing";
import TripDetails from "./pages/TripDetails";
import Profile from "./pages/Profile";
import SearchPage from "./pages/SearchPage";
import Community from "./pages/Community";
import AdminPanel from "./pages/AdminPanel";
import Invoice from "./pages/Invoice";
import ShareView from "./pages/ShareView";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Prevent admin from accessing standard user trip-planning pages
  if (user?.email === 'admin@traveloop.com') {
    const isTripPage = location.pathname === '/' || location.pathname.startsWith('/trip');
    if (isTripPage) {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
};

// Admin Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user is the admin
  if (user?.email !== 'admin@traveloop.com') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const GlassSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  let navItems;

  if (user?.email === 'admin@traveloop.com') {
    // Admin only sees Analytics (and maybe Community if they want to monitor it)
    navItems = [
      { icon: LayoutDashboard, label: "Analytics Overview", path: "/admin" },
    ];
  } else {
    // Regular users see standard trip planning tools
    navItems = [
      { icon: Home, label: "Home", path: "/" },
      { icon: Map, label: "My Trips", path: "/trips" },
      { icon: Search, label: "Explore", path: "/search" },
      { icon: Users, label: "Community", path: "/community" },
    ];
  }

  return (
    <div className="w-20 md:w-64 h-full bg-white/50 dark:bg-white/5 backdrop-blur-2xl border-r border-slate-200 dark:border-white/10 flex flex-col justify-between py-8 transition-all duration-300 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.1)] dark:shadow-[4px_0_24px_-10px_rgba(0,0,0,0.5)] z-20">
      <div>
        <div className="flex items-center justify-center md:justify-start md:px-8 mb-12 cursor-pointer group" onClick={() => navigate("/")}>
          <motion.div 
            whileHover={{ rotate: 90 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/30"
          >
            <Compass className="text-white w-6 h-6 md:w-8 md:h-8" />
          </motion.div>
          <span className="hidden md:block ml-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-white dark:to-white/70 tracking-wide">
            Traveloop
          </span>
        </div>

        <nav className="flex flex-col gap-4 px-4 md:px-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-4 p-3 md:px-4 rounded-xl transition-all duration-300 relative group overflow-hidden ${
                  isActive ? "bg-indigo-50 dark:bg-white/10 shadow-inner border border-indigo-100 dark:border-white/10" : "hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 z-0"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 z-10 transition-colors ${isActive ? "text-indigo-600 dark:text-indigo-300" : "text-slate-500 dark:text-white/60 group-hover:text-indigo-500 dark:group-hover:text-white"}`} />
                <span className={`hidden md:block z-10 font-medium transition-colors ${isActive ? "text-indigo-900 dark:text-white" : "text-slate-600 dark:text-white/60 group-hover:text-indigo-600 dark:group-hover:text-white"}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="px-4 md:px-6 flex flex-col gap-4">
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            className="flex items-center gap-4 p-3 md:px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-5 h-5 text-amber-400 group-hover:text-amber-300" />
                <span className="hidden md:block text-slate-600 dark:text-white/60 group-hover:text-amber-400 dark:group-hover:text-amber-300 font-medium">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600" />
                <span className="hidden md:block text-slate-600 group-hover:text-indigo-600 font-medium">Dark Mode</span>
              </>
            )}
          </button>
        )}
        
        <button onClick={() => navigate("/profile")} className="flex items-center gap-4 p-3 md:px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group">
          <Settings className="w-5 h-5 text-slate-500 dark:text-white/60 group-hover:text-indigo-500 dark:group-hover:text-white" />
          <span className="hidden md:block text-slate-600 dark:text-white/60 group-hover:text-indigo-600 dark:group-hover:text-white font-medium">Settings</span>
        </button>
        <button onClick={handleLogout} className="flex items-center gap-4 p-3 md:px-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group">
          <LogOut className="w-5 h-5 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300" />
          <span className="hidden md:block text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

const Layout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 transition-colors duration-500">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Light mode background */}
        <div className="absolute inset-0 dark:opacity-0 transition-opacity duration-1000">
           <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000" 
            alt="Light Background" 
            className="w-full h-full object-cover opacity-[0.15] mix-blend-multiply filter blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-slate-50/80 to-indigo-50/90" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_50%)]" />
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_50%)]" />
        </div>

        {/* Dark mode background */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-1000">
          <img 
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzc4MzU5Njk2fDA&ixlib=rb-4.1.0&q=80&w=2000" 
            alt="Dark Background" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-purple-900/60 to-slate-900/90 mix-blend-multiply" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(120,119,198,0.3),transparent_50%)]" />
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(74,222,128,0.15),transparent_50%)]" />
        </div>
      </div>

      <GlassSidebar />
      
      <main className="flex-1 relative z-10 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 perspective-1000 relative before:fixed before:inset-0 before:opacity-[0.25] dark:before:opacity-[0.15] before:bg-[url('https://images.unsplash.com/photo-1775625673959-ba5715130453?q=80&w=2000')] dark:before:bg-[url('https://images.unsplash.com/photo-1776262744214-826cc922ab5a?q=80&w=2000')] before:bg-cover before:bg-center before:mix-blend-soft-light dark:before:mix-blend-overlay before:pointer-events-none before:z-0">
          <div className="relative z-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/share/:id",
    element: <ShareView />,
  },
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "trips", element: <TripsListing /> },
      { path: "trip/create", element: <TripCreate /> },
      { path: "trips/:id", element: <TripDetails /> },
      { path: "profile", element: <Profile /> },
      { path: "search", element: <SearchPage /> },
      { path: "community", element: <Community /> },
      { path: "admin", element: <AdminRoute><AdminPanel /></AdminRoute> },
      { path: "invoice/:id", element: <Invoice /> },
    ],
  },
]);
