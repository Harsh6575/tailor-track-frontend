"use client";

import { useRouter } from "next/navigation";
import { Scissors } from "lucide-react";

export const Logo = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/")}
      className="flex items-center gap-2 cursor-pointer select-none group"
    >
      {/* Icon */}
      <div className="relative">
        <Scissors
          className="w-6 h-6 text-blue-600 transition-transform duration-300 group-hover:rotate-[-20deg]"
          strokeWidth={2.5}
        />
        <div className="absolute -bottom-[3px] -right-[3px] w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
      </div>

      {/* Text */}
      <span className="text-2xl font-bold tracking-tight">
        Tailor
        <span className="text-blue-600 group-hover:text-blue-700 transition-colors">Track</span>
      </span>
    </div>
  );
};
