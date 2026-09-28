FIX 40.1 - STABLE SMILING RECRUITER + MOUTH MOTION + VOICE WAVEFORM
===================================================================

Goal
----
Remove the full-face flashing/flicker seen in Fix 40 when the recruiter switches
between multiple portraits while speaking.

What Fix 40.1 changes
---------------------
1. Keeps one stable smiling portrait for each recruiter.
2. Listening state now uses the exact same portrait as the idle state.
3. Speaking frames keep the same face/background/light and change only a small,
   softly blended mouth area.
4. Slows the speaking frame interval from 230 ms to 340 ms.
5. Removes whole-avatar scale movement while speaking.
6. Adds a compact animated audio waveform directly below the recruiter portrait
   on the main speaking screens.
7. Does NOT change AI evaluation, microphone logic, QR Observer Assessment,
   Teacher Summary, Backup Rubric, or interview scoring.

Files changed
-------------
components/interview/RecruiterAvatar.tsx
components/interview/RecruiterStage.tsx
components/interview/InterviewOpening.tsx
components/interview/InterviewClosing.tsx
components/interview/CandidateQuestion.tsx
components/interview/MockInterviewEvaluation.tsx

Stable recruiter assets replaced
---------------------------------
public/interview/recruiters/emma-listening.webp
public/interview/recruiters/emma-speaking-1.webp
public/interview/recruiters/emma-speaking-2.webp
public/interview/recruiters/james-listening.webp
public/interview/recruiters/james-speaking-1.webp
public/interview/recruiters/james-speaking-2.webp
public/interview/recruiters/sophia-listening.webp
public/interview/recruiters/sophia-speaking-1.webp
public/interview/recruiters/sophia-speaking-2.webp

Installation
------------
Copy the complete contents of this ZIP into:

C:\AI_Project\english-ai-mobile-fix-01

Choose "Replace the files in the destination" when Windows asks.

Required validation
-------------------
cd C:\AI_Project\english-ai-mobile-fix-01
npx tsc --noEmit
npm run build

Do NOT push to GitHub until both commands pass.

Visual test
-----------
1. Run:
   npm run dev

2. Open:
   http://localhost:3000/interview

3. Test Emma first:
   - Candidate Profile greeting.
   - Interview Opening.
   - Question 1 recruiter voice.
   - Candidate recording/listening state.

4. Confirm:
   - Face/background do not flash when speech starts.
   - Recruiter keeps the same friendly smiling identity.
   - Only the mouth area appears to move while speaking.
   - The small waveform below the portrait animates only while recruiter speech
     is active and becomes quiet/static when speech stops.
   - Listening state does not change portrait brightness.

5. Repeat with James and Sophia.

6. Then test Q1-Q3 and QR Observer Fix 39.1 to confirm no regression.

Expected result
---------------
The recruiter should feel alive without full-frame flicker: stable face, subtle
mouth movement, and synchronized visual audio activity under the portrait.
