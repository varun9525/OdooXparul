import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { AlertCircle, Calendar, Filter, Loader2, MapPin, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { format, isAfter, isBefore, isWithinInterval, parseISO } from "date-fns";
import { tripAPI, Trip } from "../../services/api";

const phaseFor = (trip: Trip) => {
  const now = new Date();
  const start = parseISO(trip.startDate);
  const end = parseISO(trip.endDate);

  if (isWithinInterval(now, { start, end })) return "active";
  if (isBefore(now, start)) return "upcoming";
  if (isAfter(now, end)) return "past";
  return trip.status || "upcoming";
};

const formatDate = (value: string) => {
  try {
    return format(parseISO(value), "MMM d, yyyy");
  } catch {
    return value;
  }
};

const TripCard = ({ trip, onClick }: { trip: Trip; onClick: () => void }) => {
  const phase = phaseFor(trip);

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="group flex w-full gap-5 rounded-2xl border border-slate-200 bg-white/70 p-4 text-left shadow-lg backdrop-blur-xl transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
    >
      <div className="relative h-28 w-36 flex-shrink-0 overflow-hidden rounded-xl bg-slate-900">
        <img
          src={trip.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800"}
          alt={trip.destination}
          className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-110"
        />
        <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md">
          {phase}
        </span>
      </div>
      <div className="min-w-0 flex-1 py-1">
        <h3 className="truncate text-xl font-black text-slate-900 dark:text-white">{trip.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-500 dark:text-white/55">
          <MapPin className="h-4 w-4" />
          {trip.destination}
        </p>
        <p className="mt-3 flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/35">
          <Calendar className="h-4 w-4" />
          {formatDate(trip.startDate)} to {formatDate(trip.endDate)}
        </p>
      </div>
    </motion.button>
  );
};

const TripsListing = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await tripAPI.getTrips();
        setTrips(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch trips");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesQuery = `${trip.title} ${trip.destination}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" || phaseFor(trip) === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status, trips]);

  const grouped = {
    active: filteredTrips.filter((trip) => phaseFor(trip) === "active"),
    upcoming: filteredTrips.filter((trip) => phaseFor(trip) === "upcoming"),
    past: filteredTrips.filter((trip) => phaseFor(trip) === "past"),
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-5xl space-y-8 sunrise-section">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">Your Trips</h1>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-white/55">
            Stored trips for the current signed-in user.
          </p>
        </div>
        <button
          onClick={() => navigate("/trip/create")}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
        >
          <Plus className="h-5 w-5" />
          New Trip
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search trips..."
            className="w-full rounded-xl border border-slate-200 bg-white/70 py-3 pl-10 pr-4 text-sm font-semibold text-slate-900 outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>
        <div className="relative">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white/70 py-3 pl-10 pr-8 text-sm font-bold text-slate-900 outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-slate-900 dark:text-white md:w-44"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-slate-200 bg-white/60 dark:border-white/10 dark:bg-white/5">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-300" />
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {!loading && !error && filteredTrips.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center dark:border-white/15 dark:bg-white/5">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">No trips found</h2>
          <p className="mt-2 text-slate-500 dark:text-white/55">Create a trip or clear your filters.</p>
        </div>
      )}

      {!loading && !error && filteredTrips.length > 0 && (
        <div className="space-y-8">
          {[
            { key: "active", label: "Ongoing" },
            { key: "upcoming", label: "Upcoming" },
            { key: "past", label: "Completed" },
          ].map((section) => {
            const items = grouped[section.key as keyof typeof grouped];
            if (items.length === 0) return null;

            return (
              <section key={section.key}>
                <h2 className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
                  {section.label}
                </h2>
                <div className="space-y-4">
                  {items.map((trip) => (
                    <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/trips/${trip.id}`)} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default TripsListing;
