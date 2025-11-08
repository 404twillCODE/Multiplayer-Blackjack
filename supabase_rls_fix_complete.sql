-- Complete RLS fix for user_profiles and user_balances
-- This ensures users can read their own data during session initialization

-- First, let's check current RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'user_balances');

-- Enable RLS on both tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own balance" ON user_balances;
DROP POLICY IF EXISTS "Users can update their own balance" ON user_balances;
DROP POLICY IF EXISTS "Users can insert their own balance" ON user_balances;

-- Recreate policies for user_profiles
-- SELECT policy - users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- UPDATE policy - users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- INSERT policy - users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Recreate policies for user_balances
-- SELECT policy - users can view their own balance
CREATE POLICY "Users can view their own balance"
  ON user_balances
  FOR SELECT
  USING (auth.uid() = user_id);

-- UPDATE policy - users can update their own balance
CREATE POLICY "Users can update their own balance"
  ON user_balances
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- INSERT policy - users can insert their own balance
CREATE POLICY "Users can insert their own balance"
  ON user_balances
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Verify policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('user_profiles', 'user_balances')
ORDER BY tablename, policyname;

-- Test query (this should work if you're authenticated)
-- SELECT * FROM user_profiles WHERE user_id = auth.uid();

