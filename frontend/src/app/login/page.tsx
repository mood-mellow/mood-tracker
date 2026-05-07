"use client";

import LoginForm from "~/components/loginForm";
import RegisterForm from "~/components/registerForm";
import { ConfirmRegisterForm } from "~/components/confirmRegisterForm";

export default function AuthPage() {
  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/bbblurry.svg)" }}
    >
      <RegisterForm />
      <LoginForm />
    </main>
  );
}
