import { useMemo, useState } from "react";
import { Check, Edit2, Plus, Search, Trash2, X, Image as ImageIcon } from "lucide-react";
import { notesAPI, TripNote } from "../../services/api";

const TripNotesView = ({
  tripId,
  notes,
  onChanged,
  allowPhotos = false,
}: {
  tripId: string;
  notes: TripNote[];
  onChanged: () => Promise<void> | void;
  allowPhotos?: boolean;
}) => {
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ title: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

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

  const startEdit = (note: TripNote) => {
    setEditingId(note.id);
    setEditForm({ title: note.title, content: note.content });
  };

  const saveEdit = async () => {
    if (!editingId || !editForm.title.trim() || !editForm.content.trim()) return;

    setSaving(true);
    try {
      await notesAPI.updateNote(tripId, editingId, {
        title: editForm.title.trim(),
        content: editForm.content.trim(),
      });
      setEditingId(null);
      await onChanged();
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", content: "" });
  };

  return (
    <div className="mx-auto max-w-4xl py-4">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          {allowPhotos ? "Journal & Memories" : "Trip Notes"}
        </h2>
      </div>

      <form onSubmit={addNote} className="mb-8 space-y-3 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={allowPhotos ? "Memory title (e.g., Eiffel Tower Visit)" : "Note title"} className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 font-semibold text-slate-900 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
        <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder={allowPhotos ? "Write about your day, or attach a photo..." : "Write trip detail, booking info, or reminders..."} rows={4} className="w-full resize-none rounded-xl border border-slate-200 bg-white/70 px-4 py-3 font-semibold text-slate-900 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
        <div className="flex justify-between items-center">
          {allowPhotos ? (
            <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/20">
              <ImageIcon className="h-4 w-4" />
              Attach Photo
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setForm(f => ({ ...f, content: f.content + (f.content ? '\n\n' : '') + `[IMAGE:${reader.result}]` }));
                    };
                    reader.readAsDataURL(file);
                  }
                }} 
              />
            </label>
          ) : (
            <div /> // empty div to keep the flex layout space
          )}
          <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-500 disabled:opacity-60">
            <Plus className="h-4 w-4" />
            {allowPhotos ? "Add Entry" : "Add Note"}
          </button>
        </div>
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
          editingId === note.id ? (
            <div key={note.id} className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-500/30 dark:bg-indigo-500/20">
              <div className="mb-4 space-y-3">
                <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Note title" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
                <textarea value={editForm.content} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} placeholder="Write trip detail, booking info, or reminders..." rows={4} className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={saveEdit} disabled={saving} className="inline-flex flex-1 items-center gap-2 rounded-xl bg-green-600 px-5 py-2 font-bold text-white transition hover:bg-green-500 disabled:opacity-60">
                  <Check className="h-4 w-4" />
                  Save
                </button>
                <button type="button" onClick={cancelEdit} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-400 px-5 py-2 font-bold text-white transition hover:bg-slate-500 disabled:opacity-60">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div key={note.id} className="rounded-2xl border border-slate-200 bg-white/70 p-6 transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
              <div className="mb-2 flex items-start justify-between gap-4">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{note.title}</h3>
                <div className="flex gap-2">
                  <button type="button" onClick={() => startEdit(note)} className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => deleteNote(note.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="whitespace-pre-wrap text-slate-600 dark:text-white/60">
                {note.content.split(/(\[IMAGE:data:image\/[^\]]+\])/).map((part, i) => {
                  if (part.startsWith('[IMAGE:')) {
                    const src = part.slice(7, -1);
                    return <img key={i} src={src} alt="Memory" className="mt-4 rounded-xl border border-slate-200 shadow-sm max-h-96 object-cover dark:border-white/10" />;
                  }
                  return <span key={i}>{part}</span>;
                })}
              </div>
            </div>
          )
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
