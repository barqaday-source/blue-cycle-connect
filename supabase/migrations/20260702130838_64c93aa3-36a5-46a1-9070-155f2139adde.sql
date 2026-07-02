ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS lat double precision, ADD COLUMN IF NOT EXISTS lng double precision;
ALTER TABLE public.company_ads ADD COLUMN IF NOT EXISTS lat double precision, ADD COLUMN IF NOT EXISTS lng double precision;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS lat double precision, ADD COLUMN IF NOT EXISTS lng double precision;