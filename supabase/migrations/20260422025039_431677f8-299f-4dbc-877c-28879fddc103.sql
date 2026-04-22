ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS gender,
  DROP COLUMN IF EXISTS sector,
  DROP COLUMN IF EXISTS max_distance_km;