"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useMoodSummary, type MoodSummary } from "~/hooks/moodSummaryHooks";
import { moods } from "~/components/moodSelector";
import Image from "next/image";

const moodEmojiMap = new Map<string, string>();
moods.map((mood) => {
  moodEmojiMap.set(mood.value, mood.src);
});

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
          const [emotion, count] = firstEntry;

          const emojiImgSrc: string =
            moodEmojiMap.get(emotion) ?? "/emojis/unknown_face.svg";
          return (
            <p key={idx}>
              <Image src={emojiImgSrc} alt="" height={20} width={20} />: {count}
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
