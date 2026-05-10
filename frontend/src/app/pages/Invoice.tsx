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

      <div className="relative overflow-hidden rounded-3xl bg-white p-8 text-slate-900 shadow-2xl md:p-12 print:shadow-none print:p-0 print:border-none">
        <div className="absolute right-12 top-12 rotate-12 rounded-lg border-4 border-indigo-500 px-4 py-1 text-2xl font-black uppercase tracking-widest text-indigo-500 opacity-20 print:hidden">
          OFFLINE
        </div>

        <div className="mb-8 flex justify-between border-b pb-8">
          <div>
            <h2 className="mb-2 text-3xl font-black text-indigo-600">Traveloop Trip Report</h2>
            <p className="text-sm text-slate-500">Comprehensive itinerary and packing list.<br />Designed for offline travel use.</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold text-slate-800">TRIP DETAILS</h3>
            <p className="mt-1 text-sm text-slate-500">#{trip.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-sm text-slate-500">Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-8 flex justify-between rounded-xl bg-slate-50 p-6">
          <div>
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-500">Traveler:</p>
            <p className="font-bold text-slate-800">{`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.username}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-500">Destination:</p>
            <p className="font-bold text-slate-800 text-xl text-indigo-600">{trip.title}</p>
            <p className="text-sm font-semibold text-slate-700">{trip.destination}</p>
            <p className="text-sm text-slate-500">{trip.startDate} to {trip.endDate}</p>
          </div>
        </div>

        {/* Itinerary Section */}
        <div className="mb-10">
          <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-4 text-slate-800">Itinerary Schedule</h3>
          {trip.itinerary && trip.itinerary.length > 0 ? (
            <div className="space-y-4">
              {Object.entries(trip.itinerary.reduce<Record<string, any[]>>((acc, item) => {
                acc[item.date] = acc[item.date] || [];
                acc[item.date].push(item);
                return acc;
              }, {})).map(([date, dayItems]) => (
                <div key={date} className="mb-4">
                  <h4 className="font-bold text-indigo-600 mb-2">{new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</h4>
                  <ul className="space-y-2">
                    {dayItems.map((item) => (
                      <li key={item.id} className="flex gap-4 border-l-2 border-slate-200 pl-4 py-1">
                        <span className="w-16 font-semibold text-slate-500 text-sm">{item.time || 'All day'}</span>
                        <div>
                          <p className="font-bold text-slate-800">{item.title} <span className="text-xs font-normal text-slate-500 ml-2 bg-slate-100 px-2 py-0.5 rounded-full">{item.type}</span></p>
                          {item.location && <p className="text-sm text-slate-600">{item.location}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic">No itinerary planned yet.</p>
          )}
        </div>

        {/* Packing List Section */}
        <div className="mb-10">
          <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-4 text-slate-800">Packing Checklist</h3>
          {trip.packingList && trip.packingList.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(trip.packingList.reduce<Record<string, any[]>>((acc, item) => {
                const cat = item.category || 'Uncategorized';
                acc[cat] = acc[cat] || [];
                acc[cat].push(item);
                return acc;
              }, {})).map(([category, items]) => (
                <div key={category}>
                  <h4 className="font-bold text-slate-700 mb-2">{category}</h4>
                  <ul className="space-y-1">
                    {items.map((item) => (
                      <li key={item.id} className="flex items-center gap-2 text-slate-600 text-sm">
                        <span className="h-4 w-4 rounded border border-slate-300 inline-block"></span>
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic">No packing items added yet.</p>
          )}
        </div>

        {/* Budget Section */}
        <div className="mb-8 page-break-inside-avoid">
          <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-4 text-slate-800">Budget Details</h3>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="py-2 font-bold uppercase text-slate-600">Category</th>
                <th className="py-2 font-bold uppercase text-slate-600">Description</th>
                <th className="py-2 text-right font-bold uppercase text-slate-600">Cost</th>
              </tr>
            </thead>
            <tbody>
              {totals.items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-2 text-slate-600 font-medium">{item.category}</td>
                  <td className="py-2 text-slate-500">{item.description || item.date}</td>
                  <td className="py-2 text-right font-bold text-slate-800">{formatMoney(item.amount)}</td>
                </tr>
              ))}
              {totals.items.length === 0 && (
                <tr><td className="py-4 text-center text-slate-500 italic" colSpan={3}>No budget expenses recorded.</td></tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <div className="w-64 space-y-2 bg-slate-50 p-4 rounded-xl">
              <div className="flex justify-between text-slate-600 text-sm"><span>Planned Budget</span><span>{formatMoney(trip.totalBudget)}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-indigo-600"><span>Total Spent</span><span>{formatMoney(totals.subtotal)}</span></div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Invoice;
