"use client";

import { Authenticator } from "@aws-amplify/ui-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <Authenticator.Provider>{children}</Authenticator.Provider>;
}
