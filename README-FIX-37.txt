FIX 37 - EVALUATION RELIABILITY TEST SUITE

New internal route:
  /evaluation-test

Purpose:
- Run approved transcripts against the live evaluation API.
- Compare Coverage, Evidence Quality and Relevance with expected ranges.
- Detect score/feedback contradictions and criteria-count errors.
- Record evaluationVersion = fix37-v1 in new evaluation results.

This route is intentionally not linked from the student Home page.
It is a development and teacher-review tool, not a student assessment screen.

Files added:
- app/evaluation-test/page.tsx
- data/evaluationTestCases.ts
- services/evaluationReliability.ts
- README-FIX-37.txt

Files changed:
- services/evaluationService.ts
- types/evaluation.ts
- types/interviewReport.ts

Run:
  npx tsc --noEmit
  npm run build

Open locally:
  http://localhost:3000/evaluation-test
