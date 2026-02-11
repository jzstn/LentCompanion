export type MainTabKey = 'today' | 'journey' | 'library' | 'profile';
export type JourneySectionKey = 'timeline' | 'reflections' | 'insights';
export type ReflectionFilter = 'ALL' | 'JOURNAL' | 'PRAYER' | 'FAST';

export type EventType = 'JOURNAL' | 'PRAYER' | 'FAST';
export type RatingType = 'PEACE' | 'CLARITY';

export interface JournalPayload {
  text: string;
}

export interface PrayerPayload {
  prayerType: string;
  attentionState: string;
  fruitTags: string[];
}

export interface FastPayload {
  adherence: string;
  reason: string;
  next?: string;
}

export interface FastingEvent {
  id: string;
  type: EventType;
  ts: string;
  dayKey: string;
  tags: string[];
  rating?: {
    type: RatingType;
    value: number;
  };
  payload: JournalPayload | PrayerPayload | FastPayload;
}

export interface ConfirmState {
  fAdh: string;
  fReason: string;
  pType: string;
  pAttn: string;
}
