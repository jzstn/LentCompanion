import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_EVENTS, loadEvents, persistEvents, storageKey } from '../src/storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns seeded data when storage is empty', () => {
    expect(loadEvents()).toEqual(DEFAULT_EVENTS);
  });

  it('persists and reads events', () => {
    const next = [{ ...DEFAULT_EVENTS[0], id: 'custom' }];
    persistEvents(next);

    expect(JSON.parse(localStorage.getItem(storageKey) ?? '[]')).toEqual(next);
    expect(loadEvents()).toEqual(next);
  });
});
