import { Metadata } from "next";
import { LoginForm } from "./_components/login-form";
import { AuthPageWrapper } from "../_components/auth-page-wrapper";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Login - ${APP_NAME}`,
  description: `Login to your ${APP_NAME} account to manage your tailoring projects.`,
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
