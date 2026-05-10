import { useState } from "react";
import { Check, Plus, Filter } from "lucide-react";

const ChecklistView = () => {
  const [items, setItems] = useState([
    { id: 1, text: "Passport", checked: true },
    { id: 2, text: "Flight Tickets (printed)", checked: true },
    { id: 3, text: "Travel Insurance", checked: false },
    { id: 4, text: "Hotel Booking confirmation", checked: false },
    { id: 5, text: "Casual Shirts", checked: false },
    { id: 6, text: "Trousers / jeans", checked: false },
  ]);

  const toggleCheck = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100) || 0;

  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Packing Checklist</h2>
        <div className="flex gap-4">
           <div className="bg-white/70 dark:bg-white/10 border border-gray-300/50 dark:border-white/20 px-4 py-2 rounded-full text-gray-700 dark:text-white text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </div>
        </div>
      </div>

      <div className="mb-8 bg-white/70 dark:bg-white/5 p-4 rounded-2xl border border-gray-300/50 dark:border-white/10">
        <div className="flex justify-between text-sm text-gray-600 dark:text-white/60 mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
              item.checked ? 'bg-indigo-100 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/30 text-gray-600 dark:text-white/60' : 'bg-white/70 dark:bg-white/5 border-gray-300/50 dark:border-white/10 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-white/10'
            }`}
          >
            <div className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
              item.checked ? 'bg-indigo-500 border-indigo-500' : 'border-gray-400 dark:border-white/30'
            }`}>
              {item.checked && <Check className="w-4 h-4 text-white" />}
            </div>
            <span className={item.checked ? 'line-through' : ''}>{item.text}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <input type="text" placeholder="+ Add New Item" className="flex-1 bg-white/70 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-colors">
          Add
        </button>
      </div>
    </div>
  );
};

export default ChecklistView;
