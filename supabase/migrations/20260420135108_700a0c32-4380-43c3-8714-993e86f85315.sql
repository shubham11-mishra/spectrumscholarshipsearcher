-- Speed up filtering, sorting and search on the scholarships table
CREATE INDEX IF NOT EXISTS idx_scholarships_state ON public.scholarships (state);
CREATE INDEX IF NOT EXISTS idx_scholarships_school_sector ON public.scholarships (school_sector);
CREATE INDEX IF NOT EXISTS idx_scholarships_category ON public.scholarships (category);
CREATE INDEX IF NOT EXISTS idx_scholarships_gender ON public.scholarships (gender);
CREATE INDEX IF NOT EXISTS idx_scholarships_value_type ON public.scholarships (value_type);
CREATE INDEX IF NOT EXISTS idx_scholarships_confidence ON public.scholarships (scholarship_confidence);
CREATE INDEX IF NOT EXISTS idx_scholarships_school_name ON public.scholarships (school_name);

-- Trigram indexes for fast ILIKE search on text fields
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_scholarships_school_name_trgm ON public.scholarships USING gin (school_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_scholarships_suburb_trgm ON public.scholarships USING gin (suburb gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_scholarships_program_name_trgm ON public.scholarships USING gin (program_name gin_trgm_ops);

-- Numeric index helper: cast value_num text to int for sorting
CREATE INDEX IF NOT EXISTS idx_scholarships_value_num_int ON public.scholarships (((NULLIF(value_num, ''))::int)) WHERE value_num IS NOT NULL AND value_num <> '';