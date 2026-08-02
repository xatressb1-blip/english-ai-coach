Mobile Fix 23 - Mobile Guided Practice Redesign

Replace these files in the project:
1. app/question/[id]/page.tsx
2. components/evaluation/AIEvaluation.tsx
3. components/practice/GuidedPracticePanel.tsx

Key changes:
- Remove duplicated AI prompt, Copy Prompt, Open ChatGPT, AudioRecorder and second answer textarea.
- Keep one SpeechRecorder and one transcript.
- Add compact question card with Listen to Question and speaking waveform.
- Make sample answer collapsible.
- Move recording closer to the top of the mobile page.
- Keep AI Feedback as a separate result area without another input box.
