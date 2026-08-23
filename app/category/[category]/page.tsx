import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const categoryName =
    category.charAt(0).toUpperCase() + category.slice(1);

  const { data: news, error } = await supabase
    .from("ai_news")
    .select("*")
    .eq("status", "published")
    .ilike("category", categoryName)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 p-10">
        <h1 className="text-3xl font-black">Supabase Error</h1>
        <p className="mt-4 text-red-600">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Link href="/" className="text-3xl font-black tracking-tight">
            Inside India <span className="text-blue-600">Update</span>
          </Link>

          <p className="mt-1 text-sm text-slate-500">
            India’s latest news, explained simply
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-4 py-3 text-sm font-semibold">
          <Link href="/">Home</Link>
          <Link href="/category/india">India</Link>
          <Link href="/category/world">World</Link>
          <Link href="/category/politics">Politics</Link>
          <Link href="/category/business">Business</Link>
          <Link href="/category/technology">Technology</Link>
          <Link href="/category/sports">Sports</Link>
          <Link href="/category/entertainment">Entertainment</Link>
          <Link href="/category/education">Education</Link>
        </div>
      </nav>

      {/* Category Content */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-black md:text-4xl">
            {categoryName} News
          </h1>

          <p className="mt-2 text-slate-500">
            Latest {categoryName.toLowerCase()} news and updates
          </p>
        </div>

        {news && news.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl border bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                {item.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="p-5">
                  <p className="text-xs font-bold uppercase text-blue-600">
                    {item.category}
                  </p>

                  <h2 className="mt-2 text-xl font-black leading-snug">
                    {item.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                    {item.summary}
                  </p>

                  <Link
                    href={`/news/${item.slug}`}
                    className="mt-5 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
                  >
                    Read Full Story →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-slate-50 p-10 text-center">
            <h2 className="text-xl font-bold">
              No {categoryName} news available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Published news for this category will appear here.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-12 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h2 className="text-xl font-black">Inside India Update</h2>

          <p className="mt-2 text-sm text-slate-400">
            Independent news and updates from India and around the world.
          </p>

          <div className="mt-6 border-t border-slate-700 pt-4 text-xs text-slate-500">
            © 2026 Inside India Update. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}