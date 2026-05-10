import { motion } from "motion/react";
import { Plus, MapPin, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const navigate = useNavigate();

  const regions = [
    { name: "Europe", img: "https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    { name: "Asia", img: "https://images.unsplash.com/photo-1561503972-839d0c56de17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    { name: "Americas", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    { name: "Africa", img: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" }, // specific africa image
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-8 pb-12 sunrise-section"
    >
      {/* Banner */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative h-64 md:h-96 rounded-3xl overflow-hidden group shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20 z-10 group-hover:from-black/50 transition-colors duration-500"/>
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200" 
          alt="Banner" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-end">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-7xl font-black text-white drop-shadow-2xl mb-6 tracking-tight"
          >
            Where to next?
          </motion.h1>
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl">
            <button onClick={() => navigate("/trip/create")} className="bg-indigo-600/90 dark:bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30 backdrop-blur-sm">
              <Plus className="w-5 h-5" /> Plan a Trip
            </button>
            <div className="bg-white/70 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 rounded-full px-6 py-4 flex items-center w-full shadow-lg">
              <input type="text" placeholder="Search destinations..." className="bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/60 w-full font-medium" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top Regional */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <MapPin className="text-indigo-500 dark:text-indigo-400" /> Top Regional Selections
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {regions.map((region, i) => (
            <motion.div 
              key={region.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative h-56 rounded-2xl overflow-hidden group cursor-pointer border border-slate-200 dark:border-white/10 shadow-lg"
            >
              <img src={region.img} alt={region.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-85 dark:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-1 translate-y-2 group-hover:translate-y-0 transition-transform">{region.name}</h3>
                <div className="h-1 w-8 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Previous Trips */}
      <section>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
          <Calendar className="text-purple-500 dark:text-purple-400" /> Previous Trips
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { img: "https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=200", title: "Paris Getaway", date: "Oct 12 - 18, 2025" },
            { img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=200", title: "NYC Hustle", date: "Sep 01 - 05, 2025" },
            { img: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=200", title: "Venice Retreat", date: "Aug 10 - 20, 2025" }
          ].map((trip, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-4 hover:bg-white/70 dark:hover:bg-white/10 transition-colors shadow-lg flex gap-4 cursor-pointer" 
              onClick={() => navigate(`/trips/${i}`)}
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 relative">
                <img src={trip.img} alt="Trip" className="w-full h-full object-cover opacity-90 dark:opacity-100" />
              </div>
              <div className="flex flex-col justify-between py-1">
                <div>
                  <h4 className="font-bold text-lg text-slate-800 dark:text-white">{trip.title}</h4>
                  <p className="text-slate-500 dark:text-white/60 text-sm">{trip.date}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current text-slate-300 dark:text-white/20" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default Dashboard;
