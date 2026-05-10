import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  AlertCircle,
  Calendar,
  Clock3,
  Compass,
  Loader2,
  MapPin,
  Plane,
  Plus,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { format, isAfter, isBefore, isWithinInterval, parseISO } from "date-fns";
import { tripAPI, Trip } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const fallbackImages = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200",
];

const formatDate = (value: string) => {
  try {
    return format(parseISO(value), "MMM d, yyyy");
  } catch {
    return value;
  }
};

const getTripPhase = (trip: Trip) => {
  const now = new Date();
  const start = parseISO(trip.startDate);
  const end = parseISO(trip.endDate);

  if (isWithinInterval(now, { start, end })) return "active";
  if (isBefore(now, start)) return "upcoming";
  if (isAfter(now, end)) return "past";
  return trip.status || "upcoming";
};

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState("");

  const loadTrips = useCallback(async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      setError("");
      const response = await tripAPI.getTrips();
      setTrips(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trips");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
    const interval = window.setInterval(() => loadTrips(true), 15000);
    const onFocus = () => loadTrips(true);
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadTrips]);

  const stats = useMemo(() => {
    const phases = trips.reduce(
      (acc, trip) => {
        acc[getTripPhase(trip) as keyof typeof acc] += 1;
        return acc;
      },
      { active: 0, upcoming: 0, past: 0 }
    );

    const totalBudget = trips.reduce((sum, trip) => sum + Number(trip.totalBudget || 0), 0);
    const nextTrip = trips
      .filter((trip) => getTripPhase(trip) !== "past")
      .sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime())[0];

    return {
      ...phases,
      totalBudget,
      nextTrip,
      countries: new Set(trips.map((trip) => trip.destination.trim().toLowerCase()).filter(Boolean)).size,
    };
  }, [trips]);

  useEffect(() => {
    if (!stats.nextTrip) return;
    const start = parseISO(stats.nextTrip.startDate);
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = start.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown("Trip has started!");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      setCountdown(`${days}d ${hours}h ${mins}m`);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // update every minute
    return () => clearInterval(interval);
  }, [stats.nextTrip]);

  const heroTrip = stats.nextTrip ?? trips[0];
  const displayName = user?.firstName || user?.username || "Traveler";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-8 pb-12 sunrise-section"
    >
      <section className="relative min-h-[360px] overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl bg-slate-950">
        <img
          src={heroTrip?.imageUrl || fallbackImages[0]}
          alt={heroTrip ? heroTrip.destination : "Travel landscape"}
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/10" />
        <div className="relative z-10 flex min-h-[360px] flex-col justify-between p-6 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
              <Compass className="h-4 w-4" />
              Live travel dashboard
            </div>
            <button
              onClick={() => loadTrips(true)}
              disabled={refreshing}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-indigo-200">
              Welcome, {displayName}
            </p>
            <h1 className="mb-5 text-4xl font-black tracking-tight text-white md:text-7xl">
              {heroTrip ? heroTrip.title : "Plan your first journey"}
            </h1>
            
            {heroTrip && getTripPhase(heroTrip) === "upcoming" && countdown && (
              <div className="mb-5 inline-flex animate-pulse items-center gap-2 rounded-xl bg-indigo-500/30 px-4 py-2 font-bold text-indigo-100 backdrop-blur-md">
                <Clock3 className="h-5 w-5" />
                Starts in: {countdown}
              </div>
            )}

            <p className="mb-7 max-w-2xl text-base font-medium leading-7 text-white/75 md:text-lg">
              {heroTrip
                ? `${heroTrip.destination} is saved in your trip table from ${formatDate(heroTrip.startDate)} to ${formatDate(heroTrip.endDate)}.`
                : "Create a trip and it will appear here from the backend database for your account."}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/trip/create")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
              >
                <Plus className="h-5 w-5" />
                Create Trip
              </button>
              <button
                onClick={() => navigate("/trips")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <Plane className="h-5 w-5" />
                View Trips
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Active", value: stats.active, icon: Clock3, color: "text-emerald-600 dark:text-emerald-300" },
          { label: "Upcoming", value: stats.upcoming, icon: Calendar, color: "text-indigo-600 dark:text-indigo-300" },
          { label: "Places", value: stats.countries, icon: MapPin, color: "text-rose-600 dark:text-rose-300" },
          { label: "Planned Budget", value: money(stats.totalBudget, trips[0]?.currency || "USD"), icon: Wallet, color: "text-amber-600 dark:text-amber-300" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <item.icon className={`mb-4 h-6 w-6 ${item.color}`} />
            <div className="text-2xl font-black text-slate-900 dark:text-white">{item.value}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/50">{item.label}</div>
          </div>
        ))}
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Saved Trips</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-white/55">
              These cards are loaded from the backend for the signed-in user.
            </p>
          </div>
          <button
            onClick={() => navigate("/trip/create")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-white/85"
          >
            <Plus className="h-4 w-4" />
            New Trip
          </button>
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

        {!loading && !error && trips.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center shadow-sm backdrop-blur-xl dark:border-white/15 dark:bg-white/5">
            <Plane className="mx-auto mb-4 h-10 w-10 text-indigo-500" />
            <h3 className="mb-2 text-2xl font-black text-slate-900 dark:text-white">No trips yet</h3>
            <p className="mx-auto mb-6 max-w-md text-slate-500 dark:text-white/55">
              Start with a destination, dates, and budget. The new trip will be saved in the trips table and shown here.
            </p>
            <button
              onClick={() => navigate("/trip/create")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
            >
              <Plus className="h-5 w-5" />
              Create Your First Trip
            </button>
          </div>
        )}

        {!loading && !error && trips.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {trips.map((trip, index) => {
              const phase = getTripPhase(trip);
              return (
                <motion.button
                  key={trip.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="group relative h-[330px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-left shadow-xl transition hover:-translate-y-1 hover:shadow-2xl dark:border-white/10"
                >
                  <img
                    src={trip.imageUrl || fallbackImages[index % fallbackImages.length]}
                    alt={trip.destination}
                    className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
                  <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-widest text-white backdrop-blur-md">
                      {phase}
                    </span>
                    <span className="rounded-full bg-slate-950/55 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                      {money(trip.totalBudget, trip.currency)}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-indigo-200">
                      <MapPin className="h-4 w-4" />
                      {trip.destination}
                    </div>
                    <h3 className="mb-3 text-2xl font-black text-white">{trip.title}</h3>
                    <div className="flex flex-wrap gap-2 text-sm font-semibold text-white/80">
                      <span className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur-md">{formatDate(trip.startDate)}</span>
                      <span className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur-md">{formatDate(trip.endDate)}</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default Dashboard;
