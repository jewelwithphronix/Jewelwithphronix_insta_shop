-- Run once in Supabase → SQL Editor (after admin-only-writes.sql).
-- 1) Home slider: everyone can see slides, only the admin email can change them.
-- 2) Reviews: a shared table so every customer sees every review.
--    Signed-in customers can post (under their own email) and delete their own;
--    the admin can delete any review.

-- ---------- slides ----------
alter table public.slides enable row level security;

create policy "jwp_slides_public_read" on public.slides
  for select using (true);

create policy "jwp_slides_admin_write" on public.slides
  for all to authenticated
  using ((auth.jwt() ->> 'email') = 'jewelwithphronix@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'jewelwithphronix@gmail.com');

create policy "jwp_slides_only_admin_insert" on public.slides as restrictive
  for insert with check ((auth.jwt() ->> 'email') = 'jewelwithphronix@gmail.com');
create policy "jwp_slides_only_admin_update" on public.slides as restrictive
  for update using ((auth.jwt() ->> 'email') = 'jewelwithphronix@gmail.com');
create policy "jwp_slides_only_admin_delete" on public.slides as restrictive
  for delete using ((auth.jwt() ->> 'email') = 'jewelwithphronix@gmail.com');

-- ---------- reviews ----------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  user_email text not null default (auth.jwt() ->> 'email'),
  name text not null check (char_length(name) between 1 and 40),
  rating int not null check (rating between 1 and 5),
  title text not null default '' check (char_length(title) <= 80),
  body text not null check (char_length(body) between 5 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists reviews_product_idx on public.reviews (product_id, created_at desc);

alter table public.reviews enable row level security;

create policy "jwp_reviews_public_read" on public.reviews
  for select using (true);

create policy "jwp_reviews_own_insert" on public.reviews
  for insert to authenticated
  with check (user_email = (auth.jwt() ->> 'email'));

create policy "jwp_reviews_own_or_admin_delete" on public.reviews
  for delete to authenticated
  using (
    user_email = (auth.jwt() ->> 'email')
    or (auth.jwt() ->> 'email') = 'jewelwithphronix@gmail.com'
  );

-- live updates for the review list
alter publication supabase_realtime add table public.reviews;
