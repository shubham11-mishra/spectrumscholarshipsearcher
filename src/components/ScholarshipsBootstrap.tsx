import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * On first app load, check if the scholarships table is empty.
 * If empty, invoke the `import-scholarships` edge function to bulk-load
 * all 8 state CSVs from public/data/. Runs once per browser session.
 */
export function ScholarshipsBootstrap() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    (async () => {
      try {
        const { count, error } = await supabase
          .from("scholarships")
          .select("*", { count: "exact", head: true });

        if (error) {
          console.error("[bootstrap] count check failed:", error);
          return;
        }

        if ((count ?? 0) > 0) {
          console.log(`[bootstrap] scholarships table already has ${count} rows — skipping import`);
          return;
        }

        console.log("[bootstrap] scholarships table empty — triggering CSV import...");
        const baseUrl = window.location.origin;
        const { data, error: fnErr } = await supabase.functions.invoke(
          "import-scholarships",
          { body: { baseUrl } }
        );

        if (fnErr) {
          console.error("[bootstrap] import failed:", fnErr);
          return;
        }
        console.log("[bootstrap] import complete:", data);
      } catch (e) {
        console.error("[bootstrap] unexpected error:", e);
      }
    })();
  }, []);

  return null;
}
