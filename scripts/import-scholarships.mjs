/**
 * Bulk-import all CSV files from public/data/ into the `scholarships` table.
 *
 * Usage:
 *   1. Get your SERVICE ROLE key from Lovable Cloud → Backend → Settings → API Keys
 *      (NEVER commit this key — it bypasses RLS)
 *   2. Run:
 *        SUPABASE_URL="https://osqnexzsxizytjtazyru.supabase.co" \
 *        SUPABASE_SERVICE_ROLE_KEY="eyJ..." \
 *        node scripts/import-scholarships.mjs
 *
 * Optional flags:
 *   --wipe    Delete all existing rows before importing
 *   --file=public/data/scholarships_ACT.csv   Import only one file
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  process.exit(1);
}

const args = process.argv.slice(2);
const WIPE = args.includes("--wipe");
const FILE_ARG = args.find((a) => a.startsWith("--file="))?.split("=")[1];

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const DATA_DIR = "public/data";
const BATCH_SIZE = 500;

// Columns that exist in the scholarships table (CSV-only fields like lat/lng/school_phone/school_email/geolocation are dropped)
const TABLE_COLUMNS = new Set([
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

function mapRow(raw) {
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    const key = k === "row" ? "row_number" : k;
    if (!TABLE_COLUMNS.has(key)) continue;
    if (v === "" || v == null) {
      out[key] = null;
      continue;
    }
    if (key === "row_number") {
      const n = parseInt(v, 10);
      out[key] = Number.isFinite(n) ? n : null;
    } else {
      out[key] = String(v);
    }
  }
  if (!out.school_name) return null; // school_name is NOT NULL
  return out;
}

async function importFile(path) {
  const csv = readFileSync(path, "utf8");
  const rows = parse(csv, { columns: true, skip_empty_lines: true, relax_quotes: true });
  const mapped = rows.map(mapRow).filter(Boolean);
  console.log(`📄 ${path}: parsed ${mapped.length} rows`);

  let inserted = 0;
  for (let i = 0; i < mapped.length; i += BATCH_SIZE) {
    const batch = mapped.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("scholarships").insert(batch);
    if (error) {
      console.error(`   ❌ Batch ${i}-${i + batch.length} failed:`, error.message);
      continue;
    }
    inserted += batch.length;
    process.stdout.write(`\r   ⬆️  ${inserted}/${mapped.length}`);
  }
  console.log(`\n   ✅ Inserted ${inserted} rows from ${path}`);
  return inserted;
}

async function main() {
  if (WIPE) {
    console.log("🗑️  Wiping existing scholarships...");
    const { error } = await supabase.from("scholarships").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) {
      console.error("Wipe failed:", error.message);
      process.exit(1);
    }
    console.log("   ✅ Cleared\n");
  }

  const files = FILE_ARG
    ? [FILE_ARG]
    : readdirSync(DATA_DIR)
        .filter((f) => f.startsWith("scholarships_") && f.endsWith(".csv"))
        .map((f) => join(DATA_DIR, f));

  console.log(`Found ${files.length} CSV file(s) to import\n`);

  let total = 0;
  for (const f of files) total += await importFile(f);

  const { count } = await supabase.from("scholarships").select("*", { count: "exact", head: true });
  console.log(`\n🎉 Done. Inserted ${total} rows. Table now contains ${count} rows.`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
