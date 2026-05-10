import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertCircle,
  DollarSign,
  Loader2,
  Map,
  RefreshCw,
  Search,
  Shield,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { notesAPI } from "../../services/api";

const colors = ["#8b5cf6", "#ec4899", "#10b981", "#3b82f6", "#f59e0b", "#14b8a6"];

type AdminUser = {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  tripCount: number;
  totalBudget: number;
  totalSpent: number;
  lastTripEndDate?: string;
};

type TripInsight = {
  id: string;
  userId?: string;
  title: string;
  destination: string;
  status: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  totalSpent: number;
  utilization: number;
  currency?: string;
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const getHealthLabel = (utilization: number) => {
  if (utilization <= 60) return { label: "Healthy", tone: "text-emerald-500" };
  if (utilization <= 90) return { label: "Watch", tone: "text-amber-500" };
  return { label: "Critical", tone: "text-rose-500" };
};

const AdminPanel = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    setRefreshing(silent);
    try {
      const response = await notesAPI.getSummary();
      setSummary(response.data);
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
    const interval = window.setInterval(() => load(true), 25000);
    return () => window.clearInterval(interval);
  }, []);

  const users: AdminUser[] = summary?.users ?? [];
  const ongoingTrips: TripInsight[] = summary?.ongoingTrips ?? [];
  const tripAnalysis: TripInsight[] = summary?.tripAnalysis ?? [];
  const currency = summary?.currency || "USD";

  const filteredUsers = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return users;
    return users.filter((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      return fullName.includes(value) || user.username?.toLowerCase().includes(value) || user.email?.toLowerCase().includes(value);
    });
  }, [users, query]);

  const usersOverviewChart = [
    { name: "Users With Trips", value: summary?.usersWithTrips || 0 },
    { name: "Users Without Trips", value: summary?.usersWithoutTrips || 0 },
  ];

  const utilizationChart = tripAnalysis.slice(0, 8).map((trip) => ({
    name: trip.title,
    utilization: trip.utilization,
  }));

  const topStats = [
    { title: "Saved Trips", value: summary?.trips || 0, icon: Map, color: "text-indigo-500 dark:text-indigo-400" },
    { title: "Total Users", value: summary?.totalUsers || 0, icon: Users, color: "text-blue-500 dark:text-blue-400" },
    { title: "Total Budget", value: formatCurrency(summary?.totalBudget || 0, currency), icon: DollarSign, color: "text-yellow-500 dark:text-yellow-400" },
    { title: "Total Spent", value: formatCurrency(summary?.totalSpent || 0, currency), icon: Activity, color: "text-pink-500 dark:text-pink-400" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center text-slate-500">
        <AlertCircle className="mb-4 h-12 w-12 text-slate-300" />
        <p>No dashboard data available right now.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-7xl space-y-8 py-4 sunrise-section">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Admin Dashboard Overview</h1>
        <button
          type="button"
          onClick={() => load(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white/80"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {topStats.map((stat) => (
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

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">1. Manage Users</h2>
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search users"
              className="w-full rounded-xl border border-slate-200 bg-white/60 py-2.5 pl-9 pr-3 text-sm font-semibold outline-none dark:border-white/10 dark:bg-white/10 dark:text-white"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white/50 p-4 dark:border-white/10 dark:bg-white/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/55">Verified Accounts</p>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{summary.totalUsers || 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/50 p-4 dark:border-white/10 dark:bg-white/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/55">Users With Trips</p>
            <p className="mt-2 text-2xl font-black text-emerald-500">{summary.usersWithTrips || 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/50 p-4 dark:border-white/10 dark:bg-white/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/55">Inactive Travelers</p>
            <p className="mt-2 text-2xl font-black text-amber-500">{summary.usersWithoutTrips || 0}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/50 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100/70 dark:bg-white/10">
                <tr className="text-left text-slate-600 dark:text-white/70">
                  <th className="px-4 py-3 font-bold">User</th>
                  <th className="px-4 py-3 font-bold">Trips</th>
                  <th className="px-4 py-3 font-bold">Budget</th>
                  <th className="px-4 py-3 font-bold">Spent</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Last Trip</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.slice(0, 12).map((user) => {
                  const status = user.tripCount > 0 ? "Active" : "Dormant";
                  return (
                    <tr key={user.id} className="border-t border-slate-200/70 text-slate-700 dark:border-white/10 dark:text-white/80">
                      <td className="px-4 py-3">
                        <p className="font-bold">{`${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username}</p>
                        <p className="text-xs text-slate-500 dark:text-white/55">{user.email}</p>
                      </td>
                      <td className="px-4 py-3 font-bold">{user.tripCount}</td>
                      <td className="px-4 py-3">{formatCurrency(user.totalBudget || 0, currency)}</td>
                      <td className="px-4 py-3">{formatCurrency(user.totalSpent || 0, currency)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${status === "Active" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">{formatDate(user.lastTripEndDate)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">2. Recent Ongoing Trips</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ongoingTrips.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-6 text-sm font-semibold text-slate-500 dark:border-white/20 dark:bg-white/5 dark:text-white/55">
              No ongoing trips at the moment.
            </div>
          )}
          {ongoingTrips.map((trip) => (
            <div key={trip.id} className="rounded-2xl border border-slate-200 bg-white/50 p-5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-black text-slate-900 dark:text-white">{trip.title}</p>
                  <p className="text-sm font-semibold text-slate-500 dark:text-white/55">{trip.destination}</p>
                </div>
                <span className="rounded-full bg-indigo-500/15 px-2.5 py-1 text-xs font-bold text-indigo-500">{trip.status}</span>
              </div>
              <div className="space-y-1 text-xs text-slate-500 dark:text-white/60">
                <p>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
                <p>Spent {formatCurrency(trip.totalSpent || 0, trip.currency || currency)} of {formatCurrency(trip.totalBudget || 0, trip.currency || currency)}</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-white/10">
                <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" style={{ width: `${Math.min(100, Math.max(0, trip.utilization || 0))}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">3. Total Users Data Overview</h2>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white/50 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:col-span-2">
            <h3 className="mb-4 text-lg font-black text-slate-900 dark:text-white">User Activation Split</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usersOverviewChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {usersOverviewChart.map((entry, index) => (
                      <Cell key={entry.name} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/50 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <h3 className="mb-4 text-lg font-black text-slate-900 dark:text-white">User Summary</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between rounded-xl border border-slate-200/80 p-3 dark:border-white/10">
                <span className="font-semibold">Total Accounts</span>
                <span className="font-black">{summary.totalUsers || 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200/80 p-3 dark:border-white/10">
                <span className="font-semibold">Avg Trips / User</span>
                <span className="font-black">
                  {summary.totalUsers > 0 ? ((summary.trips || 0) / summary.totalUsers).toFixed(1) : "0.0"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200/80 p-3 dark:border-white/10">
                <span className="font-semibold">Avg Spend / User</span>
                <span className="font-black">{formatCurrency(summary.totalUsers > 0 ? (summary.totalSpent || 0) / summary.totalUsers : 0, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">4. Analysis of Every Trip</h2>
        <div className="grid gap-8 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white/50 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 xl:col-span-2">
            <h3 className="mb-4 text-lg font-black text-slate-900 dark:text-white">Trip Utilization Analysis</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={utilizationChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="utilization" fill="#8b5cf6" name="Budget Utilization %" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/50 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <h3 className="mb-4 text-lg font-black text-slate-900 dark:text-white">Category Spend Split</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={summary.categoryTotals || []} innerRadius={58} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                    {(summary.categoryTotals || []).map((entry: any, index: number) => (
                      <Cell key={entry.name} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/50 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100/70 dark:bg-white/10">
                <tr className="text-left text-slate-600 dark:text-white/70">
                  <th className="px-4 py-3 font-bold">Trip</th>
                  <th className="px-4 py-3 font-bold">Duration</th>
                  <th className="px-4 py-3 font-bold">Budget</th>
                  <th className="px-4 py-3 font-bold">Spent</th>
                  <th className="px-4 py-3 font-bold">Utilization</th>
                  <th className="px-4 py-3 font-bold">Health</th>
                </tr>
              </thead>
              <tbody>
                {tripAnalysis.slice(0, 12).map((trip) => {
                  const health = getHealthLabel(trip.utilization || 0);
                  return (
                    <tr key={trip.id} className="border-t border-slate-200/70 text-slate-700 dark:border-white/10 dark:text-white/80">
                      <td className="px-4 py-3">
                        <p className="font-bold">{trip.title}</p>
                        <p className="text-xs text-slate-500 dark:text-white/55">{trip.destination}</p>
                      </td>
                      <td className="px-4 py-3 text-xs">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</td>
                      <td className="px-4 py-3">{formatCurrency(trip.totalBudget || 0, trip.currency || currency)}</td>
                      <td className="px-4 py-3">{formatCurrency(trip.totalSpent || 0, trip.currency || currency)}</td>
                      <td className="px-4 py-3 font-bold">{trip.utilization || 0}%</td>
                      <td className={`px-4 py-3 font-bold ${health.tone}`}>{health.label}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">5. Operational Insights</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white/50 p-5 dark:border-white/10 dark:bg-white/10">
            <div className="mb-2 flex items-center gap-2 text-indigo-500">
              <Shield className="h-5 w-5" />
              <p className="font-black">Risk Watch</p>
            </div>
            <p className="text-sm text-slate-600 dark:text-white/65">
              {tripAnalysis.filter((trip) => (trip.utilization || 0) > 90).length} trip(s) are over 90% budget utilization.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/50 p-5 dark:border-white/10 dark:bg-white/10">
            <div className="mb-2 flex items-center gap-2 text-emerald-500">
              <UserCheck className="h-5 w-5" />
              <p className="font-black">Activation Health</p>
            </div>
            <p className="text-sm text-slate-600 dark:text-white/65">
              {(summary.usersWithTrips || 0) >= (summary.usersWithoutTrips || 0)
                ? "Most users are actively planning trips."
                : "Consider onboarding prompts for dormant users."}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/50 p-5 dark:border-white/10 dark:bg-white/10">
            <div className="mb-2 flex items-center gap-2 text-amber-500">
              <UserX className="h-5 w-5" />
              <p className="font-black">Drop-off Alert</p>
            </div>
            <p className="text-sm text-slate-600 dark:text-white/65">
              {summary.usersWithoutTrips || 0} user(s) have no trips. Target these users with recommendations.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default AdminPanel;
