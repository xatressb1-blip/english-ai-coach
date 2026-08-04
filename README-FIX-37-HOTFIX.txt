FIX 37 HOTFIX - TYPESCRIPT BUILD ERROR

Error fixed:
Object literal may only specify known properties, and 'suggestions' does not exist in type Pick<EvaluationResult, ...>.

Cause:
calculateOverall() only accepts the six score fields used to calculate the average. Fix 37 accidentally passed unrelated fields such as suggestions, focusAnalysis, coach, and improvedAnswer.

Changed file:
services/evaluationService.ts

After copying, run:
npx tsc --noEmit
npm run build

Only commit after both commands succeed.
