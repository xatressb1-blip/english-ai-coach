"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getRecordingVisualStream, subscribeRecordingVisualStream } from "@/services/recordingVisualStream";

const serverStream = () => null;
const heights = [12, 22, 30, 18, 36, 24, 40, 28, 16, 32, 20];

function MicrophoneWave({ stream }: { stream: MediaStream }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let context: AudioContext | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let analyser: AnalyserNode | null = null;
    let frame = 0;
    let disposed = false;
    let last = 0;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)") ?? { matches: false };
    function clean() {
      cancelAnimationFrame(frame);
      try { source?.disconnect(); analyser?.disconnect(); } catch { /* optional UI */ }
      // Never stop stream tracks: they belong to SpeechRecorder.
      if (context && context.state !== "closed") void context.close().catch(() => {});
    }
    try {
      if (!window.AudioContext) return;
      context = new AudioContext();
      const ctx = context;
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source = ctx.createMediaStreamSource(stream);
      source.connect(analyser); // No destination connection: no microphone feedback.
      const node = analyser;
      const samples = new Uint8Array(node.fftSize);
      const drawing = canvas.current?.getContext("2d");
      if (!drawing) { clean(); return; }
      const draw = (time: number) => {
        if (disposed) return;
        try {
          if (time - last >= 50) {
            last = time;
            const active = ctx.state === "running" && stream.getAudioTracks().some(track => track.readyState === "live" && track.enabled && !track.muted);
            setAvailable(active);
            drawing.clearRect(0, 0, 320, 40);
            node.getByteTimeDomainData(samples);
            let sum = 0;
            for (const sample of samples) sum += ((sample - 128) / 128) ** 2;
            const level = active ? Math.min(1, Math.sqrt(sum / samples.length) * 5) : 0;
            drawing.fillStyle = "#5eead4";
            for (let i = 0; i < 25; i++) {
              const h = reduced.matches ? 3 : 3 + level * (12 + 22 * (1 - Math.abs(i - 12) / 12));
              drawing.fillRect(10 + i * 12, (40 - h) / 2, 6, h);
            }
          }
          frame = requestAnimationFrame(draw);
        } catch { setAvailable(false); clean(); }
      };
      void ctx.resume().then(() => { if (!disposed) frame = requestAnimationFrame(draw); }).catch(() => {
        if (!disposed) { setAvailable(false); clean(); }
      });
    } catch { clean(); }
    return () => { disposed = true; clean(); };
  }, [stream]);
  return <div className="w-full"><canvas ref={canvas} width={320} height={40} className="mx-auto h-10 w-full max-w-80" aria-hidden="true"/><p className="text-center text-[11px] text-teal-100">{available ? "Microphone level · not an assessment" : "Recording · level display unavailable"}</p></div>;
}

export default function InterviewAudioVisual({ asking, recording }: { asking: boolean; recording: boolean }) {
  const stream = useSyncExternalStore(subscribeRecordingVisualStream, getRecordingVisualStream, serverStream);
  const [playing, setPlaying] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (!asking || hidden) return;
    const update = () => { try { setPlaying(Boolean(window.speechSynthesis?.speaking && !window.speechSynthesis?.paused)); } catch { setPlaying(false); } };
    update();
    const timer = window.setInterval(update, 150);
    return () => window.clearInterval(timer);
  }, [asking, hidden]);
  const animated = asking && playing && !recording;
  return <div className="relative mt-4 flex min-h-[92px] items-center justify-center rounded-xl border border-white/10 bg-slate-950/25 px-3 pb-2 pt-5">
    <button type="button" onClick={() => setHidden(!hidden)} aria-pressed={!hidden} className="absolute right-2 top-1 rounded px-2 text-[10px] text-slate-300 hover:text-white focus-visible:outline-2 focus-visible:outline-white">{hidden ? "Show audio visual" : "Hide audio visual"}</button>
    {hidden ? <p className="text-xs text-slate-300">Audio visual hidden · recording is unchanged</p> : recording && stream ? <MicrophoneWave stream={stream}/> : <div className="text-center"><div aria-hidden="true" className="flex h-10 items-center justify-center gap-1.5">{heights.map((height, i) => <span key={i} className={`w-1 rounded-full ${recording ? "bg-teal-300" : "bg-blue-300"} ${animated ? "illustrative-wave" : ""}`} style={{height:animated ? height : 3, animationDelay:`${i * 90}ms`}}/>)}</div><p className="text-[11px] text-slate-200">{recording ? "Recording · microphone level unavailable in live recognition" : asking ? "Recruiter audio · illustrative animation" : "Audio activity"}</p></div>}
    <style jsx>{`
      .illustrative-wave { animation: illustrativeWave 1.4s ease-in-out infinite; }
      @keyframes illustrativeWave { 0%,100% { transform:scaleY(.4); } 50% { transform:scaleY(1); } }
      @media (prefers-reduced-motion: reduce) { .illustrative-wave { animation:none; } }
    `}</style>
  </div>;
}
