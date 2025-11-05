import { MainLayout } from "@/components/layouts/main-layout";

export default function MainLayout2({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
