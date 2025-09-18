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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import React from "react";
import { ReviewChart } from "~/components/reviewChart";
import { CommonMoodsCard } from "~/components/commonMoods";
import { apiFetch } from "~/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

export default function DashboardPage() {
  const fetchMoodSummaryData = async () => {
    const response = await apiFetch("http://localhost:8080/mood-summary");
  };

  return (
    <>
      <Navbar />
      <main className="p-8">
        <TestApiCall />
        <Button
          onClick={async () => {
            console.log("test");
            await signOut();
            redirect("/");
          }}
        >
          Log Out
        </Button>

        <ReviewChart />

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
            <CardContent>
              <CommonMoodsCard />
            </CardContent>
          </Card>
          {/*<MoodEntryForm />*/}
        </div>
      </main>
    </>
  );
}
