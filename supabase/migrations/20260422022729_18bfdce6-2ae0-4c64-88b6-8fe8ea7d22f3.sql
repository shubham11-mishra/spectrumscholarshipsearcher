-- Add onboarding preference columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS year_level text,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS sector text,
  ADD COLUMN IF NOT EXISTS max_distance_km integer;

-- Update handle_new_user trigger function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, state, postcode, suburb, year_level, gender, sector, max_distance_km)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'state', 'NSW'),
    COALESCE(NEW.raw_user_meta_data->>'postcode', '0000'),
    NEW.raw_user_meta_data->>'suburb',
    NEW.raw_user_meta_data->>'year_level',
    NEW.raw_user_meta_data->>'gender',
    NEW.raw_user_meta_data->>'sector',
    NULLIF(NEW.raw_user_meta_data->>'max_distance_km', '')::integer
  );
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();