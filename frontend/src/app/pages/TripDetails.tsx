import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Calendar, DollarSign, FileText, ListChecks, Loader2, Map, MapPin, Printer, Share2, Trash2, CalendarPlus } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { format, parseISO, isBefore, isAfter, isWithinInterval } from "date-fns";
import ItineraryBuilder from "../components/ItineraryBuilder";
import BudgetView from "../components/BudgetView";
import ChecklistView from "../components/ChecklistView";
import TripNotesView from "../components/TripNotesView";
import { tripAPI, Trip } from "../../services/api";
import { WeatherWidget } from "../components/WeatherWidget";
import { DestinationMap } from "../components/DestinationMap";
import { TripDetailsSkeleton } from "../components/ui/Skeleton";

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

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("itinerary");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTrip = useCallback(async () => {
    if (!id) return;

    try {
      setError("");
      const response = await tripAPI.getTripById(id);
      setTrip(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trip");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  const phase = trip ? getTripPhase(trip) : "upcoming";
  const isPast = phase === "past";

  const tabs = [
    { id: "itinerary", label: "Itinerary", icon: Map },
    { id: "budget", label: "Budget", icon: DollarSign },
    { id: "checklist", label: "Checklist", icon: ListChecks },
    { id: "notes", label: isPast ? "Journal & Memories" : "Notes", icon: FileText },
  ];

  const addToGoogleCalendar = () => {
    if (!trip) return;
    
    // Format dates for Google Calendar all-day event (YYYYMMDD)
    const startDate = trip.startDate.replace(/-/g, '');
    const endObj = new Date(trip.endDate);
    endObj.setDate(endObj.getDate() + 1); // Google Calendar end date is exclusive for all-day events
    const endDate = endObj.toISOString().split('T')[0].replace(/-/g, '');
    
    let details = "Here is your Traveloop Itinerary:\n\n";
    if (trip.itinerary && trip.itinerary.length > 0) {
      // Group by date
      const byDate = trip.itinerary.reduce<Record<string, any[]>>((acc, item) => {
        acc[item.date] = acc[item.date] || [];
        acc[item.date].push(item);
        return acc;
      }, {});
      
      Object.entries(byDate).sort(([a],[b]) => a.localeCompare(b)).forEach(([date, items]) => {
        details += `--- ${formatDate(date)} ---\n`;
        items.forEach(item => {
          details += `• ${item.time || 'All day'}: ${item.title}`;
          if (item.location) details += ` (@ ${item.location})`;
          details += '\n';
        });
        details += '\n';
      });
    } else {
      details += "No itinerary planned yet.\n";
    }
    
    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.append("action", "TEMPLATE");
    url.searchParams.append("text", trip.title);
    url.searchParams.append("dates", `${startDate}/${endDate}`);
    url.searchParams.append("details", details);
    url.searchParams.append("location", trip.destination);
    
    window.open(url.toString(), "_blank");
  };

  if (loading) {
    return <TripDetailsSkeleton />;
  }

  if (error || !trip) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
        <AlertCircle className="mb-3 h-6 w-6" />
        {error || "Trip not found"}
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col pb-8 sunrise-section">
      <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white/60 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <div className="relative min-h-[260px]">
          <img
            src={trip.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200"}
            alt={trip.destination}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
          <div className="relative z-10 flex min-h-[340px] flex-col justify-between p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur-md">
                <MapPin className="h-4 w-4" />
                {trip.destination}
              </div>
              <WeatherWidget destination={trip.destination} />
            </div>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mt-auto pt-6">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">{trip.title}</h1>
                <p className="mt-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/70">
                  <Calendar className="h-4 w-4" />
                  {formatDate(trip.startDate)} to {formatDate(trip.endDate)}
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/share/${id}`);
                    const btn = document.getElementById('share-btn-text');
                    if(btn) {
                      btn.innerText = 'Copied!';
                      setTimeout(() => { btn.innerText = 'Share'; }, 2000);
                    }
                  }} 
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-5 py-2.5 font-bold text-white backdrop-blur-md transition hover:bg-white/25"
                >
                  <Share2 className="h-4 w-4" />
                  <span id="share-btn-text">Share</span>
                </button>
                <button onClick={addToGoogleCalendar} className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-5 py-2.5 font-bold text-white backdrop-blur-md transition hover:bg-white/25">
                  <CalendarPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add to Google Calendar</span>
                </button>
                <button onClick={() => navigate(`/invoice/${id}`)} className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-5 py-2.5 font-bold text-white backdrop-blur-md transition hover:bg-white/25">
                  <Printer className="h-4 w-4" />
                  Invoice
                </button>
                <button 
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to delete this trip? This cannot be undone.")) {
                      try {
                        await tripAPI.deleteTrip(id!);
                        navigate("/");
                      } catch (err) {
                        alert("Failed to delete trip");
                      }
                    }
                  }} 
                  className="flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-500/20 px-5 py-2.5 font-bold text-white backdrop-blur-md transition hover:bg-red-500/40"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto px-1 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-3 font-black transition-all ${
              activeTab === tab.id
                ? "scale-105 bg-indigo-600/90 text-white shadow-lg shadow-indigo-500/25"
                : "border border-slate-200 bg-white/40 text-slate-600 hover:bg-white/60 dark:border-transparent dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="relative min-h-[500px] flex-1 overflow-y-auto rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === "itinerary" && <ItineraryBuilder tripId={trip.id} items={trip.itinerary ?? []} onChanged={loadTrip} />}
              {activeTab === "budget" && (
                <BudgetView
                  tripId={trip.id}
                  totalBudget={Number(trip.totalBudget || trip.budget?.total || 0)}
                  currency={trip.currency || trip.budget?.currency || "USD"}
                  items={trip.budget?.items ?? []}
                  onChanged={loadTrip}
                />
              )}
              {activeTab === "checklist" && <ChecklistView tripId={trip.id} items={trip.packingList ?? []} onChanged={loadTrip} />}
              {activeTab === "notes" && <TripNotesView tripId={trip.id} notes={trip.notes ?? []} onChanged={loadTrip} allowPhotos={isPast} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {activeTab === "itinerary" && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} 
            className="w-full lg:w-1/3 lg:min-w-[320px]"
          >
            <DestinationMap destination={trip.destination} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TripDetails;
