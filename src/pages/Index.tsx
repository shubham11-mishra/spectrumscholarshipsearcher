import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import InterestSetupBanner from "@/components/InterestSetupBanner";
import SchoolCard from "@/components/SchoolCard";
import SchoolDetailModal from "@/components/SchoolDetailModal";
import CategoryQuickLinks from "@/components/CategoryQuickLinks";
import {
  SchoolScholarship,
  fetchScholarshipsPage,
  fetchFilterOptions,
  fetchConfidenceCounts,
  fetchCategoryCounts,
} from "@/data/csvScholarships";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type SortOption = "name" | "suburb" | "confidence" | "value";
type ConfidenceFilter = "all" | "high" | "medium" | "low";

const PAGE_SIZE = 50;

// Curated category buckets shown in the sidebar. Each bucket maps to one or
// more underlying `category` values stored in the DB so we can present a
// cleaner, more meaningful taxonomy to users.
const CATEGORY_BUCKETS: { label: string; values: string[] }[] = [
  { label: "Academic", values: ["Academic", "All-Rounder", "Leadership"] },
  { label: "Arts", values: ["Performing Arts", "Visual Arts", "Music"] },
  { label: "Sports", values: ["Sports", "Sport"] },
  { label: "Cultural", values: ["Cultural"] },
  { label: "Financial Need", values: ["Financial Need"] },
  { label: "STEM", values: ["STEM"] },
  { label: "School-Specific", values: ["School-Specific", "General", "Other"] },
];

const expandCategoryBuckets = (labels: string[]): string[] => {
  const out = new Set<string>();
  labels.forEach((l) => {
    const bucket = CATEGORY_BUCKETS.find((b) => b.label === l);
    (bucket ? bucket.values : [l]).forEach((v) => out.add(v));
  });
  return [...out];
};

// Expand a user interest into the actual category values stored in DB
const INTEREST_TO_CATEGORIES: Record<string, string[]> = {
  academic: ["Academic"],
  music: ["Music", "Performing Arts"],
  sport: ["Sport", "Sports"],
  general: ["General", "All Rounder", "Financial Need", "Leadership", "Cultural"],
};

const expandInterests = (interests: string[]): string[] => {
  const out = new Set<string>();
  interests.forEach((i) => {
    const key = i.trim().toLowerCase();
    (INTEREST_TO_CATEGORIES[key] ?? [i]).forEach((c) => out.add(c));
  });
  return [...out];
};

