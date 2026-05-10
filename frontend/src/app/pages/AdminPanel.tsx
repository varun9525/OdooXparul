import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Map, DollarSign, Activity } from "lucide-react";
import { useTheme } from "next-themes";

const data = [
  { name: 'Jan', users: 4000, revenue: 2400 },
  { name: 'Feb', users: 3000, revenue: 1398 },
  { name: 'Mar', users: 2000, revenue: 9800 },
  { name: 'Apr', users: 2780, revenue: 3908 },
  { name: 'May', users: 1890, revenue: 4800 },
  { name: 'Jun', users: 2390, revenue: 3800 },
  { name: 'Jul', users: 3490, revenue: 4300 },
];

const pieData = [
  { name: 'Flights', value: 400, color: '#8b5cf6' },
  { name: 'Hotels', value: 300, color: '#ec4899' },
  { name: 'Tours', value: 300, color: '#10b981' },
  { name: 'Cars', value: 200, color: '#3b82f6' },
];

const AdminPanel = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-8 py-4 sunrise-section"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Users", value: "24,592", icon: Users, color: "text-indigo-500 dark:text-indigo-400" },
          { title: "Active Trips", value: "1,204", icon: Map, color: "text-green-500 dark:text-green-400" },
          { title: "Revenue", value: "$84,390", icon: DollarSign, color: "text-yellow-600 dark:text-yellow-400" },
          { title: "Bookings Today", value: "342", icon: Activity, color: "text-pink-500 dark:text-pink-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-gray-300/50 dark:border-white/20 p-6 rounded-3xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-white/60 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            </div>
            <div className={`p-4 bg-gray-100 dark:bg-white/5 rounded-2xl ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/50 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-xl h-96">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">User Growth & Revenue</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs key="defs">
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)'} vertical={false} />
              <XAxis key="xaxis" dataKey="name" stroke={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} tick={{ fill: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }} />
              <YAxis key="yaxis" stroke={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} tick={{ fill: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }} />
              <Tooltip key="tooltip" contentStyle={{ backgroundColor: isDark ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.95)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: isDark ? '#e2e8f0' : '#0f172a' }} />
              <Area key="area" type="monotone" dataKey="users" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/50 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-xl h-96 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Booking Categories</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  key="pie"
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip key="tooltip" contentStyle={{ backgroundColor: isDark ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.95)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: isDark ? '#e2e8f0' : '#0f172a' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-sm text-gray-700 dark:text-white/80">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
