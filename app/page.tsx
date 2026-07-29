"use client";

import { useState } from "react";

import Hero from "@/components/Hero";
import LessonCard from "@/components/LessonCard";
import Navbar from "@/components/Navbar";
import QuestionCard from "@/components/QuestionCard";
import { lessons } from "@/data/lessons";
import { questions } from "@/data/questions";

const CATEGORIES = ["All", "Personal", "Education", "Teamwork", "Career"];

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredQuestions = questions.filter((question) => {
    const matchSearch = question.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchCategory = category === "All" || question.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-100">
      <Navbar />
      <Hero />

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Practice lessons
          </h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Choose a focused lesson before starting your interview.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <label htmlFor="question-search" className="sr-only">
            Search interview questions
          </label>
          <input
            id="question-search"
            type="search"
            placeholder="Search interview questions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  category === item
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
          Interview Questions
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No matching interview questions were found.
          </div>
        )}
      </section>
    </main>
  );
}
