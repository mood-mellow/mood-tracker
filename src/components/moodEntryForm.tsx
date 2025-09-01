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
import { ActivityTagsPopover } from "~/components/activityTags/activityTagsPopover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { ColorPicker } from "./ui/color-picker";

export const moodEntryFormSchema = z.object({
  mood: z.string().min(1, { message: "Please select a mood" }),
  emoji: z.string().min(1, { message: "Please select an emoji" }),
  journal: z
    .string()
    .min(1, { message: "Please write something in your journal" }),
  activity: z.string().min(1, { message: "Please select an activity" }),
  color: z.string().min(1, { message: "Please select a color" }),
});

const formSchema = moodEntryFormSchema;

// Mood options with emojis
const MOOD_OPTIONS = [
  { value: "very_happy", label: "Very Happy" },
  { value: "happy", label: "Happy" },
  { value: "neutral", label: "Neutral" },
  { value: "sad", label: "Sad" },
  { value: "very_sad", label: "Very Sad" },
  { value: "angry", label: "Angry" },
  { value: "anxious", label: "Anxious" },
  { value: "excited", label: "Excited" },
];

const EMOJI_OPTIONS = ["😄", "😊", "😐", "😢", "😭", "😠", "😰", "🤩"];

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
      emoji: "",
      journal: "",
      activity: "",
      color: "#51976b",
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
      const newTags = [...selectedActivityTags, tag];
      setSelectedActivityTags(newTags);
      form.setValue("activity", newTags.map((t) => t.label).join(", "));
    }
  };

  const handleActivityTagRemove = (tagId: string) => {
    const newTags = selectedActivityTags.filter((tag) => tag.id !== tagId);
    setSelectedActivityTags(newTags);
    // Update the form field with the remaining activity tags
    form.setValue("activity", newTags.map((t) => t.label).join(", "));
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
              {/* Mood Selection */}
              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How are you feeling?</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedMood(value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your mood" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOOD_OPTIONS.map((mood) => (
                            <SelectItem key={mood.value} value={mood.value}>
                              {mood.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Emoji Selection */}
              <FormField
                control={form.control}
                name="emoji"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pick an emoji</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your emoji" />
                        </SelectTrigger>
                        <SelectContent>
                          {EMOJI_OPTIONS.map((emoji) => (
                            <SelectItem key={emoji} value={emoji}>
                              {emoji}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Color Selection */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pick a color that represents your mood
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <ColorPicker
                          onChange={(v) => {
                            if (typeof v === "string") {
                              field.onChange(v);
                            }
                          }}
                          value={field.value}
                        />
                        {field.value && (
                          <p className="text-muted-foreground text-sm">
                            {field.value}
                          </p>
                        )}
                      </div>
                    </FormControl>
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
                      <FormLabel>What were you doing?</FormLabel>
                      <ActivityTagsPopover
                        selectedTags={selectedActivityTags}
                        onTagSelect={handleActivityTagSelect}
                        onTagRemove={handleActivityTagRemove}
                      />
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
                              className="flex items-center gap-1"
                            >
                              {tag.label}
                              <button
                                type="button"
                                onClick={() => handleActivityTagRemove(tag.id)}
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
                    <FormLabel>What&apos;s on your mind?</FormLabel>
                    <FormControl>
                      <Textarea
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
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
