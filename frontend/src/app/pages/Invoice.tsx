import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Download, Loader2, Printer } from "lucide-react";
import { useParams } from "react-router";
import { tripAPI, Trip } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Invoice = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const response = await tripAPI.getTripById(id);
      setTrip(response.data);
      setLoading(false);
    };
    load();
  }, [id]);

  const totals = useMemo(() => {
    const items = trip?.budget?.items ?? [];
    const subtotal = items.reduce((acc, item) => acc + Number(item.amount || 0), 0);
    const tax = subtotal * 0.1;
    return { items, subtotal, tax, total: subtotal + tax };
  }, [trip]);

  if (loading || !trip) {
    return <div className="flex min-h-[420px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
  }

  const currency = trip.currency || "USD";
  const formatMoney = (amount: number) => new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount || 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-4xl py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Invoice Details</h1>
        <div className="flex gap-4">
          <button onClick={() => window.print()} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-slate-700 transition-all hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
            <Download className="h-4 w-4" />
            Save PDF
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white transition-all hover:bg-indigo-500">
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-white p-8 text-slate-900 shadow-2xl md:p-12">
        <div className="absolute right-12 top-12 rotate-12 rounded-lg border-4 border-green-500 px-4 py-1 text-2xl font-black uppercase tracking-widest text-green-500 opacity-80">
          Saved
        </div>

        <div className="mb-8 flex justify-between border-b pb-8">
          <div>
            <h2 className="mb-2 text-3xl font-black text-indigo-600">Traveloop</h2>
            <p className="text-sm text-slate-500">Trip planning invoice<br />Generated from your saved budget items</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold text-slate-800">INVOICE</h3>
            <p className="mt-1 text-sm text-slate-500">#{trip.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-sm text-slate-500">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-8 flex justify-between">
          <div>
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-500">Billed To:</p>
            <p className="font-bold text-slate-800">{`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.username}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-500">Trip:</p>
            <p className="font-bold text-slate-800">{trip.title}</p>
            <p className="text-sm text-slate-500">{trip.destination}</p>
          </div>
        </div>

        <div className="mb-8 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="py-3 text-sm font-bold uppercase text-slate-800">Description</th>
                <th className="py-3 text-center text-sm font-bold uppercase text-slate-800">Category</th>
                <th className="py-3 text-right text-sm font-bold uppercase text-slate-800">Total</th>
              </tr>
            </thead>
            <tbody>
              {totals.items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-4 text-slate-600">{item.description || item.date}</td>
                  <td className="py-4 text-center text-slate-600">{item.category}</td>
                  <td className="py-4 text-right font-bold text-slate-800">{formatMoney(item.amount)}</td>
                </tr>
              ))}
              {totals.items.length === 0 && (
                <tr><td className="py-8 text-center text-slate-500" colSpan={3}>No budget items yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{formatMoney(totals.subtotal)}</span></div>
            <div className="flex justify-between text-slate-600"><span>Tax (10%)</span><span>{formatMoney(totals.tax)}</span></div>
            <div className="flex justify-between border-t-2 border-slate-200 pt-3 text-xl font-bold text-indigo-600"><span>Total</span><span>{formatMoney(totals.total)}</span></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Invoice;
