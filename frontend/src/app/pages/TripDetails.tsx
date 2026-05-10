import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Map, DollarSign, ListChecks, FileText, Share2, Printer } from "lucide-react";
import { useNavigate, useParams } from "react-router";

// Sub-components
import ItineraryBuilder from "../components/ItineraryBuilder";
import BudgetView from "../components/BudgetView";
import ChecklistView from "../components/ChecklistView";
import TripNotesView from "../components/TripNotesView";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("itinerary");

  const tabs = [
    { id: "itinerary", label: "Itinerary", icon: Map },
    { id: "budget", label: "Budget", icon: DollarSign },
    { id: "checklist", label: "Checklist", icon: ListChecks },
    { id: "notes", label: "Notes", icon: FileText },
  ];

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto pb-8 sunrise-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white/50 dark:bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md">
            <img src="https://images.unsplash.com/photo-1561503972-839d0c56de17?q=80&w=200" alt="Tokyo" className="w-full h-full object-cover opacity-90 dark:opacity-100" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-1">Tokyo Adventure (Trip #{id || 'New'})</h1>
            <p className="text-slate-500 dark:text-white/60 font-medium">Sep 10 - Sep 24 • 14 Days</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/share/${id}`)}
            className="flex items-center gap-2 bg-white/70 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white px-5 py-2.5 rounded-xl transition-all shadow-sm font-semibold backdrop-blur-sm"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button 
            onClick={() => navigate('/invoice')}
            className="flex items-center gap-2 bg-white/70 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white px-5 py-2.5 rounded-xl transition-all shadow-sm font-semibold backdrop-blur-sm"
          >
            <Printer className="w-4 h-4" /> Invoice
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 hide-scrollbar px-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-indigo-600/90 dark:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-105 backdrop-blur-sm"
                : "bg-white/40 dark:bg-white/5 text-slate-600 dark:text-white/70 hover:bg-white/50 dark:hover:bg-white/10 border border-slate-200 dark:border-transparent backdrop-blur-sm"
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl relative min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === "itinerary" && <ItineraryBuilder />}
            {activeTab === "budget" && <BudgetView />}
            {activeTab === "checklist" && <ChecklistView />}
            {activeTab === "notes" && <TripNotesView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TripDetails;
