import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { mockTrips } from '../data';
import { Plane, Calendar, MapPin, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full p-6 md:p-12 overflow-y-auto">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 font-medium text-sm mb-6 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
          >
            <Sparkles className="w-4 h-4" />
            Your Travel Dashboard
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40 mb-4"
          >
            Explore the World
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg md:text-xl font-light"
          >
            Manage your upcoming journeys, track budgets, and organize your itineraries in one seamless spatial interface.
          </motion.p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(99, 102, 241, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          className="shrink-0 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-3 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <Plane className="w-5 h-5" />
          Plan New Trip
        </motion.button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-container pb-12">
        {mockTrips.map((trip, idx) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 40, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.8, type: "spring", bounce: 0.4 }}
            onClick={() => navigate(`/trip/${trip.id}`)}
            className="group relative h-[420px] rounded-[2rem] overflow-hidden cursor-pointer card-3d-hover bg-[#1a1d24]"
          >
            {/* Background Image with Parallax feel */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
              style={{ backgroundImage: `url(${trip.imageUrl})` }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/50 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
            
            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
              <div className="transform transition-all duration-500 translate-y-6 group-hover:translate-y-0">
                <div className="flex items-center gap-2 text-indigo-400 mb-3 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase tracking-widest">{trip.destination}</span>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">{trip.title}</h2>
                
                <div className="flex items-center gap-3 text-gray-300 text-sm font-medium">
                  <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(trip.startDate), 'MMM d')}
                  </div>
                  <span className="text-gray-500">→</span>
                  <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md">
                    {format(new Date(trip.endDate), 'MMM d')}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full glass-panel backdrop-blur-md border border-white/20 text-xs font-bold tracking-wider text-white uppercase shadow-xl z-10">
              {trip.status}
            </div>
            
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 border-2 border-indigo-500/0 group-hover:border-indigo-500/50 rounded-[2rem] transition-colors duration-500 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}