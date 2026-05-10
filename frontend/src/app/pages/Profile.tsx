import { motion } from "motion/react";
import { Edit3 } from "lucide-react";

const Profile = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8 py-4 pb-12"
    >
      <div className="bg-white/80 dark:bg-white/10 backdrop-blur-2xl border border-slate-200 dark:border-white/20 p-8 md:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-indigo-100 dark:border-indigo-500/50 flex-shrink-0 shadow-2xl relative z-10">
          <img src="https://images.unsplash.com/photo-1664871475935-39a9b861514f?q=80&w=400" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 text-center md:text-left relative z-10">
          <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2">Alex Traveler</h1>
          <p className="text-slate-500 dark:text-white/60 mb-8 font-medium text-lg">alex.travels@example.com • +1 234 567 890</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 p-5 rounded-2xl text-center shadow-sm">
              <h4 className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">12</h4>
              <p className="text-xs text-slate-500 dark:text-white/60 font-bold uppercase tracking-widest">Trips</p>
            </div>
            <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 p-5 rounded-2xl text-center shadow-sm">
              <h4 className="text-3xl font-black text-purple-600 dark:text-purple-400 mb-1">8</h4>
              <p className="text-xs text-slate-500 dark:text-white/60 font-bold uppercase tracking-widest">Countries</p>
            </div>
          </div>
        </div>
        <button className="md:absolute top-8 right-8 bg-indigo-50 dark:bg-white/10 border border-indigo-100 dark:border-white/20 px-6 py-3 rounded-xl text-indigo-700 dark:text-white hover:bg-indigo-100 dark:hover:bg-white/20 transition-all font-bold flex items-center gap-2 shadow-sm">
          <Edit3 className="w-4 h-4" /> Edit Profile
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Preplanned Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Mountain Retreat", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400" },
            { title: "Coastal Drive", img: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=400" },
            { title: "Desert Safari", img: "https://images.unsplash.com/photo-1547234935-80c7145ec969?q=80&w=400" }
          ].map((trip, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }}
              className="h-56 bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-end relative overflow-hidden group cursor-pointer shadow-lg"
            >
              <img src={trip.img} alt={trip.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-80 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
              <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform">
                <h4 className="text-xl font-bold text-white mb-2">{trip.title}</h4>
                <button className="text-sm bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white font-semibold hover:bg-white/30 transition-colors opacity-0 group-hover:opacity-100">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
