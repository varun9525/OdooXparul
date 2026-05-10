import { useMemo, useState } from "react";
import { Clock, MapPin, Plus, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { itineraryAPI, ItineraryItem } from "../../services/api";
import { LocationAutocomplete } from "./LocationAutocomplete";

const formatDay = (date: string) => {
  try {
    return format(parseISO(date), "MMM d, yyyy");
  } catch {
    return date;
  }
};

const ItineraryBuilder = ({
  tripId,
  items,
  onChanged,
}: {
  tripId: string;
  items: ItineraryItem[];
  onChanged: () => Promise<void> | void;
}) => {
  const [form, setForm] = useState({ title: "", date: "", time: "", location: "", type: "activity", description: "" });
  const [saving, setSaving] = useState(false);

  const grouped = useMemo(() => {
    return items.reduce<Record<string, ItineraryItem[]>>((acc, item) => {
      acc[item.date] = acc[item.date] || [];
      acc[item.date].push(item);
      return acc;
    }, {});
  }, [items]);

  const addActivity = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title || !form.date) return;

    setSaving(true);
    try {
      await itineraryAPI.addItineraryItem(tripId, {
        title: form.title,
        date: form.date,
        time: form.time,
        location: form.location,
        type: form.type,
        description: form.description,
      });
      setForm({ title: "", date: "", time: "", location: "", type: "activity", description: "" });
      await onChanged();
    } finally {
      setSaving(false);
    }
  };

  const deleteActivity = async (itemId: string) => {
    await itineraryAPI.deleteItineraryItem(tripId, itemId);
    await onChanged();
  };

  return (
    <div className="mx-auto max-w-4xl py-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Itinerary</h2>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["Hotel Check-in", "Flight Departure", "Breakfast", "Lunch", "Dinner", "City Tour", "Museum Visit"].map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setForm({ ...form, title: suggestion, type: suggestion.toLowerCase().includes("flight") ? "flight" : suggestion.toLowerCase().includes("hotel") ? "accommodation" : suggestion.toLowerCase().includes("fast") || suggestion.toLowerCase().includes("lunch") || suggestion.toLowerCase().includes("dinner") ? "dining" : "activity" })}
            className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
          >
            + {suggestion}
          </button>
        ))}
      </div>

      <form onSubmit={addActivity} className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5 md:grid-cols-2">
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Activity title" className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
        <LocationAutocomplete 
          value={form.location} 
          onChange={(val) => setForm({ ...form, location: val })} 
          placeholder="Location" 
          className="w-full rounded-xl border border-slate-200 bg-white/70 py-3 pl-12 pr-4 font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" 
        />
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:[color-scheme:dark]" />
        <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:[color-scheme:dark]" />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 font-semibold outline-none dark:border-white/10 dark:bg-slate-900 dark:text-white">
          <option value="activity">Activity</option>
          <option value="flight">Flight</option>
          <option value="accommodation">Accommodation</option>
          <option value="dining">Dining</option>
        </select>
        <button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-500 disabled:opacity-60">
          <Plus className="h-4 w-4" />
          Add Activity
        </button>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white md:col-span-2" />
      </form>

      <div className="space-y-8">
        {Object.entries(grouped).map(([date, dayItems], dayIndex) => (
          <section key={date} className="relative">
            <div className="mb-4 flex items-center gap-4">
              <div className="rounded-full border border-indigo-200 bg-indigo-100 px-4 py-1.5 text-sm font-black text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300">
                Day {dayIndex + 1}
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{formatDay(date)}</h3>
            </div>
            <div className="ml-8 space-y-4 border-l-2 border-slate-200 py-2 pl-8 dark:border-white/10">
              {dayItems.map((activity) => (
                <div key={activity.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white">{activity.title}</h4>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm font-semibold text-slate-500 dark:text-white/55">
                        {activity.time && <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{activity.time}</span>}
                        {activity.location && <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{activity.location}</span>}
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200">{activity.type}</span>
                      </div>
                      {activity.description && <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-white/55">{activity.description}</p>}
                    </div>
                    <button onClick={() => deleteActivity(activity.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm font-semibold text-slate-500 dark:border-white/15 dark:text-white/50">
            No itinerary items yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryBuilder;
