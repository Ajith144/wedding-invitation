const venue = 'KARNATAKA PATEL BHAWAN';
const venueAddress = '31/10, left of Magadi Main Road, behind Saraswathi Convention Center, Govindaraja Nagar Ward, Stage 1, Vijayanagar, Bengaluru, Karnataka 560079';
const mapQuery = new URLSearchParams({ query: `${venue}, ${venueAddress}` });

export const wedding = {
  couple: 'Ajith B & Anjana S',
  groom: { name: 'Ajith B', father: 'Balakrishna M', mother: 'Rani B' },
  bride: { name: 'Anjana S', father: 'Shivakumar S', mother: 'Manjula' },
  invitationMessage: 'Please join Ajith B and Anjana S and their families for the wedding reception and muhurtham. Your presence will make these celebrations all the more meaningful.',
  familyDetails: [
    { label: "Groom's parents", names: 'Balakrishna M & Rani B' },
    { label: "Bride's parents", names: 'Shivakumar S & Manjula' },
  ],
  venue,
  venueAddress,
  venueArea: 'Govindaraja Nagar Ward, Vijayanagar, Bengaluru',
  mapUrl: `https://www.google.com/maps/search/?api=1&${mapQuery.toString()}`,
  description: 'With joyful hearts, Ajith B and Anjana S invite you to join their families for two days of celebration in Bengaluru.',
  events: [
    {
      id: 'reception-2026',
      name: 'Reception',
      label: 'Wednesday evening',
      dateLabel: 'Wednesday 18 November 2026',
      timeLabel: '6:30-10:00 PM IST',
      start: '2026-11-18T18:30:00+05:30',
      end: '2026-11-18T22:00:00+05:30',
      startLocal: '20261118T183000',
      endLocal: '20261118T220000',
      venue,
    },
    {
      id: 'muhurtham-2026',
      name: 'Muhurtham',
      label: 'Thursday morning',
      dateLabel: 'Thursday 19 November 2026',
      timeLabel: '9:00-10:30 AM IST',
      start: '2026-11-19T09:00:00+05:30',
      end: '2026-11-19T10:30:00+05:30',
      startLocal: '20261119T090000',
      endLocal: '20261119T103000',
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