FIX 35 - RESTRICT FOLLOW-UP QUESTIONS TO QUESTIONS 4-10

Summary
- Questions 1-3 never generate AI follow-up questions.
- Questions 4-10 may generate at most one follow-up question using the existing Fix 32 logic.
- Main answers for Questions 1-3 are still saved before the recruiter acknowledgement.
- Speech metrics, evaluation data, reports, history, and Guided Practice behavior remain unchanged.

Changed file
- components/interview/MockInterviewEvaluation.tsx

New file
- README-FIX-35.txt

Expected behavior
- Level 1 (Questions 1-3): main answer -> silent evaluation -> neutral recruiter acknowledgement -> next question.
- Level 2 (Questions 4-10): main answer -> silent evaluation -> optional one follow-up -> neutral acknowledgement -> next question.

Verification
1. Run: npx tsc --noEmit
2. Run: npm run build
3. Test Questions 1-3 with very short answers: no follow-up should appear.
4. Test Question 4 with a vague answer: a follow-up may appear.
5. Complete a level and confirm all main answers remain in the final report.
