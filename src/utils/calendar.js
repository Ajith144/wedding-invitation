const TIME_ZONE = 'Asia/Kolkata';

export function escapeCalendarText(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

export function foldCalendarLine(line) {
  const chunks = [];
  let current = '';
  let byteLength = 0;

  for (const character of line) {
    const size = new TextEncoder().encode(character).length;
    if (byteLength + size > 75) {
      chunks.push(current);
      current = ` ${character}`;
      byteLength = 1 + size;
    } else {
      current += character;
      byteLength += size;
    }
  }
  chunks.push(current);
  return chunks.join('\r\n');
}

export function buildCalendarFile(event, now = new Date()) {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ananya and Arjun//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    `TZID:${TIME_ZONE}`,
    'BEGIN:STANDARD',
    'DTSTART:19700101T000000',
    'TZOFFSETFROM:+0530',
    'TZOFFSETTO:+0530',
    'TZNAME:IST',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${event.id}@ananya-arjun-wedding-demo`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=${TIME_ZONE}:${event.startLocal}`,
    `DTEND;TZID=${TIME_ZONE}:${event.endLocal}`,
    `SUMMARY:${escapeCalendarText(`${event.name} | Ananya & Arjun`)}`,
    `LOCATION:${escapeCalendarText(event.venue)}`,
    `DESCRIPTION:${escapeCalendarText('Editable demo invitation. Verify event details before publication.')}`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeCalendarText(`${event.name} is tomorrow`)}`,
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeCalendarText(`${event.name} begins in two hours`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${lines.map(foldCalendarLine).join('\r\n')}\r\n`;
}

export function isAppleCalendarClient(userAgent = navigator.userAgent, maxTouchPoints = navigator.maxTouchPoints || 0) {
  return /iPhone|iPad|iPod/i.test(userAgent) || (/Macintosh/i.test(userAgent) && maxTouchPoints > 1);
}

export function buildGoogleCalendarUrl(event) {
  const url = new URL('https://calendar.google.com/calendar/render');
  url.search = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${event.name} | Ananya & Arjun`,
    dates: `${event.startLocal}/${event.endLocal}`,
    ctz: TIME_ZONE,
    details: 'Editable demo invitation. Verify event details before publication.',
    location: event.venue,
  }).toString();
  return url.toString();
}

export function downloadAppleCalendar(event, documentRef = document) {
  const anchor = documentRef.createElement('a');
  const file = buildCalendarFile(event);
  anchor.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(file)}`;
  anchor.download = `${event.id}.ics`;
  anchor.hidden = true;
  documentRef.body.append(anchor);
  anchor.click();
  anchor.remove();
}

export function openCalendarAction(event, userAgent, maxTouchPoints, windowRef = window) {
  if (isAppleCalendarClient(userAgent, maxTouchPoints)) {
    downloadAppleCalendar(event);
    return 'download';
  }
  const opened = windowRef.open(buildGoogleCalendarUrl(event), '_blank');
  if (!opened) return 'blocked';
  opened.opener = null;
  return 'opened';
}