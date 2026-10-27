import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../src/App.jsx';
import { wedding } from '../src/content/wedding.js';

vi.mock('../src/api/index.js', () => ({
  api: { getInvitation: vi.fn() },
}));
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

import { api } from '../src/api/index.js';

describe('wedding invitation page', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValue(new Error('Audio asset is not available in tests.'));
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
    api.getInvitation.mockResolvedValue(wedding);
    window.history.replaceState({}, '', '/?to=Priya');
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders the personalized invitation safely as text', async () => {
    render(<App />);
    expect(await screen.findByText('Dear Priya,')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ajith B & Anjana S' })).toBeInTheDocument();
    expect(screen.getByText('Balakrishna M & Rani B')).toBeInTheDocument();
    expect(screen.getByText('Shivakumar S & Manjula')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Ajith and Anjana together in Indian wedding attire' })).toBeInTheDocument();
    expect(screen.getByText(/31\/10, left of Magadi Main Road/)).toBeInTheDocument();
    expect(screen.getByText('6:30-10:00 PM IST')).toBeInTheDocument();
    expect(screen.getByText('9:00-10:30 AM IST')).toBeInTheDocument();
  });

  it('opens the first Moments story with keyboard activation', async () => {
    render(<App />);
    await screen.findByText('Dear Priya,');

    const storyCard = screen.getByRole('button', { name: 'Read story: A Day to Remember 🌿' });
    fireEvent.keyDown(storyCard, { key: 'Enter' });

    expect(await screen.findByText('TWO PEOPLE. TWO FAMILIES. ONE BEAUTIFUL YES! ❤️')).toBeInTheDocument();
    expect(screen.getByText('காதல் தொடங்கியது இருவரால்… இன்று இரண்டு குடும்பங்களையும் இணைத்திருக்கிறது. ❤️')).toBeInTheDocument();
    expect(screen.getByText('ಎರಡು ಮನಸುಗಳು ಒಂದಾದವು… ಇಂದು ಎರಡು ಕುಟುಂಬಗಳು ಒಂದಾಗಿವೆ. ❤️')).toBeInTheDocument();
  });

  it('opens the calendar reminder dialog from the invitation action', async () => {
    render(<App />);
    await screen.findByText('Dear Priya,');
    fireEvent.click(screen.getByRole('button', { name: 'Open the wedding invitation' }));
    expect(await screen.findByText('Save a date')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Choose an event to create a reminder/i)).toBeInTheDocument());
  });
});