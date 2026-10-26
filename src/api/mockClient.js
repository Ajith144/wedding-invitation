import { wedding } from '../content/wedding.js';
import { getPreviewState } from './previewState.js';

/** @type {import('./types.js').ApiClient} */
export const mockClient = {
  async getInvitation() {
    const state = getPreviewState();
    if (state === 'loading') return new Promise(() => {});
    if (state === 'error') throw new Error('Invitation details could not be loaded.');
    if (state === 'empty') return { ...wedding, events: [], photos: [] };
    await new Promise((resolve) => window.setTimeout(resolve, 180));
    return wedding;
  },
};