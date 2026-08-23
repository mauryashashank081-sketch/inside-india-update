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

  // --------------------------------------------------
  // Check admin + load news
  // --------------------------------------------------
  const loadNews = async () => {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please login first.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } =
      await supabase
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

  // --------------------------------------------------
  // Reset form
  // --------------------------------------------------
  const resetForm = () => {
    setTitle("");
    setSummary("");
    setCategory("India");
    setSource("Inside India Update");
    setSourceUrl("");
    setImage("");
    setEditingId(null);
  };

  // --------------------------------------------------
  // Add / Update news
  // --------------------------------------------------
  const saveNews = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage(
      editingId
        ? "Updating news..."
        : "Adding news..."
    );

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
      const { error } = await supabase
        .from("ai_news")
        .insert([
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

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------
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

  // --------------------------------------------------
  // Publish
  // --------------------------------------------------
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

  // --------------------------------------------------
  // Move back to draft
  // --------------------------------------------------
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

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------
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

  const drafts = news.filter(
    (item) => item.status === "draft"
  );

  const published = news.filter(
    (item) => item.status === "published"
  );

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-8 rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-black">
                Inside India Update
              </h1>

              <p className="mt-1 text-slate-300">
                Admin Dashboard
              </p>
            </div>

            <button
              onClick={loadNews}
              className="rounded-lg bg-white px-4 py-2 font-bold text-slate-900 hover:bg-slate-200"
            >
              🔄 Refresh
            </button>
          </div>
        </header>

        {/* Stats */}
        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">
              Total News
            </p>
            <p className="mt-1 text-3xl font-black">
              {news.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">
              Drafts
            </p>
            <p className="mt-1 text-3xl font-black">
              {drafts.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">
              Published
            </p>
            <p className="mt-1 text-3xl font-black">
              {published.length}
            </p>
          </div>
        </section>

        {/* Message */}
        {message && (
          <div className="mb-6 rounded-xl bg-white p-4 font-semibold shadow">
            {message}
          </div>
        )}

        {/* Add/Edit Form */}
        <section className="mb-10 rounded-2xl bg-white p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">
                {editingId
                  ? "Edit News"
                  : "Add News Manually"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manual news will be saved as a draft.
              </p>
            </div>

            {editingId && (
              <button
                onClick={resetForm}
                className="rounded-lg border px-4 py-2 font-semibold"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={saveNews}
            className="grid gap-5"
          >
            <div>
              <label className="mb-2 block font-semibold">
                Title
              </label>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Enter news headline"
                className="w-full rounded-lg border p-3 outline-none focus:ring-2"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Summary
              </label>

              <textarea
                value={summary}
                onChange={(e) =>
                  setSummary(e.target.value)
                }
                placeholder="Write a factual summary..."
                rows={5}
                className="w-full rounded-lg border p-3 outline-none focus:ring-2"
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                >
                  {categories.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Source
                </label>

                <input
                  value={source}
                  onChange={(e) =>
                    setSource(e.target.value)
                  }
                  placeholder="Reuters, PIB, Inside India Update..."
                  className="w-full rounded-lg border p-3"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Source URL
              </label>

              <input
                value={sourceUrl}
                onChange={(e) =>
                  setSourceUrl(e.target.value)
                }
                placeholder="https://example.com/news"
                className="w-full rounded-lg border p-3"
                type="url"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Image URL
              </label>

              <input
                value={image}
                onChange={(e) =>
                  setImage(e.target.value)
                }
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border p-3"
                type="url"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
            >
              {editingId
                ? "Update News"
                : "Add News as Draft"}
            </button>
          </form>
        </section>

        {/* News List */}
        <section className="rounded-2xl bg-white p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">
                News Management
              </h2>

              <p className="text-sm text-slate-500">
                Review AI/GNews drafts and manage published news.
              </p>
            </div>
          </div>

          {loading ? (
            <p className="py-10 text-center text-slate-500">
              Loading news...
            </p>
          ) : news.length === 0 ? (
            <p className="py-10 text-center text-slate-500">
              No news found.
            </p>
          ) : (
            <div className="space-y-5">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-32 w-full rounded-lg object-cover md:w-48"
                      />
                    )}

                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">
                          {item.category}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            item.status === "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <h3 className="text-xl font-black">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.summary}
                      </p>

                      <p className="mt-3 text-xs text-slate-500">
                        Source: {item.source}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            editNews(item)
                          }
                          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white"
                        >
                          ✏️ Edit
                        </button>

                        {item.status === "draft" ? (
                          <button
                            onClick={() =>
                              publishNews(item.id)
                            }
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white"
                          >
                            ✅ Publish
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              unpublishNews(item.id)
                            }
                            className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-bold text-white"
                          >
                            ↩️ Draft
                          </button>
                        )}

                        <button
                          onClick={() =>
                            deleteNews(item.id)
                          }
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white"
                        >
                          🗑️ Delete
                        </button>

                        {item.source_url && (
                          <a
                            href={item.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border px-4 py-2 text-sm font-bold"
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