CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, state, postcode, suburb)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'postcode',
    NEW.raw_user_meta_data->>'suburb'
  );
  RETURN NEW;
END;
$function$;