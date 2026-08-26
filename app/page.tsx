import { createClient } from "@supabase/supabase-js";
import NewsSearch from "./components/NewsSearch";
import WeatherBar from "./components/WeatherBar";
import MobileMenu from "./components/MobileMenu";
import DesktopMoreMenu from "./components/DesktopMoreMenu";
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
      <main className="min-h-screen bg-white p-10 text-slate-900">
        <h1 className="text-3xl font-black">Supabase Error</h1>
        <p className="mt-4 text-red-600">{error.message}</p>
      </main>
    );
  }

  const latestNews = news ?? [];
  const mainNews = latestNews[0];

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* ================= TOP UTILITY BAR ================= */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs">

          <span className="font-semibold text-slate-500">
            India's News <span className="mx-1 text-slate-300">•</span> Updates{" "}
            <span className="mx-1 text-slate-300">•</span> Stories
          </span>

          <WeatherBar />

        </div>
      </div>

      {/* ================= MAIN HEADER ================= */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">

          {/* MENU */}
          <div className="flex min-w-[44px] items-center sm:min-w-[120px]">
            <MobileMenu />

            <span className="ml-2 hidden text-sm font-bold text-slate-600 sm:block">
              Menu
            </span>
          </div>

          {/* BRAND */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">

            <img
              src="/logo.webp"
              alt="Inside India Update"
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-slate-200 sm:h-12 sm:w-12"
            />

            <div className="min-w-0">
              <h1 className="whitespace-nowrap text-lg font-black tracking-tight text-slate-900 sm:text-2xl">
                Inside India
                <span className="text-blue-600"> Update</span>
              </h1>

              <p className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:block">
                India's News • Updates • Stories
              </p>
            </div>

          </div>

          {/* SEARCH + LIVE */}
          <div className="flex min-w-[44px] items-center justify-end gap-2 sm:min-w-[120px]">

            <NewsSearch news={latestNews} />

            <span className="hidden items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-black text-red-600 sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
              LIVE
            </span>

          </div>

        </div>
      </header>

      {/* ================= NAVIGATION ================= */}
      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">

        <div
           className="mx-auto flex max-w-7xl items-center gap-1 overflow-visible px-4 py-2.5 whitespace-nowrap"
             style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
>

          <a
            href="/"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            Home
          </a>

          {[
            ["India", "/category/india"],
            ["World", "/category/world"],
            ["Politics", "/category/politics"],
            ["Business", "/category/business"],
            ["Technology", "/category/technology"],
            ["Sports", "/category/sports"],
            ["Entertainment", "/category/entertainment"],
            ["Education", "/category/education"],
          ].map(([name, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
            >
              {name}
            </a>
          ))}

          <DesktopMoreMenu />

        </div>
      </nav>

      {/* ================= HERO / TOP STORIES ================= */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-white">

        <div className="mx-auto max-w-7xl px-4 py-9 sm:py-12">

          {/* SECTION HEADING */}
          <div className="mb-7 flex items-end justify-between">

            <div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600" />

                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                  Top Stories
                </p>
              </div>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Latest News
              </h2>

              <div className="mt-3 h-1 w-12 rounded-full bg-blue-600" />

            </div>

            <span className="hidden text-sm font-semibold text-slate-400 sm:block">
              Updated regularly
            </span>

          </div>

          {mainNews && (

            <div className="grid gap-5 lg:grid-cols-3">

              {/* FEATURED STORY */}
              <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl lg:col-span-2">

                {mainNews.image ? (

                  <div className="relative h-[310px] overflow-hidden sm:h-[390px]">

                    <img
                      src={mainNews.image}
                      alt={mainNews.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">

                      <span className="inline-flex rounded-md bg-blue-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white">
                        Top Story
                      </span>

                      <h3 className="mt-3 max-w-3xl text-2xl font-black leading-tight text-white sm:text-3xl">
                        {mainNews.title}
                      </h3>

                      <p className="mt-3 line-clamp-2 max-w-2xl text-sm font-medium leading-6 text-slate-200">
                        {mainNews.summary}
                      </p>

                      <a
                        href={`/news/${mainNews.slug}`}
                        className="mt-5 inline-flex items-center rounded-lg bg-white px-4 py-2.5 text-sm font-black text-slate-900 transition hover:bg-blue-600 hover:text-white"
                      >
                        Read Full Story
                        <span className="ml-2">→</span>
                      </a>

                    </div>

                  </div>

                ) : (

                  <div className="p-7">

                    <span className="text-xs font-black uppercase tracking-wider text-blue-600">
                      Top Story
                    </span>

                    <h3 className="mt-3 text-2xl font-black text-slate-950">
                      {mainNews.title}
                    </h3>

                  </div>

                )}

              </article>

              {/* BREAKING NEWS */}
              <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4">

                  <div>

                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                      Latest
                    </p>

                    <h3 className="mt-1 text-xl font-black text-slate-950">
                      Breaking News
                    </h3>

                  </div>

                  <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-black text-red-600">

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />

                    LIVE

                  </span>

                </div>

                <div className="divide-y divide-slate-100">

                  {latestNews.slice(0, 5).map((item) => (

                    <a
                      key={item.id}
                      href={`/news/${item.slug}`}
                      className="group flex gap-3 py-3.5 first:pt-0 last:pb-0"
                    >

                      {item.image ? (

                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-16 w-20 shrink-0 rounded-lg object-cover"
                        />

                      ) : (

                        <div className="h-16 w-20 shrink-0 rounded-lg bg-slate-100" />

                      )}

                      <div className="min-w-0">

                        <p className="text-[10px] font-black uppercase tracking-wide text-blue-600">
                          {item.category}
                        </p>

                        <h4 className="mt-1 line-clamp-3 text-sm font-bold leading-snug text-slate-800 transition group-hover:text-blue-600">
                          {item.title}
                        </h4>

                      </div>

                    </a>

                  ))}

                </div>

              </aside>

            </div>

          )}

        </div>

      </section>

      {/* ================= LATEST STORIES ================= */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-11">

          {/* SECTION HEADING */}
          <div className="mb-7 flex items-end justify-between border-b border-slate-200 pb-5">

            <div>

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-blue-600" />

                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                  Explore
                </p>

              </div>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Latest Stories
              </h2>

            </div>

            <span className="hidden text-sm font-semibold text-slate-400 sm:block">
              Fresh updates
            </span>

          </div>

          {/* NEWS GRID */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {latestNews.slice(1).map((item) => (

              <a
                key={item.id}
                href={`/news/${item.slug}`}
                className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >

                {item.image ? (

                  <div className="h-40 overflow-hidden">

                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                  </div>

                ) : (

                  <div className="flex h-40 items-center justify-center bg-slate-100">
                    <span className="text-xs font-bold text-slate-400">
                      Inside India Update
                    </span>
                  </div>

                )}

                <div className="p-5">

                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-600">
                    {item.category}
                  </span>

                  <h3 className="mt-2 line-clamp-3 text-base font-black leading-snug text-slate-950 transition group-hover:text-blue-600">
                    {item.title}
                  </h3>

                  <div className="mt-4 flex items-center justify-between">

                    <span className="text-[11px] font-semibold text-slate-400">
                      Latest Update
                    </span>

                    <span className="text-sm font-black text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
                      →
                    </span>

                  </div>

                </div>

              </a>

            ))}

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-slate-50">

        <div className="mx-auto max-w-7xl px-4 py-9">

          <div className="flex flex-col justify-between gap-7 sm:flex-row">

            <div>

              <div className="flex items-center gap-3">

                <img
                  src="/logo.webp"
                  alt="Inside India Update"
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                />

                <h2 className="text-xl font-black text-slate-900">
                  Inside India
                  <span className="text-blue-600"> Update</span>
                </h2>

              </div>

              <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                Independent news and updates from India and around the world.
              </p>

            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-500">

              <a
                href="/category/india"
                className="transition hover:text-blue-600"
              >
                India
              </a>

              <a
                href="/category/world"
                className="transition hover:text-blue-600"
              >
                World
              </a>

              <a
                href="/category/business"
                className="transition hover:text-blue-600"
              >
                Business
              </a>

              <a
                href="/category/technology"
                className="transition hover:text-blue-600"
              >
                Technology
              </a>

              <a
                href="/category/sports"
                className="transition hover:text-blue-600"
              >
                Sports
              </a>

            </div>

          </div>

          <div className="mt-8 border-t border-slate-200 pt-5 text-xs font-medium text-slate-400">
            © 2026 Inside India Update. All rights reserved.
          </div>

        </div>

      </footer>

    </main>
  );
}