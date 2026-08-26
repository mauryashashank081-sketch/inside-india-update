import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import NewsSearch from "../../components/NewsSearch";
import WeatherBar from "../../components/WeatherBar";
import MobileMenu from "../../components/MobileMenu";
import DesktopMoreMenu from "../../components/DesktopMoreMenu";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

const categories = [
  ["India", "/category/india"],
  ["World", "/category/world"],
  ["Politics", "/category/politics"],
  ["Business", "/category/business"],
  ["Technology", "/category/technology"],
  ["Sports", "/category/sports"],
  ["Entertainment", "/category/entertainment"],
  ["Education", "/category/education"],
];

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
      <main className="min-h-screen w-full overflow-x-hidden bg-white p-6 text-slate-900 sm:p-10">
        <h1 className="text-3xl font-black">Supabase Error</h1>

        <p className="mt-4 break-words text-red-600">
          {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-slate-900">

      {/* ================================================== */}
      {/* WEATHER */}
      {/* ================================================== */}

      <div className="w-full overflow-hidden border-b border-slate-200 bg-slate-50">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-3 py-2 sm:justify-end sm:px-4">
          <WeatherBar />
        </div>
      </div>

      {/* ================================================== */}
      {/* MAIN HEADER */}
      {/* ================================================== */}

      <header className="w-full border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl">

          <div className="relative flex min-h-[72px] w-full items-center px-3 py-3 sm:min-h-[82px] sm:px-4">

            {/* ================= LEFT : MENU ================= */}

            <div className="flex w-[72px] shrink-0 items-center sm:w-1/4">

              <MobileMenu />

              <span className="ml-2 hidden text-sm font-bold text-slate-600 sm:block">
                Menu
              </span>

            </div>

            {/* ================= CENTER : LOGO ================= */}

            <Link
              href="/"
              className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 sm:gap-3"
            >

              <img
                src="/logo.webp"
                alt="Inside India Update"
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-slate-200 sm:h-12 sm:w-12"
              />

              <div className="hidden sm:block">

                <h1 className="whitespace-nowrap text-2xl font-black tracking-tight text-slate-900">
                  Inside India
                  <span className="text-blue-600"> Update</span>
                </h1>

              </div>

              {/* MOBILE BRAND NAME */}

              <h1 className="whitespace-nowrap text-[15px] font-black tracking-tight text-slate-900 sm:hidden">
                Inside India
                <span className="text-blue-600"> Update</span>
              </h1>

            </Link>

            {/* ================= RIGHT : SEARCH ================= */}

            <div className="ml-auto flex w-[72px] shrink-0 items-center justify-end sm:w-1/4">

              <NewsSearch news={news ?? []} />

              <span className="ml-2 hidden items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-black text-red-600 sm:flex">

                <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />

                LIVE

              </span>

            </div>

          </div>

        </div>
      </header>

      {/* ================================================== */}
      {/* CATEGORY NAVIGATION */}
      {/* ================================================== */}

      <nav className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">

        <div className="mx-auto w-full max-w-7xl px-3 sm:px-4">

          <div
            className="flex w-full items-center gap-1 overflow-x-auto overflow-y-visible py-2.5"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >

            {/* ================= HOME ================= */}

            <Link
              href="/"
              className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
            >
              Home
            </Link>

            {/* ================= CATEGORIES ================= */}

            {categories.map(([name, href]) => (

              <Link
                key={href}
                href={href}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  categoryName.toLowerCase() === name.toLowerCase()
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                }`}
              >
                {name}
              </Link>

            ))}

            {/* ================= MORE ================= */}

            <div className="relative shrink-0">
              <DesktopMoreMenu />
            </div>

          </div>

        </div>

      </nav>

      {/* ================================================== */}
      {/* CATEGORY CONTENT */}
      {/* ================================================== */}

      <section className="w-full overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">

        <div className="mx-auto w-full max-w-7xl px-4 py-9 sm:py-12">

          {/* ================= CATEGORY HEADING ================= */}

          <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-6">

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />

                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                  Latest Updates
                </p>

              </div>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {categoryName} News
              </h2>

              <div className="mt-3 h-1 w-12 rounded-full bg-blue-600" />

              <p className="mt-4 text-sm font-medium text-slate-500 sm:text-base">
                Latest {categoryName.toLowerCase()} news and updates
              </p>

            </div>

            <span className="hidden shrink-0 text-sm font-semibold text-slate-400 sm:block">
              Updated regularly
            </span>

          </div>

          {/* ================================================== */}
          {/* NEWS GRID */}
          {/* ================================================== */}

          {news && news.length > 0 ? (

            <div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {news.map((item) => (

                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group block min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl active:-translate-y-1 active:border-blue-200 active:shadow-lg"
                >

                  {/* ================= IMAGE ================= */}

                  {item.image ? (

                    <div className="h-48 overflow-hidden bg-slate-100">

                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                    </div>

                  ) : (

                    <div className="flex h-48 items-center justify-center bg-slate-100">

                      <span className="text-xs font-bold text-slate-400">
                        Inside India Update
                      </span>

                    </div>

                  )}

                  {/* ================= CONTENT ================= */}

                  <div className="p-5">

                    {/* CATEGORY */}

                    <div className="flex items-center gap-2">

                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-600">
                        {item.category}
                      </p>

                    </div>

                    {/* TITLE */}

                    <h3 className="mt-2 line-clamp-3 break-words text-xl font-black leading-snug text-slate-950 transition duration-200 group-hover:text-blue-600">
                      {item.title}
                    </h3>

                    {/* SUMMARY */}

                    <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-slate-600">
                      {item.summary}
                    </p>

                    {/* SOURCE + READ MORE */}

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">

                      <span className="min-w-0 truncate text-xs font-semibold text-slate-400">
                        {item.source || "Inside India Update"}
                      </span>

                      <span className="shrink-0 text-sm font-black text-slate-300 transition duration-200 group-hover:translate-x-1 group-hover:text-blue-600">
                        Read Full Story →
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          ) : (

            /* ================= NO NEWS ================= */

            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                📰
              </div>

              <h2 className="mt-4 text-xl font-black text-slate-900">
                No {categoryName} news available
              </h2>

              <p className="mt-2 text-sm font-medium text-slate-500">
                Published news for this category will appear here.
              </p>

              <Link
                href="/"
                className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Back to Home
              </Link>

            </div>

          )}

        </div>

      </section>

      {/* ================================================== */}
      {/* FOOTER */}
      {/* ================================================== */}

      <footer className="w-full overflow-hidden border-t border-slate-200 bg-slate-50">

        <div className="mx-auto w-full max-w-7xl px-4 py-9">

          <div className="flex flex-col justify-between gap-7 sm:flex-row">

            {/* BRAND */}

            <div className="min-w-0">

              <div className="flex items-center gap-3">

                <img
                  src="/logo.webp"
                  alt="Inside India Update"
                  className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
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

            {/* FOOTER LINKS */}

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-500">

              <Link
                href="/category/india"
                className="transition hover:text-blue-600"
              >
                India
              </Link>

              <Link
                href="/category/world"
                className="transition hover:text-blue-600"
              >
                World
              </Link>

              <Link
                href="/category/politics"
                className="transition hover:text-blue-600"
              >
                Politics
              </Link>

              <Link
                href="/category/business"
                className="transition hover:text-blue-600"
              >
                Business
              </Link>

              <Link
                href="/category/technology"
                className="transition hover:text-blue-600"
              >
                Technology
              </Link>

              <Link
                href="/category/sports"
                className="transition hover:text-blue-600"
              >
                Sports
              </Link>

            </div>

          </div>

          {/* COPYRIGHT */}

          <div className="mt-8 border-t border-slate-200 pt-5 text-xs font-medium text-slate-400">
            © 2026 Inside India Update. All rights reserved.
          </div>

        </div>

      </footer>

    </main>
  );
}