import { authFetch } from "@/lib/server-api";
import { ProfileForm } from "@/components/dashboard/profile-form";

export default async function DashboardProfilePage() {
  const response = await authFetch<{
    item: {
      name: string;
      image?: string | null;
      preferences: {
        favoriteGenres: string[];
        favoriteFormats: string[];
        monthlyBudget: number | null;
        readingGoal: number | null;
      };
    };
  }>("/api/users/me");

  return <ProfileForm initialProfile={response.item} />;
}
