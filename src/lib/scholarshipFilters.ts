import type { SchoolScholarship } from "@/data/csvScholarships";

const INTEREST_CATEGORY_ALIASES: Record<string, string[]> = {
  academic: ["academic"],
  music: ["music", "performing arts"],
  sport: ["sport", "sports"],
  general: ["general", "all rounder", "financial need", "leadership", "cultural"],
};

export const normalizeFilterValue = (value?: string | null) =>
  (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, " ");

export const matchesExactFilter = (value: string, activeFilter: string) => {
  if (activeFilter === "all") return true;
  return normalizeFilterValue(value) === normalizeFilterValue(activeFilter);
};

export const matchesSearch = (school: SchoolScholarship, query: string) => {
  const normalizedQuery = normalizeFilterValue(query);
  if (!normalizedQuery) return true;

  return [school.school_name, school.suburb, school.postcode, school.program_name, school.state]
    .some((field) => normalizeFilterValue(field).includes(normalizedQuery));
};

export const matchesInterestCategory = (category: string, interests: string[]) => {
  const normalizedCategory = normalizeFilterValue(category);
  if (!normalizedCategory) return false;

  return interests.some((interest) => {
    const normalizedInterest = normalizeFilterValue(interest);
    const aliases = INTEREST_CATEGORY_ALIASES[normalizedInterest] ?? [normalizedInterest];
    return aliases.includes(normalizedCategory);
  });
};