import postcodes from "@/data/auPostcodes.json";

const PC_MAP = postcodes as Record<string, [number, number]>;

// State capital fallbacks for any postcode missing from the lookup.
const STATE_FALLBACK: Record<string, [number, number]> = {
  NSW: [-33.8688, 151.2093],
  VIC: [-37.8136, 144.9631],
  QLD: [-27.4698, 153.0251],
  WA: [-31.9523, 115.8613],
  SA: [-34.9285, 138.6007],
  TAS: [-42.8821, 147.3272],
  ACT: [-35.2809, 149.1300],
  NT: [-12.4634, 130.8456],
};

/** Resolve a school's approximate (lat, lng) from postcode/state. */
export function locateSchool(postcode?: string, state?: string): [number, number] | null {
  const pc = (postcode ?? "").trim().padStart(4, "0");
  if (pc && PC_MAP[pc]) return PC_MAP[pc];
  const st = (state ?? "").trim().toUpperCase();
  if (st && STATE_FALLBACK[st]) return STATE_FALLBACK[st];
  return null;
}

/**
 * Spread overlapping markers in a tiny circle so multiple schools that share a
 * postcode don't render on top of each other before clustering kicks in.
 */
export function jitter([lat, lng]: [number, number], seed: number): [number, number] {
  const angle = (seed * 137.5) * (Math.PI / 180);
  const radius = 0.003 + (seed % 7) * 0.0008; // ~300m
  return [lat + Math.cos(angle) * radius, lng + Math.sin(angle) * radius];
}