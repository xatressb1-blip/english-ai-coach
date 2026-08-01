MOBILE FIX 14 - CONTEXT-AWARE AI EVALUATION

Replace these 5 files in the project:
1. app/api/evaluate/route.ts
2. components/evaluation/AIEvaluation.tsx
3. hooks/useEvaluation.ts
4. services/evaluationService.ts
5. services/geminiClient.ts

Then run:
npm run build
npm run dev

The evaluation request now sends:
- current interview question
- question description and level
- keywords
- grammar focus
- vocabulary level
- sample answer
- common mistakes
- candidate transcript

The sample answer is used as a benchmark, not as an exact answer that the learner must copy.
