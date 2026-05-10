import { redirect } from "next/navigation";
import { InsightsPanel } from "@/components/dashboard/insights-panel";
import { getServerSession } from "@/lib/auth";

export default async function DashboardInsightsPage() {
  const session = await getServerSession();

  if (session?.user?.role === "USER") {
    redirect("/dashboard");
  }

  return <InsightsPanel />;
}
