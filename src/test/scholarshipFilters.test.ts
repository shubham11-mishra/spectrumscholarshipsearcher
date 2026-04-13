import { describe, expect, it } from "vitest";
import { matchesExactFilter, matchesInterestCategory, matchesSearch } from "@/lib/scholarshipFilters";

const baseSchool = {
  row: "1",
  acara_id: "abc",
  school_name: "St Michael's Grammar School",
  suburb: "St Kilda",
  postcode: "3182",
  state: "VIC",
  sector: "Independent",
  school_sector: "Independent",
  school_type: "Secondary",
  gender: "Co-ed",
  website_url: "",
  scholarship_url: "",
  scholarship_confidence: "high" as const,
  url_status: "",
  program_name: "Academic Excellence Scholarship",
  program_type: "",
  category: "Sports",
  sub_type: "",
  gender_eligibility: "",
  overview: "",
  description: "",
  eligibility_criteria: "",
  year_levels: "",
  application_open_date: "",
  application_close_date: "",
  closing_label: "",
  days_left: "",
  value_aud: "",
  value_num: "",
  value_type: "",
  number_awarded: "",
  test_provider: "",
  test_month: "",
  application_fee: "",
  special_conditions: "",
  contact_phone: "",
  contact_email: "",
  is_active: "",
  extraction_confidence_score: "",
  last_verified_at: "",
};

describe("scholarship filter helpers", () => {
  it("matches search text against school and suburb fields", () => {
    expect(matchesSearch(baseSchool, "st kilda")).toBe(true);
    expect(matchesSearch(baseSchool, "michael")).toBe(true);
    expect(matchesSearch(baseSchool, "brisbane")).toBe(false);
  });

  it("normalizes exact filter comparisons", () => {
    expect(matchesExactFilter(" VIC ", "vic")).toBe(true);
    expect(matchesExactFilter("Independent", "Catholic")).toBe(false);
  });

  it("maps saved interests to scholarship categories", () => {
    expect(matchesInterestCategory("Sports", ["Sport"])).toBe(true);
    expect(matchesInterestCategory("All-Rounder", ["General"])).toBe(true);
    expect(matchesInterestCategory("Academic", ["Music"])).toBe(false);
  });
});