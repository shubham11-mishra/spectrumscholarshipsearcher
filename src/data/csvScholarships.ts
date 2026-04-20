import { supabase } from "@/integrations/supabase/client";

export interface SchoolScholarship {
  row: string;
  acara_id: string;
  school_name: string;
  suburb: string;
  postcode: string;
  state: string;
  sector: string;
  school_sector: string;
  school_type: string;
  gender: string;
  website_url: string;
  scholarship_url: string;
  scholarship_confidence: "high" | "medium" | "low" | "not_found";
  url_status: string;
  program_name: string;
  program_type: string;
  category: string;
  sub_type: string;
  gender_eligibility: string;
  overview: string;
  description: string;
  eligibility_criteria: string;
  year_levels: string;
  application_open_date: string;
  application_close_date: string;
  closing_label: string;
  days_left: string;
  value_aud: string;
  value_num: string;
  value_type: string;
  number_awarded: string;
  test_provider: string;
  test_month: string;
  application_fee: string;
  special_conditions: string;
  contact_phone: string;
  contact_email: string;
  is_active: string;
  extraction_confidence_score: string;
  last_verified_at: string;
}

function mapRow(obj: any): SchoolScholarship {
  return {
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
  };
}

export interface ScholarshipQuery {
  search?: string;
  confidence?: "all" | "high" | "medium" | "low";
  states?: string[];
  sectors?: string[];
  categories?: string[];
  genders?: string[];
  valueTypes?: string[];
  interestCategories?: string[]; // ORs across these (uses category aliases handled client-side via expansion before passing in)
  sortBy?: "name" | "suburb" | "confidence" | "value";
  page?: number;
  pageSize?: number;
}

export interface ScholarshipPage {
  rows: SchoolScholarship[];
  total: number;
}

function applyFilters(query: any, q: ScholarshipQuery) {
  // Always exclude not_found unless explicitly asked
  if (q.confidence && q.confidence !== "all") {
    query = query.eq("scholarship_confidence", q.confidence);
  } else {
    query = query.neq("scholarship_confidence", "not_found");
  }
  if (q.states?.length) query = query.in("state", q.states);
  if (q.sectors?.length) query = query.in("school_sector", q.sectors);
  if (q.categories?.length) query = query.in("category", q.categories);
  if (q.genders?.length) query = query.in("gender", q.genders);
  if (q.valueTypes?.length) query = query.in("value_type", q.valueTypes);
  if (q.interestCategories?.length) query = query.in("category", q.interestCategories);
  if (q.search?.trim()) {
    const s = q.search.trim().replace(/[%,]/g, " ");
    const pattern = `%${s}%`;
    query = query.or(
      `school_name.ilike.${pattern},suburb.ilike.${pattern},postcode.ilike.${pattern},program_name.ilike.${pattern},state.ilike.${pattern}`
    );
  }
  return query;
}

export async function fetchScholarshipsPage(q: ScholarshipQuery): Promise<ScholarshipPage> {
  const page = q.page ?? 0;
  const pageSize = q.pageSize ?? 50;
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let req = supabase.from("scholarships").select("*", { count: "exact" });
  req = applyFilters(req, q);

  switch (q.sortBy ?? "name") {
    case "name":
      req = req.order("school_name", { ascending: true });
      break;
    case "suburb":
      req = req.order("suburb", { ascending: true, nullsFirst: false });
      break;
    case "confidence":
      // high < medium < low alphabetically isn't right; use a CASE via order on enum text fallback
      req = req.order("scholarship_confidence", { ascending: true });
      break;
    case "value":
      req = req.order("value_num", { ascending: false, nullsFirst: false });
      break;
  }

  const { data, count, error } = await req.range(from, to);
  if (error) {
    console.error("fetchScholarshipsPage error:", error);
    return { rows: [], total: 0 };
  }
  return {
    rows: (data ?? []).map(mapRow),
    total: count ?? 0,
  };
}

