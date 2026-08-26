"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const moreItems = [
  ["Health", "/category/health"],
  ["Science", "/category/science"],
  ["Lifestyle", "/category/lifestyle"],
  ["Crime", "/category/crime"],
];

export default function DesktopMoreMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Browser me mount hone ke baad portal available hoga
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();

      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    };

    // Immediately position set
    updatePosition();

    // 5 seconds baad automatically close
    const timer = setTimeout(() => {
      setOpen(false);
    }, 5000);

    // Scroll / resize par position update
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    // Outside click
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearTimeout(timer);

      window.removeEventListener(
        "scroll",
        updatePosition,
        true
      );

      window.removeEventListener(
        "resize",
        updatePosition
      );

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [open]);

  return (
    <>
      {/* ================= MORE BUTTON ================= */}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex shrink-0 items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
      >
        More

        <span className="text-xs">
          {open ? "⌃" : "⌄"}
        </span>
      </button>

      {/* ================= DROPDOWN ================= */}

      {mounted &&
        open &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-[99999] w-60 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
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
          </div>,
          document.body
        )}
    </>
  );
}