import { X, ExternalLink, MapPin, GraduationCap, ShieldCheck, DollarSign, Calendar, Clock, Mail, Phone, Award, FileText } from "lucide-react";
import { SchoolScholarship, getConfidenceBadge, getCategoryColor } from "@/data/csvScholarships";
import { useShortlist } from "@/hooks/useShortlist";
import { useEffect } from "react";

interface SchoolDetailModalProps {
  school: SchoolScholarship | null;
  onClose: () => void;
}

const SchoolDetailModal = ({ school, onClose }: SchoolDetailModalProps) => {
  const { toggle, isShortlisted } = useShortlist();

  useEffect(() => {
    if (!school) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [school, onClose]);

  if (!school) return null;

  const cardId = `${school.acara_id}-${school.row}`;
  const liked = isShortlisted(cardId);
  const badge = getConfidenceBadge(school.scholarship_confidence);
  const catColor = getCategoryColor(school.category);

  return (
    <div
      className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-md flex items-start md:items-center justify-center p-3 md:p-6 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass rounded-2xl w-full max-w-[760px] my-4 md:my-0 max-h-[92vh] flex flex-col shadow-2xl border border-border overflow-hidden">
        {/* Sticky header */}
        <div className="p-5 md:p-6 border-b border-border/60 relative shrink-0">
          <div className="h-1 rounded-full bg-gradient-to-r from-primary via-accent to-gold -mx-5 md:-mx-6 -mt-5 md:-mt-6 mb-4" />
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-muted-foreground mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {school.suburb}, {school.state} {school.postcode} · {school.sector}
              </div>
              <h2 className="font-display text-xl md:text-2xl font-bold leading-tight mb-2 text-foreground">
                {school.school_name}
              </h2>
              {school.program_name && (
                <div className="flex items-center gap-1.5 text-sm text-foreground">
                  <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-medium">{school.program_name}</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="bg-secondary border border-border rounded-xl w-9 h-9 flex items-center justify-center cursor-pointer text-muted-foreground hover:border-foreground hover:text-foreground transition-all shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {school.category && (
              <span className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-lg uppercase ${catColor}`}>
                {school.category}
              </span>
            )}
            {school.sub_type && (
              <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-lg uppercase bg-secondary text-muted-foreground">
                {school.sub_type}
              </span>
            )}
            <span className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-lg uppercase flex items-center gap-1 ${badge.color}`}>
              <ShieldCheck className="w-[10px] h-[10px]" />
              {badge.label}
            </span>
            {school.gender && (
              <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-lg uppercase bg-secondary text-muted-foreground">
                {school.gender}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-5 md:p-6 space-y-5">
          {/* Quick stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <Stat icon={<DollarSign className="w-3.5 h-3.5 text-gold" />} label="Value" value={school.value_type || "—"} sub={school.value_aud} />
            <Stat icon={<Calendar className="w-3.5 h-3.5 text-accent" />} label="Year Levels" value={school.year_levels || "—"} />
            <Stat icon={<Clock className="w-3.5 h-3.5 text-coral" />} label="Closes" value={school.closing_label || school.application_close_date || "—"} sub={school.days_left ? `${school.days_left} days left` : undefined} />
            <Stat icon={<Award className="w-3.5 h-3.5 text-primary" />} label="Test" value={school.test_provider || "—"} sub={school.test_month} />
          </div>

          {/* Overview */}
          {school.overview && (
            <Section title="Overview" icon={<FileText className="w-3.5 h-3.5" />}>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{school.overview}</p>
            </Section>
          )}

          {/* Description */}
          {school.description && school.description !== school.overview && (
            <Section title="About this Scholarship" icon={<FileText className="w-3.5 h-3.5" />}>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{school.description}</p>
            </Section>
          )}

          {/* Eligibility */}
          {school.eligibility_criteria && (
            <Section title="Eligibility Requirements" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{school.eligibility_criteria}</p>
            </Section>
          )}

          {/* Extra details */}
          {(school.application_open_date || school.application_close_date || school.number_awarded || school.application_fee || school.special_conditions) && (
            <Section title="Application Details" icon={<Calendar className="w-3.5 h-3.5" />}>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2 text-sm">
                {school.application_open_date && <DetailRow label="Opens" value={school.application_open_date} />}
                {school.application_close_date && <DetailRow label="Closes" value={school.application_close_date} />}
                {school.number_awarded && <DetailRow label="Number Awarded" value={school.number_awarded} />}
                {school.application_fee && <DetailRow label="Application Fee" value={school.application_fee} />}
                {school.special_conditions && (
                  <div className="md:col-span-2">
                    <DetailRow label="Special Conditions" value={school.special_conditions} />
                  </div>
                )}
              </dl>
            </Section>
          )}

          {/* Contact */}
          {(school.contact_email || school.contact_phone) && (
            <Section title="Contact" icon={<Mail className="w-3.5 h-3.5" />}>
              <div className="flex flex-wrap gap-3 text-sm">
                {school.contact_email && (
                  <a href={`mailto:${school.contact_email}`} className="flex items-center gap-1.5 text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                    <Mail className="w-3.5 h-3.5" /> {school.contact_email}
                  </a>
                )}
                {school.contact_phone && (
                  <a href={`tel:${school.contact_phone}`} className="flex items-center gap-1.5 text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                    <Phone className="w-3.5 h-3.5" /> {school.contact_phone}
                  </a>
                )}
              </div>
            </Section>
          )}

          {school.last_verified_at && (
            <div className="text-[11px] text-muted-foreground italic">
              Last verified: {school.last_verified_at}
            </div>
          )}
        </div>

        {/* Sticky footer actions */}
        <div className="p-4 md:p-5 border-t border-border/60 flex flex-wrap gap-2 items-center shrink-0 bg-card/40">
          {school.scholarship_url && (
            <a
              href={school.scholarship_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[180px] flex items-center justify-center gap-1.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-all glow-primary"
            >
              Scholarship Page <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {school.website_url && (
            <a
              href={school.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-secondary text-foreground border border-border rounded-xl px-4 py-2.5 text-sm font-medium hover:border-primary transition-all"
            >
              School Site <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={() => toggle(cardId)}
            className={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium border transition-all ${
              liked ? "bg-primary/10 border-primary/40 text-primary" : "bg-secondary border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {liked ? "★ Shortlisted" : "☆ Shortlist"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) => (
  <div className="bg-secondary/60 rounded-xl p-3 border border-border/50">
    <div className="flex items-center gap-1 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider mb-1">
      {icon} {label}
    </div>
    <div className="text-sm font-bold text-foreground leading-tight truncate">{value}</div>
    {sub && <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{sub}</div>}
  </div>
);

const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
      {icon} {title}
    </div>
    {children}
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">{label}</dt>
    <dd className="text-sm text-foreground/90">{value}</dd>
  </div>
);

export default SchoolDetailModal;
