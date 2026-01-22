export function getJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function upsertBy(list, predicate, nextItem) {
  const idx = list.findIndex(predicate);
  if (idx === -1) return [...list, nextItem];
  const copy = [...list];
  copy[idx] = { ...copy[idx], ...nextItem };
  return copy;
}

