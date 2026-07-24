"use client";

import { useState } from "react";

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
    "Education",
    "Teamwork",
    "Career",
  ];

  const filteredQuestions = questions.filter((question) => {

    const matchSearch =
      question.title
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchCategory =
      category === "All" ||
      question.category === category;

    return matchSearch && matchCategory;
  });

  return (
    <main className="min-h-screen bg-slate-100">

      <Navbar />

      <Hero />

      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6 p-10">

        {lessons.map((lesson) => (

          <LessonCard
            key={lesson.id}
            lesson={lesson}
          />

        ))}

      </div>

      <section className="max-w-6xl mx-auto px-10">

        <input
          type="text"
          placeholder="Search interview questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 mb-6"
        />

        <div className="flex gap-3 flex-wrap mb-8">

          {categories.map((item) => (

            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-4 py-2 rounded-lg transition
              ${
                category === item
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

      </section>

      <section className="max-w-6xl mx-auto p-10">

        <h2 className="text-3xl font-bold mb-6">

          Interview Questions

        </h2>

        <div className="grid grid-cols-3 gap-6">

          {filteredQuestions.map((question) => (

            <QuestionCard
              key={question.id}
              question={question}
            />

          ))}

        </div>

      </section>

    </main>
  );

}