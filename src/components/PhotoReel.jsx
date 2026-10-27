import { useState } from 'react';
import {
  Button,
  Card,
  Caption1,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Title3,
} from '@fluentui/react-components';
import { DismissRegular, ImageRegular } from '@fluentui/react-icons';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const momentStories = {
  'celebration-light': {
    title: 'A Day to Remember 🌿',
    subtitle: 'Two hearts, two cultures, two families — united by one beautiful "Yes."',
    paragraphs: [
      { text: 'TWO PEOPLE. TWO FAMILIES. ONE BEAUTIFUL YES! ❤️', lead: true },
      { text: 'They met. They fell in love. They stayed together for years. And finally… the parents agreed! 😄' },
      { text: 'Different backgrounds, different traditions, but the same belief — love deserves a chance.' },
      { text: 'What started as “Let’s see…” became “Okay, let’s get them married!” 😂' },
      { text: 'Today, two beautiful souls become one family, and two families come together to celebrate love, acceptance, laughter and togetherness.' },
      { text: 'To our parents — thank you for choosing love over differences. ❤️' },
      { text: 'காதல் தொடங்கியது இருவரால்… இன்று இரண்டு குடும்பங்களையும் இணைத்திருக்கிறது. ❤️', lang: 'ta' },
      { text: 'ಎರಡು ಮನಸುಗಳು ಒಂದಾದವು… ಇಂದು ಎರಡು ಕುಟುಂಬಗಳು ಒಂದಾಗಿವೆ. ❤️', lang: 'kn' },
      { text: 'Welcome to our happily-ever-after!' },
    ],
  },
  gathering: {
    title: '8 Years & Beyond ∞',
    subtitle: 'From where it all began to stepping into forever.',
    paragraphs: [
      { text: 'When destiny writes the script, every detour makes sense.', emphasis: true },
      { text: 'Back in 2017, after switching between a few colleges and navigating uncertain choices, life quietly guided my path toward engineering. Little did I know that destiny wasn’t setting up a degree—it was setting up a lifetime.' },
      { text: 'For the first few weeks, she was just a quiet presence in the lecture hall, always buried in her books, disciplined, and calm. I barely knew she existed, and she barely noticed the world around her. We were strangers sharing the same classroom walls.' },
      { text: 'But destiny has its own subtle timing. One casual conversation led to shared notes, shared laughter, and an unspoken connection that simply felt like home. What began as quiet classroom glances blossomed into eight years of being each other’s steadfast pillar, greatest cheerleader, and truest confidante.' },
      { text: 'Eight years of shared growth, life transitions, and endless conversations later, that quiet girl from the front row became my whole world.' },
      { text: 'From strangers across a classroom to partners for life. ✨❤️', emphasis: true },
    ],
  },
  'couple-portrait': {
    title: 'Frames of Love 📸',
    subtitle: 'A glimpse into the memories we’ve created along the way.',
    paragraphs: [
      { text: 'A collection of moments from eight years together is on its way.' },
    ],
  },
};

const journeyGallery = Object.entries(import.meta.glob('../photos/*.{jpg,JPG,jpeg,JPEG}', {
  eager: true,
  query: '?url',
  import: 'default',
}))
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath, undefined, { numeric: true, sensitivity: 'base' }))
  .map(([, src], index) => ({
    src,
    alt: `Memory ${index + 1} from Ajith and Anjana's journey`,
  }));

export default function PhotoReel({ photos }) {
  const reducedMotion = useReducedMotion();
  const [selectedMoment, setSelectedMoment] = useState(null);

  function openMoment(event, moment) {
    if (event.type === 'keydown') {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
    }
    setSelectedMoment(moment);
  }

  return (
    <>
      <div className="photo-grid">
        {photos.map((photo, index) => {
          const story = momentStories[photo.id] || {
            title: photo.title,
            subtitle: photo.caption,
            paragraphs: [{ text: photo.caption }],
          };
          const momentPhoto = photo.id === 'couple-portrait' ? { ...photo, gallery: journeyGallery } : photo;
          const moment = { photo: momentPhoto, story };

          return (
            <motion.div
              key={photo.id}
              className={`photo-reveal photo-reveal--${index + 1}`}
              initial={reducedMotion ? false : { opacity: 0, y: 28, rotate: index === 1 ? 1.4 : -1.1 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: reducedMotion ? 0 : index * 0.14 }}
            >
              <Card
                className={`photo-card photo-card--${index + 1}${photo.id === 'couple-portrait' ? ' photo-card--couple' : ''}`}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`Read story: ${story.title}`}
                onClick={(event) => openMoment(event, moment)}
                onKeyDown={(event) => openMoment(event, moment)}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy" />
                <div className="photo-caption">
                  <Title3>{story.title}</Title3>
                  <Caption1>{story.subtitle}</Caption1>
                  <span className="photo-card-action">Explore story <ArrowUpRight size={14} aria-hidden="true" /></span>
                </div>
              </Card>
            </motion.div>
          );
        })}
        {photos.length === 0 && (
          <Card className="empty-state">
            <ImageRegular className="empty-state-icon" aria-hidden="true" />
            <Title3>Photos will find their place here</Title3>
            <p className="body-muted">No approved photos are attached to this invitation yet.</p>
          </Card>
        )}
      </div>
      <Dialog open={selectedMoment !== null} onOpenChange={(_, data) => !data.open && setSelectedMoment(null)}>
        <DialogSurface className="moment-dialog">
          {selectedMoment && (
            <DialogBody>
              <DialogTitle
                action={(
                  <DialogTrigger action="close">
                    <Button appearance="subtle" aria-label="Close story" icon={<DismissRegular />} />
                  </DialogTrigger>
                )}
              >
                {selectedMoment.story.title}
              </DialogTitle>
              <DialogContent>
                <p className="moment-dialog-subtitle">{selectedMoment.story.subtitle}</p>
                <div className="moment-story">
                  {selectedMoment.story.paragraphs.map((paragraph, index) => (
                    <p className={paragraph.lead ? 'moment-story-lead' : paragraph.emphasis ? 'moment-story-emphasis' : undefined} lang={paragraph.lang} key={index}>
                      {paragraph.text}
                    </p>
                  ))}
                </div>
                {selectedMoment.photo.id === 'couple-portrait' && (
                  selectedMoment.photo.gallery?.length ? (
                    <div className="moment-gallery">
                      {selectedMoment.photo.gallery.map((image) => (
                        <img src={image.src} alt={image.alt} loading="lazy" key={image.src} />
                      ))}
                    </div>
                  ) : (
                    <div className="moment-gallery-empty">
                      <ImageRegular aria-hidden="true" />
                      <span>Your journey gallery is ready for at least 10 photos.</span>
                    </div>
                  )
                )}
              </DialogContent>
            </DialogBody>
          )}
        </DialogSurface>
      </Dialog>
    </>
  );
}