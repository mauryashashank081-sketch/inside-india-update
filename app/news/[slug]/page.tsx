import { createClient } from "@supabase/supabase-js";

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
      <main className="min-h-screen bg-white p-10">
        <h1 className="text-3xl font-bold text-slate-900">
          Article not found
        </h1>

        <p className="mt-3 text-slate-600">
          This article could not be found.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-4xl px-6 py-10">

        <p className="mb-3 text-sm font-bold uppercase tracking-wide text-blue-600">
          {article.category}
        </p>

        <h1 className="text-4xl font-black leading-tight text-slate-900 md:text-5xl">
          {article.title}
        </h1>

        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="mt-8 w-full rounded-2xl object-cover"
          />
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Summary
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-700">
            {article.summary || article.content}
          </p>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">
            <strong className="text-slate-700">Source:</strong>{" "}
            {article.source}
          </p>

          {article.source_url && (
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block font-semibold text-blue-600 hover:underline"
            >
              Read original source →
            </a>
          )}
        </div>

      </article>
    </main>
  );
}