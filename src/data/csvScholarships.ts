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

export async function loadScholarshipsFromCSV(): Promise<SchoolScholarship[]> {
  const res = await fetch("/data/scholarships.csv");
  const text = await res.text();
  const lines = text.trim().split("\n");
  const headers = parseCSVLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = values[i] || ""));
    return {
      row: obj.row,
      acara_id: obj.acara_id,
      school_name: obj.school_name,
      suburb: obj.suburb,
      postcode: obj.postcode,
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
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        result.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
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
