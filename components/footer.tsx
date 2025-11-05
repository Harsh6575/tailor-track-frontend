"use client";

import { APP_NAME } from "@/lib/constants";

export const Footer = () => {
  return (
    <footer className="border-t w-full text-center py-4 text-sm text-gray-500">
      &copy; {new Date().getFullYear()} <span className="font-semibold">{APP_NAME}</span>. All
      rights reserved.
    </footer>
  );
};
