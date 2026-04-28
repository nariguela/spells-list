import {
  PREPARED_SPELLS_STORAGE_KEY,
  SAVED_SPELLS_STORAGE_KEY,
} from "./storageKeys";

function readStringArray(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function writeStringArray(key: string, value: Iterable<string>) {
  localStorage.setItem(key, JSON.stringify(Array.from(value)));
}

export function readSavedSpellNames() {
  return new Set(readStringArray(SAVED_SPELLS_STORAGE_KEY));
}

export function writeSavedSpellNames(saved: Set<string>) {
  writeStringArray(SAVED_SPELLS_STORAGE_KEY, saved);
}

export function readPreparedSpellNames(saved: Set<string>) {
  return new Set(
    readStringArray(PREPARED_SPELLS_STORAGE_KEY).filter((name) =>
      saved.has(name)
    )
  );
}

export function writePreparedSpellNames(prepared: Set<string>) {
  writeStringArray(PREPARED_SPELLS_STORAGE_KEY, prepared);
}
