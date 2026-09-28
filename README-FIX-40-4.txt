FIX 40.4 — Candidate Check-in UX + Spoken/Displayed Greeting Sync

Purpose
-------
1. Make the recruiter greeting text on screen exactly match the text sent to speech synthesis.
2. Redesign Candidate Profile into a more compact, professional check-in screen.
3. Keep primary controls visible with less vertical scrolling on desktop and mobile.
4. Preserve Fix 40.2 background evaluation and Fix 40.3 recruiter voice selection.

Changed file
------------
components/interview/CandidateProfile.tsx

Key behavior
------------
- One source of truth: buildGreeting(name) is used for both displayed and spoken greeting.
- Compact Step 1 of 4 header.
- Candidate form and recruiter panel use a tighter two-column desktop layout.
- Waveform height reduced.
- After confirmation, the main actions are consolidated into two buttons:
  Listen Again / Continue to Interview Level.
- No changes to evaluation, Gemini, observer QR, microphone, or teacher summary logic.

Validation
----------
npx tsc --noEmit
npm run build

Manual test
-----------
1. Open /interview.
2. Enter a candidate name and press Confirm & Play Greeting.
3. Read the Spoken greeting panel while listening.
4. Verify every sentence matches exactly.
5. Verify Listen Again and Continue to Interview Level are visible without unnecessary scrolling on desktop.
6. Test a phone viewport and confirm buttons are easy to reach and no horizontal overflow appears.
