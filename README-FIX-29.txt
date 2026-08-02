FIX 29 - QUESTION-SPECIFIC CONTENT EVALUATION FOR LEVEL 1
==========================================================

Purpose
-------
Evaluate Level 1 answers against the content criteria derived from the approved
answers for questions 1-3, instead of relying only on broad keyword matching.

Main changes
------------
1. Updated the sample answers for questions 1-3.
2. Added question-specific expectedIdeas with labels, descriptions, and weights.
3. Gemini now returns a semantic assessment for every expected idea:
   - covered
   - partial
   - missing
4. A single isolated keyword is not enough to mark an idea as covered.
5. Added Evidence Quality (0-100).
6. Coverage gives half credit to partially covered ideas.
7. Redesigned Answer Content for mobile with clear criteria rows, evidence, and
   improvement tips.
8. Questions 4-10 continue to use their existing keyword-based fallback until
   approved answers and criteria are supplied.

Changed files
-------------
types/InterviewQuestion.ts
data/interviewQuestions.ts
types/evaluation.ts
services/focusAnalyzer.ts
services/geminiClient.ts
services/evaluationService.ts
app/api/evaluate/route.ts
components/evaluation/FocusAnalysisCard.tsx

Required validation on Windows
------------------------------
cd C:\AI_Project\english-ai-mobile-fix-01
npx tsc --noEmit
npm run build

Do not push to GitHub until npm run build succeeds.
