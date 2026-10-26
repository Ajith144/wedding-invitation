const venue = 'Sri Convention Hall, Bengaluru';

export const wedding = {
  couple: 'Ananya & Arjun',
  venue,
  venueAddress: 'Address to be verified',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sri+Convention+Hall%2C+Bengaluru',
  description: 'With joyful hearts, we invite you to join our families for two days of celebration in Bengaluru.',
  demoNotice: 'Editable demo details. Verify names, dates, venue, and media before publication.',
  events: [
    {
      id: 'reception-2026',
      name: 'Reception',
      label: 'Wednesday evening',
      dateLabel: 'Wednesday 18 November 2026',
      timeLabel: '6:00-9:00 PM IST',
      start: '2026-11-18T18:00:00+05:30',
      end: '2026-11-18T21:00:00+05:30',
      startLocal: '20261118T180000',
      endLocal: '20261118T210000',
      venue,
    },
    {
      id: 'muhurtham-2026',
      name: 'Muhurtham',
      label: 'Thursday morning',
      dateLabel: 'Thursday 19 November 2026',
      timeLabel: '7:30-9:00 AM IST',
      start: '2026-11-19T07:30:00+05:30',
      end: '2026-11-19T09:00:00+05:30',
      startLocal: '20261119T073000',
      endLocal: '20261119T090000',
      venue,
    },
  ],
  photos: [
    {
      id: 'celebration-light',
      title: 'A day to remember',
      caption: 'Illustrative stock photography; replace with approved local imagery.',
      alt: 'Warmly lit wedding reception table with flowers',
      src: '/assets/story-01.webp',
    },
    {
      id: 'gathering',
      title: 'Together, in Bengaluru',
      caption: 'Illustrative stock photography; replace with approved local imagery.',
      alt: 'Wedding celebration details arranged on a table',
      src: '/assets/story-02.webp',
    },
    {
      id: 'flowers',
      title: 'A little more joy',
      caption: 'Illustrative stock photography; replace with approved local imagery.',
      alt: 'Floral decorations prepared for a wedding celebration',
      src: '/assets/story-03.webp',
    },
  ],
};