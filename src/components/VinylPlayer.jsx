import { Button, Caption1 } from '@fluentui/react-components';
import { PauseRegular, PlayRegular } from '@fluentui/react-icons';

export default function VinylPlayer({ audioRef, isPlaying, onToggle, status }) {
  return (
    <div className="vinyl-control">
      <div className={`vinyl-disc${isPlaying ? ' vinyl-disc--playing' : ''}`} aria-hidden="true">
        <span />
      </div>
      <div className="vinyl-copy">
        <strong>Our soundtrack</strong>
        <Caption1>{status || 'A private moment, whenever you are ready'}</Caption1>
      </div>
      <Button
        appearance="subtle"
        icon={isPlaying ? <PauseRegular /> : <PlayRegular />}
        aria-label={isPlaying ? 'Pause soundtrack' : 'Play soundtrack'}
        onClick={onToggle}
      />
      <audio ref={audioRef} src="/bg-music.mp3" loop preload="none" onError={() => {}} />
    </div>
  );
}