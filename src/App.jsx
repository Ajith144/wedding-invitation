import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Avatar,
  Button,
  Card,
  Caption1,
  createDarkTheme,
  createLightTheme,
  FluentProvider,
  MessageBar,
  MessageBarTitle,
  Skeleton,
  SkeletonItem,
  Tab,
  TabList,
  Text,
  Title1,
  Title2,
  Toolbar,
  ToolbarButton,
} from '@fluentui/react-components';
import {
  CalendarRegular,
  HeartRegular,
  ImageRegular,
  LocationRegular,
  MailRegular,
  WeatherMoonRegular,
  WeatherSunnyRegular,
} from '@fluentui/react-icons';
import { Disc3, Sparkles } from 'lucide-react';
import { api } from './api/index.js';
import { getPreviewState, setPreviewState, subscribePreviewState } from './api/previewState.js';
import CalendarReminderDialog from './components/CalendarReminderDialog.jsx';
import DataStateSwitcher from './components/DataStateSwitcher.jsx';
import EventCountdown from './components/EventCountdown.jsx';
import PhotoReel from './components/PhotoReel.jsx';
import RoyalEnvelope from './components/RoyalEnvelope.jsx';
import VinylPlayer from './components/VinylPlayer.jsx';
import { wedding as demoWedding } from './content/wedding.js';
import { openCalendarAction } from './utils/calendar.js';
import { getGuestName } from './utils/personalization.js';

const brandRamp = {
  10: '#f8e8eb', 20: '#f1d1d8', 30: '#e7a9b7', 40: '#d77d94',
  50: '#c64f70', 60: '#ae3459', 70: '#98294a', 80: '#87233e',
  90: '#7f2638', 100: '#722032', 110: '#641b2b', 120: '#571625',
  130: '#49111f', 140: '#3d0d1a', 150: '#310914', 160: '#24060e',
};
const lightTheme = createLightTheme(brandRamp);
const darkTheme = createDarkTheme(brandRamp);

function readThemePreference() {
  const saved = window.localStorage.getItem('app-theme');
  return ['light', 'dark', 'system'].includes(saved) ? saved : 'system';
}

function SectionHeading({ icon, title, hint }) {
  return (
    <div className="section-heading">
      {icon}
      <div>
        <Title2>{title}</Title2>
        {hint && <Caption1>{hint}</Caption1>}
      </div>
    </div>
  );
}

function InvitationLoading() {
  return (
    <main className="page-main" aria-label="Loading invitation" aria-busy="true">
      <Skeleton className="loading-hero">
        <SkeletonItem shape="rectangle" className="loading-hero-image" />
        <SkeletonItem shape="rectangle" className="loading-line" />
        <SkeletonItem shape="rectangle" className="loading-line loading-line--short" />
      </Skeleton>
      <Skeleton className="loading-grid">
        <SkeletonItem shape="rectangle" className="loading-card" />
        <SkeletonItem shape="rectangle" className="loading-card" />
      </Skeleton>
      <p className="sr-only">Loading wedding invitation details.</p>
    </main>
  );
}

