import { useState, useCallback } from "react";
import WorldMap from "./components/WorldMap";
import SchoolList from "./components/SchoolList";
import {
  getTotalStudentCount,
  getCountriesWithStudents,
} from "./data/students";
import { getTotalSchoolCount } from "./data/schools";

function App() {
  const total = getTotalStudentCount();
  const countriesCount = getCountriesWithStudents();
  const schoolCount = getTotalSchoolCount();

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleCountryClick = useCallback((countryName: string) => {
    setSelectedCountry((prev) => (prev === countryName ? null : countryName));
  }, []);

  return (
    <div className="portrait-layout bg-ascte-navy px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="portrait-container mx-auto max-w-7xl">
        <header className="mb-6 shrink-0 text-center sm:mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            ASCTE Student World Map
          </h1>
          <p className="mt-2 text-blue-200/70">
            Tracking our students at schools across the globe
          </p>
          <div className="mt-4 inline-flex gap-8 rounded-full border border-white/10 bg-white/10 px-6 py-2 text-sm text-blue-100/70 backdrop-blur">
            <span>
              <strong className="text-white">{total}</strong> total students
            </span>
            <span>
              <strong className="text-white">{countriesCount}</strong> countries
            </span>
            <span>
              <strong className="text-white">{schoolCount}</strong> schools
            </span>
          </div>
        </header>

        <div className="portrait-grid grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="portrait-map-panel overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Students by Country
              </h2>
              {selectedCountry && (
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="mt-1 text-xs text-ascte-crimson hover:underline"
                >
                  Showing: {selectedCountry} — click to clear
                </button>
              )}
            </div>
            <WorldMap
              selectedCountry={selectedCountry}
              onCountryClick={handleCountryClick}
            />
          </div>

          <div className="portrait-list-panel overflow-hidden rounded-2xl bg-white shadow-xl lg:h-[660px] lg:max-h-[660px]">
            <SchoolList selectedCountry={selectedCountry} />
          </div>
        </div>

        <footer className="mt-4 shrink-0 text-center text-xs text-blue-200/40 sm:mt-6">
          Tap or click a country to filter schools. Data is for demonstration
          purposes.
        </footer>
      </div>
    </div>
  );
}

export default App;
