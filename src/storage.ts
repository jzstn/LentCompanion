import type { FastingEvent, RecorderDraft } from './types';

const STORAGE_KEY = 'fasting-app-events';

export const DEFAULT_EVENTS: FastingEvent[] = [
  {
    id: 'seed-1',
    title: 'Morning reflection',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    type: 'journal',
    notes: 'I noticed impatience before lunch. I paused and redirected my focus.',
    chips: ['honesty', 'gratitude']
  },
  {
    id: 'seed-2',
    title: 'Prayer checkpoint',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    type: 'prayer',
    notes: 'Asked for strength in self-control and clarity in service.',
    chips: ['patience', 'charity']
  }
];

export const toEvent = (draft: RecorderDraft): FastingEvent => ({
  id: crypto.randomUUID(),
  title: draft.title.trim(),
  type: draft.type,
  notes: draft.notes.trim(),
  chips: draft.chips,
  createdAt: new Date().toISOString()
});

export const loadEvents = (): FastingEvent[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_EVENTS;
    }

    const parsed = JSON.parse(raw) as FastingEvent[];
    if (!Array.isArray(parsed)) {
      return DEFAULT_EVENTS;
    }

    return parsed;
  } catch {
    return DEFAULT_EVENTS;
  }
};

export const persistEvents = (events: FastingEvent[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};

export const storageKey = STORAGE_KEY;
