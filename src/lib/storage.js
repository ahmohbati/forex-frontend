// Safe localStorage helpers
export function safeGetJSON(key) {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    // Treat explicit string values that represent emptiness as missing
    if (raw === null) return null;
    const trimmed = typeof raw === 'string' ? raw.trim() : raw;
    if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') {
      // remove bad value to avoid repeating the parse error later
      try { localStorage.removeItem(key); } catch (_) {}
      return null;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`safeGetJSON: invalid JSON for key=${key}`, e);
    try { localStorage.removeItem(key); } catch (_) {}
    return null;
  }
}

export function safeSetJSON(key, value) {
  try {
    const s = JSON.stringify(value);
    localStorage.setItem(key, s);
  } catch (e) {
    console.warn(`safeSetJSON: could not stringify for key=${key}`, e);
  }
}

export function safeGetString(key) {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  } catch (e) {
    console.warn(`safeGetString: error reading key=${key}`, e);
    return null;
  }
}

export function safeRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`safeRemove: error removing key=${key}`, e);
  }
}

export default { safeGetJSON, safeSetJSON, safeGetString, safeRemove };
