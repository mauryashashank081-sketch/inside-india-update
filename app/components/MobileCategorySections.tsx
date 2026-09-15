"use client";

import { useRef, useState } from "react";

type NewsItem = {
  id: number | string;
  title: string;
  summary: string | null;
  category: string | null;
  image: string | null;
  slug: string;
  created_at?: string | null;
};

type Props = {
  news: NewsItem[];
};

const categories = [
  "Home",
  "India",
  "World",
  "Politics",
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
  "Education",
  "Health",
  "Science",
  "Lifestyle",
  "Crime",
];

export default function MobileCategorySections({ news }: Props) {
  const [activeCategory, setActiveCategory] = useState("Home");
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>(
    {}
  );
  const [currentPages, setCurrentPages] = useState<Record<string, number>>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const lastActiveCategoryRef = useRef("Home");

  const scrollNavToCategory = (category: string) => {
    const nav = navRef.current;
    const activeButton = document.getElementById(
      `mobile-nav-${category.toLowerCase()}`
    ) as HTMLElement | null;

    if (!nav || !activeButton) return;

    const target =
      activeButton.offsetLeft +
      activeButton.offsetWidth / 2 -
      nav.clientWidth / 2;

    nav.scrollTo({
      left: Math.max(
        0,
        Math.min(target, nav.scrollWidth - nav.clientWidth)
      ),
      behavior: "smooth",
    });
  };

  const changeCategory = (category: string) => {
    lastActiveCategoryRef.current = category;
    setActiveCategory(category);

    const container = scrollRef.current;
    const section = document.getElementById(
      `mobile-category-${category.toLowerCase()}`
    ) as HTMLElement | null;

    if (container && section) {
      container.scrollTo({
        left: section.offsetLeft,
        behavior: "smooth",
      });
    }

    requestAnimationFrame(() => {
      scrollNavToCategory(category);
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const sections = Array.from(
      container.children
    ) as HTMLElement[];

    let closest = "Home";
    let smallestDistance = Infinity;

    sections.forEach((section) => {
      const distance = Math.abs(
        section.offsetLeft - container.scrollLeft
      );

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closest = section.dataset.category || "Home";
      }
    });

    if (closest !== lastActiveCategoryRef.current) {
      lastActiveCategoryRef.current = closest;
      setActiveCategory(closest);

      requestAnimationFrame(() => {
        scrollNavToCategory(closest);
      });
    }
    };

  const getCategoryNews = (category: string) => {
    if (category === "Home") {
      return news;
    }

    return news.filter(
      (item) =>
        item.category?.toLowerCase() === category.toLowerCase()
    );
  };
   const getTimeAgo = (createdAt: string | null | undefined) => {
  if (!createdAt) return "Latest Update";

  const created = new Date(createdAt).getTime();
  const now = Date.now();

  const diffInMinutes = Math.floor(
    (now - created) / (1000 * 60)
  );

  if (diffInMinutes < 60) {
    return `Published ${Math.max(1, diffInMinutes)} ${
      diffInMinutes === 1 ? "minute" : "minutes"
    } ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `Published ${diffInHours} ${
      diffInHours === 1 ? "hour" : "hours"
    } ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  return `Published ${diffInDays} ${
    diffInDays === 1 ? "day" : "days"
  } ago`;
};
  const renderNewsCard = (item: NewsItem) => (
    <a
      key={item.id}
      href={`/news/${item.slug}`}
      className="group block min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
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

        <h3 className="mt-2 line-clamp-3 break-words text-base font-black leading-snug text-slate-950 transition group-hover:text-blue-600">
          {item.title}
        </h3>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400">
           {getTimeAgo(item.created_at)}
          </span>

          <span className="text-sm font-black text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
            →
          </span>
        </div>
      </div>
    </a>
  );

  const renderCategoryCard = (item: NewsItem) => (
    <a
      key={item.id}
      href={`/news/${item.slug}`}
      className="group block min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
    >
      {item.image ? (
        <div className="h-56 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex h-56 items-center justify-center bg-slate-100">
          <span className="text-xs font-bold text-slate-400">
            Inside India Update
          </span>
        </div>
      )}

      <div className="p-5">
        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-600">
          {item.category}
        </span>

        <h3 className="mt-2 line-clamp-3 break-words text-xl font-black leading-snug text-slate-950 transition group-hover:text-blue-600">
          {item.title}
        </h3>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400">
             {getTimeAgo(item.created_at)}
          </span>

          <span className="text-sm font-black text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
            →
          </span>
        </div>
      </div>
    </a>
  );

  const getVisibleCount = (category: string) =>
    visibleCounts[category] ?? (category === "Home" ? 25 : 12);

  const showMore = (category: string) => {
    setVisibleCounts((current) => ({
      ...current,
      [category]:
        getVisibleCount(category) + (category === "Home" ? 25 : 12),
    }));
  };

  const viewMoreButton = (category: string, hasMore: boolean) =>
    hasMore ? (
      <button
        type="button"
        onClick={() => showMore(category)}
        className="mx-auto mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-1.5 text-base font-black text-white transition hover:bg-blue-700 active:scale-[0.99]"
      >
        View More
        <span className="text-2xl font-normal leading-none">›</span>
      </button>
    ) : null;
       const categoryItemsPerPage = 12;

const getCurrentPage = (category: string) =>
  currentPages[category] ?? 1;
    const setCategoryPage = (category: string, page: number) => {
  setCurrentPages((current) => ({
    ...current,
    [category]: page,
  }));

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
 const categoryPagination = (category: string, totalItems: number) => {
  const totalPages = Math.ceil(totalItems / categoryItemsPerPage);
  const currentPage = getCurrentPage(category);

  if (totalPages <= 1) return null;

  let pages: (number | string)[] = [];

  if (currentPage <= 3) {
    pages = [1, 2, 3];

    if (totalPages > 4) {
      pages.push("...");
    }

    if (totalPages > 3) {
      pages.push(totalPages);
    }
  } else if (currentPage >= totalPages - 2) {
    pages = [1];

    if (totalPages > 4) {
      pages.push("...");
    }

    for (let i = Math.max(2, totalPages - 2); i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages = [
      currentPage,
      currentPage + 1,
      currentPage + 2,
      "...",
      totalPages,
    ];
  }

  return (
    <div className="mt-8 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-2 py-1 shadow-sm">
      {/* First + Previous */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => setCategoryPage(category, 1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center text-slate-400 disabled:opacity-30"
        >
          |‹
        </button>

        <button
          type="button"
          onClick={() => setCategoryPage(category, currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center text-slate-400 disabled:opacity-30"
        >
          ‹
        </button>
      </div>

      {/* Page numbers */}
      <div className="flex min-w-0 items-center justify-center gap-1">
        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`dots-${index}`}
              className="flex h-8 w-7 items-center justify-center text-sm font-bold text-slate-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => setCategoryPage(category, page as number)}
              className={`flex h-6 min-w-9 items-center justify-center rounded-lg px-1 text-sm font-bold ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "text-slate-500"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next + Last */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => setCategoryPage(category, currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center text-slate-400 disabled:opacity-30"
        >
          ›
        </button>

        <button
          type="button"
          onClick={() => setCategoryPage(category, totalPages)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center text-slate-400 disabled:opacity-30"
        >
          ›|
        </button>
      </div>
    </div>
  );
};
  const mobileFooter = () => (
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
  );

  return (
    <div className="sm:hidden overflow-y-clip">
      {/* MOBILE CATEGORY STRIP */}
      <div className="relative z-40 border-b border-slate-200 bg-white shadow-sm">
        <div
          ref={navRef}
          className="flex w-full overflow-x-auto px-3 py-2"
          style={{
                  scrollbarWidth: "none",
               msOverflowStyle: "none",
               }}
        >
          {categories.map((category) => {
            const active = activeCategory === category;

            return (
              <button
                key={category}
                id={`mobile-nav-${category.toLowerCase()}`}
                type="button"
                onClick={() => changeCategory(category)}
                className={`relative mr-1 shrink-0 px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "text-blue-600 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* SWIPEABLE MOBILE CONTENT */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full items-start flex-nowrap snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
      style={{
         scrollbarWidth: "none",
                msOverflowStyle: "none",
           }}
      >
        {categories.map((category) => {
          const categoryNews = getCategoryNews(category);

          return (
            <section
              key={category}
              id={`mobile-category-${category.toLowerCase()}`}
              data-category={category}
              className={`w-full shrink-0 snap-start ${
           activeCategory === category ? "" : "h-0 overflow-hidden"
               }`}
            >
              {category === "Home" ? (
                <>
                  {/* ================= TOP STORIES ================= */}
                  <section className="w-full overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
                    <div className="mx-auto w-full max-w-7xl px-4 py-8">
                      <div className="mb-7 flex items-end justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />

                            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                              Top Stories
                            </p>
                          </div>

                          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                            Latest News
                          </h2>

                          <div className="mt-3 h-1 w-12 rounded-full bg-blue-600" />
                        </div>
                      </div>

                      {categoryNews[0] && (
                        <div className="grid min-w-0 gap-5">
                          {/* FEATURED STORY */}
                          <article className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            {categoryNews[0].image ? (
                              <div className="relative h-[300px] overflow-hidden">
                                <img
                                  src={categoryNews[0].image}
                                  alt={categoryNews[0].title}
                                  className="h-full w-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                                <div className="absolute inset-x-0 bottom-0 p-5">
                                  <span className="inline-flex rounded-md bg-blue-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white">
                                    Top Story
                                  </span>

                                  <h3 className="mt-3 break-words text-2xl font-black leading-tight text-white">
                                    {categoryNews[0].title}
                                  </h3>

                                  <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-slate-200">
                                    {categoryNews[0].summary}
                                  </p>

                                  <a
                                    href={`/news/${categoryNews[0].slug}`}
                                    className="mt-5 inline-flex items-center rounded-lg bg-white px-4 py-2.5 text-sm font-black text-slate-900"
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

                                <h3 className="mt-3 break-words text-2xl font-black text-slate-950">
                                  {categoryNews[0].title}
                                </h3>
                              </div>
                            )}
                          </article>

                          {/* BREAKING NEWS */}
                          <aside className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4">
                              <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                                  Latest
                                </p>

                                <h3 className="mt-1 text-xl font-black text-slate-950">
                                  Breaking News
                                </h3>
                              </div>

                              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-black text-red-600">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
                                LIVE
                              </span>
                            </div>

                            <div className="divide-y divide-slate-100">
                              {categoryNews.slice(0, 5).map((item) => (
                                <a
                                  key={item.id}
                                  href={`/news/${item.slug}`}
                                  className="group flex min-w-0 gap-3 py-3.5 first:pt-0 last:pb-0"
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

                                    <h4 className="mt-1 line-clamp-3 break-words text-sm font-bold leading-snug text-slate-800 transition group-hover:text-blue-600">
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
                  <section className="w-full overflow-hidden bg-white">
                    <div className="mx-auto w-full max-w-7xl px-4 py-10">
                      <div className="mb-7 flex items-end justify-between border-b border-slate-200 pb-5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />

                            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                              Explore
                            </p>
                          </div>

                          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                            Latest Stories
                          </h2>
                        </div>
                      </div>

                      <div className="grid min-w-0 gap-5">
                        {categoryNews
                          .slice(1, 1 + getVisibleCount("Home"))
                          .map(renderNewsCard)}
                      </div>

                      {viewMoreButton(
                        "Home",
                        categoryNews.length - 1 >
                          getVisibleCount("Home")
                      )}
                    </div>
                  </section>

                  {/* ================= HOME FOOTER ================= */}
                  {mobileFooter()}
                </>
              ) : (
                /* ================= CATEGORY NEWS ================= */
                <section className="w-full overflow-hidden bg-slate-50">
                  <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-10">
                    <div className="mb-8">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />

                        <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                          Latest Updates
                        </p>
                      </div>

                      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                        {category} News
                      </h2>

                      <div className="mt-3 h-1 w-12 rounded-full bg-blue-600" />

                      <p className="mt-5 text-base font-medium text-slate-500">
                        Latest {category.toLowerCase()} news and updates
                      </p>

                      <div className="mt-8 border-b border-slate-200" />
                    </div>

                    {categoryNews.length > 0 ? (
                      <>
                        <div className="grid gap-5">
                         {categoryNews
                     .slice(
                          (getCurrentPage(category) - 1) * categoryItemsPerPage,
                           getCurrentPage(category) * categoryItemsPerPage
                            )
                              .map(renderCategoryCard)}
                         </div>
                       {categoryPagination(category, categoryNews.length)}

                        {mobileFooter()}
                      </>
                    ) : (
                      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                        <p className="text-sm font-semibold text-slate-400">
                          No news available in {category}.
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}