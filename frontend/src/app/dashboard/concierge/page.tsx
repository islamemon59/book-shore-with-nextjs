import { AssistantChat } from "@/components/dashboard/assistant-chat";
import { RecommendationsPanel } from "@/components/dashboard/recommendations-panel";

export default function DashboardConciergePage() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <AssistantChat />
      <RecommendationsPanel />
    </div>
  );
}
