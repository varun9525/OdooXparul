import { useMemo, useState } from "react";
import { Check, Filter, Plus, Trash2, Edit2, X } from "lucide-react";
import { packingAPI, PackingItem } from "../../services/api";

const ChecklistView = ({
  tripId,
  items,
  onChanged,
}: {
  tripId: string;
  items: PackingItem[];
  onChanged: () => Promise<void> | void;
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", category: "" });
  const [saving, setSaving] = useState(false);

  const visibleItems = useMemo(() => {
    if (filter === "packed") return items.filter((item) => item.packed);
    if (filter === "open") return items.filter((item) => !item.packed);
    return items;
  }, [filter, items]);

  const progress = Math.round((items.filter((item) => item.packed).length / items.length) * 100) || 0;

  const addItem = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    await packingAPI.addPackingItem(tripId, { name: name.trim(), category: category.trim() || undefined });
    setName("");
    setCategory("");
    await onChanged();
  };

  const toggleCheck = async (item: PackingItem) => {
    await packingAPI.updatePackingItem(tripId, item.id, !item.packed);
    await onChanged();
  };

  const deleteItem = async (itemId: string) => {
    await packingAPI.deletePackingItem(tripId, itemId);
    await onChanged();
  };

  const startEdit = (item: PackingItem) => {
    setEditingId(item.id);
    setEditForm({ name: item.name, category: item.category || "" });
  };

  const saveEdit = async () => {
    if (!editingId || !editForm.name.trim()) return;

    setSaving(true);
    try {
      // Since packing API only has updatePackingItem for packed status, we'll need to delete and recreate
      // Or add a new update method. For now, we'll update the component to support editing via delete/add pattern
      await packingAPI.deletePackingItem(tripId, editingId);
      await packingAPI.addPackingItem(tripId, { name: editForm.name.trim(), category: editForm.category.trim() || undefined });
      setEditingId(null);
      await onChanged();
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", category: "" });
  };

  return (
    <div className="mx-auto max-w-3xl py-4">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Packing Checklist</h2>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-white">
          <Filter className="h-4 w-4" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-transparent outline-none dark:text-white">
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="packed">Packed</option>
          </select>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
        <div className="mb-2 flex justify-between text-sm text-slate-500 dark:text-white/60">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/10">
          <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        {visibleItems.map((item) => (
          editingId === item.id ? (
            <div key={item.id} className="flex items-center gap-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-500/30 dark:bg-indigo-500/20">
              <div className="min-w-0 flex-1 space-y-2">
                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Item name" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
                <input value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} placeholder="Category" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
              </div>
              <div className="flex gap-2">
                <button onClick={saveEdit} disabled={saving} className="rounded-lg p-2 bg-green-600 text-white hover:bg-green-500 disabled:opacity-60">
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={cancelEdit} disabled={saving} className="rounded-lg p-2 bg-slate-400 text-white hover:bg-slate-500 disabled:opacity-60">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              key={item.id}
              className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                item.packed
                  ? "border-indigo-300 bg-indigo-100 text-slate-600 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-white/60"
                  : "border-slate-200 bg-white/70 text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              }`}
            >
              <button
                onClick={() => toggleCheck(item)}
                className={`flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
                  item.packed ? "border-indigo-500 bg-indigo-500" : "border-slate-400 dark:border-white/30"
                }`}
              >
                {item.packed && <Check className="h-4 w-4 text-white" />}
              </button>
              <div className="min-w-0 flex-1">
                <span className={`font-bold ${item.packed ? "line-through" : ""}`}>{item.name}</span>
                {item.category && <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/35">{item.category}</p>}
              </div>
              <button onClick={() => startEdit(item)} className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10">
                <Edit2 className="h-4 w-4" />
              </button>
              <button onClick={() => deleteItem(item.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )
        ))}
      </div>

      {visibleItems.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm font-semibold text-slate-500 dark:border-white/15 dark:text-white/50">
          No checklist items.
        </div>
      )}

      <form onSubmit={addItem} className="mt-6 grid gap-3 sm:grid-cols-[1fr_180px_auto]">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add packing item" className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white" />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white" />
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-500">
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>
    </div>
  );
};

export default ChecklistView;
