import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Calendar, Copy, Heart, Loader2, MapPin, Share2, Check, LogIn } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { publicAPI, tripAPI, itineraryAPI, packingAPI, budgetAPI, Trip } from "../../services/api";
import { Skeleton } from "../components/ui/Skeleton";

const ShareView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const isLoggedIn = !!localStorage.getItem("authToken");

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const response = await publicAPI.getSharedTrip(id);
      setTrip(response.data);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleCopyTrip = async () => {
    if (!trip || !isLoggedIn) return;
    setCopying(true);
    try {
      // Step 1: Create the trip
      const res = await tripAPI.createTrip({
        title: `${trip.title} (Copy)`,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        description: trip.description,
        imageUrl: trip.imageUrl,
        totalBudget: trip.totalBudget,
        currency: trip.currency,
      });

      const newTripId = res.data.id;

      // Step 2: Copy itinerary items
      if (trip.itinerary && trip.itinerary.length > 0) {
        for (const item of trip.itinerary) {
          await itineraryAPI.addItineraryItem(newTripId, {
            title: item.title,
            description: item.description,
            time: item.time,
            date: item.date,
            location: item.location,
            type: item.type,
          });
        }
      }

      // Step 3: Copy packing list
      if (trip.packingList && trip.packingList.length > 0) {
        for (const item of trip.packingList) {
          await packingAPI.addPackingItem(newTripId, {
            name: item.name,
            category: item.category,
          });
        }
      }

      // Step 4: Copy budget items
      if (trip.budget?.items && trip.budget.items.length > 0) {
        for (const item of trip.budget.items) {
          await budgetAPI.addBudgetItem(newTripId, {
            category: item.category,
            amount: item.amount,
            date: item.date,
            description: item.description,
          });
        }
      }

      setCopySuccess(true);
      setTimeout(() => navigate(`/trips/${newTripId}`), 1500);
    } catch (err) {
      alert("Failed to copy trip. Please try again.");
    } finally {
      setCopying(false);
    }
  };

  if (loading || !trip) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 space-y-8">
        <Skeleton className="h-[60vh] w-full rounded-3xl" />
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32 rounded-full" />
                <Skeleton className="h-12 w-32 rounded-full" />
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
            </div>
          </div>
        </div>
      </div>
    );
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
            <div className="flex flex-wrap gap-3">
              {isLoggedIn ? (
                <button 
                  onClick={handleCopyTrip}
                  disabled={copying || copySuccess}
                  className={`flex items-center gap-2 rounded-full px-6 py-3 font-bold shadow-lg transition-all ${
                    copySuccess 
                      ? "bg-emerald-500 text-white shadow-emerald-500/30" 
                      : "bg-indigo-600 text-white shadow-indigo-500/30 hover:bg-indigo-500 disabled:opacity-60"
                  }`}
                >
                  {copySuccess ? (
                    <><Check className="h-5 w-5" /> Trip Copied!</>
                  ) : copying ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Copying...</>
                  ) : (
                    <><Copy className="h-5 w-5" /> Copy This Trip</>
                  )}
                </button>
              ) : (
                <button 
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-500"
                >
                  <LogIn className="h-5 w-5" /> Login to Copy Trip
                </button>
              )}
              <button 
                onClick={() => { navigator.clipboard.writeText(window.location.href); }}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-6 py-3 font-bold text-slate-700 transition-all hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                <Share2 className="h-5 w-5" /> Share Link
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
                  {item.location && <p className="mt-1 text-sm text-slate-500 dark:text-white/50">{item.location}</p>}
                </div>
              </motion.div>
            ))}
            {(trip.itinerary ?? []).length === 0 && <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center font-semibold text-slate-500 dark:border-white/15 dark:text-white/50">No public itinerary items yet.</div>}
          </div>
        </div>

        {/* Packing & Budget preview */}
        {((trip.packingList && trip.packingList.length > 0) || (trip.budget?.items && trip.budget.items.length > 0)) && (
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {trip.packingList && trip.packingList.length > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                <h3 className="mb-4 text-xl font-black text-slate-800 dark:text-white">Packing List</h3>
                <div className="flex flex-wrap gap-2">
                  {trip.packingList.map(item => (
                    <span key={item.id} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/70">{item.name}</span>
                  ))}
                </div>
              </div>
            )}
            {trip.budget?.items && trip.budget.items.length > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                <h3 className="mb-4 text-xl font-black text-slate-800 dark:text-white">Budget Breakdown</h3>
                <div className="space-y-2">
                  {trip.budget.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-600 dark:text-white/70">{item.category}</span>
                      <span className="font-bold text-slate-800 dark:text-white">${item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareView;
