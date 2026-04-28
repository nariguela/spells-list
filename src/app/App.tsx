import { Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { AllSpellsPage } from "../features/spells/components/AllSpellsPage";
import { SavedSpellsPage } from "../features/spells/components/SavedSpellsPage";
import { spells } from "../features/spells/data/spells";
import { useSavedSpells } from "../features/spells/hooks/useSavedSpells";

export default function App() {
  const { prepared, saved, savedSpells, togglePrepared, toggleSaved } =
    useSavedSpells(spells);

  return (
    <AppShell savedCount={saved.size}>
      <Routes>
        <Route
          element={
            <AllSpellsPage
              prepared={prepared}
              saved={saved}
              spells={spells}
              toggleSaved={toggleSaved}
            />
          }
          path="/"
        />
        <Route
          element={
            <SavedSpellsPage
              prepared={prepared}
              saved={saved}
              savedSpells={savedSpells}
              togglePrepared={togglePrepared}
              toggleSaved={toggleSaved}
            />
          }
          path="/salvas"
        />
      </Routes>
    </AppShell>
  );
}
