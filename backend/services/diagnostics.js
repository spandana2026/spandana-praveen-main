const MAX_EVENTS = 250;
const events = [];

export function recordDiagnostic({ area, type = 'INFO', code, message, details = null, requestId = null }) {
  const event = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(), area, type,
    code: code || `${String(area).toUpperCase()}-INFO-001`, message,
    details: details || undefined, requestId: requestId || undefined,
  };
  events.unshift(event);
  if (events.length > MAX_EVENTS) events.length = MAX_EVENTS;
  return event;
}

export function listDiagnostics({ type, area, limit = 100 } = {}) {
  const max = Math.min(Math.max(Number(limit) || 100, 1), 250);
  return events.filter(e => (!type || e.type === type) && (!area || e.area === area)).slice(0, max);
}

export function clearDiagnostics() { events.length = 0; }

export function diagnosticSummary() {
  const counts = events.reduce((acc, e) => { acc[e.type] = (acc[e.type] || 0) + 1; return acc; }, {});
  return { total: events.length, errors: counts.ERROR || 0, warnings: counts.WARN || 0 };
}
