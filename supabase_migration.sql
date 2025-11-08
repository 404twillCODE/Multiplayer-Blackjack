-- Migration script to update existing Supabase database
-- Run this in your Supabase SQL Editor

-- Step 1: Add email column to user_profiles table (if it doesn't exist)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Step 2: Update existing user profiles with their email from auth.users
-- This will populate the email field for existing users
UPDATE user_profiles up
SET email = au.email
FROM auth.users au
WHERE up.user_id = au.id 
  AND up.email IS NULL;

-- Step 3: Update the trigger function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, username, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', 'user' || substr(NEW.id::text, 1, 8)),
    NEW.email
  );
  
  INSERT INTO public.user_balances (user_id, balance)
  VALUES (NEW.id, 1000);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Verify the changes (optional - you can run these to check)
-- Check if email column exists and has data
SELECT 
  COUNT(*) as total_users,
  COUNT(email) as users_with_email,
  COUNT(*) - COUNT(email) as users_without_email
FROM user_profiles;

-- Check recent user profiles
SELECT user_id, username, email, created_at 
FROM user_profiles 
ORDER BY created_at DESC 
LIMIT 10;

