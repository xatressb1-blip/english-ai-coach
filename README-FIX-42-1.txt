FIX 42.1 — AUTHENTIC CLASSROOM INTERVIEW FLOW
=============================================

Purpose
-------
Integrate Classroom Rapid Mode into the Enter Mock Interview experience while
keeping /classroom as a standalone route, and make the classroom activity feel
like a short professional job interview rather than a three-question quiz.

Fixed presentation team
-----------------------
Candidate: MrHuy
Observer 1 — Content & Response Structure: MrLong
Observer 2 — English Language Performance: MrKhánh
Observer 3 — Professional Interview Performance: MrHoàng

Classroom interview flow
------------------------
1. Create Classroom Session and connect the three fixed observer stations.
2. Interview Opening — exactly two communication ideas:
   a) Greeting & Welcome.
   b) Readiness to Begin.
3. Q1 → Q2 → Q3. AI evaluates only these three answers in the background.
4. Professional Closing.
5. Teacher Summary using the existing AI/Backup evidence + observer rubrics.

Important behavior
------------------
- Opening and closing do NOT call Gemini and do NOT affect Q1–Q3 AI scores.
- Observer 3 can use the opening/closing as human evidence for professional
  etiquette, confidence, listening, eye contact, posture, voice and pace.
- Classroom Rapid Mode remains available directly at /classroom.
- /interview now starts with a mode selector:
    Individual Mock Interview
    Classroom Rapid Mode
- Three role-specific QR links remain intact.
- Existing Fix 42 rubric engine, background evaluation, no-transcript retry,
  local backup rubric and teacher summary logic are preserved.

Changed files
-------------
components/interview/InterviewModeSelection.tsx   NEW
components/interview/InterviewEngine.tsx
components/classroom/ClassroomRapidInterview.tsx
app/classroom-observer/page.tsx
services/classroomSessionTypes.ts
services/classroomSessionStore.ts
README-FIX-42-1.txt                               NEW

Validation in preparation environment
-------------------------------------
TypeScript: PASS using TypeScript 5.8.3 against the project dependencies.
Next production build could not be completed in the preparation environment
because Next.js attempted to download the Linux SWC binary and network access
to registry.npmjs.org was unavailable. This is an environment dependency issue,
not a TypeScript error.

Required validation on the Windows project before Git commit/push
-----------------------------------------------------------------
npx tsc --noEmit
npm run build

Do not commit/push unless BOTH commands pass.
