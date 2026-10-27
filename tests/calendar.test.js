import { describe, expect, it, vi } from 'vitest';
import {
  buildCalendarFile,
  buildGoogleCalendarUrl,
  escapeCalendarText,
  foldCalendarLine,
  isAppleCalendarClient,
  openCalendarAction,
} from '../src/utils/calendar.js';
import { wedding } from '../src/content/wedding.js';

describe('calendar utilities', () => {
  it('escapes RFC5545 text characters', () => {
    expect(escapeCalendarText('Hall, Bengaluru;\nA\\B')).toBe('Hall\\, Bengaluru\\;\\nA\\\\B');
  });

  it('folds UTF-8 lines at no more than 75 octets', () => {
    const folded = foldCalendarLine(`SUMMARY:${'शुभ विवाह '.repeat(12)}`);
    for (const line of folded.split('\r\n')) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
    expect(folded).toContain('\r\n ');
  });

  it('writes CRLF calendar data with timezone and both display alarms', () => {
    const calendar = buildCalendarFile(wedding.events[0], new Date('2026-10-26T12:00:00.000Z'));
    expect(calendar).toContain('DTSTART;TZID=Asia/Kolkata:20261118T183000');
    expect(calendar).toContain('TRIGGER:-P1D');
    expect(calendar).toContain('TRIGGER:-PT2H');
    expect(calendar).toContain('UID:reception-2026@ajith-anjana-wedding');
    expect(calendar).toContain('SUMMARY:Reception | Ajith B & Anjana S');
    expect(calendar).toMatch(/\r\n$/);
    expect(calendar).not.toMatch(/(^|[^\r])\n/);
  });

  it('recognizes iPad desktop mode and does not mistake a desktop Mac for iPad', () => {
    expect(isAppleCalendarClient('Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)', 5)).toBe(true);
    expect(isAppleCalendarClient('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', 0)).toBe(false);
    expect(isAppleCalendarClient('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', 5)).toBe(true);
  });

  it('shares an iCalendar file on iPhone instead of downloading it', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const open = vi.fn();
    const result = await openCalendarAction(
      wedding.events[0],
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
      1,
      { open },
      { canShare: () => true, share },
    );

    expect(result).toBe('shared');
    expect(share).toHaveBeenCalledOnce();
    expect(share.mock.calls[0][0].files[0].name).toBe('reception-2026.ics');
    expect(share.mock.calls[0][0].files[0].type).toBe('text/calendar');
    expect(open).not.toHaveBeenCalled();
  });

  it('opens Google Calendar on iPhone when file sharing is unavailable', async () => {
    const open = vi.fn(() => ({}));
    const result = await openCalendarAction(
      wedding.events[0],
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
      1,
      { open },
      {},
    );

    expect(result).toBe('opened');
    expect(open).toHaveBeenCalledWith(buildGoogleCalendarUrl(wedding.events[0]), '_blank');
  });

  it('encodes Google Calendar values and timezone', () => {
    const url = new URL(buildGoogleCalendarUrl({
      ...wedding.events[0],
      venue: 'Hall & Garden, Bengaluru',
    }));
    expect(url.searchParams.get('ctz')).toBe('Asia/Kolkata');
    expect(url.searchParams.get('location')).toBe('Hall & Garden, Bengaluru');
    expect(url.searchParams.get('dates')).toBe('20261118T183000/20261118T220000');
  });
});