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