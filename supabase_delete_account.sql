-- Delete your account from Supabase
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID
-- You can find your user ID in the Supabase dashboard: Authentication > Users

-- Option 1: Delete by user ID (if you know it)
-- Replace 'YOUR_USER_ID_HERE' with your actual UUID
-- DELETE FROM user_balances WHERE user_id = 'YOUR_USER_ID_HERE';
-- DELETE FROM user_profiles WHERE user_id = 'YOUR_USER_ID_HERE';
-- DELETE FROM auth.users WHERE id = 'YOUR_USER_ID_HERE';

-- Option 2: Delete by email (replace with your email)
-- First, find your user ID by email
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then delete using the ID from above:
-- DELETE FROM user_balances WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
-- DELETE FROM user_profiles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
-- DELETE FROM auth.users WHERE email = 'your-email@example.com';

-- Option 3: Delete by username (replace with your username)
-- First, find your user ID by username
-- SELECT user_id, username, email FROM user_profiles WHERE username = 'YOUR_USERNAME';

-- Then delete:
-- DELETE FROM user_balances WHERE user_id = (SELECT user_id FROM user_profiles WHERE username = 'YOUR_USERNAME');
-- DELETE FROM user_profiles WHERE username = 'YOUR_USERNAME';
-- DELETE FROM auth.users WHERE id = (SELECT user_id FROM user_profiles WHERE username = 'YOUR_USERNAME');

-- Option 4: Delete ALL test accounts (USE WITH CAUTION - deletes everything!)
-- This will delete all users, profiles, and balances
-- DELETE FROM user_balances;
-- DELETE FROM user_profiles;
-- DELETE FROM auth.users;

-- SAFE OPTION: Just view your account first to confirm
-- View all users with their profiles
SELECT 
  au.id as user_id,
  au.email,
  up.username,
  ub.balance,
  au.created_at as account_created
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
LEFT JOIN user_balances ub ON au.id = ub.user_id
ORDER BY au.created_at DESC;

