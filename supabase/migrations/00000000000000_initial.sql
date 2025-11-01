-- Example initial migration
-- This file will be run when you first start your local Supabase instance

-- Example: Create a simple users profile table
-- CREATE TABLE IF NOT EXISTS public.profiles (
--   id UUID REFERENCES auth.users(id) PRIMARY KEY,
--   username TEXT UNIQUE,
--   full_name TEXT,
--   avatar_url TEXT,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
-- );

-- Enable Row Level Security
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- CREATE POLICY "Public profiles are viewable by everyone."
--   ON public.profiles FOR SELECT
--   USING (true);

-- CREATE POLICY "Users can insert their own profile."
--   ON public.profiles FOR INSERT
--   WITH CHECK (auth.uid() = id);

-- CREATE POLICY "Users can update their own profile."
--   ON public.profiles FOR UPDATE
--   USING (auth.uid() = id);
