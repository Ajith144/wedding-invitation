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
import EventCountdown from './components/EventCountdown.jsx';
import PhotoReel from './components/PhotoReel.jsx';
import RoyalEnvelope from './components/RoyalEnvelope.jsx';
import VinylPlayer from './components/VinylPlayer.jsx';
import WeddingFlorals from './components/WeddingFlorals.jsx';
import { wedding as demoWedding } from './content/wedding.js';
import { openCalendarAction } from './utils/calendar.js';
import { getGuestName } from './utils/personalization.js';

const brandRamp = {
  10: '#e9f2e8', 20: '#d3e6d7', 30: '#b6d3c0', 40: '#94bea7',
  50: '#72a88d', 60: '#548d72', 70: '#3c765c', 80: '#2c6049',
  90: '#214a3a', 100: '#1c4032', 110: '#18372b', 120: '#142f25',
  130: '#10271f', 140: '#0c2019', 150: '#091a14', 160: '#06130f',
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
  const sectionReveal = reducedMotion ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.16 },
    transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1] },
  };
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
  const heroCouple = invitationData.couple.replace(/[💍✨]/gu, '').replace(/\s+/g, ' ').trim();
  const heroPortrait = invitationData.photos?.find((photo) => photo.id === 'couple-portrait')
    ?? (invitationData.events?.[1] ? {
      src: invitationData.events[1].image,
      alt: invitationData.events[1].imageAlt,
    } : null);

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
      setAudioStatus('The soundtrack could not be played. Try pressing play again.');
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
        colors: ['#214A3A', '#C3A45F', '#F2EDDF', '#53746B'],
        disableForReducedMotion: true,
      });
    }
    void toggleAudio();
  }

  async function chooseCalendarEvent(event) {
    try {
      const result = await openCalendarAction(event, navigator.userAgent, navigator.maxTouchPoints || 0, window, navigator);
      if (result === 'cancelled') return;
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

  return (
    <FluentProvider theme={activeTheme}>
      <div className={`app-shell theme-${resolvedTheme}`}>
        <WeddingFlorals variant="page" />
        <header className="site-header" aria-hidden={!envelopeOpened}>
          <Toolbar className="site-toolbar" aria-label="Wedding invitation toolbar">
            <div className="brand-lockup">
              <Avatar name={invitationData.couple} initials="A&A" shape="circular" />
              <div>
                <Text weight="semibold">{invitationData.couple}</Text>
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
                <motion.section
                  className="hero-panel"
                  aria-labelledby="hero-title"
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.985, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="hero-scrim" />
                  {heroPortrait?.src && (
                    <figure className="hero-portrait">
                      <img src={heroPortrait.src} alt={heroPortrait.alt || `Ajith and Anjana`} fetchPriority="high" />
                      <figcaption>
                        {invitationData.events.slice(0, 2).map((event) => (
                          <span key={event.id}>{event.dateLabel.match(/\d{1,2}\s+[A-Za-z]+/)?.[0] || event.name}</span>
                        ))}
                      </figcaption>
                    </figure>
                  )}
                  <div className="hero-fireworks" aria-hidden="true">
                    {[0, 1, 2].map((burst) => (
                      <div className={`hero-firework hero-firework--${burst + 1}`} key={burst}>
                        {Array.from({ length: 8 }, (_, spark) => (
                          <i
                            key={spark}
                            style={{ '--spark-angle': `${spark * 45}deg`, '--spark-delay': `${spark * 35}ms` }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="hero-motes" aria-hidden="true">
                    <span /><span /><span /><span /><span /><span />
                  </div>
                  <div className="hero-copy">
                    <span className="hero-eyebrow"><Sparkles size={14} aria-hidden="true" />Wedding celebration · Bengaluru</span>
                    <Title1 as="h1" id="hero-title" aria-label={heroCouple}>
                      {heroCouple.split(' & ').map((name, index) => <span key={name}>{index > 0 && <i aria-hidden="true">&amp;</i>}{name}</span>)}
                    </Title1>
                    <p>{invitationData.description}</p>
                    {invitationData.events[0] && <EventCountdown event={invitationData.events[0]} variant="hero" />}
                    <div className="hero-actions">
                      <Button appearance="primary" icon={<MailRegular />} onClick={openInvitation}>Open your invitation</Button>
                      <Button appearance="secondary" className="hero-secondary" icon={<CalendarRegular />} onClick={() => setCalendarOpen(true)}>View the celebration schedule</Button>
                    </div>
                    <div className="hero-place"><LocationRegular aria-hidden="true" /> {invitationData.venueArea}</div>
                  </div>
                </motion.section>

                <motion.section id="invitation" className="content-section invitation-section" aria-labelledby="invitation-title" {...sectionReveal}>
                  <SectionHeading icon={<MailRegular aria-hidden="true" />} title="A note for you" hint="A warm welcome to our dearest family and friends🙏" />
                  <Card className="letter-card">
                    <span className="letter-rule" aria-hidden="true" />
                    <p className="letter-recipient">Dear {guest},</p>
                    <p className="letter-copy">
                      {invitationData.invitationMessage.split(/(people who matter most)/gi).map((part, index) => (
                        part.toLowerCase() === 'people who matter most' ? <strong key={index}>{part}</strong> : part
                      ))}
                    </p>
                    <div className="family-details">
                      {invitationData.familyDetails.map((family) => (
                        <p key={family.label}><span>{family.label}</span>{family.names}</p>
                      ))}
                    </div>
                    <p className="letter-signoff">With love,<br /><span>{invitationData.couple}</span></p>
                  </Card>
                </motion.section>

                <motion.section id="events" className="content-section" aria-labelledby="events-title" {...sectionReveal}>
                  <SectionHeading icon={<CalendarRegular aria-hidden="true" />} title="The celebrations" hint={`${invitationData.venue}, ${invitationData.venueArea}`} />
                  <div className="event-grid">
                    {invitationData.events.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={reducedMotion ? false : { opacity: 0, y: 20, rotate: index === 0 ? -1 : 1 }}
                        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.55, delay: reducedMotion ? 0 : index * 0.12 }}
                      >
                      <Card className={`event-card event-card--${index + 1}`}>
                        <div className="event-topline"><span className="event-number">0{index + 1}</span><span className="event-badge">{event.label}</span></div>
                        <div className="event-card-photo"><img src={event.image} alt={event.imageAlt} loading="lazy" /></div>
                        <Title2>{event.name}</Title2>
                        <div className="event-meta">
                          <p className="event-date">{event.dateLabel}</p>
                          <p className="event-time">{event.timeLabel}</p>
                          <p className="event-place"><LocationRegular aria-hidden="true" />{event.venue}</p>
                        </div>
                        <Button appearance="secondary" icon={<CalendarRegular />} onClick={() => setCalendarOpen(true)}>Choose {event.name} reminder</Button>
                      </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                <motion.section id="memories" className="content-section" aria-labelledby="memories-title" {...sectionReveal}>
                  <SectionHeading icon={<ImageRegular aria-hidden="true" />} title="Moments to remember" hint="A collection of special moments leading to our forever." />
                  <PhotoReel photos={invitationData.photos} />
                </motion.section>

                <motion.section id="venue" className="content-section venue-section" aria-labelledby="venue-title" {...sectionReveal}>
                  <SectionHeading icon={<LocationRegular aria-hidden="true" />} title="Find the venue" hint="Vijayanagar, Bengaluru" />
                  <Card className="venue-card">
                    <div className="venue-mark"><LocationRegular aria-hidden="true" /></div>
                    <div className="venue-copy">
                      <Title2>{invitationData.venue}</Title2>
                      <p>{invitationData.venueAddress}</p>
                      <a className="venue-link" href={invitationData.mapUrl} target="_blank" rel="noopener noreferrer">
                        <LocationRegular aria-hidden="true" /> Search {invitationData.venue} <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </Card>
                </motion.section>

                <motion.section id="reminders" className="content-section reminder-section" aria-labelledby="reminders-title" {...sectionReveal}>
                  <SectionHeading icon={<CalendarRegular aria-hidden="true" />} title="Keep the dates close" hint="Choose an event to create a reminder" />
                  <Card className="reminder-card">
                    <div className="reminder-copy">
                      <Title2>Two days, one joyful gathering.</Title2>
                      <p>Your calendar app may handle downloads and alarms differently. Importing a file does not guarantee notifications.</p>
                    </div>
                    <Button appearance="primary" icon={<CalendarRegular />} onClick={() => setCalendarOpen(true)}>Choose a calendar reminder</Button>
                  </Card>
                </motion.section>
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        <footer className="site-footer" aria-hidden={!envelopeOpened}>
          <div className="footer-monogram">A&amp;A</div>
          <p>{invitationData.couple} · Wedding invitation</p>
          <Caption1>Eight years of love. Forever to go. <span aria-hidden="true">∞</span></Caption1>
        </footer>

        <AnimatePresence>
          {!envelopeOpened && <RoyalEnvelope couple={invitationData.couple} guest={guest} onOpen={openInvitation} />}
        </AnimatePresence>
        <VinylPlayer
          audioRef={audioRef}
          isPlaying={audioPlaying}
          onToggle={toggleAudio}
          status={audioStatus}
        />
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