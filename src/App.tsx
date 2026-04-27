import { useEffect, useMemo, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import "./App.css";
import { spells as spellsData } from "./data/spells";

// Tipagem baseada na estrutura do arquivo de dados
interface SpellData {
  name: string;
  level?: number;
  school?: string;
  time?: Array<{ number: number; unit: string }>;
  range?: { type: string; distance?: { type: string; amount?: number } };
  duration?: Array<{
    type: string;
    duration?: { type: string; amount?: number };
    concentration?: boolean;
  }>;
  components?: { v?: boolean; s?: boolean; m?: boolean | string };
  entries?: string[];
  entriesHigherLevel?: Array<{ name?: string; entries?: string[] }>;
  scalingLevelDice?: { label?: string; scaling?: Record<string, string> };
}

function formatLevel(level?: number) {
  if (level === undefined || level === null) return "—";
  if (level === 0) return "Truque";
  return `${level}º nível`;
}

function formatLevelPlural(level?: number) {
  if (level === 0) return "Truques";
  if (level) return `${level}º nível`;
  return "Nível desconhecido";
}

function formatSchool(s?: string) {
  if (!s) return "—";
  const map: Record<string, string> = {
    A: "Abjuração",
    C: "Conjuração",
    D: "Adivinhação",
    E: "Encantamento",
    I: "Ilusão",
    N: "Necromancia",
    T: "Transmutação",
    V: "Evocação",
  };
  return map[s] ?? s;
}

function formatCastingTime(spell: SpellData) {
  const t = spell.time?.[0];
  if (!t) return "—";
  const unitMap: Record<string, string> = {
    action: "ação",
    bonus: "ação bônus",
    reaction: "reação",
    minute: "minuto",
    minutes: "minutos",
    hour: "hora",
    hours: "horas",
  };
  const unit = unitMap[t.unit] ?? t.unit;
  return `${t.number} ${unit}`;
}

function formatRange(spell: SpellData) {
  const r = spell.range;
  if (!r) return "—";
  if (
    r.distance?.type === "touch" ||
    (r.type === "point" && r.distance?.type === "touch")
  )
    return "Toque";
  if (r.distance?.type === "self") return "Pessoal";
  if (r.distance?.type === "feet" && r.distance.amount)
    return `${r.distance.amount} pés`;
  return r.distance?.type ?? r.type ?? "—";
}

function formatDuration(spell: SpellData) {
  const d = spell.duration?.[0];
  if (!d) return "—";
  if (d.type === "instant") return "Instantânea";
  if (d.type === "timed") {
    const unitMap: Record<string, string> = {
      round: "rodada",
      rounds: "rodadas",
      minute: "minuto",
      minutes: "minutos",
      hour: "hora",
      hours: "horas",
    };
    const amount = d.duration?.amount ?? 0;
    const unit = unitMap[d.duration?.type ?? ""] ?? d.duration?.type ?? "";
    const conc = d.concentration ? " (Concentração)" : "";
    return `${amount} ${unit}${conc}`;
  }
  return d.type;
}

function formatComponents(spell: SpellData) {
  const c = spell.components;
  if (!c) return "—";
  const parts: string[] = [];
  if (c.v) parts.push("V");
  if (c.s) parts.push("S");
  if (c.m) parts.push("M");
  let text = parts.join(", ");
  if (typeof c.m === "string") {
    text += ` (${c.m})`;
  }
  return text || "—";
}

function cleanDiceTags(text: string) {
  return text.replace(/\{@dice\s+([^}]+)\}/g, "$1");
}

function formatHigherLevels(spell: SpellData) {
  const parts: string[] = [];
  const entries =
    spell.entriesHigherLevel?.flatMap((e) => e.entries ?? []) ?? [];
  for (const e of entries) {
    parts.push(cleanDiceTags(e));
  }
  const s = spell.scalingLevelDice?.scaling;
  if (s) {
    const keys = Object.keys(s).sort((a, b) => Number(a) - Number(b));
    const esc = keys.map((k) => `${k}º: ${s[k]}`).join(", ");
    parts.push(`Escalonamento: ${esc}`);
  }
  return parts.join(" ");
}

