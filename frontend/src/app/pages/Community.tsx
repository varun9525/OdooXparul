import { motion } from "motion/react";
import { MessageSquare, Heart, Share2 } from "lucide-react";

const Community = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8 py-4 pb-12"
    >
      <div className="flex justify-between items-center mb-8 bg-white/70 dark:bg-transparent backdrop-blur-md p-6 rounded-3xl shadow-sm dark:shadow-none border border-slate-200 dark:border-transparent">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white">Community</h1>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30">
          Share Experience
        </button>
      </div>

      <div className="space-y-8">
        {[
          { img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100", name: "Sarah Wander", text: "Just finished an amazing 3-day itinerary in Paris! Highlights included a hidden bakery near Montmartre. Highly recommend booking tickets way in advance!" },
          { img: "https://images.unsplash.com/photo-1542259009477-d625272157b7?q=80&w=800", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100", name: "Elena Rivers", text: "Sunset at Santorini was unbelievable. We found a quiet spot away from the crowds. Best trip of my life." },
          { img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100", name: "Mark Dune", text: "Dubai architecture never ceases to amaze me. Spent the afternoon exploring the old souks before heading to the Burj." }
        ].map((post, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-3xl shadow-xl dark:shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-100 dark:border-white/20 shadow-sm">
                <img src={post.avatar} alt="User" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-lg">{post.name}</h4>
                <p className="text-xs text-slate-500 dark:text-white/50 font-medium">2 hours ago</p>
              </div>
            </div>
            
            <p className="text-slate-600 dark:text-white/80 mb-6 leading-relaxed text-lg">
              {post.text}
            </p>
            
            <div className="h-72 md:h-96 rounded-2xl overflow-hidden mb-6 border border-slate-100 dark:border-white/10 shadow-inner group">
               <img src={post.img} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>

            <div className="flex gap-8 border-t border-slate-100 dark:border-white/10 pt-6">
              <button className="flex items-center gap-2 text-slate-500 dark:text-white/60 hover:text-pink-500 dark:hover:text-pink-400 transition-colors font-medium">
                <Heart className="w-6 h-6" /> 245
              </button>
              <button className="flex items-center gap-2 text-slate-500 dark:text-white/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                <MessageSquare className="w-6 h-6" /> 42
              </button>
              <button className="flex items-center gap-2 text-slate-500 dark:text-white/60 hover:text-green-500 dark:hover:text-green-400 transition-colors font-medium ml-auto">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Community;
