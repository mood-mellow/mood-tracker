"use client";

import { signOut } from "aws-amplify/auth";
import { Button } from "~/components/ui/button";
import { redirect } from "next/navigation";
// import TestApiCall from "~/components/test/testApiCall";
import { ActivityTagsPopover } from "~/components/activityTags/activityTagsPopover";
import MoodEntryForm from "~/components/moodEntryForm";
import { Navbar01 as Navbar } from "~/components/ui/shadcn-io/navbar-01";
import "~/styles/dashboard.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import React from "react";
import { ReviewChart } from "~/components/reviewChart";
import { CommonMoodsCard } from "~/components/commonMoods";
import { CommonActivitiesCard } from "~/components/commonActivities";

export default function DashboardPage() {
  const averageMoods = [
    { date: "2025-09-01", mood: 4 },
    { date: "2025-09-02", mood: 5 },
    { date: "2025-09-03", mood: 2 },
    // ...
  ];

  // Convert to Record<string, number>
  const moodsByDate = Object.fromEntries(
    averageMoods.map((m) => [m.date, m.mood]),
  );

  return (
    <>
      <Navbar />
      <main className="p-8">
        {/*<TestApiCall />*/}

        {/*
        <Button
          onClick={async () => {
            console.log("test");
            await signOut();
            redirect("/");
          }}
        >
          Log Out
        </Button> */}

        <MoodEntryForm />

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
              <CardDescription>Your moods the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-x-8">
              <ReviewChart />
              <CommonMoodsCard />
              <CommonActivitiesCard />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
