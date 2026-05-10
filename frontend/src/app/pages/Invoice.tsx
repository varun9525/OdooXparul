import { motion } from "motion/react";
import { Download, Printer } from "lucide-react";

const Invoice = () => {
  const invoiceItems = [
    { id: 1, desc: "Flight Bookings (JAL - LAX to NRT)", qty: 2, price: 800, total: 1600 },
    { id: 2, desc: "Hotel Booking (Shinjuku Prince Hotel)", qty: 14, price: 150, total: 2100 },
    { id: 3, desc: "Mt. Fuji Tour Package", qty: 2, price: 120, total: 240 },
  ];

  const subtotal = invoiceItems.reduce((acc, item) => acc + item.total, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoice Details</h1>
        <div className="flex gap-4">
          <button className="bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-gray-300/50 dark:border-white/20 text-gray-700 dark:text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      <div className="bg-white text-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Paid Stamp */}
        <div className="absolute top-12 right-12 border-4 border-green-500 text-green-500 rounded-lg px-4 py-1 text-2xl font-black uppercase tracking-widest transform rotate-12 opacity-80">
          Paid in Full
        </div>

        <div className="flex justify-between border-b pb-8 mb-8">
          <div>
            <h2 className="text-3xl font-black text-indigo-600 mb-2">Traveloop</h2>
            <p className="text-slate-500 text-sm">123 Wanderlust Way<br/>San Francisco, CA 90210<br/>billing@traveloop.com</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold text-slate-800">INVOICE</h3>
            <p className="text-slate-500 text-sm mt-1">#INV-2025-001</p>
            <p className="text-slate-500 text-sm">Date: Sep 01, 2025</p>
          </div>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Billed To:</p>
            <p className="font-bold text-slate-800">Alex Traveler</p>
            <p className="text-slate-500 text-sm">alex.travels@example.com</p>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="py-3 font-bold text-slate-800 uppercase text-sm">Description</th>
                <th className="py-3 font-bold text-slate-800 uppercase text-sm text-center">Qty</th>
                <th className="py-3 font-bold text-slate-800 uppercase text-sm text-right">Price</th>
                <th className="py-3 font-bold text-slate-800 uppercase text-sm text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((item, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-4 text-slate-600">{item.desc}</td>
                  <td className="py-4 text-slate-600 text-center">{item.qty}</td>
                  <td className="py-4 text-slate-600 text-right">${item.price.toFixed(2)}</td>
                  <td className="py-4 text-slate-800 font-bold text-right">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-indigo-600 border-t-2 border-slate-200 pt-3">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Invoice;
