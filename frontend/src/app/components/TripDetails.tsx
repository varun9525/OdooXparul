import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { mockTrips } from '../data';
import { 
  ArrowLeft, MapPin, Calendar, CreditCard, 
  ListChecks, Map as MapIcon, Plane, Bed, Utensils, 
  Activity, GripVertical, Plus, Check, Share2 
} from 'lucide-react';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

type Tab = 'itinerary' | 'budget' | 'packing';

export function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('itinerary');
  
  // Local state for mutations
  const initialTrip = mockTrips.find(t => t.id === id);
  const [trip, setTrip] = useState(initialTrip);

  if (!trip) return <div className="p-10 text-white">Trip not found</div>;

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Header Banner */}
      <div className="h-64 relative shrink-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${trip.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/80 to-transparent" />
        
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 p-3 rounded-xl glass-panel text-white hover:bg-white/20 transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button 
          onClick={() => window.open(`/share/${trip.id}`, '_blank')}
          className="absolute top-6 right-6 p-3 rounded-xl glass-panel text-white hover:bg-white/20 transition-colors z-10 flex items-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-medium">Share</span>
        </button>

        <div className="absolute bottom-6 left-10">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <div className="flex items-center gap-2 text-indigo-400 mb-2 font-medium tracking-widest uppercase text-sm">
              <MapPin className="w-4 h-4" />
              {trip.destination}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{trip.title}</h1>
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(trip.startDate), 'MMMM d')} - {format(new Date(trip.endDate), 'MMMM d, yyyy')}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-10 gap-8 border-b border-white/10 shrink-0">
        <TabButton active={activeTab === 'itinerary'} onClick={() => setActiveTab('itinerary')} icon={<MapIcon className="w-4 h-4"/>} label="Itinerary" />
        <TabButton active={activeTab === 'budget'} onClick={() => setActiveTab('budget')} icon={<CreditCard className="w-4 h-4"/>} label="Budget" />
        <TabButton active={activeTab === 'packing'} onClick={() => setActiveTab('packing')} icon={<ListChecks className="w-4 h-4"/>} label="Packing" />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-10 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'itinerary' && (
            <ItineraryView key="itinerary" items={trip.itinerary} setItems={(items) => setTrip({...trip, itinerary: items})} />
          )}
          {activeTab === 'budget' && (
            <BudgetView key="budget" budget={trip.budget} />
          )}
          {activeTab === 'packing' && (
            <PackingView key="packing" items={trip.packingList} setItems={(items) => setTrip({...trip, packingList: items})} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`py-4 flex items-center gap-2 relative transition-colors ${active ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}
    >
      {icon}
      <span className="font-medium">{label}</span>
      {active && (
        <motion.div 
          layoutId="active-tab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
        />
      )}
    </button>
  );
}

// --- VIEWS ---

function ItineraryView({ items, setItems }: { items: any[], setItems: (items: any[]) => void }) {
  const getIcon = (type: string) => {
    switch(type) {
      case 'flight': return <Plane className="w-5 h-5 text-sky-400" />;
      case 'accommodation': return <Bed className="w-5 h-5 text-indigo-400" />;
      case 'dining': return <Utensils className="w-5 h-5 text-orange-400" />;
      default: return <Activity className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      className="max-w-3xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Your Plan</h2>
        <button className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No items planned yet.</div>
      ) : (
        <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-4">
          {items.map((item) => (
            <Reorder.Item key={item.id} value={item} className="cursor-grab active:cursor-grabbing">
              <div className="glass-panel-heavy rounded-2xl p-5 flex items-center gap-5 hover:bg-white/5 transition-colors group">
                <GripVertical className="text-gray-600 group-hover:text-gray-400 w-5 h-5 shrink-0" />
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-white font-medium">{item.time}</div>
                  <div className="text-gray-500 text-sm">{format(new Date(item.date), 'MMM d')}</div>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </motion.div>
  );
}

function BudgetView({ budget }: { budget: any }) {
  // Mock data for chart
  const chartData = [
    { name: 'Day 1', spent: 150 },
    { name: 'Day 2', spent: 300 },
    { name: 'Day 3', spent: 450 },
    { name: 'Day 4', spent: 300 },
    { name: 'Day 5', spent: 600 },
    { name: 'Day 6', spent: 800 },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Total Card */}
        <div className="lg:col-span-1 glass-panel-heavy rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
          <h3 className="text-gray-400 font-medium mb-2">Total Budget</h3>
          <div className="text-5xl font-bold text-white mb-8">
            ${budget.total.toLocaleString()}
          </div>
          
          <div className="space-y-4">
            {budget.items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0 last:pb-0">
                <div>
                  <div className="text-white font-medium">{item.category}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
                <div className="text-indigo-300 font-semibold">${item.amount}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Card */}
        <div className="lg:col-span-2 glass-panel-heavy rounded-3xl p-8 flex flex-col">
          <h3 className="text-white font-medium mb-6">Spending Trend</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs key="defs">
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis key="xaxis" dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} dy={10} />
                <YAxis key="yaxis" stroke="#9ca3af" axisLine={false} tickLine={false} dx={-10} tickFormatter={(value) => `$${value}`} />
                <RechartsTooltip 
                  key="tooltip"
                  contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#c7d2fe' }}
                />
                <Area key="area" type="monotone" dataKey="spent" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSpent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

function PackingView({ items, setItems }: { items: any[], setItems: (items: any[]) => void }) {
  const togglePacked = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-3xl mx-auto">
      {categories.map(category => {
        const categoryItems = items.filter(i => i.category === category);
        const packedCount = categoryItems.filter(i => i.packed).length;
        const progress = (packedCount / categoryItems.length) * 100;

        return (
          <div key={category} className="mb-10">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-xl font-bold text-white">{category}</h3>
              <span className="text-sm text-gray-500">{packedCount} / {categoryItems.length} packed</span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mb-6">
              <motion.div 
                className="h-full bg-indigo-500" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryItems.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => togglePacked(item.id)}
                  className={`glass-panel rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all duration-300 ${item.packed ? 'opacity-50' : 'hover:bg-white/5'}`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${item.packed ? 'bg-indigo-500 text-white' : 'border border-gray-600 text-transparent'}`}>
                    <Check className="w-4 h-4" />
                  </div>
                  <span className={`text-lg transition-all ${item.packed ? 'text-gray-500 line-through' : 'text-white'}`}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}