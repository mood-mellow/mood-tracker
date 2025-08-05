"use client";

import LoginForm from "~/components/loginForm";
import RegisterForm from "~/components/registerForm";
import { Amplify } from "aws-amplify";
import { ConfirmRegisterForm } from "~/components/confirmRegisterForm";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "~/components/ui/button";
import { signOut } from "aws-amplify/auth";
import { toast } from "sonner";

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
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  return (
    <main className="flex items-center justify-center">
      <RegisterForm />
      <LoginForm />
      <ConfirmRegisterForm />
      {authStatus === "authenticated" && (
        <Button
          onClick={async () => {
            try {
              await signOut();
              toast.success("Signed out successfully");
            } catch (error) {
              toast.error("Failed to sign out");
              console.error("Sign out error:", error);
            }
          }}
        >
          Sign out
        </Button>
      )}
    </main>
  );
}
