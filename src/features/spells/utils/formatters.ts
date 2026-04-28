import type {
  Spell,
  SpellComponentMaterial,
  SpellDuration,
  SpellEntryContent,
  SpellEntryObject,
  SpellSourceRef,
} from "../types/spell";

const schoolNames: Record<string, string> = {
  A: "Abjuração",
  C: "Conjuração",
  D: "Adivinhação",
  E: "Encantamento",
  I: "Ilusão",
  N: "Necromancia",
  T: "Transmutação",
  V: "Evocação",
};

const classNames: Record<string, string> = {
  Artificer: "Artífice",
  Bard: "Bardo",
  Cleric: "Clérigo",
  Druid: "Druida",
  Paladin: "Paladino",
  Ranger: "Patrulheiro",
  Sorcerer: "Feiticeiro",
  Warlock: "Bruxo",
  Wizard: "Mago",
};

const abilityNames: Record<string, string> = {
  charisma: "Carisma",
  constitution: "Constituição",
  dexterity: "Destreza",
  intelligence: "Inteligência",
  strength: "Força",
  wisdom: "Sabedoria",
};

const damageNames: Record<string, string> = {
  acid: "Ácido",
  bludgeoning: "Concussão",
  cold: "Frio",
  fire: "Fogo",
  force: "Energia",
  lightning: "Elétrico",
  necrotic: "Necrótico",
  piercing: "Perfurante",
  poison: "Veneno",
  psychic: "Psíquico",
  radiant: "Radiante",
  slashing: "Cortante",
  thunder: "Trovejante",
};

const attackNames: Record<string, string> = {
  M: "Corpo a corpo",
  R: "À distância",
};

const areaTagNames: Record<string, string> = {
  C: "Cubo",
  L: "Linha",
  MT: "Múltiplos alvos",
  N: "Cone",
  Q: "Quadrado",
  R: "Raio",
  S: "Esfera",
  ST: "Alvo único",
  W: "Muralha",
  Y: "Cilindro",
};

export function cleanTags(text: string) {
  return text
    .replace(/\{@dice\s+([^}]+)\}/g, "$1")
    .replace(/\{@damage\s+([^}]+)\}/g, "$1")
    .replace(/\{@condition\s+([^}|]+)(?:\|[^}]+)?\}/g, "$1")
    .replace(/\{@spell\s+([^}|]+)(?:\|[^}]+)?\}/g, "$1")
    .replace(/\{@creature\s+([^}|]+)(?:\|[^}]+)?\}/g, "$1")
    .replace(/\{@item\s+([^}|]+)(?:\|[^}]+)?\}/g, "$1")
    .replace(/\{@book\s+([^}|]+)(?:\|[^}]+)?\}/g, "$1")
    .replace(/\{@filter\s+([^}|]+)(?:\|[^}]+)*\}/g, "$1")
    .replace(/\{@chance\s+([^}]+)\}/g, "$1%")
    .replace(/\{@[^}\s]+\s+([^}|]+)(?:\|[^}]+)*\}/g, "$1");
}

export function formatLevel(level: number | undefined) {
  if (level === undefined) return "Nível desconhecido";
  if (level === 0) return "Truque";
  return `${level}º nível`;
}

export function formatLevelGroup(level: number | "unknown") {
  if (level === "unknown") return "Nível desconhecido";
  if (level === 0) return "Truques";
  return `${level}º nível`;
}

export function formatSchool(school: string | undefined) {
  if (!school) return "Escola desconhecida";
  return schoolNames[school] ?? school;
}

function formatUnit(unit: string, amount: number) {
  const units: Record<string, [string, string]> = {
    action: ["ação", "ações"],
    bonus: ["ação bônus", "ações bônus"],
    hour: ["hora", "horas"],
    minute: ["minuto", "minutos"],
    reaction: ["reação", "reações"],
    round: ["rodada", "rodadas"],
  };
  const pair = units[unit];
  if (!pair) return unit;
  return amount === 1 ? pair[0] : pair[1];
}

export function formatCastingTime(spell: Spell) {
  return spell.time
    .map((time) => {
      const base = `${time.number} ${formatUnit(time.unit, time.number)}`;
      return time.condition ? `${base}, ${cleanTags(time.condition)}` : base;
    })
    .join("; ");
}

