"use client";

import apiClient from "@/lib/axios";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { Logo } from "./logo";

export const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      if (refreshToken) {
        await apiClient.post("/users/logout", { refreshToken });
      }
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to logout from server. Clearing session locally.");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  return (
    <header className="border-b shadow-sm flex items-center justify-between w-full px-6 py-3">
      <Logo />
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button onClick={() => router.push("/login")}>Login</Button>
        )}
        <ModeToggle />
      </div>
    </header>
  );
};
