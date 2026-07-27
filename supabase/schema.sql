-- =============================================
-- NewsHub - Supabase Schema
-- Jalankan ini di Supabase SQL Editor
-- =============================================

-- 1. Profiles (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text,
  role text default 'user' check (role in ('admin', 'user')),
  created_at timestamptz default now()
);

-- 2. Categories
create table if not exists categories (
  id bigserial primary key,
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamptz default now()
);

-- 3. Authors
create table if not exists authors (
  id bigserial primary key,
  name text not null,
  photo text,
  bio text,
  created_at timestamptz default now()
);

-- 4. News
create table if not exists news (
  id bigserial primary key,
  category_id bigint references categories(id) on delete set null,
  author_id bigint references authors(id) on delete set null,
  title text not null,
  slug text unique not null,
  thumbnail text,
  short_description text,
  content text,
  tags text,
  source_url text,
  featured boolean default false,
  status text default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  views integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

alter table profiles enable row level security;
alter table categories enable row level security;
alter table authors enable row level security;
alter table news enable row level security;

-- Profiles: user bisa lihat profilnya sendiri, admin bisa lihat semua
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Categories: publik bisa read, hanya admin yang bisa write
create policy "Categories viewable by everyone" on categories for select using (true);
create policy "Admin can insert categories" on categories for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin can update categories" on categories for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin can delete categories" on categories for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Authors
create policy "Authors viewable by everyone" on authors for select using (true);
create policy "Admin can insert authors" on authors for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin can update authors" on authors for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin can delete authors" on authors for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- News: publik hanya bisa lihat yang published, admin bisa semua
create policy "Published news viewable by everyone" on news for select using (
  status = 'published' or
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin can insert news" on news for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin can update news" on news for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin can delete news" on news for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- =============================================
-- Storage bucket untuk thumbnail
-- =============================================
insert into storage.buckets (id, name, public) values ('news-images', 'news-images', true)
on conflict do nothing;

create policy "Anyone can view images" on storage.objects for select using (bucket_id = 'news-images');
create policy "Admin can upload images" on storage.objects for insert with check (
  bucket_id = 'news-images' and
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin can delete images" on storage.objects for delete using (
  bucket_id = 'news-images' and
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- =============================================
-- Trigger: auto-create profile saat user register
-- =============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- Seed Data: Categories
-- =============================================
insert into categories (name, slug, description) values
  ('Politik', 'politik', 'Berita politik terkini'),
  ('Bisnis', 'bisnis', 'Berita bisnis dan ekonomi'),
  ('Teknologi', 'teknologi', 'Berita teknologi'),
  ('Olahraga', 'olahraga', 'Berita olahraga'),
  ('Hiburan', 'hiburan', 'Berita hiburan'),
  ('Kesehatan', 'kesehatan', 'Berita kesehatan'),
  ('Dunia', 'dunia', 'Berita internasional'),
  ('Sains', 'sains', 'Berita sains'),
  ('Pendidikan', 'pendidikan', 'Berita pendidikan'),
  ('Travel', 'travel', 'Berita perjalanan')
on conflict do nothing;

-- Seed Data: Authors
insert into authors (name, bio) values
  ('Ahmad Fauzi', 'Jurnalis senior dengan pengalaman 10 tahun di bidang politik.'),
  ('Siti Rahayu', 'Reporter bisnis dan ekonomi.'),
  ('Budi Santoso', 'Penulis teknologi dan startup.'),
  ('Dewi Kusuma', 'Jurnalis kesehatan dan gaya hidup.'),
  ('Rizky Pratama', 'Reporter olahraga nasional.')
on conflict do nothing;

-- =============================================
-- CATATAN: Untuk buat akun admin:
-- 1. Register dulu lewat aplikasi / Supabase Auth
-- 2. Lalu jalankan SQL ini (ganti EMAIL dengan email kamu):
--    UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
-- =============================================
