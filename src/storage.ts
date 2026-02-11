import type { FastingEvent } from './types';

const STORAGE_KEY = 'fasting-companion-events-v2';

export const seedEvents = (): FastingEvent[] => [
  {
    id: 'evt_1',
    type: 'PRAYER',
    ts: '2026-02-09T07:10:00-05:00',
    dayKey: '2026-02-09',
    tags: ['Peace'],
    payload: {
      prayerType: 'Morning prayer',
      attentionState: 'Focused',
      fruitTags: ['Peace']
    }
  },
  {
    id: 'evt_2',
    type: 'FAST',
    ts: '2026-02-09T12:30:00-05:00',
    dayKey: '2026-02-09',
    tags: [],
    payload: {
      adherence: 'Mostly kept it',
      reason: 'Social situation',
      next: 'Plan ahead'
    }
  },
  {
    id: 'evt_3',
    type: 'JOURNAL',
    ts: '2026-02-09T21:12:00-05:00',
    dayKey: '2026-02-09',
    tags: ['I was grateful', 'I need help with this'],
    rating: { type: 'PEACE', value: 4 },
    payload: {
      text: 'Today I noticed I get impatient when I feel rushed. I want to return quickly.'
    }
  },
  {
    id: 'evt_4',
    type: 'PRAYER',
    ts: '2026-02-08T21:40:00-05:00',
    dayKey: '2026-02-08',
    tags: ['Hope'],
    payload: {
      prayerType: 'Evening prayer',
      attentionState: 'Dry but faithful',
      fruitTags: ['Hope']
    }
  },
  {
    id: 'evt_5',
    type: 'FAST',
    ts: '2026-02-08T13:00:00-05:00',
    dayKey: '2026-02-08',
    tags: [],
    payload: {
      adherence: 'Struggled today',
      reason: 'Stress / emotions',
      next: 'Ask mercy & restart'
    }
  }
];

export const loadEvents = (): FastingEvent[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return seedEvents();
    }

    const parsed = JSON.parse(raw) as FastingEvent[];
    return Array.isArray(parsed) ? parsed : seedEvents();
  } catch {
    return seedEvents();
  }
};

export const persistEvents = (events: FastingEvent[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};

export const storageKey = STORAGE_KEY;