function SpellCard({
  spell,
  isSaved,
  onToggle,
  showPreparedCheckbox,
  isPrepared,
  onTogglePrepared,
}: {
  spell: SpellData;
  isSaved: boolean;
  onToggle: (name: string) => void;
  showPreparedCheckbox?: boolean;
  isPrepared?: boolean;
  onTogglePrepared?: (name: string) => void;
}) {
  const higher = formatHigherLevels(spell);
  return (
    <li
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: 14,
          borderBottom: "1px solid #f0f2f5",
          background: "#f9fafb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{spell.name}</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            {formatLevel(spell.level)} · {formatSchool(spell.school)}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {showPreparedCheckbox && (
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#111827",
                userSelect: "none",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={Boolean(isPrepared)}
                onChange={() => onTogglePrepared?.(spell.name)}
                aria-label={`Marcar ${spell.name} como preparada`}
              />
              Preparada
            </label>
          )}
          <button
            onClick={() => onToggle(spell.name)}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: isSaved ? "#10b981" : "#ffffff",
              color: isSaved ? "#fff" : "#111827",
              cursor: "pointer",
              fontSize: 12,
            }}
            aria-label={`${isSaved ? "Remover" : "Adicionar"} ${
              spell.name
            } ao perfil`}
          >
            {isSaved ? "Salva ✓" : "Adicionar"}
          </button>
        </div>
      </div>

      <div
        style={{
          padding: 14,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          fontSize: 13,
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>Conjuração</div>
          <div>{formatCastingTime(spell)}</div>
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>Alcance</div>
          <div>{formatRange(spell)}</div>
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>Duração</div>
          <div>{formatDuration(spell)}</div>
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>Componentes</div>
          <div>{formatComponents(spell)}</div>
        </div>
      </div>

      {spell.entries?.[0] && (
        <div
          style={{
            padding: 14,
            borderTop: "1px solid #f0f2f5",
            fontSize: 13,
            color: "#374151",
          }}
        >
          {spell.entries[0]}
        </div>
      )}

      {higher && (
        <div
          style={{
            padding: 14,
            borderTop: "1px solid #f0f2f5",
            fontSize: 12,
            color: "#374151",
            background: "#fafafa",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            Em níveis superiores
          </div>
          <div>{higher}</div>
        </div>
      )}
    </li>
  );
}

function AllSpellsPage({
  grouped,
  saved,
  toggleSave,
  query,
  setQuery,
}: {
  grouped: { key: number | "unknown"; spells: SpellData[] }[];
  saved: Set<string>;
  toggleSave: (name: string) => void;
  query: string;
  setQuery: (v: string) => void;
}) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24 }}>
          Magias DnD 5e (dados locais)
        </h1>
        <div style={{ marginLeft: "auto", minWidth: 300, flex: "1 1 300px" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou escola"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
            aria-label="Campo de busca de magias"
          />
        </div>
        <Link
          to="/salvas"
          style={{ marginLeft: "auto", textDecoration: "none" }}
        >
          <button
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "#111827",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Minhas Magias ({saved.size})
          </button>
        </Link>
      </header>

      {grouped.map((group) => (
        <section key={String(group.key)} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, margin: "12px 0" }}>
            {group.key === "unknown"
              ? "Nível desconhecido"
              : formatLevelPlural(group.key as number)}
          </h2>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {group.spells.map((spell, idx) => (
              <SpellCard
                key={`${spell.name}-${idx}`}
                spell={spell}
                isSaved={saved.has(spell.name)}
                onToggle={toggleSave}
              />
            ))}
          </ul>
        </section>
      ))}

      {grouped.length === 0 && (
        <div style={{ marginTop: 24, color: "#6b7280" }}>
          Nenhuma magia encontrada para "{query}"
        </div>
      )}
    </div>
  );
}

