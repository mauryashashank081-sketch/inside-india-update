import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: article, error } = await supabase
    .from("ai_news")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !article) {
    return (
      <main className="min-h-screen bg-white p-10 text-slate-900">
        <h1 className="text-3xl font-black">Article not found</h1>

        <p className="mt-3 text-slate-600">
          This article could not be found.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white"
        >
          ← Back to Home
        </Link>
      </main>
    );
  }

  const categoryPath =
    "/category/" + (article.category?.toLowerCase() || "");

  return (
    <main className="min-h-screen bg-white text-slate-900">

       {/* HEADER */}
<header className="border-b border-slate-200 bg-white">
  <div className="relative mx-auto flex max-w-7xl items-center justify-center px-3 py-4 sm:px-6 sm:py-5">

    {/* CENTER BRAND */}
    <Link
      href="/"
      className="flex items-center gap-1.5 whitespace-nowrap sm:gap-3"
    >
      <img
        src="/logo.webp"
        alt="Inside India Update"
        className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-slate-200 sm:h-11 sm:w-11"
      />

      <h1 className="text-[13px] font-black tracking-tight sm:text-2xl">
        Inside India
        <span className="text-blue-600"> Update</span>
      </h1>
    </Link>

    {/* HOME BUTTON */}
    <Link
      href="/"
      className="absolute right-3 whitespace-nowrap rounded-lg border border-slate-200 px-2 py-1.5 text-[11px] font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:right-6 sm:px-4 sm:py-2 sm:text-sm"
    >
      Home
    </Link>

  </div>
</header>

      {/* NAVIGATION */}
      <nav className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto whitespace-nowrap px-4 py-2.5">

          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            href="/category/india"
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-600"
          >
            India
          </Link>

          <Link
            href="/category/world"
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-600"
          >
            World
          </Link>

          <Link
            href="/category/politics"
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-600"
          >
            Politics
          </Link>

          <Link
            href="/category/business"
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-600"
          >
            Business
          </Link>

          <Link
            href="/category/technology"
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-600"
          >
            Technology
          </Link>

          <Link
            href="/category/sports"
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-600"
          >
            Sports
          </Link>

          <Link
            href="/category/entertainment"
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-600"
          >
            Entertainment
          </Link>

          <Link
            href="/category/education"
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-600"
          >
            Education
          </Link>

        </div>
      </nav>

      {/* ARTICLE */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">

          {/* BREADCRUMB */}
          <div className="mb-6 text-sm font-semibold text-slate-400">

            <Link
              href="/"
              className="hover:text-blue-600"
            >
              Home
            </Link>

            <span className="mx-2">/</span>

            <Link
              href={categoryPath}
              className="hover:text-blue-600"
            >
              {article.category}
            </Link>

          </div>

          {/* MAIN ARTICLE BOX */}
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">

            <div className="grid lg:grid-cols-2">

              {/* IMAGE */}
              <div className="relative min-h-[280px] overflow-hidden bg-slate-100 lg:min-h-[520px]">

                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[280px] items-center justify-center text-sm font-bold text-slate-400">
                    Inside India Update
                  </div>
                )}

              </div>

              {/* CONTENT */}
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">

                {/* CATEGORY */}
                <div className="flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-blue-600" />

                  <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                    {article.category}
                  </p>

                </div>

                {/* TITLE */}
                <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  {article.title}
                </h1>

                {/* DIVIDER */}
                <div className="mt-6 h-1 w-14 rounded-full bg-blue-600" />

                {/* SUMMARY */}
                <p className="mt-6 text-base font-medium leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  {article.summary || article.content}
                </p>

                {/* SOURCE */}
                <div className="mt-8 border-t border-slate-200 pt-5">

                  <p className="text-sm text-slate-500">
                    <span className="font-bold text-slate-700">
                      Source:
                    </span>{" "}
                    {article.source || "Inside India Update"}
                  </p>

                  {article.published_at && (
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      Published{" "}
                      {new Date(article.published_at).toLocaleString(
                        "en-IN",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )}
                    </p>
                  )}

                </div>

                {/* ORIGINAL SOURCE */}
                {article.source_url && (
                  <a
                    href={article.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-fit items-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                  >
                    Read Original Source →
                  </a>
                )}

              </div>

            </div>

          </article>

          {/* BACK */}
          <div className="mt-8">

            <Link
              href={categoryPath}
              className="text-sm font-bold text-slate-500 transition hover:text-blue-600"
            >
              ← Back to {article.category} News
            </Link>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-50">

        <div className="mx-auto max-w-7xl px-4 py-8">

          <div className="flex items-center justify-center gap-3">

            <img
              src="/logo.webp"
              alt="Inside India Update"
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />

            <h2 className="whitespace-nowrap text-xl font-black">
              Inside India
              <span className="text-blue-600"> Update</span>
            </h2>

          </div>

          <p className="mt-3 text-center text-sm text-slate-500">
            Independent news and updates from India and around the world.
          </p>

          <div className="mt-6 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
            © 2026 Inside India Update. All rights reserved.
          </div>

        </div>

      </footer>

    </main>
  );
}