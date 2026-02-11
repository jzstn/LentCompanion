import { describe, expect, it } from 'vitest';
import { isConfirmValid, toggleMaxSelection } from '../src/app-helpers';

describe('isConfirmValid', () => {
  it('accepts journal without required fields', () => {
    expect(isConfirmValid('JOURNAL', { fAdh: '', fReason: '', pType: '', pAttn: '' })).toBe(true);
  });

  it('requires fasting adherence and reason', () => {
    expect(isConfirmValid('FAST', { fAdh: 'Kept the fast', fReason: '', pType: '', pAttn: '' })).toBe(false);
    expect(isConfirmValid('FAST', { fAdh: 'Kept the fast', fReason: 'Social situation', pType: '', pAttn: '' })).toBe(true);
  });

  it('requires prayer type and attention', () => {
    expect(isConfirmValid('PRAYER', { fAdh: '', fReason: '', pType: 'Morning prayer', pAttn: '' })).toBe(false);
    expect(isConfirmValid('PRAYER', { fAdh: '', fReason: '', pType: 'Morning prayer', pAttn: 'Focused' })).toBe(true);
  });
});

describe('toggleMaxSelection', () => {
  it('adds up to max and allows removal', () => {
    expect(toggleMaxSelection([], 'A', 2)).toEqual(['A']);
    expect(toggleMaxSelection(['A'], 'B', 2)).toEqual(['A', 'B']);
    expect(toggleMaxSelection(['A', 'B'], 'C', 2)).toEqual(['A', 'B']);
    expect(toggleMaxSelection(['A', 'B'], 'B', 2)).toEqual(['A']);
  });
});
