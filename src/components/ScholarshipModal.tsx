import { X } from "lucide-react";
import { Scholarship, daysUntil, getCatBadgeVariant } from "@/data/scholarships";

interface ScholarshipModalProps {
  scholarship: Scholarship | null;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: (id: number) => void;
}

const badgeColors: Record<string, string> = {
  teal: "bg-teal-light text-primary",
  coral: "bg-coral-light text-coral",
  gold: "bg-gold-light text-gold",
  gray: "bg-secondary text-muted-foreground",
};

const accentGradients: Record<string, string> = {
  "": "from-primary to-accent",
  coral: "from-coral to-gold",
  gold: "from-gold to-accent",
};

const ScholarshipModal = ({ scholarship: s, isSaved, onClose, onToggleSave }: ScholarshipModalProps) => {
  if (!s) return null;

  const catVariant = getCatBadgeVariant(s.category);

  return (
    <div
      className="fixed inset-0 z-[200] bg-background/70 backdrop-blur-md flex items-center justify-center p-5 transition-opacity"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass rounded-2xl w-full max-w-[620px] max-h-[90vh] overflow-y-auto shadow-lg border border-border">
        <div className="p-6 pb-5 border-b border-border/50 relative">
          <div className={`h-1 rounded-t-2xl -mx-6 -mt-6 mb-5 bg-gradient-to-r ${accentGradients[s.accentClass]}`} />
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1">
              <div className="text-[12px] text-muted-foreground mb-1">{s.school} · {s.suburb}, {s.state}</div>
              <div className="font-display text-xl font-bold leading-tight mb-3">{s.name}</div>
              <div className="flex flex-wrap gap-1.5">
                <span className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-lg uppercase ${badgeColors[catVariant]}`}>{s.category}</span>
                <span className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-lg uppercase ${badgeColors.gray}`}>{s.sector}</span>
                <span className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-lg uppercase ${badgeColors.gray}`}>{s.gender}</span>
                {s.verified && <span className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-lg uppercase ${badgeColors.teal}`}>✓ AI Verified</span>}
              </div>
            </div>
            <button onClick={onClose} className="bg-secondary border border-border rounded-xl w-8 h-8 flex items-center justify-center cursor-pointer text-muted-foreground hover:border-foreground hover:text-foreground transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-secondary/60 rounded-xl p-3.5">
              <div className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider mb-1">Value</div>
              <div className="text-lg font-bold gradient-text">{s.value}</div>
            </div>
            <div className="bg-secondary/60 rounded-xl p-3.5">
              <div className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider mb-1">Closing Date</div>
              <div className="text-lg font-bold text-foreground">{s.closingLabel} 2026</div>
            </div>
            <div className="bg-secondary/60 rounded-xl p-3.5">
              <div className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider mb-1">Year Level</div>
              <div className="text-lg font-bold text-foreground">{s.yearLevel}</div>
            </div>
            <div className="bg-secondary/60 rounded-xl p-3.5">
              <div className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider mb-1">Test Provider</div>
              <div className="text-lg font-bold text-foreground">{s.testProvider}</div>
            </div>
          </div>
          <div className="text-[13px] font-semibold text-foreground mb-2 mt-4">About this Scholarship</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          <div className="text-[13px] font-semibold text-foreground mb-2 mt-4">Eligibility Requirements</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{s.elig}</p>
        </div>
        <div className="p-5 border-t border-border/50 flex gap-2.5 items-center">
          <button className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground border-none rounded-xl py-3 px-5 text-sm font-semibold cursor-pointer hover:opacity-90 transition-all text-center glow-primary">
            View on School Website →
          </button>
          <button
            onClick={() => onToggleSave(s.id)}
            className="bg-secondary text-muted-foreground border border-border rounded-xl py-3 px-4 text-sm font-medium cursor-pointer hover:border-gold hover:text-gold transition-all whitespace-nowrap"
          >
            {isSaved ? "★ Saved" : "☆ Shortlist"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipModal;
