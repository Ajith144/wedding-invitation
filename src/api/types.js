/**
 * @typedef {{ id: string, name: string, label: string, dateLabel: string, timeLabel: string, start: string, end: string, startLocal: string, endLocal: string, venue: string }} WeddingEvent
 * @typedef {{ id: string, title: string, caption: string, alt: string, src: string }} WeddingPhoto
 * @typedef {{ couple: string, venue: string, venueAddress: string, mapUrl: string, description: string, demoNotice: string, events: WeddingEvent[], photos: WeddingPhoto[] }} Invitation
 * @typedef {{ getInvitation: () => Promise<Invitation> }} ApiClient
 */
export {};