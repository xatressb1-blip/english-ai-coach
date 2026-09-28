FIX 41.2 - Reliable Answer Capture & One-Tap Candidate Rotation
===============================================================

Purpose
-------
Make the 10-minute Classroom Rapid Interview faster and clearer for four students.

Changes
-------
1. Teacher interview station
   - After a candidate answer is captured, a 5-second auto-continue countdown starts.
   - If all three peer scores arrive first, the countdown shortens to 1 second.
   - Teacher can still press "Move Now" to advance immediately.
   - Candidate 4 automatically proceeds to the Class Summary after the grace period.
   - Live AI continues in the background and never blocks the next candidate.

2. Reliable answer capture
   - If recording finishes but no transcript is detected, the app now shows a clear warning.
   - A "Retry Recording" button resets the recorder for the same candidate.
   - The app does NOT advance when there is no usable transcript.

3. Student observer phones
   - Peer assessment is now one-tap.
   - Tap 0 / 1 / 2 and the score is submitted immediately.
   - Removed the optional note and separate Submit button from Rapid Mode.
   - Observer roles continue rotating automatically each round.

Recommended classroom rhythm
----------------------------
Candidate answers 35-45s -> Stop -> answer captured -> observers tap one score ->
5s grace / immediate when 3-of-3 received -> next candidate question.

Files changed
-------------
components/classroom/ClassroomRapidInterview.tsx
app/classroom-observer/page.tsx
README-FIX-41-2.txt

Install
-------
Copy the contents of this ZIP over:
C:\AI_Project\english-ai-mobile-fix-01

Then run:
npx tsc --noEmit
npm run build

Do not commit/push until both commands pass.

Test
----
1. Candidate 1 answers Q1 and presses Stop.
2. Confirm "Captured" appears and countdown starts at 5s.
3. On observer phones, tap 0/1/2 once; no Submit button should be required.
4. When 3/3 scores arrive, next candidate should start quickly.
5. If no transcript is captured, confirm "No transcript detected" and "Retry Recording" appear.
6. Complete all four candidates and confirm Class Summary appears.
