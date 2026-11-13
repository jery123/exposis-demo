import type { Metadata } from "next";
import AuthForm from "@/app/auth-form";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Rejoignez la communauté EXPOSIS en créant votre espace membre."
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
