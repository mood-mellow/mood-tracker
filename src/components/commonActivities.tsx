"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useMoodSummary } from "~/hooks/moodSummaryHooks";
import { Badge } from "./ui/badge";

export function CommonActivitiesCard() {
  const { data, isPending, isError, error } = useMoodSummary();

  const ActivityList = () => {
    if (isPending) return <div>Loading </div>;
    if (isError) return <div>Error</div>;
    return (
      <>
        {data.mostCommonActivities.map((activity, idx) => {
          const firstEntry = Object.entries(activity)[0];
          if (!firstEntry) return null; // guard against empty objects
          const [key] = firstEntry;
          return (
            <p key={idx}>
              <Badge variant="outline">{key}</Badge>
            </p>
          );
        })}
      </>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Top mood triggers (Activities)</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityList />
        </CardContent>
      </Card>
    </>
  );
}
