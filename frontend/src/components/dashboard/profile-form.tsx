"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clientFetch } from "@/lib/client-api";

const profileSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  image: z.string().url("Enter a valid image URL.").or(z.literal("")),
});

const preferencesSchema = z.object({
  favoriteGenres: z.string(),
  favoriteFormats: z.string(),
  monthlyBudget: z.string(),
  readingGoal: z.string(),
});

type ProfileInput = z.infer<typeof profileSchema>;
type PreferencesInput = z.infer<typeof preferencesSchema>;

export function ProfileForm({
  initialProfile,
}: {
  initialProfile: {
    name: string;
    image?: string | null;
    preferences?: {
      favoriteGenres: string[];
      favoriteFormats: string[];
      monthlyBudget: number | null;
      readingGoal: number | null;
    };
  };
}) {
  const router = useRouter();
  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialProfile.name,
      image: initialProfile.image ?? "",
    },
  });
  const preferencesForm = useForm<PreferencesInput>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      favoriteGenres: initialProfile.preferences?.favoriteGenres?.join(", ") ?? "",
      favoriteFormats: initialProfile.preferences?.favoriteFormats?.join(", ") ?? "",
      monthlyBudget: initialProfile.preferences?.monthlyBudget ? String(initialProfile.preferences.monthlyBudget) : "",
      readingGoal: initialProfile.preferences?.readingGoal ? String(initialProfile.preferences.readingGoal) : "",
    },
  });

  const profileMutation = useMutation({
    mutationFn: (values: ProfileInput) =>
      clientFetch("/api/users/me", {
        method: "PATCH",
        body: values,
      }),
    onSuccess: () => {
      toast.success("Profile updated.");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to update profile.");
    },
  });

  const preferencesMutation = useMutation({
    mutationFn: (values: PreferencesInput) => {
      const monthlyBudget = values.monthlyBudget.trim();
      const readingGoal = values.readingGoal.trim();

      return clientFetch("/api/users/me/preferences", {
        method: "PUT",
        body: {
          favoriteGenres: values.favoriteGenres.split(",").map((item) => item.trim()).filter(Boolean),
          favoriteFormats: values.favoriteFormats.split(",").map((item) => item.trim()).filter(Boolean),
          monthlyBudget: monthlyBudget ? Number(monthlyBudget) : undefined,
          readingGoal: readingGoal ? Number(readingGoal) : undefined,
        },
      });
    },
    onSuccess: () => {
      toast.success("Reading preferences saved.");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to save reading preferences.");
    },
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form className="card-surface soft-panel p-6" onSubmit={profileForm.handleSubmit((values) => profileMutation.mutate(values))}>
        <div className="eyebrow">Profile details</div>
        <h2 className="mt-3 font-serif text-3xl font-semibold">Your reader identity</h2>
        <div className="mt-5 space-y-4">
          <Input placeholder="Full name" {...profileForm.register("name")} />
          {profileForm.formState.errors.name ? <p className="text-xs text-[var(--danger)]">{profileForm.formState.errors.name.message}</p> : null}
          <Input placeholder="Image URL" {...profileForm.register("image")} />
          {profileForm.formState.errors.image ? <p className="text-xs text-[var(--danger)]">{profileForm.formState.errors.image.message}</p> : null}
          <Button type="submit" disabled={profileMutation.isPending}>
            {profileMutation.isPending ? "Saving..." : "Save profile"}
          </Button>
        </div>
      </form>

      <form className="card-surface soft-panel p-6" onSubmit={preferencesForm.handleSubmit((values) => preferencesMutation.mutate(values))}>
        <div className="eyebrow">Reading preferences</div>
        <h2 className="mt-3 font-serif text-3xl font-semibold">Tune the recommendations</h2>
        <div className="mt-5 space-y-4">
          <Input placeholder="Favorite genres, comma separated" {...preferencesForm.register("favoriteGenres")} />
          <Input placeholder="Favorite formats, comma separated" {...preferencesForm.register("favoriteFormats")} />
          <Input type="number" placeholder="Monthly budget" {...preferencesForm.register("monthlyBudget")} />
          <Input type="number" placeholder="Annual reading goal" {...preferencesForm.register("readingGoal")} />
          <Button type="submit" disabled={preferencesMutation.isPending}>
            {preferencesMutation.isPending ? "Saving..." : "Save preferences"}
          </Button>
        </div>
      </form>
    </div>
  );
}
