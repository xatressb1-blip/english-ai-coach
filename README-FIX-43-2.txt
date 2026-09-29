FIX 43.2 - SEAMLESS INTERVIEW TRANSITIONS
=========================================

Goal
----
Make Q1 -> Q2 -> Q3 feel like one continuous professional interview and remove
manual Save/Continue clicks after the candidate stops recording.

Teaching-demo flow
------------------
1. Candidate answers Q1/Q2/Q3 and presses Stop Recording.
2. Once a non-empty transcript is finalized, the answer is saved immediately
   with the local Backup Rubric.
3. Live AI evaluation is queued in the background and never blocks the interview.
4. After Q1 the recruiter says:
   "Thank you. Let's move on to the next question."
5. When that speech ends, Q2 starts automatically and the recruiter asks Q2.
6. After Q2 the recruiter says:
   "Thank you. Let's continue with the final question."
7. When that speech ends, Q3 starts automatically and the recruiter asks Q3.
8. After Q3 the app moves directly to the existing Professional Closing.

Reliability rules
-----------------
- Stop Recording is the submit action for Level 1 Q1-Q3.
- No transcript = no auto-advance; candidate records again.
- A per-question guard prevents duplicate save/evaluation/transition triggers.
- Gemini runs in the existing sequential background queue.
- Backup Rubric is available immediately and Live AI replaces it when successful.
- No extra Next Question / Save & Continue button is required for Q1-Q3.
- Legacy non-presentation questions keep their existing manual behavior.

Files changed
-------------
components/interview/MockInterviewEvaluation.tsx
README-FIX-43-2.txt

Validation
----------
Run on the Windows project machine:
  npx tsc --noEmit
  npm run build

Functional test
---------------
Q1 answer -> Stop -> recruiter bridge -> auto Q2 -> Q2 spoken
Q2 answer -> Stop -> recruiter bridge -> auto Q3 -> Q3 spoken
Q3 answer -> Stop -> Professional Closing
Verify no empty transcript advances and each answer appears only once in the final review.
