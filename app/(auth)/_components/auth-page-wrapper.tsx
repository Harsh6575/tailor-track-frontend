"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const AuthPageWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // If user is already logged in, redirect to home
    if (accessToken && refreshToken) {
      router.replace("/");
    }
  }, [router]);

  return <>{children}</>;
};
