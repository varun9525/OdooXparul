import { Copy, Share2, Globe, Twitter, Facebook } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Trip } from "../types";

export function SharedView({ trip, onUpdate }: { trip: Trip; onUpdate: (t: Trip) => void }) {
  const url = `https://traveloop.app/share/${trip.id}`;

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(ta);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Share — {trip.name}</h1>
      <p className="text-muted-foreground mb-6">Make this itinerary public for friends to view or copy.</p>

      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Public link</div>
              <div className="text-sm text-muted-foreground">Anyone with the link can view this trip.</div>
            </div>
          </div>
          <Switch checked={trip.shared} onCheckedChange={(v) => onUpdate({ ...trip, shared: v })} />
        </div>

        {trip.shared && (
          <>
            <div className="flex gap-2 mt-4">
              <input readOnly value={url} className="flex-1 px-3 py-2 text-sm rounded-md border bg-muted" />
              <Button onClick={copy}><Copy className="w-4 h-4 mr-1" /> Copy</Button>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm"><Twitter className="w-4 h-4 mr-1" /> Twitter</Button>
              <Button variant="outline" size="sm"><Facebook className="w-4 h-4 mr-1" /> Facebook</Button>
              <Button variant="outline" size="sm"><Share2 className="w-4 h-4 mr-1" /> Other</Button>
            </div>
          </>
        )}
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="h-48 overflow-hidden">
          <ImageWithFallback src={trip.cover} alt={trip.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-6">
          <Badge>Read only preview</Badge>
          <h2 className="text-2xl font-semibold mt-2">{trip.name}</h2>
          <p className="text-muted-foreground">{trip.startDate} → {trip.endDate}</p>
          <p className="mt-3">{trip.description}</p>
          <div className="mt-4 space-y-2">
            {trip.stops.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm border-b pb-2">
                <span className="font-medium">{s.city}, {s.country}</span>
                <span className="text-muted-foreground">{s.activities.length} activities</span>
              </div>
            ))}
          </div>
          <Button className="mt-5"><Copy className="w-4 h-4 mr-2" /> Copy Trip</Button>
        </div>
      </Card>
    </div>
  );
}
