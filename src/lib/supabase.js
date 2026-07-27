import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ===== AUTH =====
export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password });

export const signOut = () => supabase.auth.signOut();

export const getProfile = async (userId) => {
  const { data } = await supabase
    .from("profiles").select("*").eq("id", userId).single();
  return data;
};

// ===== NEWS =====
export const getPublishedNews = async ({ limit = 9, offset = 0, categorySlug, search } = {}) => {
  let query = supabase
    .from("news")
    .select("*, categories(name, slug), authors!news_author_id_fkey(name, photo)", { count: "exact" })
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (categorySlug) {
    const { data: cat } = await supabase.from("categories").select("id").eq("slug", categorySlug).single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,short_description.ilike.%${search}%`);
  }

  return query;
};

export const getNewsDetail = async (slug) => {
  const { data, error } = await supabase
    .from("news")
    .select("*, categories(name, slug), authors!news_author_id_fkey(name, photo, bio)")
    .eq("slug", slug).eq("status", "published").single();

  if (data) {
    await supabase.from("news").update({ views: (data.views || 0) + 1 }).eq("id", data.id);
  }
  return { data, error };
};

export const getFeaturedNews = () =>
  supabase.from("news")
    .select("*, categories(name, slug), authors!news_author_id_fkey(name)")
    .eq("status", "published").eq("featured", true)
    .order("created_at", { ascending: false }).limit(5);

export const getPopularNews = () =>
  supabase.from("news")
    .select("*, categories(name, slug), authors!news_author_id_fkey(name)")
    .eq("status", "published")
    .order("views", { ascending: false }).limit(5);

export const getRelatedNews = (categoryId, excludeId) =>
  supabase.from("news")
    .select("*, categories(name, slug), authors!news_author_id_fkey(name)")
    .eq("status", "published").eq("category_id", categoryId).neq("id", excludeId).limit(4);

// ===== CATEGORIES =====
export const getCategories = () =>
  supabase.from("categories").select("*").order("name");

// ===== AUTHORS =====
export const getAuthors = () =>
  supabase.from("authors").select("*").order("name");

// ===== ADMIN: NEWS CRUD =====
export const adminGetAllNews = ({ limit = 15, offset = 0, status, categoryId, search } = {}) => {
  let query = supabase
    .from("news")
    .select("*, categories(name), authors!news_author_id_fkey(name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);
  if (categoryId) query = query.eq("category_id", categoryId);
  if (search) query = query.ilike("title", `%${search}%`);
  return query;
};

export const adminCreateNews = (data) =>
  supabase.from("news").insert([data]).select().single();

export const adminUpdateNews = (id, data) =>
  supabase.from("news").update(data).eq("id", id).select().single();

export const adminDeleteNews = (id) =>
  supabase.from("news").delete().eq("id", id);

export const adminGetNewsById = (id) =>
  supabase.from("news")
    .select("*, categories(name, slug), authors!news_author_id_fkey(name)")
    .eq("id", id).single();

// ===== ADMIN: CATEGORIES CRUD =====
export const adminCreateCategory = (data) =>
  supabase.from("categories").insert([data]).select().single();

export const adminUpdateCategory = (id, data) =>
  supabase.from("categories").update(data).eq("id", id);

export const adminDeleteCategory = (id) =>
  supabase.from("categories").delete().eq("id", id);

// ===== ADMIN: AUTHORS CRUD =====
export const adminCreateAuthor = (data) =>
  supabase.from("authors").insert([data]).select().single();

export const adminUpdateAuthor = (id, data) =>
  supabase.from("authors").update(data).eq("id", id);

export const adminDeleteAuthor = (id) =>
  supabase.from("authors").delete().eq("id", id);

// ===== ADMIN: USERS =====
export const adminGetUsers = () =>
  supabase.from("profiles").select("*").order("created_at", { ascending: false });

export const adminUpdateUserRole = (id, role) =>
  supabase.from("profiles").update({ role }).eq("id", id);

// ===== UPLOAD IMAGE =====
export const uploadImage = async (file, folder = "thumbnails") => {
  const ext = file.name.split(".").pop();
  const filename = `${folder}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("news-images").upload(filename, file, { upsert: true });

  if (error) return { url: null, error };

  const { data: { publicUrl } } = supabase.storage
    .from("news-images").getPublicUrl(filename);

  return { url: publicUrl, error: null };
};

// ===== DASHBOARD STATS =====
export const getDashboardStats = async () => {
  const [newsRes, publishedRes, draftRes, catRes, authorRes, userRes] = await Promise.all([
    supabase.from("news").select("id", { count: "exact", head: true }),
    supabase.from("news").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("news").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("authors").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  return {
    total_news: newsRes.count || 0,
    published_news: publishedRes.count || 0,
    draft_news: draftRes.count || 0,
    total_categories: catRes.count || 0,
    total_authors: authorRes.count || 0,
    total_users: userRes.count || 0,
  };
};