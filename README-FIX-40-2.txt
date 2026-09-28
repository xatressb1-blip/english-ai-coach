FIX 40.2 - PRESENTATION PERFORMANCE HARDENING
==============================================

Goals
-----
1. Remove all recruiter portrait flashing/flicker.
2. Keep one stable friendly recruiter portrait at all times.
3. Show speaking activity only with a compact waveform/status indicator.
4. Remove the 40-50 second AI wait between Level 1 questions Q1-Q3.
5. Save each answer immediately and run Live AI analysis in the background.
6. Preserve Backup Rubric, QR Observer Assessment, Teacher Summary and existing
   Level 2 follow-up behavior.

Recruiter visual behavior
-------------------------
- The portrait never changes bitmap for idle/listening/speaking.
- No mouth-frame switching.
- No full-face opacity animation.
- No pulsing portrait image.
- When the recruiter speaks, the waveform under the portrait animates.
- When the candidate speaks, the same portrait remains stable and the waveform
  becomes quiet/static.

Level 1 Q1-Q3 flow
------------------
Old flow:
  Candidate answer
  -> wait for Live AI (often 40-50 seconds)
  -> recruiter acknowledgement
  -> manually continue
  -> next question

Fix 40.2 flow:
  Candidate answer
  -> save transcript + speech metrics immediately
  -> create local Backup Rubric immediately
  -> queue Live AI analysis in the background
  -> recruiter gives one short acknowledgement
  -> next question starts automatically

Live AI background queue
------------------------
- Q1, Q2 and Q3 are processed sequentially, not all at once.
- This reduces burst traffic and lowers the risk of API rate-limit errors.
- A Live AI result replaces the provisional Backup Rubric when it arrives.
- If Live AI is slow, unavailable, quota-limited or times out, the Backup Rubric
  remains valid and the interview continues normally.
- Replacing a Backup Rubric preserves the original Q1-Q3 question order.
- Starting/resetting another interview invalidates stale queued results.

Level 2
-------
Q4-Q10 keep the existing evaluation/follow-up behavior. Fix 40.2 intentionally
changes only the presentation-safe Q1-Q3 path.

AI provider
-----------
This fix keeps the current Gemini integration. It does not switch providers and
it does not use a ChatGPT Plus subscription. The performance improvement comes
from making Q1-Q3 evaluation non-blocking, not from changing the AI provider.

Files changed / added
---------------------
components/interview/RecruiterAvatar.tsx
components/interview/MockInterviewEvaluation.tsx
context/InterviewContext.tsx
services/backgroundEvaluationQueue.ts   (new)
README-FIX-40-2.txt                      (new)

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

Do NOT commit/push until both commands pass.

Functional test - recruiter portrait
------------------------------------
1. npm run dev
2. Open http://localhost:3000/interview
3. Test Emma, James and Sophia.
4. Confirm the face never changes or flashes while speaking.
5. Confirm the waveform moves when recruiter speech is active.
6. Confirm the waveform becomes quiet/static while the candidate answers.

Functional test - Q1-Q3 latency
--------------------------------
Use Level 1.

Q1:
1. Record/submit the answer.
2. Confirm button text is "Save & Continue".
3. Confirm there is NO "AI is evaluating..." wait screen.
4. Confirm a short recruiter acknowledgement plays.
5. Confirm Q2 begins automatically without pressing Ready/Continue.

Repeat Q2 -> Q3.

Expected perceived transition time:
- approximately the duration of the short acknowledgement (normally a few
  seconds), independent of Gemini evaluation time.

Background evaluation check
---------------------------
After Q1-Q3, open the final/teacher review.
- If Live AI finished: source should update from Backup Rubric to Live AI.
- If Live AI is still pending or failed: Backup Rubric remains available.
- Missing Live AI must never become a zero score.

Regression test
---------------
- Microphone recording still works.
- Transcript is preserved in saved attempts.
- QR Observer Fix 39.1 still works.
- Teacher Summary still builds locally without another Gemini request.
- Level 2 Q4-Q10 still supports the existing follow-up flow.
