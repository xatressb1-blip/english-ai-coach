FIX 40.3 - Recruiter Voice Consistency & English Voice Lock
============================================================

PURPOSE
-------
Fix two speech issues observed after Fix 40.2:
1. Female recruiter voice can fall back to a non-English/system-default voice when browser voices are not loaded yet.
2. Selecting male recruiter James can still play a female voice because the old SpeechManager cached one global English voice and reused it across recruiters.

WHAT CHANGED
------------
1. Every recruiter now declares voiceGender: female/male.
2. SpeechManager waits for browser voices before selecting a voice.
3. Only voices whose language starts with "en" are eligible for recruiter speech.
4. Voice selection priority:
   - exact recruiter locale + recruiter-specific voice-name pattern
   - any English voice + recruiter-specific pattern
   - exact locale + known male/female English voice name
   - any English voice + known male/female English voice name
   - exact English locale fallback
   - any English voice fallback
5. Voice selection is PER SPEECH TASK. A previously selected Emma voice is never cached and reused for James.
6. Candidate greeting now uses the same recruiter-aware speech queue as the interview itself.
7. Interview opening, questions, acknowledgement, candidate-question response, and closing all use the selected recruiter's voice profile.
8. Speech errors now release the queue instead of leaving it stuck.
9. Console log shows the actual browser voice selected, for example:
   [SpeechManager] Voice: Mr. James (British English) -> Microsoft Ryan Online ... en-GB

FILES
-----
data/recruiters.ts
services/speechManager.ts
services/speechSynthesisService.ts
services/speechQueueService.ts
components/interview/CandidateProfile.tsx
components/interview/AIInterviewer.tsx
components/interview/InterviewOpening.tsx
components/interview/InterviewClosing.tsx
components/interview/CandidateQuestion.tsx
components/interview/MockInterviewEvaluation.tsx

INSTALL
-------
Copy the files/folders in this ZIP over:
C:\AI_Project\english-ai-mobile-fix-01
Choose Replace files in destination.

VALIDATION
----------
Run:
  npx tsc --noEmit
  npm run build

Then:
  npm run dev

TEST PLAN
---------
1. Candidate Profile (default Emma): Confirm Name and Meet Recruiter.
   - Voice must be English.
   - Prefer a female English voice when installed.
2. Select James in recruiter lobby.
   - Opening must use a male English voice.
   - Q1/Q2/Q3 and acknowledgement must keep the same male voice family.
3. Select Emma.
   - Opening/questions should use female English voice.
4. Select Sophia.
   - Prefer Australian female English voice when installed.
5. Open browser DevTools Console and verify [SpeechManager] Voice logs.

IMPORTANT LIMITATION
--------------------
Web Speech API does not expose a standardized gender property. Therefore a browser/device that has no recognizable male/female English voice installed cannot guarantee gender perfectly. This fix prioritizes English correctness first, then recruiter gender/accent using known voice names. For guaranteed identical voices on all devices, a cloud TTS service would be required.

Do not git commit/push until both TypeScript and production build pass on the Windows project machine.
