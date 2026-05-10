import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import type { Trip } from "../types";

export function Notes({ trip, onUpdate }: { trip: Trip; onUpdate: (t: Trip) => void }) {
  const [text, setText] = useState("");

  const add = () => {
    if (!text.trim()) return;
    onUpdate({
      ...trip,
      notes: [
        { id: `n${Date.now()}`, text, date: new Date().toISOString().split("T")[0] },
        ...trip.notes,
      ],
    });
    setText("");
  };

  const remove = (id: string) => {
    onUpdate({ ...trip, notes: trip.notes.filter((n) => n.id !== id) });
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Notes — {trip.name}</h1>
      <p className="text-muted-foreground mb-6">Hotel info, contacts, reminders.</p>

      <Card className="p-4 mb-6">
        <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a note..." rows={3} />
        <Button className="mt-3" onClick={add}><Plus className="w-4 h-4 mr-1" /> Add note</Button>
      </Card>

      <div className="space-y-3">
        {trip.notes.map((n) => (
          <Card key={n.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">{n.date}</div>
                <p className="whitespace-pre-wrap">{n.text}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => remove(n.id)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        ))}
        {trip.notes.length === 0 && (
          <Card className="p-10 text-center text-muted-foreground">No notes yet.</Card>
        )}
      </div>
    </div>
  );
}
