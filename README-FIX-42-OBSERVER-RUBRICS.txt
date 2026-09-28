FIX 42 - 1 Candidate / 3 Fixed Observers / Full Mobile Rubrics
==============================================================

Purpose
-------
Adapt Classroom Rapid Interview to the revised 10-minute teaching-demonstration model:
- 1 candidate answers Q1 -> Q2 -> Q3.
- 3 observers remain in fixed roles for the entire interview.
- Observer 1 = Content & Response Structure.
- Observer 2 = English Language Performance.
- Observer 3 = Professional Interview Performance.
- Each observer sees only the assigned rubric on the phone.
- Each rubric has 5 criteria scored 0 / 1 / 2.
- Every score tap is auto-saved; no separate score Submit button is required.
- One strong point and one area for improvement are auto-saved after editing.
- AI evaluates Q1/Q2/Q3 in the background; the interview never waits for Gemini before moving on.
- Teacher Summary combines existing AI/Backup evidence with the three observer rubrics locally; it makes no additional AI request.

Observer rubric scale
---------------------
2 = Achieved
1 = Partly achieved
0 = Not yet achieved

Observer 1 - Content & Response Structure
-----------------------------------------
1. Answers all three questions directly and appropriately.
2. Question 1 includes all key points.
3. Question 2 follows a clear strength-evidence structure.
4. Question 3 demonstrates understanding of the company and job fit.
5. Overall structure is clear and concise.

Observer 2 - English Language Performance
-----------------------------------------
1. Answers are easy to understand and basic grammar is appropriate.
2. Vocabulary is appropriate for a job interview.
3. Uses linking words to connect ideas.
4. Speaks relatively fluently, with limited fillers and repetition.
5. Speech is clear and delivered at an appropriate pace.

Observer 3 - Professional Interview Performance
-----------------------------------------------
1. Appropriate posture and eye contact.
2. Appropriate volume and speaking pace.
3. Shows confidence and composure.
4. Polite, positive, and professional attitude.
5. Listens and responds naturally.

Teacher workflow
----------------
1. Enter one candidate name and three observer names.
2. Select company, position, and recruiter.
3. Create Classroom Session.
4. The teacher screen displays three role-specific QR codes.
5. Observer 1 scans Content QR; Observer 2 scans English QR; Observer 3 scans Professional QR.
6. Start Q1.
7. Candidate answers Q1 -> answer is captured -> Backup Rubric is immediately available -> Live AI starts in background -> Q2 begins automatically.
8. Repeat for Q2 -> Q3.
9. Observers tap 0/1/2 directly on their own phones. Each tap is saved immediately.
10. After Q3, observers add one strength and one improvement.
11. Teacher opens Teacher Summary.
12. Teacher Summary continues receiving observer updates and background AI results without another Gemini request.

Presentation safety
-------------------
- The teacher may start even if fewer than 3 phones are connected.
- If one phone fails, use the prepared paper rubric for that observer; the candidate interview and AI evaluation still continue.
- No transcript -> Retry Recording; the app does not advance that question.
- AI unavailable or slow -> Backup Rubric remains available.
- Observer AI results are hidden during scoring to preserve independent peer assessment.

Files changed
-------------
components/classroom/ClassroomRapidInterview.tsx
app/classroom-observer/page.tsx
services/classroomSessionTypes.ts
services/classroomSessionStore.ts
services/classroomSummaryService.ts
app/api/classroom-session/route.ts
README-FIX-42-OBSERVER-RUBRICS.txt

Install over the current project
--------------------------------
1. Back up C:\AI_Project\english-ai-mobile-fix-01 first.
2. Copy the project files from this package over the existing project.
3. Keep your existing .env.local. It is intentionally not included in the shared ZIP.
4. Run:
   npx tsc --noEmit
   npm run build
5. Do not commit/push until both commands PASS.

Recommended LAN presentation mode
---------------------------------
After build PASS, use the project's existing START-CLASSROOM-PRODUCTION.bat.
The app detects the current private IPv4 address and rebuilds the three observer QR URLs for the current venue/network.
