const DEFAULT_GUEST = 'family and friends';

export function getGuestName(search = window.location.search) {
  const value = new URLSearchParams(search).get('to')?.trim();
  if (!value) return DEFAULT_GUEST;
  return Array.from(value).slice(0, 80).join('');
}