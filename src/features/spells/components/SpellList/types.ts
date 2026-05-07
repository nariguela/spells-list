import type { Spell, SpellGroupKey } from "../../types/spell"

export interface SpellListProps {
  groups: Array<{ key: SpellGroupKey; spells: Spell[] }>
  prepared: Set<string>
  saved: Set<string>
  showPreparedControl?: boolean
  togglePrepared?: (name: string) => void
  toggleSaved: (name: string) => void
}
