"use client";

import { Globe, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SocialSigninButtons() {
  const router = useRouter();

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      } as never);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Social login failed.");
    }
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button type="button" variant="outline" onClick={() => handleSocialLogin("google")}>
        <Globe className="h-4 w-4" />
        Continue with Google
      </Button>
      <Button type="button" variant="outline" onClick={() => handleSocialLogin("facebook")}>
        <Users className="h-4 w-4" />
        Continue with Facebook
      </Button>
    </div>
  );
}
