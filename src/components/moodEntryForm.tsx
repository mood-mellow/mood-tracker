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
import { Badge } from "~/components/ui/badge";
// import { moodEntryFormSchema } from "~/lib/validation-schemas";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { type ActivityTag, useActivityTags } from "~/hooks/activityTagHooks";
import { X } from "lucide-react";
import { ActivityTagsPopover } from "./activityTags/activityTagsPopover";

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

async function createMoodEntry(values: z.infer<typeof formSchema>) {
  // This would typically call your backend API
  // For now, just simulate the API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Creating mood entry:", values);
  return { success: true, data: values };
}

export default function MoodEntryForm() {
  const { data: activityTags = [] } = useActivityTags();
  const [selectedActivityTags, setSelectedActivityTags] = useState<
    ActivityTag[]
  >([]);
  const [selectedMood, setSelectedMood] = useState<string>("");

  // Sync selected tags with updated data from server
  // incase the user wants to update a tag
  useEffect(() => {
    if (selectedActivityTags.length > 0 && activityTags.length > 0) {
      setSelectedActivityTags((prevSelected) =>
        prevSelected
          .map((selectedTag) => {
            const updatedTag = activityTags.find(
              (tag) => tag.id === selectedTag.id,
            );
            return updatedTag ?? selectedTag; // Use updated data if available, fallback to original
          })
          .filter((tag) =>
            // Remove tags that no longer exist
            activityTags.some((serverTag) => serverTag.id === tag.id),
          ),
      );
    }
  }, [activityTags, selectedActivityTags.length]);

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
      setSelectedActivityTags([]);
    },
    onError: (error) => {
      toast.error("Failed to save mood entry.", {
        description: error.message,
      });
    },
  });

  const handleActivityTagSelect = (tag: ActivityTag) => {
    if (!selectedActivityTags.find((t) => t.id === tag.id)) {
      setSelectedActivityTags((prev) => [...prev, tag]);
    }
  };

  const handleActivityTagRemove = (tagId: string) => {
    setSelectedActivityTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Mood entry form submit event triggered");
    console.log("Selected activity tags:", selectedActivityTags);
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
                      <div className="flex items-center justify-between">
                        <FormLabel htmlFor="activity">
                          What were you doing?
                        </FormLabel>
                        <div className="flex gap-2">
                          <ActivityTagsPopover
                            selectedTags={selectedActivityTags}
                            onTagSelect={handleActivityTagSelect}
                            onTagRemove={handleActivityTagRemove}
                          />
                        </div>
                      </div>

                      {/* Selected Activity Tags */}
                      {selectedActivityTags.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-muted-foreground text-sm">
                            Selected activities:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedActivityTags.map((tag) => (
                              <Badge
                                key={tag.id}
                                variant="outline"
                                className={`flex items-center gap-1`}
                              >
                                {tag.label}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleActivityTagRemove(tag.id)
                                  }
                                  className="hover:bg-destructive/20 ml-1 rounded-full p-1"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

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
