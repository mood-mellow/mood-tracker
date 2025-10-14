"use client";

import { signOut } from "aws-amplify/auth";
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
import React, { useEffect, useState } from "react";
import { ReviewChart } from "~/components/reviewChart";
import { CommonMoodsCard } from "~/components/commonMoods";
import { CommonActivitiesCard } from "~/components/commonActivities";

export default function DashboardPage() {
  const [isReady, setIsReady] = useState(false);

  // Preload the background image
  useEffect(() => {
    const img = new Image();
    img.src = "/bbblurry.svg";
    img.onload = () => setIsReady(true);
  }, []);

  return (
    <>
      <Navbar />
      <main
        className={`min-h-screen bg-cover bg-center bg-no-repeat p-4 transition-opacity duration-700 md:p-8 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: "url(/bbblurry.svg)" }}
      >
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
              <CardDescription>Your moods for this month</CardDescription>
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