function SavedSpellsPage({
  saved,
  prepared,
  toggleSave,
  togglePrepared,
}: {
  saved: Set<string>;
  prepared: Set<string>;
  toggleSave: (name: string) => void;
  togglePrepared: (name: string) => void;
}) {
  const [showOnlyPrepared, setShowOnlyPrepared] = useState(false);

  const savedList = useMemo(() => {
    const byName = new Map((spellsData as SpellData[]).map((s) => [s.name, s]));
    return Array.from(saved)
      .map((n) => byName.get(n))
      .filter(Boolean) as SpellData[];
  }, [saved]);

  const visibleList = useMemo(() => {
    if (!showOnlyPrepared) return savedList;
    return savedList.filter((s) => prepared.has(s.name));
  }, [prepared, savedList, showOnlyPrepared]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24 }}>Minhas Magias</h1>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#fff",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            checked={showOnlyPrepared}
            onChange={(e) => setShowOnlyPrepared(e.target.checked)}
            aria-label="Mostrar apenas magias preparadas"
          />
          <span style={{ fontSize: 13, color: "#111827" }}>
            Mostrar apenas preparadas ({prepared.size})
          </span>
        </label>
        <Link to="/" style={{ marginLeft: "auto", textDecoration: "none" }}>
          <button
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#111827",
              cursor: "pointer",
            }}
          >
            ← Todas as magias
          </button>
        </Link>
      </header>

      {savedList.length === 0 ? (
        <div style={{ color: "#6b7280" }}>
          Você ainda não adicionou magias. Vá para a lista completa e clique em
          "Adicionar" nos cards.
        </div>
      ) : visibleList.length === 0 ? (
        <div style={{ color: "#6b7280" }}>
          Nenhuma magia preparada. Marque “Preparada” nos cards para aparecerem
          aqui.
        </div>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {visibleList.map((spell, idx) => (
            <SpellCard
              key={`${spell.name}-${idx}`}
              spell={spell}
              isSaved={true}
              onToggle={toggleSave}
              showPreparedCheckbox={true}
              isPrepared={prepared.has(spell.name)}
              onTogglePrepared={togglePrepared}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem("saved_spells");
      const arr: string[] = raw ? JSON.parse(raw) : [];
      return new Set(arr);
    } catch {
      return new Set();
    }
  });
  const [prepared, setPrepared] = useState<Set<string>>(() => {
    try {
      const rawSaved = localStorage.getItem("saved_spells");
      const savedArr: string[] = rawSaved ? JSON.parse(rawSaved) : [];
      const savedSet = new Set(savedArr);
      const raw = localStorage.getItem("prepared_spells");
      const arr: string[] = raw ? JSON.parse(raw) : [];
      return new Set(arr.filter((n) => savedSet.has(n)));
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem("saved_spells", JSON.stringify(Array.from(saved)));
  }, [saved]);

  useEffect(() => {
    localStorage.setItem(
      "prepared_spells",
      JSON.stringify(Array.from(prepared))
    );
  }, [prepared]);

  const filtered: SpellData[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = spellsData as SpellData[];
    if (!q) return all;
    return all.filter((s) => {
      const name = s.name?.toLowerCase() ?? "";
      const school = formatSchool(s.school)?.toLowerCase() ?? "";
      return name.includes(q) || school.includes(q);
    });
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<number | "unknown", SpellData[]>();
    for (const s of filtered) {
      const key = typeof s.level === "number" ? s.level : ("unknown" as const);
      const arr = map.get(key) ?? [];
      arr.push(s);
      map.set(key, arr);
    }
    const orderKeys: (number | "unknown")[] = [
      "unknown",
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
    ];
    return orderKeys
      .map((k) => ({ key: k, spells: map.get(k) ?? [] }))
      .filter((g) => g.spells.length > 0);
  }, [filtered]);

  function toggleSave(name: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      const willRemove = next.has(name);
      if (willRemove) next.delete(name);
      else next.add(name);
      if (willRemove) {
        setPrepared((p) => {
          if (!p.has(name)) return p;
          const n = new Set(p);
          n.delete(name);
          return n;
        });
      }
      return next;
    });
  }

  function togglePrepared(name: string) {
    setPrepared((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AllSpellsPage
            grouped={grouped}
            saved={saved}
            toggleSave={toggleSave}
            query={query}
            setQuery={setQuery}
          />
        }
      />
      <Route
        path="/salvas"
        element={
          <SavedSpellsPage
            saved={saved}
            prepared={prepared}
            toggleSave={toggleSave}
            togglePrepared={togglePrepared}
          />
        }
      />
    </Routes>
  );
}
