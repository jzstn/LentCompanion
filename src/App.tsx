import { useEffect, useMemo, useState } from 'react';
import { ConfirmRecorderModal } from './components/ConfirmRecorderModal';
import { JourneyMap } from './components/JourneyMap';
import { loadEvents, persistEvents, toEvent } from './storage';
import type { FastingEvent, RecorderDraft, TabKey } from './types';

const tabOptions: { key: TabKey; label: string }[] = [
  { key: 'record', label: 'Record' },
  { key: 'journey', label: 'Journey Map' }
];

const initialDraft: RecorderDraft = {
  type: 'journal',
  title: '',
  notes: '',
  chips: []
};

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('record');
  const [events, setEvents] = useState<FastingEvent[]>(() => loadEvents());
  const [draft, setDraft] = useState<RecorderDraft>(initialDraft);
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    persistEvents(events);
  }, [events]);

  const eventCounts = useMemo(
    () => ({
      journal: events.filter((entry) => entry.type === 'journal').length,
      prayer: events.filter((entry) => entry.type === 'prayer').length,
      insight: events.filter((entry) => entry.type === 'insight').length
    }),
    [events]
  );

  const addEvent = () => {
    if (!draft.title.trim() || !draft.notes.trim()) {
      return;
    }

    setEvents((prev) => [toEvent(draft), ...prev]);
    setDraft(initialDraft);
    setConfirmOpen(false);
    setActiveTab('journey');
  };

  const updateEvent = (eventId: string, notes: string) => {
    setEvents((prev) => prev.map((entry) => (entry.id === eventId ? { ...entry, notes } : entry)));
  };

  return (
    <main className="mx-auto min-h-screen max-w-4xl p-6">
      <header className="rounded-xl bg-indigo-600 p-5 text-white shadow-sm">
        <h1 className="text-2xl font-bold">Fasting Companion</h1>
        <p className="mt-1 text-sm text-indigo-100">Capture daily practice and track your growth journey.</p>
        <div className="mt-3 flex gap-2 text-xs">
          <span>Journal: {eventCounts.journal}</span>
          <span>Prayer: {eventCounts.prayer}</span>
          <span>Insights: {eventCounts.insight}</span>
        </div>
      </header>

      <div className="mt-6 flex gap-2">
        {tabOptions.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-4 py-2 text-sm ${
              activeTab === tab.key ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'record' ? (
        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">New entry</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              Type
              <select
                value={draft.type}
                onChange={(event) =>
                  setDraft({ ...draft, type: event.target.value as RecorderDraft['type'], chips: [] })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              >
                <option value="journal">Journal</option>
                <option value="prayer">Prayer</option>
                <option value="insight">Insight</option>
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              Title
              <input
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                placeholder="What happened?"
              />
            </label>
          </div>

          <label className="mt-4 block space-y-2 text-sm text-slate-700">
            Notes
            <textarea
              value={draft.notes}
              onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
              className="min-h-28 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Write your observation and response."
            />
          </label>

          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            Continue to confirmation
          </button>
        </section>
      ) : (
        <div className="mt-5">
          <JourneyMap events={events} onUpdate={updateEvent} />
        </div>
      )}

      <ConfirmRecorderModal
        isOpen={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        draft={draft}
        setDraft={setDraft}
        onConfirm={addEvent}
      />
    </main>
  );
}

export default App;
