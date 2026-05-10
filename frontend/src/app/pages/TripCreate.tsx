import { motion } from "motion/react";
import { Calendar as CalendarIcon, MapPin, Search } from "lucide-react";
import { useNavigate } from "react-router";

const TripCreate = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="bg-white/70 dark:bg-white/10 backdrop-blur-2xl border border-gray-300/50 dark:border-white/20 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Plan a new trip</h2>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-gray-600 dark:text-white/70 text-sm font-medium ml-1">Select a Place</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Where to?"
                  className="w-full bg-white/70 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-gray-600 dark:text-white/70 text-sm font-medium ml-1">Start Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/50 w-5 h-5" />
                  <input
                    type="date"
                    className="w-full bg-white/70 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:[color-scheme:dark]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-gray-600 dark:text-white/70 text-sm font-medium ml-1">End Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/50 w-5 h-5" />
                  <input
                    type="date"
                    className="w-full bg-white/70 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:[color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
             <button 
              onClick={() => navigate('/trips/new')}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95"
            >
              Start Building Itinerary
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Suggestions for Places to Visit / Activities to perform</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={i}
              className="h-40 rounded-2xl overflow-hidden relative cursor-pointer border border-gray-300/50 dark:border-white/10"
            >
              <img src={`https://images.unsplash.com/photo-1561503972-839d0c56de17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400&t=${i}`} alt="Suggestion" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                <span className="text-white font-medium">Activity {i}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TripCreate;
