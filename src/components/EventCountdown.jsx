import { useEffect, useState } from 'react';
import { Card, Caption1, Title3 } from '@fluentui/react-components';
import { ClockRegular } from '@fluentui/react-icons';

function partsFor(target, now) {
  const remaining = target - now;
  if (remaining <= 0) return null;
  const seconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

export default function EventCountdown({ event, variant = 'card' }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const parts = partsFor(Date.parse(event.start), now);

  if (variant === 'hero') {
    return (
      <div className="hero-countdown" role="group" aria-label={`${event.name} countdown`}>
        <div className="hero-countdown-heading">
          <ClockRegular aria-hidden="true" />
          <Caption1>Until our first celebration</Caption1>
          <span className="hero-countdown-event">{event.name}</span>
        </div>
        {parts ? (
          <div className="hero-countdown-values" aria-label={`${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes, ${parts.seconds} seconds`}>
            {Object.entries(parts).map(([unit, value]) => (
              <div className="hero-countdown-unit" key={unit}>
                <strong>{String(value).padStart(2, '0')}</strong>
                <span>{unit}</span>
              </div>
            ))}
          </div>
        ) : <strong className="hero-countdown-today">Today</strong>}
      </div>
    );
  }

  return (
    <Card className="countdown-card">
      <div className="section-heading section-heading--compact">
        <ClockRegular aria-hidden="true" />
        <div>
          <Caption1>Counting down to the reception</Caption1>
          <Title3>{parts ? 'The evening is getting closer' : 'The celebration has begun'}</Title3>
        </div>
      </div>
      {parts ? (
        <div className="countdown-grid" aria-label={`${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes, and ${parts.seconds} seconds until the reception`}>
          {Object.entries(parts).map(([unit, value]) => (
            <div className="countdown-unit" key={unit}>
              <span>{String(value).padStart(2, '0')}</span>
              <small>{unit}</small>
            </div>
          ))}
        </div>
      ) : <p className="body-muted">We are grateful you celebrated with us.</p>}
    </Card>
  );
}