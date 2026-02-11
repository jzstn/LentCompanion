import { useMemo, useState } from 'react';
import type { FastingEvent, JourneyView } from '../types';

interface JourneyMapProps {
  events: FastingEvent[];
  onUpdate: (eventId: string, notes: string) => void;
}

const viewOptions: { key: JourneyView; label: string }[] = [
  { key: 'timeline', label: 'Timeline' },
  { key: 'reflections', label: 'Reflections' },
  { key: 'insights', label: 'Insights' }
];

export const JourneyMap = ({ events, onUpdate }: JourneyMapProps) => {
  const [view, setView] = useState<JourneyView>('timeline');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...events].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [events]
  );

  const visibleEvents = useMemo(() => {
    switch (view) {
      case 'timeline':
        return sorted;
      case 'reflections':
        return sorted.filter((event) => event.type === 'journal');
      case 'insights':
        return sorted.filter((event) => event.type === 'insight' || event.type === 'prayer');
      default:
        return sorted;
    }
  }, [sorted, view]);

  const selected = sorted.find((event) => event.id === selectedId) ?? null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900">Journey Map</h2>
        <div className="flex gap-2">
          {viewOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setView(option.key)}
              className={`rounded-md px-3 py-1.5 text-sm ${
                option.key === view ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {visibleEvents.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-600">
            No entries for this view yet.
          </p>
        ) : (
          visibleEvents.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => setSelectedId(event.id)}
              className="w-full rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50"
            >
              <p className="text-sm font-medium text-slate-900">{event.title}</p>
              <p className="mt-1 text-xs uppercase text-slate-500">
                {event.type} • {new Date(event.createdAt).toLocaleString()}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{event.notes}</p>
            </button>
          ))
        )}
      </div>

      {selected ? <EntryDetailModal event={selected} onClose={() => setSelectedId(null)} onUpdate={onUpdate} /> : null}
    </section>
  );
};

interface EntryDetailModalProps {
  event: FastingEvent;
  onClose: () => void;
  onUpdate: (eventId: string, notes: string) => void;
}

const EntryDetailModal = ({ event, onClose, onUpdate }: EntryDetailModalProps) => {
  const [notes, setNotes] = useState(event.notes);

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
        <p className="mt-1 text-xs uppercase text-slate-500">{event.type}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {event.chips.map((chip) => (
            <span key={chip} className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs text-indigo-700">
              {chip}
            </span>
          ))}
        </div>

        <textarea
          value={notes}
          onChange={(evt) => setNotes(evt.target.value)}
          className="mt-4 min-h-32 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white"
            onClick={() => {
              onUpdate(event.id, notes);
              onClose();
            }}
          >
            Update notes
          </button>
        </div>
      </div>
    </div>
  );
};
