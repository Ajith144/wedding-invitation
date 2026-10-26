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

export default function EventCountdown({ event }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const parts = partsFor(Date.parse(event.start), now);
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