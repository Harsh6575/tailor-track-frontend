import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar always on top */}
      <Navbar />

      {/* Main content grows to fill space */}
      <main className="flex-1 p-2 md:px-6 md:py-8">{children}</main>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
}
