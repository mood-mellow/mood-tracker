"use client";

import { signOut } from "aws-amplify/auth";
import { Button } from "~/components/ui/button";
import { redirect } from "next/navigation";
import TestApiCall from "~/components/test/testApiCall";
import { ActivityTagsPopover } from "~/components/activityTags/activityTagsPopover";
import MoodEntryForm from "~/components/moodEntryForm";

export default function DashboardPage() {
  return (
    <main className="flex items-center justify-center">
      <TestApiCall />
      <h1>Dashboard</h1>
      <ActivityTagsPopover />
      <Button
        onClick={async () => {
          console.log("test");
          await signOut();
          redirect("/");
        }}
      >
        Log Out
      </Button>
      <MoodEntryForm />
    </main>
  );
}
