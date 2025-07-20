"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AgentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main page since agent login is no longer available
    router.replace("/");
  }, [router]);

  return null;
}
