import { useState } from "react";
import { Calendar, List, MapPin, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import type { Trip } from "../types";

export function ItineraryView({ trip }: { trip: Trip }) {
  const [mode, setMode] = useState<"list" | "calendar">("list");

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{trip.name}</h1>
          <p className="text-muted-foreground">{trip.startDate} → {trip.endDate}</p>
        </div>
        <div className="flex gap-2">
          <Button variant={mode === "list" ? "default" : "outline"} size="sm" onClick={() => setMode("list")}>
            <List className="w-4 h-4 mr-1" /> List
          </Button>
          <Button variant={mode === "calendar" ? "default" : "outline"} size="sm" onClick={() => setMode("calendar")}>
            <Calendar className="w-4 h-4 mr-1" /> Calendar
          </Button>
        </div>
      </div>

      {trip.stops.length === 0 && (
        <Card className="p-10 text-center text-muted-foreground">
          No stops in this trip yet. Use the Itinerary Builder to add cities.
        </Card>
      )}

      {mode === "list" && (
        <div className="space-y-6">
          {trip.stops.map((stop, i) => (
            <div key={stop.id}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  {i + 1}
                </div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {stop.city}, {stop.country}
                </h2>
                <span className="text-sm text-muted-foreground ml-auto">
                  {stop.startDate} → {stop.endDate}
                </span>
              </div>
              <div className="ml-4 border-l-2 border-dashed pl-6 space-y-3">
                {stop.activities.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic">No activities planned.</div>
                ) : (
                  stop.activities.map((a) => (
                    <Card key={a.id} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{a.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3" /> {a.time ?? "—"} • {a.duration}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{a.category}</Badge>
                        <div className="text-sm text-muted-foreground mt-1">${a.cost}</div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === "calendar" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {trip.stops.flatMap((stop) =>
            stop.activities.map((a) => (
              <Card key={a.id} className="p-4">
                <div className="text-xs text-muted-foreground">{stop.city}</div>
                <div className="font-medium mt-1">{a.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{a.time} • {a.duration} • ${a.cost}</div>
                <Badge variant="secondary" className="mt-2">{a.category}</Badge>
              </Card>
            )),
          )}
        </div>
      )}
    </div>
  );
}
