import { Badge } from "../../../components/ui/Badge"
import { cn } from "../../../lib/cn"
import type { Spell } from "../types/spell"
import {
  formatCastingTime,
  formatLevel,
  formatSchool,
  hasConcentration,
  isRitual,
} from "../utils/formatters"
import { getSpellInstanceId } from "../utils/spellIdentity"
import { SpellDetails } from "./SpellDetails"

interface SpellCardProps {
  instanceIndex?: number
  isPrepared?: boolean
  isSaved: boolean
  onTogglePrepared?: (name: string) => void
  onToggleSaved: (name: string) => void
  showPreparedControl?: boolean
  spell: Spell
}

export function SpellCard({
  instanceIndex = 0,
  isPrepared = false,
  isSaved,
  onTogglePrepared,
  onToggleSaved,
  showPreparedControl = false,
  spell,
}: SpellCardProps) {
  const detailsId = `spell-details-${getSpellInstanceId(spell, instanceIndex)}`

  return (
    <article className="overflow-hidden rounded-lg border border-[#f6df9a]/20 bg-[#f3e3bf] bg-[linear-gradient(90deg,rgba(126,31,34,.08),transparent_34%)] shadow-[rgba(0,0,0,0.32)_0_18px_45px]">
      <details className="h-full">
        <summary
          aria-controls={detailsId}
          className="block min-h-32 cursor-pointer list-none p-4 transition hover:bg-[#fff8e8]/60 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#f6df9a] [&::-webkit-details-marker]:hidden"
        >
          <div>
            <div className="flex items-start justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
              <h3 className="m-0 font-serif text-xl leading-tight text-[#4b1114]">
                {spell.name}
              </h3>
              <div
                className="inline-flex shrink-0 items-center gap-2.5 max-sm:justify-between"
                onClick={(event) => event.stopPropagation()}
              >
                {showPreparedControl && (
                  <label className="inline-flex cursor-pointer select-none items-center gap-2 text-sm font-extrabold text-[#25180f]">
                    <input
                      aria-label={`Marcar ${spell.name} como preparada`}
                      checked={isPrepared}
                      onChange={() => onTogglePrepared?.(spell.name)}
                      type="checkbox"
                    />
                    Preparada
                  </label>
                )}
                <button
                  aria-label={
                    isSaved
                      ? `Remover ${spell.name} de Minhas Magias`
                      : `Adicionar ${spell.name} a Minhas Magias`
                  }
                  className={cn(
                    "grid size-9 cursor-pointer place-items-center rounded-full border border-[#4d2e1a]/30 text-xl focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#f6df9a]",
                    isSaved
                      ? "bg-[#7e1f22] text-[#f6df9a]"
                      : "bg-[#fff8e8] text-[#7e1f22]",
                  )}
                  onClick={() => onToggleSaved(spell.name)}
                  type="button"
                >
                  {isSaved ? "✦" : "+"}
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="gold">{formatLevel(spell.level)}</Badge>
              <Badge tone="accent">{formatSchool(spell.school)}</Badge>
              <Badge title="Tempo de conjuração">
                {formatCastingTime(spell)}
              </Badge>
              {isRitual(spell) && <Badge tone="green">Ritual</Badge>}
              {hasConcentration(spell) && (
                <Badge tone="red">Concentração</Badge>
              )}
            </div>
          </div>
        </summary>
        <div
          className="border-t border-[#4d2e1a]/20 bg-[#fff8e8]/65 p-4"
          id={detailsId}
        >
          <SpellDetails spell={spell} />
        </div>
      </details>
    </article>
  )
}
