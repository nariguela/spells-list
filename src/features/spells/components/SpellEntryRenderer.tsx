import type {
  SpellEntryContent,
  SpellEntryObject,
  SpellEntryTableCell,
} from "../types/spell";
import { cleanTags, isListEntry, isTableEntry } from "../utils/formatters";

interface SpellEntryRendererProps {
  entries: SpellEntryContent[];
}

function renderCell(cell: SpellEntryTableCell) {
  if (typeof cell === "string") return cleanTags(cell);
  return `${cell.roll.min}-${cell.roll.max}`;
}

function SpellEntryBlock({ entry }: { entry: SpellEntryContent }) {
  if (typeof entry === "string") return <p className="m-0">{cleanTags(entry)}</p>;

  if (isTableEntry(entry)) {
    return (
      <div className="overflow-x-auto">
        {entry.caption && (
          <h4 className="mb-0 font-serif text-[#5a281c]">
            {cleanTags(entry.caption)}
          </h4>
        )}
        <table className="w-full border-collapse bg-[#fff8e8]">
          {entry.colLabels && (
            <thead>
              <tr>
                {entry.colLabels.map((label, index) => (
                  <th
                    className="border border-[#4d2e1a]/20 bg-[#7e1f22]/10 p-2 text-left align-top"
                    key={`${label}-${index}`}
                  >
                    {cleanTags(label)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {entry.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    className="border border-[#4d2e1a]/20 p-2 text-left align-top"
                    key={`${rowIndex}-${cellIndex}`}
                  >
                    {renderCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (isListEntry(entry)) {
    return (
      <section className="grid gap-2">
        {entry.name && (
          <h4 className="mb-0 font-serif text-[#5a281c]">
            {cleanTags(entry.name)}
          </h4>
        )}
        <ul className="m-0 pl-5">
          {entry.items.map((item, index) => (
            <li key={index}>
              <SpellEntryBlock entry={item} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return <NestedEntry entry={entry} />;
}

function NestedEntry({ entry }: { entry: SpellEntryObject }) {
  return (
    <section className="grid gap-2">
      {entry.name && (
        <h4 className="mb-0 font-serif text-[#5a281c]">{cleanTags(entry.name)}</h4>
      )}
      {"entries" in entry && <SpellEntryRenderer entries={entry.entries} />}
    </section>
  );
}

export function SpellEntryRenderer({ entries }: SpellEntryRendererProps) {
  return (
    <div className="grid gap-2.5">
      {entries.map((entry, index) => (
        <SpellEntryBlock entry={entry} key={index} />
      ))}
    </div>
  );
}
