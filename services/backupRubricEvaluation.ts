import { InterviewQuestion } from "@/types/InterviewQuestion";
import { EvaluationResult, IdeaAssessment } from "@/types/evaluation";
import { analyzeFocus } from "./focusAnalyzer";
import { EVALUATION_VERSION } from "./evaluationReliability";

type BackupLevel = "good" | "developing" | "needs_improvement";

type CriterionRule = {
  id: string;
  label: string;
  covered: RegExp[];
  partial?: RegExp[];
};

const NEGATION_WINDOW = /\b(?:no|not|never|cannot|can't|do not|don't|did not|didn't|without)\b/i;

function normalize(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function words(text: string) {
  const clean = normalize(text);
  return clean ? clean.split(/\s+/).filter(Boolean).length : 0;
}

function hasPositiveMatch(text: string, patterns: RegExp[]) {
  const clean = normalize(text);
  return patterns.some((pattern) => {
    const match = clean.match(pattern);
    if (!match || match.index == null) return false;
    const before = clean.slice(Math.max(0, match.index - 32), match.index);
    return !NEGATION_WINDOW.test(before);
  });
}

function rulesForQuestion(questionId: number): CriterionRule[] {
  if (questionId === 1) {
    return [
      { id: "personal-introduction", label: "Personal introduction", covered: [/\bmy name is\b/i, /\bi am [a-z][a-z .'-]{1,30}\b/i, /\bi'm [a-z][a-z .'-]{1,30}\b/i] },
      { id: "education", label: "Education", covered: [/\bgraduat(?:e|ed|ing)\b/i, /\bcollege\b/i, /\buniversity\b/i, /\bdegree\b/i, /\bdiploma\b/i, /\bstudent at\b/i, /\bstudy at\b/i] },
      { id: "major", label: "Major or field", covered: [/\bmy major is\b/i, /\bmajor(?:ing)? in\b/i, /\bstudy(?:ing|ied)? (?:information technology|computer science|software|network|business|engineering)\b/i, /\bfield of study\b/i, /\binformation technology\b/i] },
      { id: "career-direction", label: "Career direction", covered: [/\bwant to become\b/i, /\bwould like to become\b/i, /\bhope to become\b/i, /\bcareer goal\b/i, /\bmy goal is\b/i, /\baim to (?:be|become|work)\b/i, /\bwork as (?:a|an)\b/i] },
      { id: "contribution", label: "Potential contribution", covered: [/\bcontribute\b/i, /\bbring value\b/i, /\bsupport (?:the|your) team\b/i, /\buse my (?:skills|knowledge)\b/i, /\bhelp (?:the|your) company\b/i] },
      { id: "professional-growth", label: "Professional growth", covered: [/\bgrow professionally\b/i, /\bprofessional growth\b/i, /\bcontinue learning\b/i, /\bdevelop my\b/i, /\bimprove my\b/i, /\bgrow with (?:the|your) company\b/i] },
    ];
  }

  if (questionId === 2) {
    return [
      { id: "clear-strength", label: "Clear strength", covered: [/\b(?:one of )?my (?:biggest )?strengths? (?:is|are)\b/i, /\bi am good at\b/i, /\bmy ability to\b/i, /\bi am (?:a )?(?:quick learner|team player|responsible|adaptable|organized|creative|hardworking)\b/i] },
      { id: "explanation", label: "Why it matters", covered: [/\bbecause\b/i, /\bthis is important\b/i, /\bhelps? me\b/i, /\ballows? me\b/i, /\buseful (?:because|for)\b/i] },
      { id: "specific-example", label: "Specific example", covered: [/\bfor example\b/i, /\bfor instance\b/i, /\bduring my (?:internship|project|study|course)\b/i, /\bin my (?:project|internship|team)\b/i, /\bwhen i\b/i] },
      { id: "action", label: "Action taken", covered: [/\bi (?:created|built|developed|organized|solved|learned|taught|implemented|designed|completed|helped|managed|led|supported|automated|worked)\b/i] },
      { id: "result", label: "Result or impact", covered: [/\bas a result\b/i, /\b(?:reduced|improved|increased|saved|completed|delivered|achieved|finished)\b/i, /\bon time\b/i, /\bthe result was\b/i] },
      { id: "evidence", label: "Specific evidence", covered: [/\b\d+(?:\.\d+)?\s*(?:%|percent|hours?|days?|weeks?|months?|people|students?|tasks?|projects?)\b/i, /\bfrom\s+\d+\b.*\bto\s+\d+\b/i, /\bteam of\s+\d+\b/i, /\bless than\s+\d+\b/i, /\bmore than\s+\d+\b/i] },
      { id: "job-connection", label: "Connection to the role", covered: [/\bthis strength will help\b/i, /\bin this role\b/i, /\bin this position\b/i, /\bat your company\b/i, /\bcontribute to (?:your|the)\b/i, /\bbecome productive\b/i] },
    ];
  }

  if (questionId === 3) {
    return [
      { id: "company-research", label: "Company research", covered: [/\bi (?:have )?researched\b/i, /\bi (?:have )?learned that\b/i, /\bfrom your website\b/i, /\bi (?:have )?read about\b/i, /\bi know that\b/i] },
      { id: "company-attraction", label: "Specific attraction", covered: [/\bimpressed me\b/i, /\battracted (?:me|to)\b/i, /\binnovation\b/i, /\bhigh[- ]quality\b/i, /\bemployee development\b/i, /\bworking environment\b/i, /\bcompany culture\b/i, /\breputation\b/i, /\bcontinuous learning\b/i] },
      { id: "role-fit", label: "Fit with the position", covered: [/\bgreat match\b/i, /\b(?:role|position) (?:is )?(?:a )?(?:good|strong) fit\b/i, /\bmatches? my\b/i, /\bfit(?:s)? my\b/i, /\bthis position\b.*\bbecause\b/i] },
      { id: "relevant-skills", label: "Relevant skills", covered: [/\b(?:programming|teamwork|problem solving|communication|software development|networking|technical skills|collaboration)\b/i, /\bmy skills\b/i, /\bmy experience\b/i] },
      { id: "contribution", label: "Potential contribution", covered: [/\bcontribute\b/i, /\bbring value\b/i, /\bsupport your team\b/i, /\bhelp (?:your|the) company\b/i, /\bmeaningful projects\b/i] },
      { id: "growth-alignment", label: "Growth alignment", covered: [/\bgrow (?:with|together|professionally)\b/i, /\bcontinue learning\b/i, /\blearn from\b/i, /\bdevelop my\b/i, /\bcareer growth\b/i] },
      { id: "specificity", label: "Company-specific reasoning", covered: [/\binnovation\b/i, /\bhigh[- ]quality (?:products|software|services)\b/i, /\bemployee development\b/i, /\bcontinuous learning\b/i, /\bsupportive working environment\b/i, /\bmeaningful projects\b/i] },
    ];
  }

  return [];
}

function assessCriteria(question: InterviewQuestion, transcript: string): IdeaAssessment[] {
  const localRules = rulesForQuestion(question.id);
  const expected = question.expectedIdeas ?? [];

  return expected.map((idea) => {
    const rule = localRules.find((item) => item.id === idea.id);
    const covered = rule ? hasPositiveMatch(transcript, rule.covered) : false;
    const partial = !covered && rule?.partial ? hasPositiveMatch(transcript, rule.partial) : false;

    return {
      id: idea.id,
      label: idea.label,
      status: covered ? "covered" : partial ? "partial" : "missing",
      evidence: covered ? "Criterion supported by the recorded transcript." : "",
      coachingTip: covered ? "" : idea.description,
    };
  });
}

function weightedCoverage(question: InterviewQuestion, assessments: IdeaAssessment[]) {
  const ideas = question.expectedIdeas ?? [];
  const total = ideas.reduce((sum, idea) => sum + (idea.weight ?? 1), 0);
  if (!total) return 0;
  const earned = assessments.reduce((sum, item, index) => {
    const weight = ideas[index]?.weight ?? 1;
    return sum + weight * (item.status === "covered" ? 1 : item.status === "partial" ? 0.5 : 0);
  }, 0);
  return Math.round((earned / total) * 100);
}

function backupLevel(coverage: number, wordCount: number): BackupLevel {
  if (coverage >= 68 && wordCount >= 28) return "good";
  if (coverage >= 42 && wordCount >= 16) return "developing";
  return "needs_improvement";
}

function scoreForLevel(level: BackupLevel) {
  if (level === "good") return 8;
  if (level === "developing") return 7;
  return 6;
}

function evidenceScore(questionId: number, transcript: string, coverage: number) {
  const text = normalize(transcript);
  let score = Math.round(coverage * 0.65);
  if (/\b(for example|for instance|during my|in my project|when i)\b/i.test(text)) score += 10;
  if (/\b(as a result|reduced|improved|increased|saved|completed|delivered|achieved)\b/i.test(text)) score += 10;
  if (/\b\d+(?:\.\d+)?\s*(?:%|percent|hours?|days?|weeks?|months?|people|students?|tasks?|projects?)\b/i.test(text)) score += 10;
  if (questionId === 1 && words(text) >= 35) score += 8;
  return Math.max(0, Math.min(100, score));
}

function prioritySuggestion(question: InterviewQuestion, assessments: IdeaAssessment[]) {
  const missing = assessments.find((item) => item.status === "missing");
  if (missing) return `Add a clearer ${missing.label.toLowerCase()} to strengthen the answer.`;
  const partial = assessments.find((item) => item.status === "partial");
  if (partial) return `Develop the ${partial.label.toLowerCase()} with one more specific detail.`;
  if (question.id === 2) return "Keep the example concise and make the result measurable when possible.";
  if (question.id === 3) return "Keep the company reason specific and connect it directly to your contribution.";
  return "Keep the introduction concise and connect your goal to the value you can bring.";
}

export function buildBackupRubricEvaluation(
  question: InterviewQuestion,
  transcript: string,
  reason = "Live AI evaluation unavailable"
): EvaluationResult {
  if (question.id < 1 || question.id > 3) {
    throw new Error("Backup rubric is available only for presentation questions 1-3.");
  }

  const assessments = assessCriteria(question, transcript);
  const coverage = weightedCoverage(question, assessments);
  const wordCount = words(transcript);
  const level = backupLevel(coverage, wordCount);
  const score = scoreForLevel(level);
  const suggestion = prioritySuggestion(question, assessments);

  const focus = analyzeFocus(question, transcript, {
    criteria: assessments,
    evidenceQualityScore: evidenceScore(question.id, transcript, coverage),
    summary:
      level === "good"
        ? "The answer is relevant and covers most of the expected interview content."
        : level === "developing"
          ? "The answer stays on topic but needs one or more important details."
          : "The answer needs more of the expected content before the next practice.",
  });

  const provisionalComment =
    "Backup rubric estimate from the recorded transcript; confirm with the observer and teacher.";

  return {
    evaluationVersion: `${EVALUATION_VERSION}-backup-rubric-v1`,
    evaluationStatus: "available",
    evaluationSource: "backup_rubric",
    backupLevel: level,
    evaluationError: reason,
    overall: score,
    overallFeedback:
      level === "good"
        ? "Good performance: the answer is focused, structured, and suitable for the interview task."
        : level === "developing"
          ? "Developing performance: the answer is relevant but needs stronger supporting details."
          : "Needs improvement: add more of the required interview content and supporting detail.",
    grammar: { score, comment: provisionalComment, mistakes: [] },
    vocabulary: { score, comment: provisionalComment },
    pronunciation: { score, comment: "Not independently assessed in backup mode; Observer 2 and the teacher confirm spoken clarity." },
    fluency: { score, comment: "Provisional transcript-based estimate; use speech metrics and Observer 2 for confirmation." },
    relevance: { score, comment: `Backup rubric coverage: ${coverage}%.` },
    confidence: { score, comment: "Not visually assessed in backup mode; Observer 3 and the teacher confirm professional performance." },
    suggestions: [suggestion],
    focusAnalysis: focus,
    coach: { good: level === "good", feedback: level === "good" ? [] : [suggestion] },
    improvedAnswer: "",
  };
}
