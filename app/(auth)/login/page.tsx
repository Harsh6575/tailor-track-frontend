import { Metadata } from "next";
import { LoginForm } from "./_components/login-form";
import { AuthPageWrapper } from "../_components/auth-page-wrapper";

export const metadata: Metadata = {
  title: "Login - Tailor Track",
  description: "Login to your Tailor Track account to manage your tailoring projects.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function LoginPage() {
  return (
    <AuthPageWrapper>
      <LoginForm />
    </AuthPageWrapper>
  );
}