export function formatRange(spell: Spell) {
  const { distance, type } = spell.range;
  if (!distance) return type;
  if (distance.type === "touch") return "Toque";
  if (distance.type === "self") return "Pessoal";
  if (distance.type === "sight") return "Visão";
  if (distance.type === "unlimited") return "Ilimitado";
  if (distance.type === "special") return "Especial";
  if (distance.type === "feet" && distance.amount) return `${distance.amount} pés`;
  if (distance.type === "mile" && distance.amount) return `${distance.amount} milha`;
  if (distance.type === "miles" && distance.amount) return `${distance.amount} milhas`;
  return distance.type || type;
}

function formatTimedDuration(duration: SpellDuration) {
  const amount = duration.duration?.amount ?? 0;
  const unit = duration.duration?.type ?? "";
  const prefix = duration.duration?.upTo ? "Até " : "";
  return `${prefix}${amount} ${formatUnit(unit, amount)}`;
}

export function formatDuration(spell: Spell) {
  return spell.duration
    .map((duration) => {
      const base =
        duration.type === "instant"
          ? "Instantânea"
          : duration.type === "timed"
            ? formatTimedDuration(duration)
            : duration.type === "permanent"
              ? "Permanente"
              : duration.type === "special"
                ? "Especial"
                : duration.type;
      const concentration = duration.concentration ? "Concentração, " : "";
      const ends = duration.ends?.length ? `, termina: ${duration.ends.join(", ")}` : "";
      return `${concentration}${base}${ends}`;
    })
    .join("; ");
}

function formatMaterial(material: SpellComponentMaterial) {
  if (typeof material === "string") return cleanTags(material);
  const cost = material.cost ? `, ${material.cost} po` : "";
  const consumed = material.consumed ? ", consumido" : "";
  return `${cleanTags(material.text)}${cost}${consumed}`;
}

export function formatComponents(spell: Spell) {
  const parts: string[] = [];
  if (spell.components.v) parts.push("V");
  if (spell.components.s) parts.push("S");
  if (spell.components.m) parts.push("M");
  const material = spell.components.m
    ? ` (${formatMaterial(spell.components.m)})`
    : "";
  return `${parts.join(", ")}${material}` || "Não informado";
}

export function hasConcentration(spell: Spell) {
  return spell.duration.some((duration) => duration.concentration);
}

export function isRitual(spell: Spell) {
  return Boolean(spell.meta?.ritual);
}

export function formatClassName(name: string) {
  return classNames[name] ?? name;
}

export function getSpellClassNames(spell: Spell) {
  return [...new Set(spell.classes.fromClassList.map((item) => formatClassName(item.name)))];
}

export function formatSourceRef(ref: SpellSourceRef) {
  return `${formatClassName(ref.name)} (${ref.source})`;
}

export function formatStringList(values: string[] | undefined, map: Record<string, string> = {}) {
  return values?.map((value) => map[value] ?? value).join(", ") || "";
}

export function formatDamageList(values: string[] | undefined) {
  return formatStringList(values, damageNames);
}

export function formatAbilityList(values: string[] | undefined) {
  return formatStringList(values, abilityNames);
}

export function formatAttackList(values: string[] | undefined) {
  return formatStringList(values, attackNames);
}

export function formatAreaTags(values: string[] | undefined) {
  return formatStringList(values, areaTagNames);
}

export function entryToPlainText(entry: SpellEntryContent): string {
  if (typeof entry === "string") return cleanTags(entry);
  if (isTableEntry(entry)) {
    const rows = entry.rows
      .map((row) =>
        row
          .map((cell) => (typeof cell === "string" ? cleanTags(cell) : `${cell.roll.min}-${cell.roll.max}`))
          .join(" | ")
      )
      .join("; ");
    return [entry.caption, rows].filter(Boolean).join(": ");
  }
  const title = entry.name ? `${entry.name}: ` : "";
  if (isListEntry(entry)) return `${title}${entry.items.map(entryToPlainText).join("; ")}`;
  return `${title}${entry.entries.map(entryToPlainText).join(" ")}`;
}

export function isListEntry(entry: SpellEntryObject): entry is Extract<SpellEntryObject, { type: "list" }> {
  return entry.type === "list" && "items" in entry;
}

export function isTableEntry(entry: SpellEntryObject): entry is Extract<SpellEntryObject, { rows: unknown }> {
  return "rows" in entry;
}
