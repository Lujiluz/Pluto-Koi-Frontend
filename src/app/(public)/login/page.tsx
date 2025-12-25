"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verified = searchParams.get("verified");

    // Redirect to homepage with verified parameter if present
    if (verified === "true") {
      router.replace("/?verified=true");
    } else {
      // Just redirect to homepage and open login modal
      router.replace("/?openLogin=true");
    }
  }, [searchParams, router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
