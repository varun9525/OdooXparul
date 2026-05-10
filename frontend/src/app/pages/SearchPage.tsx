import { motion } from "motion/react";
import { Search as SearchIcon, MapPin, Star } from "lucide-react";

const SearchPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8 py-4 pb-12"
    >
      <div className="relative group">
        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 dark:text-white/50 w-6 h-6 group-focus-within:text-indigo-600 transition-colors" />
        <input 
          type="text" 
          placeholder="Search destinations, activities, or cities..." 
          className="w-full bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-full pl-16 pr-6 py-5 text-lg text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xl transition-all font-medium"
        />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar px-1">
        {['All', 'Cities', 'Activities', 'Hotels', 'Restaurants'].map((tag, i) => (
          <button key={tag} className={`px-6 py-2.5 rounded-full border whitespace-nowrap transition-all font-bold ${i === 0 ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20' : 'bg-white/80 dark:bg-white/5 text-slate-600 dark:text-white/70 border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 shadow-sm'}`}>
            {tag}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {[
          { title: "Shinjuku Gyoen National Garden", img: "https://images.unsplash.com/photo-1542051812871-34f215d5fd23?q=80&w=400", tags: ["Park", "Sightseeing"], rating: 4.8 },
          { title: "Eiffel Tower Sunset Tour", img: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=400", tags: ["Landmark", "Romantic"], rating: 4.9 },
          { title: "Colosseum Underground", img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=400", tags: ["History", "Tour"], rating: 4.7 }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            whileHover={{ scale: 1.01 }}
            className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 p-4 rounded-3xl flex flex-col md:flex-row gap-6 hover:bg-white dark:hover:bg-white/10 transition-colors cursor-pointer shadow-lg"
          >
            <div className="w-full md:w-56 h-40 rounded-2xl overflow-hidden flex-shrink-0 relative group">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
            <div className="flex-1 flex flex-col justify-center py-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{item.title}</h3>
                <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 text-sm bg-amber-50 dark:bg-white/10 px-3 py-1.5 rounded-lg font-bold border border-amber-100 dark:border-transparent">
                  <Star className="w-4 h-4 fill-current" /> {item.rating}
                </div>
              </div>
              <p className="text-slate-500 dark:text-white/60 text-base mb-4 leading-relaxed">Experience an unforgettable journey through one of the most iconic locations in the world. Perfect for photography and sightseeing.</p>
              <div className="flex gap-2 mt-auto">
                {item.tags.map(tag => (
                  <span key={tag} className="text-xs bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-500/20 font-bold tracking-wide uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchPage;
