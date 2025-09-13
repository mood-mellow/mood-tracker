"use client";

import LoginForm from "~/components/loginForm";
import RegisterForm from "~/components/registerForm";
import { ConfirmRegisterForm } from "~/components/confirmRegisterForm";

export default function AuthPage() {
  return (
    <>
      <style jsx global>{`
        body {
          background-image: url("/bbblurry.svg");
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          min-height: 100vh;
        }
      `}</style>
      <main>
        <RegisterForm />
      </main>
    </>
  );
}
