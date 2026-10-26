const validStates = new Set(['data', 'loading', 'empty', 'error']);
const listeners = new Set();

function initialState() {
  if (import.meta.env.PROD) return 'data';
  const queryValue = new URLSearchParams(window.location.search).get('previewState');
  if (validStates.has(queryValue)) return queryValue;
  const storedValue = window.localStorage.getItem('previewState');
  return validStates.has(storedValue) ? storedValue : 'data';
}

let currentState = initialState();

export function getPreviewState() {
  return import.meta.env.PROD ? 'data' : currentState;
}

export function subscribePreviewState(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setPreviewState(nextState) {
  if (import.meta.env.PROD || !validStates.has(nextState)) return;
  currentState = nextState;
  window.localStorage.setItem('previewState', nextState);
  listeners.forEach((listener) => listener());
}