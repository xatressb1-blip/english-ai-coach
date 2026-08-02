FIX 27 - MOBILE INTERVIEW EXPERIENCE, RECRUITER SELECTION, AND MICROPHONE RELIABILITY

Main changes
1. Adds three selectable AI recruiters in the Mock Interview lobby:
   - Ms. Emma - warm American English style
   - Mr. James - direct British English style
   - Ms. Sophia - energetic Australian English style
2. Keeps the selected recruiter consistent on the lobby, Ready screen, and live Recruiter Stage.
3. Redesigns the lobby and live interview stage for narrow smartphone screens.
4. Mock Interview no longer displays manual typed-answer fallback.
5. Enter Interview Room is enabled only after a successful microphone test.
6. Browsers without live Web Speech Recognition now use MediaRecorder audio-upload transcription when supported.
7. Enables echo cancellation, noise suppression, and automatic gain control during microphone checks and audio recording.
8. Adds a 180-second safety limit to audio-upload recordings.
9. Adds clearer iPhone/Safari instructions and prevents misleading typed-answer messages.

Files added
- data/recruiters.ts
- README-FIX-27.txt

Files replaced
- context/InterviewContext.tsx
- components/interview/VirtualInterviewLobby.tsx
- components/interview/RecruiterStage.tsx
- components/interview/ReadyScreen.tsx
- components/interview/InterviewEngine.tsx
- components/SpeechRecorder.tsx

Validation completed
- npx tsc --noEmit: PASSED
- npm run build: started, but the isolated Linux environment could not download @next/swc-linux-x64-gnu 16.2.10 (HTTP 404). Run the required build on the Windows project before GitHub deployment.
