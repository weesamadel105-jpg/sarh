-- =========================================
-- Sarh Database Schema - Combined Migration
-- =========================================
-- This file combines all individual migrations
-- Run this in your Supabase SQL editor to set up the complete schema

-- Enable Row Level Security globally
ALTER TABLE IF EXISTS auth.users ENABLE ROW LEVEL SECURITY;

-- =========================================
-- 001_users_profiles.sql
-- =========================================

-- Create profiles table to extend auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- 002_teachers.sql
-- =========================================

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

-- =========================================
-- 003_orders.sql
-- =========================================

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  service TEXT NOT NULL,
  subject TEXT,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'in-progress', 'completed', 'revision', 'cancelled')) DEFAULT 'pending',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  deadline TIMESTAMP WITH TIME ZONE,
  budget DECIMAL(10,2),
  final_price DECIMAL(10,2),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  attachments JSONB DEFAULT '[]',
  requirements JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view orders assigned to them" ON public.orders
  FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Teachers can update orders assigned to them" ON public.orders
  FOR UPDATE USING (auth.uid() = teacher_id);

-- Create trigger for orders updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create order_history table for tracking status changes
CREATE TABLE IF NOT EXISTS public.order_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on order_history
ALTER TABLE public.order_history ENABLE ROW LEVEL SECURITY;

-- Create policies for order_history
CREATE POLICY "Users can view history of their orders" ON public.order_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_history.order_id
      AND (orders.user_id = auth.uid() OR orders.teacher_id = auth.uid())
    )
  );

CREATE POLICY "System can create order history" ON public.order_history
  FOR INSERT WITH CHECK (true);

-- Create function to automatically create order history
CREATE OR REPLACE FUNCTION public.create_order_history()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_history (order_id, previous_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for order history
CREATE TRIGGER create_order_history_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.create_order_history();

-- =========================================
-- 004_messages.sql
-- =========================================

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'teacher', 'support', 'student')),
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('text', 'file', 'image')) DEFAULT 'text',
  file_name TEXT,
  file_size TEXT,
  file_url TEXT,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages
CREATE POLICY "Users can view messages in their conversations" ON public.messages
  FOR SELECT USING (
    conversation_id LIKE 'student-' || auth.uid()::text OR
    conversation_id LIKE 'teacher-' || auth.uid()::text OR
    conversation_id LIKE 'support-' || auth.uid()::text
  );

CREATE POLICY "Users can insert messages in their conversations" ON public.messages
  FOR INSERT WITH CHECK (
    conversation_id LIKE 'student-' || auth.uid()::text OR
    conversation_id LIKE 'teacher-' || auth.uid()::text OR
    conversation_id LIKE 'support-' || auth.uid()::text
  );

CREATE POLICY "Users can update their own messages" ON public.messages
  FOR UPDATE USING (sender = 'user' OR sender = 'student' OR sender = 'teacher');

-- Create trigger for messages updated_at
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create conversations table for better conversation management
CREATE TABLE IF NOT EXISTS public.conversations (
  id TEXT PRIMARY KEY,
  type TEXT CHECK (type IN ('student-support', 'student-teacher', 'teacher-student')) NOT NULL,
  participant_1 UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_2 UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  unread_count_1 INTEGER DEFAULT 0,
  unread_count_2 INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for conversations
CREATE POLICY "Users can view their conversations" ON public.conversations
  FOR SELECT USING (participant_1 = auth.uid() OR participant_2 = auth.uid());

CREATE POLICY "Users can update their conversations" ON public.conversations
  FOR UPDATE USING (participant_1 = auth.uid() OR participant_2 = auth.uid());

-- Create trigger for conversations updated_at
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update conversation metadata when new message is added
CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET
    last_message = NEW.content,
    last_message_at = NEW.created_at,
    unread_count_1 = CASE
      WHEN participant_1 != auth.uid() THEN unread_count_1 + 1
      ELSE unread_count_1
    END,
    unread_count_2 = CASE
      WHEN participant_2 != auth.uid() THEN unread_count_2 + 1
      ELSE unread_count_2
    END,
    updated_at = TIMEZONE('utc'::text, NOW())
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for conversation updates
CREATE TRIGGER update_conversation_on_message_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_on_message();

-- =========================================
-- 005_subscriptions.sql
-- =========================================

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  description_ar TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2),
  features JSONB DEFAULT '[]',
  features_ar JSONB DEFAULT '[]',
  max_orders INTEGER DEFAULT -1, -- -1 means unlimited
  priority_support BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on subscription_plans
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for subscription_plans
CREATE POLICY "Anyone can view active subscription plans" ON public.subscription_plans
  FOR SELECT USING (is_active = TRUE);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
  plan_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive', 'cancelled', 'expired', 'pending')) DEFAULT 'pending',
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'yearly')) DEFAULT 'monthly',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  orders_used INTEGER DEFAULT 0,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for subscriptions updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create subscription_history table
CREATE TABLE IF NOT EXISTS public.subscription_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  action TEXT CHECK (action IN ('created', 'renewed', 'cancelled', 'reactivated', 'plan_changed')) NOT NULL,
  old_plan_id UUID REFERENCES public.subscription_plans(id),
  new_plan_id UUID REFERENCES public.subscription_plans(id),
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'SAR',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on subscription_history
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

