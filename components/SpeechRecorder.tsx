"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useSpeechContext } from "@/context/SpeechContext";
import {
  createSpeechRecognition,
  destroySpeechRecognition,
  isSpeechRecognitionSupported,
  type BrowserSpeechRecognition,
} from "@/services/speechRecognitionService";
import {
  registerRecognition,
  unregisterRecognition,
} from "@/services/speechRecognitionManager";
import {
  startRecording,
  stopRecording,
} from "@/services/speechController";

type RecorderMode = "checking" | "web-speech" | "audio-upload" | "manual";

interface SpeechRecorderProps {
  allowManualInput?: boolean;
  compact?: boolean;
  title?: string;
  hideTranscript?: boolean;
}

function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  return (
    /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function chooseAudioMimeType(): string {
  if (typeof MediaRecorder === "undefined") {
    return "";
  }

  const candidates = [
    "audio/mp4",
    "audio/webm;codecs=opus",
    "audio/webm",
  ];

  return (
    candidates.find((type) => MediaRecorder.isTypeSupported?.(type)) ?? ""
  );
}

function extensionFromMimeType(mimeType: string): string {
  if (mimeType.includes("mp4") || mimeType.includes("aac")) {
    return "m4a";
  }

  if (mimeType.includes("ogg")) {
    return "ogg";
  }

  return "webm";
}

export default function SpeechRecorder({
  allowManualInput = true,
  compact = false,
  title = "Speaking Practice",
  hideTranscript = false,
}: SpeechRecorderProps) {
  const [mode, setMode] = useState<RecorderMode>("checking");
  const [speechError, setSpeechError] = useState("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const {
    transcript,
    setTranscript,
    status,
    setStatus,
    resetSpeech,
  } = useSpeechContext();

  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const shouldKeepRecordingRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transcriptRef = useRef("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopRecordingTimer = useCallback(() => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  }, []);

  const stopMediaStream = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  }, []);

  const appendTranscript = useCallback(
    (nextText: string): void => {
      const cleanText = nextText.trim().replace(/\s+/g, " ");

      if (!cleanText) {
        return;
      }

      const capitalize = (value: string): string =>
        value.charAt(0).toUpperCase() + value.slice(1);
      const endSentence = (value: string): string =>
        /[.!?]$/.test(value) ? value : `${value}.`;

      const currentText = transcriptRef.current.trim().replace(/\s+/g, " ");
      const preparedNextText = capitalize(cleanText);

      if (!currentText) {
        transcriptRef.current = preparedNextText;
        setTranscript(preparedNextText);
        return;
      }

      const currentLower = currentText.toLowerCase();
      const nextLower = preparedNextText.toLowerCase();

      if (currentLower.includes(nextLower)) {
        return;
      }

      if (nextLower.includes(currentLower)) {
        transcriptRef.current = preparedNextText;
        setTranscript(preparedNextText);
        return;
      }

      const currentWords = currentText.split(" ");
      const nextWords = preparedNextText.split(" ");
      const maxOverlap = Math.min(currentWords.length, nextWords.length);
      let overlap = 0;

      for (let size = maxOverlap; size > 0; size -= 1) {
        const currentTail = currentWords
          .slice(currentWords.length - size)
          .join(" ")
          .replace(/[.!?,]$/g, "")
          .toLowerCase();
        const nextHead = nextWords
          .slice(0, size)
          .join(" ")
          .replace(/[.!?,]$/g, "")
          .toLowerCase();

        if (currentTail === nextHead) {
          overlap = size;
          break;
        }
      }

      const wordsToAppend = nextWords.slice(overlap);

      if (wordsToAppend.length === 0) {
        return;
      }

      const appendedText = wordsToAppend.join(" ");
      const combinedText =
        overlap > 0
          ? `${currentText} ${appendedText}`
          : `${endSentence(currentText)} ${capitalize(appendedText)}`;

      transcriptRef.current = combinedText;
      setTranscript(combinedText);
    },
    [setTranscript]
  );

  const transcribeAudio = useCallback(
    async (audioBlob: Blob): Promise<void> => {
      if (audioBlob.size < 500) {
        throw new Error("No audio was captured. Please try again and speak after the microphone becomes active.");
      }

      const mimeType = audioBlob.type || "audio/mp4";
      const extension = extensionFromMimeType(mimeType);
      const formData = new FormData();
      formData.append(
        "audio",
        new File([audioBlob], `interview-answer.${extension}`, { type: mimeType })
      );

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        success?: boolean;
        transcript?: string;
        message?: string;
      };

      if (!response.ok || !data.success || !data.transcript?.trim()) {
        throw new Error(data.message || "The audio could not be transcribed.");
      }

      const cleanedTranscript = data.transcript.trim();
      transcriptRef.current = cleanedTranscript;
      setTranscript(cleanedTranscript);
      setStatus("finished");
    },
    [setStatus, setTranscript]
  );

  useEffect(() => {
    const ios = isIOSDevice();

    if (ios) {
      const canRecord = Boolean(
        navigator.mediaDevices &&
          typeof MediaRecorder !== "undefined"
      );

      queueMicrotask(() => {
        setMode(canRecord ? "audio-upload" : "manual");
        if (!canRecord) {
          setSpeechError(
            allowManualInput
              ? "Audio recording is not supported by this browser. Please type your answer below."
              : "Audio recording is not supported by this browser. Mock Interview requires a compatible microphone browser."
          );
        }
      });
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      const canRecord = Boolean(navigator.mediaDevices && typeof MediaRecorder !== "undefined");
      queueMicrotask(() => {
        setMode(canRecord ? "audio-upload" : "manual");
        setSpeechError(
          canRecord
            ? "Live speech recognition is unavailable, so audio recording mode is being used for better compatibility."
            : allowManualInput
              ? "Voice recording is not supported by this browser. Please type your answer below."
              : "Voice recording is not supported by this browser. Mock Interview requires microphone access."
        );
      });
      return;
    }

    queueMicrotask(() => setMode("web-speech"));
    let recognition: BrowserSpeechRecognition | null = null;

    try {
      recognition = createSpeechRecognition({
        onStart: () => {
          setSpeechError("");
          setStatus("recording");
        },
        onResult: appendTranscript,
        onError: (message: string) => {
          const recoverable =
            message === "No speech detected." ||
            message === "Speech recognition aborted.";

          if (shouldKeepRecordingRef.current && recoverable) {
            return;
          }

          shouldKeepRecordingRef.current = false;
          setSpeechError(message);
          setStatus("finished");
        },
        onEnd: () => {
          if (!shouldKeepRecordingRef.current) {
            setStatus("finished");
            return;
          }

          if (restartTimerRef.current) {
            clearTimeout(restartTimerRef.current);
          }

          restartTimerRef.current = setTimeout(() => {
            if (!shouldKeepRecordingRef.current || !recognitionRef.current) {
              return;
            }

            try {
              recognitionRef.current.start();
            } catch (error) {
              console.warn("[SpeechRecorder] Recognition restart delayed.", error);
            }
          }, 80);
        },
      });

      recognitionRef.current = recognition;
      registerRecognition(recognition);
    } catch (error) {
      console.error("[SpeechRecorder] Initialization failed", error);
      queueMicrotask(() => {
        const canRecord = Boolean(navigator.mediaDevices && typeof MediaRecorder !== "undefined");
        setMode(canRecord ? "audio-upload" : "manual");
        setSpeechError(
          canRecord
            ? "Live recognition could not start, so audio recording mode is being used instead."
            : allowManualInput
              ? "Voice recognition could not be started. Please type your answer below."
              : "Voice recognition could not be started. Check microphone permission and try again."
        );
      });
    }

    return () => {
      shouldKeepRecordingRef.current = false;
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
      }
      unregisterRecognition();
      destroySpeechRecognition(recognition);
      recognitionRef.current = null;
    };
  }, [allowManualInput, appendTranscript, setStatus]);

  useEffect(() => {
    return () => {
      stopRecordingTimer();
      stopMediaStream();
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
    };
  }, [stopMediaStream, stopRecordingTimer]);

  const startAudioRecording = async (): Promise<void> => {
    setSpeechError("");
    transcriptRef.current = "";
    resetSpeech();
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;
      const mimeType = chooseAudioMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        stopRecordingTimer();
        stopMediaStream();
        setStatus("finished");
        setSpeechError("Safari could not record audio. Please check microphone permission and try again.");
      };

      recorder.onstop = async () => {
        stopRecordingTimer();
        stopMediaStream();
        const blob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || mimeType || "audio/mp4",
        });

        try {
          await transcribeAudio(blob);
        } catch (error) {
          console.error("[SpeechRecorder] Audio transcription failed", error);
          setStatus("finished");
          setSpeechError(
            error instanceof Error
              ? error.message
              : "The audio could not be transcribed. Please try again or type your answer."
          );
        }
      };

      recorder.start(1000);
      setStatus("recording");
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((seconds) => {
          const next = seconds + 1;
          if (next >= 180 && mediaRecorderRef.current?.state === "recording") {
            setStatus("processing");
            mediaRecorderRef.current.stop();
          }
          return next;
        });
      }, 1000);
    } catch (error) {
      console.error("[SpeechRecorder] getUserMedia failed", error);
      stopMediaStream();
      setStatus("ready");
      setSpeechError(
        "The microphone did not start. In Safari, open Website Settings, set Microphone to Allow, then reload the page."
      );
    }
  };

  const handleStartRecording = async (): Promise<void> => {
    if (status === "recording" || status === "processing") {
      return;
    }

    if (mode === "audio-upload") {
      await startAudioRecording();
      return;
    }

    if (mode !== "web-speech") {
      return;
    }

    setSpeechError("");
    transcriptRef.current = "";
    resetSpeech();
    shouldKeepRecordingRef.current = true;

    if (!startRecording()) {
      shouldKeepRecordingRef.current = false;
      setSpeechError(
        "The microphone could not start. Check microphone permission, then try again."
      );
    }
  };

  const handleStopRecording = (): void => {
    if (status !== "recording") {
      return;
    }

    if (mode === "audio-upload") {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        setStatus("finished");
        setSpeechError("The recorder was not active. Please try again.");
        return;
      }

      setStatus("processing");
      recorder.stop();
      return;
    }

    shouldKeepRecordingRef.current = false;
    const currentText = transcriptRef.current.trim();

    if (currentText && !/[.!?]$/.test(currentText)) {
      const punctuatedText = `${currentText}.`;
      transcriptRef.current = punctuatedText;
      setTranscript(punctuatedText);
    }

    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }

    if (stopRecording()) {
      setStatus("processing");
    }
  };

  const handleClearTranscript = (): void => {
    if (status === "recording" || status === "processing") {
      return;
    }

    transcriptRef.current = "";
    setSpeechError("");
    resetSpeech();
  };

  const canUseVoice = mode === "web-speech" || mode === "audio-upload";
  const showManualInput = allowManualInput && mode === "manual";

  const statusText = {
    ready: mode === "audio-upload" ? "🎤 Ready for compatible audio recording" : "🎤 Ready to practice",
    recording:
      mode === "audio-upload"
        ? `🔴 Microphone active • ${recordingSeconds}s`
        : "🔴 Recording...",
    processing:
      mode === "audio-upload"
        ? "🤖 Converting your English audio to text..."
        : "🤖 Processing your answer...",
    finished: "✅ Recording completed",
  }[status];

  return (
    <section className={`${compact ? "mt-5 p-4 sm:p-5" : "mt-6 p-4 sm:mt-8 sm:p-6 lg:mt-10 lg:p-8"} rounded-2xl border border-slate-200 bg-white shadow-lg`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className={`${compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl lg:text-3xl"} font-bold text-slate-900`}>
          🎤 {title}
        </h2>
        {mode === "audio-upload" && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            Compatible audio mode
          </span>
        )}
      </div>

      {mode === "audio-upload" && (
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your browser records audio first. After you press Stop Recording, the audio is sent to the server and converted to English text. Keep this page open until the transcript appears.
        </p>
      )}

      {speechError && (
        <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          {speechError}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:gap-4">
        {status === "recording" ? (
          <button
            type="button"
            onClick={handleStopRecording}
            className="w-full rounded-2xl bg-slate-800 px-8 py-5 text-lg font-bold text-white shadow-lg transition active:scale-95 sm:w-auto"
          >
            ⏹ Stop Recording
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStartRecording}
            disabled={!canUseVoice || status === "processing"}
            className="w-full rounded-2xl bg-gradient-to-r from-red-500 to-red-600 px-8 py-5 text-lg font-bold text-white shadow-lg transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {mode === "manual"
              ? "⌨️ Voice Unavailable"
              : mode === "checking"
                ? "Checking microphone..."
                : "🎤 Start Recording"}
          </button>
        )}

        <button
          type="button"
          onClick={handleClearTranscript}
          disabled={status === "recording" || status === "processing"}
          className="w-full rounded-2xl bg-blue-600 px-8 py-5 text-lg font-semibold text-white shadow-lg transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          🗑 Clear
        </button>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full ${
              status === "recording"
                ? "animate-pulse bg-red-500"
                : status === "processing"
                  ? "animate-pulse bg-yellow-500"
                  : status === "finished"
                    ? "bg-green-500"
                    : "bg-blue-500"
            }`}
          />
          <p className="text-sm font-semibold text-blue-700 sm:text-base">
            {statusText}
          </p>
        </div>

        {status === "processing" && (
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
          </div>
        )}
      </div>

      <div className="mt-6 sm:mt-8">
        {hideTranscript ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            <p className="font-semibold text-slate-800">Private interview transcript</p>
            <p className="mt-1">{transcript.trim() ? "Your response has been captured and is ready to submit." : status === "processing" ? "Your audio is being converted to text." : "Your transcript stays hidden during Mock Interview so you can focus on speaking naturally."}</p>
          </div>
        ) : (
          <>
            <h3 className="mb-3 text-base font-semibold text-slate-800 sm:text-lg">Your Answer</h3>
            <div className={`${compact ? "min-h-[120px] sm:min-h-[150px]" : "min-h-[150px] sm:min-h-[200px] lg:min-h-[220px]"} overflow-y-auto break-words rounded-xl border border-slate-200 bg-slate-50 p-4 leading-7 sm:p-5`}>
              {transcript.trim() ? (
                <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-800 sm:text-base">{transcript}</p>
              ) : (
                <p className="text-sm italic text-slate-400 sm:text-base">{status === "processing" ? "Please wait while your audio is converted to text..." : "Your answer will appear here..."}</p>
              )}
            </div>
          </>
        )}

        {showManualInput && (
          <textarea
            value={transcript}
            onChange={(event) => {
              transcriptRef.current = event.target.value;
              setTranscript(event.target.value);
            }}
            placeholder="Type your answer here if voice recording is unavailable..."
            className="mt-4 min-h-40 w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-base leading-7 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        )}
      </div>
    </section>
  );
}
