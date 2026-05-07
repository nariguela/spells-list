import type { Dispatch, SetStateAction } from "react"
import type { SpellFilters } from "../../hooks/useSpellFilters"

export interface SpellFiltersProps {
  filters: SpellFilters
  options: {
    classes: string[]
    levels: number[]
    schools: Array<{ value: string; label: string }>
  }
  resultCount: number
  savedCount: number
  setFilters: Dispatch<SetStateAction<SpellFilters>>
}
