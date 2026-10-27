import couplePortrait from '../photos/475F1045-7673-495E-AE8B-2DE900FB1A11.jpg';
import receptionAttire from '../annimation-clip/Reception Attire.png';
import joyfulWeddingImage from '../annimation-clip/Joyful South Indian Wedding Couple.png';

const venue = 'KARNATAKA PATEL BHAWAN';
const venueAddress = '31/10, left of Magadi Main Road, behind Saraswathi Convention Center, Govindaraja Nagar Ward, Stage 1, Vijayanagar, Bengaluru, Karnataka 560079';
const mapQuery = new URLSearchParams({ query: `${venue}, ${venueAddress}` });

export const wedding = {
  couple: 'Ajith B & Anjana S 💍✨',
  groom: { name: 'Ajith B', father: 'Balakrishna M', mother: 'Rani B' },
  bride: { name: 'Anjana S', father: 'Shivakumar R', mother: 'Manjula E' },
  invitationMessage: 'As we step into this beautiful new chapter of our lives, having the people who matter most beside us means everything. We joyfully invite you to join us and our families to celebrate our Marriage. Your presence, love, and blessings will make our special day truly complete.✨🙏❤️',
  familyDetails: [
    { label: "Groom's parents 🌸", names: 'Balakrishna M & Rani B' },
    { label: "Bride's parents 🌸", names: 'Shivakumar R & Manjula E' },
  ],
  venue,
  venueAddress,
  venueArea: 'Govindaraja Nagar Ward, Vijayanagar, Bengaluru',
  mapUrl: `https://www.google.com/maps/search/?api=1&${mapQuery.toString()}`,
  description: 'With joyful hearts and the blessings of our families, we invite you to share in our happiness as we unite in marriage and begin this beautiful new journey together',
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
      image: receptionAttire,
      imageAlt: 'Ajith and Anjana in their reception attire',
      image: receptionAttire,
      imageAlt: 'Ajith and Anjana in their reception attire',
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
      image: joyfulWeddingImage,
      imageAlt: 'Ajith and Anjana smiling together in traditional South Indian wedding attire',
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
      id: 'couple-portrait',
      title: 'Ajith & Anjana',
      caption: 'A moment together from our journey.',
      alt: 'Ajith and Anjana together outdoors in the mountains',
      src: couplePortrait,
    },
  ],
};