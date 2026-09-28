FIX 41 - CLASSROOM RAPID INTERVIEW MODE
=======================================
Checkpoint base: PRE-FIX41 / AFTER-FIX40.4
Purpose: allow all 4 students to participate in Activity 2 within about 10 minutes while AI evaluates answers in the background.

PEDAGOGICAL FLOW
----------------
Candidate 1 -> Q1: Could you please introduce yourself?
Candidate 2 -> Q2: What are your strengths?
Candidate 3 -> Q3: Why do you want to work for our company?
Candidate 4 -> Teacher-selected challenge question Q1/Q2/Q3

The teacher laptop is the single interview station.
The other 3 students use their phones only for one quick peer-observation dimension:
- Content & Response Structure
- English Language Performance
- Professional Interview Performance
Roles rotate automatically each round.

WHY THE CANDIDATE USES THE TEACHER LAPTOP
------------------------------------------
This is intentional for presentation reliability:
- one controlled microphone source;
- avoids four phones speaking/recording at once;
- avoids mobile microphone restrictions on local HTTP/LAN pages;
- reduces room-noise interference;
- keeps the AI/transcription path on the device already tested for the lesson.

RAPID ROUND FLOW
----------------
1. Recruiter asks the assigned question.
2. Candidate presses Start Recording.
3. Candidate answers for about 35-45 seconds.
4. Candidate presses Stop Recording.
5. Transcript is captured automatically.
6. Backup Rubric is created immediately.
7. Live AI evaluation is queued in the background.
8. Teacher can move to the next candidate without waiting for AI.
9. The other 3 students submit one 0/1/2 peer score on their phones.

No extra Submit Answer button is required in Classroom Rapid Mode.

CLASS SUMMARY
-------------
After Candidate 4, the teacher screen shows:
- 4/4 candidate completion
- Live AI / Backup status for each candidate
- AI/Backup overall score
- content coverage
- peer-observation average
- class strengths
- priority improvements
- total peer evidence received

The class summary is generated LOCALLY from existing evidence.
It does NOT make another Gemini request.

NEW ROUTES
----------
/classroom
/classroom-observer
/api/classroom-session

NEW FILES
---------
app/classroom/page.tsx
app/classroom-observer/page.tsx
app/api/classroom-session/route.ts
components/classroom/ClassroomRapidInterview.tsx
services/classroomSessionTypes.ts
services/classroomSessionStore.ts
services/classroomSummaryService.ts

MODIFIED FILES
--------------
components/SpeechRecorder.tsx
components/Hero.tsx

PHONE CONNECTION
----------------
For the live class, run the app on the teacher laptop:

npm run dev -- --hostname 0.0.0.0

or, after a successful build, preferably use production mode:

npm run start -- --hostname 0.0.0.0

All phones must be on the same Wi-Fi/hotspot.
On the teacher screen, set Observer base URL to the laptop IPv4 address, for example:

http://192.168.1.5:3000

Do NOT use localhost in the QR link because localhost on a phone means the phone itself.

QR SAFETY
---------
The QR picture currently uses api.qrserver.com and therefore needs internet to render.
If the QR picture does not load, students can manually open:

http://LAPTOP-IP:3000/classroom-observer

and enter the 6-character classroom session code.
The interview itself does not depend on the QR image.

SERVER SESSION NOTE
-------------------
Classroom session data is stored in server memory, just like the earlier QR observer prototype.
This is designed for the teacher laptop / local-network teaching session.
Do not treat this in-memory session as a permanent production database on Vercel serverless.

REQUIRED VALIDATION
-------------------
After copying the fix into:
C:\AI_Project\english-ai-mobile-fix-01

run:

npx tsc --noEmit
npm run build

Do not Git commit/push until both commands PASS on the Windows project.

LIVE TEST ORDER
---------------
Test 1:
Teacher laptop only -> /classroom -> create session -> Candidate 1 -> record -> Stop -> verify answer captured -> move Candidate 2 immediately.

Test 2:
Teacher laptop + 1 phone -> /classroom-observer -> join by code -> select student -> verify role changes by round -> submit one quick score.

Test 3:
Teacher laptop + 4 phones -> verify all four names show Connected.

Test 4:
Full timed rehearsal:
- 4 candidates
- one question each
- 3 peer observations per candidate
- AI processing in background
- final Class AI Interview Summary
Target: complete the activity in approximately 10 minutes.

EXPECTED KEY BEHAVIOR
---------------------
Q1 answer finished -> Candidate 2 can begin without waiting 40-50 seconds for AI.
Q2 answer finished -> Candidate 3 can begin without waiting for AI.
Q3 answer finished -> Candidate 4 can begin without waiting for AI.
Candidate 4 finished -> show whole-class summary.

If Gemini is slow or unavailable, Backup Rubric remains available and the classroom activity continues.
