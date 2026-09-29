FIX 42.1.1 - AUTO CONTINUE AFTER OPENING STEP 1

Purpose
- Remove the manual Continue button after Interview Opening Step 1.
- Preserve the real candidate greeting instead of skipping it.
- After Ms. Emma finishes Step 1, MrHuy gets a 6-second natural greeting window.
- The screen then moves automatically to Step 2 and the recruiter speaks the readiness question.
- Step 2 keeps the explicit "Candidate Ready - Begin Q1" button so the teacher/candidate controls the exact start of scored Q1.
- Opening remains outside Gemini scoring and does not create an extra Gemini request.

Files
- components/classroom/ClassroomRapidInterview.tsx

Install
1. Copy the contents of this patch into:
   C:\AI_Project\english-ai-mobile-fix-01
2. Replace the destination file when Windows asks.
3. Run:
   npx tsc --noEmit
   npm run build
4. Do NOT git commit/push until both commands PASS and the opening flow is tested.

Expected test
- Enter Classroom Rapid Mode -> Create Classroom Session -> Enter Interview Room.
- Step 1: Ms. Emma speaks the greeting.
- When she finishes, no Continue button appears.
- MrHuy has 6 seconds to greet/thank the recruiter naturally.
- UI automatically changes to Step 2 and Ms. Emma asks if he is ready.
- Step 2 still waits for MrHuy and the Candidate Ready - Begin Q1 button.
