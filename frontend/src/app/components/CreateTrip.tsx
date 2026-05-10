import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import type { Trip } from "../types";

const defaultCovers = [
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
];

export function CreateTrip({ onCreate, onCancel }: { onCreate: (t: Trip) => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [desc, setDesc] = useState("");
  const [cover, setCover] = useState(defaultCovers[0]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !start || !end) return;
    onCreate({
      id: `t${Date.now()}`,
      name,
      description: desc,
      startDate: start,
      endDate: end,
      cover,
      stops: [],
      notes: [],
      packing: [],
      shared: false,
    });
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Plan a new trip</h1>
      <p className="text-muted-foreground mb-6">Give your adventure a name and dates to get started.</p>

      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="tname">Trip name</Label>
            <Input id="tname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Summer in Italy" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ts">Start date</Label>
              <Input id="ts" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="te">End date</Label>
              <Input id="te" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="tdesc">Description</Label>
            <Textarea id="tdesc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What's the vibe of this trip?" />
          </div>
          <div>
            <Label>Cover photo</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {defaultCovers.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCover(c)}
                  className={`h-20 rounded-lg overflow-hidden border-2 transition ${
                    cover === c ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={c} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">Create trip</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
