"use client";

import LoginForm from "~/components/loginForm";
import RegisterForm from "~/components/registerForm";
import { ConfirmRegisterForm } from "~/components/confirmRegisterForm";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "~/components/ui/button";
import { signOut } from "aws-amplify/auth";
import { toast } from "sonner";

export default function AuthPage() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  return (
    <main className="flex flex-col gap-10">
      <RegisterForm />
      <LoginForm />
      <ConfirmRegisterForm />
    </main>
  );
}
