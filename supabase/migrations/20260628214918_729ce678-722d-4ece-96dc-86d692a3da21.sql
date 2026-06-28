
-- Roles enum
CREATE TYPE public.app_role AS ENUM ('admin','company','citizen');

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text NOT NULL DEFAULT '',
  phone text,
  company_name text,
  city text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles read all authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles update own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles insert own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- User roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles read own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- has_role security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Shipments
CREATE TABLE public.shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material text NOT NULL,
  weight_kg numeric NOT NULL,
  area text,
  city text,
  photo_url text,
  status text NOT NULL DEFAULT 'pending',
  company_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipments TO authenticated;
GRANT ALL ON public.shipments TO service_role;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shipments read all authenticated" ON public.shipments FOR SELECT TO authenticated USING (true);
CREATE POLICY "shipments insert citizen" ON public.shipments FOR INSERT TO authenticated WITH CHECK (citizen_id = auth.uid());
CREATE POLICY "shipments update owner or company" ON public.shipments FOR UPDATE TO authenticated
  USING (citizen_id = auth.uid() OR company_id = auth.uid() OR public.has_role(auth.uid(),'company'));
CREATE POLICY "shipments delete owner" ON public.shipments FOR DELETE TO authenticated USING (citizen_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- Company ads
CREATE TABLE public.company_ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text,
  price_per_kg numeric,
  material text,
  city text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_ads TO authenticated;
GRANT SELECT ON public.company_ads TO anon;
GRANT ALL ON public.company_ads TO service_role;
ALTER TABLE public.company_ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ads read all" ON public.company_ads FOR SELECT USING (active = true OR company_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "ads insert company" ON public.company_ads FOR INSERT TO authenticated WITH CHECK (company_id = auth.uid() AND public.has_role(auth.uid(),'company'));
CREATE POLICY "ads update owner" ON public.company_ads FOR UPDATE TO authenticated USING (company_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "ads delete owner" ON public.company_ads FOR DELETE TO authenticated USING (company_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- Updated-at trigger fn
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER trg_profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_shipments_touch BEFORE UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- New user handler: create profile, role from metadata, auto-admin for designated email
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, email, full_name, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name',''),
    NEW.raw_user_meta_data->>'company_name'
  )
  ON CONFLICT (id) DO NOTHING;

  _role := COALESCE(NULLIF(NEW.raw_user_meta_data->>'role','')::public.app_role, 'citizen'::public.app_role);
  INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, _role)
  ON CONFLICT DO NOTHING;

  IF lower(COALESCE(NEW.email,'')) = 'barqaday@gmail.com' THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
