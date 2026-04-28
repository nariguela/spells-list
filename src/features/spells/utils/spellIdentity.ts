import type { Spell } from "../types/spell";

export function getSpellInstanceId(spell: Spell, index = 0) {
  return `${spell.name}-${spell.source}-${spell.page}-${index}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "");
}
