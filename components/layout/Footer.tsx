"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-slate-900 text-white">

      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}

          <div>

            <h2 className="text-2xl font-bold">

              🤖 English AI Coach

            </h2>

            <p className="mt-4 leading-7 text-slate-300">

              Learn English.

              <br />

              Build Confidence.

              <br />

              Ace Interviews.

            </p>

            <div className="mt-5 inline-block rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold">

              Beta 0.9

            </div>

          </div>

          {/* Navigation */}

          <div>

            <h3 className="mb-4 text-lg font-semibold">

              Quick Links

            </h3>

            <div className="flex flex-col gap-3">

              <Link href="/" className="hover:text-blue-400">
                Home
              </Link>

              <Link href="/interview" className="hover:text-blue-400">
                Interview
              </Link>

              <Link href="/history" className="hover:text-blue-400">
                History
              </Link>

              <Link href="/dashboard" className="hover:text-blue-400">
                Dashboard
              </Link>

            </div>

          </div>

          {/* About */}

          <div>

            <h3 className="mb-4 text-lg font-semibold">

              Developed by

            </h3>

            <p className="leading-7 text-slate-300">

              Faculty of Information Technology

              <br />

              College of Agricultural Mechanics

            </p>

          </div>

        </div>

        <div className="mt-10 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">

          © 2026 English AI Coach

        </div>

      </div>

    </footer>
  );
}