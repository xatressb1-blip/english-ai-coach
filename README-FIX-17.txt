MOBILE FIX 17 - UNIFIED LEARNING PATH AND MOCK INTERVIEW

Copy every file in this package into the same relative location in:
C:\AI_Project\english-ai-mobile-fix-01

Main changes:
1. data/interviewQuestions.ts is now the single source of truth for all 10 questions.
2. Home shows one Learning Path only; the duplicated Interview Questions section is removed.
3. Home has a separate Full Mock Interview card linking to /interview.
4. Guided Practice /question/[id] no longer uses the Mock Interview progress/navigation state.
5. AI evaluation on /question/[id] receives the exact selected question instead of always using question 1 from global interview state.
6. Old data files remain only as compatibility exports generated from the single source.

After copying:
  npm run build
  npm run dev

Expected Home:
- 10 Learning Path cards
- 1 Full Mock Interview section
- no duplicate Interview Questions section
