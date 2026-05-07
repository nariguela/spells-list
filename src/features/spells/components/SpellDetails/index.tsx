import { Badge } from "../../../../components/ui/Badge"
import type { Spell } from "../../types/spell"
import {
  cleanTags,
  formatAbilityList,
  formatAreaTags,
  formatAttackList,
  formatCastingTime,
  formatClassName,
  formatComponents,
  formatDamageList,
  formatDuration,
  formatRange,
  formatSourceRef,
} from "../../utils/formatters"
import { SpellEntryRenderer } from "../SpellEntryRenderer"
import type { SpellDetailsProps } from "./types"

const coveredFields = new Set<keyof Spell>([
  "areaTags",
  "backgrounds",
  "classes",
  "components",
  "damageImmune",
  "damageInflict",
  "damageResist",
  "damageVulnerable",
  "duration",
  "entries",
  "entriesHigherLevel",
  "level",
  "meta",
  "miscTags",
  "name",
  "opposedCheck",
  "page",
  "races",
  "range",
  "savingThrow",
  "scalingLevelDice",
  "school",
  "source",
  "spellAttack",
  "time",
])

function DetailItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="border-l-3 border-[#7e1f22]/50 pl-2.5">
      <dt className="text-xs font-black uppercase text-[#6f5942]">{label}</dt>
      <dd className="mt-0.5 mb-0">{value}</dd>
    </div>
  )
}

function formatUnknownValue(value: unknown): string {
  if (typeof value === "string") return cleanTags(value)
  if (typeof value === "number" || typeof value === "boolean")
    return String(value)
  if (value === null || value === undefined) return ""
  return JSON.stringify(value, null, 2)
}

export function SpellDetails({ spell }: SpellDetailsProps) {
  const classList = spell.classes.fromClassList.map(formatSourceRef).join(", ")
  const classVariants = spell.classes.fromClassListVariant
    ?.map(formatSourceRef)
    .join(", ")
  const subclasses = spell.classes.fromSubclass
    ?.map(
      (item) =>
        `${formatClassName(item.class.name)}: ${item.subclass.name}${
          item.subclass.subSubclass ? ` (${item.subclass.subSubclass})` : ""
        }`,
    )
    .join(", ")
  const races = spell.races
    ?.map((race) => `${race.name} (${race.source})`)
    .join(", ")
  const backgrounds = spell.backgrounds
    ?.map((background) => `${background.name} (${background.source})`)
    .join(", ")
  const scaling = spell.scalingLevelDice
    ? Object.entries(spell.scalingLevelDice.scaling)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([level, dice]) => `${level}º: ${dice}`)
        .join(", ")
    : ""
  const unknownFields = Object.entries(spell).filter(
    ([key]) => !coveredFields.has(key as keyof Spell),
  )

  return (
    <div className="grid gap-4">
      <dl className="m-0 grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
        <DetailItem
          label="Tempo de conjuração"
          value={formatCastingTime(spell)}
        />
        <DetailItem label="Alcance" value={formatRange(spell)} />
        <DetailItem label="Componentes" value={formatComponents(spell)} />
        <DetailItem label="Duração" value={formatDuration(spell)} />
        <DetailItem label="Classes" value={classList} />
        <DetailItem label="Variantes de classe" value={classVariants} />
        <DetailItem label="Subclasses" value={subclasses} />
        <DetailItem label="Fonte" value={`${spell.source}, p. ${spell.page}`} />
        <DetailItem
          label="Ataque de magia"
          value={formatAttackList(spell.spellAttack)}
        />
        <DetailItem
          label="Teste de resistência"
          value={formatAbilityList(spell.savingThrow)}
        />
        <DetailItem
          label="Teste oposto"
          value={formatAbilityList(spell.opposedCheck)}
        />
        <DetailItem
          label="Dano causado"
          value={formatDamageList(spell.damageInflict)}
        />
        <DetailItem
          label="Resistência concedida"
          value={formatDamageList(spell.damageResist)}
        />
        <DetailItem
          label="Imunidade concedida"
          value={formatDamageList(spell.damageImmune)}
        />
        <DetailItem
          label="Vulnerabilidade"
          value={formatDamageList(spell.damageVulnerable)}
        />
        <DetailItem label="Área" value={formatAreaTags(spell.areaTags)} />
        <DetailItem label="Raças" value={races} />
        <DetailItem label="Antecedentes" value={backgrounds} />
        <DetailItem label="Tags" value={spell.miscTags?.join(", ")} />
        <DetailItem label="Escalonamento de dano" value={scaling} />
      </dl>

      <section>
        <h3 className="mb-2 font-serif text-lg text-[#4b1114]">Descrição</h3>
        <SpellEntryRenderer entries={spell.entries} />
      </section>

      {spell.entriesHigherLevel?.map((entry, index) => (
        <section key={`${entry.name ?? "higher"}-${index}`}>
          <h3 className="mb-2 font-serif text-lg text-[#4b1114]">
            {entry.name === "At Higher Levels"
              ? "Em níveis superiores"
              : entry.name}
          </h3>
          <div className="grid gap-2.5">
            {entry.entries.map((item, itemIndex) => (
              <p className="m-0" key={itemIndex}>
                {cleanTags(item)}
              </p>
            ))}
          </div>
        </section>
      ))}

      {unknownFields.length > 0 && (
        <section>
          <h3 className="mb-2 font-serif text-lg text-[#4b1114]">
            Outros dados
          </h3>
          <div className="grid gap-2.5">
            {unknownFields.map(([key, value]) => (
              <div key={key}>
                <Badge tone="muted">{key}</Badge>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-md border border-[#4d2e1a]/20 bg-[#fff8e8]/75 p-2.5">
                  {formatUnknownValue(value)}
                </pre>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
