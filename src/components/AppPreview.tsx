import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Flame,
  HeartHandshake,
  Leaf,
  Map as MapIcon,
  Sparkles
} from 'lucide-react';
import { cls, formatDayLabel, formatTime, isConfirmValid, toggleMaxSelection } from '../app-helpers';
import { loadEvents, persistEvents } from '../storage';
import type { EventType, FastingEvent, JourneySectionKey, MainTabKey, ReflectionFilter, RatingType } from '../types';

const TABS: Array<{ key: MainTabKey; label: string; icon: typeof Leaf }> = [
  { key: 'today', label: 'Today', icon: Leaf },
  { key: 'journey', label: 'Journey Map', icon: MapIcon },
  { key: 'library', label: 'Library', icon: BookOpen },
  { key: 'profile', label: 'Profile', icon: Sparkles }
];

const JOURNEY_SECTIONS: Array<{ key: JourneySectionKey; label: string }> = [
  { key: 'timeline', label: 'Timeline' },
  { key: 'reflections', label: 'Reflections' },
  { key: 'insights', label: 'Insights' }
];

const JOURNAL_CHIPS = [
  'I noticed a pattern',
  'I understood a trigger',
  'I saw my weakness clearly',
  'I asked forgiveness',
  'I fell, but returned',
  'I want to restart',
  'I resisted a temptation',
  'I chose patience'
];
const FAST_ADHERENCE = ['Kept the fast', 'Mostly kept it', 'Struggled today', 'Not today — restarting'];
const FAST_REASON = ['Hunger / low energy', 'Social situation', 'Stress / emotions', 'Forgot / unprepared'];
const FAST_NEXT = ['Simplify the next meal', 'Plan ahead', 'Ask mercy & restart', 'Add a small act of charity'];
const PRAYER_TYPE = ['Morning prayer', 'Evening prayer', 'Jesus Prayer', 'Psalm'];
const PRAYER_ATTENTION = ['Focused', 'Wandering', 'Dry but faithful', 'Rushed', 'Deeply present'];
const PRAYER_FRUIT = ['Peace', 'Gratitude', 'Hope', 'Patience', 'Love for others', 'Still struggling'];

const eventLabel = (type: EventType): string => (type === 'JOURNAL' ? 'Journal' : type === 'PRAYER' ? 'Prayer' : 'Fasting');
const eventIcon = (type: EventType) => (type === 'PRAYER' ? CheckCircle2 : type === 'FAST' ? Flame : BookOpen);

const newId = (): string => `evt_${Math.random().toString(16).slice(2)}`;

const Pill = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-xs text-zinc-800 ring-1 ring-zinc-200">{children}</span>
);

const Chip = ({
  label,
  selected,
  onClick,
  disabled
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cls(
      'inline-flex items-center rounded-full px-3 py-1 text-sm transition ring-1',
      selected ? 'bg-zinc-900 text-white ring-zinc-900' : 'bg-zinc-100 text-zinc-800 ring-zinc-200 hover:bg-zinc-200',
      disabled && 'cursor-not-allowed opacity-50'
    )}
  >
    {label}
  </button>
);

const Modal = ({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-xl ring-1 ring-zinc-200">
        <div className="flex items-start justify-between gap-4 px-5 pt-5">
          <div>
            <div className="text-base font-semibold text-zinc-900">{title}</div>
            {subtitle ? <div className="mt-1 text-sm text-zinc-600">{subtitle}</div> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">
            Close
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer ? <div className="border-t border-zinc-200 px-5 py-4">{footer}</div> : null}
      </div>
    </div>
  );
};

