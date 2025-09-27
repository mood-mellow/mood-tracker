"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useMoodSummary, type MoodSummary } from "~/hooks/moodSummaryHooks";

export function CommonMoodsCard() {
  const { data, isPending, isError, error } = useMoodSummary();

  const MoodList = () => {
    if (isPending) return <div>Loading </div>;
    if (isError) return <div>Error</div>;
    return (
      <>
        {data.mostCommonMoods.map((mood, idx) => {
          const firstEntry = Object.entries(mood)[0];
          if (!firstEntry) return null; // guard against empty objects
          const [key, value] = firstEntry;
          return (
            <p key={idx}>
              {key}: {value}
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
          <CardTitle>Most common moods</CardTitle>
        </CardHeader>
        <CardContent>
          <MoodList />
        </CardContent>
      </Card>
    </>
  );
}
