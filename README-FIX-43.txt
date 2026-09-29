FIX 43 - TEACHING DEMO INDIVIDUAL INTERVIEW
============================================

Purpose
-------
Use the existing Individual Mock Interview as the single teaching-demonstration flow.
Classroom Rapid Mode is no longer exposed from the home page or /interview journey.
The /classroom route is locked with a safe return link to /interview.
Its underlying classroom source remains in the project for rollback/history.

Teaching-demo flow
------------------
1. Candidate enters their own name.
2. Candidate chooses interview level, company/position, and virtual recruiter.
3. Professional opening:
   Step 1: "Hello, I’m <Recruiter>, your interviewer today. Thank you for joining us."
   Candidate responds naturally; Step 1 advances automatically after a short response window.
   Step 2: recruiter checks readiness; candidate responds and starts Q1.
4. Q1 -> Q2 -> Q3 for Level 1. AI/Backup evaluation continues in the existing background flow.
5. No Candidate Questions stage in this teaching-demo flow.
6. Concise professional closing.
7. Final AI Interview Review.
8. Three peer observers present feedback from paper forms only:
   - Observer 1: Content & Response Structure
   - Observer 2: English Language Performance
   - Observer 3: Professional Interview Performance
9. Teacher synthesizes AI evidence + peer comments into:
   - Strength
   - Priority improvement
   - Practical next step

Important assessment boundary
-----------------------------
The app does not claim to assess posture or eye contact. Those non-verbal criteria remain with Observer 3 and the teacher.

Files changed
-------------
app/classroom/page.tsx
components/Hero.tsx
components/interview/InterviewEngine.tsx
components/interview/CandidateProfile.tsx
components/interview/InterviewOpening.tsx
components/interview/InterviewClosing.tsx
components/interview/VirtualInterviewLobby.tsx
components/interview/FinalRecruiterReport.tsx
components/interview/PaperObserverTeacherSummary.tsx (new)
README-FIX-43.txt (new)

Validation before Git
---------------------
npx tsc --noEmit
npm run build

Do not commit/push until both commands pass on the Windows project machine.
