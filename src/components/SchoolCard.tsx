import { ExternalLink, MapPin, School, ShieldCheck, GraduationCap, Calendar, DollarSign, Clock, Heart } from "lucide-react";
import { SchoolScholarship, getConfidenceBadge, getCategoryColor } from "@/data/csvScholarships";
import { useShortlist } from "@/hooks/useShortlist";

interface SchoolCardProps {
  school: SchoolScholarship;
  index: number;
  onOpenDetail?: (s: SchoolScholarship) => void;
}

const SchoolCard = ({ school, index, onOpenDetail }: SchoolCardProps) => {
  const badge = getConfidenceBadge(school.scholarship_confidence);
  const catColor = getCategoryColor(school.category);
  const hasLink = !!(school.scholarship_url || school.website_url);
  const closingSoon = school.days_left && parseInt(school.days_left) > 0 && parseInt(school.days_left) <= 30;
  const cardId = `${school.acara_id}-${school.row}`;
  const { toggle, isShortlisted } = useShortlist();
  const liked = isShortlisted(cardId);

  return (
    <div
      className="card-shine glass rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:glow-primary relative animate-fade-up group flex flex-col cursor-pointer"
      style={{ animationDelay: `${index * 0.03}s` }}
      onClick={() => onOpenDetail?.(school)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenDetail?.(school); } }}
    >
      <div className="h-0.5 bg-gradient-to-r from-primary to-accent" />
      <div className="p-4 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-foreground leading-tight mb-0.5 truncate">
              {school.school_name}
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <MapPin className="w-[10px] h-[10px] shrink-0" />
              <span className="truncate">{school.suburb}, {school.state} {school.postcode}</span>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); toggle(cardId); }}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 cursor-pointer transition-all bg-transparent ${
              liked ? "border-primary/50 bg-primary/10" : "border-border bg-secondary hover:border-primary/30"
            }`}
            title={liked ? "Remove from shortlist" : "Add to shortlist"}
          >
            <Heart className={`w-4 h-4 transition-all ${liked ? "text-primary fill-primary" : "text-muted-foreground"}`} />
          </button>
        </div>

        {/* Program name */}
        {school.program_name && (
          <div className="flex items-center gap-1.5 mb-2">
            <GraduationCap className="w-3 h-3 text-primary shrink-0" />
            <span className="text-[12px] font-medium text-foreground truncate">{school.program_name}</span>
          </div>
        )}

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-lg uppercase bg-secondary text-muted-foreground">
            {school.sector}
          </span>
          {school.category && (
            <span className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-lg uppercase ${catColor}`}>
              {school.category}
            </span>
          )}
          <span className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-lg uppercase flex items-center gap-1 ${badge.color}`}>
            <ShieldCheck className="w-[10px] h-[10px]" />
            {badge.label}
          </span>
          {school.gender && school.gender !== "Co-ed" && (
            <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-lg uppercase bg-secondary text-muted-foreground">
              {school.gender}
            </span>
          )}
        </div>

        {/* Info row: value + year levels */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2 text-[11px] text-muted-foreground">
          {school.value_type && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-gold" />
              <span className="text-foreground font-medium">{school.value_type}</span>
              {school.value_aud && <span className="text-[10px]">({school.value_aud})</span>}
            </div>
          )}
          {school.year_levels && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-accent" />
              <span className="truncate max-w-[140px]">{school.year_levels}</span>
            </div>
          )}
        </div>

        {/* Closing soon badge */}
        {closingSoon && (
          <div className="flex items-center gap-1 mb-2">
            <Clock className="w-3 h-3 text-destructive" />
            <span className="text-[11px] font-semibold text-destructive">
              Closing in {school.days_left} days
            </span>
          </div>
        )}

        {/* Overview */}
        {school.overview && (
          <p className="text-[12px] text-muted-foreground leading-relaxed mb-3 line-clamp-2 flex-1">
            {school.overview}
          </p>
        )}

        {/* Test provider */}
        {school.test_provider && (
          <div className="text-[10px] text-muted-foreground mb-2">
            Test: <span className="text-foreground font-medium">{school.test_provider}</span>
            {school.test_month && <> · {school.test_month}</>}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-border/50 mt-auto">
          {school.scholarship_url && (
            <a
              href={school.scholarship_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-primary to-accent text-primary-foreground border-none rounded-xl px-3.5 py-2 text-xs font-semibold cursor-pointer hover:opacity-90 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              Scholarship Page <ExternalLink className="w-[11px] h-[11px]" />
            </a>
          )}
          {school.website_url && (
            <a
              href={school.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-1.5 bg-secondary text-muted-foreground border border-border rounded-xl px-3.5 py-2 text-xs font-medium cursor-pointer hover:border-primary hover:text-foreground transition-all ${
                !school.scholarship_url ? "flex-1" : ""
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              School Site <ExternalLink className="w-[11px] h-[11px]" />
            </a>
          )}
          {!hasLink && (
            <div className="flex-1 text-center text-[11px] text-muted-foreground py-2">
              No links available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolCard;
