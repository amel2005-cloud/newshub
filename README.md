# NewsHub — React + Supabase + Vercel (GRATIS)

Website berita lengkap dengan admin dashboard, CRUD, dan bisa diakses siapa saja secara gratis.

---

## Stack Teknologi
- **React + Vite + Tailwind CSS** (frontend)
- **Supabase** (database + auth + storage) — gratis selamanya
- **Vercel** (hosting) — gratis selamanya

---

## LANGKAH 1: Setup Supabase

### 1.1 Buat akun Supabase
1. Buka https://supabase.com → klik **Start for Free**
2. Daftar pakai GitHub atau email
3. Klik **New Project**, isi nama project: `newshub`, pilih region terdekat, atur password database
4. Tunggu project selesai dibuat (~2 menit)

### 1.2 Jalankan SQL Schema
1. Di dashboard Supabase, klik menu **SQL Editor** (ikon database di sidebar kiri)
2. Klik **+ New query**
3. Copy-paste seluruh isi file `supabase/schema.sql` ke sana
4. Klik tombol **Run** (atau Ctrl+Enter)
5. Tunggu sampai semua selesai (akan ada pesan "Success")

### 1.3 Ambil API Keys
1. Di dashboard Supabase, klik **Project Settings** (ikon gear)
2. Klik **API** di sidebar
3. Copy dua nilai ini:
   - **Project URL** (contoh: `https://abcdefgh.supabase.co`)
   - **anon public** key (string panjang)

---

## LANGKAH 2: Setup Project di Komputer

### 2.1 Install dependencies
Buka terminal/Laragon Terminal, masuk ke folder newshub:
```bash
cd path/ke/folder/newshub
npm install
```

### 2.2 Buat file .env
Copy file `.env.example` jadi `.env`:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJI...
```
Ganti dengan URL dan key dari step 1.3.

### 2.3 Coba di localhost
```bash
npm run dev
```
Buka http://localhost:5173

---

## LANGKAH 3: Buat Akun Admin

1. Buka website (localhost atau yang sudah deploy)
2. Pergi ke /login
3. Di Supabase Dashboard → **Authentication** → **Users** → **+ Add User**
4. Isi email dan password, klik Add
5. Kembali ke **SQL Editor** Supabase, jalankan:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'emailkamu@gmail.com';
```
6. Sekarang bisa login di /login dengan email+password tadi

---

## LANGKAH 4: Deploy ke Vercel (GRATIS)

### 4.1 Upload project ke GitHub
1. Buat akun di https://github.com (kalau belum ada)
2. Buat repository baru, nama: `newshub`
3. Upload semua file newshub ini ke repo tersebut
   - Cara termudah: drag & drop folder ke GitHub web, atau pakai GitHub Desktop

### 4.2 Deploy di Vercel
1. Buka https://vercel.com → daftar pakai akun GitHub
2. Klik **Add New Project**
3. Pilih repository `newshub` dari GitHub
4. Di bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL` = URL supabase kamu
   - `VITE_SUPABASE_ANON_KEY` = anon key supabase kamu
5. Klik **Deploy**
6. Tunggu ~2 menit, website kamu akan online di URL seperti: `https://newshub-xxx.vercel.app`

**Website sudah online dan gratis selamanya!**

---

## Fitur yang Tersedia

### Website Publik
- ✅ Homepage dengan Hero, Berita Terbaru, Berita Pilihan, Populer, Kategori
- ✅ Halaman detail berita lengkap
- ✅ Filter per kategori
- ✅ Search berita
- ✅ Responsive mobile-friendly

### Admin Dashboard (/admin/dashboard)
- ✅ Statistik (total berita, published, draft, kategori, penulis, user)
- ✅ CRUD Berita (tambah, edit, hapus, filter, cari)
- ✅ Upload thumbnail berita
- ✅ Field: judul, slug, kategori, penulis, deskripsi, konten, tags, link sumber, featured, status, tanggal publish
- ✅ CRUD Kategori
- ✅ CRUD Penulis (dengan upload foto)
- ✅ Manajemen pengguna (ubah role)
- ✅ Proteksi route (hanya admin yang bisa akses)

### Desain
- Warna tema: Dark Blue #0b2545, Red #d62828, White, Light Gray
- Responsive di semua ukuran layar
- Modern dan profesional

---

## Catatan Penting
- Supabase free tier: 500MB database, 1GB storage, 50MB file uploads — cukup untuk ratusan berita
- Vercel free tier: unlimited deploys, tidak ada batas waktu
- Tidak ada biaya bulanan sama sekali
