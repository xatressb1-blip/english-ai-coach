export interface RecruiterPortraitSet {
  idle: string;
  listening: string;
  speaking1: string;
  speaking2: string;
}

export interface RecruiterProfile {
  id: string;
  name: string;
  shortName: string;
  title: string;
  style: string;
  accent: string;
  emoji: string;
  gradient: string;
  portraits: RecruiterPortraitSet;
  voicePattern: RegExp;
  voiceLang: string;
  voiceGender: "female" | "male";
  rate: number;
  pitch: number;
}

export const recruiters: RecruiterProfile[] = [
  {
    id: "emma",
    name: "Ms. Emma",
    shortName: "Emma",
    title: "Talent Acquisition Specialist",
    style: "Warm, encouraging, and suitable for first-time candidates.",
    accent: "American English",
    emoji: "👩‍💼",
    gradient: "from-blue-500 to-indigo-700",
    portraits: {
      idle: "/interview/recruiters/emma-idle.webp",
      listening: "/interview/recruiters/emma-listening.webp",
      speaking1: "/interview/recruiters/emma-speaking-1.webp",
      speaking2: "/interview/recruiters/emma-speaking-2.webp",
    },
    voicePattern: /samantha|zira|aria|jenny|google us english/i,
    voiceLang: "en-US",
    voiceGender: "female",
    rate: 0.92,
    pitch: 1.02,
  },
  {
    id: "james",
    name: "Mr. James",
    shortName: "James",
    title: "Hiring Manager",
    style: "Calm, direct, and focused on clear, structured answers.",
    accent: "British English",
    emoji: "👨‍💼",
    gradient: "from-slate-600 to-blue-800",
    portraits: {
      idle: "/interview/recruiters/james-idle.webp",
      listening: "/interview/recruiters/james-listening.webp",
      speaking1: "/interview/recruiters/james-speaking-1.webp",
      speaking2: "/interview/recruiters/james-speaking-2.webp",
    },
    voicePattern: /daniel|oliver|ryan|google uk english male/i,
    voiceLang: "en-GB",
    voiceGender: "male",
    rate: 0.9,
    pitch: 0.96,
  },
  {
    id: "sophia",
    name: "Ms. Sophia",
    shortName: "Sophia",
    title: "Graduate Recruitment Partner",
    style: "Friendly, energetic, and focused on potential and motivation.",
    accent: "Australian English",
    emoji: "👩🏻‍💼",
    gradient: "from-violet-500 to-fuchsia-700",
    portraits: {
      idle: "/interview/recruiters/sophia-idle.webp",
      listening: "/interview/recruiters/sophia-listening.webp",
      speaking1: "/interview/recruiters/sophia-speaking-1.webp",
      speaking2: "/interview/recruiters/sophia-speaking-2.webp",
    },
    voicePattern: /karen|catherine|natasha|australia/i,
    voiceLang: "en-AU",
    voiceGender: "female",
    rate: 0.94,
    pitch: 1.04,
  },
];

export const defaultRecruiter = recruiters[0];

export function getRecruiterById(id: string): RecruiterProfile {
  return recruiters.find((recruiter) => recruiter.id === id) ?? defaultRecruiter;
}
