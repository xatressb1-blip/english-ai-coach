import { InterviewQuestion } from "@/types/InterviewQuestion";

export const personalQuestions: InterviewQuestion[] = [
  {
    id: 1,

    category: "Personal",

    title: "Tell me about yourself.",

    description:
      "Introduce yourself briefly and professionally.",

    level: "Beginner",

    duration: 2,

    keywords: [
      "name",
      "education",
      "experience",
      "career goal",
    ],

    grammarFocus: [
      "Present Simple",
      "Present Perfect",
    ],

    vocabularyLevel: "A2-B1",

    sampleAnswer:
      "Hello. My name is John. I recently graduated from ABC College. I enjoy learning new technologies and working in a team. My goal is to become a software developer.",

    commonMistakes: [
      "Speaking too long",
      "Grammar mistakes",
      "No career goal",
      "No introduction",
    ],

    evaluationCriteria: {
      grammar: 20,
      vocabulary: 20,
      fluency: 20,
      coherence: 20,
      confidence: 20,
    },
  },

  {
    id: 2,

    category: "Personal",

    title: "What are your strengths?",

    description:
      "Describe your strengths with examples.",

    level: "Beginner",

    duration: 2,

    keywords: [
      "responsible",
      "teamwork",
      "hard-working",
      "communication",
    ],

    grammarFocus: [
      "Present Simple",
    ],

    vocabularyLevel: "A2-B1",

    sampleAnswer:
      "I am a responsible and hard-working person. I enjoy working in teams and I always try to finish my tasks on time.",

    commonMistakes: [
      "Listing strengths only",
      "No example",
      "Repeating words",
    ],

    evaluationCriteria: {
      grammar: 20,
      vocabulary: 20,
      fluency: 20,
      coherence: 20,
      confidence: 20,
    },
  },

  {
    id: 3,

    category: "Personal",

    title: "What are your weaknesses?",

    description:
      "Describe one weakness and explain how you improve it.",

    level: "Intermediate",

    duration: 2,

    keywords: [
      "weakness",
      "improve",
      "learning",
      "practice",
    ],

    grammarFocus: [
      "Present Simple",
      "Present Continuous",
    ],

    vocabularyLevel: "B1",

    sampleAnswer:
      "One of my weaknesses is public speaking. I am improving by practicing presentations and speaking English every day.",

    commonMistakes: [
      "Choosing a dangerous weakness",
      "No improvement plan",
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