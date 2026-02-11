import type { ConfirmState, EventType } from './types';

export const cls = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(' ');

export const isConfirmValid = (type: EventType, state: ConfirmState): boolean => {
  if (type === 'FAST') {
    return Boolean(state.fAdh && state.fReason);
  }

  if (type === 'PRAYER') {
    return Boolean(state.pType && state.pAttn);
  }

  return true;
};

export const toggleMaxSelection = (prev: string[], value: string, max: number): string[] => {
  if (prev.includes(value)) {
    return prev.filter((entry) => entry !== value);
  }

  if (prev.length >= max) {
    return prev;
  }

  return [...prev, value];
};

export const formatDayLabel = (dayKey: string): string => {
  const d = new Date(`${dayKey}T00:00:00`);
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (ts: string): string => {
  const d = new Date(ts);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
};
