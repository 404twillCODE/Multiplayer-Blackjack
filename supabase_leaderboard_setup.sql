-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_balance ON leaderboard(balance DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON leaderboard(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policies for leaderboard
-- Allow anyone to read the leaderboard (public leaderboard)
CREATE POLICY "Anyone can view leaderboard"
  ON leaderboard FOR SELECT
  USING (true);

-- Allow service role to insert/update (for server-side operations)
-- Note: This will be handled via service role key on the server
-- For now, we'll allow authenticated users to update their own entry
CREATE POLICY "Users can update their own leaderboard entry"
  ON leaderboard FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow service role to insert (server will use service role key)
-- We'll create a function that can be called with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.update_leaderboard(
  p_user_id UUID,
  p_username TEXT,
  p_balance INTEGER
)
RETURNS void AS $$
BEGIN
  -- If user_id is provided, use it; otherwise use username
  IF p_user_id IS NOT NULL THEN
    INSERT INTO leaderboard (user_id, username, balance)
    VALUES (p_user_id, p_username, p_balance)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      username = EXCLUDED.username,
      balance = GREATEST(leaderboard.balance, EXCLUDED.balance),
      updated_at = NOW()
    WHERE EXCLUDED.balance > leaderboard.balance;
  ELSE
    -- For guest players, use username as identifier
    INSERT INTO leaderboard (user_id, username, balance)
    VALUES (NULL, p_username, p_balance)
    ON CONFLICT (username) 
    DO UPDATE SET 
      balance = GREATEST(leaderboard.balance, EXCLUDED.balance),
      updated_at = NOW()
    WHERE EXCLUDED.balance > leaderboard.balance;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.update_leaderboard(UUID, TEXT, INTEGER) TO anon, authenticated;

-- Create function to get top leaderboard entries
CREATE OR REPLACE FUNCTION public.get_leaderboard(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  balance INTEGER,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.user_id,
    l.username,
    l.balance,
    ROW_NUMBER() OVER (ORDER BY l.balance DESC, l.updated_at DESC) as rank
  FROM leaderboard l
  ORDER BY l.balance DESC, l.updated_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_leaderboard(INTEGER) TO anon, authenticated;

