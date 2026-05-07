import type { Spell } from "../../types/spell"

export interface SpellCardProps {
  instanceIndex?: number
  isPrepared?: boolean
  isSaved: boolean
  onTogglePrepared?: (name: string) => void
  onToggleSaved: (name: string) => void
  showPreparedControl?: boolean
  spell: Spell
}
