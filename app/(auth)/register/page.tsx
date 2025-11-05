import { Metadata } from "next";
import { RegisterForm } from "./_components/register-form";
import { AuthPageWrapper } from "../_components/auth-page-wrapper";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Register - ${APP_NAME}`,
  description: `Create a ${APP_NAME} account to manage your tailoring projects efficiently.`,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RegisterPage() {
  return (
    <AuthPageWrapper>
      <RegisterForm />
    </AuthPageWrapper>
  );
}
