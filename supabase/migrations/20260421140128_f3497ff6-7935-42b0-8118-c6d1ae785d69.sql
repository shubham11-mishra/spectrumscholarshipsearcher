-- Reclassify likely Catholic schools from 'Independent' to 'Catholic'
-- based on common naming patterns. This is a heuristic — non-Catholic
-- "St "/"Saint " schools may be misclassified.
UPDATE public.scholarships
SET sector = 'Catholic'
WHERE sector = 'Independent'
  AND (
    school_name ILIKE '%catholic%'
    OR school_name ILIKE '%cathedral%'
    OR school_name ILIKE 'st %'
    OR school_name ILIKE '% st %'
    OR school_name ILIKE 'saint %'
    OR school_name ILIKE '% saint %'
    OR school_name ILIKE '%mercy%'
    OR school_name ILIKE '%loreto%'
    OR school_name ILIKE '%xavier%'
    OR school_name ILIKE '%marist%'
    OR school_name ILIKE '%jesuit%'
    OR school_name ILIKE '%dominican%'
    OR school_name ILIKE '%christian brothers%'
  );