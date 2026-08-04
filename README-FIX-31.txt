FIX 31 - REALISTIC INTERVIEW FLOW
=================================

Changes
-------
1. Added a spoken recruiter briefing before Question 1.
2. Added company, position, recruiter, and interview-format details to the briefing.
3. Mock Interview now keeps the transcript and detailed scores private until the final report.
4. Replaced per-question detailed feedback with a private Submit Answer step.
5. Added short, natural recruiter acknowledgements between questions.
6. Added a spoken recruiter closing before the final report.
7. Reduced mobile vertical clutter and kept the main actions full-width on smartphones.
8. Guided Practice is not changed.
9. The 10 main interview questions are not changed.

New files
---------
components/interview/InterviewOpening.tsx
components/interview/InterviewClosing.tsx
components/interview/MockInterviewEvaluation.tsx
README-FIX-31.txt

Modified files
--------------
components/interview/InterviewEngine.tsx
components/SpeechRecorder.tsx