export default function App() {
  const guest = getGuestName();
  const reducedMotion = useReducedMotion();
  const previewState = useSyncExternalStore(subscribePreviewState, getPreviewState, getPreviewState);
  const [loadState, setLoadState] = useState('loading');
  const [invitation, setInvitation] = useState(null);
  const [activeSection, setActiveSection] = useState('invitation');
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarError, setCalendarError] = useState('');
  const [failedCalendarEvent, setFailedCalendarEvent] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioStatus, setAudioStatus] = useState('');
  const [themePreference, setThemePreference] = useState(readThemePreference);
  const [systemDark, setSystemDark] = useState(() => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false);
  const audioRef = useRef(null);

  useEffect(() => {
    let active = true;
    setLoadState('loading');
    api.getInvitation().then((value) => {
      if (!active) return;
      setInvitation(value);
      setLoadState(value.events.length === 0 ? 'empty' : 'data');
    }).catch(() => {
      if (active) setLoadState('error');
    });
    return () => { active = false; };
  }, [previewState]);

  useEffect(() => {
    if (themePreference !== 'system') return undefined;
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!media) return undefined;
    const update = (event) => setSystemDark(event.matches);
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, [themePreference]);

  useEffect(() => {
    window.localStorage.setItem('app-theme', themePreference);
  }, [themePreference]);

  const resolvedTheme = themePreference === 'system' ? (systemDark ? 'dark' : 'light') : themePreference;
  const activeTheme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const invitationData = invitation || demoWedding;

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      setAudioPlaying(false);
      setAudioStatus('Soundtrack paused');
      return;
    }
    try {
      await audio.play();
      setAudioPlaying(true);
      setAudioStatus('Soundtrack playing');
    } catch {
      setAudioPlaying(false);
      setAudioStatus('No demo soundtrack was supplied. Add a licensed local /bg-music.mp3 file to enable playback.');
    }
  }

  function openInvitation() {
    setEnvelopeOpened(true);
    setCalendarError('');
    setCalendarOpen(true);
    if (!reducedMotion) {
      confetti({
        particleCount: 90,
        spread: 74,
        startVelocity: 34,
        origin: { y: 0.72 },
        colors: ['#7F2638', '#B58A43', '#F3DFAF', '#FFFDF8'],
        disableForReducedMotion: true,
      });
    }
    void toggleAudio();
  }

  function chooseCalendarEvent(event) {
    try {
      const result = openCalendarAction(event, navigator.userAgent, navigator.maxTouchPoints || 0, window);
      if (result === 'blocked') {
        setFailedCalendarEvent(event);
        setCalendarError('The calendar tab was blocked. Allow pop-ups for this site, then retry the event action.');
        return;
      }
      setFailedCalendarEvent(null);
      setCalendarError('');
    } catch {
      setFailedCalendarEvent(event);
      setCalendarError(`${event.name} calendar action could not be prepared. Retry or use the venue and time details above.`);
    }
  }

  function retryCalendarAction() {
    if (failedCalendarEvent) chooseCalendarEvent(failedCalendarEvent);
  }

  function navigateTo(value) {
    setActiveSection(value);
    document.getElementById(value)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function cycleTheme() {
    const modes = ['system', 'light', 'dark'];
    setThemePreference(modes[(modes.indexOf(themePreference) + 1) % modes.length]);
  }

  const reception = invitationData.events[0];
  const mediaSource = invitationData.photos[0]?.src;

  return (
    <FluentProvider theme={activeTheme}>
      <div className={`app-shell theme-${resolvedTheme}`}>
        <header className="site-header" aria-hidden={!envelopeOpened}>
          <Toolbar className="site-toolbar" aria-label="Wedding invitation toolbar">
            <div className="brand-lockup">
              <Avatar name="Ananya and Arjun" initials="A&A" shape="circular" />
              <div>
                <Text weight="semibold">Ananya &amp; Arjun</Text>
                <Caption1>Wedding invitation</Caption1>
              </div>
            </div>
            <div className="header-actions">
              <ToolbarButton
                aria-label={`Theme: ${themePreference}. Change theme`}
                title={`Theme: ${themePreference}`}
                icon={resolvedTheme === 'dark' ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
                onClick={cycleTheme}
              />
            </div>
          </Toolbar>
          <nav className="section-nav" aria-label="Invitation sections">
            <TabList selectedValue={activeSection} onTabSelect={(_, data) => navigateTo(String(data.value))} size="small">
              <Tab value="invitation" icon={<HeartRegular />}>Invitation</Tab>
              <Tab value="events" icon={<CalendarRegular />}>Events</Tab>
              <Tab value="venue" icon={<LocationRegular />}>Venue</Tab>
            </TabList>
          </nav>
        </header>

        <main className="page-main" aria-hidden={!envelopeOpened}>
          {loadState === 'loading' && <InvitationLoading />}
          {loadState === 'error' && (
            <MessageBar intent="error" className="page-message">
              <MessageBarTitle>Invitation details could not be loaded.</MessageBarTitle>
              <Button appearance="secondary" onClick={() => setPreviewState('data')}>Return to invitation details</Button>
            </MessageBar>
          )}
          {loadState === 'empty' && (
            <Card className="empty-state page-empty">
              <ImageRegular className="empty-state-icon" aria-hidden="true" />
              <Title2>Details are being prepared</Title2>
              <p className="body-muted">There are no event details in this preview state.</p>
              <Button appearance="primary" onClick={() => setPreviewState('data')}>
                Show the demo invitation
              </Button>
            </Card>
          )}
          {loadState === 'data' && invitation && (
            <AnimatePresence mode="wait">
              <motion.div
                key="invitation"
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.24 }}
              >
                <motion.section className="hero-panel" aria-labelledby="hero-title">
                  {mediaSource && <img className="hero-photo" src="/assets/hero-fallback.webp" alt="" loading="eager" />}
                  <div className="hero-scrim" />
                  <svg className="hero-mesh" aria-hidden="true" viewBox="0 0 800 400" preserveAspectRatio="none">
                    <defs>
                      <radialGradient id="hero-glow-a" cx="0%" cy="0%" r="80%">
                        <stop offset="0%" stopColor="#B58A43" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#B58A43" stopOpacity="0" />
                      </radialGradient>
                      <radialGradient id="hero-glow-b" cx="100%" cy="100%" r="80%">
                        <stop offset="0%" stopColor="#7F2638" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#7F2638" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <rect width="800" height="400" fill="url(#hero-glow-a)" />
                    <rect width="800" height="400" fill="url(#hero-glow-b)" />
                  </svg>
                  <div className="hero-copy">
                    <span className="hero-eyebrow"><Sparkles size={14} aria-hidden="true" />Editable demo details · verify before publication</span>
                    <Title1 as="h1" id="hero-title">{invitationData.couple}</Title1>
                    <p>{invitationData.description}</p>
                    <div className="hero-actions">
                      <Button appearance="primary" icon={<MailRegular />} onClick={openInvitation}>Open your invitation</Button>
                      <Button appearance="secondary" className="hero-secondary" icon={<CalendarRegular />} onClick={() => setCalendarOpen(true)}>View the celebration schedule</Button>
                    </div>
                    <div className="hero-place"><LocationRegular aria-hidden="true" /> Bengaluru, India <span /> 18-19 November 2026</div>
                  </div>
                  <div className="hero-side-note" aria-hidden="true">Together<br />with our<br />families</div>
                </motion.section>

                <section id="invitation" className="content-section invitation-section" aria-labelledby="invitation-title">
                  <SectionHeading icon={<MailRegular aria-hidden="true" />} title="A note for you" hint="A warm welcome to family and friends" />
                  <Card className="letter-card">
                    <span className="letter-rule" aria-hidden="true" />
                    <p className="letter-recipient">Dear {guest},</p>
                    <p className="letter-copy">Please join Ananya &amp; Arjun and their families for the wedding reception and muhurtham. Your presence will make these celebrations all the more meaningful.</p>
                    <p className="demo-note">{invitationData.demoNotice}</p>
                    <p className="letter-signoff">With love,<br /><span>Ananya &amp; Arjun</span></p>
                  </Card>
                </section>

                <section id="events" className="content-section" aria-labelledby="events-title">
                  <SectionHeading icon={<CalendarRegular aria-hidden="true" />} title="The celebrations" hint={invitationData.venue} />
                  <div className="event-grid">
                    {invitationData.events.map((event, index) => (
                      <Card className={`event-card event-card--${index + 1}`} key={event.id}>
                        <div className="event-topline"><span className="event-number">0{index + 1}</span><span className="event-badge">{event.label}</span></div>
                        <Title2>{event.name}</Title2>
                        <p className="event-date">{event.dateLabel}</p>
                        <p className="event-time">{event.timeLabel}</p>
                        <p className="event-place"><LocationRegular aria-hidden="true" />{event.venue}</p>
                        <Button appearance="secondary" icon={<CalendarRegular />} onClick={() => setCalendarOpen(true)}>Choose {event.name} reminder</Button>
                      </Card>
                    ))}
                  </div>
                  {reception && <EventCountdown event={reception} />}
                  <div className="schedule-actions">
                    <Button appearance="primary" icon={<CalendarRegular />} onClick={() => setCalendarOpen(true)}>Choose a calendar reminder</Button>
                    <Button appearance="secondary" icon={<LocationRegular />} onClick={() => navigateTo('venue')}>Find the venue</Button>
                  </div>
                </section>

                <section id="memories" className="content-section" aria-labelledby="memories-title">
                  <SectionHeading icon={<ImageRegular aria-hidden="true" />} title="Moments to remember" hint="A few illustrative frames for the celebration" />
                  <PhotoReel photos={invitationData.photos} />
                  <p className="media-disclaimer">Illustrative stock imagery only. Replace with approved personal photographs before publication.</p>
                </section>

                <section id="venue" className="content-section venue-section" aria-labelledby="venue-title">
                  <SectionHeading icon={<LocationRegular aria-hidden="true" />} title="Find the venue" hint="Address to be verified" />
                  <Card className="venue-card">
                    <div className="venue-mark"><LocationRegular aria-hidden="true" /></div>
                    <div className="venue-copy">
                      <Title2>{invitationData.venue}</Title2>
                      <p>{invitationData.venueAddress}</p>
                      <p className="body-muted">The street address has not been verified. Search by venue name and city; no map pin is provided.</p>
                      <a className="venue-link" href={invitationData.mapUrl} target="_blank" rel="noopener noreferrer">
                        <LocationRegular aria-hidden="true" /> Search Sri Convention Hall, Bengaluru <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                    <div className="venue-coordinate" aria-hidden="true"><span>12°58′N</span><span>77°35′E</span><small>APPROXIMATE CITY ONLY</small></div>
                  </Card>
                </section>

                <section id="reminders" className="content-section reminder-section" aria-labelledby="reminders-title">
                  <SectionHeading icon={<CalendarRegular aria-hidden="true" />} title="Keep the dates close" hint="Choose an event to create a reminder" />
                  <Card className="reminder-card">
                    <div className="reminder-copy">
                      <Title2>Two days, one joyful gathering.</Title2>
                      <p>Your calendar app may handle downloads and alarms differently. Importing a file does not guarantee notifications.</p>
                    </div>
                    <Button appearance="primary" icon={<CalendarRegular />} onClick={() => setCalendarOpen(true)}>Choose a calendar reminder</Button>
                  </Card>
                </section>
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        <footer className="site-footer" aria-hidden={!envelopeOpened}>
          <div className="footer-monogram">A&amp;A</div>
          <p>Ananya &amp; Arjun · Editable demo invitation</p>
          <Caption1>Wedding details, venue address, and media require verification.</Caption1>
        </footer>

        <AnimatePresence>
          {!envelopeOpened && <RoyalEnvelope guest={guest} onOpen={openInvitation} />}
        </AnimatePresence>
        <VinylPlayer
          audioRef={audioRef}
          isPlaying={audioPlaying}
          onToggle={toggleAudio}
          status={audioStatus}
        />
        <DataStateSwitcher state={previewState} />
        <CalendarReminderDialog
          open={calendarOpen}
          onClose={() => setCalendarOpen(false)}
          events={invitationData.events}
          onChoose={chooseCalendarEvent}
          onRetry={retryCalendarAction}
          retryLabel={failedCalendarEvent?.name}
          error={calendarError}
        />
        <div className="soundtrack-disc-icon" aria-hidden="true"><Disc3 size={18} /></div>
      </div>
    </FluentProvider>
  );
}