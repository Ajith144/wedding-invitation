import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../src/App.jsx';
import { wedding } from '../src/content/wedding.js';

vi.mock('../src/api/index.js', () => ({
  api: { getInvitation: vi.fn() },
}));
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

import { api } from '../src/api/index.js';

async function openInvitation() {
  fireEvent.click(screen.getByRole('button', { name: 'Open the wedding invitation' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Close calendar reminders' }));
  await waitFor(() => expect(screen.queryByRole('button', { name: 'Open the wedding invitation' })).not.toBeInTheDocument());
}

describe('wedding invitation page', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal('matchMedia', vi.fn((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })));
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValue(new Error('Audio asset is not available in tests.'));
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
    api.getInvitation.mockResolvedValue(wedding);
    window.history.replaceState({}, '', '/?to=Priya');
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the personalized invitation safely as text', async () => {
    render(<App />);
    expect(await screen.findByText('Dear Priya,')).toBeInTheDocument();
    await openInvitation();
    expect(screen.getByRole('heading', { name: 'Ajith B & Anjana S' })).toBeInTheDocument();
    expect(screen.getByText('Balakrishna M & Rani B')).toBeInTheDocument();
    expect(screen.getByText('Shivakumar S & Manjula')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Ajith and Anjana together in Indian wedding attire' })).toBeInTheDocument();
    expect(screen.getByText(/31\/10, left of Magadi Main Road/)).toBeInTheDocument();
    expect(screen.getByText('6:30-10:00 PM IST')).toBeInTheDocument();
    expect(screen.getByText('9:00-10:30 AM IST')).toBeInTheDocument();
  });

  it('defaults to light even when the device prefers dark', async () => {
    window.matchMedia.mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)' || query === '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
    render(<App />);
    await screen.findByText('Dear Priya,');

    await openInvitation();
    expect(screen.getByRole('button', { name: 'Theme: light. Change theme' })).toBeInTheDocument();
    expect(window.localStorage.getItem('app-theme')).toBe('light');
  });

  it.each(['light', 'dark'])('opens the first Moments story with keyboard activation in %s theme', async (theme) => {
    window.localStorage.setItem('app-theme', theme);
    render(<App />);
    await screen.findByText('Dear Priya,');
    await openInvitation();
    expect(screen.getByRole('button', { name: `Theme: ${theme}. Change theme` })).toBeInTheDocument();

    const storyCard = screen.getByRole('button', { name: 'Read story: A Day to Remember 🌿' });
    fireEvent.keyDown(storyCard, { key: 'Enter' });

    expect(await screen.findByText('TWO PEOPLE. TWO FAMILIES. ONE BEAUTIFUL YES! ❤️')).toBeInTheDocument();
    expect(screen.getByText('காதல் தொடங்கியது இருவரால்… இன்று இரண்டு குடும்பங்களையும் இணைத்திருக்கிறது. ❤️')).toBeInTheDocument();
    expect(screen.getByText('ಎರಡು ಮನಸುಗಳು ಒಂದಾದವು… ಇಂದು ಎರಡು ಕುಟುಂಬಗಳು ಒಂದಾಗಿವೆ. ❤️')).toBeInTheDocument();
  });

  it.each(['light', 'dark'])('opens the eight-year story by tapping Open story in %s theme', async (theme) => {
    window.localStorage.setItem('app-theme', theme);
    render(<App />);
    await screen.findByText('Dear Priya,');
    await openInvitation();

    const storyCard = screen.getByRole('button', { name: 'Read story: 8 Years & Beyond ∞' });
    fireEvent.click(storyCard.querySelector('.photo-card-action'));

    expect(await screen.findByText('When destiny writes the script, every detour makes sense.')).toBeInTheDocument();
    expect(screen.getByText(/Back in 2017/)).toBeInTheDocument();
  });

  it('opens the calendar reminder dialog from the invitation action', async () => {
    render(<App />);
    await screen.findByText('Dear Priya,');
    fireEvent.click(screen.getByRole('button', { name: 'Open the wedding invitation' }));
    expect(await screen.findByText('Save a date')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close calendar reminders' })).toBeInTheDocument();
  });
});