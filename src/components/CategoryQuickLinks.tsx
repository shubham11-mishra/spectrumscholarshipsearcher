import { GraduationCap, Palette, Trophy, Globe, HandCoins, FlaskConical, School } from "lucide-react";

const QUICK_LINKS: {
  label: string;
  Icon: typeof GraduationCap;
  gradient: string;
}[] = [
  { label: "Academic",        Icon: GraduationCap, gradient: "from-primary/30 to-primary/5" },
  { label: "Arts",            Icon: Palette,       gradient: "from-accent/30 to-accent/5" },
  { label: "Sports",          Icon: Trophy,        gradient: "from-gold/30 to-gold/5" },
  { label: "Cultural",        Icon: Globe,         gradient: "from-fuchsia-500/30 to-fuchsia-500/5" },
  { label: "Financial Need",  Icon: HandCoins,     gradient: "from-emerald-500/30 to-emerald-500/5" },
  { label: "STEM",            Icon: FlaskConical,  gradient: "from-sky-500/30 to-sky-500/5" },
  { label: "School-Specific", Icon: School,        gradient: "from-violet-500/30 to-violet-500/5" },
];

interface Props {
  active: string[];
  counts: Record<string, number>;
  onSelect: (label: string) => void;
}

const CategoryQuickLinks = ({ active, counts, onSelect }: Props) => (
  <section className="max-w-[1280px] mx-auto px-4 md:px-8 pt-2 pb-8 animate-fade-up" style={{ animationDelay: "0.05s" }}>
    <div className="flex items-baseline justify-between mb-4">
      <h2 className="text-base md:text-lg font-bold text-foreground tracking-tight">
        Browse by Category
      </h2>
      <span className="text-[11px] font-medium text-muted-foreground">Click a tile to filter</span>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {QUICK_LINKS.map(({ label, Icon, gradient }) => {
        const isActive = active.includes(label);
        return (
          <button
            key={label}
            onClick={() => onSelect(label)}
            className={`group relative overflow-hidden rounded-xl p-3.5 text-left transition-all border-2 shadow-sm hover:shadow-md ${
              isActive
                ? "border-primary glow-primary"
                : "border-border hover:border-primary/50 hover:-translate-y-0.5"
            } glass`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 pointer-events-none`} />
            <div className="relative flex flex-col gap-2">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                isActive ? "bg-primary/25 text-primary" : "bg-background/40 text-foreground"
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-[13px] font-semibold text-foreground leading-tight">{label}</div>
              <div className="text-[11px] text-muted-foreground">
                {counts[label] ?? 0} scholarships
              </div>
            </div>
          </button>
        );
      })}
    </div>
  </section>
);

export default CategoryQuickLinks;