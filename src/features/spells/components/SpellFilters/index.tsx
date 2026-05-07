import { formatLevel } from "../../utils/formatters"
import type { SpellFiltersProps } from "./types"

const labelClass =
  "grid gap-1.5 text-xs font-extrabold uppercase text-[#6f5942]"
const fieldClass =
  "min-h-10 w-full rounded-md border border-[#4d2e1a]/30 bg-[#fff8e8] px-2.5 py-2 text-base normal-case text-[#25180f] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#f6df9a]"

export function SpellFilters({
  filters,
  options,
  resultCount,
  savedCount,
  setFilters,
}: SpellFiltersProps) {
  return (
    <section
      aria-label="Filtros de magia"
      className="grid grid-cols-[minmax(240px,1fr)_repeat(3,minmax(150px,190px))_auto] items-end gap-3 rounded-lg border border-[#f6df9a]/20 bg-[#f3e3bf]/95 p-4 shadow-[rgba(0,0,0,0.32)_0_18px_45px] max-md:grid-cols-2 max-sm:grid-cols-1 max-sm:rounded-none max-sm:px-2.5"
    >
      <div className={`${labelClass} max-md:col-span-full`}>
        <label htmlFor="spell-search">Buscar magia</label>
        <input
          className={fieldClass}
          id="spell-search"
          onChange={(event) =>
            setFilters((current) => ({ ...current, query: event.target.value }))
          }
          placeholder="Nome, escola, classe ou fonte"
          type="search"
          value={filters.query}
        />
      </div>

      <label className={labelClass}>
        Nível
        <select
          className={fieldClass}
          onChange={(event) =>
            setFilters((current) => ({ ...current, level: event.target.value }))
          }
          value={filters.level}
        >
          <option value="all">Todos</option>
          {options.levels.map((level) => (
            <option key={level} value={level}>
              {formatLevel(level)}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        Escola
        <select
          className={fieldClass}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              school: event.target.value,
            }))
          }
          value={filters.school}
        >
          <option value="all">Todas</option>
          {options.schools.map((school) => (
            <option key={school.value} value={school.value}>
              {school.label}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        Classe
        <select
          className={fieldClass}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              className: event.target.value,
            }))
          }
          value={filters.className}
        >
          <option value="all">Todas</option>
          {options.classes.map((className) => (
            <option key={className} value={className}>
              {className}
            </option>
          ))}
        </select>
      </label>

      <div
        aria-live="polite"
        className="grid min-w-28 text-sm leading-tight text-[#6f5942] max-md:col-span-full"
      >
        <strong className="text-2xl text-[#7e1f22]">{resultCount}</strong>{" "}
        magias
        <span>{savedCount} salvas</span>
      </div>
    </section>
  )
}
