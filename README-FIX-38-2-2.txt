FIX 38.2.2 - BACKUP RUBRIC EVALUATION FOR PRESENTATION
=====================================================

Purpose
-------
Keep the three presentation questions (Q1-Q3) evaluable even when live Gemini
scoring fails because of timeout, network loss, 503 high demand, or quota errors.

Important integrity rule
------------------------
Backup Rubric results are NOT presented as live AI results. The UI labels them
clearly as "Backup Rubric" and Teacher Summary shows the assessment source for
each question.

How it works
------------
1. Candidate records and submits an answer.
2. The transcript is saved and live AI evaluation runs normally.
3. If live AI ultimately fails after the existing safety/retry logic, Q1-Q3
   automatically switch to the local Backup Rubric.
4. Backup Rubric runs locally from the transcript and does not require Internet.
5. The interview continues normally without asking the candidate to record again.
6. Teacher Summary combines Live AI / Backup Rubric evidence with the three
   observer rubrics and teacher judgement.

Backup performance bands
------------------------
Good              -> 8/10
Developing        -> 7/10
Needs Improvement -> 6/10

The score is not hard-coded to 8. The band depends on weighted question-specific
coverage and answer length. Q1-Q3 use their existing expectedIdeas as the source
of truth, with local semantic cue rules aligned to those criteria.

Question-specific coverage
--------------------------
Q1: personal introduction, education, major/field, career direction,
    potential contribution, professional growth.
Q2: clear strength, why it matters, specific example, action, result,
    measurable evidence, connection to the role.
Q3: company research, specific attraction, role fit, relevant skills,
    contribution, growth alignment, company-specific reasoning.

Human judgement remains essential
---------------------------------
Backup Rubric cannot reliably judge eye contact, posture, facial expression,
professional presence, or detailed pronunciation. Observer 2, Observer 3 and the
teacher remain responsible for confirming language delivery and professional
performance.

Files added
-----------
services/backupRubricEvaluation.ts
README-FIX-38-2-2.txt

Files changed
-------------
types/evaluation.ts
services/evaluationService.ts
components/interview/MockInterviewEvaluation.tsx
components/interview/TeacherProjectionSummary.tsx
components/interview/InterviewReview.tsx

Recommended tests
-----------------
1. npx tsc --noEmit
2. npm run build
3. Test Q1-Q3 with live AI available: source must show Live AI.
4. Disconnect Internet after recording: after live evaluation fails, the interview
   must continue automatically and the attempt must be labelled Backup Rubric.
5. Complete all three questions and open Teacher Summary. Each row must show its
   source (Live AI / Backup Rubric / Unavailable).
6. Use a strong sample answer for Q1-Q3 and verify a reasonable Good band when
   most expected criteria are covered.
7. Use a very short answer and verify it does not automatically receive 8/10.
8. Verify Q4-Q10 do NOT use this presentation backup rubric.

Commit only after TypeScript and production build both pass.
