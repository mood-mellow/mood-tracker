"use client";

import { signOut } from "aws-amplify/auth";
import { Button } from "~/components/ui/button";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  return (
    <main className="flex items-center justify-center">
      <h1>Dashboard</h1>
      <Button
        onClick={async () => {
          console.log("test");
          await signOut();
          redirect("/");
        }}
      >
        Log Out
      </Button>
    </main>
  );
}