-- Create policies for subscription_history
CREATE POLICY "Users can view their subscription history" ON public.subscription_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE subscriptions.id = subscription_history.subscription_id
      AND subscriptions.user_id = auth.uid()
    )
  );

-- Create function to track subscription changes
CREATE OR REPLACE FUNCTION public.track_subscription_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.subscription_history (subscription_id, action, new_plan_id, amount)
    VALUES (NEW.id, 'created', NEW.plan_id, (SELECT price_monthly FROM public.subscription_plans WHERE id = NEW.plan_id));
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.plan_id IS DISTINCT FROM NEW.plan_id THEN
      INSERT INTO public.subscription_history (subscription_id, action, old_plan_id, new_plan_id)
      VALUES (NEW.id, 'plan_changed', OLD.plan_id, NEW.plan_id);
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for subscription history
CREATE TRIGGER track_subscription_changes_trigger
  AFTER INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.track_subscription_changes();

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, name_ar, description, description_ar, price_monthly, price_yearly, features, features_ar, max_orders)
VALUES
  ('Free', 'مجاني', 'Basic features for students', 'الميزات الأساسية للطلاب', 0, 0,
   '["5 orders per month", "Basic support", "File sharing"]',
   '["5 طلبات شهرياً", "دعم أساسي", "مشاركة الملفات"]',
   5),
  ('Pro Monthly', 'برو شهري', 'Advanced features for serious students', 'ميزات متقدمة للطلاب الجادين', 49.99, 499.99,
   '["Unlimited orders", "Priority support", "Video calls", "Progress tracking", "Advanced analytics"]',
   '["طلبات غير محدودة", "دعم ذو أولوية", "مكالمات فيديو", "تتبع التقدم", "تحليلات متقدمة"]',
   -1),
  ('Pro Yearly', 'برو سنوي', 'Best value for dedicated students', 'أفضل قيمة للطلاب المخلصين', 39.99, 399.99,
   '["Unlimited orders", "Priority support", "Video calls", "Progress tracking", "Advanced analytics", "2 months free"]',
   '["طلبات غير محدودة", "دعم ذو أولوية", "مكالمات فيديو", "تتبع التقدم", "تحليلات متقدمة", "شهرين مجاناً"]',
   -1)
ON CONFLICT DO NOTHING;

-- =========================================
-- 006_payments.sql
-- =========================================

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'SAR' CHECK (currency IN ('SAR', 'USD', 'EUR')),
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')) DEFAULT 'pending',
  payment_method TEXT CHECK (payment_method IN ('stripe', 'paypal', 'bank_transfer', 'cash')) DEFAULT 'stripe',
  payment_type TEXT CHECK (payment_type IN ('order', 'subscription', 'refund', 'tip')) NOT NULL,
  description TEXT,
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  paypal_transaction_id TEXT,
  metadata JSONB DEFAULT '{}',
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON public.payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create trigger for payments updated_at
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create payment_logs table for audit trail
CREATE TABLE IF NOT EXISTS public.payment_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
  action TEXT CHECK (action IN ('created', 'processed', 'failed', 'refunded', 'cancelled')) NOT NULL,
  old_status TEXT,
  new_status TEXT,
  amount DECIMAL(10,2),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on payment_logs
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_logs
CREATE POLICY "Users can view logs for their payments" ON public.payment_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.payments
      WHERE payments.id = payment_logs.payment_id
      AND payments.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all payment logs" ON public.payment_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create function to log payment status changes
CREATE OR REPLACE FUNCTION public.log_payment_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.payment_logs (payment_id, action, old_status, new_status, amount, created_by)
    VALUES (NEW.id, 'processed', OLD.status, NEW.status, NEW.amount, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for payment logging
CREATE TRIGGER log_payment_changes_trigger
  AFTER UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.log_payment_changes();

-- Create refunds table
CREATE TABLE IF NOT EXISTS public.refunds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  reason TEXT CHECK (reason IN ('customer_request', 'service_issue', 'duplicate', 'fraud', 'other')),
  status TEXT CHECK (status IN ('pending', 'approved', 'processed', 'rejected')) DEFAULT 'pending',
  processed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  processed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  stripe_refund_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on refunds
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;

-- Create policies for refunds
CREATE POLICY "Users can view refunds for their payments" ON public.refunds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.payments
      WHERE payments.id = refunds.payment_id
      AND payments.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage refunds" ON public.refunds
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create trigger for refunds updated_at
CREATE TRIGGER update_refunds_updated_at
  BEFORE UPDATE ON public.refunds
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- Schema Setup Complete
-- =========================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Final message
DO $$
BEGIN
  RAISE NOTICE 'Sarh database schema setup completed successfully!';
  RAISE NOTICE 'Default subscription plans have been created.';
  RAISE NOTICE 'All tables have Row Level Security enabled.';
END $$;