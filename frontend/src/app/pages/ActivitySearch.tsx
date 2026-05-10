import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Coffee, Compass, Filter, Footprints, Loader2, MapPin, Mountain, Plus, ShoppingBag, Utensils, X } from "lucide-react";
import { useNavigate } from "react-router";
import { itineraryAPI, tripAPI, Trip } from "../../services/api";

// Activity database
const ACTIVITY_DATABASE = [
  { name: "City Walking Tour", category: "Sightseeing", cost: "$", duration: "3 hours", description: "Explore the city's top landmarks with a guided walking tour through historic streets.", image: "https://images.unsplash.com/photo-1517732306149-e8f829eb588a?q=80&w=800" },
  { name: "Sunset Cruise", category: "Adventure", cost: "$$", duration: "2 hours", description: "Enjoy breathtaking sunset views from the water with drinks and live music.", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800" },
  { name: "Museum Visit", category: "Sightseeing", cost: "$", duration: "2-4 hours", description: "Discover local history, art, and culture at a world-class museum.", image: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=800" },
  { name: "Street Food Tour", category: "Food & Dining", cost: "$", duration: "3 hours", description: "Taste authentic local flavors as you walk through bustling food markets.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800" },
  { name: "Fine Dining Experience", category: "Food & Dining", cost: "$$$", duration: "2 hours", description: "Indulge in a multi-course meal at a top-rated restaurant.", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800" },
  { name: "Scuba Diving", category: "Adventure", cost: "$$$", duration: "4 hours", description: "Explore vibrant coral reefs and marine life beneath the waves.", image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?q=80&w=800" },
  { name: "Mountain Hiking", category: "Adventure", cost: "$", duration: "5-8 hours", description: "Trek through scenic trails with panoramic views of the landscape.", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800" },
  { name: "Local Market Shopping", category: "Shopping", cost: "$$", duration: "2-3 hours", description: "Browse unique souvenirs, crafts, and local specialties at vibrant markets.", image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=800" },
  { name: "Cooking Class", category: "Food & Dining", cost: "$$", duration: "3 hours", description: "Learn to cook authentic local dishes with a professional chef.", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800" },
  { name: "Photography Walk", category: "Sightseeing", cost: "$", duration: "2-3 hours", description: "Capture the best moments of the city with a photography-focused walking tour.", image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=800" },
  { name: "Spa & Wellness Day", category: "Relaxation", cost: "$$$", duration: "4-6 hours", description: "Pamper yourself with massages, hot springs, and relaxation treatments.", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800" },
  { name: "Surfing Lesson", category: "Adventure", cost: "$$", duration: "2 hours", description: "Catch your first wave with a professional surf instructor on the beach.", image: "https://images.unsplash.com/photo-1502680390548-bdbac40e7a78?q=80&w=800" },
  { name: "Café Hopping", category: "Relaxation", cost: "$", duration: "2-3 hours", description: "Discover the best coffee spots and hidden cafés in the city.", image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=800" },
  { name: "Temple & Shrine Visit", category: "Sightseeing", cost: "$", duration: "1-2 hours", description: "Experience spiritual beauty and architectural wonders at ancient temples.", image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=800" },
  { name: "Nightlife & Clubs", category: "Entertainment", cost: "$$", duration: "4+ hours", description: "Dance the night away at the hottest clubs and rooftop bars.", image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800" },
  { name: "Zip-lining", category: "Adventure", cost: "$$", duration: "1-2 hours", description: "Soar through the air on exhilarating zip-lines above forests and valleys.", image: "https://images.unsplash.com/photo-1530866495561-507c83b18b09?q=80&w=800" },
];

const CATEGORIES = ["All", "Sightseeing", "Adventure", "Food & Dining", "Shopping", "Relaxation", "Entertainment"];
const COSTS = ["All Prices", "$", "$$", "$$$"];

const CATEGORY_ICONS: Record<string, any> = {
  Sightseeing: Camera,
  Adventure: Mountain,
  "Food & Dining": Utensils,
  Shopping: ShoppingBag,
  Relaxation: Coffee,
  Entertainment: Footprints,
};

const ActivitySearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [costFilter, setCostFilter] = useState("All Prices");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // Add to Trip modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<typeof ACTIVITY_DATABASE[0] | null>(null);
  const [addingToTrip, setAddingToTrip] = useState(false);
  const [addSuccess, setAddSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await tripAPI.getTrips();
        setTrips(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredActivities = useMemo(() => {
    const term = query.toLowerCase();
    return ACTIVITY_DATABASE.filter((activity) => {
      const matchesQuery = `${activity.name} ${activity.description} ${activity.category}`.toLowerCase().includes(term);
      const matchesCategory = category === "All" || activity.category === category;
      const matchesCost = costFilter === "All Prices" || activity.cost === costFilter;
      return matchesQuery && matchesCategory && matchesCost;
    });
  }, [query, category, costFilter]);

  const handleAddToTrip = async (tripId: string) => {
    if (!selectedActivity) return;
    setAddingToTrip(true);
    try {
      const trip = trips.find(t => t.id === tripId);
      await itineraryAPI.addItineraryItem(tripId, {
        title: selectedActivity.name,
        description: selectedActivity.description,
        date: trip?.startDate || new Date().toISOString().split('T')[0],
        time: "10:00",
        location: trip?.destination || "",
        type: "activity",
      });
      setAddSuccess(`✅ Added "${selectedActivity.name}" to "${trip?.title}"!`);
      setTimeout(() => { setShowAddModal(false); setAddSuccess(""); setSelectedActivity(null); }, 1500);
    } catch {
      setAddSuccess("❌ Failed to add activity.");
    } finally {
      setAddingToTrip(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-6xl space-y-8 py-4 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white shadow-2xl dark:border-white/10 md:p-12">
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20">
          <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="relative z-10">
          <h1 className="mb-3 text-4xl font-black md:text-5xl">Discover Activities</h1>
          <p className="max-w-xl text-lg font-medium text-white/80">Browse and add exciting experiences to your trips — from food tours to mountain hikes.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="group relative">
        <Compass className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search activities (e.g., hiking, food, surfing...)"
          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-14 pr-6 text-base font-medium text-slate-800 shadow-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/20 dark:bg-white/10 dark:text-white"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || Filter;
            return (
              <button key={cat} onClick={() => setCategory(cat)} className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition-all ${category === cat ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 bg-white/80 text-slate-600 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"}`}>
                {cat !== "All" && <Icon className="h-3.5 w-3.5" />} {cat}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          {COSTS.map((cost) => (
            <button key={cost} onClick={() => setCostFilter(cost)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition-all ${costFilter === cost ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 bg-white/80 text-slate-600 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/70"}`}>
              {cost}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Grid */}
      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5"
            >
              <div className="relative h-40 overflow-hidden">
                <img src={activity.image} alt={activity.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="rounded-lg bg-white/20 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">{activity.category}</span>
                  <span className="rounded-lg bg-emerald-500/80 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">{activity.cost}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-1 text-lg font-black text-slate-800 dark:text-white">{activity.name}</h3>
                <p className="mb-3 text-xs font-semibold text-slate-500 dark:text-white/50">{activity.duration}</p>
                <p className="mb-4 line-clamp-2 text-sm text-slate-600 dark:text-white/60">{activity.description}</p>
                <button 
                  onClick={() => { setSelectedActivity(activity); setShowAddModal(true); setAddSuccess(""); }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-500"
                >
                  <Plus className="h-4 w-4" /> Add to Trip
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredActivities.length === 0 && !loading && (
        <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center font-semibold text-slate-500 dark:border-white/15 dark:text-white/50">No activities match your filters.</div>
      )}

      {/* Add to Trip Modal */}
      <AnimatePresence>
        {showAddModal && selectedActivity && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/20 dark:bg-slate-900"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-800 dark:text-white">Add "{selectedActivity.name}"</h3>
                <button onClick={() => setShowAddModal(false)} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-white/10">
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              {addSuccess ? (
                <div className="rounded-2xl bg-emerald-50 p-4 text-center font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{addSuccess}</div>
              ) : trips.length === 0 ? (
                <div className="space-y-4 text-center">
                  <p className="text-slate-500 dark:text-white/60">You don't have any trips yet!</p>
                  <button onClick={() => { setShowAddModal(false); navigate("/trip/create"); }} className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white">Create Your First Trip</button>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {trips.map((trip) => (
                    <button
                      key={trip.id}
                      onClick={() => handleAddToTrip(trip.id)}
                      disabled={addingToTrip}
                      className="flex w-full items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-left transition-colors hover:bg-indigo-50 hover:border-indigo-200 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-indigo-500/10"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-bold text-slate-800 dark:text-white">{trip.title}</h4>
                        <p className="truncate text-xs text-slate-500 dark:text-white/50">{trip.destination} · {trip.startDate}</p>
                      </div>
                      <Plus className="h-5 w-5 shrink-0 text-indigo-500" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ActivitySearch;
