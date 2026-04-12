-- Create teachers table
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  subjects TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  availability JSONB DEFAULT '{}',
  languages TEXT[] DEFAULT '{العربية}',
  education TEXT,
  certifications TEXT[],
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on teachers
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Create policies for teachers
CREATE POLICY "Anyone can view teachers" ON public.teachers
  FOR SELECT USING (true);

CREATE POLICY "Teachers can update their own profile" ON public.teachers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Teachers can insert their own profile" ON public.teachers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create trigger for teachers updated_at
CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create teacher_subjects table for better subject management
CREATE TABLE IF NOT EXISTS public.teacher_subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')) DEFAULT 'intermediate',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(teacher_id, subject)
);

-- Enable RLS on teacher_subjects
ALTER TABLE public.teacher_subjects ENABLE ROW LEVEL SECURITY;

-- Create policies for teacher_subjects
CREATE POLICY "Anyone can view teacher subjects" ON public.teacher_subjects
  FOR SELECT USING (true);

CREATE POLICY "Teachers can manage their subjects" ON public.teacher_subjects
  FOR ALL USING (auth.uid() = teacher_id);