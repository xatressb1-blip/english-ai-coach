"use client";

import Link from "next/link";
import { useState } from "react";

const MENU_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/interview", label: "Interview" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl text-white">
            🤖
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-slate-800 sm:text-lg">
              English AI Coach
            </h1>
            <p className="text-xs text-slate-500">Beta 0.9</p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-medium text-slate-700 transition hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 rounded-full bg-green-100 px-3 py-1 lg:flex">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-green-700">AI Ready</span>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-2xl text-slate-700 shadow-sm lg:hidden"
          aria-expanded={menuOpen}
          aria-label="Open navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 shadow-lg lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
