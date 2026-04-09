import { CATEGORIES, SCHOLARSHIPS } from "@/data/scholarships";

interface CategoryChipsProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

const CategoryChips = ({ activeCategory, onCategoryChange }: CategoryChipsProps) => {
  const getCounts = (cat: string) =>
    cat === "All" ? SCHOLARSHIPS.length : SCHOLARSHIPS.filter((s) => s.category === cat).length;

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-8 pb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
      <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted-foreground mb-3">
        Browse by Category
      </div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.label}
            onClick={() => onCategoryChange(c.label)}
            className={`flex items-center gap-1.5 border rounded-xl px-3.5 py-2 text-[13px] font-medium cursor-pointer transition-all select-none ${
              activeCategory === c.label
                ? "border-primary/50 text-primary bg-teal-light glow-primary"
                : "glass text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            <span className="text-sm">{c.icon}</span>
            {c.label}
            <span
              className={`rounded-md px-1.5 py-px text-[11px] font-semibold ${
                activeCategory === c.label
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {getCounts(c.label)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryChips;
