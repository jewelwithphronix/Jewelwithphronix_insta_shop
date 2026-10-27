-- Run once in Supabase → SQL Editor. Safe to run with Google sign-up turned on:
-- everyone can still view products, but only the admin email can add/edit/delete
-- products or product photos. Nothing existing is dropped; the "restrictive"
-- policies are ANDed with whatever rules you already have.

alter table public.products enable row level security;

-- everyone (customers and visitors) can read products
create policy "jwp_public_read" on public.products
  for select using (true);

-- admin can write
create policy "jwp_admin_write" on public.products
  for all to authenticated
  using ((auth.jwt() ->> 'email') = 'jewelwithphronix@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'jewelwithphronix@gmail.com');

-- nobody else can write, even if an older rule allowed "authenticated"
create policy "jwp_only_admin_insert" on public.products as restrictive
  for insert with check ((auth.jwt() ->> 'email') = 'jewelwithphronix@gmail.com');
create policy "jwp_only_admin_update" on public.products as restrictive
  for update using ((auth.jwt() ->> 'email') = 'jewelwithphronix@gmail.com');
create policy "jwp_only_admin_delete" on public.products as restrictive
  for delete using ((auth.jwt() ->> 'email') = 'jewelwithphronix@gmail.com');

-- product photos: only admin can upload/replace/delete in the product-images bucket
create policy "jwp_photos_only_admin_insert" on storage.objects as restrictive
  for insert with check (bucket_id <> 'product-images' or (auth.jwt() ->> 'email') = 'jewelwithphronix@gmail.com');
create policy "jwp_photos_only_admin_update" on storage.objects as restrictive
  for update using (bucket_id <> 'product-images' or (auth.jwt() ->> 'email') = 'jewelwithphronix@gmail.com');
create policy "jwp_photos_only_admin_delete" on storage.objects as restrictive
  for delete using (bucket_id <> 'product-images' or (auth.jwt() ->> 'email') = 'jewelwithphronix@gmail.com');
