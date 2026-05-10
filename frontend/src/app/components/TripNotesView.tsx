import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { notesAPI, TripNote } from "../../services/api";

const TripNotesView = ({
  tripId,
  notes,
  onChanged,
}: {
  tripId: string;
  notes: TripNote[];
  onChanged: () => Promise<void> | void;
}) => {
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ title: "", content: "" });
  const [saving, setSaving] = useState(false);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => `${note.title} ${note.content}`.toLowerCase().includes(query.toLowerCase()));
  }, [notes, query]);

  const addNote = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    setSaving(true);
    try {
      await notesAPI.addNote(tripId, { title: form.title.trim(), content: form.content.trim() });
      setForm({ title: "", content: "" });
      await onChanged();
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    await notesAPI.deleteNote(tripId, noteId);
    await onChanged();
  };

  return (
    <div className="mx-auto max-w-4xl py-4">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Trip Notes</h2>
      </div>

      <form onSubmit={addNote} className="mb-8 space-y-3 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Note title" className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 font-semibold text-slate-900 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
        <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write trip detail, booking info, or reminders..." rows={4} className="w-full resize-none rounded-xl border border-slate-200 bg-white/70 px-4 py-3 font-semibold text-slate-900 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-500 disabled:opacity-60">
          <Plus className="h-4 w-4" />
          Add Note
        </button>
      </form>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-white/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search notes..."
          className="w-full rounded-xl border border-slate-200 bg-white/70 py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:ring-2 focus:ring-purple-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
      </div>

      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <div key={note.id} className="rounded-2xl border border-slate-200 bg-white/70 p-6 transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
            <div className="mb-2 flex items-start justify-between gap-4">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{note.title}</h3>
              <button onClick={() => deleteNote(note.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="whitespace-pre-wrap text-slate-600 dark:text-white/60">{note.content}</p>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm font-semibold text-slate-500 dark:border-white/15 dark:text-white/50">
          No notes yet.
        </div>
      )}
    </div>
  );
};

export default TripNotesView;