const Index = () => {
  const { user, interests } = useAuth();
  const [rows, setRows] = useState<SchoolScholarship[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // debounced
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [confidenceFilter, setConfidenceFilter] = useState<ConfidenceFilter>("all");
  const [sectorFilters, setSectorFilters] = useState<string[]>([]);
  const [stateFilters, setStateFilters] = useState<string[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [genderFilters, setGenderFilters] = useState<string[]>([]);
  const [valueTypeFilters, setValueTypeFilters] = useState<string[]>([]);
  const [showPersonalized, setShowPersonalized] = useState(true);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<SchoolScholarship | null>(null);

  const [filterOptions, setFilterOptions] = useState({
    states: [] as string[],
    sectors: [] as string[],
    categories: [] as string[],
    genders: [] as string[],
    valueTypes: [] as string[],
  });
  const [counts, setCounts] = useState({ all: 0, high: 0, medium: 0, low: 0 });
  const [rawCategoryCounts, setRawCategoryCounts] = useState<Record<string, number>>({});

  // One-time: load filter options + counts
  useEffect(() => {
    fetchFilterOptions().then(setFilterOptions);
    fetchConfidenceCounts().then(setCounts);
    fetchCategoryCounts().then(setRawCategoryCounts);
  }, []);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset to page 0 whenever any filter/search changes
  useEffect(() => {
    setPage(0);
  }, [
    searchQuery, sortBy, confidenceFilter,
    sectorFilters, stateFilters, categoryFilters, genderFilters, valueTypeFilters,
    showPersonalized,
  ]);

  const interestCategories = useMemo(() => {
    if (!user || interests.length === 0 || !showPersonalized || searchQuery) return undefined;
    return expandInterests(interests);
  }, [user, interests, showPersonalized, searchQuery]);

  // Fetch data when filters/search/sort/page change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchScholarshipsPage({
      search: searchQuery,
      confidence: confidenceFilter,
      states: stateFilters,
      sectors: sectorFilters,
      categories: expandCategoryBuckets(categoryFilters),
      genders: genderFilters,
      valueTypes: valueTypeFilters,
      interestCategories,
      sortBy,
      page,
      pageSize: PAGE_SIZE,
    }).then((res) => {
      if (cancelled) return;
      setRows(res.rows);
      setTotal(res.total);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [
    searchQuery, sortBy, confidenceFilter, page,
    sectorFilters, stateFilters, categoryFilters, genderFilters, valueTypeFilters,
    interestCategories,
  ]);

  const handleSearch = () => setSearchQuery(searchInput.trim());

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

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Sum raw category counts into the curated buckets shown on the quick-links
  const bucketCounts = useMemo(() => {
    const out: Record<string, number> = {};
    CATEGORY_BUCKETS.forEach((b) => {
      out[b.label] = b.values.reduce((sum, v) => sum + (rawCategoryCounts[v] ?? 0), 0);
    });
    return out;
  }, [rawCategoryCounts]);

  const toggleCategoryBucket = (label: string) => {
    setCategoryFilters((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
    // Smooth-scroll to the results so users see the filter take effect
    requestAnimationFrame(() => {
      document.getElementById("results-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection searchQuery={searchInput} onSearchChange={setSearchInput} onSearch={handleSearch} />

      {user && interests.length === 0 && <InterestSetupBanner />}

      <CategoryQuickLinks
        active={categoryFilters}
        counts={bucketCounts}
        onSelect={toggleCategoryBucket}
      />

      {user && interests.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pb-3 animate-fade-up">
          <div className="glass rounded-xl px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span className="text-muted-foreground">
                Showing scholarships matching your interests:{" "}
                <span className="text-foreground font-semibold">{interests.join(", ")}</span>
              </span>
            </div>
            <button
              onClick={() => setShowPersonalized(!showPersonalized)}
              className={`text-xs font-medium px-3 py-1 rounded-lg cursor-pointer border-none transition-all ${
                showPersonalized ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
              }`}
            >
              {showPersonalized ? "Show All" : "My Interests"}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-20 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <aside className="md:sticky md:top-20 md:self-start glass rounded-2xl p-4 md:max-h-[calc(100vh-6rem)] md:overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted-foreground">Filters</span>
              {activeFiltersCount > 0 && (
                <button onClick={clearAllFilters} className="text-[11px] text-accent font-semibold bg-transparent border-none cursor-pointer hover:text-accent/80 transition-colors">
                  Clear all
                </button>
              )}
            </div>

            <div className="mb-4">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Confidence</div>
              <div className="flex flex-wrap gap-1.5">
                {(["all", "high", "medium", "low"] as ConfidenceFilter[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setConfidenceFilter(c)}
                    className={`border rounded-lg px-2.5 py-1 text-[11px] font-medium cursor-pointer transition-all ${
                      confidenceFilter === c
                        ? "border-primary/50 text-primary bg-teal-light"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
                    <span className="ml-1 text-[10px] opacity-70">{counts[c]}</span>
                  </button>
                ))}
              </div>
            </div>

            <FilterCheckGroup label="State" selected={stateFilters} onToggle={(v) => toggleInArray(v, stateFilters, setStateFilters)} options={filterOptions.states} noScroll />
            <FilterCheckGroup label="School Sector" selected={sectorFilters} onToggle={(v) => toggleInArray(v, sectorFilters, setSectorFilters)} options={filterOptions.sectors} />
            <FilterCheckGroup label="Category" selected={categoryFilters} onToggle={(v) => toggleInArray(v, categoryFilters, setCategoryFilters)} options={CATEGORY_BUCKETS.map((b) => b.label)} />
            <FilterCheckGroup label="Gender" selected={genderFilters} onToggle={(v) => toggleInArray(v, genderFilters, setGenderFilters)} options={filterOptions.genders} />
            <FilterCheckGroup label="Value Type" selected={valueTypeFilters} onToggle={(v) => toggleInArray(v, valueTypeFilters, setValueTypeFilters)} options={filterOptions.valueTypes} />
          </aside>

          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2.5">
              <div className="text-sm text-muted-foreground">
                Showing <strong className="text-foreground font-bold">{total.toLocaleString()}</strong> scholarships
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
            ) : rows.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-display text-xl mb-2">No scholarships found</h3>
                <p className="text-muted-foreground text-sm">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {rows.map((s, i) => (
                    <SchoolCard key={`${s.acara_id}-${s.row}-${i}`} school={s} index={i} onOpenDetail={setSelected} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm bg-card disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  <span className="text-sm text-muted-foreground">
                    Page <strong className="text-foreground">{page + 1}</strong> of {totalPages.toLocaleString()}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm bg-card disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <SchoolDetailModal school={selected} onClose={() => setSelected(null)} />
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
  noScroll = false,
}: {
  label: string;
  selected: string[];
  onToggle: (v: string) => void;
  options: string[];
  noScroll?: boolean;
}) => (
  <div className="mb-4">
    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
      {label}
      {selected.length > 0 && <span className="ml-1.5 text-primary normal-case">({selected.length})</span>}
    </div>
    <div className={`${noScroll ? "" : "max-h-44 overflow-y-auto"} pr-1 space-y-1 border border-border rounded-lg p-2 bg-card`}>
      {options.length === 0 && <div className="text-[11px] text-muted-foreground italic">Loading…</div>}
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