export const AppPreview = () => {
  const [tab, setTab] = useState<MainTabKey>('journey');
  const [journeySection, setJourneySection] = useState<JourneySectionKey>('timeline');
  const [events, setEvents] = useState<FastingEvent[]>(() => loadEvents());

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<EventType>('JOURNAL');

  const [jTags, setJTags] = useState<string[]>([]);
  const [jRatingType, setJRatingType] = useState<RatingType>('PEACE');
  const [jRatingValue, setJRatingValue] = useState(0);

  const [fAdh, setFAdh] = useState('');
  const [fReason, setFReason] = useState('');
  const [fNext, setFNext] = useState('');

  const [pType, setPType] = useState('');
  const [pAttn, setPAttn] = useState('');
  const [pFruit, setPFruit] = useState<string[]>([]);

  const [reflectionFilter, setReflectionFilter] = useState<ReflectionFilter>('ALL');
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  useEffect(() => {
    persistEvents(events);
  }, [events]);

  const confirmValid = isConfirmValid(confirmType, { fAdh, fReason, pType, pAttn });

  const resetConfirmState = (type: EventType) => {
    setConfirmType(type);
    setConfirmOpen(true);
    setJTags([]);
    setJRatingType('PEACE');
    setJRatingValue(0);
    setFAdh('');
    setFReason('');
    setFNext('');
    setPType('');
    setPAttn('');
    setPFruit([]);
  };

  const saveConfirm = () => {
    if (!confirmValid) return;
    const now = new Date();
    const dayKey = now.toISOString().slice(0, 10);
    const ts = now.toISOString();

    if (confirmType === 'JOURNAL') {
      setEvents((prev) => [
        {
          id: newId(),
          type: 'JOURNAL',
          ts,
          dayKey,
          tags: jTags,
          rating: jRatingValue ? { type: jRatingType, value: jRatingValue } : undefined,
          payload: { text: '' }
        },
        ...prev
      ]);
    }

    if (confirmType === 'FAST') {
      setEvents((prev) => [
        {
          id: newId(),
          type: 'FAST',
          ts,
          dayKey,
          tags: [],
          payload: { adherence: fAdh, reason: fReason, next: fNext }
        },
        ...prev
      ]);
    }

    if (confirmType === 'PRAYER') {
      setEvents((prev) => [
        {
          id: newId(),
          type: 'PRAYER',
          ts,
          dayKey,
          tags: pFruit,
          payload: { prayerType: pType, attentionState: pAttn, fruitTags: pFruit }
        },
        ...prev
      ]);
    }

    setConfirmOpen(false);
    setTab('journey');
  };

  const dayBuckets = useMemo(() => {
    const bucket = new Map<string, FastingEvent[]>();
    events.forEach((event) => {
      bucket.set(event.dayKey, [...(bucket.get(event.dayKey) ?? []), event]);
    });

    const dayKeys = [...bucket.keys()].sort((a, b) => +new Date(b) - +new Date(a));
    return dayKeys.map((dayKey) => {
      const list = (bucket.get(dayKey) ?? []).sort((a, b) => +new Date(b.ts) - +new Date(a.ts));
      const counts = list.reduce(
        (acc, event) => ({ ...acc, [event.type]: acc[event.type] + 1 }),
        { PRAYER: 0, FAST: 0, JOURNAL: 0 }
      );
      return { dayKey, list, counts };
    });
  }, [events]);

  const reflections = useMemo(() => {
    return [...events]
      .sort((a, b) => +new Date(b.ts) - +new Date(a.ts))
      .filter((event) => (reflectionFilter === 'ALL' ? true : event.type === reflectionFilter));
  }, [events, reflectionFilter]);

  const insights = useMemo(() => {
    const tags: string[] = [];
    const reasons: string[] = [];
    const fruits: string[] = [];

    events.forEach((event) => {
      tags.push(...event.tags);
      if (event.type === 'FAST' && 'reason' in event.payload) reasons.push(event.payload.reason);
      if (event.type === 'PRAYER' && 'fruitTags' in event.payload) fruits.push(...event.payload.fruitTags);
    });

    const top = (items: string[]) => {
      const map = new Map<string, number>();
      items.forEach((item) => map.set(item, (map.get(item) ?? 0) + 1));
      return [...map.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([item]) => item);
    };

    return {
      topTags: top(tags),
      topFastingReasons: top(reasons),
      topPrayerFruits: top(fruits)
    };
  }, [events]);

  const activeEvent = useMemo(() => events.find((event) => event.id === activeEventId) ?? null, [events, activeEventId]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200">
            <div className="p-2">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = tab === t.key;
                return (
                  <button key={t.key} type="button" onClick={() => setTab(t.key)} className={cls('mb-1 w-full rounded-2xl px-3 py-3 text-left transition', active ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><Icon className="h-4 w-4" /><span className="text-sm font-semibold">{t.label}</span></div>
                      <ChevronRight className={cls('h-4 w-4', active ? 'opacity-80' : 'opacity-40')} />
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="space-y-4">
            {tab === 'today' && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {(['PRAYER', 'FAST', 'JOURNAL'] as EventType[]).map((type) => {
                  const Icon = eventIcon(type);
                  return (
                    <button key={type} type="button" onClick={() => resetConfirmState(type)} className="rounded-2xl bg-white p-4 text-left ring-1 ring-zinc-200 shadow-sm hover:bg-zinc-50">
                      <Icon className="h-5 w-5" />
                      <p className="mt-2 text-sm font-semibold">Log {eventLabel(type)}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {tab === 'journey' && (
              <>
                <div className="inline-flex rounded-2xl bg-zinc-100 p-1 ring-1 ring-zinc-200">
                  {JOURNEY_SECTIONS.map((section) => (
                    <button key={section.key} type="button" onClick={() => setJourneySection(section.key)} className={cls('rounded-xl px-3 py-2 text-sm font-semibold', section.key === journeySection ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600')}>
                      {section.label}
                    </button>
                  ))}
                </div>

                {journeySection === 'timeline' && (
                  <div className="space-y-3">
                    {dayBuckets.map((day) => (
                      <div key={day.dayKey} className="rounded-2xl bg-white ring-1 ring-zinc-200 shadow-sm">
                        <div className="px-4 py-3 text-sm font-semibold">{formatDayLabel(day.dayKey)}</div>
                        <div className="border-t border-zinc-200 p-2">
                          {day.list.map((event) => {
                            const Icon = eventIcon(event.type);
                            return (
                              <button key={event.id} type="button" onClick={() => setActiveEventId(event.id)} className="mb-1 w-full rounded-xl p-2 text-left hover:bg-zinc-50">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2"><Icon className="h-4 w-4" />
                                  <span className="text-sm font-semibold">{eventLabel(event.type)}</span>
                                  <span className="text-xs text-zinc-500">{formatTime(event.ts)}</span></div>
                                  <ChevronRight className="h-4 w-4 opacity-40" />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {journeySection === 'reflections' && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {(['ALL', 'JOURNAL', 'PRAYER', 'FAST'] as ReflectionFilter[]).map((filter) => (
                        <button key={filter} type="button" onClick={() => setReflectionFilter(filter)} className={cls('rounded-xl px-3 py-2 text-sm ring-1', reflectionFilter === filter ? 'bg-zinc-900 text-white ring-zinc-900' : 'bg-white text-zinc-700 ring-zinc-200')}>
                          {filter}
                        </button>
                      ))}
                    </div>
                    {reflections.map((event) => (
                      <button key={event.id} type="button" onClick={() => setActiveEventId(event.id)} className="w-full rounded-2xl bg-white p-4 text-left ring-1 ring-zinc-200">
                        <p className="text-sm font-semibold">{eventLabel(event.type)} • {formatDayLabel(event.dayKey)}</p>
                      </button>
                    ))}
                  </div>
                )}

                {journeySection === 'insights' && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200"><HeartHandshake className="h-4 w-4" /><div className="mt-2 flex flex-wrap gap-2">{insights.topTags.map((item) => <Pill key={item}>{item}</Pill>)}</div></div>
                    <div className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200"><Flame className="h-4 w-4" /><div className="mt-2 flex flex-wrap gap-2">{insights.topFastingReasons.map((item) => <Pill key={item}>{item}</Pill>)}</div></div>
                    <div className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200"><CheckCircle2 className="h-4 w-4" /><div className="mt-2 flex flex-wrap gap-2">{insights.topPrayerFruits.map((item) => <Pill key={item}>{item}</Pill>)}</div></div>
                  </div>
                )}
              </>
            )}

            {(tab === 'library' || tab === 'profile') && (
              <div className="rounded-2xl bg-white p-6 text-sm text-zinc-600 ring-1 ring-zinc-200">Coming soon</div>
            )}

            <div className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200">
              <button type="button" onClick={() => resetConfirmState('PRAYER')} className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white">
                <CheckCircle2 className="h-4 w-4" /> Quick Log
              </button>
            </div>
          </section>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        title="Saved. Quick check‑in"
        subtitle="Selectable only. Journal max 2 chips. Prayer fruit max 2 chips."
        onClose={() => setConfirmOpen(false)}
        footer={<div className="flex justify-end"><button type="button" onClick={saveConfirm} disabled={!confirmValid} className={cls('rounded-xl px-4 py-2 text-sm font-semibold text-white', confirmValid ? 'bg-zinc-900' : 'cursor-not-allowed bg-zinc-400')}>Save check‑in</button></div>}
      >
        {confirmType === 'JOURNAL' && (
          <div className="flex flex-wrap gap-2">
            {JOURNAL_CHIPS.map((chip) => {
              const selected = jTags.includes(chip);
              const maxed = !selected && jTags.length >= 2;
              return <Chip key={chip} label={chip} selected={selected} disabled={maxed} onClick={() => setJTags((prev) => toggleMaxSelection(prev, chip, 2))} />;
            })}
            <div className="mt-4 w-full">
              <div className="mb-2 text-xs text-zinc-600">Optional rating</div>
              <div className="flex gap-2">{(['PEACE', 'CLARITY'] as RatingType[]).map((rate) => <button key={rate} type="button" onClick={() => setJRatingType(rate)} className={cls('rounded-xl px-2 py-1 text-xs', jRatingType === rate ? 'bg-zinc-900 text-white' : 'bg-zinc-100')}>{rate}</button>)}</div>
              <div className="mt-2 flex gap-2">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" onClick={() => setJRatingValue(value)} className={cls('h-8 w-8 rounded-lg text-xs ring-1', jRatingValue === value ? 'bg-zinc-900 text-white ring-zinc-900' : 'bg-white ring-zinc-200')}>{value}</button>)}</div>
            </div>
          </div>
        )}
        {confirmType === 'FAST' && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">{FAST_ADHERENCE.map((item) => <Chip key={item} label={item} selected={fAdh === item} onClick={() => setFAdh(item)} />)}</div>
            <div className="flex flex-wrap gap-2">{FAST_REASON.map((item) => <Chip key={item} label={item} selected={fReason === item} onClick={() => setFReason(item)} />)}</div>
            <div className="flex flex-wrap gap-2">{FAST_NEXT.map((item) => <Chip key={item} label={item} selected={fNext === item} onClick={() => setFNext(item)} />)}</div>
          </div>
        )}
        {confirmType === 'PRAYER' && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">{PRAYER_TYPE.map((item) => <Chip key={item} label={item} selected={pType === item} onClick={() => setPType(item)} />)}</div>
            <div className="flex flex-wrap gap-2">{PRAYER_ATTENTION.map((item) => <Chip key={item} label={item} selected={pAttn === item} onClick={() => setPAttn(item)} />)}</div>
            <div className="flex flex-wrap gap-2">{PRAYER_FRUIT.map((item) => {
              const selected = pFruit.includes(item);
              const maxed = !selected && pFruit.length >= 2;
              return <Chip key={item} label={item} selected={selected} disabled={maxed} onClick={() => setPFruit((prev) => toggleMaxSelection(prev, item, 2))} />;
            })}</div>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(activeEvent)}
        title={activeEvent ? `${eventLabel(activeEvent.type)} Entry` : ''}
        subtitle={activeEvent ? `${formatDayLabel(activeEvent.dayKey)} • ${formatTime(activeEvent.ts)}` : ''}
        onClose={() => setActiveEventId(null)}
      >
        {activeEvent ? <pre className="overflow-auto rounded-xl bg-zinc-900 p-3 text-xs text-zinc-100">{JSON.stringify(activeEvent, null, 2)}</pre> : null}
      </Modal>
    </div>
  );
};
