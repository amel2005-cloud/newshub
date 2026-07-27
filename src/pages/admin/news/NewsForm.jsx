import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/layout/AdminLayout";
import {
  getCategories,
  adminCreateNews,
  adminUpdateNews,
  uploadImage,
} from "../../../lib/supabase";

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function NewsForm({ initialData, newsId }) {
  const navigate = useNavigate();
  const isEdit = !!newsId;

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category_id: "",
    author_name: "",
    short_description: "",
    content: "",
    tags: "",
    source_url: "",
    featured: false,
    status: "draft",
    published_at: "",
    thumbnail: "",
    ...initialData,
  });

  const [categories, setCategories] = useState([]);
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(
    initialData?.thumbnail || "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data || []));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "title" && !isEdit ? { slug: slugify(value) } : {}),
    }));
  };

  const handleThumb = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbFile(file);
    setThumbPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let thumbnailUrl = form.thumbnail;

    if (thumbFile) {
      const { url, error: upErr } = await uploadImage(thumbFile);
      if (upErr) {
        setError("Gagal upload gambar.");
        setLoading(false);
        return;
      }
      thumbnailUrl = url;
    }

    const { categories, id, created_at, updated_at, ...cleanForm } = form;

    const payload = {
      ...cleanForm,
      thumbnail: thumbnailUrl,
      published_at:
        form.status === "published"
          ? form.published_at || new Date().toISOString()
          : form.published_at || null,
      slug: form.slug || slugify(form.title) + "-" + Date.now(),
    };

    const { error: err } = isEdit
      ? await adminUpdateNews(newsId, payload)
      : await adminCreateNews(payload);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    navigate("/admin/news");
  };

  return (
    <AdminLayout title={isEdit ? "Edit Berita" : "Tambah Berita Baru"}>
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl">
        {error && (
          <div className="bg-red/10 text-red text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Judul Berita *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Slug</label>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="input"
                placeholder="auto-generated"
              />
            </div>

            <div>
              <label className="label">Kategori *</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Penulis *</label>
              <input
                type="text"
                name="author_name"
                value={form.author_name || ""}
                onChange={handleChange}
                className="input"
                placeholder="Masukkan nama penulis"
                required
              />
            </div>

            <div>
              <label className="label">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label className="label">Tanggal Publikasi</label>
              <input
                type="datetime-local"
                name="published_at"
                value={form.published_at?.slice(0, 16) || ""}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Tags (pisahkan dengan koma)</label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="input"
                placeholder="politik, ekonomi, nasional"
              />
            </div>

            <div>
              <label className="label">Link Sumber Asli</label>
              <input
                type="url"
                name="source_url"
                value={form.source_url || ""}
                onChange={handleChange}
                className="input"
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Deskripsi Singkat</label>
              <textarea
                name="short_description"
                value={form.short_description}
                onChange={handleChange}
                className="input"
                rows={2}
                maxLength={500}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumb}
                className="input"
              />
              {thumbPreview && (
                <img
                  src={thumbPreview}
                  alt="preview"
                  className="mt-2 h-32 rounded object-cover"
                />
              )}
            </div>

            <div className="md:col-span-2">
              <label className="label">Konten Berita *</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                className="input font-mono text-sm"
                rows={12}
                required
                placeholder="Tulis konten berita di sini. Mendukung HTML untuk formatting."
              />
              <p className="text-xs text-gray-400 mt-1">
                Tip: Bisa pakai HTML seperti &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;,
                &lt;strong&gt; untuk formatting.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-4 h-4 accent-red"
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium text-gray-700"
              >
                Berita Pilihan (Featured)
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="btn-red disabled:opacity-60"
            >
              {loading
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Simpan Berita"}
            </button>
            <button
              type="reset"
              onClick={() =>
                setForm({
                  title: "",
                  slug: "",
                  category_id: "",
                  author_name: "",
                  short_description: "",
                  content: "",
                  tags: "",
                  source_url: "",
                  featured: false,
                  status: "draft",
                  published_at: "",
                  thumbnail: "",
                })
              }
              className="btn-outline"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/news")}
              className="btn-outline"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
