import { Metadata } from "next";
import { Main } from "./_components/main";

export const metadata: Metadata = {
  title: "Tailor Dashboard",
  description: "Manage your tailoring business effortlessly",
};

export default function HomePage() {
  return <Main />;
}
