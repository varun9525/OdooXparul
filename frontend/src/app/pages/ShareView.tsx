import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Calendar, Heart, Loader2, MapPin, Share2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { publicAPI, Trip } from "../../services/api";

const ShareView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const response = await publicAPI.getSharedTrip(id);
      setTrip(response.data);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading || !trip) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950"><Loader2 className="h-9 w-9 animate-spin text-indigo-300" /></div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="fixed left-6 top-6 z-50">
        <button onClick={() => navigate(-1)} className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 font-semibold text-slate-900 backdrop-blur-xl transition-all hover:bg-white dark:border-white/20 dark:bg-black/50 dark:text-white dark:hover:bg-black/70">
          Back
        </button>
      </div>

      <div className="relative flex h-screen items-center justify-center overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <img src={trip.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000"} alt={trip.destination} className="h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-slate-950/50 dark:to-slate-950" />
        </motion.div>

        <motion.div style={{ opacity, y: y2 }} className="relative z-10 max-w-4xl px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 inline-block rounded-full border border-slate-200 bg-white/80 px-6 py-2 text-sm font-bold uppercase tracking-widest text-indigo-600 shadow-xl backdrop-blur-md dark:border-white/20 dark:bg-white/10 dark:text-indigo-300">
            Shared Traveloop
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-6xl font-black tracking-tight text-slate-900 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] dark:text-white dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] md:text-8xl">
            {trip.title}
          </motion.h1>
          <div className="flex flex-wrap justify-center gap-6 text-lg font-medium text-slate-700 drop-shadow-md dark:text-white/80">
            <span className="flex items-center gap-2"><MapPin className="h-5 w-5 text-pink-500" /> {trip.destination}</span>
            <span className="flex items-center gap-2"><Calendar className="h-5 w-5 text-indigo-500" /> {trip.startDate} to {trip.endDate}</span>
          </div>
        </motion.div>
      </div>

      <div className="relative z-20 mx-auto max-w-4xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-8">
            <h2 className="mb-6 text-4xl font-black text-slate-900 dark:text-white">The Journey</h2>
            <p className="text-xl font-light leading-relaxed text-slate-700 dark:text-white/70">{trip.description || "A shared Traveloop itinerary."}</p>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-500">
                <Heart className="h-5 w-5" />
                Save Itinerary
              </button>
              <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-6 py-3 font-bold text-slate-700 transition-all hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {(trip.itinerary ?? []).slice(0, 6).map((item, index) => (
              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} key={item.id} className="flex items-center gap-6 rounded-3xl border border-slate-200 bg-white/70 p-4 backdrop-blur-xl transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-black text-white">
                  {index + 1}
                </div>
                <div>
                  <div className="mb-1 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{item.date} {item.time || ""}</div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{item.title}</h3>
                </div>
              </motion.div>
            ))}
            {(trip.itinerary ?? []).length === 0 && <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center font-semibold text-slate-500 dark:border-white/15 dark:text-white/50">No public itinerary items yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareView;
