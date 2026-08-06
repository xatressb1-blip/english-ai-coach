FIX 38.1 - PRESENTATION SAFETY & RELIABILITY HOTFIX

- AI evaluation automatically retries once after a short delay.
- Each request has a 25-second safety timeout.
- The transcript remains intact after failure.
- Submit is disabled while AI is evaluating.
- A clear Try AI Evaluation Again action is shown.
- Continue with Teacher Review lets the interview proceed without AI.
- Unavailable AI results do not count as zero in final averages.
- Teacher Summary labels missing AI results as Unavailable / Teacher review.

Run:
  npx tsc --noEmit
  npm run build
