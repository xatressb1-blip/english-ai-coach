import { InterviewQuestion } from "@/types/InterviewQuestion";

export const educationQuestions: InterviewQuestion[] = [
  {
    id: 4,

    category: "Education",

    title: "Tell me about your education.",

    description:
      "Introduce your major and what you have learned.",

    level: "Beginner",

    duration: 2,

    keywords: [
      "college",
      "major",
      "skills",
      "projects",
    ],

    grammarFocus: [
      "Present Perfect",
      "Past Simple",
    ],

    vocabularyLevel: "B1",

    sampleAnswer:
      "I am studying Information Technology. During my studies, I have learned programming, networking and database management. I also completed several practical projects.",

    commonMistakes: [
      "Only mentioning school name",
      "No skills",
    ],

    evaluationCriteria: {
      grammar: 20,
      vocabulary: 20,
      fluency: 20,
      coherence: 20,
      confidence: 20,
    },
  },
];