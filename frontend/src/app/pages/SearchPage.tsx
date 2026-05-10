import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Loader2, MapPin, Search as SearchIcon, Star } from "lucide-react";
import { useNavigate } from "react-router";
import { communityAPI, CommunityPost, tripAPI, Trip } from "../../services/api";

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-4xl space-y-8 py-4 pb-12">
      <div className="group relative">
        <SearchIcon className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-indigo-400 transition-colors group-focus-within:text-indigo-600 dark:text-white/50" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search your trips and community posts..."
          className="w-full rounded-full border border-slate-200 bg-white py-5 pl-16 pr-6 text-lg font-medium text-slate-800 shadow-xl outline-none backdrop-blur-xl transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder-white/50"
        />
      </div>

      <div className="flex gap-4 overflow-x-auto px-1 pb-2">
        {["All", "Trip", "Community"].map((tag) => (
          <button key={tag} onClick={() => setFilter(tag)} className={`whitespace-nowrap rounded-full border px-6 py-2.5 font-bold transition-all ${filter === tag ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "border-slate-200 bg-white/80 text-slate-600 shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"}`}>
            {tag}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex min-h-[220px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
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
          {results.length === 0 && <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center font-semibold text-slate-500 dark:border-white/15 dark:text-white/50">No results found.</div>}
        </div>
      )}
    </motion.div>
  );
};

export default SearchPage;
