"use client";

import apiClient from "@/lib/axios";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const Navbar = () => {
  const router = useRouter();

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
    <header className="border-b flex items-center justify-between w-full">
      <div className="text-2xl font-bold p-4">Tailor Track</div>
      <Button onClick={handleLogout}>Logout</Button>
    </header>
  );
};
