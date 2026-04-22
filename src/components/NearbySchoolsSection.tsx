import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SchoolScholarship } from "@/data/csvScholarships";
import SchoolCard from "@/components/SchoolCard";
import SchoolDetailModal from "@/components/SchoolDetailModal";
import { MapPin, Sparkles, ChevronDown } from "lucide-react";

const NEARBY_LIMIT = 6;

/** Map a DB row into the SchoolScholarship shape used by SchoolCard. */
const mapRow = (obj: any): SchoolScholarship => ({
  row: String(obj.row_number || ""),
  acara_id: obj.acara_id || "",
  school_name: obj.school_name || "",
  suburb: obj.suburb || "",
  postcode: obj.postcode || "",
  state: obj.state || "",
  sector: obj.sector || "",
  school_sector: obj.school_sector || "",
  school_type: obj.school_type || "",
  gender: obj.gender || "",
  website_url: obj.website_url && obj.website_url !== "not_found" ? obj.website_url : "",
  scholarship_url: obj.scholarship_url || "",
  scholarship_confidence: (obj.scholarship_confidence || "not_found") as SchoolScholarship["scholarship_confidence"],
  url_status: obj.url_status || "",
  program_name: obj.program_name || "",
  program_type: obj.program_type || "",
  category: obj.category || "",
  sub_type: obj.sub_type || "",
  gender_eligibility: obj.gender_eligibility || "",
  overview: obj.overview || "",
  description: obj.description || "",
  eligibility_criteria: obj.eligibility_criteria || "",
  year_levels: obj.year_levels || "",
  application_open_date: obj.application_open_date || "",
  application_close_date: obj.application_close_date || "",
  closing_label: obj.closing_label || "",
  days_left: obj.days_left || "",
  value_aud: obj.value_aud || "",
  value_num: obj.value_num || "",
  value_type: obj.value_type || "",
  number_awarded: obj.number_awarded || "",
  test_provider: obj.test_provider || "",
  test_month: obj.test_month || "",
  application_fee: obj.application_fee || "",
  special_conditions: obj.special_conditions || "",
  contact_phone: obj.contact_phone || "",
  contact_email: obj.contact_email || "",
  is_active: obj.is_active || "",
  extraction_confidence_score: obj.extraction_confidence_score || "",
  last_verified_at: obj.last_verified_at || "",
});

/**
 * "Schools near you" rail — surfaces scholarships at schools in the user's state,
 * ranked by postcode proximity (closest numeric postcode first).
 */
const NearbySchoolsSection = () => {
  const { user, location } = useAuth();
  const [rows, setRows] = useState<SchoolScholarship[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SchoolScholarship | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user || !location.state || !location.postcode) {
      setRows([]);
      return;
    }
    let cancelled = false;
    setLoading(true);

    // Pull a generous candidate set from the user's state, then rank by
    // numeric postcode distance client-side (cheap & avoids extra indexes).
    supabase
      .from("scholarships")
      .select("*")
      .eq("state", location.state)
      .in("scholarship_confidence", ["high", "medium"])
      .limit(500)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("Error loading nearby schools:", error);
          setRows([]);
          setLoading(false);
          return;
        }
        const userPc = parseInt(location.postcode || "0", 10);
        const ranked = (data || [])
          .map(mapRow)
          .filter((r) => r.postcode && /^\d+$/.test(r.postcode))
          .map((r) => ({ r, dist: Math.abs(parseInt(r.postcode, 10) - userPc) }))
          .sort((a, b) => a.dist - b.dist);

        // Dedupe by school so we don't show the same school many times.
        const seen = new Set<string>();
        const unique: SchoolScholarship[] = [];
        for (const { r } of ranked) {
          const key = r.acara_id || r.school_name;
          if (seen.has(key)) continue;
          seen.add(key);
          unique.push(r);
          if (unique.length >= NEARBY_LIMIT) break;
        }
        setRows(unique);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, location.state, location.postcode]);

  if (!user || !location.state || !location.postcode) return null;

  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-8 pt-2 pb-6 animate-fade-up">
      <div className="glass rounded-2xl p-4 md:p-5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="nearby-schools-panel"
          className={`w-full flex items-center justify-between gap-3 flex-wrap text-left rounded-xl transition-colors hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${open ? "mb-4" : ""}`}
        >
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground leading-tight">
                Schools near you
              </h2>
              <p className="text-xs text-muted-foreground">
                Closest to{" "}
                <span className="text-foreground font-semibold">
                  {location.suburb ? `${location.suburb}, ` : ""}
                  {location.state} {location.postcode}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-primary font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Personalized
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        {open && (
        <div id="nearby-schools-panel">
        {loading ? (
          <div className="text-sm text-muted-foreground py-6 text-center">
            Finding nearby schools…
          </div>
        ) : rows.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6 text-center">
            No nearby scholarships found yet — try the full list below.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {rows.map((s, i) => (
              <SchoolCard
                key={`nearby-${s.acara_id}-${s.row}-${i}`}
                school={s}
                index={i}
                onOpenDetail={setSelected}
              />
            ))}
          </div>
        )}
        </div>
        )}
      </div>
      <SchoolDetailModal school={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

export default NearbySchoolsSection;