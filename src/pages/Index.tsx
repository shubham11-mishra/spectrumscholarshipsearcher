import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import InterestSetupBanner from "@/components/InterestSetupBanner";
import SchoolCard from "@/components/SchoolCard";
import { SchoolScholarship, loadScholarshipsFromCSV } from "@/data/csvScholarships";
import { matchesExactFilter, matchesInterestCategory, matchesSearch } from "@/lib/scholarshipFilters";
import { Filter, X, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type SortOption = "name" | "suburb" | "confidence" | "value";
type ConfidenceFilter = "all" | "high" | "medium" | "low";

const Index = () => {
  const { user, interests } = useAuth();
  const [schools, setSchools] = useState<SchoolScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [confidenceFilter, setConfidenceFilter] = useState<ConfidenceFilter>("all");
  const [sectorFilters, setSectorFilters] = useState<string[]>([]);
  const [stateFilters, setStateFilters] = useState<string[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [genderFilters, setGenderFilters] = useState<string[]>([]);
  const [valueTypeFilters, setValueTypeFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showPersonalized, setShowPersonalized] = useState(true);

  useEffect(() => {
    loadScholarshipsFromCSV().then((data) => {
      setSchools(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = () => setSearchQuery((prev) => prev.trim());

  // Derive unique filter options from data
  const filterOptions = useMemo(() => {
    const states = new Set<string>();
    const categories = new Set<string>();
    const genders = new Set<string>();
    const valueTypes = new Set<string>();
    const sectors = new Set<string>();
    schools.forEach((s) => {
      if (s.state?.trim()) states.add(s.state.trim());
      if (s.category?.trim()) categories.add(s.category.trim());
      if (s.gender?.trim()) genders.add(s.gender.trim());
      if (s.value_type?.trim()) valueTypes.add(s.value_type.trim());
      if (s.school_sector?.trim()) sectors.add(s.school_sector.trim());
    });
    return {
      states: Array.from(states).sort(),
      categories: Array.from(categories).sort(),
      genders: Array.from(genders).sort(),
      valueTypes: Array.from(valueTypes).sort(),
      sectors: Array.from(sectors).sort(),
    };
  }, [schools]);

  const matchesAnyFilter = (value: string | undefined, selected: string[]) => {
    if (selected.length === 0) return true;
    const v = (value ?? "").trim().toLowerCase();
    return selected.some((s) => s.trim().toLowerCase() === v);
  };

  const filtered = useMemo(() => {
    let data = schools.filter((s) => {
      if (s.scholarship_confidence === "not_found") return false;
      if (user && interests.length > 0 && showPersonalized && !searchQuery.trim()) {
        if (!matchesInterestCategory(s.category, interests)) return false;
      }
      if (!matchesSearch(s, searchQuery)) return false;
      if (confidenceFilter !== "all" && !matchesExactFilter(s.scholarship_confidence, confidenceFilter)) return false;
      if (!matchesAnyFilter(s.school_sector, sectorFilters)) return false;
      if (!matchesAnyFilter(s.state, stateFilters)) return false;
      if (!matchesAnyFilter(s.category, categoryFilters)) return false;
      if (!matchesAnyFilter(s.gender, genderFilters)) return false;
      if (!matchesAnyFilter(s.value_type, valueTypeFilters)) return false;
      return true;
    });

    switch (sortBy) {
      case "name": data.sort((a, b) => a.school_name.localeCompare(b.school_name)); break;
      case "suburb": data.sort((a, b) => a.suburb.localeCompare(b.suburb)); break;
      case "confidence": {
        const order = { high: 0, medium: 1, low: 2, not_found: 3 };
        data.sort((a, b) => order[a.scholarship_confidence] - order[b.scholarship_confidence]);
        break;
      }
      case "value": data.sort((a, b) => (parseInt(b.value_num) || 0) - (parseInt(a.value_num) || 0)); break;
    }
    return data;
  }, [schools, searchQuery, sortBy, confidenceFilter, sectorFilters, stateFilters, categoryFilters, genderFilters, valueTypeFilters, user, interests, showPersonalized]);

  const counts = useMemo(() => {
    const visible = schools.filter((s) => s.scholarship_confidence !== "not_found");
    const c = { all: visible.length, high: 0, medium: 0, low: 0 };
    visible.forEach((s) => {
      if (s.scholarship_confidence in c) c[s.scholarship_confidence as keyof typeof c]++;
    });
    return c;
  }, [schools]);

  const activeFiltersCount =
    sectorFilters.length + stateFilters.length + categoryFilters.length + genderFilters.length + valueTypeFilters.length;

  const clearAllFilters = () => {
    setConfidenceFilter("all");
    setSectorFilters([]);
    setStateFilters([]);
    setCategoryFilters([]);
    setGenderFilters([]);
    setValueTypeFilters([]);
  };


  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearch={handleSearch} />

      {user && interests.length === 0 && <InterestSetupBanner />}

      {/* Personalized banner */}
      {user && interests.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pb-3 animate-fade-up">
          <div className="glass rounded-xl px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span className="text-muted-foreground">
                Showing scholarships matching your interests: {" "}
                <span className="text-foreground font-semibold">{interests.join(", ")}</span>
              </span>
            </div>
            <button
              onClick={() => setShowPersonalized(!showPersonalized)}
              className={`text-xs font-medium px-3 py-1 rounded-lg cursor-pointer border-none transition-all ${
                showPersonalized
                  ? "bg-primary/15 text-primary"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {showPersonalized ? "Show All" : "My Interests"}
            </button>
          </div>
        </div>
      )}
      {/* Confidence filter chips */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted-foreground">
            Filter by Confidence
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none relative"
          >
            <Filter className="w-3.5 h-3.5" />
            More Filters
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "high", "medium", "low"] as ConfidenceFilter[]).map((c) => (
            <button
              key={c}
              onClick={() => setConfidenceFilter(c)}
              className={`border rounded-xl px-3.5 py-2 text-[13px] font-medium cursor-pointer transition-all select-none ${
                confidenceFilter === c
                  ? "border-primary/50 text-primary bg-teal-light glow-primary"
                  : "glass text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
              <span className={`ml-1.5 rounded-md px-1.5 py-px text-[11px] font-semibold ${
                confidenceFilter === c ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
              }`}>
                {counts[c]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced filters panel */}
      {showFilters && (
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pb-4 animate-fade-up">
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-foreground">Advanced Filters</span>
              <div className="flex items-center gap-3">
                {activeFiltersCount > 0 && (
                  <button onClick={clearAllFilters} className="text-[11px] text-accent font-semibold bg-transparent border-none cursor-pointer hover:text-accent/80 transition-colors">
                    Clear all
                  </button>
                )}
                <button onClick={() => setShowFilters(false)} className="text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <FilterCheckGroup label="State" selected={stateFilters} onToggle={(v) => toggleInArray(v, stateFilters, setStateFilters)} options={filterOptions.states} />
              <FilterCheckGroup label="Sector" selected={sectorFilters} onToggle={(v) => toggleInArray(v, sectorFilters, setSectorFilters)} options={filterOptions.sectors} />
              <FilterCheckGroup label="Category" selected={categoryFilters} onToggle={(v) => toggleInArray(v, categoryFilters, setCategoryFilters)} options={filterOptions.categories} />
              <FilterCheckGroup label="Gender" selected={genderFilters} onToggle={(v) => toggleInArray(v, genderFilters, setGenderFilters)} options={filterOptions.genders} />
              <FilterCheckGroup label="Value Type" selected={valueTypeFilters} onToggle={(v) => toggleInArray(v, valueTypeFilters, setValueTypeFilters)} options={filterOptions.valueTypes} />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2.5">
          <div className="text-sm text-muted-foreground">
            Showing <strong className="text-foreground font-bold">{filtered.length}</strong> scholarships
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="border border-border rounded-lg px-3 py-1.5 text-[13px] text-muted-foreground bg-card cursor-pointer outline-none"
          >
            <option value="name">Name A–Z</option>
            <option value="suburb">Suburb A–Z</option>
            <option value="confidence">Confidence Level</option>
            <option value="value">Highest Value</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4 animate-spin">⏳</div>
            <h3 className="font-display text-xl mb-2">Loading scholarships...</h3>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display text-xl mb-2">No scholarships found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s, i) => (
              <SchoolCard key={`${s.acara_id}-${s.row}`} school={s} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const toggleInArray = (value: string, current: string[], setter: (v: string[]) => void) => {
  setter(current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
};

const FilterCheckGroup = ({
  label,
  selected,
  onToggle,
  options,
}: {
  label: string;
  selected: string[];
  onToggle: (v: string) => void;
  options: string[];
}) => (
  <div>
    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
      {label}
      {selected.length > 0 && (
        <span className="ml-1.5 text-primary normal-case">({selected.length})</span>
      )}
    </div>
    <div className="max-h-44 overflow-y-auto pr-1 space-y-1 border border-border rounded-lg p-2 bg-card">
      {options.length === 0 && (
        <div className="text-[11px] text-muted-foreground italic">No options</div>
      )}
      {options.map((o) => {
        const checked = selected.includes(o);
        return (
          <label
            key={o}
            className={`flex items-center gap-2 px-1.5 py-1 rounded-md text-[12px] cursor-pointer transition-colors ${
              checked ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(o)}
              className="w-3.5 h-3.5 accent-primary cursor-pointer rounded"
            />
            <span className="truncate">{o}</span>
          </label>
        );
      })}
    </div>
  </div>
);

export default Index;
