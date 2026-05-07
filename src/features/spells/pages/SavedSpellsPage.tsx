import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import heroImage from "../../../assets/hero.png"
import type { Spell, SpellGroupKey } from "../types/spell"
import { formatCastingTime } from "../utils/formatters"
import { getSpellInstanceId } from "../utils/spellIdentity"
import { SpellCard } from "../components/SpellCard"
import { SpellList } from "../components/SpellList"

interface SavedSpellsPageProps {
  prepared: Set<string>
  saved: Set<string>
  savedSpells: Spell[]
  togglePrepared: (name: string) => void
  toggleSaved: (name: string) => void
}

function groupSpells(spells: Spell[]) {
  const map = new Map<SpellGroupKey, Spell[]>()
  for (const spell of spells) {
    const key = typeof spell.level === "number" ? spell.level : "unknown"
    map.set(key, [...(map.get(key) ?? []), spell])
  }
  const order: SpellGroupKey[] = ["unknown", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  return order
    .map((key) => ({ key, spells: map.get(key) ?? [] }))
    .filter((group) => group.spells.length > 0)
}

type CombatGroupKey = "action" | "bonus" | "reaction" | "other"

const combatGroupLabels: Record<CombatGroupKey, string> = {
  action: "1 ação",
  bonus: "1 ação bônus",
  reaction: "1 reação",
  other: "Outros tempos",
}

function getCombatGroupKey(spell: Spell): CombatGroupKey {
  const hasTime = (unit: string) =>
    spell.time.some((time) => time.number === 1 && time.unit === unit)

  if (hasTime("action")) return "action"
  if (hasTime("bonus")) return "bonus"
  if (hasTime("reaction")) return "reaction"
  return "other"
}

function getOtherTimeUnits(spells: Spell[]) {
  const labels = new Set<string>()

  for (const spell of spells) {
    if (getCombatGroupKey(spell) !== "other") continue

    for (const time of spell.time) {
      const label = formatCastingTime({ ...spell, time: [time] })
      labels.add(label)
    }
  }

  return [...labels].sort((a, b) => a.localeCompare(b))
}

function groupCombatSpells(spells: Spell[]) {
  const map = new Map<CombatGroupKey, Spell[]>()
  for (const spell of spells) {
    const key = getCombatGroupKey(spell)
    map.set(key, [...(map.get(key) ?? []), spell])
  }

  const order: CombatGroupKey[] = ["action", "bonus", "reaction", "other"]
  return order
    .map((key) => ({ key, spells: map.get(key) ?? [] }))
    .filter((group) => group.spells.length > 0)
}

interface CombatSpellListProps {
  groups: Array<{ key: CombatGroupKey; spells: Spell[] }>
  otherTimeUnits: string[]
  prepared: Set<string>
  saved: Set<string>
  togglePrepared: (name: string) => void
  toggleSaved: (name: string) => void
}

function CombatSpellList({
  groups,
  otherTimeUnits,
  prepared,
  saved,
  togglePrepared,
  toggleSaved,
}: CombatSpellListProps) {
  return (
    <div className="grid gap-7 max-sm:px-2.5">
      {groups.map((group) => (
        <section className="max-sm:rounded-none" key={group.key}>
          <div className="mb-3 flex flex-wrap items-center gap-2.5 text-[#f5e7c3]">
            <h2 className="m-0 font-serif text-2xl">
              {combatGroupLabels[group.key]}
            </h2>
            <span className="rounded-full border border-[#f6df9a]/30 px-2.5 py-0.5 text-[#f6df9a]">
              {group.spells.length}
            </span>
            {group.key === "other" && otherTimeUnits.length > 0 && (
              <span className="text-sm text-[#eadbb8]">
                {otherTimeUnits.join(", ")}
              </span>
            )}
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(310px,1fr))] gap-3.5 max-sm:grid-cols-1">
            {group.spells.map((spell, index) => (
              <SpellCard
                instanceIndex={index}
                isPrepared={prepared.has(spell.name)}
                isSaved={saved.has(spell.name)}
                key={getSpellInstanceId(spell, index)}
                onTogglePrepared={togglePrepared}
                onToggleSaved={toggleSaved}
                showPreparedControl
                spell={spell}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export function SavedSpellsPage({
  prepared,
  saved,
  savedSpells,
  togglePrepared,
  toggleSaved,
}: SavedSpellsPageProps) {
  const [combatMode, setCombatMode] = useState(false)
  const [onlyPrepared, setOnlyPrepared] = useState(false)
  const preparedSpells = useMemo(
    () => savedSpells.filter((spell) => prepared.has(spell.name)),
    [prepared, savedSpells],
  )
  const visibleSpells = useMemo(
    () =>
      onlyPrepared
        ? savedSpells.filter((spell) => prepared.has(spell.name))
        : savedSpells,
    [onlyPrepared, prepared, savedSpells],
  )
  const groups = useMemo(() => groupSpells(visibleSpells), [visibleSpells])
  const combatGroups = useMemo(
    () => groupCombatSpells(preparedSpells),
    [preparedSpells],
  )
  const otherTimeUnits = useMemo(
    () => getOtherTimeUnits(preparedSpells),
    [preparedSpells],
  )

  return (
    <div className="grid gap-5 max-sm:gap-3.5">
      <section
        className="flex min-h-40 items-end justify-between gap-4 rounded-lg border border-[#f6df9a]/20 bg-cover bg-center p-[clamp(24px,5vw,48px)] text-[#f9efd5] shadow-[rgba(0,0,0,0.32)_0_18px_45px] max-md:flex-col max-md:items-stretch max-sm:rounded-none"
        style={{
          backgroundImage: `linear-gradient(rgba(28,17,13,.58), rgba(28,17,13,.92)), url(${heroImage})`,
        }}
      >
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[#f6df9a]">
            Lista pessoal
          </p>
          <h1 className="mb-2.5 max-w-3xl font-serif text-[clamp(2rem,4vw,3.4rem)] leading-none">
            Minhas Magias
          </h1>
          <p className="mb-0 max-w-3xl text-[#eadbb8]">
            {saved.size} salvas, {prepared.size} preparadas.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 max-md:items-start">
          <button
            aria-pressed={combatMode}
            className="rounded-lg border border-[#f6df9a]/55 bg-linear-to-b from-[#9f292d] to-[#64191c] px-3 py-2 text-[#f7e8c1] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#f6df9a]"
            onClick={() => setCombatMode((enabled) => !enabled)}
            type="button"
          >
            {combatMode ? "Sair do modo de combate" : "Modo de combate"}
          </button>
          {combatMode ? (
            <p className="m-0 max-w-64 text-right text-sm text-[#eadbb8] max-md:text-left">
              Preparadas por tempo de conjuração.
              {otherTimeUnits.length > 0
                ? ` Outros: ${otherTimeUnits.join(", ")}.`
                : ""}
            </p>
          ) : (
            <label className="inline-flex cursor-pointer select-none items-center gap-2 text-[#f9efd5]">
              <input
                checked={onlyPrepared}
                onChange={(event) => setOnlyPrepared(event.target.checked)}
                type="checkbox"
              />
              Mostrar apenas preparadas
            </label>
          )}
        </div>
      </section>

      {savedSpells.length === 0 ? (
        <div className="rounded-lg border border-[#f6df9a]/20 bg-[#f3e3bf] p-5 shadow-[rgba(0,0,0,0.32)_0_18px_45px]">
          Você ainda não salvou magias.{" "}
          <Link className="underline" to="/">
            Voltar para a lista completa.
          </Link>
        </div>
      ) : combatMode ? (
        combatGroups.length > 0 ? (
          <CombatSpellList
            groups={combatGroups}
            otherTimeUnits={otherTimeUnits}
            prepared={prepared}
            saved={saved}
            togglePrepared={togglePrepared}
            toggleSaved={toggleSaved}
          />
        ) : (
          <p className="rounded-lg border border-[#f6df9a]/20 bg-[#f3e3bf] p-5 shadow-[rgba(0,0,0,0.32)_0_18px_45px]">
            Nenhuma magia preparada por enquanto.
          </p>
        )
      ) : groups.length > 0 ? (
        <SpellList
          groups={groups}
          prepared={prepared}
          saved={saved}
          showPreparedControl
          togglePrepared={togglePrepared}
          toggleSaved={toggleSaved}
        />
      ) : (
        <p className="rounded-lg border border-[#f6df9a]/20 bg-[#f3e3bf] p-5 shadow-[rgba(0,0,0,0.32)_0_18px_45px]">
          Nenhuma magia preparada por enquanto.
        </p>
      )}
    </div>
  )
}
