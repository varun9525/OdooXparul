import { motion } from "motion/react";
import { Filter, Search } from "lucide-react";
import { useNavigate } from "react-router";

const TripCard = ({ title, date, status, img, onClick }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className="bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-gray-300/50 dark:border-white/20 rounded-2xl p-4 flex gap-6 cursor-pointer hover:bg-white/60 dark:hover:bg-white/15 transition-all shadow-lg"
  >
    <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 relative">
      <img src={img} alt={title} className="w-full h-full object-cover opacity-90 dark:opacity-100" />
      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white">
        {status}
      </div>
    </div>
    <div className="flex flex-col justify-center">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-gray-600 dark:text-white/60 text-sm">Short Overview of the Trip</p>
      <p className="text-gray-500 dark:text-white/40 text-xs mt-2">{date}</p>
    </div>
  </motion.div>
);

const TripsListing = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8 sunrise-section"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Trips</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-white/50" />
            <input type="text" placeholder="Search trips..." className="bg-white/50 dark:bg-white/10 border border-gray-300/50 dark:border-white/20 rounded-full pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/50 focus:outline-none focus:bg-white/60 dark:focus:bg-white/20 w-48 transition-all backdrop-blur-sm" />
          </div>
          <button className="bg-white/50 dark:bg-white/10 border border-gray-300/50 dark:border-white/20 p-2 rounded-full hover:bg-white/60 dark:hover:bg-white/20 transition-all text-gray-700 dark:text-white/80 backdrop-blur-sm">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-bold text-indigo-600 dark:text-indigo-300 mb-4 tracking-wider uppercase">Ongoing</h2>
          <div className="space-y-4">
            <TripCard title="Bali Escape" date="Current - Aug 20" status="Active" img="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=400" onClick={() => navigate('/trips/1')} />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-indigo-600 dark:text-indigo-300 mb-4 tracking-wider uppercase">Upcoming</h2>
          <div className="space-y-4">
            <TripCard title="Tokyo Drift" date="Sep 10 - Sep 24" status="Planned" img="https://images.unsplash.com/photo-1561503972-839d0c56de17?q=80&w=400" onClick={() => navigate('/trips/2')} />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-indigo-600 dark:text-indigo-300 mb-4 tracking-wider uppercase">Completed</h2>
          <div className="space-y-4 opacity-75">
            <TripCard title="Parisian Dreams" date="Mar 5 - Mar 12, 2025" status="Finished" img="https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=400" onClick={() => navigate('/trips/3')} />
            <TripCard title="New York Hustle" date="Jan 10 - Jan 15, 2025" status="Finished" img="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=400" onClick={() => navigate('/trips/4')} />
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default TripsListing;
