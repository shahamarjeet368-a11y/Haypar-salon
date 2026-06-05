-- Run these commands in the Supabase SQL Editor to create the required tables

-- 1. Create the settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id text PRIMARY KEY,
  address text NOT NULL
);

-- Insert the default salon location into the settings table
INSERT INTO public.settings (id, address)
VALUES ('salonLocation', 'Nangloi Prem Nagar 3, Durga Chowk, Delhi')
ON CONFLICT (id) DO NOTHING;

-- 2. Create the hairstyles table
CREATE TABLE IF NOT EXISTS public.hairstyles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price text NOT NULL,
  "imageUrl" text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert a few sample hairstyles
INSERT INTO public.hairstyles (name, price, "imageUrl") VALUES
  ('Classic Pompadour', '500', ''),
  ('Modern Fade', '350', ''),
  ('Luxury Beard Trim', '250', '');

-- 3. Create the appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  "createdAt" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: We need to enable Row Level Security (RLS) but for now, we'll allow public reads and inserts for the app to function.
-- (For production, you should lock this down to authenticated users, but this is the simplest setup)

-- Enable RLS (Optional depending on your security needs)
-- ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.hairstyles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- If you enable RLS, you must create policies to allow the website to read/write data. 
-- To allow anyone to book, view, update status, and delete appointments (Public Insert/Select/Update/Delete):
-- CREATE POLICY "Allow public insert to appointments" ON public.appointments FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public select to appointments" ON public.appointments FOR SELECT USING (true);
-- CREATE POLICY "Allow public update to appointments" ON public.appointments FOR UPDATE USING (true);
-- CREATE POLICY "Allow public delete to appointments" ON public.appointments FOR DELETE USING (true);

-- To allow anyone to read hairstyles (Public Select):
-- CREATE POLICY "Allow public read hairstyles" ON public.hairstyles FOR SELECT USING (true);

-- To allow anyone to read settings (Public Select):
-- CREATE POLICY "Allow public read settings" ON public.settings FOR SELECT USING (true);

-- 4. Create the qr_images table
CREATE TABLE IF NOT EXISTS public.qr_images (
  id text PRIMARY KEY,
  "imageUrl" text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Optional depending on your security needs)
-- ALTER TABLE public.qr_images ENABLE ROW LEVEL SECURITY;

-- To allow anyone to upload/read QR images:
-- CREATE POLICY "Allow public insert to qr_images" ON public.qr_images FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public read qr_images" ON public.qr_images FOR SELECT USING (true);

-- 5. Enable Realtime Replication for tables (Critical for cross-device dashboard updates)
-- Run these commands in the SQL Editor to enable Postgres Realtime for updates:
-- ALTER TABLE public.appointments REPLICA IDENTITY FULL;
-- ALTER TABLE public.hairstyles REPLICA IDENTITY FULL;
-- ALTER TABLE public.settings REPLICA IDENTITY FULL;
-- alter publication supabase_realtime add table public.appointments;
-- alter publication supabase_realtime add table public.hairstyles;
-- alter publication supabase_realtime add table public.settings;

