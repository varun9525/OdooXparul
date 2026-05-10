import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, Loader2, MapPin, Plus, Search as SearchIcon, Star, X } from "lucide-react";
import { useNavigate } from "react-router";
import { communityAPI, CommunityPost, itineraryAPI, tripAPI, Trip } from "../../services/api";
import { Skeleton, TripCardSkeleton } from "../components/ui/Skeleton";

// Popular cities database with region, country, cost index, popularity
const CITY_DATABASE = [
  { name: "Paris", country: "France", region: "Europe", costIndex: "$$$$", popularity: 98, image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800" },
  { name: "Tokyo", country: "Japan", region: "Asia", costIndex: "$$$", popularity: 95, image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800" },
  { name: "New York", country: "USA", region: "Americas", costIndex: "$$$$", popularity: 97, image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800" },
  { name: "London", country: "UK", region: "Europe", costIndex: "$$$$", popularity: 96, image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800" },
  { name: "Bali", country: "Indonesia", region: "Asia", costIndex: "$", popularity: 90, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800" },
  { name: "Dubai", country: "UAE", region: "Middle East", costIndex: "$$$", popularity: 92, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800" },
  { name: "Rome", country: "Italy", region: "Europe", costIndex: "$$$", popularity: 93, image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800" },
  { name: "Bangkok", country: "Thailand", region: "Asia", costIndex: "$", popularity: 89, image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800" },
  { name: "Barcelona", country: "Spain", region: "Europe", costIndex: "$$$", popularity: 91, image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=800" },
  { name: "Sydney", country: "Australia", region: "Oceania", costIndex: "$$$", popularity: 88, image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800" },
  { name: "Istanbul", country: "Turkey", region: "Europe", costIndex: "$$", popularity: 87, image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800" },
  { name: "Mumbai", country: "India", region: "Asia", costIndex: "$", popularity: 85, image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=800" },
  { name: "Jaipur", country: "India", region: "Asia", costIndex: "$", popularity: 83, image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800" },
  { name: "Cairo", country: "Egypt", region: "Africa", costIndex: "$", popularity: 84, image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=800" },
  { name: "Rio de Janeiro", country: "Brazil", region: "Americas", costIndex: "$$", popularity: 86, image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=800" },
  { name: "Singapore", country: "Singapore", region: "Asia", costIndex: "$$$", popularity: 91, image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800" },
];

const REGIONS = ["All Regions", "Europe", "Asia", "Americas", "Middle East", "Africa", "Oceania"];

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Add to Trip modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState<typeof CITY_DATABASE[0] | null>(null);
  const [addingToTrip, setAddingToTrip] = useState(false);
  const [addSuccess, setAddSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [tripResponse, postResponse] = await Promise.all([tripAPI.getTrips(), communityAPI.getPosts()]);
        setTrips(tripResponse.data);
        setPosts(postResponse.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAddToTrip = async (tripId: string) => {
    if (!selectedCity) return;
    setAddingToTrip(true);
    try {
      const trip = trips.find(t => t.id === tripId);
      await itineraryAPI.addItineraryItem(tripId, {
        title: `Explore ${selectedCity.name}`,
        date: trip?.startDate || new Date().toISOString().split('T')[0],
        time: "10:00",
        location: `${selectedCity.name}, ${selectedCity.country}`,
        type: "activity",
      });
      setAddSuccess(`✅ Added "${selectedCity.name}" to "${trip?.title}"!`);
      setTimeout(() => { setShowAddModal(false); setAddSuccess(""); setSelectedCity(null); }, 1500);
    } catch {
      setAddSuccess("❌ Failed to add city. Please try again.");
    } finally {
      setAddingToTrip(false);
    }
  };

  // City search results
  const cityResults = useMemo(() => {
    const term = query.toLowerCase();
    return CITY_DATABASE
      .filter(city => {
        const matchesQuery = `${city.name} ${city.country}`.toLowerCase().includes(term);
        const matchesRegion = regionFilter === "All Regions" || city.region === regionFilter;
        return matchesQuery && matchesRegion;
      })
      .sort((a, b) => b.popularity - a.popularity);
  }, [query, regionFilter]);

  // Trip + Community search results
  const results = useMemo(() => {
    const term = query.toLowerCase();
    const tripResults = trips.map((trip) => ({
      id: trip.id,
      type: "Trip",
      title: trip.title,
      subtitle: trip.destination,
      body: trip.description || "Saved trip from your workspace.",
      image: trip.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800",
      onClick: () => navigate(`/trips/${trip.id}`),
    }));
    const postResults = posts.map((post) => ({
      id: post.id,
      type: "Community",
      title: post.title,
      subtitle: post.destination || post.author?.username || "Community",
      body: post.content,
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800",
      onClick: () => navigate("/community"),
    }));

    return [...tripResults, ...postResults].filter((item) => {
      const matchesFilter = filter === "All" || item.type === filter;
      const matchesQuery = `${item.title} ${item.subtitle} ${item.body}`.toLowerCase().includes(term);
      return matchesFilter && matchesQuery;
    });
  }, [filter, navigate, posts, query, trips]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-5xl space-y-8 py-4 pb-12">
      <div className="group relative">
        <SearchIcon className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-indigo-400 transition-colors group-focus-within:text-indigo-600 dark:text-white/50" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search cities, trips, and community posts..."
          className="w-full rounded-full border border-slate-200 bg-white py-5 pl-16 pr-6 text-lg font-medium text-slate-800 shadow-xl outline-none backdrop-blur-xl transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder-white/50"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {["All", "Cities", "Trip", "Community"].map((tag) => (
            <button key={tag} onClick={() => setFilter(tag)} className={`whitespace-nowrap rounded-full border px-5 py-2 font-bold transition-all ${filter === tag ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "border-slate-200 bg-white/80 text-slate-600 shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"}`}>
              {tag}
            </button>
          ))}
        </div>
        {(filter === "All" || filter === "Cities") && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {REGIONS.map((region) => (
              <button key={region} onClick={() => setRegionFilter(region)} className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-bold transition-all ${regionFilter === region ? "border-purple-500 bg-purple-500 text-white" : "border-slate-200 bg-white/60 text-slate-500 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"}`}>
                {region}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                <Skeleton className="mb-4 h-32 w-full rounded-xl" />
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <TripCardSkeleton key={i} />)}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* City Explore Section */}
          {(filter === "All" || filter === "Cities") && cityResults.length > 0 && (
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-black text-slate-800 dark:text-white">
                <Globe className="h-6 w-6 text-indigo-500" /> Explore Cities
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cityResults.map((city) => (
                  <motion.div 
                    key={city.name}
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img src={city.image} alt={city.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <div>
                          <h3 className="text-lg font-black text-white">{city.name}</h3>
                          <p className="text-xs font-bold text-white/80">{city.country} · {city.region}</p>
                        </div>
                        <span className="rounded-lg bg-white/20 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">{city.costIndex}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-slate-600 dark:text-white/70">{city.popularity}% popular</span>
                      </div>
                      <button 
                        onClick={() => { setSelectedCity(city); setShowAddModal(true); setAddSuccess(""); }}
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-500"
                      >
                        <Plus className="h-3 w-3" /> Add to Trip
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Trips & Community Results */}
          {(filter === "All" || filter === "Trip" || filter === "Community") && results.length > 0 && (
            <div>
              {filter !== "Cities" && (
                <h2 className="mb-4 text-2xl font-black text-slate-800 dark:text-white">
                  {filter === "Trip" ? "Your Trips" : filter === "Community" ? "Community Posts" : "Your Results"}
                </h2>
              )}
              <div className="space-y-4">
                {results.map((item) => (
                  <motion.button key={`${item.type}-${item.id}`} whileHover={{ scale: 1.01 }} onClick={item.onClick} className="flex w-full flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-4 text-left shadow-lg backdrop-blur-md transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 md:flex-row">
                    <div className="relative h-40 w-full flex-shrink-0 overflow-hidden rounded-2xl md:w-56">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center py-2">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white">{item.title}</h3>
                        <div className="flex items-center gap-1 rounded-lg border border-amber-100 bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-500 dark:border-transparent dark:bg-white/10 dark:text-amber-400">
                          <Star className="h-4 w-4 fill-current" />
                          {item.type}
                        </div>
                      </div>
                      <p className="mb-3 flex items-center gap-1 text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-300">
                        <MapPin className="h-4 w-4" />
                        {item.subtitle}
                      </p>
                      <p className="line-clamp-2 text-base leading-relaxed text-slate-500 dark:text-white/60">{item.body}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {results.length === 0 && cityResults.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center font-semibold text-slate-500 dark:border-white/15 dark:text-white/50">No results found.</div>
          )}
        </div>
      )}

      {/* Add to Trip Modal */}
      <AnimatePresence>
        {showAddModal && selectedCity && (
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
                <h3 className="text-xl font-black text-slate-800 dark:text-white">Add "{selectedCity.name}" to a Trip</h3>
                <button onClick={() => setShowAddModal(false)} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-white/10">
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              {addSuccess ? (
                <div className="rounded-2xl bg-emerald-50 p-4 text-center font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  {addSuccess}
                </div>
              ) : trips.length === 0 ? (
                <div className="space-y-4 text-center">
                  <p className="text-slate-500 dark:text-white/60">You don't have any trips yet!</p>
                  <button onClick={() => { setShowAddModal(false); navigate("/trip/create"); }} className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white">
                    Create Your First Trip
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {trips.map((trip) => (
                    <button
                      key={trip.id}
                      onClick={() => handleAddToTrip(trip.id)}
                      disabled={addingToTrip}
                      className="flex w-full items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-left transition-colors hover:bg-indigo-50 hover:border-indigo-200 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-indigo-500/10 dark:hover:border-indigo-500/30"
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

export default SearchPage;
