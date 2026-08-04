FIX 32 - INTELLIGENT FOLLOW-UP QUESTIONS
========================================

Purpose
-------
Make Mock Interview react to the candidate's main answer with at most one short,
job-relevant follow-up question when clarification or evidence would be useful.

New behavior
------------
1. The candidate records and submits the main answer.
2. The normal evaluation is saved privately.
3. The recruiter decides whether one follow-up is useful.
4. If no follow-up is needed, the interview continues normally.
5. If a follow-up is needed, the recruiter reads one short question.
6. The candidate records a brief answer using the same microphone control.
7. The main and follow-up answers are stored together in the final interview attempt.
8. If the follow-up API fails, the interview safely continues without a follow-up.

Safety and scope
----------------
- Maximum one follow-up per main question.
- The ten approved main questions are unchanged.
- Guided Practice is unchanged.
- No questions about protected or sensitive personal information.
- No scores or evaluation details are shown during Mock Interview.
- Follow-up answers do not trigger a second score, avoiding double-counting.

Files
-----
NEW:
- app/api/follow-up/route.ts
- services/followUpService.ts
- types/followUp.ts

MODIFIED:
- components/interview/MockInterviewEvaluation.tsx
- services/geminiClient.ts

Installation
------------
Copy the files in this package into the project root:
C:\AI_Project\english-ai-mobile-fix-01
Choose Replace when Windows asks.

Validation
----------
npx tsc --noEmit
npm run build

Only commit and push after both commands succeed.
