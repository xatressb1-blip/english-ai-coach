FIX 28 - SAFARI AUDIO TRANSCRIPTION MODEL HOTFIX
================================================

Problem
-------
Safari/iPhone uses MediaRecorder and sends the recorded audio to /api/transcribe.
The route inherited GEMINI_MODEL. When Vercel still had GEMINI_MODEL=gemini-2.5-flash,
Google returned HTTP 404 because that model was unavailable for the API project.
The raw provider error was then shown in the mobile interface.

Changes
-------
1. Audio transcription now uses GEMINI_AUDIO_MODEL only when explicitly configured.
2. The default transcription model is gemini-3.6-flash.
3. If a configured audio model is unavailable, the server retries with gemini-3.6-flash.
4. Raw Gemini JSON errors are no longer exposed to candidates.
5. Friendly messages are returned for quota, timeout, configuration, and generic failures.

Recommended Vercel environment
------------------------------
Optional:
GEMINI_AUDIO_MODEL=gemini-3.6-flash

The application also works when GEMINI_AUDIO_MODEL is not defined.
The existing GEMINI_MODEL may remain configured for evaluation/report generation.

Files changed
-------------
app/api/transcribe/route.ts
README-FIX-28.txt
