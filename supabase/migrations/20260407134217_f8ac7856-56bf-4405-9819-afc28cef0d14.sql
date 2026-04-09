
CREATE TABLE public.shortlisted_schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  school_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, school_id)
);

ALTER TABLE public.shortlisted_schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own shortlist"
  ON public.shortlisted_schools FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shortlist"
  ON public.shortlisted_schools FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own shortlist"
  ON public.shortlisted_schools FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
