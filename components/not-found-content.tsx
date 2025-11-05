"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";
import { usePathname } from "next/navigation";
import { MainLayout } from "@/components/layouts/main-layout";

export const NotFoundContent = () => {
  const pathname = usePathname();
  const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isAuthRoute = authRoutes.some((route) => pathname?.startsWith(route));

  const content = (
    <div className="flex flex-col items-center justify-center text-center h-full w-full py-12">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h1 className="text-3xl font-bold tracking-tight mb-2">Page Not Found</h1>
      <p className="text-muted-foreground max-w-md">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Button asChild variant="default" className="mt-6">
        <Link href={isAuthRoute ? "/login" : "/"}>
          <Home className="mr-2 h-4 w-4" />
          {isAuthRoute ? "Go to Login" : "Go Back Home"}
        </Link>
      </Button>
    </div>
  );

  if (isAuthRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">{content}</div>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-1 items-center justify-center">{content}</div>
    </MainLayout>
  );
};
