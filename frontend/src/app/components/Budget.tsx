import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { AlertCircle } from "lucide-react";
import { Card } from "./ui/card";
import type { Trip } from "../types";

const COLORS = ["#8b5cf6", "#f59e0b", "#10b981", "#ef4444"];

export function Budget({ trip, budgetCap = 3000 }: { trip: Trip; budgetCap?: number }) {
  const totals = trip.stops.reduce(
    (acc, s) => {
      acc.transport += s.transportCost;
      acc.stay += s.stayCost;
      acc.meals += s.mealsCost;
      acc.activities += s.activities.reduce((a, ac) => a + ac.cost, 0);
      return acc;
    },
    { transport: 0, stay: 0, meals: 0, activities: 0 },
  );

  const total = totals.transport + totals.stay + totals.meals + totals.activities;

  const pieData = [
    { name: "Stay", value: totals.stay },
    { name: "Transport", value: totals.transport },
    { name: "Meals", value: totals.meals },
    { name: "Activities", value: totals.activities },
  ].filter((d) => d.value > 0);

  const days = Math.max(
    1,
    Math.round(
      (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24),
    ),
  );

  const perStop = trip.stops.map((s) => ({
    city: s.city,
    cost: s.stayCost + s.transportCost + s.mealsCost + s.activities.reduce((a, ac) => a + ac.cost, 0),
  }));

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Budget — {trip.name}</h1>
      <p className="text-muted-foreground mb-6">Estimated costs across your entire trip.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <div className="text-sm text-muted-foreground">Total estimated</div>
          <div className="text-3xl font-semibold mt-1">${total.toLocaleString()}</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-muted-foreground">Avg per day</div>
          <div className="text-3xl font-semibold mt-1">${Math.round(total / days).toLocaleString()}</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-muted-foreground">Budget cap</div>
          <div className="text-3xl font-semibold mt-1">${budgetCap.toLocaleString()}</div>
        </Card>
      </div>

      {total > budgetCap && (
        <Card className="p-4 mb-6 border-red-300 bg-red-50 text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          You're ${(total - budgetCap).toLocaleString()} over budget.
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">By category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90}>
                  {pieData.map((d, i) => <Cell key={d.name} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span>{d.name}</span>
                <span className="ml-auto font-medium">${d.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">By destination</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perStop}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cost" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
