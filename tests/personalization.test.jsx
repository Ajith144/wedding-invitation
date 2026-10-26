import { describe, expect, it } from 'vitest';
import { getGuestName } from '../src/utils/personalization.js';

describe('guest personalization', () => {
  it('uses the default greeting when the query is absent or blank', () => {
    expect(getGuestName('')).toBe('family and friends');
    expect(getGuestName('?to=%20%20')).toBe('family and friends');
  });

  it('returns a bounded guest value as plain text input', () => {
    expect(getGuestName('?to=Priya%20%26%20Sam')).toBe('Priya & Sam');
    expect(getGuestName(`?to=${'a'.repeat(100)}`)).toHaveLength(80);
    expect(getGuestName('?to=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E')).toBe('<img src=x onerror=alert(1)>');
  });
});