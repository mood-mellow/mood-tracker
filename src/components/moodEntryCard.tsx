import { Card, CardContent, CardTitle } from "./ui/card";

const localTimezoneId = Intl.DateTimeFormat().resolvedOptions().timeZone;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: localTimezoneId,
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: localTimezoneId,
});

export const MoodEntryCard = ({
  date,
  journalEntry,
}: {
  date: Date;
  journalEntry: string;
}) => {
  const entryDate = new Date(date);

  return (
    <Card className="px-4">
      <CardContent>
        <CardTitle>{dateFormatter.format(entryDate)}</CardTitle>
        <p>{timeFormatter.format(entryDate)}</p>
        <b>Note: </b>
        {journalEntry}
      </CardContent>
    </Card>
  );
};
