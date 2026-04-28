import type { Spell, SpellGroupKey } from "../types/spell";
import { formatLevelGroup } from "../utils/formatters";
import { getSpellInstanceId } from "../utils/spellIdentity";
import { SpellCard } from "./SpellCard";

interface SpellListProps {
  groups: Array<{ key: SpellGroupKey; spells: Spell[] }>;
  prepared: Set<string>;
  saved: Set<string>;
  showPreparedControl?: boolean;
  togglePrepared?: (name: string) => void;
  toggleSaved: (name: string) => void;
}

export function SpellList({
  groups,
  prepared,
  saved,
  showPreparedControl = false,
  togglePrepared,
  toggleSaved,
}: SpellListProps) {
  return (
    <div className="grid gap-7 max-sm:px-2.5">
      {groups.map((group) => (
        <section className="max-sm:rounded-none" key={group.key}>
          <div className="mb-3 flex items-center gap-2.5 text-[#f5e7c3]">
            <h2 className="m-0 font-serif text-2xl">{formatLevelGroup(group.key)}</h2>
            <span className="rounded-full border border-[#f6df9a]/30 px-2.5 py-0.5 text-[#f6df9a]">
              {group.spells.length}
            </span>
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
                showPreparedControl={showPreparedControl}
                spell={spell}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
