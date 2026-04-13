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

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export async function loadScholarshipsFromCSV(): Promise<SchoolScholarship[]> {
  try {
    const response = await fetch("/data/scholarships.csv");
    if (!response.ok) throw new Error("Failed to load CSV");
    const text = await response.text();
    const lines = text.split("\n").filter((l) => l.trim().length > 0);

    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]);

    const CSV_TO_FIELD: Record<string, keyof SchoolScholarship> = {
      row: "row",
      acara_id: "acara_id",
      school_name: "school_name",
      suburb: "suburb",
      postcode: "postcode",
      state: "state",
      sector: "sector",
      school_sector: "school_sector",
      school_type: "school_type",
      gender: "gender",
      website_url: "website_url",
      scholarship_url: "scholarship_url",
      scholarship_confidence: "scholarship_confidence",
      url_status: "url_status",
      program_name: "program_name",
      program_type: "program_type",
      category: "category",
      sub_type: "sub_type",
      gender_eligibility: "gender_eligibility",
      overview: "overview",
      description: "description",
      eligibility_criteria: "eligibility_criteria",
      year_levels: "year_levels",
      application_open_date: "application_open_date",
      application_close_date: "application_close_date",
      closing_label: "closing_label",
      days_left: "days_left",
      value_aud: "value_aud",
      value_num: "value_num",
      value_type: "value_type",
      number_awarded: "number_awarded",
      test_provider: "test_provider",
      test_month: "test_month",
      application_fee: "application_fee",
      special_conditions: "special_conditions",
      contact_phone: "contact_phone",
      contact_email: "contact_email",
      is_active: "is_active",
      extraction_confidence_score: "extraction_confidence_score",
      last_verified_at: "last_verified_at",
    };

    // Build index map from header positions to field names
    const indexMap: { index: number; field: keyof SchoolScholarship }[] = [];
    headers.forEach((h, i) => {
      const field = CSV_TO_FIELD[h];
      if (field) indexMap.push({ index: i, field });
    });

    const scholarships: SchoolScholarship[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const obj: any = {
        row: "", acara_id: "", school_name: "", suburb: "", postcode: "", state: "",
        sector: "", school_sector: "", school_type: "", gender: "", website_url: "",
        scholarship_url: "", scholarship_confidence: "not_found", url_status: "",
        program_name: "", program_type: "", category: "", sub_type: "",
        gender_eligibility: "", overview: "", description: "", eligibility_criteria: "",
        year_levels: "", application_open_date: "", application_close_date: "",
        closing_label: "", days_left: "", value_aud: "", value_num: "", value_type: "",
        number_awarded: "", test_provider: "", test_month: "", application_fee: "",
        special_conditions: "", contact_phone: "", contact_email: "", is_active: "",
        extraction_confidence_score: "", last_verified_at: "",
      };

      for (const { index, field } of indexMap) {
        if (index < values.length) {
          const val = values[index];
          if (field === "website_url" && val === "not_found") {
            obj[field] = "";
          } else {
            obj[field] = val;
          }
        }
      }

      if (obj.school_name) {
        scholarships.push(obj as SchoolScholarship);
      }
    }

    console.log(`Loaded ${scholarships.length} scholarships from CSV`);
    return scholarships;
  } catch (err) {
    console.error("Error loading scholarships from CSV:", err);
    return [];
  }
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
