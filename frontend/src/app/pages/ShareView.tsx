import { motion, useScroll, useTransform } from "motion/react";
import { MapPin, Calendar, Heart, Share2 } from "lucide-react";
import { useParams, useNavigate } from "react-router";

const ShareView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:bg-slate-950 font-sans text-gray-900 dark:text-slate-50 relative overflow-hidden">
      <div className="fixed top-6 left-6 z-50">
        <button onClick={() => navigate(-1)} className="bg-white/80 dark:bg-black/50 backdrop-blur-xl border border-gray-300/50 dark:border-white/20 text-gray-900 dark:text-white px-4 py-2 rounded-full font-semibold hover:bg-white dark:hover:bg-black/70 transition-all">
          ← Back
        </button>
      </div>

      <div className="h-screen relative flex items-center justify-center overflow-hidden perspective-1000">
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1561503972-839d0c56de17?q=80&w=2000" 
            alt="Tokyo" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 dark:via-slate-950/50 to-white dark:to-slate-950" />
        </motion.div>

        <motion.div
          style={{ opacity, y: y2 }}
          className="relative z-10 text-center max-w-4xl px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-block bg-white/80 dark:bg-white/10 backdrop-blur-md border border-gray-300/50 dark:border-white/20 px-6 py-2 rounded-full mb-6 text-indigo-600 dark:text-indigo-300 font-bold tracking-widest uppercase text-sm shadow-xl"
          >
            Alex's Adventure
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] mb-6 tracking-tight"
          >
            Tokyo Drift
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 text-gray-700 dark:text-white/80 font-medium text-lg drop-shadow-md"
          >
            <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-pink-500 dark:text-pink-400" /> Tokyo, Japan</span>
            <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /> 14 Days</span>
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto py-24 px-6 relative z-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">The Journey</h2>
            <p className="text-xl text-gray-700 dark:text-white/70 leading-relaxed font-light">
              This 14-day itinerary covers everything from the neon-lit streets of Shinjuku to the serene temples of Kyoto. Perfect for first-timers looking to experience the full spectrum of Japanese culture.
            </p>
            <div className="flex gap-4">
               <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg shadow-indigo-500/30">
                <Heart className="w-5 h-5" /> Save Itinerary
              </button>
              <button className="flex items-center gap-2 bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-gray-300/50 dark:border-white/20 text-gray-700 dark:text-white px-6 py-3 rounded-full font-bold transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {[
              { day: 1, title: "Arrival & Neon Lights", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=400" },
              { day: 2, title: "Traditional Kyoto", img: "https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=400" },
              { day: 3, title: "Mt. Fuji Views", img: "https://images.unsplash.com/photo-1561503972-839d0c56de17?q=80&w=400" },
            ].map((item, i) => (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                key={i}
                className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-gray-300/50 dark:border-white/10 p-4 rounded-3xl flex gap-6 items-center group cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-colors"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <div className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1 uppercase tracking-wider">Day {item.day}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareView;
