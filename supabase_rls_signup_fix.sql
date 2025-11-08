-- Fix RLS policies to allow signup inserts
-- The trigger function should handle inserts, but we need to ensure policies allow it

-- First, let's make sure the trigger function can insert (it uses SECURITY DEFINER, so it should bypass RLS)
-- But we also need policies that allow users to insert their own records during signup

-- Drop and recreate INSERT policies to be more permissive during signup
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own balance" ON user_balances;

-- Create INSERT policies that allow users to insert their own records
-- This is needed in case the trigger doesn't work or for manual inserts
CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own balance"
  ON user_balances
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Also ensure the trigger function is correct and has SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into user_profiles
  INSERT INTO public.user_profiles (user_id, username, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', 'user' || substr(NEW.id::text, 1, 8)),
    NEW.email
  )
  ON CONFLICT (user_id) DO UPDATE
  SET 
    username = COALESCE(EXCLUDED.username, user_profiles.username),
    email = COALESCE(EXCLUDED.email, user_profiles.email);
  
  -- Insert into user_balances
  INSERT INTO public.user_balances (user_id, balance)
  VALUES (NEW.id, 1000)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify the trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- If the trigger doesn't exist, create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

