import { Plus, Trash2, Eye, Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Trip, View } from "../types";

type Props = {
  trips: Trip[];
  onNavigate: (v: View) => void;
  onOpenTrip: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TripList({ trips, onNavigate, onOpenTrip, onDelete }: Props) {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My Trips</h1>
          <p className="text-muted-foreground">All your travel plans in one place.</p>
        </div>
        <Button onClick={() => onNavigate("create")}>
          <Plus className="w-4 h-4 mr-2" /> New Trip
        </Button>
      </div>

      {trips.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-muted-foreground mb-4">You haven't planned any trips yet.</p>
          <Button onClick={() => onNavigate("create")}>Plan your first trip</Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden p-0">
              <div className="h-40 overflow-hidden">
                <ImageWithFallback src={trip.cover} alt={trip.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="font-semibold">{trip.name}</div>
                <div className="text-sm text-muted-foreground mb-3">
                  {trip.startDate} → {trip.endDate} • {trip.stops.length} stops
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { onOpenTrip(trip.id); onNavigate("itinerary"); }}>
                    <Eye className="w-3.5 h-3.5 mr-1" /> View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { onOpenTrip(trip.id); onNavigate("builder"); }}>
                    <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(trip.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
