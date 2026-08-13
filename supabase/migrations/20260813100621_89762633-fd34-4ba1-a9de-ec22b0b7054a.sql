CREATE TABLE IF NOT EXISTS public.collector_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collector_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (collector_id, company_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.collector_links TO authenticated;
GRANT ALL ON public.collector_links TO service_role;
ALTER TABLE public.collector_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "links visible to both sides" ON public.collector_links
  FOR SELECT TO authenticated USING (auth.uid() = collector_id OR auth.uid() = company_id);
CREATE POLICY "collector creates own link" ON public.collector_links
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = collector_id);
CREATE POLICY "company updates link status" ON public.collector_links
  FOR UPDATE TO authenticated USING (auth.uid() = company_id) WITH CHECK (auth.uid() = company_id);
CREATE POLICY "either side deletes link" ON public.collector_links
  FOR DELETE TO authenticated USING (auth.uid() = collector_id OR auth.uid() = company_id);

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER collector_links_updated_at BEFORE UPDATE ON public.collector_links
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "avatars read" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'avatars');
CREATE POLICY "avatars owner insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars owner update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars owner delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'authenticated can view profiles') THEN
    CREATE POLICY "authenticated can view profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
  END IF;
END $$;