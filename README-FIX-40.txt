FIX 40 - PROFESSIONAL RECRUITER PORTRAITS & IMMERSIVE CORPORATE SCENE
=====================================================================

Base source
-----------
This fix was built from the user's source archive after Fix 39.1:
english-ai-mobile-fix-01(20260824-192920).zip

Purpose
-------
1. Replace recruiter emoji avatars with professional AI-generated recruiter portraits.
2. Give each recruiter visual states for idle, listening and speaking.
3. Simulate speaking locally by alternating two speaking portraits about every 230 ms.
4. Add professional corporate environments so the interview journey feels like entering a company and sitting in a real interview room.
5. Keep the visual feature local: no extra Gemini/API request is made for avatar animation or scene backgrounds.

Recruiter assets
----------------
Emma:
- emma-idle.webp
- emma-listening.webp
- emma-speaking-1.webp
- emma-speaking-2.webp

James:
- james-idle.webp
- james-listening.webp
- james-speaking-1.webp
- james-speaking-2.webp

Sophia:
- sophia-idle.webp
- sophia-listening.webp
- sophia-speaking-1.webp
- sophia-speaking-2.webp

Corporate scenes
----------------
- corporate-lobby.webp
- office-corridor.webp
- interview-room.webp

The people and corporate environments are AI-generated fictional visuals. No real company logo or real recruiter identity is used.

New files
---------
components/interview/RecruiterAvatar.tsx
components/interview/SceneBackdrop.tsx
public/interview/recruiters/*.webp
public/interview/scenes/*.webp
README-FIX-40.txt

Modified files
--------------
data/recruiters.ts
components/interview/CandidateProfile.tsx
components/interview/LevelSelection.tsx
components/interview/InterviewPositionSetup.tsx
components/interview/VirtualInterviewLobby.tsx
components/interview/InterviewOpening.tsx
components/interview/ReadyScreen.tsx
components/interview/RecruiterStage.tsx
components/interview/CandidateQuestion.tsx
components/interview/InterviewClosing.tsx
components/interview/MockInterviewEvaluation.tsx

Visual state rules
------------------
Recruiter speaking:
- speaking image alternates between speaking-1 and speaking-2
- blue speaking ring/status is shown

Candidate speaking / recruiter listening:
- listening portrait is shown
- green listening status is shown

Waiting / ready / evaluation complete:
- idle portrait is shown

Scene journey
-------------
Candidate Profile -> Corporate Lobby
Level Selection -> Office Corridor
Company & Position -> Office Corridor
Recruiter Selection -> Corporate Lobby
Interview Opening -> Interview Room
Question Ready -> Interview Room
Active Interview -> Interview Room
Candidate Question -> Interview Room
Interview Closing -> Interview Room

Important safety / architecture notes
-------------------------------------
- Fix 39 and Fix 39.1 observer/teacher logic is not redesigned by this fix.
- The AI evaluation algorithm is not changed by this fix.
- No package dependency was added.
- No cloud image service is needed at runtime.
- All recruiter animation images and scene images are served locally from /public.
- Image files were converted to optimized WebP to keep LAN/mobile loading light.

Validation performed while packaging
-------------------------------------
PASS: TypeScript check with Next.js 16.2.10 project dependencies:
  tsc --noEmit

PASS: ESLint on the new Fix 40 visual components and modified files that were baseline-clean.

Note: CandidateProfile.tsx and MockInterviewEvaluation.tsx already had react-hooks/set-state-in-effect lint errors in the source archive before Fix 40. The same baseline lint issues remain; Fix 40 does not modify those effect blocks. TypeScript still passes.

The container could not complete `next build` because the source archive contains Windows Next.js dependencies and the isolated Linux packaging environment attempted to download the Linux SWC binary, but external network access is unavailable. This is an environment limitation, not a TypeScript error. Run the normal Windows build below before Git commit.

INSTALLATION
============
1. Back up the project folder first.
2. Extract this ZIP.
3. Copy all extracted files/folders into:
   C:\AI_Project\english-ai-mobile-fix-01
4. Choose Replace files in the destination when Windows asks.

VALIDATION ON YOUR WINDOWS PC
==============================
Open Command Prompt:

cd C:\AI_Project\english-ai-mobile-fix-01
npx tsc --noEmit
npm run build

Do NOT commit/push until both commands succeed.

FUNCTION TEST - DESKTOP
=======================
1. Run:
   npm run dev
2. Open /interview.
3. Candidate Profile:
   - recruiter is a real portrait, not emoji
   - when greeting plays, mouth images alternate
   - after speaking ends, image returns to idle
4. Level Selection:
   - office corridor scene is visible
5. Company/Position:
   - office corridor scene is visible in the header
6. Recruiter Lobby:
   - Emma, James and Sophia show their own portraits
   - selecting a recruiter changes the preview portrait
7. Interview Opening:
   - interview-room background is visible
   - selected recruiter animates while speaking
8. Active Interview:
   - ASKING = speaking animation
   - LISTENING = listening portrait
   - other states = idle portrait
9. Candidate Question / Closing:
   - recruiter speaking/listening states still follow the audio stage
10. Confirm microphone, transcript, evaluation, observer session and Teacher Summary still behave as before.

FUNCTION TEST - MOBILE
======================
1. Test portrait cropping on a phone.
2. Confirm recruiter face remains centered and not clipped.
3. Confirm the speaking animation is smooth and does not block microphone controls.
4. Test QR Observer Fix 39.1 separately after the main interview test.

GIT AFTER PASS
==============
git status
git add README-FIX-40.txt
git add data/recruiters.ts
git add components/interview/RecruiterAvatar.tsx
git add components/interview/SceneBackdrop.tsx
git add components/interview/CandidateProfile.tsx
git add components/interview/LevelSelection.tsx
git add components/interview/InterviewPositionSetup.tsx
git add components/interview/VirtualInterviewLobby.tsx
git add components/interview/InterviewOpening.tsx
git add components/interview/ReadyScreen.tsx
git add components/interview/RecruiterStage.tsx
git add components/interview/CandidateQuestion.tsx
git add components/interview/InterviewClosing.tsx
git add components/interview/MockInterviewEvaluation.tsx
git add public/interview/recruiters
git add public/interview/scenes

git commit -m "Fix 40: add professional animated recruiters and corporate scenes"
git push origin master
