interface FilterSidebarProps {
  filters: {
    states: string[];
    sectors: string[];
    genders: string[];
    yearLevels: string[];
    valueTypes: string[];
  };
  onToggleFilter: (group: string, value: string) => void;
  onClearAll: () => void;
}

const FILTER_GROUPS = [
  {
    key: "states",
    label: "State",
    options: [
      { value: "VIC", label: "Victoria", count: 18 },
      { value: "NSW", label: "New South Wales", count: 12 },
      { value: "QLD", label: "Queensland", count: 7 },
      { value: "WA", label: "Western Australia", count: 5 },
    ],
  },
  {
    key: "sectors",
    label: "School Sector",
    options: [
      { value: "Independent", label: "Independent", count: 24 },
      { value: "Catholic", label: "Catholic", count: 11 },
      { value: "Government", label: "Government", count: 7 },
    ],
  },
  {
    key: "genders",
    label: "School Type",
    options: [
      { value: "Co-ed", label: "Co-educational", count: 19 },
      { value: "Boys", label: "Boys", count: 9 },
      { value: "Girls", label: "Girls", count: 9 },
    ],
  },
  {
    key: "yearLevels",
    label: "Year Level Entry",
    options: [
      { value: "Year 5", label: "Year 5", count: 4 },
      { value: "Year 7", label: "Year 7", count: 18 },
      { value: "Year 9", label: "Year 9", count: 8 },
      { value: "Year 10", label: "Year 10", count: 10 },
    ],
  },
  {
    key: "valueTypes",
    label: "Value Type",
    options: [
      { value: "Full Fee", label: "Full Fee Remission", count: 5 },
      { value: "Partial", label: "Partial", count: 22 },
      { value: "Varies", label: "Varies", count: 8 },
    ],
  },
];

const FilterSidebar = ({ filters, onToggleFilter, onClearAll }: FilterSidebarProps) => (
  <aside className="glass rounded-2xl p-5 sticky top-20 hidden md:block">
    <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-muted-foreground mb-4 flex items-center justify-between">
      Filters
      <button onClick={onClearAll} className="bg-transparent border-none cursor-pointer text-accent text-xs font-semibold hover:text-accent/80 transition-colors">
        Clear all
      </button>
    </div>
    {FILTER_GROUPS.map((group, gi) => (
      <div key={group.key}>
        {gi > 0 && <div className="h-px bg-border/50 my-3.5" />}
        <div className="mb-3">
          <div className="text-xs font-semibold text-foreground mb-2 tracking-wide">{group.label}</div>
          {group.options.map((opt) => {
            const checked = (filters as any)[group.key]?.includes(opt.value);
            return (
              <div
                key={opt.value}
                className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-all ${
                  checked ? "bg-teal-light" : "hover:bg-secondary"
                }`}
                onClick={() => onToggleFilter(group.key, opt.value)}
              >
                <label className="flex items-center gap-2 text-[13px] text-muted-foreground cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleFilter(group.key, opt.value)}
                    className="w-[15px] h-[15px] accent-primary cursor-pointer rounded"
                  />
                  <span className={checked ? "text-foreground" : ""}>{opt.label}</span>
                </label>
                <span className="text-[11px] text-muted-foreground bg-secondary rounded-md px-1.5 py-px">{opt.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </aside>
);

export default FilterSidebar;
