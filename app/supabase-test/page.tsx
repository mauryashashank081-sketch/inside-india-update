import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default async function SupabaseTest() {
  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen p-10">
        <h1 className="text-3xl font-black">Supabase Error</h1>
        <p className="mt-4 text-red-600">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <h1 className="mb-8 text-4xl font-black">
        Supabase News Test
      </h1>

      <div className="space-y-5">
        {news?.map((item) => (
          <article
            key={item.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <p className="text-sm font-bold text-blue-600">
              {item.category}
            </p>

            <h2 className="mt-2 text-2xl font-black">
              {item.title}
            </h2>

            <p className="mt-3 text-slate-600">
              {item.content}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}