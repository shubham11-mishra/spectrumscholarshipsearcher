// Edge function: import-scholarships
// Fetches all 8 state CSVs from the deployed app, wipes the scholarships table,
// and bulk-inserts every row using the service role (bypasses RLS + 1000-row limit).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const STATE_FILES = [
  "scholarships_ACT.csv",
  "scholarships_NT.csv",
  "scholarships_TAS.csv",
  "scholarships_SA.csv",
  "scholarships_WA.csv",
  "scholarships_QLD.csv",
  "scholarships_VIC.csv",
  "scholarships_NSW.csv",
];

// Columns that exist in the DB scholarships table (others are skipped)
const DB_COLUMNS = new Set([
  "row_number", "acara_id", "school_name", "suburb", "postcode", "state",
  "sector", "school_sector", "school_type", "gender", "website_url",
  "scholarship_url", "scholarship_confidence", "url_status", "program_name",
  "program_type", "category", "sub_type", "gender_eligibility", "overview",
  "description", "eligibility_criteria", "year_levels", "application_open_date",
  "application_close_date", "closing_label", "days_left", "value_aud",
  "value_num", "value_type", "number_awarded", "test_provider", "test_month",
  "application_fee", "special_conditions", "contact_phone", "contact_email",
  "is_active", "extraction_confidence_score", "last_verified_at",
]);

// Map CSV header → DB column. CSV uses "row" but DB uses "row_number".
function mapCsvHeader(h: string): string {
  if (h === "row") return "row_number";
  return h;
}

// Robust CSV parser: handles quoted fields with commas and escaped quotes.
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else { field += c; }
    } else {
      if (c === '"') { inQuotes = true; }
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (c === "\r") { /* skip */ }
      else { field += c; }
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows.filter(r => r.length > 1);
}

function csvToRecords(csvText: string): Record<string, any>[] {
  const parsed = parseCSV(csvText);
  if (parsed.length < 2) return [];
  const headers = parsed[0].map(mapCsvHeader);
  const records: Record<string, any>[] = [];
  for (let i = 1; i < parsed.length; i++) {
    const row = parsed[i];
    const rec: Record<string, any> = {};
    let hasSchool = false;
    for (let j = 0; j < headers.length; j++) {
      const col = headers[j];
      if (!DB_COLUMNS.has(col)) continue;
      const raw = row[j] ?? "";
      const val = raw.trim();
      if (col === "row_number") {
        const n = parseInt(val, 10);
        rec[col] = isNaN(n) ? null : n;
      } else {
        rec[col] = val === "" ? null : val;
      }
      if (col === "school_name" && val !== "") hasSchool = true;
    }
    if (hasSchool) records.push(rec);
  }
  return records;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Determine origin to fetch CSVs from public/data/
    const body = await req.json().catch(() => ({}));
    const baseUrl: string = body.baseUrl || "https://spectrumscholarshipsearcher.lovable.app";

    console.log(`Importing CSVs from ${baseUrl}/data/`);

    // 1. Fetch + parse all CSVs
    const allRecords: Record<string, any>[] = [];
    const perFileCounts: Record<string, number> = {};
    for (const file of STATE_FILES) {
      const url = `${baseUrl}/data/${file}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`Failed to fetch ${url}: ${res.status}`);
        continue;
      }
      const text = await res.text();
      const records = csvToRecords(text);
      perFileCounts[file] = records.length;
      allRecords.push(...records);
      console.log(`Parsed ${records.length} rows from ${file}`);
    }

    if (allRecords.length === 0) {
      return new Response(
        JSON.stringify({ error: "No records parsed from any CSV", perFileCounts }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Wipe existing rows (service role bypasses RLS)
    console.log("Wiping scholarships table...");
    const { error: delErr } = await supabase
      .from("scholarships")
      .delete()
      .gte("created_at", "1900-01-01"); // matches all rows
    if (delErr) {
      console.error("Delete failed:", delErr);
      return new Response(
        JSON.stringify({ error: "Delete failed", details: delErr.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Bulk insert in chunks of 500
    const CHUNK = 500;
    let inserted = 0;
    for (let i = 0; i < allRecords.length; i += CHUNK) {
      const chunk = allRecords.slice(i, i + CHUNK);
      const { error: insErr } = await supabase.from("scholarships").insert(chunk);
      if (insErr) {
        console.error(`Insert failed at offset ${i}:`, insErr);
        return new Response(
          JSON.stringify({
            error: "Insert failed",
            offset: i,
            inserted,
            details: insErr.message,
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      inserted += chunk.length;
      console.log(`Inserted ${inserted}/${allRecords.length}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalInserted: inserted,
        perFileCounts,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unhandled error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
