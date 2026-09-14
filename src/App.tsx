import { useState, useCallback } from "react";
import UsMap from "./components/UsMap";
import SchoolList from "./components/SchoolList";
import { getStatesRepresented } from "./data/states";
import { getTotalSchoolCount } from "./data/schools";

function App() {
  const schoolCount = getTotalSchoolCount();
  const statesCount = getStatesRepresented();

  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleStateClick = useCallback((stateName: string) => {
    setSelectedState((prev) => (prev === stateName ? null : stateName));
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedState(null);
  }, []);

  return (
    <div className="portrait-layout flex h-dvh flex-col overflow-hidden bg-ascte-navy px-4 py-4 sm:px-6 lg:px-8">
      <div className="portrait-container mx-auto flex w-full min-h-0 flex-1 flex-col">
        <header className="mb-3 shrink-0 text-center sm:mb-4">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <img
              src="/ascte-logo.png"
              alt="ASCTE crest"
              className="h-12 w-12 shrink-0 sm:h-16 sm:w-16"
            />
            <div className="text-left">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                ASCTE University Map
              </h1>
              <p className="mt-1 text-sm text-blue-200/70">
                Acceptances &amp; matriculation — Classes of 2023–2026
              </p>
            </div>
          </div>
          <div className="mt-3 inline-flex gap-8 rounded-full border border-white/10 bg-white/10 px-6 py-2 text-sm text-blue-100/70 backdrop-blur">
            <span>
              <strong className="text-white">{schoolCount}</strong> universities
            </span>
            <span>
              <strong className="text-white">{statesCount}</strong> states
            </span>
          </div>
        </header>

        <div className="portrait-grid grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
          <div className="portrait-map-panel flex min-h-0 flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-white/15">
            <div className="shrink-0 border-b-2 border-ascte-crimson bg-ascte-navy px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                Universities by State
              </h2>
              {selectedState && (
                <button
                  onClick={() => setSelectedState(null)}
                  className="mt-1 text-xs text-blue-200 hover:text-white hover:underline"
                >
                  Showing: {selectedState} — click to clear
                </button>
              )}
            </div>
            <UsMap
              selectedState={selectedState}
              onStateClick={handleStateClick}
              onClearSelection={handleClearSelection}
            />
          </div>

          <div className="portrait-list-panel flex min-h-0 flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-white/15">
            <SchoolList selectedState={selectedState} />
          </div>
        </div>

        <footer className="mt-3 shrink-0 text-center text-xs text-blue-200/40">
          Tap or click a state to filter universities. Data reflects ASCTE
          acceptances &amp; matriculation.
        </footer>
      </div>
    </div>
  );
}

export default App;
