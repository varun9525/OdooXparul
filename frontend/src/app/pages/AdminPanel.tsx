import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, DollarSign, Loader2, Map, Users } from "lucide-react";
import { notesAPI } from "../../services/api";

const colors = ["#8b5cf6", "#ec4899", "#10b981", "#3b82f6", "#f59e0b"];

const AdminPanel = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await notesAPI.getSummary();
        setSummary(response.data);
      } catch (err) {
        console.error("Failed to load admin data", err);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = window.setInterval(load, 20000);
    return () => window.clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex min-h-[420px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
  }

  if (!summary) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center text-slate-500">
        <Activity className="h-12 w-12 mb-4 text-slate-300" />
        <p>No dashboard data available right now.</p>
      </div>
    );
  }

  const stats = [
    { title: "Saved Trips", value: summary.trips, icon: Users, color: "text-indigo-500 dark:text-indigo-400" },
    { title: "Active Trips", value: summary.active, icon: Map, color: "text-green-500 dark:text-green-400" },
    { title: "Total Budget", value: `${summary.currency} ${summary.totalBudget}`, icon: DollarSign, color: "text-yellow-600 dark:text-yellow-400" },
    { title: "Total Spent", value: `${summary.currency} ${summary.totalSpent}`, icon: Activity, color: "text-pink-500 dark:text-pink-400" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-6xl space-y-8 py-4 sunrise-section">
      <h1 className="mb-8 text-3xl font-black text-slate-900 dark:text-white">Dashboard Overview</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white/50 p-6 shadow-xl backdrop-blur-xl dark:border-white/20 dark:bg-white/10">
            <div>
              <p className="mb-1 text-sm font-medium text-slate-500 dark:text-white/60">{stat.title}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
            <div className={`rounded-2xl bg-slate-100 p-4 dark:bg-white/5 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="h-96 rounded-3xl border border-slate-200 bg-white/50 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:col-span-2">
          <h3 className="mb-6 text-lg font-black text-slate-900 dark:text-white">Recent Trip Budgets</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.recentTrips}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" vertical={false} />
              <XAxis dataKey="title" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="totalBudget" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex h-96 flex-col rounded-3xl border border-slate-200 bg-white/50 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <h3 className="mb-2 text-lg font-black text-slate-900 dark:text-white">Budget Categories</h3>
          <div className="min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={summary.categoryTotals} innerRadius={58} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {summary.categoryTotals.map((entry: any, index: number) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
