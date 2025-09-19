import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "~/lib/apiClient";

interface Friend {
  id: string;
  friendId: string;
  friendName: string;
}

interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
}

interface CreateFriendRequestBody {
  senderId: string;
  receiverId: string;
}

const fetchFriends = async (userId: string): Promise<Friend[]> => {
  return await apiFetch<Friend[]>(`http://localhost:8080/friends/${userId}`);
};

export const useFriends = (userId: string) => {
  return useQuery<Friend[], Error>({
    queryKey: ["friends", userId],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey; // queryKey = ["friends", userId]
      return fetchFriends(id as string);
    },
    enabled: !!userId,
  });
};

const createFriendRequest = async (
  body: CreateFriendRequestBody,
): Promise<FriendRequest> => {
  return await apiFetch<FriendRequest>(
    `http://localhost:8080/friends/request`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
};

export const useCreateFriendRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFriendRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["create-friend-request"],
      });
    },
  });
};
