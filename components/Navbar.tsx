"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}

        <Link href="/" className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-xl text-white">

            🤖

          </div>

          <div>

            <h1 className="text-lg font-bold text-slate-800">

              English AI Coach

            </h1>

            <p className="text-xs text-slate-500">

              Beta 0.9

            </p>

          </div>

        </Link>

        {/* Menu */}

        <div className="hidden items-center gap-8 md:flex">

          <Link
            href="/"
            className="font-medium text-slate-700 transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            href="/interview"
            className="font-medium text-slate-700 transition hover:text-blue-600"
          >
            Interview
          </Link>

          <Link
            href="/dashboard"
            className="font-medium text-slate-700 transition hover:text-blue-600"
          >
            Dashboard
          </Link>

          <Link
            href="/history"
            className="font-medium text-slate-700 transition hover:text-blue-600"
          >
            History
          </Link>

          <Link
            href="/about"
            className="font-medium text-slate-700 transition hover:text-blue-600"
          >
            About
          </Link>

        </div>

        {/* Status */}

        <div className="hidden items-center gap-2 rounded-full bg-green-100 px-3 py-1 md:flex">

          <div className="h-2 w-2 rounded-full bg-green-500"></div>

          <span className="text-sm font-medium text-green-700">

            AI Ready

          </span>

        </div>

      </div>

    </nav>
  );
}