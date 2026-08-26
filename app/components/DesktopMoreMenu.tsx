"use client";

import { useEffect, useRef, useState } from "react";

const moreItems = [
  ["Health", "/category/health"],
  ["Science", "/category/science"],
  ["Lifestyle", "/category/lifestyle"],
  ["Crime", "/category/crime"],
];

export default function DesktopMoreMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Outside click + auto close
  useEffect(() => {
    if (!open) return;

    // 5 seconds बाद अपने-आप close
    const timer = setTimeout(() => {
      setOpen(false);
    }, 5000);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
      >
        More
        <span className="text-xs">{open ? "⌃" : "⌄"}</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-60 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          {moreItems.map(([name, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
            >
              {name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}