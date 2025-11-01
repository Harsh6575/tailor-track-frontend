import { Metadata } from "next";
import { RegisterForm } from "./_components/register-form";
import { AuthPageWrapper } from "../_components/auth-page-wrapper";

export const metadata: Metadata = {
  title: "Register - Tailor Track",
  description: "Create a Tailor Track account to manage your tailoring projects efficiently.",
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
