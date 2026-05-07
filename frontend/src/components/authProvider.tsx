"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { amplifyConfig } from "~/lib/amplifyConfig";

Amplify.configure(amplifyConfig, { ssr: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <Authenticator.Provider>{children}</Authenticator.Provider>;
}
