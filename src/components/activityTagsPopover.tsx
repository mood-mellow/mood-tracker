"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Plus, Edit2, Trash2, ArrowLeft, Save } from "lucide-react";
import { useState } from "react";

// Dummy activities data
const dummyActivities = [
  { id: 1, name: "Exercise", color: "bg-blue-500" },
  { id: 2, name: "Reading", color: "bg-green-500" },
  { id: 3, name: "Meditation", color: "bg-purple-500" },
  { id: 4, name: "Work", color: "bg-orange-500" },
  { id: 5, name: "Cooking", color: "bg-red-500" },
  { id: 6, name: "Social", color: "bg-pink-500" },
  { id: 7, name: "Music", color: "bg-indigo-500" },
  { id: 8, name: "Gaming", color: "bg-yellow-500" },
];

export function ActivityTagsPopover() {
  const [editingActivity, setEditingActivity] = useState<{
    id: number;
    name: string;
    color: string;
  } | null>(null);
  const [editName, setEditName] = useState("");

  const handleEdit = (activity: {
    id: number;
    name: string;
    color: string;
  }) => {
    setEditingActivity(activity);
    setEditName(activity.name);
  };

  const handleBack = () => {
    setEditingActivity(null);
    setEditName("");
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving activity:", { ...editingActivity, name: editName });
    handleBack();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          {editingActivity ? (
            // Edit Screen
            <>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h4 className="leading-none font-medium">Edit Activity</h4>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-4 w-4 rounded-full ${editingActivity.color}`}
                  />
                  <span className="text-muted-foreground text-sm">Color</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activityName">Activity Name</Label>
                  <Input
                    id="activityName"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter activity name"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleBack}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSave}
                    disabled={!editName.trim()}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>
            </>
          ) : (
            // Main Screen
            <>
              <div className="space-y-2">
                <h4 className="leading-none font-medium">Activities</h4>
                <p className="text-muted-foreground text-sm">
                  Apply or create activities for this mood entry.
                </p>
                {/* Activities List */}
                <div className="max-h-60 overflow-y-auto pr-2">
                  <div className="grid gap-1">
                    {dummyActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-2"
                      >
                        <Button
                          variant="ghost"
                          className="flex flex-1 items-center justify-start gap-3 px-3 py-2 text-sm"
                        >
                          <div
                            className={`h-3 w-3 rounded-full ${activity.color}`}
                          />
                          <span className="font-medium">{activity.name}</span>
                        </Button>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                            onClick={() => handleEdit(activity)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                            onClick={() => {
                              // Handle delete
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="maxHeight">Max. height</Label>
                  <Input
                    id="maxHeight"
                    defaultValue="none"
                    className="col-span-2 h-8"
                  />
                </div>
                <Button size={"sm"} variant={"secondary"}>
                  <Plus /> New Activity
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
