import { useMemo, useState } from "react";
import type { Spell, SpellGroupKey } from "../types/spell";
import { formatSchool, getSpellClassNames } from "../utils/formatters";

export interface SpellFilters {
  className: string;
  level: string;
  query: string;
  school: string;
}

const emptyFilters: SpellFilters = {
  className: "all",
  level: "all",
  query: "",
  school: "all",
};

export function useSpellFilters(spells: Spell[]) {
  const [filters, setFilters] = useState<SpellFilters>(emptyFilters);

  const filterOptions = useMemo(() => {
    const levels = [...new Set(spells.map((spell) => spell.level))].sort((a, b) => a - b);
    const schools = [...new Set(spells.map((spell) => spell.school))]
      .map((school) => ({ value: school, label: formatSchool(school) }))
      .sort((a, b) => a.label.localeCompare(b.label));
    const classes = [
      ...new Set(spells.flatMap((spell) => getSpellClassNames(spell))),
    ].sort((a, b) => a.localeCompare(b));
    return { classes, levels, schools };
  }, [spells]);

  const filteredSpells = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return spells.filter((spell) => {
      const searchText = [
        spell.name,
        formatSchool(spell.school),
        getSpellClassNames(spell).join(" "),
        spell.source,
      ]
        .join(" ")
        .toLowerCase();
      const matchesQuery = !query || searchText.includes(query);
      const matchesLevel =
        filters.level === "all" || String(spell.level) === filters.level;
      const matchesSchool =
        filters.school === "all" || spell.school === filters.school;
      const matchesClass =
        filters.className === "all" ||
        getSpellClassNames(spell).includes(filters.className);

      return matchesQuery && matchesLevel && matchesSchool && matchesClass;
    });
  }, [filters, spells]);

  const groupedSpells = useMemo(() => {
    const map = new Map<SpellGroupKey, Spell[]>();
    for (const spell of filteredSpells) {
      const key = typeof spell.level === "number" ? spell.level : "unknown";
      map.set(key, [...(map.get(key) ?? []), spell]);
    }
    const sortedKeys: SpellGroupKey[] = ["unknown", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return sortedKeys
      .map((key) => ({ key, spells: map.get(key) ?? [] }))
      .filter((group) => group.spells.length > 0);
  }, [filteredSpells]);

  return {
    filteredSpells,
    filters,
    filterOptions,
    groupedSpells,
    resetFilters: () => setFilters(emptyFilters),
    setFilters,
  };
}
