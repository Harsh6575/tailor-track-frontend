"use client";

export const Footer = () => {
  return (
    <footer className="border-t w-full text-center py-4 text-sm text-gray-500">
      &copy; {new Date().getFullYear()} <span className="font-semibold">Tailor Track</span>. All
      rights reserved.
    </footer>
  );
};
