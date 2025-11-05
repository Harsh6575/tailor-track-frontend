import { NotFoundContent } from "@/components/not-found-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found",
  description: "Page not found",
};

export default function NotFound() {
  return <NotFoundContent />;
}
