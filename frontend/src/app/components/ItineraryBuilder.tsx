import { useMemo, useState } from "react";
import { Clock, MapPin, Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { format, parseISO } from "date-fns";
import { itineraryAPI, ItineraryItem } from "../../services/api";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", date: "", time: "", location: "", type: "activity", description: "" });

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

  const startEdit = (item: ItineraryItem) => {
    setEditingId(item.id);
    setEditForm({
      title: item.title,
      date: item.date,
      time: item.time || "",
      location: item.location || "",
      type: item.type,
      description: item.description || "",
    });
  };

  const saveEdit = async () => {
    if (!editingId || !editForm.title || !editForm.date) return;

    setSaving(true);
    try {
      await itineraryAPI.updateItineraryItem(tripId, editingId, {
        title: editForm.title,
        date: editForm.date,
        time: editForm.time,
        location: editForm.location,
        type: editForm.type,
        description: editForm.description,
      });
      setEditingId(null);
      await onChanged();
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", date: "", time: "", location: "", type: "activity", description: "" });
  };

  return (
    <div className="mx-auto max-w-4xl py-4">
      <h2 className="mb-6 text-2xl font-black text-slate-900 dark:text-white">Itinerary</h2>

      <form onSubmit={addActivity} className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5 md:grid-cols-2">
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Activity title" className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
        <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
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
                editingId === activity.id ? (
                  <div key={activity.id} className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-500/20">
                    <div className="space-y-3 mb-4">
                      <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Activity title" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
                      <input value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} placeholder="Location" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:[color-scheme:dark]" />
                        <input type="time" value={editForm.time} onChange={(e) => setEditForm({ ...editForm, time: e.target.value })} className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:[color-scheme:dark]" />
                      </div>
                      <select value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white">
                        <option value="activity">Activity</option>
                        <option value="flight">Flight</option>
                        <option value="accommodation">Accommodation</option>
                        <option value="dining">Dining</option>
                      </select>
                      <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" rows={3} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveEdit} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 font-bold text-white transition hover:bg-green-500 disabled:opacity-60 flex-1">
                        <Check className="h-4 w-4" />
                        Save
                      </button>
                      <button onClick={cancelEdit} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-400 px-4 py-2 font-bold text-white transition hover:bg-slate-500 disabled:opacity-60">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
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
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(activity)} className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteActivity(activity.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
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