export async function fetchFilterOptions(): Promise<{
  states: string[];
  sectors: string[];
  categories: string[];
  genders: string[];
  valueTypes: string[];
}> {
  const sets = {
    states: new Set<string>(),
    sectors: new Set<string>(),
    categories: new Set<string>(),
    genders: new Set<string>(),
    valueTypes: new Set<string>(),
  };

  let from = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from("scholarships")
      .select("state, school_sector, category, gender, value_type")
      .neq("scholarship_confidence", "not_found")
      .range(from, from + pageSize - 1);

    if (error || !data) {
      console.error("fetchFilterOptions error:", error);
      break;
    }

    data.forEach((r: any) => {
      if (r.state?.trim()) sets.states.add(r.state.trim());
      if (r.school_sector?.trim()) sets.sectors.add(r.school_sector.trim());
      if (r.category?.trim()) sets.categories.add(r.category.trim());
      if (r.gender?.trim()) sets.genders.add(r.gender.trim());
      if (r.value_type?.trim()) sets.valueTypes.add(r.value_type.trim());
    });

    if (data.length < pageSize) break;
    from += pageSize;
  }

  return {
    states: [...sets.states].sort(),
    sectors: [...sets.sectors].sort(),
    categories: [...sets.categories].sort(),
    genders: [...sets.genders].sort(),
    valueTypes: [...sets.valueTypes].sort(),
  };
}

export async function fetchConfidenceCounts(): Promise<{ all: number; high: number; medium: number; low: number }> {
  const base = () => supabase.from("scholarships").select("*", { count: "exact", head: true }).neq("scholarship_confidence", "not_found");
  const [all, high, medium, low] = await Promise.all([
    base(),
    base().eq("scholarship_confidence", "high"),
    base().eq("scholarship_confidence", "medium"),
    base().eq("scholarship_confidence", "low"),
  ]);
  return {
    all: all.count ?? 0,
    high: high.count ?? 0,
    medium: medium.count ?? 0,
    low: low.count ?? 0,
  };
}

// Kept for Shortlist page — loads only the user's shortlisted ids
export async function fetchScholarshipsByIds(ids: string[]): Promise<SchoolScholarship[]> {
  if (ids.length === 0) return [];
  // ids look like "{acara_id}-{row_number}". We'll fetch by acara_id list and filter in JS.
  const acaraIds = Array.from(new Set(ids.map((i) => i.split("-")[0]).filter(Boolean)));
  const { data, error } = await supabase
    .from("scholarships")
    .select("*")
    .in("acara_id", acaraIds);
  if (error || !data) {
    console.error("fetchScholarshipsByIds error:", error);
    return [];
  }
  const wanted = new Set(ids);
  return data
    .map(mapRow)
    .filter((s) => wanted.has(`${s.acara_id}-${s.row}`));
}

export async function loadScholarshipsFromCSV(): Promise<SchoolScholarship[]> {
  // Legacy full-load (used as fallback). Avoid using on the homepage.
  let allData: any[] = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase.from("scholarships").select("*").range(from, from + pageSize - 1);
    if (error) { console.error(error); break; }
    if (!data || data.length === 0) break;
    allData = allData.concat(data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return allData.map(mapRow);
}

export function getConfidenceBadge(c: SchoolScholarship["scholarship_confidence"]): { label: string; color: string } {
  switch (c) {
    case "high": return { label: "High Confidence", color: "bg-accent/20 text-accent" };
    case "medium": return { label: "Medium", color: "bg-gold/20 text-gold" };
    case "low": return { label: "Low", color: "bg-muted text-muted-foreground" };
    default: return { label: "Not Found", color: "bg-destructive/20 text-destructive" };
  }
}

export function getCategoryColor(cat: string): string {
  switch (cat.toLowerCase()) {
    case "academic": return "bg-primary/20 text-primary";
    case "music": return "bg-accent/20 text-accent";
    case "sport": return "bg-gold/20 text-gold";
    case "general": return "bg-secondary text-muted-foreground";
    default: return "bg-secondary text-muted-foreground";
  }
}
