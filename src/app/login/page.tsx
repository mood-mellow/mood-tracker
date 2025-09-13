"use client";

import LoginForm from "~/components/loginForm";
import RegisterForm from "~/components/registerForm";
import { ConfirmRegisterForm } from "~/components/confirmRegisterForm";

export default function AuthPage() {
  return (
    <main className="flex flex-col gap-10">
      <RegisterForm />
      {/*<LoginForm />*/}
      {/*<ConfirmRegisterForm />*/}
    </main>
  );
}
