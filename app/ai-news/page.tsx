export default function AINewsPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-black text-slate-900">
          🤖 AI News Inbox
        </h1>

        <p className="mt-2 text-slate-600">
          Review the latest AI-collected news before publishing.
        </p>

        <div className="mt-8 grid gap-6">
          <article className="rounded-xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                INDIA
              </span>

              <span className="text-sm text-slate-500">
                AI Draft
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-black">
              India announces major new development in technology
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              AI-generated summary of the news will appear here.
              You can review and edit it before publishing.
            </p>

            <div className="mt-5 flex gap-3">
              <button className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white">
                Publish
              </button>

              <button className="rounded-lg border px-5 py-2 font-semibold">
                Edit
              </button>

              <button className="rounded-lg border px-5 py-2 font-semibold text-red-600">
                Ignore
              </button>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}