export type EventType = 'journal' | 'prayer' | 'insight';

export type TabKey = 'record' | 'journey';
export type JourneyView = 'timeline' | 'reflections' | 'insights';

export interface FastingEvent {
  id: string;
  title: string;
  createdAt: string;
  type: EventType;
  notes: string;
  chips: string[];
}

export interface RecorderDraft {
  type: EventType;
  title: string;
  notes: string;
  chips: string[];
}
