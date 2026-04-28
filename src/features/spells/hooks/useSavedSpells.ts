import { useEffect, useMemo, useState } from "react";
import type { Spell } from "../types/spell";
import {
  readPreparedSpellNames,
  readSavedSpellNames,
  writePreparedSpellNames,
  writeSavedSpellNames,
} from "../services/spellStorage";

export function useSavedSpells(spells: Spell[]) {
  const [saved, setSaved] = useState<Set<string>>(() => readSavedSpellNames());
  const [prepared, setPrepared] = useState<Set<string>>(() =>
    readPreparedSpellNames(readSavedSpellNames())
  );

  const spellsByName = useMemo(
    () => new Map(spells.map((spell) => [spell.name, spell])),
    [spells]
  );

  const savedSpells = useMemo(
    () =>
      Array.from(saved)
        .map((name) => spellsByName.get(name))
        .filter((spell): spell is Spell => Boolean(spell)),
    [saved, spellsByName]
  );

  useEffect(() => {
    writeSavedSpellNames(saved);
  }, [saved]);

  useEffect(() => {
    writePreparedSpellNames(prepared);
  }, [prepared]);

  function toggleSaved(name: string) {
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(name)) {
        next.delete(name);
        setPrepared((currentPrepared) => {
          if (!currentPrepared.has(name)) return currentPrepared;
          const nextPrepared = new Set(currentPrepared);
          nextPrepared.delete(name);
          return nextPrepared;
        });
      } else {
        next.add(name);
      }
      return next;
    });
  }

  function togglePrepared(name: string) {
    if (!saved.has(name)) return;
    setPrepared((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return {
    prepared,
    saved,
    savedSpells,
    togglePrepared,
    toggleSaved,
  };
}
