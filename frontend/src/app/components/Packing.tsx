import { useState } from "react";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { Trip } from "../types";

const categories = ["Clothing", "Documents", "Electronics", "Toiletries", "Other"];

export function Packing({ trip, onUpdate }: { trip: Trip; onUpdate: (t: Trip) => void }) {
  const [label, setLabel] = useState("");
  const [cat, setCat] = useState("Clothing");

  const add = () => {
    if (!label.trim()) return;
    onUpdate({
      ...trip,
      packing: [...trip.packing, { id: `p${Date.now()}`, label, category: cat, packed: false }],
    });
    setLabel("");
  };

  const toggle = (id: string) => {
    onUpdate({
      ...trip,
      packing: trip.packing.map((i) => (i.id === id ? { ...i, packed: !i.packed } : i)),
    });
  };

  const remove = (id: string) => {
    onUpdate({ ...trip, packing: trip.packing.filter((i) => i.id !== id) });
  };

  const reset = () => {
    onUpdate({ ...trip, packing: trip.packing.map((i) => ({ ...i, packed: false })) });
  };

  const grouped = categories.map((c) => ({
    name: c,
    items: trip.packing.filter((p) => p.category === c),
  }));

  const packedCount = trip.packing.filter((p) => p.packed).length;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Packing — {trip.name}</h1>
          <p className="text-muted-foreground">{packedCount} of {trip.packing.length} packed</p>
        </div>
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="w-4 h-4 mr-2" /> Reset
        </Button>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Add item..." className="flex-1 min-w-40" onKeyDown={(e) => e.key === "Enter" && add()} />
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={add}><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </div>
      </Card>

      <div className="space-y-4">
        {grouped.filter((g) => g.items.length > 0).map((g) => (
          <Card key={g.name} className="p-4">
            <h3 className="font-semibold mb-3">{g.name}</h3>
            <div className="space-y-1">
              {g.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded hover:bg-accent">
                  <Checkbox checked={item.packed} onCheckedChange={() => toggle(item.id)} />
                  <span className={`flex-1 ${item.packed ? "line-through text-muted-foreground" : ""}`}>{item.label}</span>
                  <Button size="sm" variant="ghost" onClick={() => remove(item.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ))}
        {trip.packing.length === 0 && (
          <Card className="p-10 text-center text-muted-foreground">No items yet — start your packing list above.</Card>
        )}
      </div>
    </div>
  );
}
