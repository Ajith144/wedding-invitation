import { Button, Caption1 } from '@fluentui/react-components';
import { getPreviewState, setPreviewState } from '../api/previewState.js';

const choices = ['data', 'loading', 'empty', 'error'];

export default function DataStateSwitcher({ state }) {
  if (!import.meta.env.DEV) return null;
  return (
    <aside className="state-switcher" aria-label="Invitation preview state">
      <Caption1>Preview state</Caption1>
      <div role="group" aria-label="Choose invitation data state">
        {choices.map((choice) => (
          <Button
            key={choice}
            size="small"
            appearance={state === choice ? 'primary' : 'secondary'}
            aria-pressed={state === choice}
            onClick={() => setPreviewState(choice)}
          >
            {choice[0].toUpperCase()}{choice.slice(1)}
          </Button>
        ))}
      </div>
    </aside>
  );
}