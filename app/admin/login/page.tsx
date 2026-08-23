"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type NewsItem = {
  id: number;
  created_at: string;
  updated_at?: string;
  published_at?: string | null;
  title: string;
  summary: string;
  category: string;
  source: string;
  source_url: string;
  image: string;
  status: string;
};

const categories = [
  "Politics",
  "Business",
  "Technology",
  "Education",
  "Environment",
  "Health",
  "Science",
  "Sports",
  "India",
];

export default function AdminPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("India");
  const [source, setSource] = useState("Inside India Update");
  const [sourceUrl, setSourceUrl] = useState("");
  const [image, setImage] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const loadNews = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please login first.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.is_admin) {
      setMessage("Access denied. Admin account required.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("ai_news")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Error loading news: " + error.message);
      setLoading(false);
      return;
    }

    setNews((data || []) as NewsItem[]);
    setLoading(false);
  };

  useEffect(() => {
    loadNews();
  }, []);

  const resetForm = () => {
    setTitle("");
    setSummary("");
    setCategory("India");
    setSource("Inside India Update");
    setSourceUrl("");
    setImage("");
    setEditingId(null);
  };

  const saveNews = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage(editingId ? "Updating news..." : "Adding news...");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please login first.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      setMessage("Access denied.");
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("ai_news")
        .update({
          title,
          summary,
          category,
          source,
          source_url: sourceUrl,
          image,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId);

      if (error) {
        setMessage("Update error: " + error.message);
        return;
      }

      setMessage("✅ News updated successfully!");
    } else {
      const { error } = await supabase.from("ai_news").insert([
        {
          title,
          summary,
          category,
          source,
          source_url: sourceUrl,
          image,
          status: "draft",
        },
      ]);

      if (error) {
        setMessage("Insert error: " + error.message);
        return;
      }

      setMessage("✅ News added as draft!");
    }

    resetForm();
    await loadNews();
  };

  const editNews = (item: NewsItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setSummary(item.summary);
    setCategory(item.category);
    setSource(item.source);
    setSourceUrl(item.source_url || "");
    setImage(item.image || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const publishNews = async (id: number) => {
    setMessage("Publishing...");

    const { error } = await supabase
      .from("ai_news")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      setMessage("Publish error: " + error.message);
      return;
    }

    setMessage("✅ News published!");
    await loadNews();
  };

  const unpublishNews = async (id: number) => {
    setMessage("Moving to draft...");

    const { error } = await supabase
      .from("ai_news")
      .update({
        status: "draft",
        published_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      setMessage("Update error: " + error.message);
      return;
    }

    setMessage("News moved back to draft.");
    await loadNews();
  };

  const deleteNews = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this news?"
    );

    if (!confirmed) return;

    setMessage("Deleting...");

    const { error } = await supabase
      .from("ai_news")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage("Delete error: " + error.message);
      return;
    }

    setMessage("🗑️ News deleted.");
    await loadNews();
  };

  const drafts = news.filter((item) => item.status === "draft");
  const published = news.filter((item) => item.status === "published");

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <header className="mb-8 rounded-2xl bg-slate-950 p-6 text-white shadow-lg">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Inside India Update
              </h1>

              <p className="mt-1 font-medium text-slate-300">
                Admin Dashboard
              </p>
            </div>

            <button
              onClick={loadNews}
              className="rounded-lg bg-white px-5 py-2.5 font-bold text-slate-950 transition hover:bg-slate-200"
            >
              🔄 Refresh
            </button>
          </div>
        </header>

        {/* MESSAGE */}
        {message && (
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 font-bold text-slate-800 shadow">
            {message}
          </div>
        )}

        {/* STATS */}
        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-semibold text-slate-500">
              Total News
            </p>

            <p className="mt-1 text-3xl font-black text-slate-950">
              {news.length}
            </p>
          </div>

          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
            <p className="font-semibold text-yellow-800">
              Drafts
            </p>

            <p className="mt-1 text-3xl font-black text-yellow-900">
              {drafts.length}
            </p>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm">
            <p className="font-semibold text-green-800">
              Published
            </p>

            <p className="mt-1 text-3xl font-black text-green-900">
              {published.length}
            </p>
          </div>
        </section>

        {/* MANUAL ADD / EDIT */}
        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                {editingId ? "Edit News" : "Add News Manually"}
              </h2>

              <p className="mt-1 font-medium text-slate-600">
                {editingId
                  ? "Update the selected news article."
                  : "Manual news will be saved as a draft."}
              </p>
            </div>

            {editingId && (
              <button
                onClick={resetForm}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-bold text-slate-800 hover:bg-slate-100"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={saveNews} className="grid gap-5">

            <div>
              <label className="mb-2 block font-bold text-slate-900">
                Title
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter news headline"
                className="w-full rounded-lg border-2 border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-900">
                Summary
              </label>

              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Write a factual summary..."
                rows={5}
                className="w-full rounded-lg border-2 border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600"
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-bold text-slate-900">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border-2 border-slate-300 bg-white p-3 font-medium text-slate-900 outline-none focus:border-blue-600"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-bold text-slate-900">
                  Source
                </label>

                <input
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="Reuters, PIB, Inside India Update..."
                  className="w-full rounded-lg border-2 border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600"
                  required
                />
              </div>

            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-900">
                Source URL
              </label>

              <input
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://example.com/news"
                className="w-full rounded-lg border-2 border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600"
                type="url"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-900">
                Image URL
              </label>

              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border-2 border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600"
                type="url"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 font-black text-white shadow-sm transition hover:bg-blue-700"
            >
              {editingId ? "Update News" : "Add News as Draft"}
            </button>
          </form>
        </section>

        {/* NEWS MANAGEMENT */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-950">
              News Management
            </h2>

            <p className="mt-1 font-medium text-slate-600">
              Review AI/GNews drafts and manage published news.
            </p>
          </div>

          {loading ? (
            <p className="py-10 text-center font-bold text-slate-600">
              Loading news...
            </p>
          ) : news.length === 0 ? (
            <p className="py-10 text-center font-bold text-slate-600">
              No news found.
            </p>
          ) : (
            <div className="space-y-5">

              {news.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border-2 border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >

                  <div className="flex flex-col gap-5 md:flex-row">

                    {/* IMAGE */}
                    <div className="shrink-0">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-40 w-full rounded-lg border border-slate-200 object-cover md:w-56"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-40 w-full items-center justify-center rounded-lg bg-slate-200 font-bold text-slate-500 md:w-56">
                          No Image
                        </div>
                      )}

                    </div>

                    {/* CONTENT */}
                    <div className="min-w-0 flex-1">

                      <div className="mb-3 flex flex-wrap gap-2">

                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800">
                          {item.category}
                        </span>

                        {item.status === "published" ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-800">
                            PUBLISHED
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-800">
                            DRAFT
                          </span>
                        )}

                      </div>

                      <h3 className="text-xl font-black leading-tight text-slate-950">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-base font-medium leading-7 text-slate-700">
                        {item.summary}
                      </p>

                      <p className="mt-3 text-sm font-bold text-slate-600">
                        Source:{" "}
                        <span className="text-slate-900">
                          {item.source}
                        </span>
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">

                        <button
                          onClick={() => editNews(item)}
                          className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white hover:bg-slate-800"
                        >
                          ✏️ Edit
                        </button>

                        {item.status === "draft" ? (
                          <button
                            onClick={() => publishNews(item.id)}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-black text-white hover:bg-green-700"
                          >
                            ✅ Publish
                          </button>
                        ) : (
                          <button
                            onClick={() => unpublishNews(item.id)}
                            className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-black text-white hover:bg-yellow-600"
                          >
                            ↩️ Draft
                          </button>
                        )}

                        <button
                          onClick={() => deleteNews(item.id)}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-black text-white hover:bg-red-700"
                        >
                          🗑️ Delete
                        </button>

                        {item.source_url && (
                          <a
                            href={item.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-900 hover:bg-slate-100"
                          >
                            🔗 Source
                          </a>
                        )}

                      </div>
                    </div>
                  </div>
                </article>
              ))}

            </div>
          )}
        </section>
      </div>
    </main>
  );
}