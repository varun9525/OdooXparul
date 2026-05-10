import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { motion } from "motion/react";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { budgetAPI, BudgetItem } from "../../services/api";

const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#06b6d4"];

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount || 0);

const BudgetView = ({
  tripId,
  totalBudget,
  currency,
  items,
  onChanged,
}: {
  tripId: string;
  totalBudget: number;
  currency: string;
  items: BudgetItem[];
  onChanged: () => Promise<void> | void;
}) => {
  const [form, setForm] = useState({ category: "", amount: "", date: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ category: "", amount: "", date: "", description: "" });

  const totals = useMemo(() => {
    const spent = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const byCategory = items.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.amount || 0);
      return acc;
    }, {});

    const byDay = items.reduce<Record<string, number>>((acc, item) => {
      acc[item.date] = (acc[item.date] || 0) + Number(item.amount || 0);
      return acc;
    }, {});

    return {
      spent,
      remaining: Number(totalBudget || 0) - spent,
      categoryData: Object.entries(byCategory).map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length],
      })),
      dayData: Object.entries(byDay).map(([day, spent]) => ({ day, spent })),
    };
  }, [items, totalBudget]);

  const addItem = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.category || !form.amount || !form.date) return;

    setSaving(true);
    try {
      await budgetAPI.addBudgetItem(tripId, {
        category: form.category,
        amount: Number(form.amount),
        date: form.date,
        description: form.description,
      });
      setForm({ category: "", amount: "", date: "", description: "" });
      await onChanged();
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    await budgetAPI.deleteBudgetItem(tripId, itemId);
    await onChanged();
  };

  const startEdit = (item: BudgetItem) => {
    setEditingId(item.id);
    setEditForm({
      category: item.category,
      amount: String(item.amount),
      date: item.date,
      description: item.description || "",
    });
  };

  const saveEdit = async () => {
    if (!editingId || !editForm.category || !editForm.amount || !editForm.date) return;

    setSaving(true);
    try {
      await budgetAPI.updateBudgetItem(tripId, editingId, {
        category: editForm.category,
        amount: Number(editForm.amount),
        date: editForm.date,
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
    setEditForm({ category: "", amount: "", date: "", description: "" });
  };

  return (
    <div className="space-y-8 py-4">
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Total Budget", value: formatMoney(totalBudget, currency), tone: "text-slate-900 dark:text-white" },
          { label: "Total Spent", value: formatMoney(totals.spent, currency), tone: "text-red-600 dark:text-red-400" },
          { label: "Remaining", value: formatMoney(totals.remaining, currency), tone: "text-green-600 dark:text-green-400" },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5"
          >
            <p className="text-sm text-slate-500 dark:text-white/60">{item.label}</p>
            <p className={`text-3xl font-black ${item.tone}`}>{item.value}</p>
          </motion.div>
        ))}
      </div>

      <form onSubmit={addItem} className="grid gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5 md:grid-cols-[1fr_120px_150px_1fr_auto]">
        <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="rounded-xl border border-slate-200 bg-white/70 px-3 py-3 text-sm font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
        <input type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Amount" className="rounded-xl border border-slate-200 bg-white/70 px-3 py-3 text-sm font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-xl border border-slate-200 bg-white/70 px-3 py-3 text-sm font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:[color-scheme:dark]" />
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="rounded-xl border border-slate-200 bg-white/70 px-3 py-3 text-sm font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
        <button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white disabled:opacity-60">
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="h-80 rounded-2xl border border-slate-200 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
          <h3 className="mb-4 text-lg font-black text-slate-900 dark:text-white">Expenses by Category</h3>
          {totals.categoryData.length === 0 ? (
            <div className="flex h-56 items-center justify-center text-sm font-semibold text-slate-500 dark:text-white/50">No expenses yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={totals.categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={5} dataKey="value" stroke="none">
                  {totals.categoryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="h-80 rounded-2xl border border-slate-200 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
          <h3 className="mb-4 text-lg font-black text-slate-900 dark:text-white">Daily Spending</h3>
          {totals.dayData.length === 0 ? (
            <div className="flex h-56 items-center justify-center text-sm font-semibold text-slate-500 dark:text-white/50">No daily spending yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={totals.dayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "currentColor", fontSize: 11 }} />
                <YAxis tick={{ fill: "currentColor", fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="spent" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          editingId === item.id ? (
            <div key={item.id} className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-500/30 dark:bg-indigo-500/20">
              <div className="grid gap-2 mb-3 md:grid-cols-[1fr_120px_150px_1fr]">
                <input value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} placeholder="Category" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
                <input type="number" min="0" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} placeholder="Amount" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
                <input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:[color-scheme:dark]" />
                <input value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
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
            <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
              <div>
                <h4 className="font-black text-slate-900 dark:text-white">{item.category}</h4>
                <p className="text-sm text-slate-500 dark:text-white/55">{item.description || item.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-slate-900 dark:text-white">{formatMoney(item.amount, currency)}</span>
                <button onClick={() => startEdit(item)} className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => deleteItem(item.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default BudgetView;
