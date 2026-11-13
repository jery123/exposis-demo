import type { Metadata } from "next";
import AuthForm from "@/app/auth-form";

export const metadata: Metadata = {
  title: "Connexion membre",
  description: "Connectez-vous à votre espace membre EXPOSIS."
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
