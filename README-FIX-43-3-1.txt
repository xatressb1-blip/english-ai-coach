FIX 43.3.1 — CLASSROOM CLOSING + SESSION CONTROL HARDENING
==========================================================

PURPOSE
- Keep the 45-minute teaching-demo flow moving after Q3.
- Do not show individual AI scores/review to students during the classroom activity.
- Save locally first, then synchronize to Supabase in the background.
- Let two students on each computer switch roles immediately after Candidate 1.
- Give the teacher explicit Close Session / New Class Session controls.
- Make the Student Link usable on localhost, LAN, or Vercel without hard-coding localhost.

CLASSROOM STUDENT FLOW
Candidate 1:
Q1 -> Q2 -> Q3 -> Professional Closing -> local save -> background cloud sync
-> "Please switch roles" -> Start Next Candidate

Candidate 2 on the same computer:
Q1 -> Q2 -> Q3 -> Professional Closing -> local save -> background cloud sync
-> "Both interviews on this computer are complete. Please wait for your teacher."

IMPORTANT
- Classroom mode no longer opens Final Recruiter Report after Q3.
- Individual practice without ?session=... still keeps View AI Interview Review.
- Start Next Candidate depends on a safe LOCAL save, not on cloud/Gemini completion.
- Cloud synchronization retries in the background and is not on the critical classroom path.
- The teacher remains the final instructional decision-maker.

TEACHER DASHBOARD
- Close Session marks the current cloud session closed while preserving results.
- New Class Session becomes available after the current session is closed.
- Student Link base address is editable:
  * localhost for one-computer testing
  * http://TEACHER-LAN-IP:3000 for LAN testing
  * the production Vercel origin for the deployed lesson
- Optional production environment variable:
  NEXT_PUBLIC_CLASSROOM_BASE_URL=https://YOUR-PRODUCTION-DOMAIN

FILES MODIFIED
- components/interview/InterviewClosing.tsx
- components/interview/InterviewEngine.tsx
- services/classroomCloudSync.ts
- components/classroom/TeacherClassroomDashboard.tsx
- services/supabaseClassroomStore.ts
- app/api/class-results/session/route.ts

NO DATABASE MIGRATION IS REQUIRED
The existing Fix 43.3 Supabase tables are reused unchanged.

MANDATORY WINDOWS VALIDATION BEFORE GIT
1. npx tsc --noEmit
2. npm run build
3. Create a fresh class session.
4. Candidate A -> Q1/Q2/Q3 -> Closing. Confirm no AI Review button appears.
5. Confirm Start Next Candidate is enabled after local save even while cloud sync is pending.
6. Candidate B -> Q1/Q2/Q3 -> Closing. Confirm the device-complete message appears.
7. Confirm Teacher Dashboard receives both results.
8. Repeat on a second browser/device until dashboard reaches 4/4.
9. Confirm TỔNG HỢP KẾT QUẢ works without an extra Gemini request.
10. Close Session -> New Class Session.
11. Test Student Link on LAN/Vercel before the teaching demonstration.

DO NOT PUSH TO GITHUB UNTIL TYPECHECK AND BUILD PASS ON THE USER'S WINDOWS PROJECT.
