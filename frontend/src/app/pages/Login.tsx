import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  // Welcome screen state
  const [showWelcome, setShowWelcome] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; avatar: string } | null>(null);

  // Check localStorage for a returning user's avatar
  const savedUser = (() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const u = JSON.parse(raw);
      return u;
    } catch { return null; }
  })();

  const showSavedAvatar = savedUser && email && savedUser.email?.toLowerCase() === email.toLowerCase() && savedUser.avatarUrl;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      
      // Show welcome screen with avatar
      const displayName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.username || "Traveler";
      const avatar = user?.avatarUrl || "";
      
      setLoggedInUser({ name: displayName, avatar });
      setShowWelcome(true);
      
      // Wait 2 seconds to show the avatar, then navigate
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000')] bg-cover bg-center relative overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(120,119,198,0.3),transparent_50%)]" />

      <AnimatePresence mode="wait">
        {showWelcome && loggedInUser ? (
          /* Welcome Screen with Avatar */
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="z-10 flex flex-col items-center gap-6 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="relative"
            >
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white/30 shadow-2xl shadow-indigo-500/50 ring-4 ring-indigo-500/30">
                {loggedInUser.avatar ? (
                  <img src={loggedInUser.avatar} alt={loggedInUser.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-5xl font-black text-white">
                    {loggedInUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-lg shadow-lg"
              >
                ✓
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl font-black text-white drop-shadow-lg">Welcome back!</h2>
              <p className="mt-2 text-xl font-semibold text-white/80">{loggedInUser.name}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-2 text-white/60"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">Loading your trips...</span>
            </motion.div>
          </motion.div>
        ) : (
          /* Login Form */
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl z-10 mx-4"
          >
            <div className="flex flex-col items-center mb-8">
              <motion.div 
                key={showSavedAvatar ? "avatar" : "default"}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg mb-4 overflow-hidden ring-4 ring-indigo-500/30"
              >
                {showSavedAvatar ? (
                  <img src={savedUser.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">✈️</span>
                  </div>
                )}
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {showSavedAvatar ? `Hi, ${savedUser.firstName || savedUser.username || "Traveler"}!` : "Welcome Back"}
              </h2>
              <p className="text-white/60">
                {showSavedAvatar ? "Enter your password to continue" : "Enter your details to access Traveloop"}
              </p>
            </div>

            {(localError || error) && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {localError || error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
                />
              </div>
              <div>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Logging in...</> : "Login"}
              </button>
            </form>

            <p className="text-center text-white/60 mt-6 text-sm">
              Don't have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">Register here</Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
