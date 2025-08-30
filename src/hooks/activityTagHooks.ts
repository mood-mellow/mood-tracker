import { apiFetch, apiDelete } from "~/lib/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface ActivityTag {
  id: string;
  label: string;
}

export interface CreateActivityTagRequest {
  name: string;
  color: string;
}

export interface UpdateActivityTagRequest {
  label: string;
}

// API function to fetch all activity tags
export const fetchActivityTags = async (): Promise<ActivityTag[]> => {
  return await apiFetch<ActivityTag[]>("http://localhost:8080/activity-tags");
};

// API function to create activity tag
export const createActivityTag = async (
  data: CreateActivityTagRequest,
): Promise<ActivityTag> => {
  return await apiFetch<ActivityTag>("http://localhost:8080/activity-tags", {
    method: "POST",
    body: JSON.stringify({
      label: data.name,
    }),
  });
};

// API function to update activity tag
export const updateActivityTag = async (
  id: string,
  data: UpdateActivityTagRequest,
): Promise<ActivityTag> => {
  return await apiFetch<ActivityTag>(
    `http://localhost:8080/activity-tags/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
};

// API function to delete activity tag
export const deleteActivityTag = async (id: string): Promise<void> => {
  return await apiDelete(`http://localhost:8080/activity-tags/${id}`);
};

export const useActivityTags = () => {
  return useQuery({
    queryKey: ["activityTags"],
    queryFn: fetchActivityTags,
  });
};

export const useUpdateActivityTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateActivityTagRequest;
    }) => updateActivityTag(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["activityTags"] });
    },
  });
};

export const useCreateActivityTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createActivityTag,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["activityTags"] });
    },
  });
};

export const useDeleteActivityTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteActivityTag,
    onSuccess: async () => {
      // Invalidate and refetch the activity tags
      await queryClient.invalidateQueries({ queryKey: ["activityTags"] });
      console.log("Activity tag deleted and cache invalidated");
    },
    onError: (error) => {
      console.error("Error deleting activity tag:", error);
    },
  });
};

// Helper function to get a color for activity tags (since backend doesn't store colors)
export const getActivityColor = (index: number): string => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-yellow-500",
  ];
  return colors[index % colors.length] ?? "bg-gray-500";
};
