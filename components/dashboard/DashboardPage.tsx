"use client";

import { useHistoryContext } from "@/context/HistoryContext";

import DashboardHeader from "./DashboardHeader";
import DashboardSummary from "./DashboardSummary";
import ProgressHistory from "./ProgressHistory";
import SkillAnalytics from "./SkillAnalytics";
import CoachInsights from "./CoachInsights";
import AIRecommendation from "./AIRecommendation";
export default function DashboardPage() {

  const { histories } =
    useHistoryContext();

  return (

    <div className="mx-auto max-w-6xl space-y-8 p-8">

      <DashboardHeader />

      <DashboardSummary
        histories={histories} />
<ProgressHistory
  histories={histories}
/>
<SkillAnalytics
  histories={histories}
/>
<CoachInsights
  histories={histories}
/>
<AIRecommendation
  histories={histories}
/>
    </div>

  );

}