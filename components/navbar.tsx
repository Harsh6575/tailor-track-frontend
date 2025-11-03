"use client";

import apiClient from "@/lib/axios";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";

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
      <div
        className="text-2xl font-bold cursor-pointer select-none"
        onClick={() => router.push("/")}
      >
        Tailor<span className="text-blue-600">Track</span>
      </div>

      {isLoggedIn ? (
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        <Button onClick={() => router.push("/login")}>Login</Button>
      )}
    </header>
  );
};
