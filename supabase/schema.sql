-- Database Schema for Orthodox Fasting Companion (Idempotent Script)

-- 1. Reflections Table (Daily Content)
CREATE TABLE IF NOT EXISTS public.reflections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    liturgical_phase TEXT,
    primary_gospel TEXT,
    all_readings TEXT,
    theme TEXT,
    bible_story TEXT,
    daily_prayer TEXT,
    father_name TEXT,
    father_quote TEXT,
    desert_father_story TEXT,
    prayer_insight TEXT,
    evening_common_prayer TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for reflections
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- DROP and RECREATE Policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Allow public read access to reflections" ON public.reflections;
CREATE POLICY "Allow public read access to reflections" ON public.reflections FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert reflections" ON public.reflections;
CREATE POLICY "Allow authenticated users to insert reflections" ON public.reflections FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to update reflections" ON public.reflections;
CREATE POLICY "Allow authenticated users to update reflections" ON public.reflections FOR UPDATE TO authenticated USING (true);

-- 2. User Logs Table (Prayer, Fast, Journal)
CREATE TABLE IF NOT EXISTS public.user_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('PRAYER', 'FAST', 'JOURNAL')),
    ts TIMESTAMPTZ DEFAULT now(),
    day_key DATE NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for user_logs
ALTER TABLE public.user_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own logs" ON public.user_logs;
CREATE POLICY "Users can view their own logs" ON public.user_logs FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own logs" ON public.user_logs;
CREATE POLICY "Users can insert their own logs" ON public.user_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own logs" ON public.user_logs;
CREATE POLICY "Users can update their own logs" ON public.user_logs FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own logs" ON public.user_logs;
CREATE POLICY "Users can delete their own logs" ON public.user_logs FOR DELETE USING (auth.uid() = user_id);

-- 3. User Progress Table (50-Day Journey)
CREATE TABLE IF NOT EXISTS public.user_progress (
    user_id UUID REFERENCES auth.users PRIMARY KEY,
    completed_days INTEGER[] DEFAULT '{}',
    current_day INTEGER DEFAULT 1,
    last_updated TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
CREATE POLICY "Users can update their own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_logs_user_date ON public.user_logs(user_id, day_key);
CREATE INDEX IF NOT EXISTS idx_reflections_date ON public.reflections(date);

-- OPTIONAL: Seed data for today (uncomment if you want to test the reflection card)
-- INSERT INTO public.reflections (date, bible_story, desert_father_story, prayer_insight)
-- VALUES (
--     CURRENT_DATE, 
--     'The Prodigal Son teaches us that God is always waiting with open arms, no matter how far we wander.',
--     'St. Isaac the Syrian reminds us that this life is a time for repentance, a journey of returning to our true home.',
--     'The Jesus Prayer is a powerful way to stay connected to God throughout the day, even in the midst of busy activities.'
-- ) ON CONFLICT (date) DO NOTHING;
