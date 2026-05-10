import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'motion/react';

const data = [
  { name: 'Flights', value: 800, color: '#6366f1' },
  { name: 'Hotel', value: 1200, color: '#8b5cf6' },
  { name: 'Food', value: 400, color: '#ec4899' },
  { name: 'Activities', value: 300, color: '#10b981' },
];

const barData = [
  { day: 'Day 1', spent: 120 },
  { day: 'Day 2', spent: 80 },
  { day: 'Day 3', spent: 250 },
  { day: 'Day 4', spent: 90 },
];

const BudgetView = () => {
  return (
    <div className="space-y-8 py-4">
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/70 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 p-6 rounded-2xl flex flex-col justify-center items-center">
          <p className="text-gray-600 dark:text-white/60 text-sm">Total Budget</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">$3,000</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white/70 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 p-6 rounded-2xl flex flex-col justify-center items-center">
          <p className="text-gray-600 dark:text-white/60 text-sm">Total Spent</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">$2,700</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white/70 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 p-6 rounded-2xl flex flex-col justify-center items-center">
          <p className="text-gray-600 dark:text-white/60 text-sm">Remaining</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">$300</p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 h-80">
        <div className="bg-white/70 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Expenses by Category</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                key="pie"
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))' }} />
                ))}
              </Pie>
              <Tooltip 
                key="tooltip"
                contentStyle={{ backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/70 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Daily Spending</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis key="xaxis" dataKey="day" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.7)'}} />
              <YAxis key="yaxis" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.7)'}} />
              <Tooltip 
                key="tooltip"
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{ backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
              />
              <Bar key="bar" dataKey="spent" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BudgetView;
