-- JunubHive Database Schema
-- Run this in Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER CHECK (age >= 18 AND age <= 99),
  bio TEXT CHECK (char_length(bio) <= 500),
  photos TEXT[] DEFAULT '{}',
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  interests TEXT[] DEFAULT '{}',
  occupation TEXT,
  education TEXT,
  height INTEGER,
  verified BOOLEAN DEFAULT FALSE,
  online_status TEXT DEFAULT 'offline' CHECK (online_status IN ('online', 'recently', 'offline')),
  last_seen TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  age_min INTEGER DEFAULT 18,
  age_max INTEGER DEFAULT 45,
  distance_max INTEGER DEFAULT 50,
  gender_preference TEXT[] DEFAULT '{}',
  show_me BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Swipes table
CREATE TABLE IF NOT EXISTS swipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  swiper_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  swiped_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('like', 'pass', 'super_like')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(swiper_id, swiped_id)
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  matched_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 2000),
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'gif')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own profile" ON profiles FOR DELETE USING (auth.uid() = user_id);

-- Preferences policies
CREATE POLICY "Users can manage own preferences" ON user_preferences
  USING (auth.uid() = user_id);

-- Swipes policies
CREATE POLICY "Users can insert own swipes" ON swipes FOR INSERT WITH CHECK (auth.uid() = swiper_id);
CREATE POLICY "Users can view own swipes" ON swipes FOR SELECT USING (auth.uid() = swiper_id);

-- Matches policies
CREATE POLICY "Users can view own matches" ON matches FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages policies
CREATE POLICY "Users can view messages in their matches" ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = messages.match_id
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
  );
CREATE POLICY "Users can insert messages in their matches" ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = match_id
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
  );

-- Function to auto-create match on mutual like
CREATE OR REPLACE FUNCTION create_match_on_mutual_like()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.action = 'like' OR NEW.action = 'super_like' THEN
    -- Check if the other person also liked
    IF EXISTS (
      SELECT 1 FROM swipes
      WHERE swiper_id = NEW.swiped_id
      AND swiped_id = NEW.swiper_id
      AND action IN ('like', 'super_like')
    ) THEN
      -- Create match (use consistent ordering to prevent duplicates)
      INSERT INTO matches (user1_id, user2_id)
      VALUES (
        LEAST(NEW.swiper_id, NEW.swiped_id),
        GREATEST(NEW.swiper_id, NEW.swiped_id)
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_swipe_check_match
  AFTER INSERT ON swipes
  FOR EACH ROW EXECUTE FUNCTION create_match_on_mutual_like();

-- Function to update profile updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS swipes_swiper_swiped_idx ON swipes(swiper_id, swiped_id);
CREATE INDEX IF NOT EXISTS matches_user1_idx ON matches(user1_id);
CREATE INDEX IF NOT EXISTS matches_user2_idx ON matches(user2_id);
CREATE INDEX IF NOT EXISTS messages_match_id_idx ON messages(match_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);
