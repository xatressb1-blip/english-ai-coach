FIX 43.1 - STREAMLINED TEACHING DEMO ENTRY
==========================================

Goal
----
Reduce unnecessary clicks before the 3-question teaching-demo interview while
preserving the existing Individual Mock Interview engine and AI evaluation.

Changes
-------
1. Candidate name
   - Type the interview name and press Enter.
   - No Confirm Name button.
   - No Continue to Interview Level button.
   - Enter moves directly to company/position selection.

2. Level
   - Level 1 - Basic is fixed for the teaching demonstration.
   - The Level Selection screen is skipped.

3. Recruiter lobby / microphone
   - No separate microphone-test action.
   - The lobby shows Microphone ready for the interview flow.
   - Browser microphone permission is still requested by the recording flow if
     permission has not already been granted.
   - Enter Interview Room appears only after the user explicitly selects a
     virtual recruiter.

4. Opening
   - Removed the separate Readiness to Begin screen.
   - Recruiter opening remains:
     "Hello, I'm [recruiter], your interviewer today. Thank you for joining us."
   - After the recruiter finishes speaking, Candidate responds naturally.
   - Candidate Ready - Begin Q1 is now on this same opening screen.
   - AI scoring begins only with Q1.

Unchanged
---------
- Company and position selection.
- Q1 -> Q2 -> Q3 evaluation engine.
- Background/backup evaluation behavior.
- Professional closing.
- Paper observer feedback + teacher synthesis.
- Classroom source remains locked from the teaching-demo user flow.

Validation required on Windows before Git/push
----------------------------------------------
npx tsc --noEmit
npm run build

Then test:
Name + Enter -> Company -> Position -> Recruiter -> Enter Interview Room ->
Greeting -> Candidate Ready / Begin Q1 -> Q1 -> Q2 -> Q3 -> Closing -> Report.
