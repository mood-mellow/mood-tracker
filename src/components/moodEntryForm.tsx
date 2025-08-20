"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "~/components/ui/select";
// import { moodEntryFormSchema } from "~/lib/validation-schemas";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const moodEntryFormSchema = z.object({
  mood: z.string().min(1, { message: "Please select a mood" }),
  journal: z
    .string()
    .min(1, { message: "Please write something in your journal" }),
  activity: z.string().min(1, { message: "Please select an activity" }),
});

const formSchema = moodEntryFormSchema;

// Mood options with emojis
const MOOD_OPTIONS = [
  { value: "very_happy", label: "Very Happy", emoji: "😄" },
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "sad", label: "Sad", emoji: "😢" },
  { value: "very_sad", label: "Very Sad", emoji: "😭" },
  { value: "angry", label: "Angry", emoji: "😠" },
  { value: "anxious", label: "Anxious", emoji: "😰" },
  { value: "excited", label: "Excited", emoji: "🤩" },
];

// Activity options (this could come from the backend ActivityTag repository)
const ACTIVITY_OPTIONS = [
  { value: "work", label: "Work" },
  { value: "exercise", label: "Exercise" },
  { value: "socializing", label: "Socializing" },
  { value: "family_time", label: "Family Time" },
  { value: "hobbies", label: "Hobbies" },
  { value: "relaxation", label: "Relaxation" },
  { value: "learning", label: "Learning" },
  { value: "travel", label: "Travel" },
  { value: "entertainment", label: "Entertainment" },
  { value: "chores", label: "Chores" },
  { value: "eating", label: "Eating" },
  { value: "sleep", label: "Sleep" },
];

async function createMoodEntry(values: z.infer<typeof formSchema>) {
  // This would typically call your backend API
  // For now, just simulate the API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Creating mood entry:", values);
  return { success: true, data: values };
}

export default function MoodEntryForm() {
  const [selectedMood, setSelectedMood] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: "",
      journal: "",
      activity: "",
    },
  });

  const moodEntryMutation = useMutation({
    mutationFn: createMoodEntry,
    onSuccess: (data) => {
      toast.success("Mood entry saved successfully!");
      console.log("Mood entry created:", data);
      // Reset form after successful submission
      form.reset();
      setSelectedMood("");
    },
    onError: (error) => {
      toast.error("Failed to save mood entry.", {
        description: error.message,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Mood entry form submit event triggered");
    moodEntryMutation.mutate(values);
  }

  return (
    <div className="flex h-full min-h-[50vh] w-full flex-col items-center justify-center px-4">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Add Mood Entry</CardTitle>
          <CardDescription>
            Record your current mood, what you&apos;ve been doing, and any
            thoughts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4">
                {/* Mood Selection with Emojis */}
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How are you feeling?</FormLabel>
                      <div className="space-y-3">
                        {/* Emoji Selection Grid */}
                        <div className="grid grid-cols-4 gap-2">
                          {MOOD_OPTIONS.map((mood) => (
                            <button
                              key={mood.value}
                              type="button"
                              onClick={() => {
                                field.onChange(mood.value);
                                setSelectedMood(mood.value);
                              }}
                              className={`hover:bg-accent flex flex-col items-center justify-center rounded-lg border-2 p-3 transition-all ${
                                field.value === mood.value
                                  ? "border-primary bg-primary/10"
                                  : "border-border"
                              }`}
                            >
                              <span className="text-2xl">{mood.emoji}</span>
                              <span className="mt-1 text-center text-xs">
                                {mood.label}
                              </span>
                            </button>
                          ))}
                        </div>
                        {selectedMood && (
                          <p className="text-muted-foreground text-sm">
                            Selected:{" "}
                            {
                              MOOD_OPTIONS.find((m) => m.value === selectedMood)
                                ?.label
                            }
                          </p>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Activity Selection */}
                <FormField
                  control={form.control}
                  name="activity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="activity">
                        What were you doing?
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an activity" />
                          </SelectTrigger>
                          <SelectContent>
                            {ACTIVITY_OPTIONS.map((activity) => (
                              <SelectItem
                                key={activity.value}
                                value={activity.value}
                              >
                                {activity.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Journal Textarea */}
                <FormField
                  control={form.control}
                  name="journal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="journal">
                        What&apos;s on your mind?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          id="journal"
                          placeholder="Write about your day, thoughts, or anything you'd like to remember..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={moodEntryMutation.isPending}
                  loading={moodEntryMutation.isPending}
                >
                  Save Mood Entry
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
