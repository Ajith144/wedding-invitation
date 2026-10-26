import { useEffect, useRef } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from '@fluentui/react-components';
import { CalendarRegular, DismissRegular } from '@fluentui/react-icons';

export default function CalendarReminderDialog({ open, onClose, events, onChoose, onRetry, retryLabel, error }) {
  const surfaceRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    previousFocus.current = document.activeElement;
    const frame = window.requestAnimationFrame(() => {
      surfaceRef.current?.querySelector('button')?.focus();
    });
    return () => {
      window.cancelAnimationFrame(frame);
      previousFocus.current?.focus?.();
    };
  }, [open]);

  function trapFocus(event) {
    if (event.key !== 'Tab' || !surfaceRef.current) return;
    const focusable = [...surfaceRef.current.querySelectorAll('button:not([disabled]), a[href]')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface ref={surfaceRef} onKeyDown={trapFocus}>
        <DialogBody>
          <DialogTitle
            action={<DialogTrigger action="close"><Button appearance="subtle" aria-label="Close calendar reminders" icon={<DismissRegular />} /></DialogTrigger>}
          >
            Save a date
          </DialogTitle>
          <DialogContent>
            <p className="dialog-intro">Choose a calendar action for one event. Your browser or calendar app may handle it differently; importing and notifications are not automatic.</p>
            <div className="dialog-event-list">
              {events.map((event) => (
                <div className="dialog-event" key={event.id}>
                  <div>
                    <strong>{event.name}</strong>
                    <span>{event.dateLabel} · {event.timeLabel}</span>
                  </div>
                  <Button appearance="primary" icon={<CalendarRegular />} onClick={() => onChoose(event)}>
                    Save {event.name} date
                  </Button>
                </div>
              ))}
              {events.length === 0 && <p className="body-muted">Event dates are not available in this preview state.</p>}
            </div>
            {error && (
              <div className="calendar-error" role="alert">
                <p>{error}</p>
                <Button appearance="secondary" onClick={onRetry}>Retry {retryLabel || 'calendar'} action</Button>
              </div>
            )}
            <p className="calendar-caveat">Calendar reminders are suggestions. Alarm support depends on the app you use and may not be preserved when importing.</p>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>Close reminder choices</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}