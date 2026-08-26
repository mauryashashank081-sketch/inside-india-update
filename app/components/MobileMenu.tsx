"use client";

import { useState } from "react";

const menuItems = [
  ["Home", "/"],
  ["India", "/category/india"],
  ["World", "/category/world"],
  ["Politics", "/category/politics"],
  ["Business", "/category/business"],
  ["Technology", "/category/technology"],
  ["Sports", "/category/sports"],
  ["Entertainment", "/category/entertainment"],
  ["Education", "/category/education"],
];

const moreItems = [
  ["Health", "/category/health"],
  ["Science", "/category/science"],
  ["Lifestyle", "/category/lifestyle"],
  ["Crime", "/category/crime"],
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* ================= MENU BUTTON ================= */}

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
      >
        ☰
      </button>

      {/* ================= MENU OVERLAY ================= */}

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/40"
          onClick={() => setOpen(false)}
        >
          {/* ================= MENU PANEL ================= */}

          <div
            className="absolute left-0 top-0 flex h-full w-[88%] max-w-md flex-col overflow-hidden bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ================= HEADER ================= */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src="/logo.webp"
                  alt="Inside India Update"
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />

                <h2 className="whitespace-nowrap text-lg font-black text-slate-900">
                  Inside India
                  <span className="text-blue-600"> Update</span>
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-2xl text-slate-600 transition hover:bg-slate-50"
              >
                ×
              </button>
            </div>

            {/* ================= SCROLLABLE CONTENT ================= */}

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">

              {/* EXPLORE */}

              <div className="px-5 pb-2 pt-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                  Explore
                </p>
              </div>

              {/* CATEGORIES */}

              <div className="grid grid-cols-2 gap-x-2 px-5 pb-5">
                {menuItems.map(([name, href]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="border-b border-slate-100 px-2 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
                  >
                    {name}
                  </a>
                ))}
              </div>

              {/* ================= MORE ================= */}

              <div className="border-t border-slate-200 px-5 py-5">

                <button
                  type="button"
                  onClick={() => setMoreOpen((value) => !value)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    More
                  </p>

                  <span className="text-sm font-bold text-slate-400">
                    {moreOpen ? "−" : "+"}
                  </span>
                </button>

                {/* MORE ITEMS */}

                {moreOpen && (
                  <div className="mt-3 grid grid-cols-2 gap-x-2">
                    {moreItems.map(([name, href]) => (
                      <a
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        className="border-b border-slate-100 px-2 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
                      >
                        {name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* ================= FOLLOW ================= */}

              <div className="border-t border-slate-200 bg-slate-50 px-5 py-5">
                <p className="text-sm font-bold text-slate-500">
                  Follow Inside India Update
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}