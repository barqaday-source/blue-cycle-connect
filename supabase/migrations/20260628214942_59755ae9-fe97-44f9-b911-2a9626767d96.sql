
-- Lock search_path on touch_updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- Revoke execute from API roles on SECURITY DEFINER functions (still callable inside policies/triggers)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

-- Storage policies for shipment-photos (private, owners + signed URLs)
CREATE POLICY "shipment-photos read authenticated" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'shipment-photos');
CREATE POLICY "shipment-photos insert own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'shipment-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "shipment-photos update own" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'shipment-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "shipment-photos delete own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'shipment-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Storage policies for ad-images
CREATE POLICY "ad-images read authenticated" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'ad-images');
CREATE POLICY "ad-images insert own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'ad-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "ad-images update own" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'ad-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "ad-images delete own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'ad-images' AND (storage.foldername(name))[1] = auth.uid()::text);
