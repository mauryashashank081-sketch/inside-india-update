"use client";

import { useEffect, useRef, useState } from "react";

type NewsItem = {
  id: number;
  title: string;
  category: string;
  slug: string;
};

export default function NewsSearch({ news }: { news: NewsItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  // Auto close after 5 seconds only when search is empty + outside click
  useEffect(() => {
    if (!open) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    // Search खाली हो तो 5 seconds बाद अपने-आप close
    if (!query.trim()) {
      timer = setTimeout(() => {
        setOpen(false);
      }, 5000);
    }

    // बाहर click करने पर तुरंत close
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }

      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, query]);

  const results = news.filter((item) => {
    const text = `${item.title} ${item.category}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <div ref={searchRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Search"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
      >
        🔍
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Inside India Update..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
          />

          {query && (
            <div className="mt-2 max-h-72 overflow-y-auto">
              {results.length > 0 ? (
                results.map((item) => (
                  <a
                    key={item.id}
                    href={`/news/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="block border-b border-slate-100 px-2 py-3 last:border-0 hover:bg-slate-50"
                  >
                    <p className="text-[10px] font-bold uppercase text-blue-600">
                      {item.category}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {item.title}
                    </p>
                  </a>
                ))
              ) : (
                <p className="p-3 text-center text-sm text-slate-500">
                  No news found
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}