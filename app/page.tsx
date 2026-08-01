"use client";

import { useMemo, useState } from "react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LessonCard from "@/components/LessonCard";
import QuestionCard from "@/components/QuestionCard";

import { lessons } from "@/data/lessons";
import { questions } from "@/data/questions";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Personal",
    "Company Fit",
    "Goals",
    "Teamwork",
    "Work Style",
  ];

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchSearch = question.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "All" ||
        question.category === category;

      return matchSearch && matchCategory;
    });
  }, [search, category]);

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Practice lessons
          </h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Choose one of the 10 interview practice lessons and build confidence step by step.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <input
            type="text"
            placeholder="Search interview questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500"
          />

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${
                  category === item
                    ? "bg-blue-600 text-white"
                    : "border border-slate-300 bg-white text-slate-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Interview Questions
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Each question includes a confident sample answer to guide practice and support AI evaluation.
            </p>
          </div>
          <div className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filteredQuestions.length}</span> / {questions.length} questions
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      </section>
    </main>
  );
}
