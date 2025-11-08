# Supabase Setup Guide

This guide will help you set up Supabase for authentication and persistent balance tracking.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details
5. Wait for the project to be created

## 2. Get Your Supabase Credentials

1. Go to Project Settings > API
2. Copy your `Project URL` (this is your `REACT_APP_SUPABASE_URL`)
3. Copy your `anon public` key (this is your `REACT_APP_SUPABASE_ANON_KEY`)

## 3. Set Environment Variables

Create a `.env` file in the `client` directory:

```
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 4. Create Database Tables

In your Supabase project, go to the SQL Editor and run the following SQL:

```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_balances table
CREATE TABLE IF NOT EXISTS user_balances (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for user_balances
CREATE POLICY "Users can view their own balance"
  ON user_balances FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own balance"
  ON user_balances FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own balance"
  ON user_balances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to automatically create profile and balance on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'user' || substr(NEW.id::text, 1, 8)));
  
  INSERT INTO public.user_balances (user_id, balance)
  VALUES (NEW.id, 1000);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 5. Install Dependencies

In the `client` directory, run:

```bash
npm install @supabase/supabase-js
```

## 6. Update Configuration

Update `client/src/config/supabase.js` with your actual Supabase URL and key, or make sure your `.env` file is properly configured.

## 6. Update Existing Database (If Needed)

If you already have a database set up and need to add the email column for username login support, run the migration script:

1. Go to your Supabase project SQL Editor
2. Copy and paste the contents of `supabase_migration.sql`
3. Run the script

This will:
- Add the `email` column to `user_profiles` table
- Populate existing users' emails from `auth.users`
- Update the trigger function to include email for new signups

## Features

- **Authentication**: Users can sign up, sign in (with email or username), or continue as guests
- **Session Persistence**: User sessions are saved and persist across page refreshes
- **Persistent Balances**: Authenticated users' balances are saved to Supabase
- **Auto-Reset**: If a user's balance reaches 0, it automatically resets to $1000
- **Guest Mode**: Users can play as guests with a random username (guest + random number)
- **Profile Management**: Usernames and emails are stored for login flexibility

## Guest Mode

- Guest usernames are generated as `guest` + random number (e.g., `guest1234`)
- Guest balances are not saved and reset to $1000 on each session
- Guests can sign up at any time to save their progress

