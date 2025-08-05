"use client";

import { Toaster } from "sonner";
import LoginForm from "~/components/loginForm";
import RegisterForm from "~/components/registerForm";
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID!,
      identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID!,
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
        preferred_username: {
          required: true,
        },
      },
      allowGuestAccess: false,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
});

export default function AuthPage() {
  return (
    <main className="flex items-center justify-center">
      <RegisterForm />
      <LoginForm />
      <Toaster position="top-right" richColors />
    </main>
  );
}
