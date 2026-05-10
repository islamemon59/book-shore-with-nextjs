import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { getServerSession } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="section-shell py-8">
      <DashboardHeader session={session} />
      <div className="mt-6 grid gap-6 lg:grid-cols-[290px,minmax(0,1fr)]">
        <DashboardSidebar session={session} />
        <div className="min-w-0 space-y-6">{children}</div>
      </div>
    </div>
  );
}
