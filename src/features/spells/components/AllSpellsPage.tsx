import { Link } from "react-router-dom";
import heroImage from "../../../assets/hero.png";
import { SpellFilters } from "./SpellFilters";
import { SpellList } from "./SpellList";
import type { Spell } from "../types/spell";
import { useSpellFilters } from "../hooks/useSpellFilters";

interface AllSpellsPageProps {
  prepared: Set<string>;
  saved: Set<string>;
  spells: Spell[];
  toggleSaved: (name: string) => void;
}

export function AllSpellsPage({
  prepared,
  saved,
  spells,
  toggleSaved,
}: AllSpellsPageProps) {
  const { filteredSpells, filters, filterOptions, groupedSpells, setFilters } =
    useSpellFilters(spells);

  return (
    <div className="grid gap-5 max-sm:gap-3.5">
      <section
        className="flex min-h-56 items-end justify-between gap-4 rounded-lg border border-[#f6df9a]/20 bg-cover bg-center p-[clamp(24px,5vw,48px)] text-[#f9efd5] shadow-[rgba(0,0,0,0.32)_0_18px_45px] max-md:flex-col max-md:items-stretch max-sm:rounded-none"
        style={{
          backgroundImage: `linear-gradient(rgba(28,17,13,.58), rgba(28,17,13,.92)), url(${heroImage})`,
        }}
      >
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[#f6df9a]">
            Consulta rápida de magias
          </p>
          <h1 className="mb-2.5 max-w-3xl font-serif text-[clamp(2.1rem,5vw,4.6rem)] leading-none">
            Seu grimório de Dungeons & Dragons 5e
          </h1>
          <p className="mb-0 max-w-3xl text-[#eadbb8]">
            Busque por nome, filtre por nível, escola ou classe, salve suas
            magias e abra os detalhes completos quando precisar da regra na
            mesa.
          </p>
        </div>
        <Link
          className="rounded-lg border border-[#f6df9a]/55 bg-linear-to-b from-[#9f292d] to-[#64191c] px-3 py-2 text-[#f7e8c1] no-underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#f6df9a]"
          to="/salvas"
        >
          Ver Minhas Magias
        </Link>
      </section>

      <SpellFilters
        filters={filters}
        options={filterOptions}
        resultCount={filteredSpells.length}
        savedCount={saved.size}
        setFilters={setFilters}
      />

      {groupedSpells.length > 0 ? (
        <SpellList
          groups={groupedSpells}
          prepared={prepared}
          saved={saved}
          toggleSaved={toggleSaved}
        />
      ) : (
        <p className="rounded-lg border border-[#f6df9a]/20 bg-[#f3e3bf] p-5 shadow-[rgba(0,0,0,0.32)_0_18px_45px]">
          Nenhuma magia encontrada com estes filtros.
        </p>
      )}
    </div>
  );
}
