FIX 39.1 - QR OBSERVER ASSESSMENT
=================================

Purpose
-------
Allow three observers to score the candidate from their personal phones while the candidate answers Q1-Q3. Observer results are sent to the teacher screen and merged into Fix 39 locally. No Gemini request is made after observer submission.

IMPORTANT PRESENTATION SAFETY DESIGN
------------------------------------
1. Observer phones NEVER see Live AI / Backup Rubric results before submitting.
2. Teacher Summary polls only /api/observer-session. It does not call Gemini.
3. Manual observer entry on the teacher computer remains available at all times.
4. QR is a convenience layer, not a single point of failure.
5. The session store is intentionally in-memory for the live classroom/local-server workflow. It is reliable when the teacher laptop runs the Next.js server for the lesson, but it is NOT a durable database and is not guaranteed across Vercel serverless instances/restarts.

Recommended hội giảng deployment
---------------------------------
For the competition lesson, use the teacher laptop as the local Next.js server and connect the three observer phones to the same Wi-Fi/hotspot.

Run:
  npm run dev -- --hostname 0.0.0.0

or, after npm run build:
  npm run start -- --hostname 0.0.0.0

Find the teacher laptop IPv4 address with:
  ipconfig

Example LAN URL:
  http://192.168.1.20:3000

On Teacher Summary -> Observer base URL, replace localhost with the LAN URL. The QR and Join link will then point to:
  http://192.168.1.20:3000/observer?session=ABC123

Windows Firewall may ask for permission. Allow Node.js on Private networks only when using a trusted classroom network/hotspot.

Runtime QR
----------
The screen requests the QR image from api.qrserver.com. If that QR image service is unavailable, observers can still open the Join link manually or open /observer and type the 6-character session code. The assessment data itself is sent to the local app server, not to the QR image service.

Observer workflow
-----------------
1. Teacher opens Teacher Summary.
2. Go to step 2 Observers.
3. Click Start QR Observer Session.
4. Set Observer base URL to the teacher laptop LAN URL if using local classroom mode.
5. Observers scan QR or open /observer and enter the 6-character code.
6. Observer 1 selects Content & Response Structure.
7. Observer 2 selects English Language Performance.
8. Observer 3 selects Professional Interview Performance.
9. Each observer scores five criteria: 0 / 1 / 2.
10. Each observer enters One strong point and One area for improvement.
11. Each presses Submit Assessment.
12. Teacher screen updates approximately every 1.5 seconds.
13. When all have submitted it displays 3/3 Observer Assessments Received.
14. Teacher reveals AI / Backup evidence only after observers submit.
15. Click Build Teacher Summary. This is local synthesis; no additional Gemini request is made.

Fallback
--------
If one phone cannot connect or submit, the teacher can enter that observer's five scores and notes directly in Teacher Summary. The lesson must continue without waiting for QR/network recovery.

Files added
-----------
app/observer/page.tsx
app/api/observer-session/route.ts
services/observerSessionTypes.ts
services/observerSessionStore.ts

Files changed
-------------
components/interview/TeacherProjectionSummary.tsx
services/teacherFeedbackService.ts

Technical checks
----------------
cd C:\AI_Project\english-ai-mobile-fix-01
npx tsc --noEmit
npm run build

Do not commit until both commands succeed.

Suggested functional test
-------------------------
A. Teacher computer:
- Start local server with --hostname 0.0.0.0.
- Open Teacher Summary and start QR session.
- Set LAN base URL.

B. Phone 1:
- Select Observer 1, score all five items, submit.
- Teacher must show Observer 1 Submitted.

C. Phones 2 and 3:
- Repeat with Observer 2 and Observer 3.
- Teacher must show 3/3 Observer Assessments Received.

D. Privacy/independence:
- Observer phone must not show AI score, Backup Rubric, Coverage, Evidence or Teacher Summary before submit.

E. Local synthesis:
- Click Build Teacher Summary.
- Confirm there is no new /api/evaluate request in browser Network tab and no new Gemini log on the server.

F. Fallback:
- Disconnect one observer phone before submit.
- Teacher manually enters that observer's scores and continues without delay.
