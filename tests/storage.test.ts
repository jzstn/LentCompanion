import { beforeEach, describe, expect, it } from 'vitest';
import { loadEvents, persistEvents, seedEvents, storageKey } from '../src/storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns seeded data when storage is empty', () => {
    expect(loadEvents()).toEqual(seedEvents());
  });

  it('persists and reads events', () => {
    const next = [{ ...seedEvents()[0], id: 'custom' }];
    persistEvents(next);

    expect(JSON.parse(localStorage.getItem(storageKey) ?? '[]')).toEqual(next);
    expect(loadEvents()).toEqual(next);
  });
});
