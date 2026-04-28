import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../../../assets/hero.png";
import type { Spell, SpellGroupKey } from "../types/spell";
import { SpellList } from "./SpellList";

interface SavedSpellsPageProps {
  prepared: Set<string>;
  saved: Set<string>;
  savedSpells: Spell[];
  togglePrepared: (name: string) => void;
  toggleSaved: (name: string) => void;
}

function groupSpells(spells: Spell[]) {
  const map = new Map<SpellGroupKey, Spell[]>();
  for (const spell of spells) {
    const key = typeof spell.level === "number" ? spell.level : "unknown";
    map.set(key, [...(map.get(key) ?? []), spell]);
  }
  const order: SpellGroupKey[] = ["unknown", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return order
    .map((key) => ({ key, spells: map.get(key) ?? [] }))
    .filter((group) => group.spells.length > 0);
}

export function SavedSpellsPage({
  prepared,
  saved,
  savedSpells,
  togglePrepared,
  toggleSaved,
}: SavedSpellsPageProps) {
  const [onlyPrepared, setOnlyPrepared] = useState(false);
  const visibleSpells = useMemo(
    () =>
      onlyPrepared
        ? savedSpells.filter((spell) => prepared.has(spell.name))
        : savedSpells,
    [onlyPrepared, prepared, savedSpells]
  );
  const groups = useMemo(() => groupSpells(visibleSpells), [visibleSpells]);

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
        <label className="inline-flex cursor-pointer select-none items-center gap-2 text-[#f9efd5]">
          <input
            checked={onlyPrepared}
            onChange={(event) => setOnlyPrepared(event.target.checked)}
            type="checkbox"
          />
          Mostrar apenas preparadas
        </label>
      </section>

      {savedSpells.length === 0 ? (
        <div className="rounded-lg border border-[#f6df9a]/20 bg-[#f3e3bf] p-5 shadow-[rgba(0,0,0,0.32)_0_18px_45px]">
          Você ainda não salvou magias.{" "}
          <Link className="underline" to="/">
            Voltar para a lista completa.
          </Link>
        </div>
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
  );
}
