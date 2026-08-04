FIX 36 – CANDIDATE QUESTIONS AT THE END

Changes
- Adds a final recruiter stage: “Do you have any questions for us?”
- Candidate can record one question by microphone or choose “I don’t have a question”.
- The candidate question is not counted as question 4 or question 11 and does not change Overall Score.
- Adds lightweight coaching for professional relevance and company interest.
- Saves the result in Final Recruiter Report and History.
- Keeps old reports compatible when candidateQuestion is absent.
- Optimized for smartphone and Safari MediaRecorder transcription.

Files
- components/interview/CandidateQuestion.tsx (new)
- components/interview/InterviewEngine.tsx
- components/interview/FinalRecruiterReport.tsx
- components/history/RecruiterReportHistory.tsx
- context/InterviewContext.tsx
- services/interviewReportService.ts
- types/candidateQuestion.ts (new)
- types/interviewReport.ts

Verification
1. npx tsc --noEmit
2. npm run build
3. Complete Level 1 and Level 2.
4. Confirm the candidate-question stage appears only once after all main questions.
5. Test recording on Chrome and Safari.
6. Confirm skipping is allowed.
7. Confirm Final Report and History show the result without changing the number of main attempts.
