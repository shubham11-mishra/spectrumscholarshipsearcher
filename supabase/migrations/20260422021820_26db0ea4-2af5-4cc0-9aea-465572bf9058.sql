-- Backfill any existing rows missing values (placeholder so NOT NULL can apply)
UPDATE public.profiles SET state = 'NSW' WHERE state IS NULL;
UPDATE public.profiles SET postcode = '0000' WHERE postcode IS NULL;

-- Enforce NOT NULL going forward
ALTER TABLE public.profiles
  ALTER COLUMN state SET NOT NULL,
  ALTER COLUMN postcode SET NOT NULL;