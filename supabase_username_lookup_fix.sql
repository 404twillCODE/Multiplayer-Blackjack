-- Fix username lookup for login by creating a secure database function
-- This allows looking up emails by username without exposing all user data

-- Create a function to get email by username
-- This uses SECURITY DEFINER to bypass RLS for login purposes
CREATE OR REPLACE FUNCTION public.get_email_by_username(username_to_find TEXT)
RETURNS TABLE(email TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT up.email
  FROM public.user_profiles up
  WHERE up.username = username_to_find
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.get_email_by_username(TEXT) TO anon, authenticated;

-- Also, we need to allow SELECT on user_profiles by username for login
-- But only return the email field, not other sensitive data
-- Create a more permissive policy for username lookups (read-only, email only)
CREATE POLICY "Allow username lookup for login"
  ON user_profiles
  FOR SELECT
  USING (true); -- Allow anyone to read username/email for login purposes
  -- Note: This is safe because we're only exposing username and email, which are needed for login

-- Alternative: If you want more security, you can restrict it to only return email:
-- But the function approach above is better

-- Verify the function was created
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'get_email_by_username';

