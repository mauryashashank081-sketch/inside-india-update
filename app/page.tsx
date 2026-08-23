import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default async function Home() {
  const { data: news, error } = await supabase
    .from("ai_news")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 p-10">
        <h1 className="text-3xl font-black">Supabase Error</h1>
        <p className="mt-4 text-red-600">{error.message}</p>
      </main>
    );
  }

  const latestNews = news ?? [];
  const mainNews = latestNews[0];

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* Top Bar */}
      <div className="bg-slate-900 text-white text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <span>Latest Updates</span>
          <span>Latest News • India • World</span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Inside India{" "}
              <span className="text-blue-600">Update</span>
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              India’s latest news, explained simply
            </p>
          </div>

          <button className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
            Subscribe
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-4 py-3 text-sm font-semibold">

          <a href="/" className="text-blue-600">
            Home
          </a>

          <a href="/category/india">
            India
          </a>

          <a href="/category/world">
            World
          </a>

          <a href="/category/politics">
            Politics
          </a>

          <a href="/category/business">
            Business
          </a>

          <a href="/category/technology">
            Technology
          </a>

          <a href="/category/sports">
            Sports
          </a>

          <a href="/category/entertainment">
            Entertainment
          </a>

          <a href="/category/education">
            Education
          </a>

        </div>
      </nav>

      {/* Breaking News */}
      <div className="border-b bg-red-600 text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <span className="rounded bg-white px-3 py-1 text-xs font-black text-red-600">
            BREAKING
          </span>

          <p className="text-sm font-semibold">
            Latest important news and updates from India
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-8">

        {mainNews && (
          <div className="grid gap-6 lg:grid-cols-3">

            {/* Main Story */}
            <article className="overflow-hidden rounded-xl border bg-slate-100 lg:col-span-2">

              {mainNews.image && (
                <div className="h-80 overflow-hidden">
                  <img
                    src={mainNews.image}
                    alt={mainNews.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">

                <p className="mb-2 text-xs font-bold tracking-widest text-blue-600">
                  TOP STORY
                </p>

                <h2 className="text-3xl font-black leading-tight md:text-4xl">
                  {mainNews.title}
                </h2>

                <p className="mt-4 text-slate-600">
                  {mainNews.summary}
                </p>

                <a
                  href={`/news/${mainNews.slug}`}
                  className="mt-5 inline-block rounded-lg bg-slate-900 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
                >
                  Read Full Story →
                </a>

              </div>
            </article>

            {/* Latest News */}
            <aside className="rounded-xl border bg-white p-5">

              <h2 className="mb-4 border-b pb-3 text-xl font-black">
                Latest News
              </h2>

              <div className="space-y-5">

                {latestNews.slice(0, 4).map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-lg border bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >

                    {item.image && (
                      <div className="h-36 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-4">

                      <p className="text-xs font-bold text-blue-600">
                        {item.category}
                      </p>

                      <h3 className="mt-2 font-bold leading-snug hover:text-blue-600">
                        <a href={`/news/${item.slug}`}>
                          {item.title}
                        </a>
                      </h3>

                      <p className="mt-3 text-xs text-slate-500">
                        Latest Update
                      </p>

                    </div>
                  </article>
                ))}

              </div>

            </aside>
          </div>
        )}

        {/* Top Stories */}
        <section className="mt-10">

          <div className="mb-5 flex items-center justify-between border-b pb-3">
            <h2 className="text-2xl font-black">
              Top Stories
            </h2>

            <span className="text-sm font-semibold text-blue-600">
              View All →
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {latestNews.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-lg border bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >

                {item.image ? (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center bg-slate-200">
                    <span className="text-sm font-semibold text-slate-500">
                      News Image
                    </span>
                  </div>
                )}

                <div className="p-4">

                  <p className="text-xs font-bold text-blue-600">
                    {item.category}
                  </p>

                  <h3 className="mt-2 font-bold leading-snug">
                    <a href={`/news/${item.slug}`}>
                      {item.title}
                    </a>
                  </h3>

                  <p className="mt-3 text-xs text-slate-500">
                    Latest Update
                  </p>

                </div>

              </article>
            ))}

          </div>

        </section>

      </section>

      {/* Footer */}
      <footer className="mt-12 bg-slate-900 text-white">

        <div className="mx-auto max-w-7xl px-4 py-8">

          <h2 className="text-xl font-black">
            Inside India Update
          </h2>

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