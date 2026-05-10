import { useState } from "react";
import { Plus, Search } from "lucide-react";

const TripNotesView = () => {
  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trip Notes</h2>
        <button className="bg-white/70 dark:bg-white/10 border border-gray-300/50 dark:border-white/20 px-4 py-2 rounded-xl text-gray-700 dark:text-white text-sm flex items-center gap-2 hover:bg-white dark:hover:bg-white/20 transition-all">
          <Plus className="w-4 h-4" /> Add Note
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 w-5 h-5" />
        <input
          type="text"
          placeholder="Search notes..."
          className="w-full bg-white/70 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/70 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 p-6 rounded-2xl hover:bg-white dark:hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Hotel check-in details - Metro stop</h3>
              <span className="text-xs text-gray-500 dark:text-white/40">Sep 9, 2025</span>
            </div>
            <p className="text-gray-600 dark:text-white/60">Check in after 2pm, room 1402, breakfast included (7-10am). The nearest metro is Shinjuku station, exit B3.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripNotesView;
