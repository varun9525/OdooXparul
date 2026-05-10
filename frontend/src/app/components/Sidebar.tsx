import { Compass, Home, Map, Plus, Wallet, Backpack, NotebookPen, User, LogOut, Share2 } from "lucide-react";
import type { View } from "../types";
import { Button } from "./ui/button";

type Props = {
  view: View;
  onNavigate: (v: View) => void;
  onLogout: () => void;
  hasActiveTrip: boolean;
};

const tripScopedItems = [
  { id: "builder" as View, label: "Itinerary Builder", icon: Map },
  { id: "itinerary" as View, label: "Itinerary View", icon: Compass },
  { id: "budget" as View, label: "Budget", icon: Wallet },
  { id: "packing" as View, label: "Packing", icon: Backpack },
  { id: "notes" as View, label: "Notes", icon: NotebookPen },
  { id: "shared" as View, label: "Share", icon: Share2 },
];

export function Sidebar({ view, onNavigate, onLogout, hasActiveTrip }: Props) {
  const NavBtn = ({ id, label, icon: Icon, disabled }: any) => (
    <button
      onClick={() => !disabled && onNavigate(id)}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        view === id
          ? "bg-primary text-primary-foreground"
          : disabled
          ? "text-muted-foreground/50 cursor-not-allowed"
          : "text-foreground hover:bg-accent"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <aside className="w-64 border-r bg-card h-screen sticky top-0 flex flex-col">
      <div className="p-5 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center text-white">
            <Compass className="w-4 h-4" />
          </div>
          <span className="font-semibold tracking-tight">Traveloop</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <NavBtn id="dashboard" label="Dashboard" icon={Home} />
        <NavBtn id="trips" label="My Trips" icon={Map} />
        <NavBtn id="create" label="Plan New Trip" icon={Plus} />

        <div className="pt-4 pb-1 px-3 text-xs uppercase tracking-wider text-muted-foreground">
          Active Trip
        </div>
        {tripScopedItems.map((it) => (
          <NavBtn key={it.id} {...it} disabled={!hasActiveTrip} />
        ))}

        <div className="pt-4 pb-1 px-3 text-xs uppercase tracking-wider text-muted-foreground">
          Account
        </div>
        <NavBtn id="profile" label="Profile" icon={User} />
      </nav>

      <div className="p-3 border-t">
        <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Log out
        </Button>
      </div>
    </aside>
  );
}
