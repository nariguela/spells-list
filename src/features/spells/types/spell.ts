export type SpellSchoolCode = "A" | "C" | "D" | "E" | "I" | "N" | "T" | "V";

export type SpellTimeUnit =
  | "action"
  | "bonus"
  | "reaction"
  | "minute"
  | "minutes"
  | "hour"
  | "hours";

export type SpellDistanceType =
  | "feet"
  | "mile"
  | "miles"
  | "self"
  | "sight"
  | "touch"
  | "unlimited"
  | "special";

export type SpellDurationType = "instant" | "permanent" | "special" | "timed";

export type SpellComponentMaterial =
  | string
  | {
      text: string;
      cost?: number;
      consumed?: boolean;
    };

export interface SpellTime {
  number: number;
  unit: SpellTimeUnit | string;
  condition?: string;
}

export interface SpellRange {
  type: string;
  distance?: {
    type: SpellDistanceType | string;
    amount?: number;
  };
}

export interface SpellDuration {
  type: SpellDurationType | string;
  concentration?: boolean;
  duration?: {
    type: string;
    amount: number;
    upTo?: boolean;
  };
  ends?: string[];
}

export interface SpellComponents {
  v?: boolean;
  s?: boolean;
  m?: SpellComponentMaterial;
}

export interface SpellSourceRef {
  name: string;
  source: string;
}

export interface SpellSubclassRef {
  class: SpellSourceRef;
  subclass: SpellSourceRef & {
    subSubclass?: string;
  };
}

export interface SpellClasses {
  fromClassList: SpellSourceRef[];
  fromClassListVariant?: SpellSourceRef[];
  fromSubclass?: SpellSubclassRef[];
}

export interface SpellRaceRef extends SpellSourceRef {
  baseName?: string;
  baseSource?: string;
}

export type SpellBackgroundRef = SpellSourceRef;

export interface SpellRollCell {
  type: "cell";
  roll: {
    min: number;
    max: number;
    pad?: boolean;
  };
}

export type SpellEntryTableCell = string | SpellRollCell;
export type SpellEntryTableRow = SpellEntryTableCell[];

export interface SpellEntryBase {
  type?: string;
  name?: string;
}

export interface SpellEntryList extends SpellEntryBase {
  type: "list";
  items: SpellEntryContent[];
}

export interface SpellEntrySection extends SpellEntryBase {
  entries: SpellEntryContent[];
}

export interface SpellEntryTable extends SpellEntryBase {
  caption?: string;
  colLabels?: string[];
  colStyles?: string[];
  rows: SpellEntryTableRow[];
}

export type SpellEntryObject = SpellEntryList | SpellEntrySection | SpellEntryTable;
export type SpellEntryContent = string | SpellEntryObject;

export interface SpellHigherLevelEntry {
  name?: string;
  entries: string[];
}

export interface SpellScalingLevelDice {
  label?: string;
  scaling: Record<string, string>;
}

export interface SpellMeta {
  ritual?: boolean;
}

export interface Spell {
  name: string;
  source: string;
  page: number;
  level: number;
  school: SpellSchoolCode | string;
  time: SpellTime[];
  range: SpellRange;
  components: SpellComponents;
  duration: SpellDuration[];
  entries: SpellEntryContent[];
  classes: SpellClasses;
  meta?: SpellMeta;
  entriesHigherLevel?: SpellHigherLevelEntry[];
  scalingLevelDice?: SpellScalingLevelDice;
  damageInflict?: string[];
  damageResist?: string[];
  damageImmune?: string[];
  damageVulnerable?: string[];
  savingThrow?: string[];
  spellAttack?: string[];
  opposedCheck?: string[];
  miscTags?: string[];
  areaTags?: string[];
  races?: SpellRaceRef[];
  backgrounds?: SpellBackgroundRef[];
}

export type SpellGroupKey = number | "unknown";
