import "~/styles/globals.css";

import { type Metadata } from "next";
import { AuthProvider } from "~/components/authProvider";
import { QueryProvider } from "~/components/queryProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Mood Tracker",
  description: "A tool to chart your emotional state over time.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <QueryProvider>
        <AuthProvider>
          <body>{children}</body>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </QueryProvider>
    </html>
  );
}
