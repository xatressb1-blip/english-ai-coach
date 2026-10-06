"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInterviewContext } from "@/context/InterviewContext";
import { enqueueRecruiterSpeech } from "@/services/speechQueueService";
import { buildRecruiterReport, saveRecruiterReport } from "@/services/interviewReportService";
import { candidateKeyFromName } from "@/services/classroomResultUtils";
import {
  markDeviceCandidateCompleted,
  savePendingClassroomSync,
  syncClassroomResultWithRetry,
} from "@/services/classroomCloudSync";
import type { ClassroomLocalSyncRecord, ClassroomSyncPayload } from "@/types/classroomResults";
import RecruiterAvatar from "./RecruiterAvatar";
import SceneBackdrop from "./SceneBackdrop";

interface Props {
  onViewReport: () => void;
  onStartNextCandidate?: () => void;
}

export default function InterviewClosing({ onViewReport, onStartNextCandidate }: Props) {
  const {
    attempts,
    candidateName,
    selectedLevel,
    selectedCompany,
    selectedJobRole,
    selectedRecruiter,
    candidateQuestion,
    classSessionCode,
  } = useInterviewContext();
  const [speaking, setSpeaking] = useState(true);
  const [localSaved, setLocalSaved] = useState(false);
  const [localSaveError, setLocalSaveError] = useState("");
  const [deviceCompletedCount, setDeviceCompletedCount] = useState(0);
  const [syncRecord, setSyncRecord] = useState<ClassroomLocalSyncRecord | null>(null);
  const startedRef = useRef(false);
  const finalizedRef = useRef(false);
  const mountedRef = useRef(true);
  const classroomMode = Boolean(classSessionCode);
  const candidateKey = useMemo(() => candidateKeyFromName(candidateName), [candidateName]);
  const closing = "Thank you. That concludes your interview today. It was a pleasure speaking with you.";

  useEffect(() => () => {
    mountedRef.current = false;
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    enqueueRecruiterSpeech(closing, selectedRecruiter, () => setSpeaking(false));
  }, [closing, selectedRecruiter]);

  useEffect(() => {
    if (!classroomMode || finalizedRef.current || attempts.length < 3) return;
    finalizedRef.current = true;

    const report = buildRecruiterReport(attempts, candidateName);
    const interviewContext = {
      companyName: selectedCompany.name,
      companyIndustry: selectedCompany.industry,
      jobTitle: selectedJobRole.title,
      jobDepartment: selectedJobRole.department,
      recruiterName: selectedRecruiter.name,
    };
    const payload: ClassroomSyncPayload = {
      sessionCode: classSessionCode,
      candidateKey,
      candidateName,
      companyName: selectedCompany.name,
      jobTitle: selectedJobRole.title,
      recruiterName: selectedRecruiter.name,
      report,
      attempts,
    };

    try {
      // Keep two local safety copies: the normal interview history and the
      // classroom sync payload. Cloud synchronization is deliberately not a
      // prerequisite for switching candidates.
      saveRecruiterReport(
        report,
        attempts,
        selectedLevel,
        candidateName,
        interviewContext,
        candidateQuestion,
      );
      const pending = savePendingClassroomSync(payload);
      setSyncRecord(pending);
      setLocalSaved(true);
      setDeviceCompletedCount(markDeviceCandidateCompleted(classSessionCode, candidateKey));

      // Continue independently of this screen. If the candidate switches roles,
      // the promise remains alive and retries transient network failures.
      void syncClassroomResultWithRetry(payload).then((next) => {
        if (mountedRef.current) setSyncRecord(next);
      });
    } catch (error) {
      finalizedRef.current = false;
      setLocalSaved(false);
      setLocalSaveError(error instanceof Error ? error.message : "Could not save the interview locally.");
    }
  }, [
    attempts,
    candidateKey,
    candidateName,
    candidateQuestion,
    classSessionCode,
    classroomMode,
    selectedCompany,
    selectedJobRole,
    selectedLevel,
    selectedRecruiter,
  ]);

  const classroomButtonReady = !speaking && localSaved;
  const partnerTurnAvailable = deviceCompletedCount < 2;

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 text-white shadow-2xl">
      <SceneBackdrop scene="room" overlay="dark" className="px-5 py-9 sm:px-10 sm:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <RecruiterAvatar recruiter={selectedRecruiter} state={speaking ? "speaking" : "idle"} size="xl" priority showStatusDot showWaveform />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Professional Closing</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Interview complete</h1>
          <div className="mt-6 rounded-2xl border border-white/15 bg-slate-950/50 p-5 text-left text-base leading-7 text-slate-100 backdrop-blur-md sm:p-7 sm:text-lg">{closing}</div>
          {!speaking && (
            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-left text-sm leading-6 text-slate-200">
              Candidate may respond naturally: <strong className="text-white">“Thank you for your time.”</strong>
            </div>
          )}

          {classroomMode ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-4 text-left text-sm leading-6 text-emerald-50">
                {!localSaved && !localSaveError && <p className="font-semibold">Saving this interview on the computer...</p>}
                {localSaved && <p className="font-semibold">✓ Interview saved. The teacher will review the class results later.</p>}
                {localSaved && syncRecord?.status === "synced" && <p className="mt-1 text-emerald-200">✓ Synced to teacher · Session {classSessionCode}</p>}
                {localSaved && syncRecord?.status !== "synced" && <p className="mt-1 text-amber-100">↻ Teacher sync is continuing in the background.</p>}
                {localSaveError && <p className="font-semibold text-rose-200">Could not save safely: {localSaveError}</p>}
              </div>

              {localSaved && partnerTurnAvailable && onStartNextCandidate && (
                <>
                  <p className="text-sm font-semibold text-blue-100">Please switch roles with your partner.</p>
                  <button
                    type="button"
                    onClick={onStartNextCandidate}
                    disabled={!classroomButtonReady}
                    className="min-h-14 w-full rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-w-72"
                  >
                    {speaking ? "Recruiter is concluding..." : "Start Next Candidate →"}
                  </button>
                </>
              )}

              {localSaved && !partnerTurnAvailable && (
                <div className="rounded-2xl border border-blue-300/30 bg-blue-400/10 p-5">
                  <p className="text-lg font-bold text-white">Both interviews on this computer are complete.</p>
                  <p className="mt-1 text-sm text-blue-100">Please wait for your teacher. The teacher dashboard will provide the class feedback.</p>
                </div>
              )}
            </div>
          ) : (
            <button type="button" onClick={onViewReport} disabled={speaking} className="mt-7 min-h-14 w-full rounded-xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-w-72">
              {speaking ? "Recruiter is concluding..." : "View AI Interview Review"}
            </button>
          )}
        </div>
      </SceneBackdrop>
    </section>
  );
}
