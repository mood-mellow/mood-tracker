"use client";

import { signOut } from "aws-amplify/auth";
import { Button } from "~/components/ui/button";
import { redirect } from "next/navigation";
import TestApiCall from "~/components/test/testApiCall";
import { ActivityTagsPopover } from "~/components/activityTags/activityTagsPopover";
import MoodEntryForm from "~/components/moodEntryForm";
import { Navbar01 as Navbar } from "~/components/ui/shadcn-io/navbar-01";
import "~/styles/dashboard.css";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import React from "react";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="p-8">
        {/*<Button
          onClick={async () => {
            console.log("test");
            await signOut();
            redirect("/");
          }}
        >
          Log Out
        </Button>*/}

        <div className="dashboard-widgets-container gap-x-8 gap-y-6 md:p-12">
          <Card className="checkin-container">
            <CardHeader>
              <CardTitle>Check in today!</CardTitle>
              <CardDescription>How are you feeling?</CardDescription>
            </CardHeader>
          </Card>

          <Card className="suggestions-container">
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
              <CardDescription>
                AI generated tips based on your activity.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="friends-container">
            <CardHeader>
              <CardTitle>Friends</CardTitle>
            </CardHeader>
          </Card>

          <Card className="review-container">
            <CardHeader>
              <CardTitle>Review</CardTitle>
            </CardHeader>
          </Card>
          {/*<MoodEntryForm />*/}
        </div>
      </main>
    </>
  );
}
