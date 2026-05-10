import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Calendar as CalendarIcon, DollarSign, Image, Loader2, MapPin, Plane, Type } from "lucide-react";
import { useNavigate } from "react-router";
import { tripAPI, itineraryAPI, packingAPI, budgetAPI } from "../../services/api";
import { LocationAutocomplete } from "../components/LocationAutocomplete";

const defaultCovers = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200",
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200",
];

const TripCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
    totalBudget: "",
    currency: "USD",
    imageUrl: defaultCovers[0],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generateItinerary, setGenerateItinerary] = useState(false);

  const previewTitle = form.title || "Your new trip";
  const previewDestination = form.destination || "Choose a destination";

  const canSubmit = useMemo(
    () => Boolean(form.title && form.destination && form.startDate && form.endDate && !saving),
    [form.destination, form.endDate, form.startDate, form.title, saving]
  );

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!canSubmit) {
      setError("Trip title, destination, start date, and end date are required.");
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError("End date cannot be before start date.");
      return;
    }

    setSaving(true);
    try {
      const res = await tripAPI.createTrip({
        title: form.title.trim(),
        destination: form.destination.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        description: form.description.trim(),
        imageUrl: form.imageUrl,
        totalBudget: Number(form.totalBudget || 0),
        currency: form.currency,
      });

      const tripId = res.data.id;

      if (generateItinerary) {
        const destName = form.destination.split(',')[0];
        const dates = [
          form.startDate, 
          new Date(new Date(form.startDate).getTime() + 86400000).toISOString().split('T')[0], 
          form.endDate
        ];
        
        await itineraryAPI.addItineraryItem(tripId, { title: "Arrive & Hotel Check-in", date: dates[0], time: "14:00", location: destName, type: "accommodation" });
        await itineraryAPI.addItineraryItem(tripId, { title: "Evening City Tour", date: dates[0], time: "17:00", location: `Downtown ${destName}`, type: "activity" });
        await itineraryAPI.addItineraryItem(tripId, { title: "Breakfast at Local Cafe", date: dates[1], time: "09:00", location: destName, type: "dining" });
        await itineraryAPI.addItineraryItem(tripId, { title: "Museum Visit", date: dates[1], time: "11:00", location: `Museum of ${destName}`, type: "activity" });
        await itineraryAPI.addItineraryItem(tripId, { title: "Souvenir Shopping", date: dates[2], time: "10:00", location: `Market in ${destName}`, type: "activity" });
        await itineraryAPI.addItineraryItem(tripId, { title: "Flight Departure", date: dates[2], time: "15:00", location: `${destName} Airport`, type: "flight" });

        await packingAPI.addPackingItem(tripId, { name: "Passport", category: "Documents" });
        await packingAPI.addPackingItem(tripId, { name: "Phone Charger", category: "Electronics" });
        await packingAPI.addPackingItem(tripId, { name: "Comfortable Shoes", category: "Clothing" });
        await packingAPI.addPackingItem(tripId, { name: "Camera", category: "Electronics" });

        await budgetAPI.addBudgetItem(tripId, { category: "Flight", amount: 450, date: dates[0], description: "Round trip flights" });
        await budgetAPI.addBudgetItem(tripId, { category: "Accommodation", amount: 300, date: dates[0], description: "3 nights hotel" });
      }

      navigate(`/trips/${tripId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create trip");
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto grid max-w-6xl gap-8 pb-12 lg:grid-cols-[1.1fr_0.9fr]"
    >
      <section className="rounded-3xl border border-slate-200 bg-white/75 p-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5 md:p-8">
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200">
            <Plane className="h-4 w-4" />
            Save to your trip table
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Plan a new trip
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-white/55">
            This form creates a real trip through the backend API. After saving, the trip appears on your home page for this account.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-200">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-600 dark:text-white/70">Trip title</span>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Summer in Italy"
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3 pl-12 pr-4 font-semibold text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-600 dark:text-white/70">Destination</span>
              <LocationAutocomplete
                value={form.destination}
                onChange={(val) => updateField("destination", val)}
                placeholder="Rome, Italy"
                className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3 pl-12 pr-4 font-semibold text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-600 dark:text-white/70">Start date</span>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(event) => updateField("startDate", event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3 pl-12 pr-4 font-semibold text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:[color-scheme:dark]"
                />
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-600 dark:text-white/70">End date</span>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(event) => updateField("endDate", event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3 pl-12 pr-4 font-semibold text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:[color-scheme:dark]"
                />
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-600 dark:text-white/70">Budget</span>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  value={form.totalBudget}
                  onChange={(event) => updateField("totalBudget", event.target.value)}
                  placeholder="2500"
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3 pl-12 pr-4 font-semibold text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-600 dark:text-white/70">Currency</span>
              <select
                value={form.currency}
                onChange={(event) => updateField("currency", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-slate-900 dark:text-white"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="INR">INR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-600 dark:text-white/70">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="What do you want this trip to feel like?"
              rows={4}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </label>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-white/70">
              <Image className="h-4 w-4" />
              Cover image
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {defaultCovers.map((cover) => (
                <button
                  type="button"
                  key={cover}
                  onClick={() => updateField("imageUrl", cover)}
                  className={`h-24 overflow-hidden rounded-2xl border-2 transition ${
                    form.imageUrl === cover ? "border-indigo-500 shadow-lg shadow-indigo-500/20" : "border-transparent"
                  }`}
                >
                  <img src={cover} alt="Trip cover option" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {generateItinerary && (
            <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
              <span className="text-xl">✨</span>
              Magic AI will automatically generate a 3-day itinerary and packing list when you save!
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plane className="h-5 w-5" />}
              {saving ? "Saving..." : "Create Trip"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!form.destination) {
                  setError("Please enter a destination first to use Magic AI!");
                  return;
                }
                const destName = form.destination.split(',')[0];
                const sDate = form.startDate || new Date().toISOString().split('T')[0];
                const d = new Date(sDate);
                d.setDate(d.getDate() + 3);
                const eDate = form.endDate || d.toISOString().split('T')[0];
                
                setForm(current => ({
                  ...current,
                  title: current.title || `Getaway to ${destName}`,
                  startDate: sDate,
                  endDate: eDate,
                  description: current.description || `An amazing 3-day adventure in ${destName} generated by Magic AI.`,
                  totalBudget: current.totalBudget || "1500",
                }));
                
                setGenerateItinerary(true);
                setSuccess("Magic AI has filled out your trip details! Feel free to edit anything before saving.");
                setError("");
              }}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-lg shadow-purple-500/25 transition hover:from-purple-600 hover:to-indigo-600 disabled:opacity-60"
            >
              <span className="text-xl leading-none">✨</span>
              Magic Generate
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-2xl border border-slate-200 bg-white/70 px-6 py-3 font-bold text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>

      <aside className="relative min-h-[520px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-2xl dark:border-white/10">
        <img src={form.imageUrl} alt={previewDestination} className="absolute inset-0 h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-md">
            <MapPin className="h-4 w-4" />
            {previewDestination}
          </div>
          <h2 className="mb-4 text-4xl font-black text-white">{previewTitle}</h2>
          <div className="grid gap-3 text-sm font-semibold text-white/85">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
              {form.startDate || "Start date"} to {form.endDate || "End date"}
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
              Budget: {form.totalBudget ? `${form.currency} ${form.totalBudget}` : "Not set"}
            </div>
          </div>
        </div>
      </aside>
    </motion.div>
  );
};

export default TripCreate;
