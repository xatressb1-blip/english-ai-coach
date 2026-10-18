// Optional read-only handoff for the visualizer. The recorder owns every track.
let stream: MediaStream | null = null;
const listeners = new Set<() => void>();
export function setRecordingVisualStream(value: MediaStream | null) {
  stream = value;
  // A visual subscriber must never interrupt recording or cleanup.
  listeners.forEach(listener => { try { listener(); } catch { /* optional UI */ } });
}
export function getRecordingVisualStream() { return stream; }
export function subscribeRecordingVisualStream(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
