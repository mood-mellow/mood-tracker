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
import {
  useActivityTags,
  useCreateActivityTag,
  useUpdateActivityTag,
  getActivityColor,
  type ActivityTag,
  useDeleteActivityTag,
} from "~/hooks/activityTagHooks";

interface ActivityTagsPopoverProps {
  selectedTags?: ActivityTag[];
  onTagSelect?: (tag: ActivityTag) => void;
  onTagRemove?: (tagId: string) => void;
  showManageButton?: boolean;
}

export function ActivityTagsPopover({
  selectedTags = [],
  onTagSelect,
  onTagRemove,
  showManageButton = true,
}: ActivityTagsPopoverProps) {
  const { data: activityTags = [], isLoading, error } = useActivityTags();
  const createActivityMutation = useCreateActivityTag();
  const updateActivityMutation = useUpdateActivityTag();
  const deleteActivityMutation = useDeleteActivityTag();

  const [editingActivity, setEditingActivity] = useState<ActivityTag | null>(
    null,
  );
  const [newActivityName, setNewActivityName] = useState<string | null>(null);
  const [newActivityColor, setNewActivityColor] = useState("bg-blue-500");
  const [editName, setEditName] = useState("");

  const handleEdit = (activity: ActivityTag) => {
    setEditingActivity(activity);
    setEditName(activity.label);
  };

  const handleBack = () => {
    setEditingActivity(null);
    setEditName("");
    setNewActivityName(null);
    setNewActivityColor("bg-blue-500");
  };

  const handleCreating = () => {
    setNewActivityName("");
  };

  const handleSave = () => {
    if (editingActivity && editName.trim()) {
      updateActivityMutation.mutate(
        {
          id: editingActivity.id,
          data: { label: editName.trim() },
        },
        {
          onSuccess: () => {
            console.log("Updated activity tag");
            handleBack();
          },
          onError: (error) => {
            console.error("Error updating activity tag:", error);
          },
        },
      );
    }
  };

  const handleCreateSave = () => {
    if (newActivityName?.trim()) {
      createActivityMutation.mutate(
        {
          name: newActivityName.trim(),
          color: newActivityColor,
        },
        {
          onSuccess: (data) => {
            console.log("Created activity tag:", data);
            handleBack();
          },
          onError: (error) => {
            console.error("Error creating activity tag:", error);
          },
        },
      );
    }
  };
  const handleDelete = (activity: ActivityTag) => {
    if (
      window.confirm(`Are you sure you want to delete "${activity.label}"?`)
    ) {
      deleteActivityMutation.mutate(activity.id, {
        onSuccess: () => {
          console.log("Deleted activity tag:", activity.label);
        },
        onError: (error) => {
          console.error("Error deleting activity tag:", error);
        },
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Plus />
          Select Activities
        </Button>
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
                  <div className={`h-4 w-4 rounded-full bg-blue-500`} />
                  <span className="text-muted-foreground text-sm">Color</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activityName">Activity Name</Label>
                  <Input
                    id="activityName"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter activity name"
                    disabled={updateActivityMutation.isPending}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleBack}
                    disabled={updateActivityMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSave}
                    disabled={
                      !editName.trim() || updateActivityMutation.isPending
                    }
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {updateActivityMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </>
          ) : newActivityName !== null ? (
            // New Activity Screen
            <>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleBack}
                  disabled={createActivityMutation.isPending}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h4 className="leading-none font-medium">New Activity</h4>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`h-4 w-4 rounded-full ${newActivityColor}`} />
                  <span className="text-muted-foreground text-sm">Color</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newActivityName">Activity Name</Label>
                  <Input
                    id="newActivityName"
                    value={newActivityName}
                    onChange={(e) => setNewActivityName(e.target.value)}
                    placeholder="Enter activity name"
                    disabled={createActivityMutation.isPending}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleBack}
                    disabled={createActivityMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleCreateSave}
                    disabled={
                      !newActivityName?.trim() ||
                      createActivityMutation.isPending
                    }
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {createActivityMutation.isPending
                      ? "Creating..."
                      : "Create"}
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
                <div className="max-h-60 overflow-y-auto pr-2">
                  {isLoading ? (
                    <div className="text-muted-foreground py-4 text-center">
                      Loading activities...
                    </div>
                  ) : error ? (
                    <div className="py-4 text-center text-red-500">
                      Error loading activities
                    </div>
                  ) : (
                    <div className="grid gap-1">
                      {activityTags.map((activity, index) => (
                        <div
                          key={activity.id}
                          className="flex items-center gap-2"
                        >
                          <Button
                            variant="ghost"
                            className="flex flex-1 items-center justify-start gap-3 px-3 py-2 text-sm"
                            onClick={() => onTagSelect?.(activity)}
                          >
                            <div
                              className={`h-3 w-3 rounded-full ${getActivityColor(index)}`}
                            />
                            <span className="font-medium">
                              {activity.label}
                            </span>
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
                                handleDelete(activity);
                              }}
                              disabled={deleteActivityMutation.isPending}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {activityTags.length === 0 && (
                        <div className="text-muted-foreground py-4 text-center">
                          No activities yet. Create your first one!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Button
                  size={"sm"}
                  variant={"secondary"}
                  onClick={() => handleCreating()}
                >
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
