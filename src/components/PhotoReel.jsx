import { Card, Caption1, Title3 } from '@fluentui/react-components';
import { ImageRegular } from '@fluentui/react-icons';
import { motion, useReducedMotion } from 'framer-motion';

export default function PhotoReel({ photos }) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="photo-grid">
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          className={`photo-reveal photo-reveal--${index + 1}`}
          initial={reducedMotion ? false : { opacity: 0, y: 28, rotate: index === 1 ? 1.4 : -1.1 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: reducedMotion ? 0 : index * 0.14 }}
        >
          <Card className={`photo-card photo-card--${index + 1}${photo.id === 'couple-portrait' ? ' photo-card--couple' : ''}`}>
            <img src={photo.src} alt={photo.alt} loading="lazy" />
            <div className="photo-caption">
              <Title3>{photo.title}</Title3>
              <Caption1>{photo.caption}</Caption1>
            </div>
          </Card>
        </motion.div>
      ))}
      {photos.length === 0 && (
        <Card className="empty-state">
          <ImageRegular className="empty-state-icon" aria-hidden="true" />
          <Title3>Photos will find their place here</Title3>
          <p className="body-muted">No approved photos are attached to this invitation yet.</p>
        </Card>
      )}
    </div>
  );
}